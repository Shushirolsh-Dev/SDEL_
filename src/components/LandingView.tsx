import React, { useState, useEffect } from 'react';
import { BookOpen, Shield, Check, Calendar, Clock, AlertTriangle, ArrowRight, FileText, Lock, Globe, UserCheck, Heart, Eye, EyeOff, Info } from 'lucide-react';
import { User, Role } from '../types';
import { supabase } from '../lib/supabase';
import CountryCodeSelector from './CountryCodeSelector';


interface LandingViewProps {
  onLoginSuccess: (user: User) => void;
  classesCount: number;
}

export default function LandingView({ onLoginSuccess, classesCount }: LandingViewProps) {
  const [activeScreen, setActiveScreen] = useState<'landing' | 'login' | 'signup' | 'terms' | 'privacy' | 'about' | 'forgot_password'>('landing');
  
  // Typewriter effect state
  const words = ['WhatsApp', 'Telegram', 'Discord'];
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('WhatsApp');
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    let timer: any;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, 60);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) => currentWord.slice(0, prev.length + 1));
      }, 110);
    }

    if (!isDeleting && currentText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex]);

  // Country code state
  const [countryCode, setCountryCode] = useState('+234');

  // Footer typewriter effect
  const [footerText, setFooterText] = useState('');
  useEffect(() => {
    const fullFooterText = "Built by Litheral";
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullFooterText.length) {
        index++;
        setFooterText(fullFooterText.slice(0, index));
      } else {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Sign up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpRole, setSignUpRole] = useState<Role>('member');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpAgreed, setSignUpAgreed] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

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

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!signUpName || !signUpUsername || !signUpEmail || !signUpPassword || !signUpPhone) {
      setSignUpError('All fields are required.');
      return;
    }

    // Validate username
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(signUpUsername)) {
      setSignUpError('Username must be 3-20 characters, letters, numbers, or underscore only.');
      return;
    }

    if (usernameAvailable === false) {
      setSignUpError('Username is already taken. Please choose another.');
      return;
    }
    
    const rawPhone = signUpPhone.trim().replace(/^0+/, '');
    const phoneTrimmed = `${countryCode}${rawPhone}`;
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    if (!phoneRegex.test(phoneTrimmed)) {
      setSignUpError('Please enter a valid phone number. Make sure you select the correct country code and fill in your number (e.g., placeholder "0").');
      return;
    }

    if (!signUpAgreed) {
      setSignUpError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    setSignUpError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: {
            name: signUpName,
            username: signUpUsername,
            role: signUpRole,
            phone: phoneTrimmed,
          }
        }
      });

      if (authError) {
        setSignUpError(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profile) {
          // If profile is missing in the DB, try to insert it directly from client
          const { data: insertedProfile, error: insertError } = await supabase
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

          if (!insertError && insertedProfile) {
            profile = insertedProfile;
            profileError = null;
          }
        }

        if (profileError || !profile) {
          const newUser: User = {
            id: authData.user.id,
            name: signUpName,
            username: signUpUsername,
            email: signUpEmail,
            role: signUpRole,
            phone: phoneTrimmed,
            plan: 'free',
          };
          onLoginSuccess(newUser);
        } else {
          const newUser: User = {
            id: profile.id,
            name: profile.name,
            username: profile.username,
            email: profile.email,
            role: profile.role as Role,
            phone: profile.phone,
            plan: profile.plan as any,
            whatsappNumber: profile.whatsapp_number || undefined,
            isReminderNumberLocked: profile.is_reminder_number_locked
          };
          onLoginSuccess(newUser);
        }
      }
    } catch (err: any) {
      setSignUpError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
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
        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profile) {
          if (profileError) {
            console.error('[LandingView] Profile select error:', profileError);
            profileErrorDetails = `Select error: ${profileError.message}`;
          }
          // If profile is missing in the DB on login, try to insert it using auth metadata or defaults
          const metadata = authData.user.user_metadata || {};
          const fallbackName = metadata.name || authData.user.email?.split('@')[0] || 'User';
          const fallbackUsername = metadata.username || authData.user.email?.split('@')[0] || 'user';
          const fallbackRole = metadata.role || 'member';
          const fallbackPhone = metadata.phone || '';

          const { data: insertedProfile, error: insertError } = await supabase
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
            console.error('[LandingView] Profile insert error:', insertError);
            profileErrorDetails = `Insert error: ${insertError.message}`;
          }
        }

        if (profileError || !profile) {
          setLoginError(`Unable to load your profile. Please contact support. (${profileErrorDetails || 'Profile not found'})`);
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
          whatsappNumber: profile.whatsapp_number || undefined,
          isReminderNumberLocked: profile.is_reminder_number_locked
        };
        onLoginSuccess(loggedInUser);
      }
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred during log in.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) {
        setForgotError(error.message);
      } else {
        setForgotSuccess(true);
      }
    } catch (err: any) {
      setForgotError(err.message || 'An error occurred during password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: Role) => {
    let mockUser: User;
    if (role === 'representative') {
      mockUser = {
        id: 'user_1',
        name: 'Philip Jonathan',
        username: 'philipjonathan',
        email: 'philipjonathanpeter24@gmail.com',
        role: 'representative',
        phone: '+2348100240137',
        plan: 'free',
        whatsappNumber: '',
        isReminderNumberLocked: false,
        reminderSettings: {
          masterWhatsAppReminders: false,
          dailySummaryEnabled: false,
          dailySummaryTime: '08:00',
          classStartReminderEnabled: false,
          classStartReminderTime: 15,
          attendanceNotMarkedEnabled: false,
          streakAtRiskEnabled: false,
          venueChangeEnabled: false,
          customReminders: [],
          reminderAllowance: 100,
          remindersSent: 0
        }
      };
    } else if (role === 'assistant') {
      mockUser = {
        id: 'user_assistant_1',
        name: 'Alex Carter (Assistant)',
        username: 'alexcarter',
        email: 'alex.carter@thesdel.edu',
        role: 'assistant',
        phone: '+2348123456789',
        plan: 'free',
        whatsappNumber: '',
        isReminderNumberLocked: false,
        reminderSettings: {
          masterWhatsAppReminders: false,
          dailySummaryEnabled: false,
          dailySummaryTime: '08:00',
          classStartReminderEnabled: false,
          classStartReminderTime: 15,
          attendanceNotMarkedEnabled: false,
          streakAtRiskEnabled: false,
          venueChangeEnabled: false,
          customReminders: [],
          reminderAllowance: 100,
          remindersSent: 0
        }
      };
    } else {
      mockUser = {
        id: 'user_student_2',
        name: 'Jane Doe (Student)',
        username: 'janedoe',
        email: 'jane.doe@thesdel.edu',
        role: 'member',
        phone: '+2348011223344',
        plan: 'free',
        whatsappNumber: '',
        isReminderNumberLocked: false,
        reminderSettings: {
          masterWhatsAppReminders: false,
          dailySummaryEnabled: false,
          dailySummaryTime: '08:00',
          classStartReminderEnabled: false,
          classStartReminderTime: 15,
          attendanceNotMarkedEnabled: false,
          streakAtRiskEnabled: false,
          venueChangeEnabled: false,
          customReminders: [],
          reminderAllowance: 100,
          remindersSent: 0
        }
      };
    }
    onLoginSuccess(mockUser);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 flex flex-col font-sans selection:bg-zinc-900 selection:text-white" id="thesdel-auth-container">
      
      {/* Small Minimal Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={() => setActiveScreen('landing')} 
            className="flex items-center gap-2 font-mono text-base font-bold tracking-wider text-zinc-950 cursor-pointer"
          >
            <BookOpen className="w-5 h-5 text-zinc-950" />
            <span>THESDEL</span>
          </button>
          
          <div className="flex items-center gap-2">
            {activeScreen === 'landing' ? (
              <>
                <button
                  onClick={() => setActiveScreen('login')}
                  className="px-3 py-1.5 text-xs font-mono font-bold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveScreen('signup')}
                  className="px-3 py-1.5 text-xs font-mono font-bold bg-zinc-950 text-white border border-zinc-950 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Join Free
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  if (activeScreen === 'forgot_password') {
                    setActiveScreen('login');
                  } else {
                    setActiveScreen('landing');
                  }
                }}
                className="px-3 py-1.5 text-xs font-mono font-bold text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
              >
                {activeScreen === 'forgot_password' ? '← Back to Login' : '← Back to Home'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        
        {/* SCREEN 1: 10-Second Landing Page */}
        {activeScreen === 'landing' && (
          <div className="space-y-12 py-6 sm:py-12 animate-fade-in" id="landing-screen">
            
            {/* Hero pitch - explains in under 10 seconds */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none border border-zinc-200 bg-white text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Universally Synchronized Timetables
              </span>
              <h1 className="text-4xl sm:text-5xl font-sans font-extrabold tracking-tight text-zinc-900 leading-tight">
                No more <span className="inline-block text-center font-mono text-zinc-950 w-[5.5em]">{currentText}<span className="text-zinc-400 animate-pulse font-normal">|</span></span> schedule clutter.
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 font-sans max-w-xl mx-auto leading-relaxed">
                Thesdel is a smart, real-time timetable organizer built specifically for university classes. Spot room shifts, track cancellations, and safeguard your attendance streaks instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveScreen('signup')}
                  className="w-full sm:w-auto px-6 py-3 bg-zinc-950 text-white font-mono text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,0.15)] border border-zinc-950"
                >
                  Create Student Account <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveScreen('login')}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-zinc-950 border border-zinc-300 font-mono text-xs font-bold hover:border-zinc-800 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Sign In to Class
                </button>
              </div>
            </div>

            {/* 10-Second Rapid Feature Grid */}
            <div className="border border-zinc-200 bg-white p-6 sm:p-8 rounded-none">
              <h2 className="text-center font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 mb-8">
                EXPLAINED IN 10 SECONDS
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Step 1 */}
                <div className="space-y-3">
                  <div className="w-10 h-10 border border-zinc-900 bg-zinc-50 flex items-center justify-center font-mono font-bold text-sm">
                    01
                  </div>
                  <h3 className="font-sans font-bold text-base text-zinc-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-zinc-700" />
                    Centralized Schedule
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                    Representatives list active courses, dates, and hours. No more scouring messy pinned chat history for PDFs.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="space-y-3">
                  <div className="w-10 h-10 border border-zinc-900 bg-zinc-50 flex items-center justify-center font-mono font-bold text-sm">
                    02
                  </div>
                  <h3 className="font-sans font-bold text-base text-zinc-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-700" />
                    Instant Venue Alerts
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                    Class relocated or cancelled? Receive dynamic live warnings before the session starts, saving wasted campus trips.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="space-y-3">
                  <div className="w-10 h-10 border border-zinc-900 bg-zinc-50 flex items-center justify-center font-mono font-bold text-sm">
                    03
                  </div>
                  <h3 className="font-sans font-bold text-base text-zinc-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-zinc-700" />
                    Streak Safe-Guards
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                    Track daily logs & class counts. Safeguard attendance requirements automatically through mock verification.
                  </p>
                </div>

              </div>
            </div>



            {/* Micro footer links */}
            <div className="flex justify-center gap-6 text-[11px] font-mono text-zinc-400 pt-4">
              <button onClick={() => setActiveScreen('terms')} className="hover:text-zinc-900 transition-colors cursor-pointer">
                Terms of Service
              </button>
              <span>•</span>
              <button onClick={() => setActiveScreen('privacy')} className="hover:text-zinc-900 transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <span>•</span>
              <button onClick={() => setActiveScreen('about')} className="hover:text-zinc-900 transition-colors cursor-pointer">
                About
              </button>
            </div>

          </div>
        )}

        {/* SCREEN 2: Professional Sign Up Page */}
        {activeScreen === 'signup' && (
          <div className="max-w-md w-full mx-auto border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] animate-fade-in" id="signup-screen">
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-sans font-extrabold text-zinc-900">
                Join Thesdel
              </h2>
              <p className="text-xs text-zinc-500 font-sans">
                Create your student profile and connect with class timetables.
              </p>
            </div>

            {signUpError && (
              <div className="p-3 border border-red-200 bg-red-50 text-red-800 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{signUpError}</span>
              </div>
            )}

            <form onSubmit={handleSignUpSubmit} className="space-y-4 font-mono text-xs">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-zinc-600 font-bold block uppercase text-[10px]">Full Student Name</label>
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
                <label className="text-zinc-600 font-bold block uppercase text-[10px]">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400 font-mono text-xs">@</span>
                  <input
                    id="signup-username-input"
                    type="text"
                    required
                    placeholder="thestruggle"
                    value={signUpUsername}
                    onChange={(e) => {
                      setSignUpUsername(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_]/g, ''));
                      setSignUpError('');
                    }}
                    className="w-full pl-7 pr-3 py-2 border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 rounded-none focus:outline-none focus:border-zinc-800 font-sans"
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] mt-0.5">
                  {signUpUsername && signUpUsername.length >= 3 && (
                    <>
                      {checkingUsername ? (
                        <span className="text-zinc-400">Checking availability...</span>
                      ) : usernameAvailable === true ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Available
                        </span>
                      ) : usernameAvailable === false ? (
                        <span className="text-red-600">Username is taken</span>
                      ) : null}
                    </>
                  )}
                  <span className="text-zinc-400 ml-auto">3-20 chars, letters, numbers, _</span>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-zinc-600 font-bold block uppercase text-[10px]">Academic Email</label>
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
                <label className="text-zinc-600 font-bold block uppercase text-[10px]">Academic Phone Number</label>
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
                  Select your country code and enter your remaining phone digits.
                </span>
              </div>

              {/* Simulated Role Selection */}
              <div className="space-y-1">
                <label className="text-zinc-600 font-bold block uppercase text-[10px]">Primary Class Role</label>
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
                <label className="text-zinc-600 font-bold block uppercase text-[10px]">Secret Key (Password)</label>
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
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  <button type="button" onClick={() => setActiveScreen('terms')} className="text-zinc-950 underline hover:text-zinc-600">
                    Terms of Service
                  </button>{' '}
                  and the{' '}
                  <button type="button" onClick={() => setActiveScreen('privacy')} className="text-zinc-950 underline hover:text-zinc-600">
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
                <button onClick={() => setActiveScreen('login')} className="font-mono text-xs font-bold text-zinc-950 underline hover:text-zinc-600">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        )}

        {/* SCREEN 3: Professional Login Page */}
        {activeScreen === 'login' && (
          <div className="max-w-md w-full mx-auto border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] animate-fade-in" id="login-screen">
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-sans font-extrabold text-zinc-900">
                Sign In to Thesdel
              </h2>
              <p className="text-xs text-zinc-500 font-sans">
                Enter your registered credentials to synchronize your device.
              </p>
            </div>

            {loginError && (
              <div className="p-3 border border-red-200 bg-red-50 text-red-800 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
              
              {/* Email */}
              <div className="space-y-1">
                <label className="text-zinc-600 font-bold block uppercase text-[10px]">Academic Email</label>
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
                  <label className="text-zinc-600 font-bold block uppercase text-[10px]">Password</label>
                  <button 
                    type="button" 
                    onClick={() => {
                      setForgotError('');
                      setForgotSuccess(false);
                      setForgotEmail('');
                      setActiveScreen('forgot_password');
                    }} 
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
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                <button onClick={() => setActiveScreen('signup')} className="font-mono text-xs font-bold text-zinc-950 underline hover:text-zinc-600">
                  Register Now
                </button>
              </p>
            </div>
          </div>
        )}

        {/* SCREEN 7: Forgot Password Page */}
        {activeScreen === 'forgot_password' && (
          <div className="max-w-md w-full mx-auto border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] animate-fade-in" id="forgot-password-screen">
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-sans font-extrabold text-zinc-900">
                Recover Secret Key
              </h2>
              <p className="text-xs text-zinc-500 font-sans">
                Enter your registered email address to receive password recovery instructions.
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
                    A password reset email has been successfully sent to <strong className="font-mono">{forgotEmail}</strong>. Please check your inbox (and spam folder) for further instructions.
                  </p>
                </div>
                
                <button
                  onClick={() => setActiveScreen('login')}
                  className="w-full py-2.5 bg-zinc-950 text-white border border-zinc-950 font-bold font-mono text-xs uppercase hover:bg-zinc-800 transition-colors cursor-pointer text-center block"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 font-mono text-xs">
                {/* Email input */}
                <div className="space-y-1">
                  <label className="text-zinc-600 font-bold block uppercase text-[10px]">Academic Email</label>
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
                    onClick={() => setActiveScreen('login')}
                    className="font-mono text-xs font-bold text-zinc-950 underline hover:text-zinc-600"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* SCREEN 4: Detailed Terms of Service */}
        {activeScreen === 'terms' && (
          <div className="border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 max-w-2xl mx-auto animate-fade-in" id="terms-screen">
            <div className="border-b border-zinc-100 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-zinc-700" />
              <h2 className="text-lg font-mono font-bold uppercase tracking-wide text-zinc-900">
                Terms of Service
              </h2>
            </div>

            <div className="text-xs font-sans text-zinc-600 space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
              <p className="font-mono text-[10px] text-zinc-400 uppercase font-bold">Last updated: July 13, 2026</p>
              
              <h3 className="font-mono font-bold text-zinc-900 uppercase">1. Agreement and Intellectual Property</h3>
              <p className="leading-relaxed">
                By creating an account on the Thesdel platform, you agree to comply with and be bound by these Terms of Service. Thesdel is the exclusive intellectual property of its publishers. All rights are reserved. Any unauthorized reproduction, modification, or distribution of platform interfaces or proprietary code is strictly prohibited.
              </p>

              <h3 className="font-mono font-bold text-zinc-900 uppercase">2. Roster Management and Administrative Roles</h3>
              <p className="leading-relaxed">
                Thesdel provides administrative controls for academic timetables. Standard Class Representatives possess full ownership, including exclusive authority to demote assistants, delete class groups, or instantly remove any member. Class Assistants can manage scheduling entries, and can initiate member removal requests which are placed into a pending list for final administrative approval.
              </p>

              <h3 className="font-mono font-bold text-zinc-900 uppercase">3. Real-Time WhatsApp Integration</h3>
              <p className="leading-relaxed">
                Representatives and authorized administrators agree to maintain correct contact numbers. WhatsApp notification dispatching is subjected to local telecom regulations. By enabling notifications, you authorize Thesdel to transmit automated, contextual synchronization alerts on your behalf.
              </p>

              <h3 className="font-mono font-bold text-zinc-900 uppercase">4. Academic Records and Schedule Integrity</h3>
              <p className="leading-relaxed">
                Timetable synchronization is an auxiliary aid designed to foster academic preparation and lecture coordination. It does not replace formal university registers. Users are responsible for confirming all officially published university calendars, examination dates, and room assignments.
              </p>

              <h3 className="font-mono font-bold text-zinc-900 uppercase">5. Service Availability and Repercussions</h3>
              <p className="leading-relaxed">
                Thesdel is provided on an "as is" and "as available" basis. We offer no warranties, express or implied, regarding system uptime, schedule synchronization speeds, or notification delivery reliability. Publishers are not liable for academic penalties, missed lectures, or attendance discrepancies arising from platform utilization.
              </p>
            </div>

            <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-400">Thesdel Legal Department</span>
              <button
                onClick={() => setActiveScreen('signup')}
                className="px-4 py-2 bg-zinc-950 text-white font-mono text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Return to Signup
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: Detailed Privacy Policy */}
        {activeScreen === 'privacy' && (
          <div className="border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 max-w-2xl mx-auto animate-fade-in" id="privacy-screen">
            <div className="border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-zinc-700" />
              <h2 className="text-lg font-mono font-bold uppercase tracking-wide text-zinc-900">
                Privacy Policy
              </h2>
            </div>

            <div className="text-xs font-sans text-zinc-600 space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
              <p className="font-mono text-[10px] text-zinc-400 uppercase font-bold">Last updated: July 13, 2026</p>
              
              <h3 className="font-mono font-bold text-zinc-900 uppercase">1. Information Collection and Handling</h3>
              <p className="leading-relaxed">
                We collect personal identifiers including names, email addresses, and phone numbers during the registration process. This information is processed exclusively to establish your academic identity and to enable core application services, including group registration, assistant promotion, and administrative logs.
              </p>

              <h3 className="font-mono font-bold text-zinc-900 uppercase">2. Data Security and Server Storage</h3>
              <p className="leading-relaxed">
                User metrics, class schedules, attendance entries, and registration files are securely maintained using industrial-grade, cloud-hosted relational infrastructure. Communications are encrypted in transit via SSL protocol layers. We strictly forbid unauthorized access or third-party behavioral tracking.
              </p>

              <h3 className="font-mono font-bold text-zinc-900 uppercase">3. Cookies and Persistent Synchronization</h3>
              <p className="leading-relaxed">
                We use secure cookies and localized persistent tokens to preserve active login states, selected class groups, and preferences. These technical assets are necessary to ensure synchronization and state preservation when operating in offline modes.
              </p>

              <h3 className="font-mono font-bold text-zinc-900 uppercase">4. Zero Commercial Disclosure Commitment</h3>
              <p className="leading-relaxed">
                Your privacy is paramount. Thesdel does not license, share, or sell academic rosters, contact directories, or scheduling records to third-party advertising brokers, behavioral tracking systems, or external marketing entities.
              </p>

              <h3 className="font-mono font-bold text-zinc-900 uppercase">5. Rights and Data Sovereignty</h3>
              <p className="leading-relaxed">
                Users retain full rights to inspect, update, or completely delete their records from the platform. Upon account closure or removal, all registered profile directories, WhatsApp configurations, and logged timetables are permanently purged from active production servers.
              </p>
            </div>

            <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-400">Thesdel Data Protection Officer</span>
              <button
                onClick={() => setActiveScreen('signup')}
                className="px-4 py-2 bg-zinc-950 text-white font-mono text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Return to Signup
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 6: Detailed About Page */}
        {activeScreen === 'about' && (
          <div className="border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 max-w-2xl mx-auto animate-fade-in" id="about-screen">
            <div className="border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-zinc-700" />
              <h2 className="text-lg font-mono font-bold uppercase tracking-wide text-zinc-900">
                About Thesdel
              </h2>
            </div>

            <div className="text-xs font-sans text-zinc-600 space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
              <p className="font-mono text-[10px] text-zinc-400 uppercase font-bold">Published by: The Thesdel Team</p>
              
              <h3 className="font-mono font-bold text-zinc-900 uppercase">Our Mission</h3>
              <p className="leading-relaxed">
                Thesdel is built to empower academic communities by addressing one of the most prominent challenges students and academic coordinators face: real-time timetable coordination and scheduling synchronization. We believe that smooth, decentralized group management can substantially reduce academic friction and improve classroom engagement.
              </p>

              <h3 className="font-mono font-bold text-zinc-900 uppercase">Real-Time Synchronization & Offline-First</h3>
              <p className="leading-relaxed">
                At the core of Thesdel is a resilient sync engine designed to operate seamlessly across varying network conditions. By utilizing robust offline action queues and browser caching, student rosters, subject entries, and venue coordinates are preserved locally, and synchronization occurs transparently when network signals recover.
              </p>

              <h3 className="font-mono font-bold text-zinc-900 uppercase">Who is Behind Thesdel?</h3>
              <p className="leading-relaxed">
                Thesdel is designed and developed by a dedicated team of academic coordinators, technical publishers, and student advocates. Focused on utility, privacy, and architectural cleanliness, we strive to deliver toolsets that foster educational excellence without commercial clutter or tracking networks.
              </p>

              <h3 className="font-mono font-bold text-zinc-900 uppercase">Simulated Accountability</h3>
              <p className="leading-relaxed">
                By integrating smart daily counters, streak calculations, and automatic venue change updates, Thesdel transforms static university schedules into live, responsive ecosystems. It serves as an auxiliary tool supporting lecture preparation and coordination, keeping classes aligned in real time.
              </p>
            </div>

            <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-400">Thesdel Development & Publishing Team</span>
              <button
                onClick={() => setActiveScreen('landing')}
                className="px-4 py-2 bg-zinc-950 text-white font-mono text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Return to Main
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Tiny Footer */}
      <footer className="bg-zinc-950 py-4 border-t border-zinc-800 text-center text-white/50 text-[10px] font-mono">
        <p className="flex items-center justify-center gap-1 min-h-[16px]">
          <span>{footerText}</span>
          <span className="animate-pulse">|</span>
        </p>
      </footer>

    </div>
  );
}
