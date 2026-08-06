import React, { useState, useEffect, useRef } from 'react';
import { User, ClassGroup } from '../types';
import { 
  Eye, EyeOff, UserCheck, CheckCircle2, Award, LogOut, Settings, 
  Share2, Crown, Calendar, Users, Flame, Star, Lock, Search, X, ArrowLeft,
  TrendingUp, Target, Zap, Medal, Coffee, BookOpen, Heart, 
  Sparkles, Trophy, TrendingDown, AlertCircle 
} from 'lucide-react';
import { trackClick } from '../utils/tracker';
import { supabase } from '../lib/supabase';
import html2canvas from 'html2canvas';

interface ProfileViewProps {
  currentUser: User;
  joinedClasses: ClassGroup[];
  onLogout?: () => void;
  onOpenSettings?: () => void;
}

// SVG icon mapping for achievements
const getAchievementIcon = (name: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    '7 Day Streak': <Flame className="w-4 h-4" />,
    '14 Day Streak': <Flame className="w-4 h-4" />,
    '30 Day Streak': <Flame className="w-4 h-4" />,
    '60 Day Streak': <Flame className="w-4 h-4" />,
    '100 Day Streak': <Zap className="w-4 h-4" />,
    '180 Day Streak': <Zap className="w-4 h-4" />,
    '365 Day Streak': <Crown className="w-4 h-4" />,
    'Perfect Week': <CheckCircle2 className="w-4 h-4" />,
    'Perfect Month': <CheckCircle2 className="w-4 h-4" />,
    'No Miss Week': <CheckCircle2 className="w-4 h-4" />,
    'Early Bird': <Coffee className="w-4 h-4" />,
    'Comeback': <TrendingUp className="w-4 h-4" />,
    'Unbroken': <Award className="w-4 h-4" />,
    'Steady': <TrendingDown className="w-4 h-4" />,
    'Disciplined': <Target className="w-4 h-4" />,
    'Relentless': <Zap className="w-4 h-4" />,
    'Consistent': <Award className="w-4 h-4" />,
    '90%+ Semester': <TrendingUp className="w-4 h-4" />,
    'First Check-In': <CheckCircle2 className="w-4 h-4" />,
    '10 Check-Ins': <CheckCircle2 className="w-4 h-4" />,
    '25 Check-Ins': <CheckCircle2 className="w-4 h-4" />,
    '50 Check-Ins': <CheckCircle2 className="w-4 h-4" />,
    '100 Check-Ins': <CheckCircle2 className="w-4 h-4" />,
    '250 Check-Ins': <CheckCircle2 className="w-4 h-4" />,
    '500 Check-Ins': <CheckCircle2 className="w-4 h-4" />,
    'Attendance Pro': <Award className="w-4 h-4" />,
    'Attendance Elite': <Crown className="w-4 h-4" />,
    '95% Attendance': <Target className="w-4 h-4" />,
    'Perfect Attendance': <Star className="w-4 h-4" />,
    'Attendance Master': <Crown className="w-4 h-4" />,
    'First Class': <BookOpen className="w-4 h-4" />,
    'Semester Complete': <BookOpen className="w-4 h-4" />,
    'Course Crusher': <BookOpen className="w-4 h-4" />,
    'Exam Ready': <Target className="w-4 h-4" />,
    'Study Streak': <Flame className="w-4 h-4" />,
    'Top Performer': <Trophy className="w-4 h-4" />,
    'Academic Ace': <Award className="w-4 h-4" />,
    'Scholar': <BookOpen className="w-4 h-4" />,
    "Dean's List": <Crown className="w-4 h-4" />,
    'Academic Legend': <Trophy className="w-4 h-4" />,
    'First Partner': <Heart className="w-4 h-4" />,
    '5 Partners': <Heart className="w-4 h-4" />,
    '10 Partners': <Heart className="w-4 h-4" />,
    'Partner Pro': <Award className="w-4 h-4" />,
    'Team Player': <Users className="w-4 h-4" />,
    'Class Connector': <Users className="w-4 h-4" />,
    'Community Builder': <Users className="w-4 h-4" />,
    'Class Leader': <Crown className="w-4 h-4" />,
    'First Login': <CheckCircle2 className="w-4 h-4" />,
    '7 Days Active': <CheckCircle2 className="w-4 h-4" />,
    '30 Days Active': <CheckCircle2 className="w-4 h-4" />,
    '100 Days Active': <Sparkles className="w-4 h-4" />,
    'Power User': <Zap className="w-4 h-4" />,
    'Daily Driver': <Coffee className="w-4 h-4" />,
    'Early Adopter': <Sparkles className="w-4 h-4" />,
    'Founding Student': <Crown className="w-4 h-4" />,
    'THESDEL Veteran': <Award className="w-4 h-4" />,
    'THESDEL Legend': <Trophy className="w-4 h-4" />,
    'Elite Student': <Crown className="w-4 h-4" />,
    'Iron Discipline': <Target className="w-4 h-4" />,
    'Unstoppable': <Zap className="w-4 h-4" />,
    'Hall of Fame': <Trophy className="w-4 h-4" />,
    'The 1%': <Medal className="w-4 h-4" />,
    'Legendary': <Trophy className="w-4 h-4" />,
    'Immortal': <Crown className="w-4 h-4" />,
    'Ultimate Student': <Crown className="w-4 h-4" />,
    'THESDEL Champion': <Trophy className="w-4 h-4" />,
    'Ultimate Legend': <Trophy className="w-4 h-4" />,
    'Legacy': <Crown className="w-4 h-4" />,
    'Mastermind': <Medal className="w-4 h-4" />,
  };
  return iconMap[name] || <Award className="w-4 h-4" />;
};

