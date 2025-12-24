import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { isValidResourceType } from "@/app/lib/resource-types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const realmId = searchParams.get("realmId");

    if (!realmId) {
      return NextResponse.json(
        { error: "realmId is required" },
        { status: 400 }
      );
    }

    const offers = await prisma.tradeOffer.findMany({
      where: {
        realmId,
        isActive: true,
        usesRemaining: { gt: 0 },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ offers });
  } catch (error) {
    console.error("Error fetching trade offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch trade offers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const {
      realmId,
      givingResource,
      givingAmount,
      receivingResource,
      receivingAmount,
      maxUses,
    } = body;

    if (!realmId) {
      return NextResponse.json(
        { error: "realmId is required" },
        { status: 400 }
      );
    }

    if (!isValidResourceType(givingResource) || !isValidResourceType(receivingResource)) {
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    if (givingResource === receivingResource) {
      return NextResponse.json(
        { error: "Cannot offer and request the same resource" },
        { status: 400 }
      );
    }

    if (givingAmount <= 0 || receivingAmount <= 0) {
      return NextResponse.json(
        { error: "Amounts must be positive" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(maxUses) || maxUses < 1) {
      return NextResponse.json(
        { error: "maxUses must be an integer >= 1" },
        { status: 400 }
      );
    }

    const realm = await prisma.realm.findUnique({
      where: { id: realmId },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found" },
        { status: 404 }
      );
    }

    const isOwner = realm.ownerId === user.id;
    const membership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: user.id,
        },
      },
    });

    if (!isOwner && !membership) {
      return NextResponse.json(
        { error: "You must be a member of this realm to create trade offers" },
        { status: 403 }
      );
    }

    const userResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId,
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

    const totalNeeded = givingAmount * maxUses;
    const currentAmount =
      givingResource === "currency"
        ? userResource.currency
        : userResource[givingResource as keyof typeof userResource];

    if (typeof currentAmount === "number" && currentAmount < totalNeeded) {
      return NextResponse.json(
        {
          error: `Insufficient ${givingResource}. You need ${totalNeeded} but only have ${currentAmount}`,
        },
        { status: 400 }
      );
    }

    const offer = await prisma.tradeOffer.create({
      data: {
        creatorId: user.id,
        realmId,
        givingResource: givingResource as any,
        givingAmount,
        receivingResource: receivingResource as any,
        receivingAmount,
        maxUses,
        usesRemaining: maxUses,
        isActive: true,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ offer });
  } catch (error) {
    console.error("Error creating trade offer:", error);
    return NextResponse.json(
      { error: "Failed to create trade offer" },
      { status: 500 }
    );
  }
}

