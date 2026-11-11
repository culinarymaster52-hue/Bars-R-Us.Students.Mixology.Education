import React, { useEffect, useState } from 'react';
import {
  CocktailRecipe,
  GLASS_SPECS,
  GlassType,
  PREP_TECHNIQUE_INFO,
  PrepTechnique,
} from '../models/CocktailModels';
import {
  CustomerMood,
  LeaderboardEntry,
  SpeedRushCustomer,
  StudentProfile,
} from '../models/AcademyModels';
import { FULL_COCKTAIL_CATALOG, get12FreshSpeedRushCocktails } from '../data/CocktailCatalog';
import { BAR_INGREDIENTS } from '../data/BarCraftData';
import { ShareAndPromotePanel } from './ShareAndPromotePanel';
import {
  Timer,
  Trophy,
  DollarSign,
  Flame,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface SpeedRushScreenProps {
  studentProfile: StudentProfile;
  leaderboard: LeaderboardEntry[];
  onFinishShift: (
    score: number,
    drinksServed: number,
    avgAccuracy: number,
    tipsUsd: number,
    durationMin: number
  ) => void;
}

const PATRON_NAMES = [
  { name: 'Julian Vance', archetype: 'Architecture Critic' },
  { name: 'Clara Delacroix', archetype: 'Sommelier Off-Duty' },
  { name: 'Marcus Thorne', archetype: 'Jazz Saxophonist' },
  { name: 'Sloane Mercer', archetype: 'Hospitality Director' },
  { name: 'Dr. Aris Thorne', archetype: 'Botanical Chemist' },
  { name: 'Nadia Lindqvist', archetype: 'Culinary Editor' },
  { name: 'Mateo Valdés', archetype: 'Mezcal Maestro' },
  { name: 'Elena Rostova', archetype: 'Opera Soprano' },
];

function createCustomerTicketFromDeck(
  shiftDeck: CocktailRecipe[],
  deckIndex: number
): SpeedRushCustomer {
  const patron = PATRON_NAMES[deckIndex % PATRON_NAMES.length];
  const recipe =
    shiftDeck[deckIndex % shiftDeck.length] ??
    FULL_COCKTAIL_CATALOG[deckIndex % FULL_COCKTAIL_CATALOG.length];
  return {
    id: `cust_${Date.now()}_${deckIndex}_${Math.random().toString(36).slice(2, 6)}`,
    name: patron.name,
    archetype: patron.archetype,
    recipe,
    patienceMaxSec: 75,
    patienceRemainingSec: 75,
    mood: 'DELIGHTED',
    baseTipUsd: 8.0,
    specialNote: `Strictly ${GLASS_SPECS[recipe.glass].name.split('/')[0]} · ${
      PREP_TECHNIQUE_INFO[recipe.technique].label
    }`,
  };
}

export const SpeedRushScreen: React.FC<SpeedRushScreenProps> = ({
  studentProfile,
  leaderboard,
  onFinishShift,
}) => {
  const [shiftDurationMin, setShiftDurationMin] = useState<10 | 3>(10);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600);

  // Track shift round seed and the 12 fresh cocktails selected for this 10-minute shift
  const [shiftRoundCount, setShiftRoundCount] = useState<number>(1);
  const [tenMinuteWindowId, setTenMinuteWindowId] = useState<number>(() =>
    Math.floor(Date.now() / (10 * 60 * 1000))
  );
  const [shiftTwelveCocktails, setShiftTwelveCocktails] = useState<CocktailRecipe[]>(() =>
    get12FreshSpeedRushCocktails(1, new Set(), FULL_COCKTAIL_CATALOG)
  );
  const [nextDeckCursor, setNextDeckCursor] = useState<number>(3);
  const [servedRecipeIdsInShift, setServedRecipeIdsInShift] = useState<string[]>([]);

  const [customers, setCustomers] = useState<SpeedRushCustomer[]>(() => {
    const initialDeck = get12FreshSpeedRushCocktails(1, new Set(), FULL_COCKTAIL_CATALOG);
    return [
      createCustomerTicketFromDeck(initialDeck, 0),
      createCustomerTicketFromDeck(initialDeck, 1),
      createCustomerTicketFromDeck(initialDeck, 2),
    ];
  });
  const [activeCustomerIdx, setActiveCustomerIdx] = useState(0);

  // Fast-Pour Ticket Assembly State
  const [selectedGlass, setSelectedGlass] = useState<GlassType>(() =>
    customers[0]?.recipe.glass ?? GlassType.ROCKS
  );
  const [selectedTech, setSelectedTech] = useState<PrepTechnique>(() =>
    customers[0]?.recipe.technique ?? PrepTechnique.STIR
  );
  const [iceToggle, setIceToggle] = useState<boolean>(() =>
    customers[0]?.recipe.iceRequired ?? true
  );
  const [ticketPours, setTicketPours] = useState<Record<string, number>>({});

  // Shift Telemetry
  const [score, setScore] = useState(0);
  const [tipsUsd, setTipsUsd] = useState(0);
  const [drinksServed, setDrinksServed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [accuracySum, setAccuracySum] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{ text: string; isGood: boolean } | null>(null);

  const activeCustomer = customers[activeCustomerIdx] ?? customers[0];

  // Automatically check every 30s if a new 10-minute wall-clock window has started while idle
  useEffect(() => {
    const checkWindow = setInterval(() => {
      const currentBucket = Math.floor(Date.now() / (10 * 60 * 1000));
      if (currentBucket !== tenMinuteWindowId && !isRunning) {
        setTenMinuteWindowId(currentBucket);
        const prevIds = new Set(shiftTwelveCocktails.map((c) => c.id));
        const nextRound = shiftRoundCount + 1;
        const fresh12 = get12FreshSpeedRushCocktails(nextRound, prevIds, FULL_COCKTAIL_CATALOG);
        setShiftRoundCount(nextRound);
        setShiftTwelveCocktails(fresh12);
      }
    }, 30000);
    return () => clearInterval(checkWindow);
  }, [tenMinuteWindowId, isRunning, shiftTwelveCocktails, shiftRoundCount]);

  // Shift countdown timer & customer patience decay
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });

      setCustomers((prevList) =>
        prevList.map((c) => {
          const nextSec = Math.max(0, c.patienceRemainingSec - 1);
          const ratio = nextSec / c.patienceMaxSec;
          let mood: CustomerMood = 'DELIGHTED';
          if (ratio < 0.25) mood = 'FRUSTRATED';
          else if (ratio < 0.55) mood = 'IMPATIENT';
          else if (ratio < 0.8) mood = 'PATIENT';
          return { ...c, patienceRemainingSec: nextSec, mood };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Start a new 10-minute (or 3-minute) shift with 12 brand-new, non-repeating cocktails
  const handleStartShift = (minutes: 10 | 3) => {
    const prevIds = new Set(shiftTwelveCocktails.map((c) => c.id));
    const nextRound = shiftRoundCount + 1;
    const fresh12 = get12FreshSpeedRushCocktails(nextRound, prevIds, FULL_COCKTAIL_CATALOG);

    setShiftRoundCount(nextRound);
    setTenMinuteWindowId(Math.floor(Date.now() / (10 * 60 * 1000)));
    setShiftTwelveCocktails(fresh12);
    setServedRecipeIdsInShift([]);

    const initial = [
      createCustomerTicketFromDeck(fresh12, 0),
      createCustomerTicketFromDeck(fresh12, 1),
      createCustomerTicketFromDeck(fresh12, 2),
    ];
    setNextDeckCursor(3);
    setShiftDurationMin(minutes);
    setSecondsLeft(minutes * 60);
    setCustomers(initial);
    setActiveCustomerIdx(0);
    setSelectedGlass(initial[0].recipe.glass);
    setSelectedTech(initial[0].recipe.technique);
    setIceToggle(initial[0].recipe.iceRequired);
    setTicketPours({});
    setScore(0);
    setTipsUsd(0);
    setDrinksServed(0);
    setStreak(0);
    setAccuracySum(0);
    setLastFeedback({
      text: `Loaded 12 fresh cocktails for Shift #${nextRound}! Serve all 12 specs with speed and accuracy.`,
      isGood: true,
    });
    setIsRunning(true);
  };

  const handleEndAndRecordShift = () => {
    setIsRunning(false);
    if (drinksServed > 0) {
      const avgAcc = Math.round(accuracySum / drinksServed);
      onFinishShift(score, drinksServed, avgAcc, Number(tipsUsd.toFixed(2)), shiftDurationMin);
    }
  };

  const handlePourSpeedIngredient = (ingId: string, stepOz: number) => {
    setTicketPours((prev) => ({
      ...prev,
      [ingId]: Number(((prev[ingId] ?? 0) + stepOz).toFixed(2)),
    }));
  };

  const handleServeActiveCustomer = () => {
    if (!activeCustomer) return;
    const target = activeCustomer.recipe;

    // Score calculation
    let acc = 0;
    if (selectedGlass === target.glass) acc += 20;
    if (selectedTech === target.technique) acc += 20;
    if (iceToggle === target.iceRequired) acc += 10;

    const reqs = target.ingredients.filter((i) => !i.ingredientId.startsWith('garnish_'));
    const perIng = reqs.length > 0 ? 50 / reqs.length : 50;

    for (const req of reqs) {
      const poured = ticketPours[req.ingredientId] ?? 0;
      const diff = Math.abs(poured - req.amountOz);
      if (diff <= 0.05) acc += perIng;
      else if (diff <= 0.25) acc += perIng * 0.7;
      else if (poured > 0) acc += perIng * 0.3;
    }

    const finalAcc = Math.max(0, Math.min(100, Math.round(acc)));
    const moodMultiplier =
      activeCustomer.mood === 'DELIGHTED'
        ? 1.35
        : activeCustomer.mood === 'PATIENT'
        ? 1.15
        : activeCustomer.mood === 'IMPATIENT'
        ? 0.85
        : 0.5;

    const nextStreak = finalAcc >= 85 ? streak + 1 : 0;
    const pointsEarned = Math.round(finalAcc * 2.5 * moodMultiplier + nextStreak * 25);
    const tipEarned = Number(
      (activeCustomer.baseTipUsd * (finalAcc / 100) * moodMultiplier).toFixed(2)
    );

    setScore((s) => s + pointsEarned);
    setTipsUsd((t) => Number((t + tipEarned).toFixed(2)));
    setDrinksServed((d) => d + 1);
    setStreak(nextStreak);
    setAccuracySum((sum) => sum + finalAcc);
    setServedRecipeIdsInShift((prev) =>
      prev.includes(target.id) ? prev : [...prev, target.id]
    );

    setLastFeedback({
      text: `Served ${target.name} to ${activeCustomer.name}: ${finalAcc}% Accuracy · +${pointsEarned} pts · +$${tipEarned.toFixed(2)} tip`,
      isGood: finalAcc >= 80,
    });

    // Replace served customer with the next fresh cocktail from the 12-cocktail shift deck
    const replacement = createCustomerTicketFromDeck(shiftTwelveCocktails, nextDeckCursor);
    setNextDeckCursor((c) => c + 1);
    setCustomers((prev) =>
      prev.map((c, idx) => (idx === activeCustomerIdx ? replacement : c))
    );
    setTicketPours({});
    setSelectedGlass(replacement.recipe.glass);
    setSelectedTech(replacement.recipe.technique);
    setIceToggle(replacement.recipe.iceRequired);
  };

  // Build quick-access ingredient shelf containing the active customer's needed ingredients + common decoys
  const stationIngredients = React.useMemo(() => {
    if (!activeCustomer) return BAR_INGREDIENTS.slice(0, 12);
    const neededIds = new Set(activeCustomer.recipe.ingredients.map((i) => i.ingredientId));
    const needed = BAR_INGREDIENTS.filter((b) => neededIds.has(b.id));
    // If an ingredient in the recipe isn't in BAR_INGREDIENTS by exact ID, synthesize a bottle entry for the rail
    const missingFromCatalog: typeof BAR_INGREDIENTS = activeCustomer.recipe.ingredients
      .filter((req) => !needed.some((n) => n.id === req.ingredientId))
      .map((req) => ({
        id: req.ingredientId,
        name: req.ingredientName,
        type: BAR_INGREDIENTS[0].type,
        subCategory: 'Shift Spec Ingredient',
        abv: 40,
        color: '#F59E0B',
        standardPourOz: req.amountOz || 1.5,
        flavorNote: 'Required for active Speed Rush ticket',
        maxCapacityOz: 25.4,
        unit: req.unit || 'oz',
      }));
    const allNeeded = [...needed, ...missingFromCatalog];
    const decoys = BAR_INGREDIENTS.filter(
      (b) => !neededIds.has(b.id) && b.type !== 'GARNISH' && b.type !== 'ICE'
    ).slice(0, Math.max(3, 12 - allNeeded.length));
    return [...allNeeded, ...decoys];
  }, [activeCustomer]);

  const formatClock = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const meanAccuracy = drinksServed > 0 ? Math.round(accuracySum / drinksServed) : 100;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
      {/* Top Shift Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
            <span>High-Volume Hospitality Simulation</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-semibold">
              12 Fresh Cocktails Rotated Every 10-Minute Shift (Shift #{shiftRoundCount})
            </span>
            <span aria-hidden="true">·</span>
            <span>Drawn from {FULL_COCKTAIL_CATALOG.length} Codex Recipes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            10-Minute Speed Rush Shift
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isRunning ? (
            <>
              <button
                type="button"
                onClick={() => handleStartShift(10)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                Start 10-Min Rush (12 Fresh Drinks)
              </button>
              <button
                type="button"
                onClick={() => handleStartShift(3)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Start 3-Min Sprint (12 Fresh Drinks)
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEndAndRecordShift}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Finish & Log Shift Score
            </button>
          )}
        </div>
      </div>

      {/* 12 Fresh Cocktails Lineup Banner for the Current 10-Minute Shift */}
      <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <h2 className="text-xs font-bold text-slate-100">
                Active 10-Minute Shift Lineup — 12 Fresh Cocktails (Shift #{shiftRoundCount})
              </h2>
              <p className="text-[11px] text-slate-400">
                Every new 10-minute shift generates 12 completely fresh cocktails from our 300+ A Couple Cooks & Guild Library. Completed: {servedRecipeIdsInShift.length}/12 unique specs.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleStartShift(10)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Deal 12 New Fresh Cocktails
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {shiftTwelveCocktails.map((drink, index) => {
            const isServed = servedRecipeIdsInShift.includes(drink.id);
            const isCurrentlyOrdered = customers.some((c) => c.recipe.id === drink.id);
            return (
              <div
                key={drink.id}
                className={`p-2.5 rounded-lg border text-xs transition-colors ${
                  isServed
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : isCurrentlyOrdered
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-100'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[10px] font-mono tabular-nums opacity-80">
                  <span>#{String(index + 1).padStart(2, '0')}</span>
                  <span>{isServed ? 'SERVED' : isCurrentlyOrdered ? 'ON RAIL' : drink.category}</span>
                </div>
                <div className="font-semibold truncate mt-0.5" title={drink.name}>
                  {drink.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4-Column Shift Telemetry Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>Shift Clock Remaining</span>
          </div>
          <div className="text-2xl font-mono tabular-nums font-bold text-slate-100 mt-1">
            {formatClock(secondsLeft)}
          </div>
        </div>

        <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Shift Score & Streak</span>
          </div>
          <div className="text-2xl font-mono tabular-nums font-bold text-amber-400 mt-1">
            {score.toLocaleString()} pts{' '}
            <span className="text-xs text-slate-400 font-normal">({streak}x streak)</span>
          </div>
        </div>

        <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tips Earned & Tickets</span>
          </div>
          <div className="text-2xl font-mono tabular-nums font-bold text-emerald-400 mt-1">
            ${tipsUsd.toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-normal">({drinksServed} served)</span>
          </div>
        </div>

        <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Mean Pour Accuracy</span>
          </div>
          <div className="text-2xl font-mono tabular-nums font-bold text-slate-100 mt-1">
            {meanAccuracy}%
          </div>
        </div>
      </div>

      {lastFeedback && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            lastFeedback.isGood
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
          }`}
        >
          {lastFeedback.isGood ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{lastFeedback.text}</span>
        </div>
      )}

      {/* Main Speed Rush Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT (8 Cols): Active Customer Queue & Rapid Assembly Station */}
        <div className="lg:col-span-8 space-y-5">
          {/* 3-Seat Bar Rail Customer Queue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {customers.map((cust, idx) => {
              const isSelected = idx === activeCustomerIdx;
              const patiencePct = Math.round(
                (cust.patienceRemainingSec / cust.patienceMaxSec) * 100
              );

              return (
                <button
                  key={cust.id}
                  type="button"
                  onClick={() => {
                    setActiveCustomerIdx(idx);
                    setSelectedGlass(cust.recipe.glass);
                    setSelectedTech(cust.recipe.technique);
                    setIceToggle(cust.recipe.iceRequired);
                    setTicketPours({});
                  }}
                  className={`text-left bg-[#0F1623] border rounded-xl p-4 transition-colors ${
                    isSelected
                      ? 'border-amber-500'
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Seat 0{idx + 1} · {cust.archetype}
                    </span>
                    <span
                      className={`font-mono tabular-nums font-semibold ${
                        cust.mood === 'DELIGHTED' || cust.mood === 'PATIENT'
                          ? 'text-emerald-400'
                          : cust.mood === 'IMPATIENT'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {cust.mood} ({cust.patienceRemainingSec}s)
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-100 mt-1">{cust.name}</div>
                  <div className="text-xs text-amber-300 font-semibold mt-1 line-clamp-1">
                    Order: {cust.recipe.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {cust.specialNote}
                  </div>

                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full transition-all duration-300 ${
                        patiencePct > 50
                          ? 'bg-emerald-500'
                          : patiencePct > 25
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${patiencePct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Ticket Printer & Rapid Mixing Rail */}
          {activeCustomer && (
            <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="text-xs text-amber-400">
                    Active Ticket · Seat 0{activeCustomerIdx + 1} ({activeCustomer.name})
                  </div>
                  <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                    {activeCustomer.recipe.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTicketPours({})}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-lg"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Tin
                  </button>
                  <button
                    type="button"
                    onClick={handleServeActiveCustomer}
                    className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Ring Bell & Serve Ticket
                  </button>
                </div>
              </div>

              {/* Ticket Spec Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-xs font-semibold text-slate-200 mb-2">
                    Ticket Spec Requirements
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {activeCustomer.recipe.ingredients.map((req) => {
                      const currentOz = ticketPours[req.ingredientId] ?? 0;
                      const isMet = Math.abs(currentOz - req.amountOz) <= 0.08;
                      return (
                        <div
                          key={req.ingredientId}
                          className="flex items-center justify-between py-1 border-b border-slate-800/50 last:border-none"
                        >
                          <span className="text-slate-300">{req.ingredientName}</span>
                          <span
                            className={`font-mono tabular-nums font-semibold ${
                              isMet
                                ? 'text-emerald-400'
                                : currentOz > 0
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {currentOz.toFixed(2)} / {req.amountOz.toFixed(2)} {req.unit || 'oz'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vessel & Technique Selectors */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3.5 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Serving Glassware</label>
                    <select
                      value={selectedGlass}
                      onChange={(e) => setSelectedGlass(e.target.value as GlassType)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                    >
                      {(Object.keys(GLASS_SPECS) as GlassType[]).map((g) => (
                        <option key={g} value={g}>
                          {GLASS_SPECS[g].name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Technique</label>
                      <select
                        value={selectedTech}
                        onChange={(e) => setSelectedTech(e.target.value as PrepTechnique)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                      >
                        {(Object.keys(PREP_TECHNIQUE_INFO) as PrepTechnique[]).map((t) => (
                          <option key={t} value={t}>
                            {PREP_TECHNIQUE_INFO[t].label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Ice Service</label>
                      <button
                        type="button"
                        onClick={() => setIceToggle(!iceToggle)}
                        className={`w-full px-3 py-1.5 text-xs font-medium rounded-lg border ${
                          iceToggle
                            ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        {iceToggle ? 'Over Ice' : 'Served Up (No Ice)'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speed Rail Bottle Buttons */}
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-2.5">
                  Speed Rail Bottles (Click to Pour Exact Jigger or Dash Increments)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {stationIngredients.map((ing) => {
                    const poured = ticketPours[ing.id] ?? 0;
                    const step = ing.unit === 'dash' ? 0.06 : 0.25;
                    return (
                      <div
                        key={ing.id}
                        className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-semibold text-slate-100 line-clamp-1">
                            {ing.name}
                          </span>
                          {poured > 0 && (
                            <span className="text-xs font-mono tabular-nums text-amber-400 shrink-0">
                              {poured.toFixed(2)}oz
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePourSpeedIngredient(ing.id, step)}
                            className="flex-1 py-1.5 text-xs font-mono tabular-nums font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-md"
                          >
                            +{ing.unit === 'dash' ? '1 dash' : '0.25 oz'}
                          </button>
                          {ing.unit !== 'dash' && (
                            <button
                              type="button"
                              onClick={() => handlePourSpeedIngredient(ing.id, 0.75)}
                              className="flex-1 py-1.5 text-xs font-mono tabular-nums font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-md"
                            >
                              +0.75 oz
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT (4 Cols): Guild Speed Rush Leaderboard */}
        <div className="lg:col-span-4 bg-[#0F1623] border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div>
            <div className="text-xs text-amber-400">Global Guild Standings</div>
            <h2 className="text-lg font-bold text-slate-100 mt-0.5">
              Speed Rush Leaderboard
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Your personal best: {studentProfile.speedRushBestScore.toLocaleString()} pts
            </p>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((entry, idx) => (
              <div
                key={entry.id}
                className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs text-slate-400 font-mono tabular-nums">
                    0{idx + 1}. {entry.rank}
                  </div>
                  <div className="text-sm font-semibold text-slate-100 truncate mt-0.5">
                    {entry.bartenderName}
                  </div>
                  <div className="text-xs text-slate-400 font-mono tabular-nums mt-0.5">
                    {entry.drinksServed} drinks · {entry.avgAccuracy}% acc · $
                    {entry.tipsEarnedUsd.toFixed(2)} tips
                  </div>
                </div>
                <div className="text-right font-mono tabular-nums shrink-0">
                  <div className="text-base font-bold text-amber-400">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400">{entry.shiftDurationMin}m shift</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Speed Rush Score & Promote App Section */}
      <ShareAndPromotePanel
        studentProfile={studentProfile}
        customHeadline="Share Your 10-Minute Speed Rush Score & Challenge Friends"
        customScoreText={
          drinksServed > 0
            ? `Just scored ${score.toLocaleString()} pts (${drinksServed} cocktails served · ${meanAccuracy}% pour accuracy · $${tipsUsd.toFixed(
                2
              )} in tips) on the 10-Minute 12-Drink Speed Rush!`
            : undefined
        }
      />
    </div>
  );
};
