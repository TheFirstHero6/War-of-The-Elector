"use client";

import Image from "next/image";
import { getUnitStats } from "@/app/lib/unit-data";
import { getUnitUpkeep, getUnitUpgradeCost } from "@/app/lib/game-config";

interface UnitStatsModalProps {
  unitType: string;
  isOpen: boolean;
  onClose: () => void;
  currentTier?: number;
  quantity?: number;
}

export default function UnitStatsModal({
  unitType,
  isOpen,
  onClose,
  currentTier,
  quantity,
}: UnitStatsModalProps) {
  if (!isOpen) return null;

  const isSpecificUnit = currentTier !== undefined;
  const displayTier = currentTier || 2;
  const currentStats = getUnitStats(unitType, displayTier);

  const unitImageMap: Record<string, string> = {
    Flintlocks: "/flintlocks.png",
    Swordsmen: "/swordsman.png",
    "Pike Men": "/Pikeman.png",
    Matchlocks: "/Matchlocks.png",
    "Militia-At-Arms": "/Militia.png",
    "Light Calvary": "/light cav.png",
    "Heavy Calvary": "/heavy cav.png",
    Dragoons: "/dragoons.png",
    "Banner Guard": "/banner guard.png",
    "Light Artilery": "/light artillery.png",
    "Medium Artilery": "/medium artillery.png",
    "Heavy Artilery": "/Heavy artillery.png",
  };

  const imageSrc = unitImageMap[unitType];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="medieval-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {imageSrc && (
                <Image
                  src={encodeURI(imageSrc)}
                  alt={unitType}
                  width={64}
                  height={64}
                  className="rounded-md border border-medieval-gold-600 bg-medieval-steel-900"
                />
              )}
              <div>
                <h2 className="font-medieval text-2xl text-medieval-gold-300">
                  {unitType}
                </h2>
                {isSpecificUnit && (
                  <div className="text-medieval-steel-300 text-sm mt-1">
                    Tier {currentTier} {quantity !== undefined && `• Quantity: ${quantity}`}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-medieval-gold-600 hover:text-red-400 text-3xl transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {isSpecificUnit ? (
              <div>
                <h3 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                  Current Stats (Tier {currentTier})
                </h3>
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-medieval-gold-300 font-semibold mb-1">Health</div>
                      <div className="text-medieval-steel-200">{currentStats.health}</div>
                    </div>
                    <div>
                      <div className="text-medieval-gold-300 font-semibold mb-1">Movement</div>
                      <div className="text-medieval-steel-200">{currentStats.movement}"</div>
                    </div>
                    <div>
                      <div className="text-medieval-gold-300 font-semibold mb-1">Attacks</div>
                      <div className="text-medieval-steel-200">{currentStats.attacks}</div>
                    </div>
                    <div>
                      <div className="text-medieval-gold-300 font-semibold mb-1">Morale</div>
                      <div className="text-medieval-steel-200">{currentStats.morale}</div>
                    </div>
                    {currentStats.range && (
                      <div>
                        <div className="text-medieval-gold-300 font-semibold mb-1">Range</div>
                        <div className="text-medieval-steel-200">{currentStats.range}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-medieval-gold-300 font-semibold mb-1">Upkeep per Unit</div>
                      <div className="text-medieval-steel-200">{getUnitUpkeep(currentTier)} currency / turn</div>
                    </div>
                  </div>
                  {currentTier < 5 && (
                    <div className="mt-4 pt-4 border-t border-medieval-gold-600/30">
                      <div className="text-medieval-gold-300 font-semibold mb-2">Upgrade to Tier {currentTier + 1}</div>
                      <div className="text-medieval-steel-200">
                        Cost: {getUnitUpgradeCost(currentTier + 1)} currency
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <div className="text-medieval-gold-300 font-semibold mb-2">Hit Targets</div>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((defTier) => (
                        <div key={defTier} className="text-center">
                          <div className="text-xs text-medieval-steel-400">vs T{defTier}</div>
                          <div className="text-medieval-steel-200 font-semibold">{currentStats.hitTargets[defTier]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medieval text-md text-medieval-gold-300 mb-2">
                    Compare with Other Tiers
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-medieval-gold-600">
                      <thead>
                        <tr className="bg-medieval-steel-900">
                          <th className="border border-medieval-gold-600 px-3 py-2 text-left text-medieval-gold-300">
                            Tier
                          </th>
                          <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                            Hit vs T1
                          </th>
                          <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                            Hit vs T2
                          </th>
                          <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                            Hit vs T3
                          </th>
                          <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                            Hit vs T4
                          </th>
                        <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                          Hit vs T5
                        </th>
                        <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                          Morale
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((tier) => {
                        const stats = getUnitStats(unitType, tier);
                        const isCurrentTier = tier === currentTier;
                        return (
                          <tr
                            key={tier}
                            className={`${
                              isCurrentTier
                                ? "bg-medieval-gold-600/30 border-2 border-medieval-gold-400"
                                : "bg-medieval-steel-800/50 hover:bg-medieval-steel-800"
                            }`}
                          >
                            <td className="border border-medieval-gold-600 px-3 py-2 font-semibold text-medieval-gold-300">
                              T{tier} {isCurrentTier && "← Current"}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.hitTargets[1]}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.hitTargets[2]}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.hitTargets[3]}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.hitTargets[4]}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.hitTargets[5]}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.morale}
                            </td>
                          </tr>
                        );
                      })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                  Stats by Tier
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-medieval-gold-600">
                    <thead>
                      <tr className="bg-medieval-steel-900">
                        <th className="border border-medieval-gold-600 px-3 py-2 text-left text-medieval-gold-300">
                          Tier
                        </th>
                        <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                          Hit vs T1
                        </th>
                        <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                          Hit vs T2
                        </th>
                        <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                          Hit vs T3
                        </th>
                        <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                          Hit vs T4
                        </th>
                        <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                          Hit vs T5
                        </th>
                        <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                          Health
                        </th>
                        <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                          Movement
                        </th>
                        <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                          Attacks
                        </th>
                        <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                          Morale
                        </th>
                        {getUnitStats(unitType, 1).range && (
                          <th className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-gold-300">
                            Range
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((tier) => {
                        const stats = getUnitStats(unitType, tier);
                        return (
                          <tr
                            key={tier}
                            className="bg-medieval-steel-800/50 hover:bg-medieval-steel-800"
                          >
                            <td className="border border-medieval-gold-600 px-3 py-2 font-semibold text-medieval-gold-300">
                              T{tier}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.hitTargets[1]}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.hitTargets[2]}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.hitTargets[3]}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.hitTargets[4]}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.hitTargets[5]}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.health}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.movement}"
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.attacks}
                            </td>
                            <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                              {stats.morale}
                            </td>
                            {stats.range && (
                              <td className="border border-medieval-gold-600 px-3 py-2 text-center text-medieval-steel-200">
                                {stats.range}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                Special Abilities
              </h3>
              <p className="text-medieval-steel-200">
                {currentStats.specialAbilities}
              </p>
            </div>

            <div>
              <h3 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                Unit Formations & Reactions
              </h3>
              <div className="space-y-3 text-medieval-steel-200">
                <div className="bg-medieval-steel-900/30 p-3 rounded border border-medieval-gold-600/30 mb-3">
                  <strong className="text-medieval-gold-300">Reaction Points:</strong> At the start of each battle, players roll d4+1 (2-5 points per round). When an enemy charges, you may spend a reaction point to perform a reaction action. Banner Guard can react for free.
                </div>
                <div>
                  <strong className="text-medieval-gold-300">Condensed:</strong>{" "}
                  Immovable. Negates enemy frontal charge bonus. If Pike vs Cav,
                  reflects charge bonus back at Cav. -2 to be hit by ranged.
                </div>
                <div>
                  <strong className="text-medieval-gold-300">Loose:</strong> -4 to
                  Ranged Hit Chance, +4 to Melee Hit Chance.
                </div>
                <div>
                  <strong className="text-medieval-gold-300">Square:</strong>{" "}
                  (Cannot be a reaction). Same benefits as Condensed but applies
                  to all sides. Allows missile units to hide inside Pikemen.
                </div>
                <div>
                  <strong className="text-medieval-gold-300">Withdrawal:</strong>{" "}
                  Unit retreats one full movement.
                </div>
                <div>
                  <strong className="text-medieval-gold-300">Turn to Face:</strong>{" "}
                  Unit rotates to face incoming enemy.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

