import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import { FormMessage } from '@/components/ui/form-message';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { resetPasswordAction } from '../actions';

export default function ResetPasswordPage({ searchParams }) {
  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden">
      
      <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Update Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Enter your new password below.
          </p>
        </div>
        
          <form className="mt-8 space-y-6">
            <FormMessage message={searchParams} />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="New Password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Confirm New Password"
                  className="mt-4"
                />
              </div>
            </div>

              <SubmitButton
                type="submit"
                className="w-full"
                formAction={resetPasswordAction}
                pendingText='Updating...'
              >
                Update Password
              </SubmitButton>
            
            <div className="text-center">
              <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                Back to login
              </Link>
            </div>
          </form>
      </div>
    </div>
  );
} 