"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useNotification } from "@/components/Notification";
import { useRealm } from "@/contexts/RealmContext";
import RealmRequirement from "@/components/RealmRequirement";
import ConfirmationModal from "@/components/ConfirmationModal";
import {
  ResourceType,
  RESOURCE_CONFIG,
  isValidResourceType,
} from "@/app/lib/resource-types";

interface TradeOffer {
  id: string;
  creatorId: string;
  realmId: string;
  givingResource: string;
  givingAmount: number;
  receivingResource: string;
  receivingAmount: number;
  maxUses: number;
  usesRemaining: number;
  isActive: boolean;
  createdAt: string;
  creator: {
    id: string;
    name: string | null;
    imageUrl: string | null;
  };
}

export default function TradingPage() {
  const { user, isLoaded } = useUser();
  const { currentRealm } = useRealm();
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<TradeOffer[]>([]);
  const [resources, setResources] = useState<any | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<TradeOffer | null>(null);
  const [newOffer, setNewOffer] = useState({
    givingResource: "wood" as ResourceType,
    givingAmount: 1,
    receivingResource: "currency" as ResourceType,
    receivingAmount: 1,
    maxUses: 1,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRetracting, setIsRetracting] = useState<string | null>(null);

  const { addNotification, NotificationContainer } = useNotification();

  useEffect(() => {
    if (isLoaded && user && currentRealm) {
      Promise.all([fetchCurrentUserId(), fetchResources(), fetchOffers()]).finally(() =>
        setLoading(false)
      );
    } else if (isLoaded && !user) {
      setLoading(false);
    } else if (isLoaded && user && !currentRealm) {
      setLoading(false);
      addNotification("info", "Please select a realm to view trading");
    }
  }, [isLoaded, user, currentRealm]);

  const fetchCurrentUserId = async () => {
    if (!currentRealm) return;
    try {
      const res = await fetch(
        `/api/dashboard/user-data?realmId=${currentRealm.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data.userId || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchResources = async () => {
    if (!currentRealm) return;
    try {
      const res = await fetch(
        `/api/dashboard/resources?realmId=${currentRealm.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOffers = async () => {
    if (!currentRealm) return;
    try {
      const res = await fetch(
        `/api/trade-offers?realmId=${currentRealm.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setOffers(data.offers || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createOffer = async () => {
    if (!currentRealm) return;

    if (newOffer.givingResource === newOffer.receivingResource) {
      addNotification("error", "Cannot offer and request the same resource");
      return;
    }

    if (newOffer.givingAmount <= 0 || newOffer.receivingAmount <= 0) {
      addNotification("error", "Amounts must be positive");
      return;
    }

    if (!Number.isInteger(newOffer.maxUses) || newOffer.maxUses < 1) {
      addNotification("error", "Maximum uses must be an integer >= 1");
      return;
    }

    if (!resources) {
      addNotification("error", "Resources not loaded");
      return;
    }

    const totalNeeded = newOffer.givingAmount * newOffer.maxUses;
    const currentAmount =
      newOffer.givingResource === "currency"
        ? resources.currency
        : resources[newOffer.givingResource];

    if (typeof currentAmount === "number" && currentAmount < totalNeeded) {
      addNotification(
        "error",
        `Insufficient ${newOffer.givingResource}. You need ${totalNeeded} but only have ${currentAmount}`
      );
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/trade-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          realmId: currentRealm.id,
          ...newOffer,
        }),
      });

      if (res.ok) {
        addNotification("success", "Trade offer created successfully");
        setShowCreateModal(false);
        setNewOffer({
          givingResource: "wood",
          givingAmount: 1,
          receivingResource: "currency",
          receivingAmount: 1,
          maxUses: 1,
        });
        await Promise.all([fetchOffers(), fetchResources()]);
      } else {
        const data = await res.json();
        addNotification("error", data.error || "Failed to create trade offer");
      }
    } catch (e) {
      console.error(e);
      addNotification("error", "Failed to create trade offer");
    } finally {
      setIsCreating(false);
    }
  };

  const acceptOffer = async () => {
    if (!selectedOffer) return;

    setIsAccepting(true);
    try {
      const res = await fetch(
        `/api/trade-offers/${selectedOffer.id}/accept`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        addNotification("success", "Trade completed successfully");
        setShowConfirmModal(false);
        setSelectedOffer(null);
        await Promise.all([fetchOffers(), fetchResources()]);
      } else {
        const data = await res.json();
        addNotification("error", data.error || "Failed to accept trade");
      }
    } catch (e) {
      console.error(e);
      addNotification("error", "Failed to accept trade");
    } finally {
      setIsAccepting(false);
    }
  };

  const retractOffer = async (offerId: string) => {
    setIsRetracting(offerId);
    try {
      const res = await fetch(`/api/trade-offers/${offerId}/retract`, {
        method: "POST",
      });

      if (res.ok) {
        addNotification("success", "Trade offer disbanded successfully");
        await fetchOffers();
      } else {
        const data = await res.json();
        addNotification("error", data.error || "Failed to disband offer");
      }
    } catch (e) {
      console.error(e);
      addNotification("error", "Failed to disband offer");
    } finally {
      setIsRetracting(null);
    }
  };

  if (loading) {
    return (
      <RealmRequirement>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medieval-gold-600 mx-auto mb-4"></div>
            <p className="text-xl text-medieval-gold-300">Loading trading...</p>
          </div>
        </div>
      </RealmRequirement>
    );
  }

  const totalOffers = offers.length;
  const myOffers = offers.filter(
    (o) => o.creatorId === user?.id
  ).length;
  const availableTrades = totalOffers - myOffers;

  return (
    <RealmRequirement>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-4 md:p-8">
        <NotificationContainer />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-medieval text-4xl md:text-5xl text-medieval-gold-300 mb-4 flex items-center justify-center gap-3">
              <span>💱</span>
              <span>Trade Marketplace</span>
            </h1>
            <p className="text-medieval-steel-300 text-lg">
              Propose trade offers with other noble houses. Set your terms and
              watch your coffers grow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="modern-card p-4 text-center"
            >
              <div className="font-medieval text-2xl text-medieval-gold-300 mb-1">
                {totalOffers}
              </div>
              <div className="text-medieval-steel-300 text-sm uppercase tracking-wide">
                Active Offers
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="modern-card p-4 text-center"
            >
              <div className="font-medieval text-2xl text-medieval-gold-300 mb-1">
                {myOffers}
              </div>
              <div className="text-medieval-steel-300 text-sm uppercase tracking-wide">
                Your Offers
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="modern-card p-4 text-center"
            >
              <div className="font-medieval text-2xl text-medieval-gold-300 mb-1">
                {availableTrades}
              </div>
              <div className="text-medieval-steel-300 text-sm uppercase tracking-wide">
                Available Trades
              </div>
            </motion.div>
          </div>

          {resources && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="modern-card p-4 mb-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💰</span>
                <span className="font-medieval text-medieval-gold-300 uppercase text-sm">
                  Your Resources
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(RESOURCE_CONFIG).map(([key, { emoji, name }]) => (
                  <div
                    key={key}
                    className="bg-steel-900/50 border border-gold-600/30 rounded px-3 py-2 text-center"
                  >
                    <div className="text-xs text-steel-400 uppercase mb-1">
                      {name}
                    </div>
                    <div className="font-medieval text-white">
                      {key === "currency"
                        ? resources.currency?.toFixed(2) || 0
                        : resources[key] || 0}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex justify-center mb-6">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowCreateModal(true)}
              className="medieval-button px-6 py-3 text-lg"
            >
              ➕ Create New Offer
            </motion.button>
          </div>

          <div className="max-w-7xl mx-auto">
            {offers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="modern-card p-12 text-center"
              >
                <p className="text-medieval-gold-300 font-medieval uppercase mb-2 text-xl">
                  No Active Trades
                </p>
                <p className="text-medieval-steel-300">
                  Be the first to post a trade offer!
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {offers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="modern-card overflow-hidden hover:border-gold-500/50 transition-colors"
                  >
                    <div className="bg-steel-900 border-b border-gold-600/30 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-600">
                          {offer.creator.imageUrl ? (
                            <Image
                              src={offer.creator.imageUrl}
                              alt={offer.creator.name || "User"}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-steel-800 flex items-center justify-center text-gold-400">
                              {offer.creator.name?.[0]?.toUpperCase() || "?"}
                            </div>
                          )}
                        </div>
                        <span className="font-medieval text-white text-sm uppercase">
                          {offer.creator.name || "Unknown User"}
                        </span>
                      </div>
                      <div className="text-steel-400 text-xs">
                        {offer.usesRemaining}/{offer.maxUses} uses
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-4">
                        <div className="bg-steel-900/50 border border-gold-600/30 rounded-lg p-3 text-center">
                          <div className="text-2xl mb-1">
                            {RESOURCE_CONFIG[offer.givingResource.toLowerCase() as ResourceType]?.emoji}
                          </div>
                          <div className="font-medieval text-green-400 mb-1">
                            {offer.givingAmount}
                          </div>
                          <div className="text-steel-400 text-xs uppercase">
                            {RESOURCE_CONFIG[offer.givingResource.toLowerCase() as ResourceType]?.name}
                          </div>
                          <div className="text-steel-600 text-[10px] mt-1 uppercase">
                            Offering
                          </div>
                        </div>

                        <div className="text-gold-400 text-2xl">⇄</div>

                        <div className="bg-steel-900/50 border border-gold-600/30 rounded-lg p-3 text-center">
                          <div className="text-2xl mb-1">
                            {RESOURCE_CONFIG[offer.receivingResource.toLowerCase() as ResourceType]?.emoji}
                          </div>
                          <div className="font-medieval text-red-400 mb-1">
                            {offer.receivingAmount}
                          </div>
                          <div className="text-steel-400 text-xs uppercase">
                            {RESOURCE_CONFIG[offer.receivingResource.toLowerCase() as ResourceType]?.name}
                          </div>
                          <div className="text-steel-600 text-[10px] mt-1 uppercase">
                            Requesting
                          </div>
                        </div>
                      </div>

                      {offer.creatorId === currentUserId ? (
                        <button
                          onClick={() => retractOffer(offer.id)}
                          disabled={isRetracting === offer.id}
                          className="w-full medieval-button-secondary border-red-500/50 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {isRetracting === offer.id
                            ? "Disbanding..."
                            : "Disband Offer"}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedOffer(offer);
                            setShowConfirmModal(true);
                          }}
                          className="w-full medieval-button"
                        >
                          Accept Trade
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showCreateModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowCreateModal(false);
              }
            }}
          >
            <div
              className="medieval-card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medieval text-2xl text-medieval-gold-300">
                    Create Trade Offer
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-medieval-gold-600 hover:text-red-400 text-3xl transition-colors"
                  >
                    ×
                  </button>
                </div>

                <p className="text-medieval-steel-300 mb-6 text-sm">
                  Set the terms of your trade. Other players can accept your
                  offer until all uses are consumed.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-medieval-gold-300 uppercase text-xs tracking-wide mb-2 block">
                      You Offer
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        value={newOffer.givingAmount}
                        onChange={(e) =>
                          setNewOffer({
                            ...newOffer,
                            givingAmount: parseFloat(e.target.value) || 1,
                          })
                        }
                        className="w-24 medieval-input"
                      />
                      <select
                        value={newOffer.givingResource}
                        onChange={(e) =>
                          setNewOffer({
                            ...newOffer,
                            givingResource: e.target.value as ResourceType,
                          })
                        }
                        className="flex-1 medieval-input"
                      >
                        {Object.entries(RESOURCE_CONFIG).map(([key, { emoji, name }]) => (
                          <option key={key} value={key}>
                            {emoji} {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-medieval-gold-300 uppercase text-xs tracking-wide mb-2 block">
                      You Request
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        value={newOffer.receivingAmount}
                        onChange={(e) =>
                          setNewOffer({
                            ...newOffer,
                            receivingAmount: parseFloat(e.target.value) || 1,
                          })
                        }
                        className="w-24 medieval-input"
                      />
                      <select
                        value={newOffer.receivingResource}
                        onChange={(e) =>
                          setNewOffer({
                            ...newOffer,
                            receivingResource: e.target.value as ResourceType,
                          })
                        }
                        className="flex-1 medieval-input"
                      >
                        {Object.entries(RESOURCE_CONFIG).map(([key, { emoji, name }]) => (
                          <option key={key} value={key}>
                            {emoji} {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-medieval-gold-300 uppercase text-xs tracking-wide mb-2 block">
                      Maximum Uses
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newOffer.maxUses}
                      onChange={(e) =>
                        setNewOffer({
                          ...newOffer,
                          maxUses: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full medieval-input"
                    />
                    <p className="text-steel-600 text-xs mt-1">
                      Your offer will expire after being accepted this many
                      times
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="medieval-button-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createOffer}
                    disabled={isCreating}
                    className="medieval-button flex-1 disabled:opacity-50"
                  >
                    {isCreating ? "Creating..." : "Post Offer"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConfirmModal && selectedOffer && (
          <ConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => {
              setShowConfirmModal(false);
              setSelectedOffer(null);
            }}
            onConfirm={acceptOffer}
            title="Confirm Trade"
            message={`Are you sure you want to trade with ${selectedOffer.creator.name || "Unknown User"}? You will give ${RESOURCE_CONFIG[selectedOffer.receivingResource.toLowerCase() as ResourceType]?.emoji} ${selectedOffer.receivingAmount} ${RESOURCE_CONFIG[selectedOffer.receivingResource.toLowerCase() as ResourceType]?.name} and receive ${RESOURCE_CONFIG[selectedOffer.givingResource.toLowerCase() as ResourceType]?.emoji} ${selectedOffer.givingAmount} ${RESOURCE_CONFIG[selectedOffer.givingResource.toLowerCase() as ResourceType]?.name}.`}
            confirmText={isAccepting ? "Processing..." : "Confirm Trade"}
            cancelText="Cancel"
          />
        )}
      </div>
    </RealmRequirement>
  );
}

