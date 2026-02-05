import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground">Manage SKCET institutional data</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium">Notifications</button>
            <div className="w-10 h-10 rounded-full bg-primary/10"></div>
          </div>
        </header>
        <main className="grid grid-cols-12 gap-8">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2">
            <nav className="flex flex-col gap-2">
              <Link href="/admin/dashboard" className="text-left px-4 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all">Dashboard</Link>
              <Link href="/admin/dashboard/results" className="text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-medium">Results</Link>
              <button className="text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-medium">Admissions</button>
              <button className="text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-medium">Faculty</button>
            </nav>
          </aside>
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
