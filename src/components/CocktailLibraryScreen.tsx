import React, { useMemo, useState } from 'react';
import {
  CocktailRecipe,
  GLASS_SPECS,
  PREP_TECHNIQUE_INFO,
} from '../models/CocktailModels';
import { BEER_CATALOG, WINE_CATALOG } from '../data/WineAndBeerCatalog';
import {
  Heart,
  Printer,
  Share2,
  Wine,
  Beer,
  Martini,
  Search,
  Check,
  ExternalLink,
} from 'lucide-react';

interface CocktailLibraryScreenProps {
  cocktails: CocktailRecipe[];
  onToggleFavorite: (id: string) => void;
  onPracticeInBar: (recipe: CocktailRecipe) => void;
}

type CatalogSection = 'COCKTAILS' | 'WINES' | 'BEERS';

const SPIRIT_CATEGORIES: Array<CocktailRecipe['category'] | 'ALL' | 'FAVORITES'> = [
  'ALL',
  'FAVORITES',
  'Whiskey',
  'Gin',
  'Vodka',
  'Rum & Tiki',
  'Tequila & Mezcal',
  'Brandy & Cognac',
  'Apéritif & Spritz',
  'Wine, Beer & Low-ABV',
  'Custom House',
];

export const CocktailLibraryScreen: React.FC<CocktailLibraryScreenProps> = ({
  cocktails,
  onToggleFavorite,
  onPracticeInBar,
}) => {
  const [section, setSection] = useState<CatalogSection>('COCKTAILS');
  const [selectedCategory, setSelectedCategory] =
    useState<typeof SPIRIT_CATEGORIES[number]>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<CocktailRecipe | null>(
    cocktails[0] ?? null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedWinePourOz, setSelectedWinePourOz] = useState<4 | 8>(4);
  const [selectedBeerPourOz, setSelectedBeerPourOz] = useState<8 | 12>(12);
  const [wineStyleFilter, setWineStyleFilter] = useState<'ALL' | 'White' | 'Red' | 'Sparkling'>('ALL');

  const filteredCocktails = useMemo(() => {
    return cocktails.filter((c) => {
      if (selectedCategory === 'FAVORITES' && !c.isFavorite) return false;
      if (
        selectedCategory !== 'ALL' &&
        selectedCategory !== 'FAVORITES' &&
        c.category !== selectedCategory
      ) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.ingredients.some((i) => i.ingredientName.toLowerCase().includes(q))
      );
    });
  }, [cocktails, selectedCategory, searchQuery]);

  const filteredWines = useMemo(() => {
    return WINE_CATALOG.filter((w) => {
      if (wineStyleFilter !== 'ALL' && w.style !== wineStyleFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.varietal.toLowerCase().includes(q) ||
        w.region.toLowerCase().includes(q) ||
        w.tastingNotes.toLowerCase().includes(q)
      );
    });
  }, [wineStyleFilter, searchQuery]);

  const handleShareSpec = async (recipe: CocktailRecipe) => {
    const appUrl =
      typeof window !== 'undefined' ? window.location.origin : 'https://barsrus.mixology.pub';
    const specText = `${recipe.name} (${recipe.category})\nGlass: ${GLASS_SPECS[recipe.glass].name}\nTechnique: ${PREP_TECHNIQUE_INFO[recipe.technique].label}\nIngredients:\n${recipe.ingredients
      .map((i) => `- ${i.amountOz} ${i.unit || 'oz'} ${i.ingredientName}`)
      .join('\n')}\nGarnish: ${recipe.garnish}\n\nPractice 300+ cocktails on Bars R Us: ${appUrl}`;

    try {
      await navigator.clipboard.writeText(specText);
      setCopiedId(recipe.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Fallback
    }
  };

  const appUrl =
    typeof window !== 'undefined' ? window.location.origin : 'https://barsrus.mixology.pub';

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      {/* Header & Section Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
            <span>Bars R Us Archival Database</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-amber-400 font-semibold">
              {cocktails.length} Cocktail Specs
            </span>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.acouplecooks.com/cocktail-names-list/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 underline underline-offset-2"
            >
              Includes All 300+ A Couple Cooks Cocktail Names
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Beverage & Mixology Codex ({cocktails.length} Cocktails · {WINE_CATALOG.length} Wines · {BEER_CATALOG.length} Beers)
          </h1>
        </div>

        {/* 3-Mode Catalog Switch */}
        <div className="flex items-center gap-1 p-1 bg-[#0F1623] border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setSection('COCKTAILS')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              section === 'COCKTAILS'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Martini className="w-3.5 h-3.5" />
            Cocktails ({cocktails.length})
          </button>
          <button
            type="button"
            onClick={() => setSection('WINES')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              section === 'WINES'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Wine className="w-3.5 h-3.5" />
            Wine Cellar ({WINE_CATALOG.length})
          </button>
          <button
            type="button"
            onClick={() => setSection('BEERS')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              section === 'BEERS'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Beer className="w-3.5 h-3.5" />
            Craft Drafts ({BEER_CATALOG.length})
          </button>
        </div>
      </div>

      {/* SECTION 1: 300+ COCKTAIL CODEX */}
      {section === 'COCKTAILS' && (
        <div className="mt-6 space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#0F1623] border border-slate-800/80 rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {SPIRIT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat === 'ALL' ? `All Families (${cocktails.length})` : cat === 'FAVORITES' ? 'Favorites' : cat}
                </button>
              ))}
            </div>

            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search all ${cocktails.length} cocktails, spirits, or modifiers...`}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between px-1">
            <span>
              Showing <strong className="text-slate-200 font-mono">{filteredCocktails.length}</strong> of{' '}
              <strong className="text-slate-200 font-mono">{cocktails.length}</strong> recipes
            </span>
            <span>Click any cocktail card to inspect its formula or load it into the Virtual Bar</span>
          </div>

          {/* Master-Detail Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Recipe List (7 Cols) — Full 300+ list rendered with smooth scroll */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[760px] overflow-y-auto pr-1">
              {filteredCocktails.map((recipe) => {
                const isSelected = selectedRecipe?.id === recipe.id;
                return (
                  <div
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedRecipe(recipe);
                    }}
                    className={`cursor-pointer text-left bg-[#0F1623] border rounded-xl p-4 transition-colors ${
                      isSelected
                        ? 'border-amber-500'
                        : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs text-slate-400">
                        <span>{recipe.category}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{GLASS_SPECS[recipe.glass].name.split('/')[0]}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(recipe.id);
                        }}
                        aria-label={`Toggle favorite for ${recipe.name}`}
                        className="text-slate-400 hover:text-amber-400 transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            recipe.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-100 mt-1 line-clamp-1">
                      {recipe.name}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-300 font-mono tabular-nums truncate">
                      {recipe.ingredients
                        .map((i) => `${i.amountOz}${i.unit || 'oz'} ${i.ingredientName.split(' ')[0]}`)
                        .join(' · ')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Recipe Spec Inspector (5 Cols) */}
            <div className="lg:col-span-5">
              {selectedRecipe ? (
                <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-6 space-y-5 sticky top-6">
                  <div>
                    <div className="text-xs text-amber-400">
                      {selectedRecipe.category} · {GLASS_SPECS[selectedRecipe.glass].name} ·{' '}
                      {selectedRecipe.iceRequired ? 'Over Fresh Ice' : 'Served Up (Chilled)'}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 mt-1">
                      {selectedRecipe.name}
                    </h2>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      {selectedRecipe.description}
                    </p>
                  </div>

                  {/* Exact Proportions Table */}
                  <div className="border-t border-b border-slate-800/80 py-4">
                    <div className="text-xs font-semibold text-slate-200 mb-3">
                      Measured Formula & Proportions
                    </div>
                    <div className="space-y-2">
                      {selectedRecipe.ingredients.map((item, idx) => (
                        <div
                          key={`${item.ingredientId}_${idx}`}
                          className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 last:border-none"
                        >
                          <span className="text-slate-200 font-medium">{item.ingredientName}</span>
                          <span className="font-mono tabular-nums text-amber-400 font-semibold">
                            {item.unit === 'dash'
                              ? `${Math.max(1, Math.round(item.amountOz / 0.06))} dashes`
                              : `${item.amountOz.toFixed(2)} oz (${Math.round(item.amountOz * 29.57)} ml)`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Garnish, Technique & Archival History */}
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div>
                      <strong className="text-slate-100">Preparation Technique:</strong>{' '}
                      {PREP_TECHNIQUE_INFO[selectedRecipe.technique].label} —{' '}
                      {PREP_TECHNIQUE_INFO[selectedRecipe.technique].description}
                    </div>
                    <div>
                      <strong className="text-slate-100">Signature Garnish:</strong>{' '}
                      {selectedRecipe.garnish}
                    </div>
                    <div>
                      <strong className="text-slate-100">Historical Provenance:</strong>{' '}
                      {selectedRecipe.historyNotes}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 flex flex-wrap items-center gap-2.5 no-print">
                    <button
                      type="button"
                      onClick={() => onPracticeInBar(selectedRecipe)}
                      className="flex-1 px-4 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      Load into Virtual Bar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShareSpec(selectedRecipe)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      {copiedId === selectedRecipe.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Copied Spec & App Link
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          Copy Spec & Invite
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print PDF Card
                    </button>
                  </div>

                  {/* Direct Social Share for Selected Recipe */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs no-print">
                    <span className="text-slate-400">Share this recipe externally:</span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          `Mixing a ${selectedRecipe.name} (${selectedRecipe.category}) on Bars R Us — BarCraft Mixology Academy!`
                        )}&url=${encodeURIComponent(appUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-md inline-flex items-center gap-1"
                      >
                        X / Twitter
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          appUrl
                        )}&quote=${encodeURIComponent(
                          `Check out the ${selectedRecipe.name} spec on Bars R Us Mixology Academy!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-md inline-flex items-center gap-1"
                      >
                        Facebook
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `Try mixing the ${selectedRecipe.name} on Bars R Us: ${appUrl}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-md inline-flex items-center gap-1"
                      >
                        WhatsApp
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SOMMELIER WINE CATALOG (114 WHITE & RED VARIETALS, 4 OZ / 8 OZ POURS) */}
      {section === 'WINES' && (
        <div className="mt-6 space-y-5">
          <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Sommelier Wine By-The-Glass Program ({WINE_CATALOG.length} Varietals)
              </h2>
              <p className="text-xs text-slate-400">
                Complete 58 White Wine Varietals & 52 Red Wine Varietals with 4 oz tasting vs. 8 oz carafe pour specifications
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {(['ALL', 'White', 'Red', 'Sparkling'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setWineStyleFilter(st)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      wineStyleFilter === st
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {st === 'ALL' ? 'All Wines' : `${st} Wine`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {([4, 8] as const).map((oz) => (
                  <button
                    key={oz}
                    type="button"
                    onClick={() => setSelectedWinePourOz(oz)}
                    className={`px-3 py-1 text-xs font-mono tabular-nums font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      selectedWinePourOz === oz
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {oz} oz Pour ({Math.round(oz * 29.57)} ml)
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWines.map((wine) => (
              <div
                key={wine.id}
                className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {wine.style} · {wine.vintage}
                    </span>
                    <span className="font-mono tabular-nums text-amber-400">
                      {wine.abv.toFixed(1)}% ABV
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-1">{wine.name}</h3>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {wine.varietal} · {wine.region}
                  </div>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {wine.tastingNotes}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs space-y-1.5">
                  <div className="text-slate-300">
                    <strong className="text-slate-100">Culinary Pairing:</strong> {wine.pairing}
                  </div>
                  <div className="flex items-center justify-between text-slate-400 font-mono tabular-nums pt-1">
                    <span>Selected Service: {selectedWinePourOz} oz</span>
                    <span>
                      {Math.floor(25.4 / selectedWinePourOz)} glasses / 750ml bottle
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: CICERONE CRAFT BEER CATALOG (8 OZ / 12 OZ POURS) */}
      {section === 'BEERS' && (
        <div className="mt-6 space-y-5">
          <div className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Certified Cicerone Draft & Bottle List ({BEER_CATALOG.length} Domestic & Imported Beers)
              </h2>
              <p className="text-xs text-slate-400">
                8 oz tulip snifter pour vs. 12 oz standard draft chalice service across American, Belgian, Dutch, German, English, Scottish, Mexican, Jamaican, Irish, Italian, Japanese & Cider styles
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {([8, 12] as const).map((oz) => (
                <button
                  key={oz}
                  type="button"
                  onClick={() => setSelectedBeerPourOz(oz)}
                  className={`px-3 py-1.5 text-xs font-mono tabular-nums font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    selectedBeerPourOz === oz
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {oz} oz Draft Pour
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BEER_CATALOG.map((beer) => (
              <div
                key={beer.id}
                className="bg-[#0F1623] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{beer.breweryStyle}</span>
                    <span className="font-mono tabular-nums text-amber-400">
                      {beer.abv.toFixed(1)}% ABV · {beer.ibu} IBU
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-sm shrink-0 border border-white/20"
                      style={{ backgroundColor: beer.srmColor }}
                      title="SRM Beer Color Swatch"
                    />
                    <h3 className="text-base font-bold text-slate-100">{beer.name}</h3>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{beer.origin}</div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {beer.tastingNotes}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono tabular-nums">
                  <span>Draft Pour: {selectedBeerPourOz} oz</span>
                  <span>38°F (3.3°C) Glycol Line</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
