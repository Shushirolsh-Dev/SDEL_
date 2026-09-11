import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  AtSign,
  UsersRound,
  BriefcaseBusiness,
  LockKeyhole,
} from 'lucide-react';
import { User, Role } from '../types';
import { supabase } from '../lib/supabase';
import CountryCodeSelector from './CountryCodeSelector';
import type { SignUpStrings } from './LandingView';

interface SignUpScreenProps {
  strings: SignUpStrings;
  onLoginSuccess: (user: User) => void;
  onGoLogin: () => void;
  onGoTerms: () => void;
  onGoPrivacy: () => void;
}

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

const SignUpScreen: React.FC<SignUpScreenProps> = ({
  strings,
  onLoginSuccess,
  onGoLogin,
  onGoTerms,
  onGoPrivacy,
}) => {
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] =
    useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpRole, setSignUpRole] =
    useState<Role>('member');
  const [signUpPassword, setSignUpPassword] =
    useState('');
  const [showSignUpPassword, setShowSignUpPassword] =
    useState(false);
  const [signUpAgreed, setSignUpAgreed] =
    useState(false);
  const [signUpError, setSignUpError] =
    useState('');
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] =
    useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] =
    useState(false);

  const [countryCode, setCountryCode] =
    useState('+234');

  useEffect(() => {
    const checkUsername = async () => {
      if (
        !signUpUsername ||
        signUpUsername.length < 3
      ) {
        setUsernameAvailable(null);
        return;
      }

      const usernameRegex = /^[a-zA-Z0-9_]+$/;

      if (!usernameRegex.test(signUpUsername)) {
        setUsernameAvailable(false);
        return;
      }

      setCheckingUsername(true);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', signUpUsername)
          .maybeSingle();

        if (error) throw error;

        setUsernameAvailable(!data);
      } catch (err) {
        console.error(
          'Error checking username:',
          err
        );
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    };

    const debounce = setTimeout(
      checkUsername,
      500
    );

    return () => clearTimeout(debounce);
  }, [signUpUsername]);

  const handleSignUpSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (loading) return;

    setSignUpError('');

    if (
      !signUpName ||
      !signUpUsername ||
      !signUpEmail ||
      !signUpPassword ||
      !signUpPhone
    ) {
      setSignUpError(strings.errorAllRequired);
      return;
    }

    const usernameRegex =
      /^[a-zA-Z0-9_]{3,20}$/;

    if (!usernameRegex.test(signUpUsername)) {
      setSignUpError(strings.errorUsernameFormat);
      return;
    }

    if (usernameAvailable === false) {
      setSignUpError(strings.errorUsernameTaken);
      return;
    }

    const rawPhone = signUpPhone
      .trim()
      .replace(/^0+/, '');

    const phoneTrimmed =
      `${countryCode}${rawPhone}`;

    const phoneRegex =
      /^\+[1-9]\d{6,14}$/;

    if (!phoneRegex.test(phoneTrimmed)) {
      setSignUpError(strings.errorPhoneInvalid);
      return;
    }

    if (!signUpAgreed) {
      setSignUpError(strings.errorTermsRequired);
      return;
    }

    setLoading(true);
    setSignUpError('');

    try {
      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: {
            name: signUpName,
            username: signUpUsername,
            role: signUpRole,
            phone: phoneTrimmed,
          },
        },
      });

      if (authError) {
        if (
          authError.message.includes(
            'User already registered'
          ) ||
          authError.status === 400
        ) {
          setSignUpError(strings.errorEmailRegistered);
        } else {
          setSignUpError(authError.message);
        }

        setLoading(false);
        return;
      }

      if (authData.user) {
        let {
          data: profile,
          error: profileError,
        } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profile) {
          const {
            data: insertedProfile,
            error: insertError,
          } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              name: signUpName,
              username: signUpUsername,
              email: signUpEmail,
              role: signUpRole,
              phone: phoneTrimmed,
              plan: 'free',
            })
            .select()
            .single();

          if (insertError) {
            if (
              insertError.code === '23505'
            ) {
              setSignUpError(strings.errorUsernameTaken);
            } else {
              setSignUpError(strings.errorProfileCreate);
            }

            setLoading(false);
            return;
          }

          if (insertedProfile) {
            profile = insertedProfile;
          }
        }

        if (!profile) {
          setSignUpError(strings.errorProfileCreate);

          setLoading(false);
          return;
        }

        const newUser: User = {
          id: profile.id,
          name: profile.name,
          username: profile.username,
          email: profile.email,
          role: profile.role as Role,
          phone: profile.phone,
          plan: profile.plan as any,
          whatsappNumber:
            profile.whatsapp_number ||
            undefined,
          isReminderNumberLocked:
            profile.is_reminder_number_locked,
        };

        onLoginSuccess(newUser);
      }
    } catch (err: any) {
      if (
        err.message?.includes(
          'duplicate key'
        ) ||
        err.code === '23505'
      ) {
        setSignUpError(strings.errorDuplicate);
      } else {
        setSignUpError(
          err.message || strings.errorGenericRegistration
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="signup-screen"
      className="w-full max-w-[520px] animate-fade-in"
    >
      {/* TOP MARKER */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-zinc-200" />

        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          {strings.topMarker}
        </span>

        <span className="h-px w-10 bg-zinc-200" />
      </div>

      {/* HEADER */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center border border-zinc-200 bg-white">
          <UserRound className="h-4 w-4 text-zinc-800" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-zinc-950 sm:text-[34px]">
          {strings.title}
        </h1>

        <p className="mx-auto mt-3 max-w-[360px] text-sm leading-6 text-zinc-500">
          {strings.subtitle}
        </p>
      </div>

      {/* ERROR */}
      {signUpError && (
        <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3.5 text-red-800 animate-fade-in">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

          <p className="text-xs leading-5">
            {signUpError}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSignUpSubmit}
        className="space-y-7"
      >
        {/* ====================================================
            IDENTITY
        ==================================================== */}

        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              {strings.sectionIdentity}
            </span>

            <span className="h-px flex-1 bg-zinc-200" />
          </div>

          <div className="space-y-5">
            {/* NAME */}
            <div>
              <FieldLabel>{strings.nameLabel}</FieldLabel>

              <FieldShell
                icon={
                  <UserRound className="h-4 w-4" />
                }
              >
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={strings.namePlaceholder}
                  value={signUpName}
                  onChange={(e) => {
                    setSignUpName(
                      e.target.value
                    );
                    setSignUpError('');
                  }}
                  className={inputClass}
                />
              </FieldShell>
            </div>

            {/* USERNAME */}
            <div>
              <FieldLabel>{strings.usernameLabel}</FieldLabel>

              <FieldShell
                icon={
                  <AtSign className="h-4 w-4" />
                }
              >
                <input
                  id="signup-username-input"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder={strings.usernamePlaceholder}
                  value={signUpUsername}
                  onChange={(e) => {
                    setSignUpUsername(
                      e.target.value
                        .toLowerCase()
                        .replace(
                          /[^a-zA-Z0-9_]/g,
                          ''
                        )
                    );

                    setSignUpError('');
                  }}
                  className={`${inputClass} pr-12 ${
                    usernameAvailable === false
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                      : usernameAvailable === true
                      ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500'
                      : ''
                  }`}
                />

                {signUpUsername.length >=
                  3 && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {checkingUsername ? (
                      <span className="block h-3.5 w-3.5 animate-spin rounded-full border border-zinc-300 border-t-zinc-900" />
                    ) : usernameAvailable ===
                      true ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : usernameAvailable ===
                      false ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : null}
                  </div>
                )}
              </FieldShell>

              <div className="mt-2 flex justify-between gap-3">
                <span className="text-[9px] text-zinc-400">
                  {checkingUsername
                    ? strings.usernameChecking
                    : usernameAvailable === true
                    ? strings.usernameAvailable
                    : usernameAvailable === false
                    ? strings.usernameUnavailable
                    : strings.usernameHint}
                </span>

                <span className="font-mono text-[9px] text-zinc-300">
                  {signUpUsername.length}/20
                </span>
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <FieldLabel>{strings.emailLabel}</FieldLabel>

              <FieldShell
                icon={
                  <Mail className="h-4 w-4" />
                }
              >
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={strings.emailPlaceholder}
                  value={signUpEmail}
                  onChange={(e) => {
                    setSignUpEmail(
                      e.target.value
                    );
                    setSignUpError('');
                  }}
                  className={inputClass}
                />
              </FieldShell>
            </div>
          </div>
        </section>

        {/* ====================================================
            CONTACT
        ==================================================== */}

        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              {strings.sectionContact}
            </span>

            <span className="h-px flex-1 bg-zinc-200" />
          </div>

          <div>
            <FieldLabel>{strings.phoneLabel}</FieldLabel>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="w-full sm:w-[150px]">
                <CountryCodeSelector
                  value={countryCode}
                  onChange={(val) => {
                    setCountryCode(val);
                    setSignUpError('');
                  }}
                />
              </div>

              <div className="relative flex-1">
                <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-zinc-400">
                  <Phone className="h-4 w-4" />
                </div>

                <input
                  id="signup-phone-input"
                  type="tel"
                  required
                  autoComplete="tel-national"
                  placeholder={strings.phonePlaceholder}
                  value={signUpPhone}
                  onChange={(e) => {
                    setSignUpPhone(
                      e.target.value
                    );
                    setSignUpError('');
                  }}
                  className={inputClass}
                />
              </div>
            </div>

            <p className="mt-2 text-[9px] leading-4 text-zinc-400">
              {strings.phoneHint}
            </p>
          </div>
        </section>

        {/* ====================================================
            ROLE
        ==================================================== */}

        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              {strings.sectionRole}
            </span>

            <span className="h-px flex-1 bg-zinc-200" />
          </div>

          <FieldLabel>
            {strings.roleQuestion}
          </FieldLabel>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setSignUpRole('member')
              }
              className={`group relative flex min-h-[94px] flex-col items-start justify-between border p-4 text-left transition-all ${
                signUpRole === 'member'
                  ? 'border-zinc-950 bg-zinc-950 text-white'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-white'
              }`}
            >
              <UsersRound
                className={`h-4 w-4 ${
                  signUpRole === 'member'
                    ? 'text-white'
                    : 'text-zinc-400'
                }`}
              />

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em]">
                  {strings.roleStudentTitle}
                </p>

                <p
                  className={`mt-1 text-[9px] leading-4 ${
                    signUpRole === 'member'
                      ? 'text-white/60'
                      : 'text-zinc-400'
                  }`}
                >
                  {strings.roleStudentBody}
                </p>
              </div>

              {signUpRole === 'member' && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center bg-white">
                  <Check className="h-3 w-3 text-zinc-950" />
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setSignUpRole(
                  'representative'
                )
              }
              className={`group relative flex min-h-[94px] flex-col items-start justify-between border p-4 text-left transition-all ${
                signUpRole ===
                'representative'
                  ? 'border-zinc-950 bg-zinc-950 text-white'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-white'
              }`}
            >
              <BriefcaseBusiness
                className={`h-4 w-4 ${
                  signUpRole ===
                  'representative'
                    ? 'text-white'
                    : 'text-zinc-400'
                }`}
              />

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em]">
                  {strings.roleRepTitle}
                </p>

                <p
                  className={`mt-1 text-[9px] leading-4 ${
                    signUpRole ===
                    'representative'
                      ? 'text-white/60'
                      : 'text-zinc-400'
                  }`}
                >
                  {strings.roleRepBody}
                </p>
              </div>

              {signUpRole ===
                'representative' && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center bg-white">
                  <Check className="h-3 w-3 text-zinc-950" />
                </span>
              )}
            </button>
          </div>
        </section>

        {/* ====================================================
            SECURITY
        ==================================================== */}

        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              {strings.sectionSecurity}
            </span>

            <span className="h-px flex-1 bg-zinc-200" />
          </div>

          <FieldLabel>{strings.passwordLabel}</FieldLabel>

          <FieldShell
            icon={
              <LockKeyhole className="h-4 w-4" />
            }
          >
            <input
              id="signup-password-input"
              type={
                showSignUpPassword
                  ? 'text'
                  : 'password'
              }
              required
              autoComplete="new-password"
              placeholder={strings.passwordPlaceholder}
              value={signUpPassword}
              onChange={(e) => {
                setSignUpPassword(
                  e.target.value
                );
                setSignUpError('');
              }}
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              aria-label={
                showSignUpPassword
                  ? strings.hidePassword
                  : strings.showPassword
              }
              onClick={() =>
                setShowSignUpPassword(
                  !showSignUpPassword
                )
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-950"
            >
              {showSignUpPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </FieldShell>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[9px] text-zinc-400">
              {strings.passwordHint}
            </span>

            <span className="flex items-center gap-1 text-[9px] text-zinc-400">
              <ShieldCheck className="h-3 w-3" />
              {strings.passwordProtected}
            </span>
          </div>
        </section>

        {/* ====================================================
            TERMS
        ==================================================== */}

        <div className="border border-zinc-200 bg-zinc-50 p-4">
          <label
            htmlFor="signup-terms-check"
            className="flex cursor-pointer items-start gap-3"
          >
            <input
              id="signup-terms-check"
              type="checkbox"
              checked={signUpAgreed}
              onChange={(e) => {
                setSignUpAgreed(
                  e.target.checked
                );
                setSignUpError('');
              }}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-zinc-950"
            />

            <span className="text-[10px] leading-5 text-zinc-500">
              {strings.termsPrefix}{' '}
              <button
                type="button"
                onClick={onGoTerms}
                className="font-semibold text-zinc-950 underline underline-offset-2 hover:text-zinc-500"
              >
                {strings.termsOfService}
              </button>{' '}
              {strings.termsConjunction}{' '}
              <button
                type="button"
                onClick={onGoPrivacy}
                className="font-semibold text-zinc-950 underline underline-offset-2 hover:text-zinc-500"
              >
                {strings.privacyPolicy}
              </button>
              {strings.termsSuffix}
            </span>
          </label>
        </div>

        {/* SUBMIT */}
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
      </form>

      {/* LOGIN */}
      <div className="mt-8 border-t border-zinc-200 pt-6 text-center">
        <p className="text-xs text-zinc-500">
          {strings.alreadyHaveAccount}{' '}
          <button
            type="button"
            onClick={onGoLogin}
            className="font-bold text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-950"
          >
            {strings.signIn}
          </button>
        </p>
      </div>

      <p className="mt-8 text-center font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-300">
        {strings.footnote}
      </p>
    </section>
  );
};

export default SignUpScreen;