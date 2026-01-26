export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <main className="flex flex-col items-center gap-8 px-8 py-16">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Management Application
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md text-center">
          Frontend service (BFF) for ws-demo-poly1 project
        </p>
        <div className="flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-500">
          <p>Next.js {process.env.npm_package_version || "16.1.4"}</p>
          <p>React 19.2.3</p>
          <p>TypeScript 5.x</p>
        </div>
        <div className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>Ready for development</p>
        </div>
      </main>
    </div>
  );
}
