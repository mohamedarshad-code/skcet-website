"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/lib/rbac";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Upload, FileSpreadsheet, CheckCircle, Clock } from "lucide-react";

export default function AdminResultsPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.EXAM_COORDINATOR]}>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        {/* Header */}
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Results Management</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome, {user?.firstName || "Admin"}!
                </p>
              </div>
              <Button className="bg-accent hover:bg-accent/90">
                <Upload className="h-4 w-4 mr-2" />
                Upload Results
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Results</CardTitle>
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">Across all semesters</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Uploads</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,222</div>
                <p className="text-xs text-muted-foreground">Live results</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>Latest result uploads and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { semester: "Semester 6", department: "CSE", date: "2024-01-15", status: "Published" },
                  { semester: "Semester 4", department: "ECE", date: "2024-01-14", status: "Processing" },
                  { semester: "Semester 2", department: "MECH", date: "2024-01-13", status: "Published" },
                ].map((upload, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileSpreadsheet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{upload.semester} - {upload.department}</p>
                        <p className="text-sm text-muted-foreground">Uploaded on {upload.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          upload.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {upload.status}
                      </span>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload New Results
                </CardTitle>
                <CardDescription>
                  Upload semester results in bulk via Excel/CSV
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-accent" />
                  Generate Reports
                </CardTitle>
                <CardDescription>
                  Create custom reports and analytics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
