import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { UNIT_COSTS, POPULATION_UNIT_CAP_BY_TIER } from "@/app/lib/game-config";
import { NextResponse } from "next/server";

function sumResources(items: Array<Partial<Record<keyof typeof UNIT_COSTS[keyof typeof UNIT_COSTS], number>>>) {
  const totals: any = { currency: 0, wood: 0, stone: 0, metal: 0, food: 0, livestock: 0 };
  for (const item of items) {
    for (const key of Object.keys(totals)) {
      totals[key] += (item as any)[key] || 0;
    }
  }
  return totals;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ armyId: string }> }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new Response("Unauthorized", { status: 401 });
    const { armyId } = await context.params;
    if (!armyId || typeof armyId !== "string") {
      return NextResponse.json({ error: "Missing armyId in route" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { unitType, quantity } = await request.json();
    if (!unitType || typeof unitType !== "string" || !Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Invalid payload: provide unitType (string) and quantity (>0)" }, { status: 400 });
    }
    const costPer = (UNIT_COSTS as any)[unitType];
    if (!costPer) return NextResponse.json({ error: `Unknown unit type: ${unitType}` }, { status: 400 });

    // Ownership check and get realmId
    const army = await prisma.army.findUnique({ where: { id: armyId } });
    if (!army || army.ownerId !== user.id) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    
    if (!army.realmId) {
      return NextResponse.json({ error: "Army is not in a realm" }, { status: 400 });
    }
    
    // Get user's resources in this realm
    const userResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId: army.realmId,
          userId: user.id,
        },
      },
    });
    
    if (!userResource) {
      return NextResponse.json({ error: "Resource record not found for this realm" }, { status: 404 });
    }
    
    // Get user's cities in this realm
    const userCities = await prisma.city.findMany({
      where: { ownerId: user.id, realmId: army.realmId },
    });

    // Population cap check
    const cap = userCities.reduce((acc, c) => {
      const capForTier = (POPULATION_UNIT_CAP_BY_TIER as any)[c.upgradeTier] || 0;
      return acc + capForTier;
    }, 0);
    const currentUnits = await prisma.armyUnit.aggregate({
      _sum: { quantity: true },
      where: { army: { ownerId: user.id, realmId: army.realmId } },
    });
    const totalUnits = currentUnits._sum.quantity || 0;
    if (totalUnits + quantity > cap) {
      return NextResponse.json({ error: "Population cap exceeded" }, { status: 400 });
    }

    // Building requirement check
    // Get all buildings from user's cities in this realm
    const userCitiesWithBuildings = await prisma.city.findMany({
      where: { ownerId: user.id, realmId: army.realmId },
      include: { buildings: true },
    });
    const allBuildings = userCitiesWithBuildings.flatMap(city => city.buildings.map(b => b.name));

    // Define building requirements for each unit type
    const BUILDING_REQUIREMENTS: Record<string, string[]> = {
      "Pike Men": ["Infantry Barracks"],
      "Swordsmen": ["Infantry Barracks"],
      "Matchlocks": ["Ranged Barracks"],
      "Flintlocks": ["Ranged Barracks"],
      "Light Calvary": ["Cavalry Barracks"],
      "Dragons": ["Cavalry Barracks"], // Note: Unit type is "Dragons" in UNIT_COSTS
      "Heavy Calvary": ["Cavalry Barracks"],
      "Banner Guard": ["Cavalry Barracks"],
    };

    const requiredBuildings = BUILDING_REQUIREMENTS[unitType];
    if (requiredBuildings) {
      const hasRequiredBuilding = requiredBuildings.some(buildingName => 
        allBuildings.includes(buildingName)
      );
      if (!hasRequiredBuilding) {
        return NextResponse.json({ 
          error: `You need ${requiredBuildings.join(" or ")} to recruit ${unitType}` 
        }, { status: 400 });
      }
    }

    // Resource check
    const totalCost = Object.fromEntries(
      Object.entries(costPer).map(([k, v]) => [k, (v as number) * quantity])
    ) as any;
    const r = userResource;
    if (
      r.currency < totalCost.currency ||
      r.wood < totalCost.wood ||
      r.stone < totalCost.stone ||
      r.metal < totalCost.metal ||
      r.food < totalCost.food ||
      r.livestock < totalCost.livestock
    ) {
      return NextResponse.json({ error: "Insufficient resources" }, { status: 400 });
    }

    // Apply changes transactionally
    const result = await prisma.$transaction(async (tx) => {
      // Find existing unit with same type and tier 2 (default tier for new units)
      const existing = await tx.armyUnit.findFirst({ 
        where: { 
          armyId: army.id, 
          unitType,
          tier: 2
        } 
      });
      const unitRow = existing
        ? await tx.armyUnit.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } })
        : await tx.armyUnit.create({ data: { armyId: army.id, unitType, quantity, tier: 2 } });

      await tx.resource.update({
        where: {
          realmId_userId: {
            realmId: army.realmId,
            userId: user.id,
          },
        },
        data: {
          currency: r.currency - totalCost.currency,
          wood: r.wood - totalCost.wood,
          stone: r.stone - totalCost.stone,
          metal: r.metal - totalCost.metal,
          food: r.food - totalCost.food,
          livestock: r.livestock - totalCost.livestock,
        },
      });

      return unitRow;
    });

    return NextResponse.json({ success: true, unit: result });
  } catch (error: any) {
    console.error("Error adding units", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: remove units of a type from an army (no refunds)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ armyId: string }> }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new Response("Unauthorized", { status: 401 });
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
    if (!user) return new Response("Forbidden", { status: 403 });
    const { armyId } = await context.params;
    if (!armyId || typeof armyId !== "string") {
      return NextResponse.json({ error: "Missing armyId in route" }, { status: 400 });
    }

    const { unitType, quantity } = await request.json();
    if (!unitType || !Number.isInteger(quantity) || quantity <= 0) {
      return new Response("Invalid payload", { status: 400 });
    }

    const army = await prisma.army.findUnique({ where: { id: armyId } });
    if (!army || army.ownerId !== user.id) return new Response("Not Found", { status: 404 });

    const existing = await prisma.armyUnit.findFirst({ where: { armyId: army.id, unitType } });
    if (!existing) return new Response("Not Found", { status: 404 });
    const newQty = Math.max(0, existing.quantity - quantity);
    if (newQty === 0) {
      await prisma.armyUnit.delete({ where: { id: existing.id } });
    } else {
      await prisma.armyUnit.update({ where: { id: existing.id }, data: { quantity: newQty } });
    }
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("Error removing units", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

