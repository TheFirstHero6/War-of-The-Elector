import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import {
  BUILDING_PRODUCTION_RATES,
  CITY_TIER_INCOME,
  getUnitUpkeep,
} from "@/app/lib/game-config";

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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { realmId } = await request.json();

    if (!realmId) {
      return NextResponse.json(
        { error: "realmId is required" },
        { status: 400 }
      );
    }

    // Verify realm exists and user is admin/owner of this realm
    const realm = await prisma.realm.findFirst({
      where: {
        id: realmId,
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id, role: "ADMIN" } } },
        ],
      },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found or you don't have admin access to this realm" },
        { status: 403 }
      );
    }

    // Get all users who are members of this realm, with their resources and cities in this realm
    const realmMembers = await prisma.realmMember.findMany({
      where: { realmId },
      include: {
        user: {
          include: {
            resources: {
              where: { realmId },
            },
            cities: {
              where: { realmId },
              include: {
                buildings: true,
              },
            },
            armies: {
              where: { realmId },
              include: {
                units: true,
              },
            },
          },
        },
      },
    });

    // Also include the owner if they're not in members
    const owner = await prisma.user.findUnique({
      where: { id: realm.ownerId },
      include: {
        resources: {
          where: { realmId },
        },
        cities: {
          where: { realmId },
          include: {
            buildings: true,
          },
        },
        armies: {
          where: { realmId },
          include: {
            units: true,
          },
        },
      },
    });

    // Combine owner and members
    const users: any[] = [];
    if (owner) {
      users.push(owner);
    }
    realmMembers.forEach((member) => {
      if (member.user.id !== realm.ownerId) {
        users.push(member.user);
      }
    });

    // Process each user
    for (const user of users) {
      // Get user's resources in this realm (should only be one)
      const userResource = user.resources?.[0];
      
      if (!userResource) {
        console.warn(`User ${user.id} has no resource record in realm ${realmId}. Skipping.`);
        continue;
      }

      // A. Resource Generation from Buildings
      const resourceGains = {
        food: 0,
        wood: 0,
        stone: 0,
        metal: 0,
        livestock: 0,
        currency: 0,
      };

      // Iterate through all cities owned by this user
      for (const city of user.cities) {
        // Iterate through all buildings in each city
        for (const building of city.buildings) {
          // Look up building production rates by tier
          const buildingProduction =
            BUILDING_PRODUCTION_RATES[
              building.name as keyof typeof BUILDING_PRODUCTION_RATES
            ];
          if (buildingProduction) {
            const production =
              buildingProduction[
                building.tier as keyof typeof buildingProduction
              ] || buildingProduction[1]; // Default to tier 1
            if (production) {
              resourceGains.food += production.food || 0;
              resourceGains.wood += production.wood || 0;
              resourceGains.stone += production.stone || 0;
              resourceGains.metal += production.metal || 0;
              resourceGains.livestock += production.livestock || 0;
              resourceGains.currency += production.currency || 0;
            }
          }
        }

        // B. Income & Tax Calculation
        // Step 1: Calculate tax from current wealth (before income)
        const taxAmount = (city.taxRate / 100) * city.localWealth;

        // Step 2: Give tax to player
        resourceGains.currency += taxAmount;

        // Step 3: Subtract tax from city wealth
        const cityWealthAfterTax = city.localWealth - taxAmount;

        // Step 4: Calculate Local Trade income based on City Upgrade Tier
        const localTradeGain =
          CITY_TIER_INCOME[city.upgradeTier as keyof typeof CITY_TIER_INCOME] ||
          0;

        // Step 5: Add income to city wealth
        const finalCityWealth = cityWealthAfterTax + localTradeGain;

        // Update city's local wealth
        await prisma.city.update({
          where: { id: city.id },
          data: { localWealth: finalCityWealth },
        });
      }

      // C. Upkeep costs for units (currency-based, tier-based per unit per turn) in this realm
      const userUnits = await prisma.armyUnit.findMany({
        where: { 
          army: { 
            ownerId: user.id, 
            realmId 
          } 
        },
        select: {
          id: true,
          tier: true,
          quantity: true,
        },
        orderBy: {
          tier: 'asc', // Order by tier (lowest first) for disbandment priority
        },
      });
      
      // Calculate total currency upkeep based on each unit's tier and quantity
      let totalCurrencyUpkeep = 0;
      for (const unit of userUnits) {
        const unitTier = unit.tier ?? 2; // Default to tier 2 if not set
        const upkeepPerUnit = getUnitUpkeep(unitTier);
        totalCurrencyUpkeep += upkeepPerUnit * unit.quantity;
      }

      // Calculate currency after gains (before upkeep)
      const currencyAfterGains = userResource.currency + resourceGains.currency;
      
      // Check if player can afford upkeep (currency cannot go negative, 0 means can't pay)
      const canAffordUpkeep = currencyAfterGains > 0 && currencyAfterGains >= totalCurrencyUpkeep;
      
      let finalCurrency = currencyAfterGains;
      let consecutiveFailedTurns = userResource.consecutiveFailedUpkeepTurns || 0;
      const unitsToDisband: Array<{ unitId: string; quantityToRemove: number }> = [];
      
      if (canAffordUpkeep) {
        // Player can pay - deduct upkeep and reset failure counter
        finalCurrency = currencyAfterGains - totalCurrencyUpkeep;
        consecutiveFailedTurns = 0;
      } else {
        // Player cannot pay - increment failure counter
        consecutiveFailedTurns += 1;
        finalCurrency = Math.max(0, currencyAfterGains); // Ensure currency doesn't go negative
        
        // If 2 consecutive failed turns, disband units
        if (consecutiveFailedTurns >= 2) {
          // Calculate how much upkeep they can't pay
          const unpaidUpkeep = totalCurrencyUpkeep - Math.max(0, currencyAfterGains);
          
          // Disband units starting with lowest tier (cheapest) until unpaid upkeep is covered
          // Priority: Keep expensive units (high tier), disband cheap units (low tier) first
          let remainingUnpaidUpkeep = unpaidUpkeep;
          
          for (const unit of userUnits) {
            if (remainingUnpaidUpkeep <= 0) break;
            
            const unitTier = unit.tier ?? 2;
            const upkeepPerUnit = getUnitUpkeep(unitTier);
            const unitsNeededToDisband = Math.ceil(remainingUnpaidUpkeep / upkeepPerUnit);
            const unitsToRemove = Math.min(unitsNeededToDisband, unit.quantity);
            
            if (unitsToRemove > 0) {
              unitsToDisband.push({
                unitId: unit.id,
                quantityToRemove: unitsToRemove,
              });
              remainingUnpaidUpkeep -= unitsToRemove * upkeepPerUnit;
            }
          }
        }
      }

      // Execute all updates in a transaction
      await prisma.$transaction(async (tx) => {
        // Disband units if needed
        for (const { unitId, quantityToRemove } of unitsToDisband) {
          const unit = await tx.armyUnit.findUnique({ where: { id: unitId } });
          if (unit) {
            if (unit.quantity <= quantityToRemove) {
              // Delete the unit entirely
              await tx.armyUnit.delete({ where: { id: unitId } });
            } else {
              // Reduce quantity
              await tx.armyUnit.update({
                where: { id: unitId },
                data: { quantity: unit.quantity - quantityToRemove },
              });
            }
          }
        }
        
        // Update user's resources with gains, upkeep (if paid), and failure counter
        await tx.resource.update({
          where: {
            realmId_userId: {
              realmId,
              userId: user.id,
            },
          },
          data: {
            food: { increment: resourceGains.food },
            wood: { increment: resourceGains.wood },
            stone: { increment: resourceGains.stone },
            metal: { increment: resourceGains.metal },
            livestock: { increment: resourceGains.livestock },
            currency: finalCurrency, // Set directly to prevent negative
            consecutiveFailedUpkeepTurns: consecutiveFailedTurns,
          },
        });
      });
    }

    return NextResponse.json({
      success: true,
      message: `Turn advanced successfully for realm "${realm.name}". Processed ${users.length} users and their cities.`,
    });
  } catch (error) {
    console.error("Error advancing turn:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