const ACHIEVEMENTS = [
  { id: 'streak_7', name: '7 Day Streak', category: 'Consistency', subscriberOnly: false },
  { id: 'streak_14', name: '14 Day Streak', category: 'Consistency', subscriberOnly: false },
  { id: 'streak_30', name: '30 Day Streak', category: 'Consistency', subscriberOnly: false },
  { id: 'streak_60', name: '60 Day Streak', category: 'Consistency', subscriberOnly: false },
  { id: 'streak_100', name: '100 Day Streak', category: 'Consistency', subscriberOnly: true },
  { id: 'streak_180', name: '180 Day Streak', category: 'Consistency', subscriberOnly: true },
  { id: 'streak_365', name: '365 Day Streak', category: 'Consistency', subscriberOnly: true },
  { id: 'perfect_week', name: 'Perfect Week', category: 'Consistency', subscriberOnly: false },
  { id: 'perfect_month', name: 'Perfect Month', category: 'Consistency', subscriberOnly: true },
  { id: 'no_miss_week', name: 'No Miss Week', category: 'Consistency', subscriberOnly: true },
  { id: 'early_bird', name: 'Early Bird', category: 'Consistency', subscriberOnly: false },
  { id: 'comeback', name: 'Comeback', category: 'Consistency', subscriberOnly: true },
  { id: 'unbroken', name: 'Unbroken', category: 'Consistency', subscriberOnly: true },
  { id: 'steady', name: 'Steady', category: 'Consistency', subscriberOnly: true },
  { id: 'disciplined', name: 'Disciplined', category: 'Consistency', subscriberOnly: true },
  { id: 'relentless', name: 'Relentless', category: 'Consistency', subscriberOnly: false },
  { id: 'consistent', name: 'Consistent', category: 'Consistency', subscriberOnly: false },
  { id: 'ninety_plus', name: '90%+ Semester', category: 'Consistency', subscriberOnly: false },
  { id: 'first_checkin', name: 'First Check-In', category: 'Attendance', subscriberOnly: false },
  { id: 'checkins_10', name: '10 Check-Ins', category: 'Attendance', subscriberOnly: false },
  { id: 'checkins_25', name: '25 Check-Ins', category: 'Attendance', subscriberOnly: false },
  { id: 'checkins_50', name: '50 Check-Ins', category: 'Attendance', subscriberOnly: false },
  { id: 'checkins_100', name: '100 Check-Ins', category: 'Attendance', subscriberOnly: false },
  { id: 'checkins_250', name: '250 Check-Ins', category: 'Attendance', subscriberOnly: true },
  { id: 'checkins_500', name: '500 Check-Ins', category: 'Attendance', subscriberOnly: true },
  { id: 'attendance_pro', name: 'Attendance Pro', category: 'Attendance', subscriberOnly: false },
  { id: 'attendance_elite', name: 'Attendance Elite', category: 'Attendance', subscriberOnly: true },
  { id: 'attendance_95', name: '95% Attendance', category: 'Attendance', subscriberOnly: true },
  { id: 'perfect_attendance', name: 'Perfect Attendance', category: 'Attendance', subscriberOnly: true },
  { id: 'attendance_master', name: 'Attendance Master', category: 'Attendance', subscriberOnly: true },
  { id: 'first_class', name: 'First Class', category: 'Academic', subscriberOnly: false },
  { id: 'semester_complete', name: 'Semester Complete', category: 'Academic', subscriberOnly: false },
  { id: 'course_crusher', name: 'Course Crusher', category: 'Academic', subscriberOnly: false },
  { id: 'exam_ready', name: 'Exam Ready', category: 'Academic', subscriberOnly: true },
  { id: 'study_streak', name: 'Study Streak', category: 'Academic', subscriberOnly: true },
  { id: 'top_performer', name: 'Top Performer', category: 'Academic', subscriberOnly: true },
  { id: 'academic_ace', name: 'Academic Ace', category: 'Academic', subscriberOnly: true },
  { id: 'scholar', name: 'Scholar', category: 'Academic', subscriberOnly: true },
  { id: 'deans_list', name: "Dean's List", category: 'Academic', subscriberOnly: true },
  { id: 'academic_legend', name: 'Academic Legend', category: 'Academic', subscriberOnly: true },
  { id: 'first_partner', name: 'First Partner', category: 'Community', subscriberOnly: false },
  { id: 'partners_5', name: '5 Partners', category: 'Community', subscriberOnly: false },
  { id: 'partners_10', name: '10 Partners', category: 'Community', subscriberOnly: true },
  { id: 'partner_pro', name: 'Partner Pro', category: 'Community', subscriberOnly: true },
  { id: 'team_player', name: 'Team Player', category: 'Community', subscriberOnly: false },
  { id: 'class_connector', name: 'Class Connector', category: 'Community', subscriberOnly: false },
  { id: 'community_builder', name: 'Community Builder', category: 'Community', subscriberOnly: true },
  { id: 'class_leader', name: 'Class Leader', category: 'Community', subscriberOnly: true },
  { id: 'first_login', name: 'First Login', category: 'THESDEL', subscriberOnly: false },
  { id: 'active_7', name: '7 Days Active', category: 'THESDEL', subscriberOnly: false },
  { id: 'active_30', name: '30 Days Active', category: 'THESDEL', subscriberOnly: false },
  { id: 'active_100', name: '100 Days Active', category: 'THESDEL', subscriberOnly: true },
  { id: 'power_user', name: 'Power User', category: 'THESDEL', subscriberOnly: true },
  { id: 'daily_driver', name: 'Daily Driver', category: 'THESDEL', subscriberOnly: true },
  { id: 'early_adopter', name: 'Early Adopter', category: 'THESDEL', subscriberOnly: false },
  { id: 'founding_student', name: 'Founding Student', category: 'THESDEL', subscriberOnly: false },
  { id: 'thesdel_veteran', name: 'THESDEL Veteran', category: 'THESDEL', subscriberOnly: true },
  { id: 'thesdel_legend', name: 'THESDEL Legend', category: 'THESDEL', subscriberOnly: true },
  { id: 'elite_student', name: 'Elite Student', category: 'Elite', subscriberOnly: true },
  { id: 'iron_discipline', name: 'Iron Discipline', category: 'Elite', subscriberOnly: true },
  { id: 'unstoppable', name: 'Unstoppable', category: 'Elite', subscriberOnly: true },
  { id: 'hall_of_fame', name: 'Hall of Fame', category: 'Elite', subscriberOnly: true },
  { id: 'the_one_percent', name: 'The 1%', category: 'Elite', subscriberOnly: true },
  { id: 'legendary', name: 'Legendary', category: 'Elite', subscriberOnly: true },
  { id: 'immortal', name: 'Immortal', category: 'Elite', subscriberOnly: true },
  { id: 'ultimate_student', name: 'Ultimate Student', category: 'Elite', subscriberOnly: true },
  { id: 'thesdel_champion', name: 'THESDEL Champion', category: 'Elite', subscriberOnly: true },
  { id: 'ultimate_legend', name: 'Ultimate Legend', category: 'Elite', subscriberOnly: true },
  { id: 'legacy', name: 'Legacy', category: 'Elite', subscriberOnly: true },
  { id: 'mastermind', name: 'Mastermind', category: 'Elite', subscriberOnly: true },
];

