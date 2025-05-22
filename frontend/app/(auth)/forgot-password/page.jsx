import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { FormMessage } from "@/components/ui/form-message";
import Link from "next/link";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { forgotPasswordAction } from "../actions";

export default function ForgotPasswordPage({ searchParams }) {
  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <FormMessage message={searchParams} />
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
            />
          </div>

          <SubmitButton
            type="submit"
            className="w-full"
            formAction={forgotPasswordAction}
            pendingText="Sending..."
          >
            Send reset link
          </SubmitButton>

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
