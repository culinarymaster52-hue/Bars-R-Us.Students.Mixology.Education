import React, { useMemo, useState } from 'react';
import {
  CocktailRecipe,
  GLASS_SPECS,
  GlassType,
  INGREDIENT_TYPE_LABELS,
  Ingredient,
  IngredientType,
  PREP_TECHNIQUE_INFO,
  PrepTechnique,
} from '../models/CocktailModels';
import { BAR_INGREDIENTS, BAR_TOOLS, COCKTAIL_SMOKER_WOODS, SmokerWoodProfile } from '../data/BarCraftData';
import { GlasswareCanvas, PouredLayer } from './GlasswareCanvas';
import { BottleAndCanRenderer } from './BottleAndCanRenderer';
import {
  RotateCcw,
  Sparkles,
  BookmarkPlus,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Undo2,
  Flame,
  ExternalLink,
  Droplets,
  Citrus,
} from 'lucide-react';

interface VirtualBarScreenProps {
  allCocktails: CocktailRecipe[];
  activeTargetRecipe: CocktailRecipe | null;
  onSelectTargetRecipe: (recipe: CocktailRecipe | null) => void;
  bottleLevels: Record<string, number>;
  onUpdateBottleLevels: (next: Record<string, number>) => void;
  onSaveCustomCocktail: (recipe: CocktailRecipe) => void;
  onRecordDrinkMixed: (accuracyScore: number) => void;
}

interface AlistairCritique {
  palateBalance: string;
  technicalCritique: string;
  suggestedAdjustment: string;
  alistairVerdict: string;
}

// Every 1/10th oz step from 0.1 oz (1/10 oz) to 2.0 oz, plus classic 0.25 oz & 0.75 oz benchmarks
const JIGGER_TENTH_STEPS: number[] = [
  0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1.0,
  1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0,
];

const BITTERS_DASH_STEPS: number[] = [1, 2, 3, 4, 5, 6];

type StationTabKey = IngredientType | 'TOOLS' | 'SMOKER';