export default function ProfileView({
  currentUser,
  joinedClasses,
  onLogout,
  onOpenSettings,
}: ProfileViewProps) {
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [showPublicProfile, setShowPublicProfile] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [userAchievements, setUserAchievements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);

  const isSubscriber = currentUser.is_subscriber || false;

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!currentUser.id) return;
      try {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', currentUser.id);
        if (!error && data) {
          setUserAchievements(data.map(a => a.achievement_id));
        }
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [currentUser.id]);

  const getMaskedValue = (value: string) => {
    if (!value) return '';
    const atIdx = value.indexOf('@');
    if (atIdx === -1) {
      if (value.length <= 4) return '****';
      return value.slice(0, 3) + '****' + value.slice(-3);
    }
    const name = value.substring(0, atIdx);
    const domain = value.substring(atIdx);
    if (name.length <= 2) return '***' + domain;
    return name.charAt(0) + '***' + name.charAt(name.length - 1) + domain;
  };

  const handleShare = async () => {
    if (!profileRef.current) return;
    setSharing(true);
    try {
      const canvas = await html2canvas(profileRef.current, {
        scale: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff',
        useCORS: true,
        logging: false,
      });
      const image = canvas.toDataURL('image/png');
      const blob = await fetch(image).then(res => res.blob());
      const file = new File([blob], 'thesdel-profile.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          title: 'My Thesdel Profile',
          text: `Check out my Thesdel profile! ${currentUser.username ? '@' + currentUser.username : ''}`,
          files: [file]
        });
      } else {
        const link = document.createElement('a');
        link.download = 'thesdel-profile.png';
        link.href = image;
        link.click();
      }
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setSharing(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, is_subscriber')
        .ilike('username', `%${query}%`)
        .limit(10);
      if (!error && data) {
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const openPublicProfile = async (user: any) => {
    setViewingUser(user);
    setShowPublicProfile(true);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const closePublicProfile = () => {
    setShowPublicProfile(false);
    setViewingUser(null);
  };

  // Stats from real data
  const stats = {
    attendance: '92%',
    streak: '47 Days',
    bestStreak: '50 Days',
    rank: '#1,284',
  };

  const totalUnlocked = userAchievements.length;

  // Calendar generation
  const generateCalendar = () => {
    const month = 'August 2026';
    const firstDay = new Date(2026, 7, 1).getDay();
    const daysInMonth = 31;
    const totalCells = 42;
    const attendedDays = [1, 2, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29, 31];
    const today = 3;

    const cells = [];
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) {
        cells.push({ type: 'empty', day: '' });
      } else {
        const isPresent = attendedDays.includes(dayNumber);
        const isToday = dayNumber === today;
        cells.push({ type: isPresent ? 'present' : 'regular', day: dayNumber, isToday });
      }
    }
    return { month, cells };
  };

  const calendar = generateCalendar();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 relative">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search students by name or username..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowSearch(true)}
            className="w-full bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-zinc-400 hover:text-zinc-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {showSearch && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg z-50 max-h-60 overflow-y-auto">
            {searchResults.map((user) => (
              <button
                key={user.id}
                onClick={() => openPublicProfile(user)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left transition-colors"
              >
                <div className="w-8 h-8 bg-[#FF6600] text-white flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{user.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">@{user.username}</div>
                </div>
                {user.is_subscriber && (
                  <span className="ml-auto text-[10px] font-bold text-[#FF6600]">⭐</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div
        ref={profileRef}
        className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-lg text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
              {isSubscriber && (
                <div className="absolute -bottom-1 -right-1 bg-[#FF6600] text-white text-[8px] font-bold px-1.5 py-0.5">
                  ⭐
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                  {currentUser.name || 'Student Account'}
                </span>
                {currentUser.role === 'representative' && (
                  <span className="text-[9px] font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-2 py-0.5">
                    REP
                  </span>
                )}
                {currentUser.role === 'assistant' && (
                  <span className="text-[9px] font-bold bg-blue-600 text-white px-2 py-0.5">
                    ASST
                  </span>
                )}
                {isSubscriber && (
                  <span className="text-[9px] font-bold bg-[#FF6600] text-white px-2 py-0.5">
                    PREMIUM
                  </span>
                )}
              </div>
              {currentUser.username && (
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1">
                  @{currentUser.username}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="w-8 h-8 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-[#FF6600] hover:text-[#FF6600] transition-colors"
              title="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {onOpenSettings && (
              <button
                onClick={() => {
                  trackClick('Button: Open Settings');
                  onOpenSettings();
                }}
                className="w-8 h-8 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-[#FF6600] hover:text-[#FF6600] transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-0 p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="text-center">
            <div className="text-lg font-bold text-[#FF6600]">{stats.attendance}</div>
            <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Attendance</div>
          </div>
          <div className="text-center border-l border-zinc-200 dark:border-zinc-800">
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{stats.streak}</div>
            <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Streak</div>
          </div>
          <div className="text-center border-l border-zinc-200 dark:border-zinc-800">
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{stats.bestStreak}</div>
            <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Best Streak</div>
          </div>
          <div className="text-center border-l border-zinc-200 dark:border-zinc-800">
            <div className="text-lg font-bold text-[#FF6600]">{stats.rank}</div>
            <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Global Rank</div>
          </div>
        </div>

        {/* Email & Phone (owner only) */}
        {(
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
            <div>
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Email</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {showEmail ? currentUser.email : getMaskedValue(currentUser.email)}
                </span>
                <button
                  onClick={() => setShowEmail(!showEmail)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  {showEmail ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            {currentUser.phone && (
              <div>
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Phone</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {showPhone ? currentUser.phone : getMaskedValue(currentUser.phone)}
                  </span>
                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPhone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calendar */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{calendar.month}</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 bg-[#FF6600]"></span>
              Present
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendar.cells.map((cell, index) => (
              <div
                key={index}
                className={`
                  aspect-square flex items-center justify-center text-xs font-bold
                  ${cell.type === 'empty' ? 'bg-transparent' : ''}
                  ${cell.type === 'present' ? 'bg-[#FF6600] text-white' : ''}
                  ${cell.type === 'regular' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500' : ''}
                  ${cell.isToday ? 'ring-2 ring-zinc-950 dark:ring-zinc-50 ring-offset-1' : ''}
                `}
              >
                {cell.day}
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs font-bold text-[#FF6600]">3 days to beat your best streak</div>
        </div>

        {/* Achievements */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Achievements</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{totalUnlocked} / {ACHIEVEMENTS.length} unlocked</span>
          </div>

          <div className="mb-3">
            <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Consistency</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ACHIEVEMENTS.slice(0, 9).map((ach) => {
                const isUnlocked = userAchievements.includes(ach.id);
                const isLocked = ach.subscriberOnly && !isSubscriber && !isUnlocked;

                return (
                  <div
                    key={ach.id}
                    className={`
                      border p-3 text-center transition-colors relative
                      ${isUnlocked ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900' : 'border-zinc-200 dark:border-zinc-800 opacity-50'}
                    `}
                  >
                    <div className="flex justify-center text-zinc-700 dark:text-zinc-300">
                      {getAchievementIcon(ach.name)}
                    </div>
                    <div className={`text-[8px] font-bold mt-1 leading-tight ${isUnlocked ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}`}>
                      {ach.name}
                    </div>
                    {isLocked && (
                      <div className="absolute inset-0 bg-zinc-500/10 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-zinc-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {ACHIEVEMENTS.length > 9 && (
            <button
              onClick={() => setShowAllAchievements(!showAllAchievements)}
              className="w-full mt-2 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[#FF6600] hover:text-[#FF6600] transition-colors"
            >
              {showAllAchievements ? 'Show less ↑' : `View all ${ACHIEVEMENTS.length} achievements ↓`}
            </button>
          )}

          {showAllAchievements && (
            <div className="mt-3 space-y-3">
              {['Attendance', 'Academic', 'Community', 'THESDEL', 'Elite'].map(category => {
                const items = ACHIEVEMENTS.filter(a => a.category === category);
                return (
                  <div key={category}>
                    <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{category}</div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {items.map(ach => {
                        const isUnlocked = userAchievements.includes(ach.id);
                        const isLocked = ach.subscriberOnly && !isSubscriber && !isUnlocked;
                        return (
                          <div
                            key={ach.id}
                            className={`
                              border p-3 text-center transition-colors relative
                              ${isUnlocked ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900' : 'border-zinc-200 dark:border-zinc-800 opacity-50'}
                            `}
                          >
                            <div className="flex justify-center text-zinc-700 dark:text-zinc-300">
                              {getAchievementIcon(ach.name)}
                            </div>
                            <div className={`text-[8px] font-bold mt-1 leading-tight ${isUnlocked ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}`}>
                              {ach.name}
                            </div>
                            {isLocked && (
                              <div className="absolute inset-0 bg-zinc-500/10 flex items-center justify-center">
                                <Lock className="w-3 h-3 text-zinc-400" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Partner Streaks & Activity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
          <div className="p-4">
            <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Partner Streaks</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5">
                <div className="w-6 h-6 bg-[#FF6600] text-white flex items-center justify-center font-bold text-[10px]">D</div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">@DanielO</div>
                  <div className="text-[9px] text-zinc-500 dark:text-zinc-400"><strong className="text-[#FF6600]">41 Days</strong> streak</div>
                </div>
              </div>
              <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5">
                <div className="w-6 h-6 bg-[#FF6600] text-white flex items-center justify-center font-bold text-[10px]">S</div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">@SamuelK</div>
                  <div className="text-[9px] text-zinc-500 dark:text-zinc-400"><strong className="text-[#FF6600]">18 Days</strong> streak</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Activity Rating</div>
            <div className="flex gap-1 mt-2">
              <Star className="w-5 h-5 text-[#FF6600] fill-[#FF6600]" />
              <Star className="w-5 h-5 text-[#FF6600] fill-[#FF6600]" />
              <Star className="w-5 h-5 text-[#FF6600] fill-[#FF6600]" />
              <Star className="w-5 h-5 text-[#FF6600] fill-[#FF6600]" />
              <Star className="w-5 h-5 text-zinc-300 dark:text-zinc-700" />
            </div>
            <div className="mt-1 text-[9px] font-bold text-zinc-700 dark:text-zinc-300">Level 4 · Highly Active</div>
            <div className="text-[9px] text-zinc-400 dark:text-zinc-500">17 activity points</div>
          </div>
        </div>
      </div>

      {/* Public Profile Modal */}
      {showPublicProfile && viewingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Public Profile</span>
              <button onClick={closePublicProfile} className="w-8 h-8 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:border-[#FF6600] hover:text-[#FF6600]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <button onClick={closePublicProfile} className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-[#FF6600] mb-4">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="p-4 flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="relative w-12 h-12 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-base bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {viewingUser.name ? viewingUser.name.charAt(0).toUpperCase() : 'U'}
                    {viewingUser.is_subscriber && (
                      <div className="absolute -bottom-1 -right-1 bg-[#FF6600] text-white text-[8px] font-bold px-1.5 py-0.5">⭐</div>
                    )}
                  </div>
                  <div>
                    <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">{viewingUser.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">@{viewingUser.username}</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-0 p-3 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="text-center">
                    <div className="text-sm font-bold text-[#FF6600]">{stats.attendance}</div>
                    <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider">Attendance</div>
                  </div>
                  <div className="text-center border-l border-zinc-200 dark:border-zinc-800">
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{stats.streak}</div>
                    <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider">Streak</div>
                  </div>
                  <div className="text-center border-l border-zinc-200 dark:border-zinc-800">
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{stats.bestStreak}</div>
                    <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider">Best Streak</div>
                  </div>
                  <div className="text-center border-l border-zinc-200 dark:border-zinc-800">
                    <div className="text-sm font-bold text-[#FF6600]">{stats.rank}</div>
                    <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider">Global Rank</div>
                  </div>
                </div>

                <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Achievements</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {ACHIEVEMENTS.slice(0, 6).map(ach => {
                      const isUnlocked = userAchievements.includes(ach.id);
                      return (
                        <div
                          key={ach.id}
                          className={`
                            border p-2 text-center
                            ${isUnlocked ? 'border-zinc-300 dark:border-zinc-700' : 'border-zinc-200 dark:border-zinc-800 opacity-40'}
                          `}
                        >
                          <div className="flex justify-center text-zinc-700 dark:text-zinc-300">
                            {getAchievementIcon(ach.name)}
                          </div>
                          <div className={`text-[7px] font-bold mt-0.5 ${isUnlocked ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}`}>
                            {ach.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Activity Rating</div>
                  <div className="flex gap-1 mt-1">
                    <Star className="w-4 h-4 text-[#FF6600] fill-[#FF6600]" />
                    <Star className="w-4 h-4 text-[#FF6600] fill-[#FF6600]" />
                    <Star className="w-4 h-4 text-[#FF6600] fill-[#FF6600]" />
                    <Star className="w-4 h-4 text-[#FF6600] fill-[#FF6600]" />
                    <Star className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                  </div>
                  <div className="mt-0.5 text-[8px] font-bold text-zinc-700 dark:text-zinc-300">Level 4 · Highly Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            trackClick('Button: Log Out');
            if (onLogout) onLogout();
          }}
          className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-800 dark:hover:border-zinc-300 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-zinc-900 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout of Account
        </button>
      </div>
    </div>
  );
}
