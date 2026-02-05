import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Join SKCET</h1>
          <p className="text-blue-100">Create your account to get started</p>
        </div>
        
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white shadow-2xl rounded-3xl border-0",
              headerTitle: "hidden",
              headerSubtitle: "text-muted-foreground text-center",
              socialButtonsBlockButton: 
                "bg-white border-2 border-border hover:bg-zinc-50 text-foreground font-semibold rounded-xl transition-all",
              socialButtonsBlockButtonText: "font-semibold",
              formButtonPrimary: 
                "bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-12 transition-all shadow-lg hover:shadow-xl",
              formFieldInput: 
                "rounded-xl border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 h-12",
              formFieldLabel: "font-semibold text-foreground",
              footerActionLink: "text-accent hover:text-accent/80 font-semibold",
              identityPreviewText: "font-semibold",
              identityPreviewEditButton: "text-accent hover:text-accent/80",
              formResendCodeLink: "text-accent hover:text-accent/80",
              otpCodeFieldInput: "border-2 border-border rounded-xl",
              formHeaderTitle: "text-2xl font-bold text-primary",
              formHeaderSubtitle: "text-muted-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground font-medium",
            },
            layout: {
              socialButtonsPlacement: "top",
              socialButtonsVariant: "blockButton",
            }, 
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/onboarding"
          forceRedirectUrl="/onboarding"
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-blue-100">
            By signing up, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
