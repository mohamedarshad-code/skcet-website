"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/lib/rbac";
import { BookOpen, Users, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function FacultyDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[UserRole.FACULTY]}>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        {/* Header */}
        <header className="bg-white dark:bg-zinc-900 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Faculty Portal</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome, {user?.firstName || "Faculty"}!
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-semibold">Faculty</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Active courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">180</div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Class average</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Courses */}
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Data Structures & Algorithms</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">CSE - Semester 3</p>
                    <p className="text-sm text-muted-foreground">60 Students</p>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Database Management Systems</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">CSE - Semester 4</p>
                    <p className="text-sm text-muted-foreground">55 Students</p>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Web Technologies</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">CSE - Semester 5</p>
                    <p className="text-sm text-muted-foreground">45 Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className="bg-primary text-white p-3 rounded-xl text-center min-w-[60px]">
                      <p className="text-lg font-bold">9:00</p>
                      <p className="text-xs">AM</p>
                    </div>
                    <div>
                      <p className="font-semibold">Data Structures</p>
                      <p className="text-sm text-muted-foreground">Room: CS-301</p>
                      <p className="text-sm text-muted-foreground">CSE 3rd Year</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className="bg-accent text-white p-3 rounded-xl text-center min-w-[60px]">
                      <p className="text-lg font-bold">11:00</p>
                      <p className="text-xs">AM</p>
                    </div>
                    <div>
                      <p className="font-semibold">DBMS Lab</p>
                      <p className="text-sm text-muted-foreground">Room: CS-Lab-2</p>
                      <p className="text-sm text-muted-foreground">CSE 4th Year</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className="bg-green-600 text-white p-3 rounded-xl text-center min-w-[60px]">
                      <p className="text-lg font-bold">2:00</p>
                      <p className="text-xs">PM</p>
                    </div>
                    <div>
                      <p className="font-semibold">Web Technologies</p>
                      <p className="text-sm text-muted-foreground">Room: CS-302</p>
                      <p className="text-sm text-muted-foreground">CSE 5th Year</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