export const VirtualBarScreen: React.FC<VirtualBarScreenProps> = ({
  allCocktails,
  activeTargetRecipe,
  onSelectTargetRecipe,
  bottleLevels,
  onUpdateBottleLevels,
  onSaveCustomCocktail,
  onRecordDrinkMixed,
}) => {
  const [selectedGlass, setSelectedGlass] = useState<GlassType>(
    activeTargetRecipe?.glass ?? GlassType.ROCKS
  );
  const [pouredLayers, setPouredLayers] = useState<PouredLayer[]>([]);
  const [iceAdded, setIceAdded] = useState<boolean>(activeTargetRecipe?.iceRequired ?? true);
  const [iceStyle, setIceStyle] = useState<'king' | 'pebble' | 'cubes'>('king');
  const [garnishName, setGarnishName] = useState<string | null>(null);
  const [activeTechnique, setActiveTechnique] = useState<PrepTechnique>(
    activeTargetRecipe?.technique ?? PrepTechnique.STIR
  );
  const [isAnimatingTechnique, setIsAnimatingTechnique] = useState(false);
  const [isLayeredMode, setIsLayeredMode] = useState(false);

  // Jigger measurement (0.1 oz to 2.0 oz) & Bitters dash count (1 to 6 dashes)
  const [selectedPourOz, setSelectedPourOz] = useState<number>(1.0);
  const [selectedBittersDashes, setSelectedBittersDashes] = useState<number>(2);

  // Cocktail Smoker State
  const [selectedSmokerWood, setSelectedSmokerWood] = useState<SmokerWoodProfile>(
    COCKTAIL_SMOKER_WOODS[0]
  );
  const [activeSmokeWood, setActiveSmokeWood] = useState<SmokerWoodProfile | null>(null);

  // Right Deck Filters
  const [stationTab, setStationTab] = useState<StationTabKey>(IngredientType.SPIRIT);
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('ALL');
  const [bottleSearch, setBottleSearch] = useState('');

  // Custom Recipe Creator Modal State
  const [isSavingCustom, setIsSavingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  // Alistair AI Critique State
  const [isEvaluatingAi, setIsEvaluatingAi] = useState(false);
  const [aiCritique, setAiCritique] = useState<AlistairCritique | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Sync glass/ice/technique when user picks a new target recipe from outside
  React.useEffect(() => {
    if (activeTargetRecipe) {
      setSelectedGlass(activeTargetRecipe.glass);
      setIceAdded(activeTargetRecipe.iceRequired);
      setActiveTechnique(activeTargetRecipe.technique);
      setAiCritique(null);
    }
  }, [activeTargetRecipe]);

  const handleSelectStationTab = (tab: StationTabKey) => {
    setStationTab(tab);
    setSubCategoryFilter('ALL');
  };

  const handlePourIngredient = (ingredient: Ingredient, amountOz: number) => {
    if (ingredient.type === IngredientType.GARNISH) {
      setGarnishName(ingredient.name);
      return;
    }
    if (ingredient.type === IngredientType.ICE) {
      setIceAdded(true);
      if (ingredient.id.includes('pebble')) setIceStyle('pebble');
      else if (ingredient.id.includes('king')) setIceStyle('king');
      else setIceStyle('cubes');
      return;
    }

    const currentRemaining = bottleLevels[ingredient.id] ?? ingredient.maxCapacityOz;
    const actualPour = Math.min(currentRemaining, amountOz);
    if (actualPour <= 0) return;

    // Update bottle depletion
    onUpdateBottleLevels({
      ...bottleLevels,
      [ingredient.id]: Math.max(0, Number((currentRemaining - actualPour).toFixed(2))),
    });

    setPouredLayers((prev) => {
      // Combine if same ingredient and not in layered mode
      if (!isLayeredMode) {
        const existingIdx = prev.findIndex((p) => p.ingredient.id === ingredient.id);
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            amountOz: Number((updated[existingIdx].amountOz + actualPour).toFixed(2)),
          };
          return updated;
        }
      }
      return [...prev, { ingredient, amountOz: actualPour }];
    });
  };

  const handleUndoLastPour = () => {
    setPouredLayers((prev) => prev.slice(0, -1));
  };

  const handleDumpSink = () => {
    setPouredLayers([]);
    setGarnishName(null);
    setActiveSmokeWood(null);
    setAiCritique(null);
    setAiError(null);
  };

  const handleRefillBottle = (ingredientId: string) => {
    const ing = BAR_INGREDIENTS.find((i) => i.id === ingredientId);
    if (!ing) return;
    onUpdateBottleLevels({
      ...bottleLevels,
      [ingredientId]: ing.maxCapacityOz,
    });
  };

  const handleRefillAllBottles = () => {
    const fresh: Record<string, number> = {};
    for (const ing of BAR_INGREDIENTS) {
      fresh[ing.id] = ing.maxCapacityOz;
    }
    onUpdateBottleLevels(fresh);
  };

  const handleExecuteTechnique = (tech: PrepTechnique) => {
    setActiveTechnique(tech);
    setIsLayeredMode(tech === PrepTechnique.LAYER);
    setIsAnimatingTechnique(true);
    setTimeout(() => setIsAnimatingTechnique(false), 260);
  };

  const handleIgniteSmoker = (wood: SmokerWoodProfile) => {
    setSelectedSmokerWood(wood);
    setActiveSmokeWood(wood);
    setActiveTechnique(PrepTechnique.FLAME);
    setIsAnimatingTechnique(true);
    setTimeout(() => setIsAnimatingTechnique(false), 320);
  };

  // Auto-Pour Target Spec (for 1-click demonstration)
  const handleAutoPourSpec = () => {
    if (!activeTargetRecipe) return;
    const layers: PouredLayer[] = [];
    const nextLevels = { ...bottleLevels };

    for (const req of activeTargetRecipe.ingredients) {
      const ing = BAR_INGREDIENTS.find((b) => b.id === req.ingredientId);
      if (ing) {
        if (ing.type === IngredientType.GARNISH) {
          setGarnishName(ing.name);
        } else {
          layers.push({ ingredient: ing, amountOz: req.amountOz });
          const cur = nextLevels[ing.id] ?? ing.maxCapacityOz;
          nextLevels[ing.id] = Math.max(0, Number((cur - req.amountOz).toFixed(2)));
        }
      }
    }
    setSelectedGlass(activeTargetRecipe.glass);
    setIceAdded(activeTargetRecipe.iceRequired);
    setActiveTechnique(activeTargetRecipe.technique);
    setGarnishName(activeTargetRecipe.garnish);
    setPouredLayers(layers);
    onUpdateBottleLevels(nextLevels);
    onRecordDrinkMixed(100);
  };

  // Calculate Live Accuracy vs Target Recipe
  const accuracyReport = useMemo(() => {
    if (!activeTargetRecipe) return null;

    let score = 0;
    const notes: string[] = [];

    // 1. Glassware match (15 pts)
    if (selectedGlass === activeTargetRecipe.glass) {
      score += 15;
    } else {
      notes.push(`Expected ${GLASS_SPECS[activeTargetRecipe.glass].name}`);
    }

    // 2. Ice match (10 pts)
    if (iceAdded === activeTargetRecipe.iceRequired) {
      score += 10;
    } else {
      notes.push(
        activeTargetRecipe.iceRequired
          ? 'Recipe requires ice'
          : 'Recipe is served Neat / Up (No Ice)'
      );
    }

    // 3. Technique match (15 pts)
    if (activeTechnique === activeTargetRecipe.technique) {
      score += 15;
    } else {
      notes.push(
        `Recommended technique: ${PREP_TECHNIQUE_INFO[activeTargetRecipe.technique].label}`
      );
    }

    // 4. Ingredients & Proportions (60 pts)
    const fluidReqs = activeTargetRecipe.ingredients.filter(
      (i) => !i.ingredientId.startsWith('garnish_')
    );
    const perIngPoints = fluidReqs.length > 0 ? 60 / fluidReqs.length : 60;

    for (const req of fluidReqs) {
      const poured = pouredLayers.find((p) => p.ingredient.id === req.ingredientId);
      if (!poured) {
        notes.push(`Missing ${req.ingredientName} (${req.amountOz} oz)`);
      } else {
        const diff = Math.abs(poured.amountOz - req.amountOz);
        const tolerance = Math.max(0.15, req.amountOz * 0.25);
        if (diff <= 0.05) {
          score += perIngPoints;
        } else if (diff <= tolerance) {
          score += perIngPoints * 0.75;
          notes.push(
            `${req.ingredientName}: poured ${poured.amountOz} oz vs spec ${req.amountOz} oz`
          );
        } else {
          score += perIngPoints * 0.3;
          notes.push(
            `${req.ingredientName} off-spec (${poured.amountOz} oz vs ${req.amountOz} oz)`
          );
        }
      }
    }

    // Penalize extraneous uncalled-for ingredients
    const extraCount = pouredLayers.filter(
      (p) => !activeTargetRecipe.ingredients.some((r) => r.ingredientId === p.ingredient.id)
    ).length;
    score = Math.max(0, Math.min(100, Math.round(score - extraCount * 12)));

    return { score, notes };
  }, [activeTargetRecipe, selectedGlass, iceAdded, activeTechnique, pouredLayers]);

  const handleEvaluateWithAlistair = async () => {
    if (pouredLayers.length === 0) return;
    setIsEvaluatingAi(true);
    setAiError(null);

    try {
      const response = await fetch('/api/ai/evaluate-pour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          glass: GLASS_SPECS[selectedGlass].name,
          technique: PREP_TECHNIQUE_INFO[activeTechnique].label,
          iceAdded,
          garnish: garnishName,
          targetRecipeName: activeTargetRecipe?.name ?? 'Custom House Creation',
          pouredIngredients: pouredLayers.map((l) => ({
            name: l.ingredient.name,
            amountOz: l.amountOz,
            abv: l.ingredient.abv,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Could not reach Master Mixologist Alistair.');
      }
      setAiCritique(data);
      if (accuracyReport) {
        onRecordDrinkMixed(accuracyReport.score);
      } else {
        onRecordDrinkMixed(92);
      }
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : 'Unable to evaluate pour right now.');
    } finally {
      setIsEvaluatingAi(false);
    }
  };

  const handleConfirmSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || pouredLayers.length === 0) return;

    const newRecipe: CocktailRecipe = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      category: 'Custom House',
      glass: selectedGlass,
      iceRequired: iceAdded,
      technique: activeTechnique,
      ingredients: pouredLayers.map((l) => ({
        ingredientId: l.ingredient.id,
        ingredientName: l.ingredient.name,
        amountOz: l.amountOz,
        unit: l.ingredient.unit,
      })),
      garnish: garnishName || 'Bartender’s Choice Garnish',
      description:
        customNotes.trim() ||
        'Bespoke house creation crafted in the Bars R Us Virtual Bar.',
      historyNotes: 'Original house recipe archived by student mixologist.',
      isCustom: true,
      creatorName: 'House Mixologist',
      creationTimestamp: Date.now(),
    };

    onSaveCustomCocktail(newRecipe);
    setIsSavingCustom(false);
    setCustomName('');
    setCustomNotes('');
    setSavedBanner(`Saved "${newRecipe.name}" to your Cocktail Codex.`);
    setTimeout(() => setSavedBanner(null), 4000);
  };

  // Compute available sub-categories for the currently active ingredient tab
  const availableSubCategories = useMemo(() => {
    if (stationTab === 'TOOLS' || stationTab === 'SMOKER') return [];
    const set = new Set<string>();
    for (const ing of BAR_INGREDIENTS) {
      if (ing.type === stationTab) {
        set.add(ing.subCategory);
      }
    }
    return Array.from(set);
  }, [stationTab]);

  // Compute counts per tab so user can see all 415+ items at a glance
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ing of BAR_INGREDIENTS) {
      counts[ing.type] = (counts[ing.type] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredIngredients = useMemo(() => {
    if (stationTab === 'TOOLS' || stationTab === 'SMOKER') return [];
    return BAR_INGREDIENTS.filter((ing) => {
      const matchesTab = ing.type === stationTab;
      if (!matchesTab) return false;
      if (subCategoryFilter !== 'ALL' && ing.subCategory !== subCategoryFilter) {
        return false;
      }
      if (!bottleSearch.trim()) return true;
      const q = bottleSearch.toLowerCase();
      return (
        ing.name.toLowerCase().includes(q) ||
        ing.subCategory.toLowerCase().includes(q) ||
        ing.flavorNote.toLowerCase().includes(q)
      );
    });
  }, [stationTab, subCategoryFilter, bottleSearch]);

  const smokerTool = useMemo(
    () => BAR_TOOLS.find((t) => t.id === 'tool_cocktail_smoker') ?? BAR_TOOLS[BAR_TOOLS.length - 1],
    []
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      {/* Top Target Spec Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
            <span>Interactive Mixing Workbench</span>
            <span aria-hidden="true">·</span>
            <span>415+ Spirits, Apéritifs, 15 Bitters, Wines, Beers, Mixers & Garnishes</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.gettips.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 underline underline-offset-2"
            >
              TIPS Certification
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.servsafe.com/ServSafe-Alcohol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 underline underline-offset-2"
            >
              ServSafe Alcohol
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Virtual Bar Station
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="target-recipe-select" className="text-xs text-slate-400 font-medium">
            Target Spec:
          </label>
          <select
            id="target-recipe-select"
            value={activeTargetRecipe?.id ?? 'FREE_POUR'}
            onChange={(e) => {
              if (e.target.value === 'FREE_POUR') {
                onSelectTargetRecipe(null);
              } else {
                const found = allCocktails.find((c) => c.id === e.target.value) ?? null;
                onSelectTargetRecipe(found);
              }
            }}
            className="bg-[#0F1623] border border-slate-700/80 text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 max-w-xs"
          >
            <option value="FREE_POUR">Free-Pour / Bespoke Creation Mode</option>
            {allCocktails.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.name} ({recipe.category})
              </option>
            ))}
          </select>

          {activeTargetRecipe && (
            <button
              type="button"
              onClick={handleAutoPourSpec}
              className="px-3.5 py-2 text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Auto-Pour Spec
            </button>
          )}

          <button
            type="button"
            onClick={handleDumpSink}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Dump to Sink
          </button>
        </div>
      </div>

      {savedBanner && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* Two-Zone Educational Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* LEFT ZONE (5 Cols): Interactive Glassware Stage, Technique Controls & Accuracy */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Active Recipe Spec Callout if Target Selected */}
          {activeTargetRecipe && (
            <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-amber-400">
                    {activeTargetRecipe.category} · {GLASS_SPECS[activeTargetRecipe.glass].name} ·{' '}
                    {PREP_TECHNIQUE_INFO[activeTargetRecipe.technique].label}
                  </div>
                  <h2 className="text-base font-bold text-slate-100 mt-0.5">
                    {activeTargetRecipe.name}
                  </h2>
                </div>
                {accuracyReport && (
                  <div className="text-right font-mono tabular-nums">
                    <div
                      className={`text-lg font-bold ${
                        accuracyReport.score >= 85
                          ? 'text-emerald-400'
                          : accuracyReport.score >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {accuracyReport.score}% Match
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-300 flex flex-wrap gap-x-3 gap-y-1">
                {activeTargetRecipe.ingredients.map((req, idx) => {
                  const dashCount = Math.max(1, Math.round(req.amountOz / 0.06));
                  return (
                    <React.Fragment key={req.ingredientId}>
                      {idx > 0 && <span className="text-slate-600" aria-hidden="true">·</span>}
                      <span>
                        {req.ingredientName}:{' '}
                        <strong className="font-mono tabular-nums text-amber-300">
                          {req.unit === 'dash'
                            ? `${dashCount} ${dashCount === 1 ? 'dash' : 'dashes'}`
                            : `${req.amountOz} oz`}
                        </strong>
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>

              {accuracyReport && accuracyReport.notes.length > 0 && pouredLayers.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-xs text-amber-300/90 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{accuracyReport.notes[0]}</span>
                </div>
              )}
            </div>
          )}

          {/* Glassware Canvas Stage */}
          <GlasswareCanvas
            glass={selectedGlass}
            pouredLayers={pouredLayers}
            iceAdded={iceAdded}
            iceStyle={iceStyle}
            garnishName={garnishName}
            activeTechnique={activeTechnique}
            isAnimatingTechnique={isAnimatingTechnique}
            isLayeredMode={isLayeredMode}
            activeSmokeWood={activeSmokeWood}
          />

          {/* Glassware & Ice Controls */}
          <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  1. Select Serving Vessel (12 Specs)
                </label>
                <span className="text-xs text-slate-400">
                  {GLASS_SPECS[selectedGlass].recommendedIce}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {(Object.keys(GLASS_SPECS) as GlassType[]).map((gKey) => (
                  <button
                    key={gKey}
                    type="button"
                    onClick={() => setSelectedGlass(gKey)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors truncate ${
                      selectedGlass === gKey
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {GLASS_SPECS[gKey].name.split('/')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Ice, Smoker Quick Toggle & Undo Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIceAdded(!iceAdded)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    iceAdded
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {iceAdded ? 'Ice: Added' : 'Served Up (No Ice)'}
                </button>
                {iceAdded && (
                  <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    {(['king', 'cubes', 'pebble'] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setIceStyle(style)}
                        className={`px-2 py-1 text-xs rounded-md capitalize transition-colors whitespace-nowrap shrink-0 ${
                          iceStyle === style
                            ? 'bg-slate-800 text-sky-300 font-medium'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {activeSmokeWood && (
                  <button
                    type="button"
                    onClick={() => setActiveSmokeWood(null)}
                    className="px-2.5 py-1.5 text-xs text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Clear Smoke
                  </button>
                )}
                <button
                  type="button"
                  disabled={pouredLayers.length === 0}
                  onClick={handleUndoLastPour}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Undo Pour
                </button>
              </div>
            </div>

            {/* Preparation Technique Deck */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">
                  2. Execute Preparation Technique
                </span>
                <span className="text-xs text-amber-400 font-mono tabular-nums">
                  +{Math.round(PREP_TECHNIQUE_INFO[activeTechnique].dilutionFactor * 100)}% dilution
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(Object.keys(PREP_TECHNIQUE_INFO) as PrepTechnique[]).map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleExecuteTechnique(tech)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      activeTechnique === tech
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {tech.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {PREP_TECHNIQUE_INFO[activeTechnique].description}
              </p>
            </div>

            {/* Action Footer: Ask Alistair AI & Save Custom Cocktail */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={pouredLayers.length === 0 || isEvaluatingAi}
                onClick={handleEvaluateWithAlistair}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                {isEvaluatingAi ? 'Alistair is Tasting...' : 'Judge Pour with Alistair AI'}
              </button>

              <button
                type="button"
                disabled={pouredLayers.length === 0}
                onClick={() => setIsSavingCustom(!isSavingCustom)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <BookmarkPlus className="w-4 h-4" />
                Save Custom Spec
              </button>
            </div>

            {/* Inline Custom Recipe Save Form */}
            {isSavingCustom && (
              <form
                onSubmit={handleConfirmSaveCustom}
                className="pt-3 border-t border-slate-800 space-y-3"
              >
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Custom Cocktail Name</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g., Golden Velvet Nocturne"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Tasting & Service Notes
                  </label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="Smoky high-proof riff with toasted almond finish"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSavingCustom(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400"
                  >
                    Save to Codex
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Alistair's Structured Tasting Verdict */}
          {aiError && (
            <div className="bg-rose-950/50 border border-rose-500/40 rounded-xl p-4 text-xs text-rose-200">
              {aiError}
            </div>
          )}

          {aiCritique && (
            <div className="bg-[#0F1623] border border-amber-500/40 rounded-xl p-4 space-y-2.5">
              <div className="text-xs font-semibold text-amber-400">
                Master Mixologist Alistair’s Tasting Verdict
              </div>
              <p className="text-sm font-display italic text-slate-100">
                “{aiCritique.alistairVerdict}”
              </p>
              <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
                <p>
                  <strong className="text-slate-100">Palate Balance:</strong>{' '}
                  {aiCritique.palateBalance}
                </p>
                <p>
                  <strong className="text-slate-100">Technical Execution:</strong>{' '}
                  {aiCritique.technicalCritique}
                </p>
                <p className="text-amber-300">
                  <strong>Guild Adjustment:</strong> {aiCritique.suggestedAdjustment}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT ZONE (7 Cols): Jigger (0.1–2.0 oz), Bitters Dashes (1–6), Station Tabs, Bottle Rack, Bar Tools & Cocktail Smoker */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Precision Jigger (1/10 oz to 2.0 oz) & Bitters Dash (1 to 6 Dashes) Control Deck */}
          <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4 space-y-4">
            {/* Jigger 0.1 oz to 2.0 oz Section */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Japanese Bell Jigger — Full Graduated Scale (1/10 oz to 2.0 oz)
                  </div>
                  <div className="text-xs text-slate-400">
                    Every tenth of an ounce from 0.1 oz (1/10 oz) to 2.0 oz, plus 1/4 oz (0.25) and 3/4 oz (0.75) benchmarks
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums">
                  <span className="text-xs text-slate-400">Active Jigger:</span>
                  <span className="text-sm font-bold text-amber-400">
                    {selectedPourOz === 0.1
                      ? '1/10 (0.1) oz'
                      : selectedPourOz === 0.25
                      ? '1/4 (0.25) oz'
                      : selectedPourOz === 0.5
                      ? '1/2 (0.5) oz'
                      : selectedPourOz === 0.75
                      ? '3/4 (0.75) oz'
                      : `${selectedPourOz.toFixed(1)} oz`}
                  </span>
                </div>
              </div>

              {/* Continuous 1/10th oz Slider */}
              <div className="flex items-center gap-3 mb-2.5">
                <span className="text-[11px] font-mono tabular-nums text-slate-400">0.1 oz</span>
                <input
                  type="range"
                  aria-label="Jigger measurement in ounces from 0.1 to 2.0"
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  value={selectedPourOz}
                  onChange={(e) => setSelectedPourOz(Number(parseFloat(e.target.value).toFixed(2)))}
                  className="flex-1 accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] font-mono tabular-nums text-slate-400">2.0 oz</span>
              </div>

              {/* All 22 Graduated Meniscus Buttons (0.1 to 2.0 oz) */}
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                {JIGGER_TENTH_STEPS.map((oz) => {
                  const isSelected = Math.abs(selectedPourOz - oz) < 0.005;
                  const label =
                    oz === 0.1
                      ? '1/10'
                      : oz === 0.25
                      ? '1/4'
                      : oz === 0.5
                      ? '1/2'
                      : oz === 0.75
                      ? '3/4'
                      : `${oz.toFixed(1)}`;
                  return (
                    <button
                      key={oz}
                      type="button"
                      onClick={() => setSelectedPourOz(oz)}
                      title={`Set jigger to ${oz} oz`}
                      className={`py-1 px-1 text-[11px] font-mono tabular-nums rounded transition-colors text-center ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {label}
                      <span className="block text-[9px] opacity-75">{oz}oz</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bitters Dash Measure Control (1 to 6 Dashes) */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Bitters Dasher Calibration (1 to 6 Dashes)
                  </div>
                  <div className="text-xs text-slate-400">
                    Select exact dash count per pour for all 15 aromatic, citrus & herbal bitters
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {BITTERS_DASH_STEPS.map((dashCount) => (
                  <button
                    key={dashCount}
                    type="button"
                    onClick={() => setSelectedBittersDashes(dashCount)}
                    className={`px-2.5 py-1 text-xs font-mono tabular-nums font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      selectedBittersDashes === dashCount
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {dashCount} {dashCount === 1 ? 'Dash' : 'Dashes'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Station Category Selector, Sub-Category Filters & Search */}
          <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4 space-y-3">
            {/* Primary Station Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  IngredientType.SPIRIT,
                  IngredientType.APERITIF,
                  IngredientType.BITTERS,
                  IngredientType.MIXER,
                  IngredientType.WINE,
                  IngredientType.BEER,
                  IngredientType.GARNISH,
                  IngredientType.ICE,
                ] as IngredientType[]
              ).map((typeKey) => (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => handleSelectStationTab(typeKey)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    stationTab === typeKey
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {INGREDIENT_TYPE_LABELS[typeKey]}{' '}
                  <span className="font-mono tabular-nums opacity-75">
                    ({tabCounts[typeKey] ?? 0})
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleSelectStationTab('TOOLS')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  stationTab === 'TOOLS'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                Bartender Tools ({BAR_TOOLS.length})
              </button>

              <button
                type="button"
                onClick={() => handleSelectStationTab('SMOKER')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  stationTab === 'SMOKER'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-amber-300 hover:bg-slate-800 border border-amber-500/30'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                Cocktail Smoker Lab
              </button>
            </div>

            {/* Sub-Category Filter Strip for Ingredient Stations */}
            {stationTab !== 'TOOLS' &&
              stationTab !== 'SMOKER' &&
              availableSubCategories.length > 1 && (
                <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setSubCategoryFilter('ALL')}
                    className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                      subCategoryFilter === 'ALL'
                        ? 'bg-slate-700 text-white font-semibold'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All Sub-Categories ({tabCounts[stationTab] ?? 0})
                  </button>
                  {availableSubCategories.map((subCat) => (
                    <button
                      key={subCat}
                      type="button"
                      onClick={() => setSubCategoryFilter(subCat)}
                      className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                        subCategoryFilter === subCat
                          ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 font-semibold'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {subCat}
                    </button>
                  ))}
                </div>
              )}

            {/* Dedicated Callout Banner for Mixers, Juices & Sodas */}
            {stationTab === IngredientType.MIXER && (
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-semibold text-amber-400">
                    Complete Bar Mixers, Fresh Juices & Sodas Station:
                  </span>{' '}
                  <span className="text-slate-300">
                    Includes Purified Water, Ginger Beer, Indian Tonic Water, Club Soda, Fresh Citrus & Orchard Juices, Syrups, Shrubs, and Dairy/Aquafaba.
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {(['mixer_purified_water', 'mixer_ginger_beer', 'mixer_tonic_water'] as const).map(
                    (id) => {
                      const item = BAR_INGREDIENTS.find((b) => b.id === id);
                      if (!item) return null;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handlePourIngredient(item, selectedPourOz)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-md whitespace-nowrap"
                        >
                          +{item.name.split('(')[0].trim()}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Dedicated Callout Banner for All Bar Garnishes */}
            {stationTab === IngredientType.GARNISH && (
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Citrus className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-300">
                    <strong className="text-slate-100">Complete Bar Garnish Caddy:</strong> Citrus Twists, Wheels & Dehydrated Rounds · Maraschino & Seasonal Berries · Fresh Herbs & Edible Florals · Savory Olives, Onions & Celery · Spices & Salt/Tajín Rims.
                  </span>
                </div>
                {garnishName && (
                  <span className="text-amber-300 font-medium shrink-0">
                    Active: {garnishName}
                  </span>
                )}
              </div>
            )}

            {/* Search & Refill Row */}
            {stationTab !== 'TOOLS' && stationTab !== 'SMOKER' && (
              <div className="flex items-center justify-between gap-3">
                <input
                  type="search"
                  value={bottleSearch}
                  onChange={(e) => setBottleSearch(e.target.value)}
                  placeholder="Search 415+ spirits, wines, beers, 15 bitters, mixers, juices, sodas, or garnishes..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleRefillAllBottles}
                  className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Refill All Bottles
                </button>
              </div>
            )}
          </div>

          {/* CONTENT DECK: Either Bartender Tools, Cocktail Smoker Lab, or Bottle/Ingredient Grid */}
          {stationTab === 'TOOLS' ? (
            <div className="space-y-4">
              <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4">
                <h2 className="text-base font-bold text-slate-100">
                  Complete Professional Bartender Tools Encyclopedia ({BAR_TOOLS.length} Essential Implements)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Detailed engineering specifications, primary hospitality use cases, and Master Mixologist Alistair’s pro service tips for every tool at the station.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[680px] overflow-y-auto pr-1">
                {BAR_TOOLS.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-[#0F1623] border border-slate-800/80 hover:border-amber-500/40 rounded-xl p-4 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <div className="text-xs text-amber-400 font-medium">
                        {tool.category}
                        {tool.associatedTechnique ? ` · ${tool.associatedTechnique}` : ''}
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 mt-0.5">{tool.name}</h3>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        <strong className="text-slate-100">Description & Use Case:</strong>{' '}
                        {tool.purpose}
                      </p>
                      <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80 leading-relaxed">
                        <strong className="text-amber-300">Pro Technique:</strong> {tool.proTip}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 flex justify-end gap-2">
                      {tool.id === 'tool_cocktail_smoker' && (
                        <button
                          type="button"
                          onClick={() => handleSelectStationTab('SMOKER')}
                          className="px-3 py-1.5 text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0"
                        >
                          Open Cocktail Smoker Lab
                        </button>
                      )}
                      {tool.associatedTechnique && (
                        <button
                          type="button"
                          onClick={() => handleExecuteTechnique(tool.associatedTechnique!)}
                          className="px-3 py-1.5 text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0"
                        >
                          Execute ({tool.associatedTechnique})
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : stationTab === 'SMOKER' ? (
            <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-5 space-y-5">
              {/* Cocktail Smoker Header & Full Description */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    <span>Aromatic Wood-Chip Cloche & Chimney Infuser</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-100 mt-1">
                    {smokerTool.name}
                  </h2>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    <strong className="text-slate-100">Technical Description:</strong>{' '}
                    {smokerTool.purpose}
                  </p>
                  <p className="text-xs text-amber-300/90 mt-2 leading-relaxed">
                    <strong>Best Hospitality Use Cases:</strong> Smoked Old Fashioned, Oaxacan Mezcal Negroni, Maple Smoked Manhattan, Rob Roy, Boulevadier, and Aged Rum Sippers. Cold smoke clings to the interior glass walls and high-proof spirit meniscus without melting your King Cube.
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleIgniteSmoker(selectedSmokerWood)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <Flame className="w-4 h-4" />
                    Ignite {selectedSmokerWood.name}
                  </button>
                  {activeSmokeWood && (
                    <span className="text-[11px] text-emerald-400 font-mono">
                      Active in Glass: {activeSmokeWood.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Wood Chip & Botanical Fuel Selector */}
              <div>
                <h3 className="text-xs font-semibold text-slate-200 mb-2.5">
                  Select Kiln-Dried Hardwood or Botanical Fuel Profile (5 Varieties)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COCKTAIL_SMOKER_WOODS.map((wood) => {
                    const isSelected = selectedSmokerWood.id === wood.id;
                    const isInfused = activeSmokeWood?.id === wood.id;
                    return (
                      <div
                        key={wood.id}
                        onClick={() => setSelectedSmokerWood(wood)}
                        className={`cursor-pointer rounded-xl p-3.5 border transition-colors flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-slate-100">{wood.name}</span>
                            <span
                              className="w-3 h-3 rounded-full border border-white/30 shrink-0"
                              style={{ backgroundColor: wood.smokeColor }}
                            />
                          </div>
                          <p className="text-xs text-amber-300 mt-1">
                            <strong>Aroma:</strong> {wood.aromaProfile}
                          </p>
                          <p className="text-xs text-slate-300 mt-1">
                            <strong className="text-slate-200">Paired Spirits:</strong>{' '}
                            {wood.bestPairedSpirits}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            <strong className="text-slate-300">Use Case:</strong> {wood.useCase}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            {isInfused ? 'Currently infusing glass' : 'Click to load chimney'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIgniteSmoker(wood);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors"
                          >
                            Smoke Glass
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Guild Service Protocol */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="font-semibold text-amber-400">
                  Master Mixologist Alistair’s 4-Step Cocktail Smoking Protocol
                </div>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>
                    <strong>Pre-Chill & Build:</strong> Stir your spirit-forward cocktail over a 2-inch King Cube in a Rocks glass or decanter before applying smoke.
                  </li>
                  <li>
                    <strong>Load the Mesh Basket:</strong> Place a pinch of kiln-dried wood chips into the carved hardwood chimney cap seated over the glass rim.
                  </li>
                  <li>
                    <strong>Torch for 3 Seconds:</strong> Direct a culinary butane torch flame downward into the chips for 2–3 seconds until dense aromatic smoke cascades down onto the liquid meniscus.
                  </li>
                  <li>
                    <strong>Rest Under Lid (20–30s):</strong> Cap the chimney or cloche for 20–30 seconds so volatile phenolic compounds bind to the alcohol and expressed citrus oils, then lift tableside.
                  </li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[680px] overflow-y-auto pr-1">
              {filteredIngredients.map((ingredient) => (
                <BottleAndCanRenderer
                  key={ingredient.id}
                  ingredient={ingredient}
                  remainingOz={bottleLevels[ingredient.id] ?? ingredient.maxCapacityOz}
                  selectedPourOz={selectedPourOz}
                  selectedBittersDashes={selectedBittersDashes}
                  onPour={handlePourIngredient}
                  onRefill={handleRefillBottle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
