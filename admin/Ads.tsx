import React, { useState } from 'react';
import { AlertCircle, Megaphone, Send, Check, Image, HelpCircle } from 'lucide-react';

interface AdsProps {
  loading: boolean;
  activeClasses?: { id: string; name: string; code: string }[];
  onPostAd: (classId: string, adPayload: string) => Promise<boolean>;
}

const PRESET_AD_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60', name: 'Student Group Study' },
  { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60', name: 'Exam preparation / Notebook' },
  { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60', name: 'College Campus Life' },
  { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60', name: 'Creative Team Project' },
];

export default function Ads({ loading, activeClasses = [], onPostAd }: AdsProps) {
  // Campaign form states
  const [adTitle, setAdTitle] = useState<string>('');
  const [adDescription, setAdDescription] = useState<string>('');
  const [adImageUrl, setAdImageUrl] = useState<string>(PRESET_AD_IMAGES[0].url);
  const [adActionText, setAdActionText] = useState<string>('Learn More');
  const [adUrl, setAdUrl] = useState<string>('');
  const [targetClassId, setTargetClassId] = useState<string>('global');

  const [publishing, setPublishing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adDescription.trim() || !adUrl.trim()) {
      setError('Title, Description, and Destination URL are required fields.');
      return;
    }

    setPublishing(true);
    setError(null);
    setSuccess(false);

    try {
      const adData = {
        isAd: true,
        adTitle: adTitle.trim(),
        adImageUrl: adImageUrl.trim(),
        adActionText: adActionText.trim(),
        adUrl: adUrl.trim(),
        description: adDescription.trim(),
        timestamp: new Date().toISOString()
      };

      const serialized = JSON.stringify(adData);
      const ok = await onPostAd(targetClassId, serialized);

      if (ok) {
        setSuccess(true);
        setAdTitle('');
        setAdDescription('');
        setAdUrl('');
        setAdActionText('Learn More');
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError('Failed to dispatch ad campaign. Please check network logs.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during ad campaign dispatch.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6" id="admin-ads-manager-page">
      {/* Informative Header Banner */}
      <div className="flex items-start gap-3 border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 shadow-sm">
        <Megaphone className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Sponsored Ads Dispatch Center</h4>
          <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
            Create high-contrast, beautiful sponsored spotlight cards for target cohorts. These native visual cards appear in the announcements notifications feed of specified student groups.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Campaign Builder Form */}
        <div className="lg:col-span-7 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <span>Configure Ad Campaign</span>
            <span className="text-[8px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded border border-zinc-200 dark:border-zinc-700">CAMPAIGN EDITOR</span>
          </h3>

          <form onSubmit={handleSubmitAd} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Target Student Audience</label>
              <select
                value={targetClassId}
                onChange={(e) => setTargetClassId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="global">GLOBAL AUDIENCE (All cohorts)</option>
                <option value="class_reps">CLASS REPRESENTATIVES ONLY</option>
                <option value="region_north">REGIONAL COHORT: Northern Territory</option>
                <option value="region_south">REGIONAL COHORT: Southern Territory</option>
                <option value="country_all">COUNTRY GROUP: Nigeria National</option>
                {activeClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    CLASS: {c.name.toUpperCase()} ({c.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Ad Title / Headline</label>
                <input
                  type="text"
                  required
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="e.g., 50% Off Student Pizza Deal"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Action Button Label</label>
                <input
                  type="text"
                  required
                  value={adActionText}
                  onChange={(e) => setAdActionText(e.target.value)}
                  placeholder="e.g., Claim Coupon, Apply Now"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Destination URL</label>
              <input
                type="url"
                required
                value={adUrl}
                onChange={(e) => setAdUrl(e.target.value)}
                placeholder="e.g., https://pizza-deal.example.com/student"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Ad Banner Image Selection</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {PRESET_AD_IMAGES.map((img, idx) => {
                  const isSelected = adImageUrl === img.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAdImageUrl(img.url)}
                      className={`relative aspect-[16/10] border overflow-hidden cursor-pointer ${
                        isSelected ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-mono text-white p-1 truncate text-center">
                        {img.name}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={adImageUrl}
                  onChange={(e) => setAdImageUrl(e.target.value)}
                  placeholder="Or paste custom image URL..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-[11px] font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1.5">Ad Main Description</label>
              <textarea
                value={adDescription}
                onChange={(e) => setAdDescription(e.target.value)}
                placeholder="Briefly explain the offer, discount code, or sponsor's request..."
                rows={3}
                maxLength={250}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-xs font-mono text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <div className="flex items-center justify-between mt-1 text-[9px] text-zinc-500 font-mono">
                <span>Maximum 250 characters. Keep it brief.</span>
                <span>{adDescription.length}/250</span>
              </div>
            </div>

            {success && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-400 font-mono text-xs flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 shrink-0" />
                <span>Ad campaign dispatched and scheduled successfully!</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-400 font-mono text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={publishing || loading || !adTitle.trim() || !adDescription.trim()}
                className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-mono text-xs font-bold px-5 py-2.5 flex items-center gap-2 transition-colors cursor-pointer select-none border border-zinc-900"
              >
                {publishing ? (
                  <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Launch Ad Spotlight</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Display */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span>Dynamic Spotlight Preview</span>
              <span className="text-[7px] text-zinc-400 font-mono uppercase">Render Engine (Live)</span>
            </h3>

            {/* Simulated Live Announcement Box */}
            <div className="border p-4 bg-amber-50/40 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30 shadow-sm relative overflow-hidden transition-all duration-300">
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none border bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40">
                  SPONSOR SPOTLIGHT
                </span>
                <span className="text-[8px] text-amber-600 dark:text-amber-400 font-mono font-bold uppercase tracking-wider">
                  • PROMOTED
                </span>
                <span className="text-[9px] text-zinc-400 font-mono ml-auto">
                  Today, 10:42 AM
                </span>
              </div>

              {adImageUrl && (
                <div className="w-full aspect-[16/9] overflow-hidden mb-3 border border-amber-100 dark:border-amber-900/20 bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={adImageUrl}
                    alt="Ad Banner Preview"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      // Fallback if URL is invalid
                      e.currentTarget.src = PRESET_AD_IMAGES[0].url;
                    }}
                  />
                </div>
              )}

              <h4 className="text-xs font-bold font-sans text-zinc-900 dark:text-zinc-100 mb-1 tracking-tight select-none">
                {adTitle || 'Your Campaign Headline Displayed Here'}
              </h4>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans mb-3 select-none">
                {adDescription || 'Enter a description in the editor to preview how your sponsor text will appear to targeted students.'}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-amber-200/40 dark:border-amber-900/20">
                <span className="text-[9px] text-zinc-400 font-mono">
                  Sponsor: <span className="font-bold text-zinc-600 dark:text-zinc-300">Verified Partner</span>
                </span>

                <button
                  type="button"
                  onClick={() => adUrl && window.open(adUrl, '_blank')}
                  className="px-3 py-1.5 text-[9px] font-mono font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors cursor-pointer select-none"
                >
                  {adActionText || 'Learn More'}
                </button>
              </div>
            </div>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2">
            <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Audience Targeting Logic</h4>
            <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 space-y-1">
              <p>• <strong>Global Audience:</strong> Dispatches to all registered students.</p>
              <p>• <strong>Class Representatives:</strong> Focuses specifically on course leaders.</p>
              <p>• <strong>Regions / Classes:</strong> Keeps feed strictly localized to relevant classrooms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
