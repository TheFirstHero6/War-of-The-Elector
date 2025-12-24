import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("API: Starting user-data fetch...");

    // Get the authenticated user from Clerk
    const clerkUser = await currentUser();
    console.log("API: Clerk user:", clerkUser ? "Found" : "Not found");

    // If no user is authenticated, return 401
    if (!clerkUser) {
      console.log("API: No clerk user, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in our database using their Clerk ID
    console.log("API: Looking up user with clerkUserId:", clerkUser.id);
    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });
    console.log("API: Database user found:", user ? "Yes" : "No");

    // If user doesn't exist in our database, return 404
    if (!user) {
      console.log("API: User not found in database, returning 404");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get realmId from query parameters
    const { searchParams } = new URL(request.url);
    const realmId = searchParams.get("realmId");

    if (!realmId) {
      return NextResponse.json(
        { error: "realmId is required" },
        { status: 400 }
      );
    }

    // Verify user is a member of this realm
    const realm = await prisma.realm.findFirst({
      where: {
        id: realmId,
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
      },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found or access denied" },
        { status: 403 }
      );
    }

    // Get user's resources in this realm
    const userResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: user.id,
        },
      },
    });

    // Get all users who are members of this realm
    const realmMembers = await prisma.realmMember.findMany({
      where: { realmId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    // Also include the owner
    const owner = await prisma.user.findUnique({
      where: { id: realm.ownerId },
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
    });

    // Combine owner and members, deduplicate
    const allUsers = [
      ...(owner ? [owner] : []),
      ...realmMembers.map((rm) => rm.user).filter((u) => u.id !== realm.ownerId),
    ];

    // Get user's role in this realm
    const membership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: user.id,
        },
      },
    });

    const userRole = realm.ownerId === user.id ? "OWNER" : (membership?.role || "BASIC");

    console.log("API: User from database:", {
      name: user.name,
      email: user.email,
      role: userRole,
    });

    // Prepare user image URL (fallback to default if not available)
    const userImageUrl = clerkUser.imageUrl
      ? clerkUser.imageUrl
      : "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yc1lIekdxbW9QWnAxSE13SmZ0Q3FRTnk4bnciLCJyaWQiOiJ1c2VyXzJ0VnB1ajdGRFA4cEhWVzZ3cGFBd0RVMENNcyIsImluaXRpYWxzIjoiSCJ9";

    // Prepare resources (default to 0 if not available, handle null values)
    const userResources = userResource
      ? {
          wood: userResource.wood || 0,
          stone: userResource.stone || 0,
          food: userResource.food || 0,
          currency: userResource.currency || 0.0,
          metal: userResource.metal || 0,
          livestock: userResource.livestock || 0,
        }
      : {
          wood: 0,
          stone: 0,
          food: 0,
          currency: 0.0,
          metal: 0,
          livestock: 0,
        };

    // Return all user data in one response
    const responseData = {
      // User profile data
      userId: user.id,
      userpic: userImageUrl,
      username: user.name,
      role: userRole,

      // User resources
      resources: userResources,

      // All users for the user list
      allUsers: allUsers,
    };

    console.log("API: Returning response data:", {
      username: responseData.username,
      role: responseData.role,
      resourcesCount: Object.keys(responseData.resources).length,
      allUsersCount: responseData.allUsers.length,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
