import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ offerId: string }> }
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { offerId } = await context.params;

    const offer = await prisma.tradeOffer.findUnique({
      where: { id: offerId },
      include: {
        creator: true,
        realm: true,
      },
    });

    if (!offer) {
      return NextResponse.json(
        { error: "Trade offer not found" },
        { status: 404 }
      );
    }

    if (!offer.isActive) {
      return NextResponse.json(
        { error: "This trade offer has been retracted" },
        { status: 400 }
      );
    }

    if (offer.usesRemaining <= 0) {
      return NextResponse.json(
        { error: "This trade offer has expired" },
        { status: 400 }
      );
    }

    if (offer.creatorId === user.id) {
      return NextResponse.json(
        { error: "You cannot accept your own trade offer" },
        { status: 400 }
      );
    }

    const isOwner = offer.realm.ownerId === user.id;
    const membership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId: offer.realmId,
          userId: user.id,
        },
      },
    });

    if (!isOwner && !membership) {
      return NextResponse.json(
        { error: "You must be a member of this realm to accept trade offers" },
        { status: 403 }
      );
    }

    const acceptorResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId: offer.realmId,
          userId: user.id,
        },
      },
    });

    if (!acceptorResource) {
      return NextResponse.json(
        { error: "You have no resources in this realm" },
        { status: 400 }
      );
    }

    const creatorResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId: offer.realmId,
          userId: offer.creatorId,
        },
      },
    });

    if (!creatorResource) {
      return NextResponse.json(
        { error: "Creator has no resources in this realm" },
        { status: 400 }
      );
    }

    const receivingResourceLower = offer.receivingResource.toLowerCase();
    const acceptorReceivingAmount =
      receivingResourceLower === "currency"
        ? acceptorResource.currency
        : acceptorResource[receivingResourceLower as keyof typeof acceptorResource];

    if (
      typeof acceptorReceivingAmount === "number" &&
      acceptorReceivingAmount < offer.receivingAmount
    ) {
      return NextResponse.json(
        {
          error: `Insufficient ${offer.receivingResource}. You need ${offer.receivingAmount} but only have ${acceptorReceivingAmount}`,
        },
        { status: 400 }
      );
    }

    const givingResourceLower = offer.givingResource.toLowerCase();
    const creatorGivingAmount =
      givingResourceLower === "currency"
        ? creatorResource.currency
        : creatorResource[givingResourceLower as keyof typeof creatorResource];

    if (
      typeof creatorGivingAmount === "number" &&
      creatorGivingAmount < offer.givingAmount
    ) {
      return NextResponse.json(
        {
          error: `Creator has insufficient ${offer.givingResource}. They need ${offer.givingAmount} but only have ${creatorGivingAmount}`,
        },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const newUsesRemaining = offer.usesRemaining - 1;

      if (newUsesRemaining <= 0) {
        await tx.tradeOffer.update({
          where: { id: offerId },
          data: {
            usesRemaining: 0,
            isActive: false,
          },
        });
      } else {
        await tx.tradeOffer.update({
          where: { id: offerId },
          data: {
            usesRemaining: newUsesRemaining,
          },
        });
      }

      const acceptorUpdateData: any = {};
      const creatorUpdateData: any = {};

      const receivingResourceLower = offer.receivingResource.toLowerCase();
      const givingResourceLower = offer.givingResource.toLowerCase();

      if (receivingResourceLower === "currency") {
        acceptorUpdateData.currency = { decrement: offer.receivingAmount };
      } else {
        acceptorUpdateData[receivingResourceLower] = {
          decrement: Math.floor(offer.receivingAmount),
        };
      }

      if (givingResourceLower === "currency") {
        acceptorUpdateData.currency = { increment: offer.givingAmount };
      } else {
        acceptorUpdateData[givingResourceLower] = {
          increment: Math.floor(offer.givingAmount),
        };
      }

      if (givingResourceLower === "currency") {
        creatorUpdateData.currency = { decrement: offer.givingAmount };
      } else {
        creatorUpdateData[givingResourceLower] = {
          decrement: Math.floor(offer.givingAmount),
        };
      }

      if (receivingResourceLower === "currency") {
        creatorUpdateData.currency = { increment: offer.receivingAmount };
      } else {
        creatorUpdateData[receivingResourceLower] = {
          increment: Math.floor(offer.receivingAmount),
        };
      }

      await tx.resource.update({
        where: {
          realmId_userId: {
            realmId: offer.realmId,
            userId: user.id,
          },
        },
        data: acceptorUpdateData,
      });

      await tx.resource.update({
        where: {
          realmId_userId: {
            realmId: offer.realmId,
            userId: offer.creatorId,
          },
        },
        data: creatorUpdateData,
      });
    });

    return NextResponse.json({
      success: true,
      message: "Trade completed successfully",
    });
  } catch (error) {
    console.error("Error accepting trade offer:", error);
    return NextResponse.json(
      { error: "Failed to accept trade offer" },
      { status: 500 }
    );
  }
}

