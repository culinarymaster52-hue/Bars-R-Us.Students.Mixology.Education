/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CocktailRecipe } from './models/CocktailModels';
import { LeaderboardEntry, StudentProfile } from './models/AcademyModels';
import { CocktailRepository } from './database/CocktailRepository';
import { VirtualBarScreen } from './components/VirtualBarScreen';
import { CocktailLibraryScreen } from './components/CocktailLibraryScreen';
import { SpeedRushScreen } from './components/SpeedRushScreen';
import { AcademyQuizScreen } from './components/AcademyQuizScreen';
import { LawsAndSafetyScreen } from './components/LawsAndSafetyScreen';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { ShareAndPromotePanel } from './components/ShareAndPromotePanel';

export type AppScreen =
  | 'VIRTUAL_BAR'
  | 'COCKTAIL_LIBRARY'
  | 'SPEED_RUSH'
  | 'ACADEMY_QUIZ'
  | 'LAWS_AND_SAFETY';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('VIRTUAL_BAR');
  const [cocktails, setCocktails] = useState<CocktailRecipe[]>(() =>
    CocktailRepository.getAllCocktails()
  );
  const [activeTargetRecipe, setActiveTargetRecipe] = useState<CocktailRecipe | null>(() => {
    const all = CocktailRepository.getAllCocktails();
    return all[0] ?? null;
  });
  const [bottleLevels, setBottleLevels] = useState<Record<string, number>>(() =>
    CocktailRepository.getBottleLevels()
  );
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() =>
    CocktailRepository.getStudentProfile()
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    CocktailRepository.getLeaderboard()
  );
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  const handleToggleFavorite = (cocktailId: string) => {
    CocktailRepository.toggleFavorite(cocktailId);
    setCocktails(CocktailRepository.getAllCocktails());
  };

  const handleSaveCustomCocktail = (newRecipe: CocktailRecipe) => {
    CocktailRepository.insertCustomCocktail(newRecipe);
    const updated = CocktailRepository.getAllCocktails();
    setCocktails(updated);
    setActiveTargetRecipe(newRecipe);
    const nextProfile = CocktailRepository.updateStudentProfile((prev) => ({
      ...prev,
      xp: prev.xp + 100,
      drinksMixedCount: prev.drinksMixedCount + 1,
    }));
    setStudentProfile(nextProfile);
  };

  const handleUpdateBottleLevels = (nextLevels: Record<string, number>) => {
    setBottleLevels(nextLevels);
    CocktailRepository.saveBottleLevels(nextLevels);
  };

  const handleRecordDrinkMixed = (accuracyScore: number) => {
    const nextProfile = CocktailRepository.updateStudentProfile((prev) => ({
      ...prev,
      xp: prev.xp + Math.round(accuracyScore * 0.5),
      drinksMixedCount: prev.drinksMixedCount + 1,
      highestAccuracyScore: Math.max(prev.highestAccuracyScore, accuracyScore),
    }));
    setStudentProfile(nextProfile);
  };

  const handlePracticeInBar = (recipe: CocktailRecipe) => {
    setActiveTargetRecipe(recipe);
    setActiveScreen('VIRTUAL_BAR');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteQuizQuestion = (questionId: string, xpEarned: number) => {
    const nextProfile = CocktailRepository.updateStudentProfile((prev) => {
      const alreadyDone = prev.completedQuizIds.includes(questionId);
      return {
        ...prev,
        xp: alreadyDone ? prev.xp + 15 : prev.xp + xpEarned,
        completedQuizIds: alreadyDone
          ? prev.completedQuizIds
          : [...prev.completedQuizIds, questionId],
      };
    });
    setStudentProfile(nextProfile);
  };

  const handleFinishSpeedRushShift = (
    score: number,
    drinksServed: number,
    avgAccuracy: number,
    tipsUsd: number,
    durationMin: number
  ) => {
    const nextProfile = CocktailRepository.updateStudentProfile((prev) => ({
      ...prev,
      xp: prev.xp + Math.round(score * 0.1),
      drinksMixedCount: prev.drinksMixedCount + drinksServed,
      speedRushBestScore: Math.max(prev.speedRushBestScore, score),
    }));
    setStudentProfile(nextProfile);

    const updatedLb = CocktailRepository.addLeaderboardEntry({
      id: `lb_${Date.now()}`,
      bartenderName: `${nextProfile.name} (You)`,
      rank: nextProfile.rank,
      score,
      drinksServed,
      avgAccuracy,
      tipsEarnedUsd: tipsUsd,
      shiftDurationMin: durationMin,
      timestamp: Date.now(),
    });
    setLeaderboard(updatedLb);
  };

  const navItems: Array<{ id: AppScreen; label: string }> = [
    { id: 'VIRTUAL_BAR', label: 'Virtual Bar' },
    { id: 'COCKTAIL_LIBRARY', label: 'Cocktail Codex' },
    { id: 'SPEED_RUSH', label: 'Speed Rush' },
    { id: 'ACADEMY_QUIZ', label: 'Academy' },
    { id: 'LAWS_AND_SAFETY', label: 'State Laws' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-[#F1F5F9]">
      {/* Strictly 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-4 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80 no-print">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveScreen('VIRTUAL_BAR');
          }}
          className="text-xl font-display font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0"
        >
          Bars R Us
        </a>

        {/* Zone 2: 5 Concise Single-Line Text Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="flex items-center gap-6 text-sm font-medium text-slate-400 overflow-x-auto"
        >
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveScreen(item.id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                  isActive
                    ? 'text-amber-400 border-amber-400 font-semibold'
                    : 'text-slate-400 border-transparent hover:text-slate-100 hover:border-slate-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsAiDrawerOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Ask Alistair AI
          </button>
        </div>
      </header>

      {/* Architectural Speakeasy Hero Strip (Displayed on Virtual Bar Home) */}
      {activeScreen === 'VIRTUAL_BAR' && (
        <section className="max-w-[1400px] w-full mx-auto px-6 pt-6 no-print">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#0F1623] grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between z-10">
              <div>
                <div className="text-xs text-amber-400">
                  Bars R Us Mixology Guild · {studentProfile.rank} ({studentProfile.xp} XP)
                </div>
                <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-100 mt-1.5 text-balance">
                  Precision Mixology, Dilution Physics & Sommelier Service
                </h2>
                <p className="text-sm text-slate-300 mt-2.5 max-w-xl leading-relaxed">
                  Practice 300+ archival and modern cocktail specifications, test your speed on the 10-minute service rail, and consult Master Mixologist Alistair for live palate diagnostics.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300 font-mono tabular-nums">
                <span>{cocktails.length} Indexed Recipes</span>
                <span aria-hidden="true">·</span>
                <span>12 Crystal & Copper Vessels</span>
                <span aria-hidden="true">·</span>
                <span>50-State Alcohol Law Atlas</span>
                <span aria-hidden="true">·</span>
                <span>{studentProfile.drinksMixedCount} Pours Logged</span>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[200px] bg-slate-900">
              <img
                src="/src/assets/images/hero_craft_speakeasy_1794388089272.jpg"
                alt="Warm backlit apothecary spirit shelves and copper jiggers on a travertine bar counter"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0F1623] via-[#0F1623]/40 to-transparent" />
            </div>
          </div>
        </section>
      )}

      {/* Main Active Screen Router */}
      <main className="flex-1">
        {activeScreen === 'VIRTUAL_BAR' && (
          <VirtualBarScreen
            allCocktails={cocktails}
            activeTargetRecipe={activeTargetRecipe}
            onSelectTargetRecipe={setActiveTargetRecipe}
            bottleLevels={bottleLevels}
            onUpdateBottleLevels={handleUpdateBottleLevels}
            onSaveCustomCocktail={handleSaveCustomCocktail}
            onRecordDrinkMixed={handleRecordDrinkMixed}
          />
        )}

        {activeScreen === 'COCKTAIL_LIBRARY' && (
          <CocktailLibraryScreen
            cocktails={cocktails}
            onToggleFavorite={handleToggleFavorite}
            onPracticeInBar={handlePracticeInBar}
          />
        )}

        {activeScreen === 'SPEED_RUSH' && (
          <SpeedRushScreen
            studentProfile={studentProfile}
            leaderboard={leaderboard}
            onFinishShift={handleFinishSpeedRushShift}
          />
        )}

        {activeScreen === 'ACADEMY_QUIZ' && (
          <AcademyQuizScreen
            studentProfile={studentProfile}
            onCompleteQuestion={handleCompleteQuizQuestion}
          />
        )}

        {activeScreen === 'LAWS_AND_SAFETY' && <LawsAndSafetyScreen />}
      </main>

      {(activeScreen === 'VIRTUAL_BAR' ||
        activeScreen === 'COCKTAIL_LIBRARY' ||
        activeScreen === 'LAWS_AND_SAFETY') && (
        <section className="max-w-[1400px] w-full mx-auto px-6 pb-8 no-print">
          <ShareAndPromotePanel studentProfile={studentProfile} compact />
        </section>
      )}

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-6 text-xs text-slate-400 no-print">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Bars R Us — BarCraft Mixology Academy & Virtual Bar (com.barsrus.mixology.pub)
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveScreen('LAWS_AND_SAFETY')}
              className="hover:text-slate-200 transition-colors"
            >
              50-State Responsible Service Atlas
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsAiDrawerOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Master Mixologist Alistair & Kotlin Blueprint
            </button>
          </div>
        </div>
      </footer>

      {/* Master Mixologist Alistair Slide-Over Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        contextSummary={`Active Screen: ${activeScreen}. Target Cocktail: ${
          activeTargetRecipe?.name ?? 'Free-Pour'
        }. Student Rank: ${studentProfile.rank} (${studentProfile.xp} XP).`}
      />
    </div>
  );
}
