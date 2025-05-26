
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { signUp, type SignUpData } from "@/lib/firebase/authService";
import { UserRole, USER_ROLES_OPTIONS } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

const registerFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  passwordOne: z.string().min(6, { message: "Password must be at least 6 characters long." }),
  passwordTwo: z.string(),
  role: z.nativeEnum(UserRole, { errorMap: () => ({ message: "Please select a role."}) }),
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters."}).optional(),
}).refine(data => data.passwordOne === data.passwordTwo, {
  message: "Passwords do not match.",
  path: ["passwordTwo"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      role: undefined, // Ensure role starts as undefined for the Select placeholder
    }
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const signUpPayload: SignUpData = {
        email: data.email,
        passwordOne: data.passwordOne,
        role: data.role,
        displayName: data.displayName || data.email.split('@')[0],
      };
      await signUp(signUpPayload);
      toast({
        title: "Registration Successful",
        description: "Welcome to AgriAssist! Please log in.",
      });
      router.push("/auth/login");
    } catch (err) {
      let errorMessage = "An unknown error occurred during registration.";
       if (err instanceof Error) {
        if (err.message.includes("auth/email-already-in-use")) {
          errorMessage = "This email address is already in use.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Registration Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name (Optional)</Label>
        <Input
          id="displayName"
          placeholder="Your Name or Company"
          {...register("displayName")}
          disabled={isLoading}
        />
        {errors.displayName && <p className="text-sm text-destructive">{errors.displayName.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">I am a...</Label>
        <Controller
            name="role"
            control={control}
            render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                        {USER_ROLES_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        />
        {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="passwordOne">Password</Label>
        <Input
          id="passwordOne"
          type="password"
          placeholder="••••••••"
          {...register("passwordOne")}
          disabled={isLoading}
        />
        {errors.passwordOne && <p className="text-sm text-destructive">{errors.passwordOne.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="passwordTwo">Confirm Password</Label>
        <Input
          id="passwordTwo"
          type="password"
          placeholder="••••••••"
          {...register("passwordTwo")}
          disabled={isLoading}
        />
        {errors.passwordTwo && <p className="text-sm text-destructive">{errors.passwordTwo.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Create Account
      </Button>
    </form>
  );
}
