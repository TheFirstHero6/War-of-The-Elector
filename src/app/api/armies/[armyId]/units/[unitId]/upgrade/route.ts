import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { UNIT_UPGRADE_COST } from "@/app/lib/game-config";

export async function POST(
  request: Request,
  context: { params: Promise<{ armyId: string; unitId: string }> }
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { armyId, unitId } = await context.params;

    const unit = await prisma.armyUnit.findFirst({
      where: {
        id: unitId,
        army: {
          id: armyId,
          ownerId: user.id,
        },
      },
      include: {
        army: true,
      },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    if (!unit.army.realmId) {
      return NextResponse.json(
        { error: "Army is not in a realm" },
        { status: 400 }
      );
    }

    const currentTier = unit.tier ?? 2;
    
    if (currentTier >= 5) {
      return NextResponse.json(
        { error: "Unit is already at maximum tier (5)" },
        { status: 400 }
      );
    }

    const userResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId: unit.army.realmId,
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

    if (userResource.currency < UNIT_UPGRADE_COST) {
      return NextResponse.json(
        {
          error: `You need ${UNIT_UPGRADE_COST} currency to upgrade this unit. You have ${userResource.currency.toFixed(2)}.`,
        },
        { status: 400 }
      );
    }

    const nextTier = currentTier + 1;

    await prisma.$transaction(async (tx) => {
      await tx.resource.update({
        where: {
          realmId_userId: {
            realmId: unit.army.realmId,
            userId: user.id,
          },
        },
        data: {
          currency: { decrement: UNIT_UPGRADE_COST },
        },
      });

      await tx.armyUnit.update({
        where: { id: unit.id },
        data: { tier: nextTier },
      });
    });

    return NextResponse.json({
      success: true,
      message: `${unit.unitType} has been upgraded to tier ${nextTier}!`,
    });
  } catch (error) {
    console.error("Error upgrading unit:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

