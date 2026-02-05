import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-semibold text-primary">
          {label}
        </label>
      )}
      <input
        className={cn(
          "flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          error && "border-error focus-visible:ring-error text-error",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string, error?: string }) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-semibold text-primary">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          error && "border-error focus-visible:ring-error",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-semibold text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full appearance-none rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error && "border-error focus-visible:ring-error",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}

export function Checkbox({ label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className={cn(
            "peer h-5 w-5 appearance-none rounded-md border-2 border-input bg-background transition-all checked:bg-primary checked:border-primary disabled:opacity-50",
            className
          )}
          {...props}
        />
        <svg
          className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      {label && (
        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}
