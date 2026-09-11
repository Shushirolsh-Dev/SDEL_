import React from 'react';
import { Calendar, Clock, Shield } from 'lucide-react';

const LandingFeatureGrid: React.FC = () => {
  return (
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
            Representatives list active courses, dates, and hours. No
            more scouring messy pinned chat history for PDFs.
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
            Class relocated or cancelled? Receive dynamic live
            warnings before the session starts, saving wasted campus
            trips.
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
            Track daily logs & class counts. Safeguard attendance
            requirements automatically through mock verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingFeatureGrid;