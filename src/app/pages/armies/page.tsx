"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "@/components/Notification";
import { useRealm } from "@/contexts/RealmContext";
import RealmRequirement from "@/components/RealmRequirement";
import UnitStatsModal from "@/components/UnitStatsModal";
import { getUnitUpgradeCost } from "@/app/lib/game-config";
import { 
  PlusCircleIcon, 
  ArrowUpIcon, 
  ShieldCheckIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
const CurrencyIcon = "/components/icons/currency.svg";
const WoodIcon = "/components/icons/wood.svg";
const StoneIcon = "/components/icons/stone.svg";
const MetalIcon = "/components/icons/metal.svg";
const FoodIcon = "/components/icons/food.svg";
const LivestockIcon = "/components/icons/livestock.svg";

export default function ArmiesPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [armies, setArmies] = useState<any[]>([]);
  const [resources, setResources] = useState<any | null>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [newArmyName, setNewArmyName] = useState("");
  const [selectedArmyId, setSelectedArmyId] = useState<string>("");
  const [selectedUnitType, setSelectedUnitType] = useState<string | null>(null);
  const [selectedUnitTier, setSelectedUnitTier] = useState<number | undefined>(undefined);
  const [selectedUnitQuantity, setSelectedUnitQuantity] = useState<number | undefined>(undefined);
  const [upgradingUnitId, setUpgradingUnitId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "recruit" | "manage">("overview");
  
  // Unit types and costs
  const unitTypes = [
    "Militia-At-Arms",
    "Pike Men",
    "Swordsmen",
    "Matchlocks",
    "Flintlocks",
    "Light Calvary",
    "Dragoons",
    "Heavy Calvary",
    "Banner Guard",
    "Light Artilery",
    "Medium Artilery",
    "Heavy Artilery",
  ] as const;
  type UnitType = (typeof unitTypes)[number];
  const [unitType, setUnitType] = useState<UnitType>("Militia-At-Arms");
  const [quantity, setQuantity] = useState<number>(1);

  const { addNotification, NotificationContainer } = useNotification();
  const { currentRealm } = useRealm();

  useEffect(() => {
    if (isLoaded && user && currentRealm) {
      Promise.all([
        fetchUserRole(),
        fetchResources(),
        fetchArmies(),
        fetchCities(),
      ]).finally(() => setLoading(false));
    } else if (isLoaded && !user) {
      setLoading(false);
    } else if (isLoaded && user && !currentRealm) {
      setLoading(false);
      addNotification("info", "Please select a realm to view armies");
    }
  }, [isLoaded, user, currentRealm]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/dashboard/user-data");
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    if (!currentRealm) return;
    try {
      const res = await fetch(`/api/dashboard/resources?realmId=${currentRealm.id}`);
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchArmies = async () => {
    if (!currentRealm) return;
    try {
      const res = await fetch(`/api/armies?realmId=${currentRealm.id}`);
      if (res.ok) {
        const data = await res.json();
        setArmies(data.armies || []);
        const firstId = data.armies?.[0]?.id || "";
        if (!firstId) {
          setSelectedArmyId("");
        } else if (!selectedArmyId || !data.armies.some((a: any) => a.id === selectedArmyId)) {
          setSelectedArmyId(firstId);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCities = async () => {
    if (!currentRealm) return;
    try {
      const res = await fetch(`/api/cities?realmId=${currentRealm.id}`);
      if (res.ok) {
        const data = await res.json();
        setCities(data.cities || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const populationCap = useMemo(() => {
    const capByTier: Record<number, number> = {
      1: 2,
      2: 3,
      3: 7,
      4: 10,
      5: 15,
    };
    return cities.reduce((acc, c) => acc + (capByTier[c.upgradeTier] || 0), 0);
  }, [cities]);

  const totalUnits = useMemo(() => {
    return armies.reduce(
      (sum, a) =>
        sum + (a.units?.reduce((s: number, u: any) => s + u.quantity, 0) || 0),
      0
    );
  }, [armies]);

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

  const unitCosts: Record<
    UnitType,
    {
      currency: number;
      wood: number;
      stone: number;
      metal: number;
      food: number;
      livestock: number;
    }
  > = {
    "Militia-At-Arms": {
      currency: 50,
      wood: 3,
      stone: 3,
      metal: 0,
      food: 0,
      livestock: 0,
    },
    "Pike Men": {
      currency: 100,
      wood: 8,
      stone: 2,
      metal: 0,
      food: 0,
      livestock: 0,
    },
    Swordsmen: {
      currency: 150,
      wood: 3,
      stone: 0,
      metal: 6,
      food: 0,
      livestock: 0,
    },
    Matchlocks: {
      currency: 100,
      wood: 4,
      stone: 0,
      metal: 4,
      food: 0,
      livestock: 0,
    },
    Flintlocks: {
      currency: 150,
      wood: 4,
      stone: 2,
      metal: 6,
      food: 0,
      livestock: 0,
    },
    "Light Calvary": {
      currency: 150,
      wood: 3,
      stone: 0,
      metal: 6,
      food: 0,
      livestock: 4,
    },
    Dragoons: {
      currency: 150,
      wood: 4,
      stone: 2,
      metal: 6,
      food: 0,
      livestock: 4,
    },
    "Heavy Calvary": {
      currency: 300,
      wood: 3,
      stone: 0,
      metal: 10,
      food: 0,
      livestock: 4,
    },
    "Banner Guard": {
      currency: 500,
      wood: 3,
      stone: 0,
      metal: 12,
      food: 0,
      livestock: 4,
    },
    "Light Artilery": {
      currency: 150,
      wood: 10,
      stone: 5,
      metal: 5,
      food: 0,
      livestock: 0,
    },
    "Medium Artilery": {
      currency: 300,
      wood: 10,
      stone: 5,
      metal: 8,
      food: 0,
      livestock: 1,
    },
    "Heavy Artilery": {
      currency: 500,
      wood: 10,
      stone: 5,
      metal: 12,
      food: 0,
      livestock: 2,
    },
  };

  const totalCost = useMemo(() => {
    const per = unitCosts[unitType];
    return {
      currency: per.currency * quantity,
      wood: per.wood * quantity,
      stone: per.stone * quantity,
      metal: per.metal * quantity,
      food: per.food * quantity,
      livestock: per.livestock * quantity,
    };
  }, [unitType, quantity]);

  const hasResources = useMemo(() => {
    if (!resources) return false;
    return (
      resources.currency >= totalCost.currency &&
      resources.wood >= totalCost.wood &&
      resources.stone >= totalCost.stone &&
      resources.metal >= totalCost.metal &&
      resources.food >= totalCost.food &&
      resources.livestock >= totalCost.livestock
    );
  }, [resources, totalCost]);

  const atOrOverCap = useMemo(
    () => totalUnits >= populationCap,
    [totalUnits, populationCap]
  );

  const createArmy = async () => {
    if (!newArmyName.trim()) {
      addNotification("error", "Please enter an army name");
      return;
    }
    if (!currentRealm) {
      addNotification("error", "Please select a realm first");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/armies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newArmyName.trim(), realmId: currentRealm.id }),
      });
      if (res.ok) {
        addNotification("success", "Army created");
        setNewArmyName("");
        await fetchArmies();
      } else {
        const txt = await res.text();
        addNotification("error", txt || "Failed to create army");
      }
    } catch (e) {
      console.error(e);
      addNotification("error", "Error creating army");
    } finally {
      setCreating(false);
    }
  };

  const addUnits = async () => {
    const armyIdToUse = selectedArmyId || (armies[0]?.id ?? "");
    if (!armyIdToUse) {
      addNotification("info", "Create or select an army first");
      return;
    }
    if (atOrOverCap) {
      addNotification("error", "Population cap reached");
      return;
    }
    if (!hasResources) {
      addNotification("error", "Insufficient resources");
      return;
    }
    try {
      const res = await fetch(`/api/armies/${armyIdToUse}/units`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitType, quantity }),
      });
      if (res.ok) {
        addNotification("success", "Units recruited");
        await Promise.all([fetchResources(), fetchArmies()]);
      } else {
        const txt = await res.text();
        addNotification("error", txt || "Failed to add units");
      }
    } catch (e) {
      console.error(e);
      addNotification("error", "Error adding units");
    }
  };

  const upgradeUnit = async (unitId: string, armyId: string, currentTier: number) => {
    const nextTier = currentTier + 1;
    const upgradeCost = getUnitUpgradeCost(nextTier);
    if (!resources || resources.currency < upgradeCost) {
      addNotification("error", `You need ${upgradeCost} currency to upgrade this unit to tier ${nextTier}`);
      return;
    }
    setUpgradingUnitId(unitId);
    try {
      const res = await fetch(`/api/armies/${armyId}/units/${unitId}/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        addNotification("success", data.message || "Unit upgraded");
        await Promise.all([fetchResources(), fetchArmies()]);
      } else {
        let errorMessage = "Failed to upgrade unit";
        try {
          const txt = await res.text();
          try {
            const errorData = JSON.parse(txt);
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            errorMessage = txt || errorMessage;
          }
        } catch (e) {
          errorMessage = `Error ${res.status}: ${res.statusText}`;
        }
        addNotification("error", errorMessage);
      }
    } catch (e) {
      console.error(e);
      addNotification("error", "Error upgrading unit");
    } finally {
      setUpgradingUnitId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto mb-4"></div>
          <p className="body-text text-gold-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-1 mb-4">⚔️ Armies</h1>
          <p className="body-text text-lg text-steel-300 mb-8">
            Please sign in to access the armies section.
          </p>
        </div>
      </div>
    );
  }

  const ResourceBadge = ({ 
    icon: Icon, 
    label, 
    value, 
    cost, 
    isSvg = false 
  }: { 
    icon: any; 
    label: string; 
    value: number; 
    cost?: number;
    isSvg?: boolean;
  }) => {
    const hasEnough = cost === undefined || value >= cost;
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm border transition-all ${
        cost !== undefined 
          ? hasEnough 
            ? 'bg-emerald-500/10 border-emerald-500/30' 
            : 'bg-crimson-500/10 border-crimson-500/30'
          : 'bg-steel-500/10 border-steel-500/30'
      }`}>
        {isSvg ? (
          <Image 
            src={Icon} 
            alt={label}
            width={20}
            height={20}
            className="w-5 h-5"
          />
        ) : (
          <Icon className="w-5 h-5 text-gold-400" />
        )}
        <div className="flex flex-col">
          <span className="text-xs text-steel-400 uppercase tracking-wider">{label}</span>
          <span className={`text-sm font-semibold ${hasEnough ? 'text-emerald-300' : 'text-crimson-300'}`}>
            {value}{cost !== undefined && ` / ${cost}`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <RealmRequirement>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-4 md:p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>

        <div className="relative w-full max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="heading-1 mb-3 flex items-center justify-center gap-3">
              <ShieldCheckIcon className="w-12 h-12 text-gold-400" />
              Armies
            </h1>
            <p className="heading-4 text-steel-300 italic font-normal">
              Command your forces, recruit units, and wage war across the realm
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="modern-card p-6 text-center">
              <div className="text-4xl font-bold text-gold-400 mb-2">{armies.length}</div>
              <div className="text-sm text-steel-300 uppercase tracking-wider">Total Armies</div>
            </div>
            <div className="modern-card p-6 text-center">
              <div className="text-4xl font-bold text-gold-400 mb-2">{totalUnits}</div>
              <div className="text-sm text-steel-300 uppercase tracking-wider">Total Units</div>
            </div>
            <div className="modern-card p-6 text-center">
              <div className={`text-4xl font-bold mb-2 ${atOrOverCap ? 'text-crimson-400' : 'text-emerald-400'}`}>
                {totalUnits} / {populationCap}
              </div>
              <div className="text-sm text-steel-300 uppercase tracking-wider">Population Cap</div>
            </div>
          </motion.div>

          {/* Resources Display */}
          {resources && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="modern-card p-6 mb-8"
            >
              <h3 className="heading-4 mb-4 flex items-center gap-2">
                <span className="text-2xl">💰</span>
                Your Resources
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <ResourceBadge icon={CurrencyIcon} label="Currency" value={resources.currency ?? 0} isSvg />
                <ResourceBadge icon={FoodIcon} label="Food" value={resources.food ?? 0} isSvg />
                <ResourceBadge icon={WoodIcon} label="Wood" value={resources.wood ?? 0} isSvg />
                <ResourceBadge icon={StoneIcon} label="Stone" value={resources.stone ?? 0} isSvg />
                <ResourceBadge icon={MetalIcon} label="Metal" value={resources.metal ?? 0} isSvg />
                <ResourceBadge icon={LivestockIcon} label="Livestock" value={resources.livestock ?? 0} isSvg />
              </div>
            </motion.div>
          )}

          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2 mb-6 overflow-x-auto"
          >
            {[
              { id: "overview", label: "Army Overview", icon: "🏰" },
              { id: "recruit", label: "Recruit Units", icon: "⚔️" },
              { id: "manage", label: "Manage Units", icon: "👥" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-steel-900 shadow-lg'
                    : 'bg-steel-800/50 text-steel-300 hover:bg-steel-700/50 border border-steel-700'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Create New Army */}
                <div className="modern-card p-6">
                  <h2 className="heading-3 mb-4 flex items-center gap-2">
                    <PlusCircleIcon className="w-6 h-6 text-gold-400" />
                    Create New Army
                  </h2>
                  <div className="flex gap-3">
                    <input
                      className="modern-input flex-1"
                      placeholder="Enter army name..."
                      value={newArmyName}
                      onChange={(e) => setNewArmyName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && createArmy()}
                    />
                    <button
                      disabled={creating || !newArmyName.trim()}
                      onClick={createArmy}
                      className="modern-button px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {creating ? "Creating..." : "Create Army"}
                    </button>
                  </div>
                </div>

                {/* Army List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {armies.length === 0 ? (
                    <div className="modern-card p-12 text-center col-span-full">
                      <div className="text-6xl mb-4">⚔️</div>
                      <h3 className="heading-3 mb-2">No Armies Yet</h3>
                      <p className="body-text text-steel-400">Create your first army to begin recruiting units</p>
                    </div>
                  ) : (
                    armies.map((army, index) => (
                      <motion.div
                        key={army.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedArmyId(army.id)}
                        className={`modern-card p-6 cursor-pointer transition-all ${
                          selectedArmyId === army.id
                            ? 'ring-2 ring-gold-500 shadow-xl'
                            : 'hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="heading-4">{army.name}</h3>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30">
                            <span className="text-sm font-semibold text-gold-300">
                              {army.units?.reduce((s: number, u: any) => s + u.quantity, 0) || 0}
                            </span>
                            <span className="text-xs text-steel-400">units</span>
                          </div>
                        </div>
                        
                        {army.units && army.units.length > 0 ? (
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                            {army.units.map((unit: any) => {
                              const src = unitImageMap[unit.unitType];
                              if (!src) return null;
                              return (
                                <div
                                  key={unit.id}
                                  className="relative group"
                                >
                                  <div className="relative rounded-lg overflow-hidden border-2 border-gold-600/50 hover:border-gold-400 transition-all">
                                    <Image
                                      src={encodeURI(src)}
                                      alt={unit.unitType}
                                      width={64}
                                      height={64}
                                      className="w-full h-auto bg-steel-900"
                                    />
                                    <div className="absolute -top-1 -right-1 bg-gold-600 text-steel-900 text-xs font-bold px-2 py-0.5 rounded-full border-2 border-gold-700 shadow-lg">
                                      {unit.quantity}
                                    </div>
                                    <div className="absolute -top-1 -left-1 bg-steel-800 text-gold-300 text-xs font-bold px-1.5 py-0.5 rounded border border-gold-600">
                                      T{unit.tier || 2}
                                    </div>
                                  </div>
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-steel-900 text-xs text-steel-200 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {unit.unitType}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="body-text text-steel-400 text-center py-4">No units recruited yet</p>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "recruit" && (
              <motion.div
                key="recruit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Recruitment Panel */}
                <div className="modern-card p-6">
                  <h2 className="heading-3 mb-6">Recruit Units</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="label-text mb-2 block">Select Army</label>
                      <select
                        className="modern-input w-full"
                        value={selectedArmyId}
                        onChange={(e) => setSelectedArmyId(e.target.value)}
                      >
                        <option value="">Choose an army...</option>
                        {armies.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label-text mb-2 block">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        className="modern-input w-full"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Math.max(1, parseInt(e.target.value || "1", 10)))
                        }
                      />
                    </div>
                  </div>

                  {/* Unit Type Selection */}
                  <div className="mb-6">
                    <label className="label-text mb-3 block">Select Unit Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {unitTypes.map((type) => {
                        const img = unitImageMap[type];
                        const costs = unitCosts[type];
                        const isSelected = unitType === type;
                        const hasResources = costs.wood > 0 || costs.stone > 0 || costs.metal > 0 || costs.food > 0 || costs.livestock > 0;
                        return (
                          <div
                            key={type}
                            className={`relative rounded-xl p-4 transition-all border-2 ${
                              isSelected
                                ? 'bg-gold-500/20 border-gold-500 shadow-lg'
                                : 'bg-steel-800/30 border-steel-700 hover:border-gold-600/50'
                            }`}
                          >
                            <button
                              onClick={() => setUnitType(type)}
                              className="w-full"
                            >
                              {img && (
                                <Image
                                  src={encodeURI(img)}
                                  alt={type}
                                  width={64}
                                  height={64}
                                  className="w-full h-auto rounded-lg border border-gold-600/30 bg-steel-900 mb-2"
                                />
                              )}
                              <div className="text-sm font-semibold text-gold-300 text-center mb-1">
                                {type}
                              </div>
                              <div className="text-xs text-steel-400 text-center space-y-0.5">
                                <div>{costs.currency} Currency</div>
                                {hasResources && (
                                  <div className="text-steel-500 text-[10px] mt-1">
                                    {costs.wood > 0 && `${costs.wood}W `}
                                    {costs.stone > 0 && `${costs.stone}S `}
                                    {costs.metal > 0 && `${costs.metal}M `}
                                    {costs.food > 0 && `${costs.food}F `}
                                    {costs.livestock > 0 && `${costs.livestock}L`}
                                  </div>
                                )}
                              </div>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUnitType(type);
                                setSelectedUnitTier(undefined);
                                setSelectedUnitQuantity(undefined);
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-steel-900/80 hover:bg-gold-600/20 border border-gold-600/30 hover:border-gold-500 transition-colors"
                              title="View unit stats"
                            >
                              <InformationCircleIcon className="w-4 h-4 text-gold-400" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cost Display */}
                  <div className="bg-steel-900/50 rounded-xl p-6 mb-6">
                    <h3 className="heading-4 mb-4">Recruitment Cost</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      <ResourceBadge 
                        icon={CurrencyIcon} 
                        label="Currency" 
                        value={resources?.currency ?? 0} 
                        cost={totalCost.currency}
                        isSvg 
                      />
                      <ResourceBadge 
                        icon={FoodIcon} 
                        label="Food" 
                        value={resources?.food ?? 0} 
                        cost={totalCost.food}
                        isSvg 
                      />
                      <ResourceBadge 
                        icon={WoodIcon} 
                        label="Wood" 
                        value={resources?.wood ?? 0} 
                        cost={totalCost.wood}
                        isSvg 
                      />
                      <ResourceBadge 
                        icon={StoneIcon} 
                        label="Stone" 
                        value={resources?.stone ?? 0} 
                        cost={totalCost.stone}
                        isSvg 
                      />
                      <ResourceBadge 
                        icon={MetalIcon} 
                        label="Metal" 
                        value={resources?.metal ?? 0} 
                        cost={totalCost.metal}
                        isSvg 
                      />
                      <ResourceBadge 
                        icon={LivestockIcon} 
                        label="Livestock" 
                        value={resources?.livestock ?? 0} 
                        cost={totalCost.livestock}
                        isSvg 
                      />
                    </div>
                  </div>

                  {/* Warnings */}
                  {!hasResources && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-crimson-500/10 border border-crimson-500/30 mb-4">
                      <ExclamationTriangleIcon className="w-6 h-6 text-crimson-400" />
                      <span className="text-crimson-300">Insufficient resources to recruit these units</span>
                    </div>
                  )}
                  {atOrOverCap && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-crimson-500/10 border border-crimson-500/30 mb-4">
                      <ExclamationTriangleIcon className="w-6 h-6 text-crimson-400" />
                      <span className="text-crimson-300">Population cap reached. Upgrade cities to increase capacity.</span>
                    </div>
                  )}

                  {/* Recruit Button */}
                  <button
                    className="modern-button w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={addUnits}
                    disabled={!resources || !selectedArmyId || !hasResources || atOrOverCap}
                  >
                    <PlusCircleIcon className="w-6 h-6" />
                    Recruit {quantity} {unitType}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "manage" && (
              <motion.div
                key="manage"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {!selectedArmyId ? (
                  <div className="modern-card p-12 text-center">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="heading-3 mb-2">No Army Selected</h3>
                    <p className="body-text text-steel-400">Select an army from the overview tab to manage its units</p>
                  </div>
                ) : (
                  armies
                    .filter((a) => a.id === selectedArmyId)
                    .map((army) => (
                      <div key={army.id} className="modern-card p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="heading-3">{army.name}</h2>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30">
                            <span className="text-lg font-bold text-gold-300">
                              {army.units?.reduce((s: number, u: any) => s + u.quantity, 0) || 0}
                            </span>
                            <span className="text-sm text-steel-400">total units</span>
                          </div>
                        </div>

                        {army.units && army.units.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {army.units.map((unit: any) => {
                              const src = unitImageMap[unit.unitType];
                              const tier = unit.tier || 2;
                              const nextTier = tier + 1;
                              const upgradeCost = tier < 5 ? getUnitUpgradeCost(nextTier) : 0;
                              const canUpgrade = tier < 5 && resources && resources.currency >= upgradeCost;
                              if (!src) return null;
                              
                              return (
                                <motion.div
                                  key={unit.id}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="relative bg-steel-900/50 rounded-xl p-3 border-2 border-gold-600/30 hover:border-gold-500 transition-all group"
                                >
                                  <div
                                    className="relative cursor-pointer"
                                    onClick={() => {
                                      setSelectedUnitType(unit.unitType);
                                      setSelectedUnitTier(tier);
                                      setSelectedUnitQuantity(unit.quantity);
                                    }}
                                  >
                                    <Image
                                      src={encodeURI(src)}
                                      alt={unit.unitType}
                                      width={80}
                                      height={80}
                                      className="w-full h-auto rounded-lg border border-gold-600 bg-steel-900"
                                    />
                                    <div className="absolute -top-2 -right-2 bg-gold-600 text-steel-900 text-sm font-bold px-2.5 py-1 rounded-full border-2 border-gold-700 shadow-lg">
                                      {unit.quantity}
                                    </div>
                                    <div className="absolute -top-2 -left-2 bg-steel-800 text-gold-300 text-sm font-bold px-2 py-1 rounded border border-gold-600">
                                      T{tier}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 text-center">
                                    <div className="text-xs text-steel-300 font-medium truncate mb-2">
                                      {unit.unitType}
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        upgradeUnit(unit.id, army.id, tier);
                                      }}
                                      disabled={!canUpgrade || upgradingUnitId === unit.id}
                                      className={`w-full text-xs px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 ${
                                        canUpgrade && upgradingUnitId !== unit.id
                                          ? "bg-gradient-to-r from-gold-500 to-gold-600 text-steel-900 hover:shadow-lg"
                                          : "bg-steel-700 text-steel-400 cursor-not-allowed"
                                      }`}
                                    >
                                      {upgradingUnitId === unit.id ? (
                                        "Upgrading..."
                                      ) : tier < 5 ? (
                                        <>
                                          <ArrowUpIcon className="w-3 h-3" />
                                          Upgrade
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircleIcon className="w-3 h-3" />
                                          Max Tier
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="text-6xl mb-4">⚔️</div>
                            <p className="body-text text-steel-400">No units in this army yet</p>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <NotificationContainer />
        {selectedUnitType && (
          <UnitStatsModal
            unitType={selectedUnitType}
            isOpen={!!selectedUnitType}
            onClose={() => {
              setSelectedUnitType(null);
              setSelectedUnitTier(undefined);
              setSelectedUnitQuantity(undefined);
            }}
            currentTier={selectedUnitTier}
            quantity={selectedUnitQuantity}
          />
        )}
      </div>
    </RealmRequirement>
  );
}