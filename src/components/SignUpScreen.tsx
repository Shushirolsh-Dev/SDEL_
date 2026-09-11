import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { User, Role } from '../types';
import { supabase } from '../lib/supabase';
import CountryCodeSelector from './CountryCodeSelector';

interface SignUpScreenProps {
  onLoginSuccess: (user: User) => void;
  onGoLogin: () => void;
  onGoTerms: () => void;
  onGoPrivacy: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onLoginSuccess,
  onGoLogin,
  onGoTerms,
  onGoPrivacy,
}) => {
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpRole, setSignUpRole] = useState<Role>('member');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] =
    useState(false);
  const [signUpAgreed, setSignUpAgreed] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [countryCode, setCountryCode] = useState('+234');

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (!signUpUsername || signUpUsername.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      // Only allow letters, numbers, underscore
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
        console.error('Error checking username:', err);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    };

    const debounce = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounce);
  }, [signUpUsername]);

  const handleSignUpSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (loading) return;

    // Clear previous errors
    setSignUpError('');

    // Validation
    if (
      !signUpName ||
      !signUpUsername ||
      !signUpEmail ||
      !signUpPassword ||
      !signUpPhone
    ) {
      setSignUpError('All fields are required.');
      return;
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(signUpUsername)) {
      setSignUpError(
        'Username must be 3-20 characters (letters, numbers, underscore only).'
      );
      return;
    }

    // Check username availability (if not already checked)
    if (usernameAvailable === false) {
      setSignUpError(
        'Username is already taken. Please choose another.'
      );
      return;
    }

    // Validate phone
    const rawPhone = signUpPhone.trim().replace(/^0+/, '');
    const phoneTrimmed = `${countryCode}${rawPhone}`;
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    if (!phoneRegex.test(phoneTrimmed)) {
      setSignUpError('Please enter a valid phone number.');
      return;
    }

    // Check terms
    if (!signUpAgreed) {
      setSignUpError(
        'You must agree to the Terms of Service and Privacy Policy.'
      );
      return;
    }

    setLoading(true);
    setSignUpError('');

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
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
        // Check for email already registered error
        if (
          authError.message.includes('User already registered') ||
          authError.status === 400
        ) {
          setSignUpError(
            'This email is already registered. Please sign in or use a different email.'
          );
        } else {
          setSignUpError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (authData.user) {
        let { data: profile, error: profileError } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError || !profile) {
          const { data: insertedProfile, error: insertError } =
            await supabase
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
            // Check for username conflict on insert
            if (insertError.code === '23505') {
              // PostgreSQL unique violation
              setSignUpError(
                'Username is already taken. Please choose another.'
              );
            } else {
              setSignUpError(
                'Failed to create profile. Please try again.'
              );
            }
            setLoading(false);
            return;
          }

          if (insertedProfile) {
            profile = insertedProfile;
          }
        }

        if (!profile) {
          setSignUpError(
            'Failed to create profile. Please try again.'
          );
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
          whatsappNumber: profile.whatsapp_number || undefined,
          isReminderNumberLocked:
            profile.is_reminder_number_locked,
        };

        onLoginSuccess(newUser);
      }
    } catch (err: any) {
      // Catch any unexpected errors
      if (
        err.message?.includes('duplicate key') ||
        err.code === '23505'
      ) {
        setSignUpError(
          'Username or email already taken. Please try again.'
        );
      } else {
        setSignUpError(
          err.message || 'An error occurred during registration.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-md w-full mx-auto border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] animate-fade-in"
      id="signup-screen"
    >
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-sans font-extrabold text-zinc-900">
          Join Thesdel
        </h2>
        <p className="text-xs text-zinc-500 font-sans">
          Create your student profile and connect with class
          timetables.
        </p>
      </div>

      {signUpError && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-800 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{signUpError}</span>
        </div>
      )}

      <form
        onSubmit={handleSignUpSubmit}
        className="space-y-4 font-mono text-xs"
      >
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-zinc-600 font-bold block uppercase text-[10px]">
            Full Student Name
          </label>
          <input
            id="signup-name-input"
            type="text"
            required
            placeholder="e.g. The Struggle"
            value={signUpName}
            onChange={(e) => {
              setSignUpName(e.target.value);
              setSignUpError('');
            }}
            className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 rounded-none focus:outline-none focus:border-zinc-800 font-sans"
          />
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label className="text-zinc-600 font-bold block uppercase text-[10px]">
            Username
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400 font-mono text-xs">
              @
            </span>
            <input
              id="signup-username-input"
              type="text"
              required
              placeholder="thestruggle"
              value={signUpUsername}
              onChange={(e) => {
                setSignUpUsername(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-zA-Z0-9_]/g, '')
                );
                setSignUpError('');
              }}
              className={`w-full pl-7 pr-3 py-2 border bg-zinc-50 focus:bg-white text-zinc-900 rounded-none focus:outline-none font-sans ${
                usernameAvailable === false
                  ? 'border-red-500 focus:border-red-500'
                  : usernameAvailable === true
                  ? 'border-emerald-500 focus:border-emerald-500'
                  : 'border-zinc-200 focus:border-zinc-800'
              }`}
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] mt-0.5">
            {signUpUsername && signUpUsername.length >= 3 && (
              <>
                {checkingUsername ? (
                  <span className="text-zinc-400">
                    Checking availability...
                  </span>
                ) : usernameAvailable === true ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Available
                  </span>
                ) : usernameAvailable === false ? (
                  <span className="text-red-600">
                    Username is taken
                  </span>
                ) : null}
              </>
            )}
            <span className="text-zinc-400 ml-auto">
              3-20 chars, letters, numbers, _
            </span>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-zinc-600 font-bold block uppercase text-[10px]">
            Academic Email
          </label>
          <input
            id="signup-email-input"
            type="email"
            required
            placeholder="e.g. thestruggle@thesdel.edu"
            value={signUpEmail}
            onChange={(e) => {
              setSignUpEmail(e.target.value);
              setSignUpError('');
            }}
            className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 rounded-none focus:outline-none focus:border-zinc-800 font-sans"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-zinc-600 font-bold block uppercase text-[10px]">
            Academic Phone Number
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="w-full sm:w-[220px]">
              <CountryCodeSelector
                value={countryCode}
                onChange={(val) => {
                  setCountryCode(val);
                  setSignUpError('');
                }}
              />
            </div>
            <input
              id="signup-phone-input"
              type="tel"
              required
              placeholder=""
              value={signUpPhone}
              onChange={(e) => {
                setSignUpPhone(e.target.value);
                setSignUpError('');
              }}
              className="flex-1 px-3 py-2 border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 rounded-none focus:outline-none focus:border-zinc-800 font-sans font-mono"
            />
          </div>
          <span className="text-[10px] text-zinc-400 font-sans block mt-1">
            Select your country code and enter your remaining phone
            digits.
          </span>
        </div>

        {/* Simulated Role Selection */}
        <div className="space-y-1">
          <label className="text-zinc-600 font-bold block uppercase text-[10px]">
            Primary Class Role
          </label>
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
            <button
              type="button"
              onClick={() => setSignUpRole('member')}
              className={`p-2 border text-center transition-colors cursor-pointer ${
                signUpRole === 'member'
                  ? 'border-zinc-900 bg-zinc-900 text-white font-bold'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-400'
              }`}
            >
              Student Member
            </button>
            <button
              type="button"
              onClick={() => setSignUpRole('representative')}
              className={`p-2 border text-center transition-colors cursor-pointer ${
                signUpRole === 'representative'
                  ? 'border-zinc-900 bg-zinc-900 text-white font-bold'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-400'
              }`}
            >
              Representative
            </button>
          </div>
          <span className="text-[10px] text-zinc-400 font-sans block mt-1">
            {signUpRole === 'representative'
              ? 'Allows you to create and manage academic schedules.'
              : 'Allows you to view timetables and submit manual attendances.'}
          </span>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-zinc-600 font-bold block uppercase text-[10px]">
            Secret Key (Password)
          </label>
          <div className="relative">
            <input
              id="signup-password-input"
              type={showSignUpPassword ? 'text' : 'password'}
              required
              placeholder="Minimum 6 characters"
              value={signUpPassword}
              onChange={(e) => {
                setSignUpPassword(e.target.value);
                setSignUpError('');
              }}
              className="w-full px-3 pr-10 py-2 border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 rounded-none focus:outline-none focus:border-zinc-800 font-sans"
            />
            <button
              type="button"
              onClick={() =>
                setShowSignUpPassword(!showSignUpPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              {showSignUpPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2.5 pt-2">
          <input
            id="signup-terms-check"
            type="checkbox"
            checked={signUpAgreed}
            onChange={(e) => {
              setSignUpAgreed(e.target.checked);
              setSignUpError('');
            }}
            className="mt-0.5 w-4 h-4 rounded-none accent-zinc-950 cursor-pointer"
          />
          <span className="text-[11px] text-zinc-500 font-sans leading-snug">
            I explicitly agree to the{' '}
            <button
              type="button"
              onClick={onGoTerms}
              className="text-zinc-950 underline hover:text-zinc-600"
            >
              Terms of Service
            </button>{' '}
            and the{' '}
            <button
              type="button"
              onClick={onGoPrivacy}
              className="text-zinc-950 underline hover:text-zinc-600"
            >
              Privacy Policy
            </button>
            . I understand that all credentials stay protected.
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-zinc-950 text-white border border-zinc-950 font-bold font-mono text-xs uppercase hover:bg-zinc-800 transition-colors cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Complete Registration'}
        </button>
      </form>

      <div className="border-t border-zinc-100 pt-4 text-center">
        <p className="text-xs text-zinc-500 font-sans">
          Already have an account?{' '}
          <button
            onClick={onGoLogin}
            className="font-mono text-xs font-bold text-zinc-950 underline hover:text-zinc-600"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;