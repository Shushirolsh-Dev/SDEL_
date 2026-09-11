import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { User, Role } from '../types';
import { supabase } from '../lib/supabase';

/* ============================================================
   LOGIN SCREEN
   ============================================================ */

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onGoSignup: () => void;
  onGoForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onGoSignup,
  onGoForgotPassword,
}) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] =
    useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (loading) return;

    if (!loginEmail || !loginPassword) {
      setLoginError(
        'Please enter both email and password.'
      );
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

      if (authError) {
        setLoginError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        let profileErrorDetails = '';
        let { data: profile, error: profileError } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError || !profile) {
          if (profileError) {
            console.error(
              '[LoginScreen] Profile select error:',
              profileError
            );
            profileErrorDetails = `Select error: ${profileError.message}`;
          }
          // If profile is missing in the DB on login, try to
          // insert it using auth metadata or defaults
          const metadata = authData.user.user_metadata || {};
          const fallbackName =
            metadata.name ||
            authData.user.email?.split('@')[0] ||
            'User';
          const fallbackUsername =
            metadata.username ||
            authData.user.email?.split('@')[0] ||
            'user';
          const fallbackRole = metadata.role || 'member';
          const fallbackPhone = metadata.phone || '';

          const { data: insertedProfile, error: insertError } =
            await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                name: fallbackName,
                username: fallbackUsername,
                email: authData.user.email || '',
                role: fallbackRole,
                phone: fallbackPhone,
                plan: 'free',
              })
              .select()
              .single();

          if (!insertError && insertedProfile) {
            profile = insertedProfile;
            profileError = null;
          } else if (insertError) {
            console.error(
              '[LoginScreen] Profile insert error:',
              insertError
            );
            profileErrorDetails = `Insert error: ${insertError.message}`;
          }
        }

        if (profileError || !profile) {
          setLoginError(
            `Unable to load your profile. Please contact support. (${
              profileErrorDetails || 'Profile not found'
            })`
          );
          setLoading(false);
          return;
        }

        const loggedInUser: User = {
          id: profile.id,
          name: profile.name,
          username: profile.username,
          email: profile.email,
          role: profile.role as Role,
          phone: profile.phone,
          plan: profile.plan as any,
          whatsappNumber:
            profile.whatsapp_number || undefined,
          isReminderNumberLocked:
            profile.is_reminder_number_locked,
        };
        onLoginSuccess(loggedInUser);
      }
    } catch (err: any) {
      setLoginError(
        err.message || 'An error occurred during log in.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-md w-full mx-auto border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] animate-fade-in"
      id="login-screen"
    >
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-sans font-extrabold text-zinc-900">
          Sign In to Thesdel
        </h2>
        <p className="text-xs text-zinc-500 font-sans">
          Enter your registered credentials to synchronize your
          device.
        </p>
      </div>

      {loginError && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-800 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{loginError}</span>
        </div>
      )}

      <form
        onSubmit={handleLoginSubmit}
        className="space-y-4 font-mono text-xs"
      >
        {/* Email */}
        <div className="space-y-1">
          <label className="text-zinc-600 font-bold block uppercase text-[10px]">
            Academic Email
          </label>
          <input
            id="login-email-input"
            type="email"
            required
            placeholder="thestruggle@thesdel.edu"
            value={loginEmail}
            onChange={(e) => {
              setLoginEmail(e.target.value);
              setLoginError('');
            }}
            className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 rounded-none focus:outline-none focus:border-zinc-800 font-sans"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-zinc-600 font-bold block uppercase text-[10px]">
              Password
            </label>
            <button
              type="button"
              onClick={onGoForgotPassword}
              className="text-[10px] text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer underline"
            >
              forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password-input"
              type={showLoginPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(e.target.value);
                setLoginError('');
              }}
              className="w-full px-3 pr-10 py-2 border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 rounded-none focus:outline-none focus:border-zinc-800 font-sans"
            />
            <button
              type="button"
              onClick={() =>
                setShowLoginPassword(!showLoginPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              {showLoginPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-zinc-950 text-white border border-zinc-950 font-bold font-mono text-xs uppercase hover:bg-zinc-800 transition-colors cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="border-t border-zinc-100 pt-4 text-center">
        <p className="text-xs text-zinc-500 font-sans">
          Don't have an account yet?{' '}
          <button
            onClick={onGoSignup}
            className="font-mono text-xs font-bold text-zinc-950 underline hover:text-zinc-600"
          >
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
};

/* ============================================================
   FORGOT PASSWORD SCREEN
   ============================================================ */

interface ForgotPasswordScreenProps {
  onGoLogin: () => void;
}

export const ForgotPasswordScreen: React.FC<
  ForgotPasswordScreenProps
> = ({ onGoLogin }) => {
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPasswordSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (loading) return;

    if (!forgotEmail) {
      setForgotError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setForgotError('');
    setForgotSuccess(false);

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(
          forgotEmail,
          {
            redirectTo: `${window.location.origin}/`,
          }
        );

      if (error) {
        setForgotError(error.message);
      } else {
        setForgotSuccess(true);
      }
    } catch (err: any) {
      setForgotError(
        err.message ||
          'An error occurred during password reset request.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-md w-full mx-auto border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] animate-fade-in"
      id="forgot-password-screen"
    >
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-sans font-extrabold text-zinc-900">
          Recover Secret Key
        </h2>
        <p className="text-xs text-zinc-500 font-sans">
          Enter your registered email address to receive password
          recovery instructions.
        </p>
      </div>

      {forgotError && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-800 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{forgotError}</span>
        </div>
      )}

      {forgotSuccess ? (
        <div className="space-y-4 font-sans text-xs">
          <div className="p-4 border border-emerald-200 bg-emerald-50 text-emerald-800 flex flex-col gap-2 rounded-none">
            <div className="flex items-center gap-2 font-mono font-bold uppercase text-[10px]">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Reset Link Transmitted</span>
            </div>
            <p className="leading-relaxed">
              A password reset email has been successfully sent to{' '}
              <strong className="font-mono">{forgotEmail}</strong>.
              Please check your inbox (and spam folder) for further
              instructions.
            </p>
          </div>

          <button
            onClick={onGoLogin}
            className="w-full py-2.5 bg-zinc-950 text-white border border-zinc-950 font-bold font-mono text-xs uppercase hover:bg-zinc-800 transition-colors cursor-pointer text-center block"
          >
            Return to Sign In
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleForgotPasswordSubmit}
          className="space-y-4 font-mono text-xs"
        >
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-zinc-600 font-bold block uppercase text-[10px]">
              Academic Email
            </label>
            <input
              id="forgot-email-input"
              type="email"
              required
              placeholder="thestruggle@thesdel.edu"
              value={forgotEmail}
              onChange={(e) => {
                setForgotEmail(e.target.value);
                setForgotError('');
              }}
              className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 rounded-none focus:outline-none focus:border-zinc-800 font-sans"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-zinc-950 text-white border border-zinc-950 font-bold font-mono text-xs uppercase hover:bg-zinc-800 transition-colors cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending Request...' : 'Send Reset Link'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onGoLogin}
              className="font-mono text-xs font-bold text-zinc-950 underline hover:text-zinc-600"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      )}
    </div>
  );
};