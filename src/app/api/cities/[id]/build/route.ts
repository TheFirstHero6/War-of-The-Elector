import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { MAX_BUILDINGS_PER_CITY } from "@/app/lib/game-config";

const BUILDING_INDEX = [
  {
    name: "Sawmill",
    rarity: "Common",
    cost: { currency: 50, wood: 20, stone: 10, metal: 0, food: 0, livestock: 0 },
  },
  {
    name: "Quarry",
    rarity: "Common",
    cost: { currency: 50, wood: 20, stone: 0, metal: 0, food: 0, livestock: 0 },
  },
  {
    name: "Forge",
    rarity: "Common",
    cost: {
      currency: 150,
      wood: 30,
      stone: 30,
      metal: 0,
      food: 0,
      livestock: 0,
    },
  },
  {
    name: "Farm",
    rarity: "Common",
    cost: { currency: 50, wood: 20, stone: 0, metal: 0, food: 0, livestock: 0 },
  },
  {
    name: "Market",
    rarity: "Rare",
    cost: {
      currency: 50,
      wood: 20,
      stone: 20,
      metal: 0,
      food: 10,
      livestock: 0,
    },
  },
  {
    name: "Infantry Barracks",
    rarity: "Common",
    cost: {
      currency: 50,
      wood: 20,
      stone: 20,
      metal: 10,
      food: 10,
      livestock: 0,
    },
  },
  {
    name: "Ranged Barracks",
    rarity: "Common",
    cost: {
      currency: 50,
      wood: 20,
      stone: 20,
      metal: 0,
      food: 10,
      livestock: 0,
    },
  },
  {
    name: "Pastures",
    rarity: "Common",
    cost: {
      currency: 50,
      wood: 20,
      stone: 0,
      metal: 0,
      food: 10,
      livestock: 0,
    },
  },
  {
    name: "Cavalry Barracks",
    rarity: "Common",
    cost: {
      currency: 150,
      wood: 30,
      stone: 20,
      metal: 15,
      food: 10,
      livestock: 10,
    },
  },
];

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      include: { resources: true },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const { name, rarity } = await request.json();

    // Find the building template
    const buildingTemplate = BUILDING_INDEX.find(
      (b) => b.name === name && b.rarity === rarity
    );
    if (!buildingTemplate) {
      return NextResponse.json(
        { error: "Building template not found" },
        { status: 400 }
      );
    }

    // Check if user owns the city and get current building count
    const { id } = await context.params;
    const city = await prisma.city.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
      include: {
        buildings: true,
      },
    });

    if (!city) {
      return new Response("City not found", { status: 404 });
    }

    // Check building limits - all cities can have exactly 4 buildings
    const currentBuildingCount = city.buildings.length;

    if (currentBuildingCount >= MAX_BUILDINGS_PER_CITY) {
      return NextResponse.json(
        {
          error: `City has reached its maximum capacity of ${MAX_BUILDINGS_PER_CITY} buildings. All cities can have exactly 4 buildings.`,
        },
        { status: 400 }
      );
    }

    // Get user's resources in this realm
    if (!city.realmId) {
      return NextResponse.json(
        { error: "City is not in a realm" },
        { status: 400 }
      );
    }
    
    const userResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId: city.realmId,
          userId: user.id,
        },
      },
    });
    
    if (!userResource) {
      return NextResponse.json(
        { error: "User has no resources in this realm" },
        { status: 400 }
      );
    }
    
    const resources = userResource;

    const cost = buildingTemplate.cost;
    if (
      resources.currency < cost.currency ||
      resources.wood < cost.wood ||
      resources.stone < cost.stone ||
      resources.metal < cost.metal ||
      resources.food < cost.food ||
      resources.livestock < cost.livestock
    ) {
      return NextResponse.json(
        { error: `You lack the resources to build a ${name}.` },
        { status: 400 }
      );
    }

    // Execute the transaction
    await prisma.$transaction(async (tx) => {
      // Deduct resources (using composite unique key)
      await tx.resource.update({
        where: {
          realmId_userId: {
            realmId: city.realmId,
            userId: user.id,
          },
        },
        data: {
          currency: { decrement: cost.currency },
          wood: { decrement: cost.wood },
          stone: { decrement: cost.stone },
          metal: { decrement: cost.metal },
          food: { decrement: cost.food },
          livestock: { decrement: cost.livestock },
        },
      });

      // Create the building
      await tx.building.create({
        data: {
          name: buildingTemplate.name,
          rarity: buildingTemplate.rarity,
          cityId: city.id,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `${name} successfully built in ${city.name}!`,
    });
  } catch (error) {
    console.error("Error building structure:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
