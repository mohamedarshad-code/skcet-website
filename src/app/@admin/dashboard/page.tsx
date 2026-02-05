import { BarChart3, Users, FileText, CheckCircle } from "lucide-react";

const stats = [
  { label: "Total Students", value: "8,240", change: "+12%", icon: Users },
  { label: "Pending Admissions", value: "450", change: "+5%", icon: FileText },
  { label: "Results Published", value: "112", change: "Current Sem", icon: CheckCircle },
  { label: "Placement Inquiries", value: "85", change: "+18%", icon: BarChart3 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <stat.icon className="text-primary w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-success px-2 py-1 bg-success/10 rounded-full">{stat.change}</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-border">
          <h2 className="text-xl font-bold mb-6">Recent Admission Requests</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="flex items-center justify-between py-4 border-b border-border last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors px-4 -mx-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-400">J</div>
                  <div>
                    <div className="font-semibold px-2">John Smith</div>
                    <div className="text-sm text-muted-foreground px-2">Applying for B.E. Computer Science</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">2 hours ago</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-border">
          <h2 className="text-xl font-bold mb-6">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-black rounded-2xl">
              <span className="text-sm">Database</span>
              <span className="text-success text-sm font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span> Online
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-black rounded-2xl">
              <span className="text-sm">Storage</span>
              <span className="text-success text-sm font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span> 82% Free
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-black rounded-2xl">
              <span className="text-sm">Auth (Clerk)</span>
              <span className="text-success text-sm font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span> Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
