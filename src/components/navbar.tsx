"use client";

import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedButton } from "./AnimatedButton";
import { cn } from "@/lib/design-system";
import { useRealm } from "@/contexts/RealmContext";

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentRealm } = useRealm();

  useEffect(() => {
    if (isLoaded && user && currentRealm) {
      fetchUserRole();
    } else if (isLoaded && user && !currentRealm) {
      // If no realm is selected, user is not admin
      setUserRole("");
    }
  }, [isLoaded, user, currentRealm]);

  const fetchUserRole = async () => {
    if (!currentRealm) {
      setUserRole("");
      return;
    }
    
    try {
      const response = await fetch(`/api/dashboard/user-data?realmId=${currentRealm.id}`);
      if (response.ok) {
        const data = await response.json();
        // Check if user is OWNER or ADMIN in the current realm
        const realmMember = currentRealm.members?.find((m: any) => m.user.id === user?.id);
        const realmRole = currentRealm.memberRole || 
                         (currentRealm.ownerId === user?.id ? "OWNER" : 
                          (realmMember?.role === "OWNER" || realmMember?.role === "ADMIN" ? "ADMIN" : ""));
        
        // Set userRole to "ADMIN" if user is OWNER or ADMIN in this realm
        if (realmRole === "OWNER" || realmRole === "ADMIN") {
          setUserRole("ADMIN");
        } else {
          setUserRole("");
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest("nav")) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  const navItems = [
    { href: "/pages/dashboard", label: "Dashboard", icon: "🏰" },
    { href: "/pages/rules", label: "Rules", icon: "📜" },
    { href: "/pages/cities", label: "Cities", icon: "🏘️" },
    { href: "/pages/armies", label: "Armies", icon: "⚔️" },
    { href: "/pages/trading", label: "Trading", icon: "💱" },
    { href: "/pages/realms", label: "Realms", icon: "🌍" },
    { href: "/pages/settings", label: "Settings", icon: "⚙️" },
    { href: "/", label: "Home", icon: "🏠" },
  ];

  if (userRole === "ADMIN") {
    navItems.splice(-1, 0, {
      href: "/pages/admin",
      label: "Admin",
      icon: "👑",
    });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b bg-[var(--theme-navbar-bg)] border-[var(--theme-border)]">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Link href="/" className="group flex items-center space-x-2 transition-all duration-300 hover:scale-105 flex-shrink-0">
          <div className="relative transition-transform duration-300 group-hover:rotate-6 flex-shrink-0">
            {currentRealm?.logo ? (
              <Image
                src={currentRealm.logo}
                alt={`${currentRealm.name} logo`}
                width={48}
                height={48}
                className="rounded-full border-2 border-[var(--theme-accent)] transition-all duration-300 group-hover:border-[var(--theme-gold)] object-cover"
              />
            ) : (
              <Image
                src="/logo.png"
                alt="War of the Elector"
                width={48}
                height={48}
                className="rounded-full border-2 border-[var(--theme-accent)] transition-all duration-300 group-hover:border-[var(--theme-gold)]"
              />
            )}
          </div>
          <div className="hidden md:block">
            <h1 className="font-[Cinzel] text-xs md:text-sm lg:text-base text-[var(--theme-gold)] tracking-wider uppercase transition-colors duration-300 group-hover:text-[var(--theme-gold)]/90 whitespace-nowrap">
              WAR OF THE ELECTOR
            </h1>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative font-[Cinzel] text-sm text-[var(--theme-gold)] hover:text-[var(--theme-gold)]/80 transition-all duration-300 uppercase flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[var(--theme-card-bg)]/50"
            >
              <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">{item.icon}</span>
              <span className="relative transition-all duration-300 group-hover:translate-y-[-2px]">{item.label}</span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--theme-accent)] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          ))}
        </div>

        {/* Right Side - Realm Indicator and Auth */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Current Realm Indicator */}
          {currentRealm && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--theme-card-bg)]/50 border border-[var(--theme-border)] max-w-[180px]">
            {currentRealm.logo ? (
              <Image
                src={currentRealm.logo}
                alt={`${currentRealm.name} logo`}
                width={32}
                height={32}
                className="rounded-full border border-[var(--theme-border)] object-cover flex-shrink-0"
              />
            ) : (
              <span className="text-lg flex-shrink-0">🌍</span>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-[Cinzel] text-xs text-[var(--theme-gold)] uppercase leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                {currentRealm.name}
              </span>
              <span className="text-[10px] text-[var(--theme-steel)] font-mono whitespace-nowrap overflow-hidden text-ellipsis">
                {currentRealm.code}
              </span>
            </div>
          </div>
          )}

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-3">
          <SignedOut>
            <SignInButton>
              <Link
                href="/pages/dashboard"
                className="group relative px-6 py-2.5 rounded-xl bg-[var(--theme-gold)] text-slate-900 font-[Cinzel] text-sm hover:bg-[var(--theme-gold-dark)] transition-all duration-300 uppercase flex items-center gap-2 overflow-hidden"
              >
                <span className="transition-transform duration-300 group-hover:scale-110">🏰</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-y-[-2px]">ENTER CASTLE</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[var(--theme-gold-dark)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              </Link>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center space-x-4">
              <div className="relative group/avatar transition-transform duration-300 hover:scale-110">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        "border-2 border-[var(--theme-accent)] hover:border-[var(--theme-gold)] transition-all duration-300 rounded-full",
                      userButtonPopoverCard:
                        "bg-[var(--theme-card-bg)]/95 backdrop-blur-md border border-[var(--theme-border)] rounded-2xl shadow-2xl",
                      userButtonPopoverActionButton:
                        "text-[var(--theme-gold)] hover:bg-[var(--theme-accent)]/20 rounded-xl transition-all duration-300",
                      userButtonPopoverFooter: "border-t border-[var(--theme-border)]",
                    },
                  }}
                  showName
                />
              </div>
            </div>
          </SignedIn>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden absolute top-5 right-4">
        <button
          onClick={toggleMobileMenu}
          className="group p-3 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card-bg)] backdrop-blur-sm hover:border-[var(--theme-accent)] transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <span className="text-xl text-[var(--theme-gold)] transition-transform duration-300 inline-block group-hover:rotate-90">
            {isMobileMenuOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[var(--theme-navbar-bg)] backdrop-blur-xl border-b border-[var(--theme-border)] shadow-2xl">
            <div className="px-6 py-6 space-y-3">
              {/* Current Realm Indicator - Mobile */}
              {currentRealm && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--theme-card-bg)]/50 border border-[var(--theme-border)] mb-2">
                  {currentRealm.logo ? (
                    <Image
                      src={currentRealm.logo}
                      alt={`${currentRealm.name} logo`}
                      width={40}
                      height={40}
                      className="rounded-full border border-[var(--theme-border)] object-cover flex-shrink-0"
                    />
                  ) : (
                    <span className="text-xl flex-shrink-0">🌍</span>
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-[Cinzel] text-sm text-[var(--theme-gold)] uppercase leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {currentRealm.name}
                    </span>
                    <span className="text-xs text-[var(--theme-steel)] font-mono whitespace-nowrap overflow-hidden text-ellipsis">
                      {currentRealm.code}
                    </span>
                  </div>
                </div>
              )}

              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="group block font-[Cinzel] text-lg text-[var(--theme-gold)] hover:text-[var(--theme-gold)]/80 transition-all duration-300 uppercase py-3 px-4 rounded-lg hover:bg-[var(--theme-card-bg)]/50 flex items-center gap-3"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">{item.icon}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-2">{item.label}</span>
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-6 border-t border-[var(--theme-border)]">
                <SignedOut>
                  <SignInButton>
                    <Link
                      href="/pages/dashboard"
                      className="block px-6 py-3 rounded-xl bg-[var(--theme-gold)] text-slate-900 font-[Cinzel] text-sm hover:bg-[var(--theme-gold-dark)] transition-all duration-300 uppercase text-center"
                    >
                      ENTER CASTLE
                    </Link>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center justify-center">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox:
                            "border-2 border-[var(--theme-accent)] hover:border-[var(--theme-gold)] transition-all duration-300 shadow-lg rounded-full",
                          userButtonPopoverCard:
                            "bg-[var(--theme-card-bg)]/95 backdrop-blur-md border border-[var(--theme-border)] rounded-2xl shadow-2xl",
                          userButtonPopoverActionButton:
                            "text-[var(--theme-gold)] hover:bg-[var(--theme-accent)]/20 rounded-xl transition-all duration-300",
                          userButtonPopoverFooter: "border-t border-[var(--theme-border)]",
                        },
                      }}
                      showName
                    />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
