"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth";
import { FrogChefIcon } from "./frog-chef";
import {
  HomeIcon,
  RecipeBookIcon,
  MealPlanIcon,
  ShoppingIcon,
  SettingsIcon,
} from "./icons";

function getInitials(name?: string | null, email?: string): string {
  if (name) {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return email?.slice(0, 2).toUpperCase() || "?";
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon size={20} />,
  },
  {
    name: "Recipes",
    href: "/recipes",
    icon: <RecipeBookIcon size={20} />,
    children: [
      { name: "Find Recipes", href: "/recipes" },
      { name: "My Recipes", href: "/recipes/saved" },
    ],
  },
  {
    name: "Meal Plans",
    href: "/meal-plans",
    icon: <MealPlanIcon size={20} />,
  },
  {
    name: "Shopping List",
    href: "/shopping",
    icon: <ShoppingIcon size={20} />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <SettingsIcon size={20} />,
  },
];

interface AppShellProps {
  children: React.ReactNode;
  user: {
    email: string;
    name?: string | null;
    avatarUrl?: string | null;
  };
}

// Check if a nav item or any of its children is active
function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.children) {
    return item.children.some(
      (child) =>
        pathname === child.href || pathname.startsWith(child.href + "/"),
    );
  }
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

// Check if a specific child is active
function isChildActive(href: string, pathname: string): boolean {
  // For exact matches like /recipes vs /recipes/saved
  if (href === "/recipes") {
    return (
      pathname === "/recipes" ||
      pathname.startsWith("/recipes/view") ||
      (pathname.match(/^\/recipes\/[^/]+$/) !== null &&
        !pathname.includes("/saved"))
    );
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({ children, user }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = getInitials(user.name, user.email);

  const renderNavItem = (item: NavItem, mobile: boolean = false) => {
    const isActive = isNavItemActive(item, pathname);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.name}>
        <Link
          href={item.href}
          onClick={mobile ? () => setSidebarOpen(false) : undefined}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {item.icon}
          {item.name}
          {hasChildren && (
            <svg
              className={`w-4 h-4 ml-auto transition-transform ${isActive ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </Link>
        {hasChildren && isActive && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={mobile ? () => setSidebarOpen(false) : undefined}
                className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isChildActive(child.href, pathname)
                    ? "text-emerald-700 font-medium bg-emerald-50/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="flex items-center gap-2">
            <FrogChefIcon size={36} />
            <span className="text-xl font-semibold text-emerald-800 font-display">
              Let&apos;s Cook
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="px-2 py-4 space-y-1">
          {navigation.map((item) => renderNavItem(item, true))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center gap-2 h-16 px-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50">
            <FrogChefIcon size={36} />
            <span className="text-xl font-semibold text-emerald-800 font-display">
              Let&apos;s Cook
            </span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => renderNavItem(item, false))}
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left: hamburger menu (mobile) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Center: frog icon (mobile only) */}
            <div className="lg:hidden">
              <FrogChefIcon size={32} />
            </div>

            {/* Right: profile dropdown */}
            <div className="relative lg:ml-auto" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                {user.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.avatarUrl}
                    alt={user.name || "Profile"}
                    className="w-8 h-8 lg:w-9 lg:h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-medium">
                    {initials}
                  </div>
                )}
              </button>

              {/* Dropdown menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <SettingsIcon size={16} />
                    Settings
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
