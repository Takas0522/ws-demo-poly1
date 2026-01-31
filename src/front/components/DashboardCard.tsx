import Link from "next/link";

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

export function DashboardCard({ title, description, href, icon }: DashboardCardProps) {
  return (
    <Link href={href}>
      <div className="rounded-lg bg-white dark:bg-zinc-800 p-6 shadow hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        <div className="mt-4">
          <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
            詳細を見る →
          </span>
        </div>
      </div>
    </Link>
  );
}
