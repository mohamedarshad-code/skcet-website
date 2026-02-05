"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { UserRole } from "@/lib/rbac";
import { GraduationCap, BookOpen, Users, Shield } from "lucide-react";

const roleOptions = [
  {
    role: UserRole.STUDENT,
    title: "Student",
    description: "Access your results, profile, and academic information",
    icon: GraduationCap,
  },
  {
    role: UserRole.FACULTY,
    title: "Faculty",
    description: "Manage your courses and view student information",
    icon: BookOpen,
  },
  {
    role: UserRole.EXAM_COORDINATOR,
    title: "Exam Coordinator",
    description: "Manage exam results and student records",
    icon: Users,
  },
  {
    role: UserRole.SUPER_ADMIN,
    title: "Administrator",
    description: "Full system access and management",
    icon: Shield,
  },
];

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Updating user role to:", selectedRole);
      
      // Update user metadata with selected role using unsafeMetadata
      await user.update({
        unsafeMetadata: {
          role: selectedRole,
        },
      });

      console.log("Role updated successfully");

      // Reload user to get updated metadata
      await user.reload();
      
      console.log("User reloaded, metadata:", user.unsafeMetadata);

      // Small delay to ensure metadata is propagated
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect based on role
      const redirectMap: Record<UserRole, string> = {
        [UserRole.SUPER_ADMIN]: "/admin/dashboard",
        [UserRole.EXAM_COORDINATOR]: "/admin/results",
        [UserRole.FACULTY]: "/faculty/dashboard",
        [UserRole.STUDENT]: "/student/dashboard",
      };

      console.log("Redirecting to:", redirectMap[selectedRole]);
      router.push(redirectMap[selectedRole]);
    } catch (error) {
      console.error("Error setting role:", error);
      setError(error instanceof Error ? error.message : "Failed to set role. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to SKCET Portal
          </h1>
          <p className="text-xl text-blue-100">
            Select your role to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedRole === option.role;

            return (
              <Card
                key={option.role}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  isSelected
                    ? "border-accent shadow-2xl scale-105 bg-white"
                    : "border-transparent hover:border-accent/50 hover:shadow-xl bg-white/95"
                }`}
                onClick={() => setSelectedRole(option.role)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl ${
                        isSelected ? "bg-accent text-white" : "bg-accent/10 text-accent"
                      }`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{option.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {option.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-center">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleRoleSelection}
            disabled={!selectedRole || isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? "Setting up..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
