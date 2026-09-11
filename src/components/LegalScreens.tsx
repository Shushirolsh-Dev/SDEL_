import React from 'react';
import { FileText, Lock, Info } from 'lucide-react';

/* ============================================================
   TERMS OF SERVICE
   ============================================================ */

interface TermsScreenProps {
  onReturnToSignup: () => void;
}

export const TermsScreen: React.FC<TermsScreenProps> = ({
  onReturnToSignup,
}) => {
  return (
    <div
      className="border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 max-w-2xl mx-auto animate-fade-in"
      id="terms-screen"
    >
      <div className="border-b border-zinc-100 pb-3 flex items-center gap-2">
        <FileText className="w-5 h-5 text-zinc-700" />
        <h2 className="text-lg font-mono font-bold uppercase tracking-wide text-zinc-900">
          Terms of Service
        </h2>
      </div>

      <div className="text-xs font-sans text-zinc-600 space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
        <p className="font-mono text-[10px] text-zinc-400 uppercase font-bold">
          Last updated: July 13, 2026
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          1. Agreement and Intellectual Property
        </h3>
        <p className="leading-relaxed">
          By creating an account on the Thesdel platform, you agree
          to comply with and be bound by these Terms of Service.
          Thesdel is the exclusive intellectual property of its
          publishers. All rights are reserved. Any unauthorized
          reproduction, modification, or distribution of platform
          interfaces or proprietary code is strictly prohibited.
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          2. Roster Management and Administrative Roles
        </h3>
        <p className="leading-relaxed">
          Thesdel provides administrative controls for academic
          timetables. Standard Class Representatives possess full
          ownership, including exclusive authority to demote
          assistants, delete class groups, or instantly remove any
          member. Class Assistants can manage scheduling entries, and
          can initiate member removal requests which are placed into
          a pending list for final administrative approval.
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          3. Real-Time WhatsApp Integration
        </h3>
        <p className="leading-relaxed">
          Representatives and authorized administrators agree to
          maintain correct contact numbers. WhatsApp notification
          dispatching is subjected to local telecom regulations. By
          enabling notifications, you authorize Thesdel to transmit
          automated, contextual synchronization alerts on your behalf.
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          4. Academic Records and Schedule Integrity
        </h3>
        <p className="leading-relaxed">
          Timetable synchronization is an auxiliary aid designed to
          foster academic preparation and lecture coordination. It
          does not replace formal university registers. Users are
          responsible for confirming all officially published
          university calendars, examination dates, and room
          assignments.
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          5. Service Availability and Repercussions
        </h3>
        <p className="leading-relaxed">
          Thesdel is provided on an "as is" and "as available" basis.
          We offer no warranties, express or implied, regarding system
          uptime, schedule synchronization speeds, or notification
          delivery reliability. Publishers are not liable for academic
          penalties, missed lectures, or attendance discrepancies
          arising from platform utilization.
        </p>
      </div>

      <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
        <span className="text-[10px] font-mono text-zinc-400">
          Thesdel Legal Department
        </span>
        <button
          onClick={onReturnToSignup}
          className="px-4 py-2 bg-zinc-950 text-white font-mono text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Return to Signup
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   PRIVACY POLICY
   ============================================================ */

interface PrivacyScreenProps {
  onReturnToSignup: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  onReturnToSignup,
}) => {
  return (
    <div
      className="border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 max-w-2xl mx-auto animate-fade-in"
      id="privacy-screen"
    >
      <div className="border-b border-zinc-100 pb-3 flex items-center gap-2">
        <Lock className="w-5 h-5 text-zinc-700" />
        <h2 className="text-lg font-mono font-bold uppercase tracking-wide text-zinc-900">
          Privacy Policy
        </h2>
      </div>

      <div className="text-xs font-sans text-zinc-600 space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
        <p className="font-mono text-[10px] text-zinc-400 uppercase font-bold">
          Last updated: July 13, 2026
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          1. Information Collection and Handling
        </h3>
        <p className="leading-relaxed">
          We collect personal identifiers including names, email
          addresses, and phone numbers during the registration
          process. This information is processed exclusively to
          establish your academic identity and to enable core
          application services, including group registration,
          assistant promotion, and administrative logs.
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          2. Data Security and Server Storage
        </h3>
        <p className="leading-relaxed">
          User metrics, class schedules, attendance entries, and
          registration files are securely maintained using
          industrial-grade, cloud-hosted relational infrastructure.
          Communications are encrypted in transit via SSL protocol
          layers. We strictly forbid unauthorized access or
          third-party behavioral tracking.
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          3. Cookies and Persistent Synchronization
        </h3>
        <p className="leading-relaxed">
          We use secure cookies and localized persistent tokens to
          preserve active login states, selected class groups, and
          preferences. These technical assets are necessary to ensure
          synchronization and state preservation when operating in
          offline modes.
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          4. Zero Commercial Disclosure Commitment
        </h3>
        <p className="leading-relaxed">
          Your privacy is paramount. Thesdel does not license, share,
          or sell academic rosters, contact directories, or scheduling
          records to third-party advertising brokers, behavioral
          tracking systems, or external marketing entities.
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          5. Rights and Data Sovereignty
        </h3>
        <p className="leading-relaxed">
          Users retain full rights to inspect, update, or completely
          delete their records from the platform. Upon account closure
          or removal, all registered profile directories, WhatsApp
          configurations, and logged timetables are permanently purged
          from active production servers.
        </p>
      </div>

      <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
        <span className="text-[10px] font-mono text-zinc-400">
          Thesdel Data Protection Officer
        </span>
        <button
          onClick={onReturnToSignup}
          className="px-4 py-2 bg-zinc-950 text-white font-mono text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Return to Signup
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   ABOUT
   ============================================================ */

interface AboutScreenProps {
  onReturnToLanding: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({
  onReturnToLanding,
}) => {
  return (
    <div
      className="border border-zinc-200 bg-white p-6 sm:p-8 rounded-none space-y-6 max-w-2xl mx-auto animate-fade-in"
      id="about-screen"
    >
      <div className="border-b border-zinc-100 pb-3 flex items-center gap-2">
        <Info className="w-5 h-5 text-zinc-700" />
        <h2 className="text-lg font-mono font-bold uppercase tracking-wide text-zinc-900">
          About Thesdel
        </h2>
      </div>

      <div className="text-xs font-sans text-zinc-600 space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
        <p className="font-mono text-[10px] text-zinc-400 uppercase font-bold">
          Published by: The Thesdel Team
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          Our Mission
        </h3>
        <p className="leading-relaxed">
          Thesdel is built to empower academic communities by
          addressing one of the most prominent challenges students
          and academic coordinators face: real-time timetable
          coordination and scheduling synchronization. We believe
          that smooth, decentralized group management can
          substantially reduce academic friction and improve
          classroom engagement.
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          Real-Time Synchronization & Offline-First
        </h3>
        <p className="leading-relaxed">
          At the core of Thesdel is a resilient sync engine designed
          to operate seamlessly across varying network conditions. By
          utilizing robust offline action queues and browser caching,
          student rosters, subject entries, and venue coordinates are
          preserved locally, and synchronization occurs transparently
          when network signals recover.
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          Who is Behind Thesdel?
        </h3>
        <p className="leading-relaxed">
          Thesdel is designed and developed by a dedicated team of
          academic coordinators, technical publishers, and student
          advocates. Focused on utility, privacy, and architectural
          cleanliness, we strive to deliver toolsets that foster
          educational excellence without commercial clutter or
          tracking networks.
        </p>

        <h3 className="font-mono font-bold text-zinc-900 uppercase">
          Simulated Accountability
        </h3>
        <p className="leading-relaxed">
          By integrating smart daily counters, streak calculations,
          and automatic venue change updates, Thesdel transforms
          static university schedules into live, responsive
          ecosystems. It serves as an auxiliary tool supporting
          lecture preparation and coordination, keeping classes
          aligned in real time.
        </p>
      </div>

      <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
        <span className="text-[10px] font-mono text-zinc-400">
          Thesdel Development & Publishing Team
        </span>
        <button
          onClick={onReturnToLanding}
          className="px-4 py-2 bg-zinc-950 text-white font-mono text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Return to Main
        </button>
      </div>
    </div>
  );
};