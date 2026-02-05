"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/lib/rbac";
import { GraduationCap, FileText, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        {/* Header */}
        <header className="bg-white dark:bg-zinc-900 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Student Portal</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, {user?.firstName || "Student"}!
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-semibold">Student</p>
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
                <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Semester 6</div>
                <p className="text-xs text-muted-foreground">2024-2025</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">CGPA</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.5</div>
                <p className="text-xs text-muted-foreground">Out of 10.0</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">This semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Complete</div>
                <p className="text-xs text-muted-foreground">100% updated</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Results */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div>
                      <p className="font-semibold">Data Structures</p>
                      <p className="text-sm text-muted-foreground">Semester 5</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">A+</p>
                      <p className="text-sm text-muted-foreground">95/100</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div>
                      <p className="font-semibold">Database Management</p>
                      <p className="text-sm text-muted-foreground">Semester 5</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">A</p>
                      <p className="text-sm text-muted-foreground">88/100</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div>
                      <p className="font-semibold">Operating Systems</p>
                      <p className="text-sm text-muted-foreground">Semester 5</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">B+</p>
                      <p className="text-sm text-muted-foreground">82/100</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className="bg-primary text-white p-3 rounded-xl text-center">
                      <p className="text-2xl font-bold">15</p>
                      <p className="text-xs">FEB</p>
                    </div>
                    <div>
                      <p className="font-semibold">Mid-Term Exams</p>
                      <p className="text-sm text-muted-foreground">All subjects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className="bg-accent text-white p-3 rounded-xl text-center">
                      <p className="text-2xl font-bold">20</p>
                      <p className="text-xs">FEB</p>
                    </div>
                    <div>
                      <p className="font-semibold">Project Submission</p>
                      <p className="text-sm text-muted-foreground">Web Development</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className="bg-green-600 text-white p-3 rounded-xl text-center">
                      <p className="text-2xl font-bold">25</p>
                      <p className="text-xs">FEB</p>
                    </div>
                    <div>
                      <p className="font-semibold">Technical Fest</p>
                      <p className="text-sm text-muted-foreground">Department Event</p>
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
