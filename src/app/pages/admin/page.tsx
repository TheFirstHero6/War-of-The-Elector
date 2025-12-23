"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useNotification } from "@/components/Notification";
import { useRealm } from "@/contexts/RealmContext";
import RealmRequirement from "@/components/RealmRequirement";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface City {
  id: string;
  name: string;
  ownerId: string;
  upgradeTier: number;
  localWealth: number;
  taxRate: number;
}

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const { currentRealm } = useRealm();
  const [users, setUsers] = useState<User[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserForCity, setSelectedUserForCity] = useState("");
  const [selectedUserForArmies, setSelectedUserForArmies] = useState("");
  const [newCityName, setNewCityName] = useState("");
  const [cityTier, setCityTier] = useState(1);
  const [isCreatingCity, setIsCreatingCity] = useState(false);
  const [armies, setArmies] = useState<any[]>([]);
  const [allArmies, setAllArmies] = useState<any[]>([]);
  const [adminArmyName, setAdminArmyName] = useState("");
  const [selectedArmyId, setSelectedArmyId] = useState("");
  const [adminUnitType, setAdminUnitType] = useState("Militia-At-Arms");
  const [adminQuantity, setAdminQuantity] = useState(1);
  const [isAdvancingTurn, setIsAdvancingTurn] = useState(false);
  const [showTurnModal, setShowTurnModal] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [transferType, setTransferType] = useState<"city" | "army">("city");
  const [transferItemId, setTransferItemId] = useState("");
  const [transferToUserId, setTransferToUserId] = useState("");
  const [isTransferringItem, setIsTransferringItem] = useState(false);

  const { addNotification, NotificationContainer } = useNotification();

  useEffect(() => {
    if (isLoaded && user && currentRealm) {
      fetchUserRole();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user, currentRealm]);

  useEffect(() => {
    if (userRole === "ADMIN" && currentRealm) {
      fetchUsers();
      fetchCities();
      if (selectedUserForArmies) fetchArmies();
      // Also fetch all armies for transfer dropdown
      fetchAllArmies();
    }
  }, [userRole, currentRealm]);

  useEffect(() => {
    if (userRole === "ADMIN" && selectedUserForArmies) {
      fetchArmies();
    } else {
      setArmies([]);
      setSelectedArmyId("");
    }
  }, [selectedUserForArmies]);

  const fetchUserRole = async () => {
    if (!currentRealm) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/dashboard/user-data?realmId=${currentRealm.id}`);
      if (response.ok) {
        const data = await response.json();
        // Check realm admin role instead of global role
        const realmMember = currentRealm.members?.find((m: any) => m.user.id === user?.id) || 
                            (currentRealm.ownerId === user?.id ? { role: "OWNER" } : null);
        const realmRole = currentRealm.memberRole || realmMember?.role;
        // Check if user is OWNER or ADMIN in the realm
        if (realmRole === "OWNER" || realmRole === "ADMIN") {
          setUserRole("ADMIN");
        } else {
          setUserRole("BASIC");
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArmies = async () => {
    try {
      const res = await fetch(
        `/api/admin/armies?userId=${selectedUserForArmies}&realmId=${currentRealm?.id}`,
        {
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setArmies(data.armies || []);
      }
    } catch (e) {
      console.error("Error fetching armies", e);
    }
  };

  const fetchAllArmies = async () => {
    if (!currentRealm) return;
    try {
      const res = await fetch(`/api/admin/armies-all?realmId=${currentRealm.id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAllArmies(data.armies || []);
      }
    } catch (e) {
      console.error("Error fetching all armies", e);
    }
  };

  const adminCreateArmy = async () => {
    if (!selectedUserForArmies || !adminArmyName.trim()) {
      addNotification("error", "Select user and enter army name");
      return;
    }
    try {
      const res = await fetch("/api/admin/armies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserForArmies,
          name: adminArmyName.trim(),
          realmId: currentRealm?.id,
        }),
      });
      if (res.ok) {
        setAdminArmyName("");
        addNotification("success", "Army created");
        fetchArmies();
      } else {
        const txt = await res.text();
        addNotification("error", txt || "Failed to create army");
      }
    } catch (e) {
      console.error(e);
      addNotification("error", "Error creating army");
    }
  };

  const adminDeleteArmy = async (armyId: string) => {
    try {
      const res = await fetch(`/api/admin/armies?armyId=${armyId}&realmId=${currentRealm?.id}`, {
        method: "DELETE",
      });
      if (res.status === 204) {
        addNotification("success", "Army deleted");
        fetchArmies();
      } else {
        const txt = await res.text();
        addNotification("error", txt || "Failed to delete army");
      }
    } catch (e) {
      console.error(e);
      addNotification("error", "Error deleting army");
    }
  };

  const adminModifyUnits = async (method: "POST" | "DELETE") => {
    if (!selectedArmyId) {
      addNotification("error", "Select an army");
      return;
    }
    if (!currentRealm) {
      addNotification("error", "Please select a realm");
      return;
    }
    try {
      const res = await fetch(`/api/admin/armies/${selectedArmyId}/units`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitType: adminUnitType,
          quantity: adminQuantity,
          realmId: currentRealm.id,
        }),
      });
      if (res.ok || res.status === 204) {
        addNotification(
          "success",
          method === "POST" ? "Units added" : "Units removed"
        );
        fetchArmies();
      } else {
        const contentType = res.headers.get("content-type");
        let errorMessage = "Failed to modify units";
        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const txt = await res.text();
            errorMessage = txt || errorMessage;
          }
        } catch (parseError) {
          errorMessage = `Error ${res.status}: ${res.statusText}`;
        }
        addNotification("error", errorMessage);
      }
    } catch (e) {
      console.error(e);
      addNotification("error", "Error modifying units");
    }
  };

  const adminTransferItem = async () => {
    if (!transferItemId || !transferToUserId) {
      addNotification("error", "Please select an item and a target user");
      return;
    }

    if (!currentRealm) {
      addNotification("error", "Please select a realm");
      return;
    }

    try {
      setIsTransferringItem(true);
      const res = await fetch("/api/admin/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: transferType,
          itemID: transferItemId,
          toUserID: transferToUserId,
          realmId: currentRealm.id,
        }),
      });
      
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMessage = "Transfer Failed";
        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const txt = await res.text();
            errorMessage = txt || errorMessage;
          }
        } catch (parseError) {
          errorMessage = `Error ${res.status}: ${res.statusText}`;
        }
        addNotification("error", errorMessage);
        return;
      }

      const data = await res.json();
      addNotification("success", data.message || "Transfer Successful");

      fetchCities();
      if (selectedUserForArmies) fetchArmies();
      fetchAllArmies();

      setTransferItemId("");
      setTransferToUserId("");
    } catch (e) {
      console.error(e);
      addNotification("error", "Error performing transfer");
    } finally {
      setIsTransferringItem(false);
    }
  };
  const fetchUsers = async () => {
    if (!currentRealm) return;
    try {
      const response = await fetch(`/api/admin/users?realmId=${currentRealm.id}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        // Auto-select first users if empty
        if (data.users && data.users.length > 0) {
          if (!selectedUser) setSelectedUser(data.users[0].id);
          if (!selectedUserForCity) setSelectedUserForCity(data.users[0].id);
          if (!selectedUserForArmies)
            setSelectedUserForArmies(data.users[0].id);
        }
      } else {
        addNotification("error", "Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      addNotification("error", "Failed to load users");
    }
  };

  const fetchCities = async () => {
    if (!currentRealm) return;
    try {
      const response = await fetch(`/api/admin/cities?realmId=${currentRealm.id}`);
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities);
      } else {
        addNotification("error", "Failed to load cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      addNotification("error", "Failed to load cities");
    }
  };

  const createCity = async () => {
    if (!selectedUserForCity || !newCityName.trim()) {
      addNotification("error", "Please select a user and enter a city name");
      return;
    }

    setIsCreatingCity(true);
    try {
      const response = await fetch("/api/admin/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserForCity,
          name: newCityName.trim(),
          tier: cityTier,
          realmId: currentRealm?.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification("success", data.message);
        setNewCityName("");
        setSelectedUserForCity("");
        fetchCities();
      } else {
        addNotification("error", data.error || "Failed to create city");
      }
    } catch (error) {
      console.error("Error creating city:", error);
      addNotification("error", "Failed to create city");
    } finally {
      setIsCreatingCity(false);
    }
  };

  const advanceTurn = async () => {
    if (!currentRealm) {
      addNotification("error", "Please select a realm first");
      return;
    }
    
    setIsAdvancingTurn(true);
    try {
      const response = await fetch("/api/admin/advance-turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ realmId: currentRealm.id }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification("success", data.message);
        fetchCities(); // Refresh cities to see updated wealth
      } else {
        addNotification("error", data.error || "Failed to advance turn");
      }
    } catch (error) {
      console.error("Error advancing turn:", error);
      addNotification("error", "Failed to advance turn");
    } finally {
      setIsAdvancingTurn(false);
      setShowTurnModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medieval-gold-600 mx-auto mb-4"></div>
          <p className="text-xl text-medieval-gold-300">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-medieval-steel-300">
            Please sign in to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  if (userRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="medieval-title mb-4 glow-text">🚫 Access Denied</h1>
          <p className="text-xl text-medieval-steel-300">
            You do not have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <RealmRequirement>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8">
        <NotificationContainer />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="medieval-title mb-4 glow-text">👑 Admin Panel</h1>
          <p className="medieval-subtitle italic">
            Manage the realm, grant cities, and advance the turn
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Grant City */}
          <div className="medieval-card p-6">
            <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
              Grant City
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-medieval text-lg text-medieval-gold-300 mb-2">
                  Select User
                </label>
                <select
                  value={selectedUserForCity}
                  onChange={(e) => setSelectedUserForCity(e.target.value)}
                  className="medieval-input w-full"
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medieval text-lg text-medieval-gold-300 mb-2">
                  City Name
                </label>
                <input
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="medieval-input w-full"
                  placeholder="Enter city name"
                />
              </div>

              <div>
                <label className="block font-medieval text-lg text-medieval-gold-300 mb-2">
                  City Tier
                </label>
                <select
                  value={cityTier}
                  onChange={(e) => setCityTier(parseInt(e.target.value))}
                  className="medieval-input w-full"
                >
                  <option value={1}>Tier 1 (10 income/turn)</option>
                  <option value={2}>Tier 2 (15 income/turn)</option>
                  <option value={3}>Tier 3 (40 income/turn)</option>
                  <option value={4}>Tier 4 (55 income/turn)</option>
                  <option value={5}>Tier 5 (70 income/turn)</option>
                </select>
              </div>

              <button
                onClick={createCity}
                disabled={
                  isCreatingCity || !selectedUserForCity || !newCityName.trim()
                }
                className="medieval-button w-full"
              >
                {isCreatingCity ? "Creating..." : "Grant City"}
              </button>
            </div>
          </div>

          {/* Turn Management */}
          <div className="medieval-card p-6">
            <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
              Turn Management
            </h2>

            <div className="space-y-4">
              <p className="text-medieval-steel-300">
                Advance to the next turn to process income, taxes, and resource
                generation for all players.
              </p>

              <button
                onClick={() => setShowTurnModal(true)}
                disabled={isAdvancingTurn}
                className="medieval-button w-full"
              >
                {isAdvancingTurn ? "Processing..." : "Advance to Next Turn"}
              </button>
            </div>
          </div>

          {/* Armies Management */}
          <div className="medieval-card p-6">
            <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
              Armies Management
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medieval text-lg text-medieval-gold-300 mb-2">
                  Select User
                </label>
                <select
                  value={selectedUserForArmies}
                  onChange={(e) => setSelectedUserForArmies(e.target.value)}
                  className="medieval-input w-full"
                >
                  <option value="">Choose a user...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  className="medieval-input flex-1"
                  placeholder="New army name"
                  value={adminArmyName}
                  onChange={(e) => setAdminArmyName(e.target.value)}
                />
                <button
                  className="medieval-button"
                  onClick={adminCreateArmy}
                  disabled={!selectedUserForArmies || !adminArmyName.trim()}
                >
                  Create Army
                </button>
              </div>

              <div className="space-y-2">
                {armies.map((a) => (
                  <div
                    key={a.id}
                    className={`p-3 border rounded-md ${
                      selectedArmyId === a.id
                        ? "border-medieval-gold-400"
                        : "border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medieval text-medieval-gold-300">
                        {a.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="medieval-button-secondary"
                          onClick={() => setSelectedArmyId(a.id)}
                        >
                          Select
                        </button>
                        <button
                          className="medieval-button-secondary"
                          onClick={() => adminDeleteArmy(a.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {a.units && a.units.length > 0 && (
                      <div className="mt-2 text-sm text-medieval-steel-300">
                        {a.units.map((u: any) => (
                          <span key={u.id} className="mr-3">
                            {u.unitType}: {u.quantity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {armies.length === 0 && (
                  <p className="text-medieval-steel-400">No armies</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm">Selected Army</label>
                  <input
                    className="medieval-input w-full"
                    value={selectedArmyId}
                    readOnly
                    placeholder="Select an army above"
                  />
                </div>
                <div>
                  <label className="text-sm">Unit Type</label>
                  <select
                    className="medieval-input w-full"
                    value={adminUnitType}
                    onChange={(e) => setAdminUnitType(e.target.value)}
                  >
                    <option>Militia-At-Arms</option>
                    <option>Pike Men</option>
                    <option>Swordsmen</option>
                    <option>Matchlocks</option>
                    <option>Flintlocks</option>
                    <option>Light Calvary</option>
                    <option>Dragons</option>
                    <option>Heavy Calvary</option>
                    <option>Banner Guard</option>
                    <option>Light Artilery</option>
                    <option>Medium Artilery</option>
                    <option>Heavy Artilery</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    className="medieval-input w-full"
                    value={adminQuantity}
                    onChange={(e) =>
                      setAdminQuantity(
                        Math.max(1, parseInt(e.target.value || "1", 10))
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="medieval-button"
                  onClick={() => adminModifyUnits("POST")}
                  disabled={!selectedArmyId}
                >
                  Add Units
                </button>
                <button
                  className="medieval-button-secondary"
                  onClick={() => adminModifyUnits("DELETE")}
                  disabled={!selectedArmyId}
                >
                  Remove Units
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Transfer Management */}
        <div className="medieval-card p-6">
          <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
            Transfer Ownership
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Item Type</label>
                <select
                  className="medieval-input w-full"
                  value={transferType}
                  onChange={(e) => {
                    setTransferType(e.target.value as "city" | "army");
                    setTransferItemId("");
                  }}
                >
                  <option value="city">City</option>
                  <option value="army">Army</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  {transferType === "city" ? "Select City" : "Select Army"}
                </label>
                <select
                  className="medieval-input w-full"
                  value={transferItemId}
                  onChange={(e) => setTransferItemId(e.target.value)}
                >
                  <option value="">Choose...</option>
                  {transferType === "city"
                    ? cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} (owner:{" "}
                          {users.find((u) => u.id === c.ownerId)?.name ||
                            c.ownerId}
                          )
                        </option>
                      ))
                    : allArmies.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} (owner: {a.owner?.name || a.ownerId})
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">New Owner</label>
                <select
                  className="medieval-input w-full"
                  value={transferToUserId}
                  onChange={(e) => setTransferToUserId(e.target.value)}
                >
                  <option value="">Choose user...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={adminTransferItem}
              disabled={
                !transferItemId || !transferToUserId || isTransferringItem
              }
              className="medieval-button w-full"
            >
              {isTransferringItem ? "Transferring..." : "Transfer"}
            </button>
          </div>
        </div>
        {/* Cities Overview */}
        <div className="medieval-card p-6 mt-8">
          <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
            Cities Overview
          </h2>

          {cities.length === 0 ? (
            <p className="text-medieval-steel-400 text-center py-4">
              No cities have been created yet
            </p>
          ) : (
            <div className="grid gap-4">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-4 bg-medieval-steel-800 rounded border"
                >
                  <div>
                    <div className="font-medieval text-lg text-medieval-gold-300">
                      {city.name}
                    </div>
                    <div className="text-sm text-medieval-steel-400">
                      Tier {city.upgradeTier} • {city.taxRate}% Tax •{" "}
                      {(city.localWealth || 0).toFixed(1)} Wealth
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Turn Confirmation Modal */}
        {showTurnModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="medieval-card p-6 max-w-md mx-4">
              <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4">
                Advance to Next Turn
              </h3>
              <p className="text-medieval-steel-300 mb-6">
                Are you sure you want to go to the next turn? This will mint new
                resources and income for all players.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTurnModal(false)}
                  className="medieval-button-secondary flex-1"
                >
                  No
                </button>
                <button
                  onClick={advanceTurn}
                  className="medieval-button flex-1"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </RealmRequirement>
  );
}
