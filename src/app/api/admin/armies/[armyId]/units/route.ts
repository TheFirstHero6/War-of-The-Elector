import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

async function requireRealmAdmin(realmId: string) {
  const clerkUser = await currentUser();
  if (!clerkUser) return { error: new Response("Unauthorized", { status: 401 }) };
  const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
  if (!user) return { error: new Response("User not found", { status: 404 }) };
  
  if (!realmId) {
    return { error: new Response("realmId is required", { status: 400 }) };
  }
  
  // Verify realm exists and user is admin/owner of this realm
  const realm = await prisma.realm.findFirst({
    where: {
      id: realmId,
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id, role: { in: ["ADMIN", "OWNER"] } } } },
      ],
    },
  });
  
  if (!realm) {
    return { error: new Response("Realm not found or you don't have admin access", { status: 403 }) };
  }
  
  return { admin: user, realmId } as const;
}

// POST: add units bypassing resource/cap { unitType, quantity, realmId }
export async function POST(request: Request, context: { params: Promise<{ armyId: string }> }) {
  try {
    const { armyId } = await context.params;
    const body = await request.json();
    const { realmId, unitType, quantity } = body;
    
    if (!realmId) {
      return NextResponse.json({ error: "realmId is required" }, { status: 400 });
    }
    
    const gate = await requireRealmAdmin(realmId);
    if ("error" in gate) return gate.error;
    if (!armyId || typeof armyId !== "string") {
      return NextResponse.json({ error: "Missing armyId in route" }, { status: 400 });
    }
    if (!unitType || !Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    
    const existing = await prisma.armyUnit.findFirst({ 
      where: { 
        armyId, 
        unitType,
        tier: 2
      } 
    });
    const unit = existing
      ? await prisma.armyUnit.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } })
      : await prisma.armyUnit.create({ data: { armyId, unitType, quantity, tier: 2 } });
    return new Response(JSON.stringify({ success: true, unit }), { status: 200 });
  } catch (error: any) {
    console.error("Admin add units error", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: remove units bypassing checks { unitType, quantity, realmId }
export async function DELETE(request: Request, context: { params: Promise<{ armyId: string }> }) {
  try {
    const { armyId } = await context.params;
    const body = await request.json();
    const { realmId, unitType, quantity } = body;
    
    if (!realmId) {
      return NextResponse.json({ error: "realmId is required" }, { status: 400 });
    }
    
    const gate = await requireRealmAdmin(realmId);
    if ("error" in gate) return gate.error;
    if (!armyId || typeof armyId !== "string") {
      return NextResponse.json({ error: "Missing armyId in route" }, { status: 400 });
    }
    if (!unitType || !Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    
    const existing = await prisma.armyUnit.findFirst({ where: { armyId, unitType } });
    if (!existing) return new Response("Not Found", { status: 404 });
    const newQty = Math.max(0, existing.quantity - quantity);
    if (newQty === 0) {
      await prisma.armyUnit.delete({ where: { id: existing.id } });
    } else {
      await prisma.armyUnit.update({ where: { id: existing.id }, data: { quantity: newQty } });
    }
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("Admin remove units error", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

