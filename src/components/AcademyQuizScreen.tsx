import React, { useState } from 'react';
import { QuizQuestion, StudentProfile } from '../models/AcademyModels';
import { ACADEMY_QUIZ_QUESTIONS } from '../data/BarCraftData';
import { ShareAndPromotePanel } from './ShareAndPromotePanel';
import {
  Award,
  CheckCircle2,
  XCircle,
  Printer,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface AcademyQuizScreenProps {
  studentProfile: StudentProfile;
  onCompleteQuestion: (questionId: string, xpEarned: number) => void;
}

const MODULES: Array<QuizQuestion['module'] | 'ALL'> = [
  'ALL',
  'Classic Proportions & Families',
  'Distillation, Proof & Aging',
  'Tools, Ice & Dilution Physics',
  'Sommelier & Cicerone Service',
  'Hospitality Law & Safety',
];

export const AcademyQuizScreen: React.FC<AcademyQuizScreenProps> = ({
  studentProfile,
  onCompleteQuestion,
}) => {
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[number]>('ALL');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredQuestions = React.useMemo(() => {
    if (selectedModule === 'ALL') return ACADEMY_QUIZ_QUESTIONS;
    return ACADEMY_QUIZ_QUESTIONS.filter((q) => q.module === selectedModule);
  }, [selectedModule]);

  const currentQuestion = filteredQuestions[currentIdx] ?? filteredQuestions[0];

  const handleSelectModule = (mod: typeof MODULES[number]) => {
    setSelectedModule(mod);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctIndex) {
      onCompleteQuestion(currentQuestion.id, currentQuestion.xpReward);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentIdx((prev) => (prev + 1) % filteredQuestions.length);
  };

  const nextRankXp =
    studentProfile.xp < 350
      ? 350
      : studentProfile.xp < 900
      ? 900
      : studentProfile.xp < 1600
      ? 1600
      : 2500;
  const progressPct = Math.min(100, Math.round((studentProfile.xp / nextRankXp) * 100));

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
      {/* Top Academy Banner Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch bg-[#0F1623] border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="text-xs text-amber-400">
              Bars R Us Guild Curriculum · Sommelier, Cicerone & Craft Mixology
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1 text-balance">
              BarCraft Mixology Academy & Certification
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Master classic proportions, thermodynamics of dilution, AOC distillation laws, wine & draft beer service standards, and hospitality safety.
            </p>
          </div>

          {/* Student Rank & XP Progress Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-400">Current Guild Rank: </span>
                <strong className="text-amber-400 font-semibold">{studentProfile.rank}</strong>
              </div>
              <div className="font-mono tabular-nums text-slate-300">
                {studentProfile.xp} / {nextRankXp} XP ({studentProfile.completedQuizIds.length}/
                {ACADEMY_QUIZ_QUESTIONS.length} modules verified)
              </div>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[220px] bg-slate-900">
          <img
            src="/src/assets/images/academy_cellar_library_1794388090870.jpg"
            alt="Bars R Us Mixology Academy tasting room with copper pot still, Glencairn glasses, and botanical jars"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1623] via-[#0F1623]/30 to-transparent" />
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#0F1623] border border-slate-800/80 rounded-xl p-3">
        {MODULES.map((mod) => (
          <button
            key={mod}
            type="button"
            onClick={() => handleSelectModule(mod)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedModule === mod
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {mod === 'ALL' ? 'All Curriculum Tracks' : mod}
          </button>
        ))}
      </div>

      {/* Main Quiz & Certificate Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Examination Card (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0F1623] border border-slate-800/80 rounded-xl p-6 space-y-5">
          {currentQuestion && (
            <>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5 text-amber-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  {currentQuestion.module}
                </span>
                <span className="font-mono tabular-nums">
                  Question {currentIdx + 1} of {filteredQuestions.length} · +{currentQuestion.xpReward} XP
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
                {currentQuestion.question}
              </h2>

              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let borderStyle = 'border-slate-800 bg-slate-900/80 hover:border-slate-700';
                  if (isSubmitted) {
                    if (isCorrect) {
                      borderStyle = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-100';
                    } else if (isChosen && !isCorrect) {
                      borderStyle = 'border-rose-500/60 bg-rose-950/40 text-rose-100';
                    }
                  } else if (isChosen) {
                    borderStyle = 'border-amber-500 bg-amber-500/10 text-amber-100';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-colors flex items-start justify-between gap-3 ${borderStyle}`}
                    >
                      <span className="leading-relaxed">{opt}</span>
                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isSubmitted && isChosen && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
                  <div className="font-semibold text-amber-400">
                    Master Mixologist Alistair’s Lecture Note:
                  </div>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                {!isSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedOption === null}
                    onClick={handleSubmitAnswer}
                    className="px-5 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 rounded-lg transition-colors"
                  >
                    Verify Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors"
                  >
                    Next Examination Question
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Printable Guild Certificate & Official TIPS / ServSafe Links (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <Award className="w-4 h-4" />
                <span>Guild Credential Transcript</span>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg no-print"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Certificate
              </button>
            </div>

            <div className="border border-amber-500/30 rounded-xl p-5 bg-slate-950/60 space-y-3">
              <div className="text-xs text-slate-400">Bars R Us Guild of Hospitality</div>
              <h3 className="text-xl font-display font-bold text-slate-100">
                {studentProfile.rank}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This certifies that <strong className="text-white">{studentProfile.name}</strong> has demonstrated proficiency in fluid measurement, dilution physics, and responsible hospitality service.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono tabular-nums">
                <div>
                  <div className="text-slate-400">Total Guild XP</div>
                  <div className="text-sm font-bold text-amber-400">{studentProfile.xp} XP</div>
                </div>
                <div>
                  <div className="text-slate-400">Cocktails Mixed</div>
                  <div className="text-sm font-bold text-slate-100">
                    {studentProfile.drinksMixedCount} builds
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Peak Pour Accuracy</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {studentProfile.highestAccuracyScore}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Speed Rush High Score</div>
                  <div className="text-sm font-bold text-slate-100">
                    {studentProfile.speedRushBestScore.toLocaleString()} pts
                  </div>
                </div>
              </div>
            </div>

            {/* Official External Certification Portals (TIPS & ServSafe Alcohol) */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2.5 no-print">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Official External Alcohol Server Certifications</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ready to earn your state-recognized responsible alcohol service permit? Visit the official national certification portals:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href="https://www.gettips.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-xs transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-100">TIPS Certification</div>
                    <div className="text-[11px] text-slate-400">gettips.com · On-Premise</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
                </a>

                <a
                  href="https://www.servsafe.com/ServSafe-Alcohol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-xs transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-100">ServSafe Alcohol</div>
                    <div className="text-[11px] text-slate-400">servsafe.com · NRA Official</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Academy Progress & Promote App to New Users */}
      <ShareAndPromotePanel
        studentProfile={studentProfile}
        customHeadline="Share Your Academy Credential & Invite Fellow Bartenders"
      />
    </div>
  );
};
