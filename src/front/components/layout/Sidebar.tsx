"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, canAccessMenu } from "@/lib/auth";

interface MenuItem {
  name: string;
  href: string;
  menuKey: string;
  icon?: string;
}

const menuItems: MenuItem[] = [
  {
    name: "ダッシュボード",
    href: "/dashboard",
    menuKey: "dashboard",
    icon: "📊",
  },
  {
    name: "テナント管理",
    href: "/tenants",
    menuKey: "tenant-management",
    icon: "🏢",
  },
  {
    name: "ユーザー管理",
    href: "/users",
    menuKey: "user-management",
    icon: "👥",
  },
  {
    name: "サービス設定",
    href: "/service-settings",
    menuKey: "service-settings",
    icon: "⚙️",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Filter menu items based on user's role
  // Optimize by computing highest role once instead of per menu item
  const visibleMenuItems = menuItems.filter((item) => canAccessMenu(user, item.menuKey));

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
      <nav className="flex flex-col gap-1 p-4">
        {visibleMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
