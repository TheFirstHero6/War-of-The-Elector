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
    });

    if (!offer) {
      return NextResponse.json(
        { error: "Trade offer not found" },
        { status: 404 }
      );
    }

    if (offer.creatorId !== user.id) {
      return NextResponse.json(
        { error: "You can only disband your own trade offers" },
        { status: 403 }
      );
    }

    await prisma.tradeOffer.delete({
      where: { id: offerId },
    });

    return NextResponse.json({
      success: true,
      message: "Trade offer disbanded successfully",
    });
  } catch (error) {
    console.error("Error disbanding trade offer:", error);
    return NextResponse.json(
      { error: "Failed to disband trade offer" },
      { status: 500 }
    );
  }
}

