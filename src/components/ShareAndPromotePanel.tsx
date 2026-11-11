import React, { useState } from 'react';
import { StudentProfile } from '../models/AcademyModels';
import { Share2, Check, Copy, ExternalLink, Award, Megaphone, Sparkles } from 'lucide-react';

interface ShareAndPromotePanelProps {
  studentProfile: StudentProfile;
  customHeadline?: string;
  customScoreText?: string;
  compact?: boolean;
}

const PROMO_TEMPLATES = [
  {
    id: 'guild_invite',
    label: 'Bartender & Mixology Invite',
    text: 'I am training on Bars R Us — BarCraft Mixology Academy & Virtual Bar! Practice 300+ classic & modern cocktail specs with a 0.1–2.0 oz precision jigger, 415+ spirits/wines/beers/bitters, a 10-minute Speed Rush shift simulator, and 50-state alcohol compliance laws.',
  },
  {
    id: 'speed_rush_challenge',
    label: '10-Minute Speed Rush Challenge',
    text: 'Think you can survive a 10-minute Friday night service rush? Test your ticket speed, jigger accuracy, and patron tips on the Bars R Us 12-Drink Speed Rush Rail!',
  },
  {
    id: 'hospitality_academy',
    label: 'Hospitality & Sommelier Study',
    text: 'Studying for TIPS, ServSafe Alcohol, Cicerone, or Sommelier service? Check out Bars R Us for interactive dilution physics, 110+ wine varietals, 60 global beers, and Master Mixologist Alistair AI.',
  },
];

export const ShareAndPromotePanel: React.FC<ShareAndPromotePanelProps> = ({
  studentProfile,
  customHeadline,
  customScoreText,
  compact = false,
}) => {
  const [mode, setMode] = useState<'PROGRESS' | 'PROMOTE'>('PROGRESS');
  const [selectedPromoIdx, setSelectedPromoIdx] = useState(0);
  const [copiedType, setCopiedType] = useState<'SCORE' | 'PROMO' | 'LINK' | null>(null);

  const appUrl =
    typeof window !== 'undefined' ? window.location.origin : 'https://barsrus.mixology.pub';

  const progressShareText = customScoreText
    ? `${customScoreText} | Guild Rank: ${studentProfile.rank} (${studentProfile.xp} XP · ${studentProfile.highestAccuracyScore}% Peak Accuracy) on Bars R Us — BarCraft Mixology Academy & Virtual Bar!`
    : `I reached ${studentProfile.rank} (${studentProfile.xp} XP) on Bars R Us — BarCraft Mixology Academy! Mixed ${studentProfile.drinksMixedCount} cocktails with ${studentProfile.highestAccuracyScore}% peak jigger accuracy and a ${studentProfile.speedRushBestScore.toLocaleString()} pt Speed Rush high score.`;

  const promoShareText = `${PROMO_TEMPLATES[selectedPromoIdx].text} Join me here: ${appUrl}`;

  const activeShareText = mode === 'PROGRESS' ? progressShareText : promoShareText;
  const encodedText = encodeURIComponent(activeShareText);
  const encodedUrl = encodeURIComponent(appUrl);
  const encodedTitle = encodeURIComponent(
    customHeadline || `Bars R Us Mixology Guild — ${studentProfile.rank}`
  );

  const socialPlatforms = [
    {
      name: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Reddit',
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    },
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: 'Email Invite',
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    },
  ];

  const handleCopyText = async (text: string, type: 'SCORE' | 'PROMO' | 'LINK') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback ignored in restricted clipboard contexts
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Bars R Us — BarCraft Mixology Academy & Virtual Bar',
          text: activeShareText,
          url: appUrl,
        });
        return;
      } catch {
        // User cancelled or unsupported
      }
    }
    handleCopyText(`${activeShareText} ${appUrl}`, mode === 'PROGRESS' ? 'SCORE' : 'PROMO');
  };

  return (
    <div
      className={`bg-[#0F1623] border border-slate-800/80 rounded-xl ${
        compact ? 'p-4' : 'p-5'
      } space-y-4 no-print`}
    >
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            <span>External Social Sharing & Guild Ambassador Hub</span>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-0.5">
            {customHeadline || 'Share Your Guild Progress & Promote Bars R Us'}
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setMode('PROGRESS')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'PROGRESS'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Share My Score & Rank
          </button>
          <button
            type="button"
            onClick={() => setMode('PROMOTE')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'PROMOTE'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            Promote App to New Users
          </button>
        </div>
      </div>

      {/* Mode Content */}
      {mode === 'PROGRESS' ? (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-amber-400 font-semibold">
                Live Guild Score & Progress Dispatch
              </span>
              <span className="font-mono tabular-nums text-slate-400">
                {studentProfile.rank} · {studentProfile.xp} XP · Best Rush:{' '}
                {studentProfile.speedRushBestScore.toLocaleString()} pts
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
              “{progressShareText}”
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {PROMO_TEMPLATES.map((tpl, idx) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedPromoIdx(idx)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  selectedPromoIdx === idx
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 font-semibold inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Ready-to-Post Invitation for New Bartenders & Students
              </span>
              <span className="text-slate-400 font-mono text-[11px] truncate max-w-[200px]">
                {appUrl}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
              “{promoShareText}”
            </p>
          </div>
        </div>
      )}

      {/* External Platform Links & Copy Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <span>{platform.name}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              handleCopyText(
                `${activeShareText} ${appUrl}`,
                mode === 'PROGRESS' ? 'SCORE' : 'PROMO'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            {copiedType === 'SCORE' || copiedType === 'PROMO' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Post!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Post & Link
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Now
          </button>
        </div>
      </div>
    </div>
  );
};
