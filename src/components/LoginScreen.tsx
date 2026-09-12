import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  LockKeyhole,
} from 'lucide-react';
import { User, Role } from '../types';
import { supabase } from '../lib/supabase';
import type {
  LoginStrings,
  ForgotStrings,
} from '../i18n/types.landing';

/* ============================================================
   SHARED UI
   ============================================================ */

const FieldLabel = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
    {children}
  </label>
);

const FieldShell = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="group relative">
    <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-950">
      {icon}
    </div>
    {children}
  </div>
);

const inputClass =
  'w-full border border-zinc-200 bg-zinc-50 py-3.5 pl-10 pr-4 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-950 focus:bg-white focus:ring-1 focus:ring-zinc-950';

/* ============================================================
   LOGIN SCREEN
   ============================================================ */

interface LoginScreenProps {
  strings: LoginStrings;
  onLoginSuccess: (user: User) => void;
  onGoSignup: () => void;
  onGoForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  strings,
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
      setLoginError(strings.emptyFieldsError);
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

        // ─── CHANGED: use RPC instead of table select ───
        let { data: profile, error: profileError } =
          await supabase.rpc('get_my_profile');

        if (profileError || !profile) {
          if (profileError) {
            console.error(
              '[LoginScreen] Profile select error:',
              profileError
            );
            profileErrorDetails = `Select error: ${profileError.message}`;
          }

          const metadata =
            authData.user.user_metadata || {};

          const fallbackName =
            metadata.name ||
            authData.user.email?.split('@')[0] ||
            'User';

          const fallbackUsername =
            metadata.username ||
            authData.user.email?.split('@')[0] ||
            'user';

          const fallbackRole =
            metadata.role || 'member';

          const fallbackPhone =
            metadata.phone || '';

          // ─── CHANGED: explicit columns on insert return ───
          const {
            data: insertedProfile,
            error: insertError,
          } = await supabase
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
            .select(
              'id, name, username, email, role, phone, plan, whatsapp_number, is_reminder_number_locked'
            )
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
            `${strings.fallbackProfileError} (${
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
        err.message || strings.genericError
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="login-screen"
      className="w-full max-w-[440px] animate-fade-in"
    >
      <div className="mb-8 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-zinc-200" />

        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          {strings.topMarker}
        </span>

        <span className="h-px w-10 bg-zinc-200" />
      </div>

      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center border border-zinc-200 bg-white">
          <LockKeyhole className="h-4 w-4 text-zinc-800" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-zinc-950 sm:text-[34px]">
          {strings.title}
        </h1>

        <p className="mx-auto mt-3 max-w-[310px] text-sm leading-6 text-zinc-500">
          {strings.subtitle}
        </p>
      </div>

      {loginError && (
        <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3.5 text-red-800 animate-fade-in">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

          <p className="text-xs leading-5">
            {loginError}
          </p>
        </div>
      )}

      <form
        onSubmit={handleLoginSubmit}
        className="space-y-5"
      >
        <div>
          <FieldLabel>{strings.emailLabel}</FieldLabel>

          <FieldShell
            icon={<Mail className="h-4 w-4" />}
          >
            <input
              id="login-email-input"
              type="email"
              required
              autoComplete="email"
              placeholder={strings.emailPlaceholder}
              value={loginEmail}
              onChange={(e) => {
                setLoginEmail(e.target.value);
                setLoginError('');
              }}
              className={inputClass}
            />
          </FieldShell>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <FieldLabel>{strings.passwordLabel}</FieldLabel>

            <button
              type="button"
              onClick={onGoForgotPassword}
              className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 transition-colors hover:text-zinc-950"
            >
              {strings.forgotLink}
            </button>
          </div>

          <FieldShell
            icon={<KeyRound className="h-4 w-4" />}
          >
            <input
              id="login-password-input"
              type={
                showLoginPassword
                  ? 'text'
                  : 'password'
              }
              required
              autoComplete="current-password"
              placeholder={strings.passwordPlaceholder}
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(e.target.value);
                setLoginError('');
              }}
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              aria-label={
                showLoginPassword
                  ? strings.hidePassword
                  : strings.showPassword
              }
              onClick={() =>
                setShowLoginPassword(
                  !showLoginPassword
                )
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-950"
            >
              {showLoginPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </FieldShell>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group mt-2 flex w-full items-center justify-center gap-2 bg-zinc-950 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-all hover:bg-zinc-800 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
              {strings.submitLoading}
            </>
          ) : (
            <>
              {strings.submitIdle}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-7 border-t border-zinc-200 pt-6 text-center">
        <p className="text-xs text-zinc-500">
          {strings.newTo}{' '}
          <button
            type="button"
            onClick={onGoSignup}
            className="font-bold text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-950"
          >
            {strings.createAccount}
          </button>
        </p>
      </div>

      <p className="mt-8 text-center font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-300">
        {strings.footnote}
      </p>
    </section>
  );
};

/* ============================================================
   FORGOT PASSWORD SCREEN — unchanged
   ============================================================ */

interface ForgotPasswordScreenProps {
  strings: ForgotStrings;
  onGoLogin: () => void;
}

export const ForgotPasswordScreen: React.FC<
  ForgotPasswordScreenProps
> = ({ strings, onGoLogin }) => {
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] =
    useState(false);
  const [forgotError, setForgotError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPasswordSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (loading) return;

    if (!forgotEmail) {
      setForgotError(strings.emptyEmailError);
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
        err.message || strings.genericError
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="forgot-password-screen"
      className="w-full max-w-[440px] animate-fade-in"
    >
      <div className="mb-8 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-zinc-200" />

        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          {strings.topMarker}
        </span>

        <span className="h-px w-10 bg-zinc-200" />
      </div>

      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center border border-zinc-200 bg-white">
          <KeyRound className="h-4 w-4 text-zinc-800" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-zinc-950 sm:text-[34px]">
          {strings.title}
        </h1>

        <p className="mx-auto mt-3 max-w-[330px] text-sm leading-6 text-zinc-500">
          {strings.subtitle}
        </p>
      </div>

      {forgotError && (
        <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3.5 text-red-800 animate-fade-in">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

          <p className="text-xs leading-5">
            {forgotError}
          </p>
        </div>
      )}

      {forgotSuccess ? (
        <div className="animate-fade-in">
          <div className="border border-emerald-200 bg-emerald-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center bg-emerald-100">
                <Check className="h-3.5 w-3.5 text-emerald-700" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800">
                {strings.successTitle}
              </span>
            </div>

            <p className="text-xs leading-5 text-emerald-800/80">
              {strings.successBodyPrefix}{' '}
              <strong className="font-mono font-bold text-emerald-900">
                {forgotEmail}
              </strong>{' '}
              {strings.successBodySuffix}
            </p>
          </div>

          <button
            type="button"
            onClick={onGoLogin}
            className="mt-4 flex w-full items-center justify-center gap-2 bg-zinc-950 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-zinc-800"
          >
            {strings.returnToSignIn}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleForgotPasswordSubmit}
          className="space-y-5"
        >
          <div>
            <FieldLabel>{strings.emailLabel}</FieldLabel>

            <FieldShell
              icon={<Mail className="h-4 w-4" />}
            >
              <input
                id="forgot-email-input"
                type="email"
                required
                autoComplete="email"
                placeholder={strings.emailPlaceholder}
                value={forgotEmail}
                onChange={(e) => {
                  setForgotEmail(e.target.value);
                  setForgotError('');
                }}
                className={inputClass}
              />
            </FieldShell>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 bg-zinc-950 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-all hover:bg-zinc-800 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                {strings.submitLoading}
              </>
            ) : (
              <>
                {strings.submitIdle}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onGoLogin}
            className="flex w-full items-center justify-center pt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400 transition-colors hover:text-zinc-950"
          >
            {strings.backToSignIn}
          </button>
        </form>
      )}

      <p className="mt-8 text-center font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-300">
        {strings.footnote}
      </p>
    </section>
  );
};