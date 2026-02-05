"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/lib/rbac";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, FileText, Settings, BarChart } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        {/* Header */}
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome, {user?.firstName || "Administrator"}!
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,543</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,100</div>
                <p className="text-xs text-muted-foreground">Active students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faculty</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">420</div>
                <p className="text-xs text-muted-foreground">Teaching staff</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Active departments</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Manage Users
                </CardTitle>
                <CardDescription>
                  Add, edit, or remove users and manage permissions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Results Management
                </CardTitle>
                <CardDescription>
                  Upload and manage student results
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-zinc-300/20 hover:border-zinc-300/40 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-zinc-600" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system settings and preferences
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
