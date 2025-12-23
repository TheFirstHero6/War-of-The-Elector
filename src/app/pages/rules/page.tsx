"use client";

import Image from "next/image";
import logo from "../../../components/logo.png";
import { useState } from "react";

export default function RulesPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-foreground p-8 pt-28">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${(i * 61) % 100}%`, top: `${(i * 37) % 100}%` }}
          >
            <svg className="h-12 w-12" fill="none" viewBox="0 0 40 40">
              <path
                d="M36 34V30H34V34H30V36H34V40H36V36H40V34H36ZM36 4V0H34V4H30V6H34V10H36V6H40V4H36ZM6 34V30H4V34H0V36H4V40H6V36H10V34H6ZM6 4V0H4V4H0V6H4V10H6V6H10V4H6Z"
                fill="var(--theme-gold)"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12 mb-12">
            <div className="relative group">
              <Image
                src={logo}
                alt="War of the Elector"
                width={120}
                height={120}
                className="rounded-full border-4 border-[var(--theme-accent)] transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-[var(--theme-gold)] to-[var(--theme-accent)] rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500"></div>
            </div>

            <div className="text-center lg:text-left">
              <h1 className="font-[Cinzel] text-4xl md:text-5xl text-[var(--theme-gold)] mb-4 uppercase tracking-wide">
                📜 THE COMPLETE RULES OF WAR OF THE ELECTOR
              </h1>
              <p className="font-[Playfair_Display] text-[var(--theme-gold)]/80 italic text-lg md:text-xl">
                "Master the ancient laws that govern the realm and forge your
                destiny..."
              </p>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12 mb-12">
          <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-8 uppercase text-center">
            🏰 INTRODUCTION TO THE REALM
          </h2>

          <div className="space-y-6">
            <p className="font-[Playfair_Display] text-gray-200 text-lg leading-relaxed">
              Welcome to the War of the Elector, a strategic multiplayer game
              based on the Imperium Fragmentum (2nd Edition) ruleset. Command
              your cities, construct buildings, manage resources, and build your
              realm through turn-based economic gameplay.
            </p>

            <div className="bg-[var(--theme-card-bg)] p-8 rounded-lg border border-[var(--theme-border)] mt-6">
              <p className="font-[Dancing_Script] text-[var(--theme-gold)]/80 text-lg leading-relaxed italic">
                "I have poured many hours into the original game and many more
                into this refined version of it, I really do hope that everyone
                enjoys it. A special thanks to people who helped me refine this
                2nd edition of the game: Eli, for help with game balancing; Ben,
                for help with balancing, map building, and combat testing;
                Aidan, for taking a long time to make a well done detailed map
                that also was balanced for spawn locations; And finally to you
                the player for giving my dream project a chance :)"
              </p>
              <p className="font-[Playfair_Display] text-gray-400 text-sm mt-4 text-right">
                — Noah, From the Imperium Fragmentum (2nd Edition) Foreword
              </p>
            </div>
          </div>
        </div>

        {/* How to Take Your Turn Section */}
        <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12 mb-12">
          <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-8 uppercase text-center">
            🔄 HOW TO TAKE YOUR TURN
          </h2>

          <div className="space-y-8">
            <p className="font-[Playfair_Display] text-gray-200 text-lg text-center mb-8">
              Each turn follows a specific sequence of phases. Understanding
              this order is crucial for effective gameplay.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-[var(--theme-card-bg)] p-6 rounded-lg border border-[var(--theme-border)] transition-all duration-300 hover:border-[var(--theme-accent)]">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      💰
                    </span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      1. Collect Income (Automatic)
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    Your cities generate income based on their tier level and
                    local wealth. Each turn, cities gain income according to
                    their tier level.{" "}
                    <strong>
                      City income per turn = Tier level income (10, 15, 40, 55,
                      or 70)
                    </strong>{" "}
                    This income is added to the city's total wealth. You can
                    then tax a percentage of the city's total wealth, which is
                    deducted from the city but added to your personal wealth.
                  </p>
                </div>

                <div className="bg-[var(--theme-card-bg)] p-6 rounded-lg border border-[var(--theme-border)] transition-all duration-300 hover:border-[var(--theme-accent)]">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      ⚔️
                    </span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      2. Pay Upkeep and Move Armies
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    Keep your armies in check by paying their upkeep costs.
                  </p>
                </div>

                <div className="bg-[var(--theme-card-bg)] p-6 rounded-lg border border-[var(--theme-border)] transition-all duration-300 hover:border-[var(--theme-accent)]">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      📜
                    </span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      3. Receive Event
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    An event triggers for all players, providing opportunities
                    for intrigue, diplomacy, and strategic decisions that can
                    affect your realm.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[var(--theme-card-bg)] p-6 rounded-lg border border-[var(--theme-border)] transition-all duration-300 hover:border-[var(--theme-accent)]">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      🏗️
                    </span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      4. Build and Recruitment
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    Construct buildings and recruit units using your wealth and
                    resources. Costs are paid from your personal wealth, not the
                    cities' wealth.
                  </p>
                </div>

                <div className="bg-[var(--theme-card-bg)] p-6 rounded-lg border border-[var(--theme-border)] transition-all duration-300 hover:border-[var(--theme-accent)]">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      🗺️
                    </span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      5. Give Movement Orders
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    At the end of your turn, write down movement orders for
                    armies that will move next turn. Give these to the game
                    master before the turn passes.
                  </p>
                </div>

                <div className="bg-[var(--theme-card-bg)] p-6 rounded-lg border border-[var(--theme-border)] transition-all duration-300 hover:border-[var(--theme-accent)]">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      📊
                    </span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      Tax Collection
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    Set tax rates in 5% increments. You tax a percentage of your
                    city's total wealth, not just the income gained that turn.{" "}
                    <strong>
                      Tax amount = (%tax rate × City's total wealth)
                    </strong>{" "}
                    The taxed amount is deducted from the city's wealth and
                    added to your personal wealth. Cities continue to gain their
                    normal income per turn regardless of taxation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Overview Section */}
        <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12 mb-12">
          <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-8 uppercase text-center">
            🎮 How the Game Works
          </h2>

          <div className="space-y-8">
            <p className="medieval-text text-lg text-center mb-8">
              War of the Elector is a strategic multiplayer game where you build
              cities, manage resources, and compete for dominance through
              economic and military might.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">🏰</span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      City Management
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    Each city has a tier level (1-5) that determines its income
                    generation. Cities accumulate wealth over time, and you can
                    tax a percentage of their total accumulated wealth. Higher
                    tier cities generate more income per turn but cost more to
                    upgrade.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">🏗️</span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      Building Construction
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    Construct buildings to generate resources and improve your
                    cities. Buildings have different rarities (Common/Rare) and
                    require specific resources. Each building provides ongoing
                    benefits to your economy.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">⚔️</span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      Military Strategy
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    Recruit and maintain armies to defend your territory and
                    expand your influence. Units have different tiers (T1-T5)
                    representing training and equipment quality. Higher tier
                    units are more effective but cost more to maintain.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">💰</span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      Economic System
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    Balance taxation with city growth. Set tax rates in 5%
                    increments to extract wealth from your cities' total wealth.
                    Cities gain fixed income each turn regardless of taxation,
                    but high taxes will drain accumulated city wealth over time.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">🗺️</span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      Turn-Based Gameplay
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    The game progresses in turns, with each turn following the
                    5-phase sequence. Four turns make up one year. Time
                    management and planning ahead are crucial for success in
                    this strategic environment.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">👑</span>
                    <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                      Victory Conditions
                    </h3>
                  </div>
                  <p className="font-[Playfair_Display] text-gray-200">
                    Compete to build the most prosperous realm through city
                    mastery, economic dominance, and military excellence. The
                    player with the strongest combination of these elements will
                    emerge victorious.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12 mb-12">
          <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-8 uppercase text-center">
            💎 The Five Core Resources
          </h2>

          <div className="space-y-8">
            <p className="medieval-text text-lg text-center mb-8">
              Your realm's prosperity depends on managing these five essential
              resources effectively.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <div
                className={`bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                  hoveredResource === "crops"
                    ? "border-medieval-gold-400 shadow-glow-gold"
                    : ""
                }`}
                onMouseEnter={() => setHoveredResource("crops")}
                onMouseLeave={() => setHoveredResource(null)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3 transition-transform duration-300 hover:rotate-12">
                    🌾
                  </span>
                  <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                    Food
                  </h3>
                </div>
                <p className="font-[Playfair_Display] text-gray-200">
                  Essential for feeding your population and armies. Produced by
                  Fields and other agricultural buildings. Critical for
                  maintaining your realm's food security.
                </p>
              </div>

              <div
                className={`bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                  hoveredResource === "wood"
                    ? "border-medieval-gold-400 shadow-glow-gold"
                    : ""
                }`}
                onMouseEnter={() => setHoveredResource("wood")}
                onMouseLeave={() => setHoveredResource(null)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3 transition-transform duration-300 hover:rotate-12">
                    🌳
                  </span>
                  <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                    Wood
                  </h3>
                </div>
                <p className="font-[Playfair_Display] text-gray-200">
                  The foundation of construction and industry. Essential for
                  building structures, weapons, and tools. Gathered from forests
                  and processed in Sawmills.
                </p>
              </div>

              <div
                className={`bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                  hoveredResource === "stone"
                    ? "border-medieval-gold-400 shadow-glow-gold"
                    : ""
                }`}
                onMouseEnter={() => setHoveredResource("stone")}
                onMouseLeave={() => setHoveredResource(null)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3 transition-transform duration-300 hover:rotate-12">
                    🪨
                  </span>
                  <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                    Stone
                  </h3>
                </div>
                <p className="font-[Playfair_Display] text-gray-200">
                  Required for fortifications, advanced buildings, and defensive
                  structures. Mined from quarries and stone deposits. Essential
                  for city upgrades.
                </p>
              </div>

              <div
                className={`bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                  hoveredResource === "metal"
                    ? "border-medieval-gold-400 shadow-glow-gold"
                    : ""
                }`}
                onMouseEnter={() => setHoveredResource("metal")}
                onMouseLeave={() => setHoveredResource(null)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3 transition-transform duration-300 hover:rotate-12">
                    ⚒️
                  </span>
                  <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                    Metal
                  </h3>
                </div>
                <p className="font-[Playfair_Display] text-gray-200">
                  The forge of industry and warfare. Essential for weapons,
                  armor, and advanced tools. Mined from metal deposits and
                  processed in forges.
                </p>
              </div>

              <div
                className={`bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                  hoveredResource === "produce"
                    ? "border-medieval-gold-400 shadow-glow-gold"
                    : ""
                }`}
                onMouseEnter={() => setHoveredResource("produce")}
                onMouseLeave={() => setHoveredResource(null)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3 transition-transform duration-300 hover:rotate-12">
                    🐄
                  </span>
                  <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                    Produce
                  </h3>
                </div>
                <p className="font-[Playfair_Display] text-gray-200">
                  Livestock and animal products. Provides food, materials, and
                  trade goods. Raised in Pastures and managed through
                  agricultural expertise.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* City Management Section */}
        <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12 mb-12">
          <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-8 uppercase text-center">
            🏘️ City Management & Administration
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🏰</span>
                  City Fundamentals
                </h3>
                <div className="space-y-4">
                  <p className="font-[Playfair_Display] text-gray-200">
                    Cities are the heart of your realm, each with unique
                    characteristics and management requirements.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      City Properties
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Name:</strong> Customizable city names for
                          personalization
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Upgrade Tier:</strong> Levels 1-5, affecting
                          income generation
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Local Wealth:</strong> Internal city treasury
                          separate from your resources
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tax Rate:</strong> Set as a percent of the
                          city's total wealth (1-100%)
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 mt-4">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      City Upgrade Costs
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tier 2:</strong> 100 Currency, 20 Wood, 20
                          Stone
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tier 3:</strong> 300 Currency, 40 Wood, 40
                          Stone
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tier 4:</strong> 900 Currency, 90 Wood, 90
                          Stone
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tier 5:</strong> 2700 Currency, 180 Wood, 180
                          Stone
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">📊</span>
                  Economic Management
                </h3>
                <div className="space-y-4">
                  <p className="font-[Playfair_Display] text-gray-200">
                    Master the art of taxation and wealth management to maximize
                    your realm's prosperity.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Taxation System
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          Tax rates must be set in 5% increments (5%, 10%, 15%,
                          etc.)
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          Taxes are calculated from the city's local wealth
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          Collected taxes are added to your main currency
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          Tax collection reduces the city's local wealth
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🏗️</span>
                  Building Construction
                </h3>
                <div className="space-y-4">
                  <p className="font-[Playfair_Display] text-gray-200">
                    Construct buildings to generate resources, improve
                    efficiency, and expand your economic capabilities.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Available Buildings
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medieval text-medieval-gold-300 mb-1">
                          Common Buildings
                        </h5>
                        <ul className="space-y-1 ml-4">
                          <li className="medieval-text text-sm">
                            • <strong>Sawmill:</strong> 50 Currency, 20 Wood, 10
                            Stone
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Quarry:</strong> 50 Currency, 20 Wood
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Fields:</strong> 50 Currency, 20 Wood
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Pastures:</strong> 50 Currency, 20 Wood,
                            10 Produce
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Infantry Barracks:</strong> 50 Currency,
                            20 Wood, 20 Stone, 10 Metal, 10 Produce
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Ranged Barracks:</strong> 50 Currency, 20
                            Wood, 20 Stone, 10 Produce
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Town Square:</strong> 50 Currency, 20
                            Wood, 20 Stone, 10 Produce
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medieval text-medieval-gold-300 mb-1">
                          Rare Buildings
                        </h5>
                        <ul className="space-y-1 ml-4">
                          <li className="medieval-text text-sm">
                            • <strong>Mine:</strong> 150 Currency, 30 Wood, 30
                            Stone
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Cavalry Barracks:</strong> 150 Currency,
                            30 Wood, 20 Stone, 15 Metal, 10 Produce, 10 Produce
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Temple:</strong> 150 Currency, 30 Wood, 30
                            Stone
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Trading Post:</strong> 150 Currency, 30
                            Wood, 30 Stone, 20 Metal, 10 Produce, 10 Produce
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">⚙️</span>
                  Construction Process
                </h3>
                <div className="space-y-4">
                  <p className="font-[Playfair_Display] text-gray-200">
                    Understanding the building construction system is crucial
                    for efficient city development.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Construction Rules
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          You must have sufficient resources to construct
                          buildings
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          Resources are deducted immediately upon construction
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>Buildings are permanent once constructed</span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          There can be 4 buildings in a city, so choose wisely
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Turn-Based Economy Section */}
        <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12 mb-12">
          <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-8 uppercase text-center">
            🔄 Turn-Based Economic System
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">💰</span>
                  Income Generation
                </h3>
                <div className="space-y-4">
                  <p className="font-[Playfair_Display] text-gray-200">
                    Each turn, your cities generate income based on their
                    upgrade tier and economic activity.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      City Income Formula
                    </h4>
                    <div className="space-y-3">
                      <p className="medieval-text text-sm">
                        <strong>
                          City income per turn = Tier level income (fixed
                          amount)
                        </strong>
                      </p>
                      <p className="medieval-text text-sm">
                        <strong>
                          Tax amount = (%tax rate × City's total wealth)
                        </strong>
                      </p>
                      <p className="medieval-text text-sm">
                        <strong>
                          City wealth after tax = (Previous wealth + Income) -
                          Tax amount
                        </strong>
                      </p>
                      <ul className="space-y-2">
                        <li className="medieval-text flex items-start">
                          <span className="text-medieval-gold-400 mr-2">•</span>
                          <span>
                            <strong>Tier 1:</strong> 10 income per turn
                          </span>
                        </li>
                        <li className="medieval-text flex items-start">
                          <span className="text-medieval-gold-400 mr-2">•</span>
                          <span>
                            <strong>Tier 2:</strong> 15 income per turn
                          </span>
                        </li>
                        <li className="medieval-text flex items-start">
                          <span className="text-medieval-gold-400 mr-2">•</span>
                          <span>
                            <strong>Tier 3:</strong> 40 income per turn
                          </span>
                        </li>
                        <li className="medieval-text flex items-start">
                          <span className="text-medieval-gold-400 mr-2">•</span>
                          <span>
                            <strong>Tier 4:</strong> 55 income per turn
                          </span>
                        </li>
                        <li className="medieval-text flex items-start">
                          <span className="text-medieval-gold-400 mr-2">•</span>
                          <span>
                            <strong>Tier 5:</strong> 70 income per turn
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🏭</span>
                  Resource Production
                </h3>
                <div className="space-y-4">
                  <p className="font-[Playfair_Display] text-gray-200">
                    Buildings generate resources each turn, providing a steady
                    income stream for your realm.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Building Production
                    </h4>
                    <p className="medieval-text text-sm italic">
                      Specific resource generation values will be determined
                      based on building types and game balance. Each building
                      will contribute to your resource stockpile every turn.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">📈</span>
                  Tax Collection Process
                </h3>
                <div className="space-y-4">
                  <p className="font-[Playfair_Display] text-gray-200">
                    The taxation system is the core of your economic power,
                    converting local wealth into usable currency.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Tax Calculation
                    </h4>
                    <div className="space-y-2">
                      <p className="medieval-text text-sm">
                        <strong>Step 1:</strong> City generates income and adds
                        it to local wealth
                      </p>
                      <p className="medieval-text text-sm">
                        <strong>Step 2:</strong> Tax amount = (Tax Rate % ×
                        Local Wealth)
                      </p>
                      <p className="medieval-text text-sm">
                        <strong>Step 3:</strong> Tax amount is added to your
                        main currency
                      </p>
                      <p className="medieval-text text-sm">
                        <strong>Step 4:</strong> Tax amount is deducted from
                        city's local wealth
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">⏰</span>
                  Turn Advancement
                </h3>
                <div className="space-y-4">
                  <p className="font-[Playfair_Display] text-gray-200">
                    Turn advancement is controlled by administrators to ensure
                    proper game flow and economic processing.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Turn Processing
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>Resource generation from all buildings</span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          City income calculation and local wealth updates
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>Tax collection and currency distribution</span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>Economic balance updates across all players</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Controls Section */}
        <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12 mb-12">
          <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-8 uppercase text-center">
            👑 Administrative Powers & Game Management
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-6">
                🏘️ City Granting Authority
              </h3>
              <div className="space-y-4">
                <p className="font-[Playfair_Display] text-gray-200">
                  Administrators wield the power to shape the realm by granting
                  cities to players, expanding their territories and economic
                  potential.
                </p>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-2">
                      🏰 City Creation Process
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text text-sm">
                        • Select a player from the user list
                      </li>
                      <li className="medieval-text text-sm">
                        • Enter a custom city name
                      </li>
                      <li className="medieval-text text-sm">
                        • City starts at Tier 1 with 100 local wealth
                      </li>
                      <li className="medieval-text text-sm">
                        • Default tax rate of 5% is applied
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-2">
                      📊 Realm Oversight
                    </h4>
                    <p className="medieval-text text-sm">
                      Monitor all cities across the realm, tracking wealth
                      accumulation, building progress, and economic development
                      of all players.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-6">
                🔄 Turn Management System
              </h3>
              <div className="space-y-4">
                <p className="font-[Playfair_Display] text-gray-200">
                  The turn-based economy requires careful administration to
                  maintain game balance and ensure fair economic processing for
                  all players.
                </p>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-2">
                      ⚠️ Turn Advancement Protocol
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text text-sm">
                        • Confirmation modal prevents accidental advancement
                      </li>
                      <li className="medieval-text text-sm">
                        • Processes all cities simultaneously
                      </li>
                      <li className="medieval-text text-sm">
                        • Updates all player resources and wealth
                      </li>
                      <li className="medieval-text text-sm">
                        • Maintains economic balance across the realm
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-2">
                      💰 Economic Processing
                    </h4>
                    <p className="medieval-text text-sm">
                      Each turn processes income generation, tax collection,
                      resource production, and wealth distribution across all
                      players simultaneously.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Interface Section */}
        <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12 mb-12">
          <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-8 uppercase text-center">
            🎮 Game Interface & Navigation
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-2xl mr-3">🏰</span>
                Dashboard
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                <ul className="space-y-2">
                  <li className="medieval-text text-sm">
                    • View your current resources
                  </li>
                  <li className="medieval-text text-sm">
                    • Transfer resources to other players
                  </li>
                  <li className="medieval-text text-sm">
                    • Access admin functions (if applicable)
                  </li>
                  <li className="medieval-text text-sm">
                    • Monitor realm statistics
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-2xl mr-3">🏘️</span>
                Cities
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                <ul className="space-y-2">
                  <li className="medieval-text text-sm">
                    • View all your cities
                  </li>
                  <li className="medieval-text text-sm">
                    • Access individual city management
                  </li>
                  <li className="medieval-text text-sm">
                    • Monitor city wealth and buildings
                  </li>
                  <li className="medieval-text text-sm">
                    • Construct new buildings
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-2xl mr-3">👑</span>
                Admin Panel
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                <ul className="space-y-2">
                  <li className="medieval-text text-sm">
                    • Grant cities to players
                  </li>
                  <li className="medieval-text text-sm">
                    • Advance turns for all players
                  </li>
                  <li className="medieval-text text-sm">
                    • Monitor realm-wide statistics
                  </li>
                  <li className="medieval-text text-sm">
                    • Oversee economic balance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Victory Conditions Section */}
        <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12 mb-12">
          <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-8 uppercase text-center">
            🏆 Paths to Victory
          </h2>

          <div className="space-y-8">
            <p className="medieval-text text-lg text-center">
              The ultimate goal is to build the most prosperous and powerful
              realm through strategic city management, economic growth, and
              resource mastery.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="text-5xl">🏘️</div>
                <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                  City Mastery
                </h3>
                <p className="font-[Playfair_Display] text-gray-200">
                  Build the most cities with the highest upgrade tiers and local
                  wealth. Expand your territorial control and economic influence
                  across the realm.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="text-5xl">💰</div>
                <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                  Economic Dominance
                </h3>
                <p className="font-[Playfair_Display] text-gray-200">
                  Accumulate vast resources and currency through efficient city
                  management, optimal tax rates, and strategic building
                  construction.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="text-5xl">🏗️</div>
                <h3 className="font-[Cinzel] text-xl text-[var(--theme-gold)] uppercase">
                  Building Excellence
                </h3>
                <p className="font-[Playfair_Display] text-gray-200">
                  Construct the most advanced buildings and optimize your
                  economic output. Master the art of resource production and
                  industrial development.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Combat Mechanics Section */}
        <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12 mb-12">
          <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-8 uppercase text-center">
            ⚔️ Combat Mechanics & Unit Stats
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-3xl mr-3">🔄</span>
                Turn Structure
              </h3>
              <p className="font-[Playfair_Display] text-gray-200 mb-4">
                Each combat turn consists of five phases, executed in order:
              </p>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 space-y-3">
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">1. Leadership Phase</strong> - Command decisions and strategic planning
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">2. Movement Phase</strong> - Units move across the battlefield
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">3. Shooting Phase</strong> - Ranged units attack
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">4. Charge Phase</strong> - Units declare and execute charges
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">5. Fight Phase</strong> - Melee combat resolution
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-3xl mr-3">⚡</span>
                Reaction Points
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 space-y-3">
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Determination:</strong> At the beginning of each battle, each player rolls a d4 and adds 1 to determine their reaction points per round. This gives each player 2-5 reaction points per round.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Usage:</strong> When an enemy unit charges at you, you may spend one of your reaction points to perform a reaction action (such as formations like Square, Turn to Face, etc.). Reaction points allow you to respond defensively to incoming charges.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Banner Guard Exception:</strong> Banner Guard units can perform reactions for free, without spending a reaction point. This makes them valuable defensive units that can react for free, not counting towards your reaction points that round (Only one time per round). Note: Banner Guard is a type of cavalry and receives all normal cavalry bonuses (including +4 to hit when charging) in addition to its Banner Guard abilities.
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-3xl mr-3">🏃</span>
                Movement Phase
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 space-y-3">
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Standard Movement:</strong> All units have a base movement of 6 inches.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Cavalry Movement:</strong> Units designated as Cavalry (Light Cav, Heavy Cav, Dragoons) have a base movement of 12 inches.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Artillery Bonus:</strong> Light Artillery receives +6 inches to movement (total 12 inches).
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-3xl mr-3">🏹</span>
                Shooting Phase
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 space-y-4">
                <div>
                  <strong className="text-medieval-gold-300">Range Limits:</strong>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li className="medieval-text">• Matchlock, Dragoons, and Flintlocks: 18"</li>
                    <li className="medieval-text">• Light Artillery: 24"</li>
                    <li className="medieval-text">• Medium Artillery: 36"</li>
                    <li className="medieval-text">• Heavy Artillery: 48"</li>
                  </ul>
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Attacks:</strong> Base 2 attacks per unit. Medium Artillery receives +1 additional shot per fire.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Hit Logic:</strong> Roll d20 ≥ Target Number. Target Number is determined by unit Tier (see Unit Tiers section).
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Hit Modifiers:</strong>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>• Matchlocks: +2 to hit when shooting</li>
                    <li>• Heavy Artillery: Can fire in an arc</li>
                  </ul>
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Damage:</strong> 1 successful hit = 1 Wound.
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-3xl mr-3">💥</span>
                Charge Phase
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 space-y-3">
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Mechanic:</strong> Units roll a d6 to determine charge distance in inches (Roll 1 = 1 inch, Roll 6 = 6 inches).
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Eligibility:</strong> Infantry and Cavalry may charge.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Cavalry Bonus:</strong> Heavy Cav receives a +3 charge bonus (distance/effect context).
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Reactions:</strong> When a unit charges at you, you may spend a reaction point to perform a reaction action (see Reaction Points section). Banner Guard can react for free.
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-3xl mr-3">⚔️</span>
                Fight Phase (Melee Combat)
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 space-y-4">
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Attacks:</strong> Base 2 attacks per unit.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Hit Logic:</strong> Roll d20 ≥ Target Number (from Tier system).
                </div>
                <div>
                  <strong className="text-medieval-gold-300">Situational Hit Modifiers (Add to d20 Roll):</strong>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li className="medieval-text">• Pikemen: +2 to hit vs. Mounted units</li>
                    <li className="medieval-text">• Swordsmen: +3 to hit vs. Infantry units</li>
                    <li className="medieval-text">• Flintlocks: +2 to hit vs. Melee Infantry</li>
                    <li className="medieval-text">• Cavalry (Charge): +4 to hit if the unit charged this turn (includes Banner Guard, as it is a type of cavalry)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-medieval-gold-300">Flanking Bonuses (to Number of Attacks, NOT hit chance):</strong>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li className="medieval-text">• Side Charge: +2 to Number of Attacks</li>
                    <li className="medieval-text">• Back Charge: +3 to Number of Attacks</li>
                  </ul>
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Damage:</strong> 1 successful hit = 1 Wound. If Wounds ≥ Unit Health, the unit dies.
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-3xl mr-3">🎯</span>
                Unit Tiers & Hit Targets
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 space-y-4">
                <p className="font-[Playfair_Display] text-gray-200">
                  Units can be upgraded through 5 tiers (T1-T5). Most units start at Tier 2 when recruited. Artillery units (Light, Medium, Heavy) automatically start at Tier 3, and Banner Guard automatically starts at Tier 5. Higher tier units have better hit chances against lower tier units.
                </p>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Hit Target System:</strong> The hit target (x+) is determined by the attacker's tier vs. the defender's tier. For example, a Tier 3 unit attacking a Tier 2 unit needs a 7+ to hit, while a Tier 5 unit attacking a Tier 1 unit only needs a 2+.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Upgrade Cost:</strong> Upgrading a unit costs 20 currency per tier level.
                </div>
                <p className="font-[Playfair_Display] text-gray-200 italic text-sm">
                  Click on any unit in your army roster to view detailed stats at all tiers.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-3xl mr-3">😰</span>
                Morale & Unit States
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 space-y-4">
                <div>
                  <strong className="text-medieval-gold-300">Morale Checks:</strong>
                  <p className="medieval-text mt-2">A check is required at the end of the round if:</p>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li className="medieval-text">• Unit Health drops below 50%</li>
                    <li className="medieval-text">• Unit was successfully hit by Artillery</li>
                  </ul>
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Artillery Debuff:</strong> Hitting a unit causes a -3 penalty to their Morale Check. Heavy Artillery inflicts a permanent flat debuff for the remainder of the game.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Failure Consequence:</strong> The unit "Breaks" (is removed from play/dies). If the Morale Check failure was caused by damage from a Melee Unit, the broken unit is "Captured" by the attacker rather than simply destroyed.
                </div>
                <div className="medieval-text text-sm italic">
                  Note: Specific morale save mechanics are still being finalized (TBD).
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-3xl mr-3">🛡️</span>
                Unit Formations
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 space-y-3">
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Condensed:</strong> Immovable. Negates enemy frontal charge bonus. If Pike vs Cav, reflects charge bonus back at Cav. -2 to be hit by ranged.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Loose:</strong> -4 to Ranged Hit Chance, +4 to Melee Hit Chance.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Square:</strong> (Cannot be a reaction). Same benefits as Condensed but applies to all sides. Allows missile units to hide inside Pikemen.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Withdrawal:</strong> Unit retreats one full movement.
                </div>
                <div className="medieval-text">
                  <strong className="text-medieval-gold-300">Turn to Face:</strong> Unit rotates to face incoming enemy.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="medieval-card p-12 text-center animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text">
            🚀 Ready to Begin Your Journey?
          </h2>

          <p className="font-script text-2xl text-medieval-gold-200 italic mb-8">
            "The realm awaits your command, noble lord. Will you forge a dynasty
            that will be remembered for ages?"
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/pages/dashboard"
              className="medieval-button group text-lg px-8 py-4"
            >
              <span className="flex items-center space-x-3">
                <span>🏰</span>
                <span>Enter Your Castle</span>
              </span>
            </a>

            <a
              href="/pages/cities"
              className="medieval-button-secondary group text-lg px-8 py-4"
            >
              <span className="flex items-center space-x-3">
                <span>🏘️</span>
                <span>Manage Your Cities</span>
              </span>
            </a>

            <a
              href="/"
              className="medieval-button-secondary group text-lg px-8 py-4"
            >
              <span className="flex items-center space-x-3">
                <span>🏠</span>
                <span>Return Home</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
