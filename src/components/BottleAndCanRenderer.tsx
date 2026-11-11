import React from 'react';
import { Ingredient, IngredientType } from '../models/CocktailModels';

interface BottleRendererProps {
  ingredient: Ingredient;
  remainingOz: number;
  selectedPourOz: number;
  selectedBittersDashes?: number;
  onPour: (ingredient: Ingredient, amountOz: number) => void;
  onRefill: (ingredientId: string) => void;
}

export const BottleAndCanRenderer: React.FC<BottleRendererProps> = ({
  ingredient,
  remainingOz,
  selectedPourOz,
  selectedBittersDashes = 2,
  onPour,
  onRefill,
}) => {
  const fillPct = Math.max(0, Math.min(100, (remainingOz / ingredient.maxCapacityOz) * 100));
  const isDepleted = remainingOz < 0.05;

  const pourAmount =
    ingredient.unit === 'dash'
      ? Number((selectedBittersDashes * 0.06).toFixed(2))
      : ingredient.unit === 'piece'
      ? 0.05
      : selectedPourOz;

  const formatPourOzLabel = (oz: number) => {
    if (oz === 0.1) return '1/10 (0.1) oz';
    if (oz === 0.25) return '1/4 (0.25) oz';
    if (oz === 0.5) return '1/2 (0.5) oz';
    if (oz === 0.75) return '3/4 (0.75) oz';
    return `${Number(oz.toFixed(2))} oz`;
  };

  const pourLabel =
    ingredient.unit === 'dash'
      ? `+Pour ${selectedBittersDashes} ${selectedBittersDashes === 1 ? 'Dash' : 'Dashes'}`
      : ingredient.unit === 'piece'
      ? '+Add Garnish'
      : `+Pour ${formatPourOzLabel(selectedPourOz)}`;

  return (
    <div className="group flex flex-col justify-between bg-[#0F1623] border border-slate-800/80 hover:border-amber-500/50 rounded-xl p-3.5 transition-colors">
      <div className="flex items-start gap-3">
        {/* Custom Vector Bottle / Dasher / Wine / Beer Silhouette */}
        <div className="w-11 h-20 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 48 96" className="w-11 h-20" aria-hidden="true">
            {ingredient.type === IngredientType.BITTERS ? (
              // Bitters Dasher Bottle with Oversized Paper Label
              <g>
                <rect x="20" y="6" width="8" height="12" rx="1" fill="#FACC15" />
                <path d="M 21 18 L 19 34 L 29 34 L 27 18 Z" fill="#78350F" />
                <rect
                  x="11"
                  y="34"
                  width="26"
                  height="54"
                  rx="5"
                  fill="#292524"
                  stroke="#78716C"
                  strokeWidth="1.2"
                />
                <rect x="9" y="44" width="30" height="32" rx="1" fill="#FEFCE8" />
                <rect x="13" y="50" width="22" height="4" fill={ingredient.color} />
                <rect x="13" y="58" width="18" height="2.5" fill="#44403C" />
                <rect x="13" y="64" width="20" height="2.5" fill="#44403C" />
              </g>
            ) : ingredient.type === IngredientType.GARNISH || ingredient.type === IngredientType.ICE ? (
              // Garnish Apothecary Caddy Jar
              <g>
                <rect x="12" y="18" width="24" height="8" rx="2" fill="#B45309" />
                <rect
                  x="9"
                  y="26"
                  width="30"
                  height="60"
                  rx="6"
                  fill="rgba(30, 41, 59, 0.7)"
                  stroke="#64748B"
                  strokeWidth="1.5"
                />
                <circle cx="24" cy="56" r="10" fill={ingredient.color} fillOpacity="0.88" />
              </g>
            ) : ingredient.type === IngredientType.BEER ? (
              // Craft Beer Bottle / Tallboy Silhouette
              <g>
                <rect x="19" y="8" width="10" height="4" rx="1" fill="#F59E0B" />
                <path
                  d="M 20 12 L 18 32 C 13 36, 11 42, 11 48 L 11 88 C 11 91, 13 92, 16 92 L 32 92 C 35 92, 37 91, 37 88 L 37 48 C 37 42, 35 36, 30 32 L 28 12 Z"
                  fill="#451A03"
                  stroke="#92400E"
                  strokeWidth="1.3"
                />
                <rect
                  x="12.5"
                  y={90 - (fillPct / 100) * 42}
                  width="23"
                  height={(fillPct / 100) * 42}
                  rx="2"
                  fill={ingredient.color}
                  fillOpacity="0.82"
                />
                <rect x="13" y="50" width="22" height="24" rx="2" fill="#FEF3C7" />
                <rect x="16" y="55" width="16" height="4" fill={ingredient.color} />
                <rect x="16" y="63" width="12" height="2" fill="#451A03" />
              </g>
            ) : (
              // Classic Apothecary / Bordeaux Bottle with Live Fluid Depletion Gauge
              <g>
                {/* Metal Speed Pourer Spout */}
                <path d="M 22 4 L 25 4 L 26 14 L 21 14 Z" fill="#CBD5E1" />
                <rect x="19" y="14" width="10" height="6" rx="1" fill="#334155" />
                {/* Neck */}
                <rect x="20" y="20" width="8" height="14" fill="rgba(226, 232, 240, 0.25)" />
                {/* Bottle Body */}
                <path
                  d="M 20 34 C 12 38, 10 44, 10 50 L 10 86 C 10 90, 13 92, 16 92 L 32 92 C 35 92, 38 90, 38 86 L 38 50 C 38 44, 36 38, 28 34 Z"
                  fill="rgba(15, 23, 42, 0.85)"
                  stroke="rgba(148, 163, 184, 0.55)"
                  strokeWidth="1.4"
                />
                {/* Dynamic Liquid Level Inside Bottle */}
                <rect
                  x="11.5"
                  y={90 - (fillPct / 100) * 44}
                  width="25"
                  height={(fillPct / 100) * 44}
                  rx="2"
                  fill={ingredient.color}
                  fillOpacity="0.85"
                />
                {/* Parchment Front Label */}
                <rect
                  x="13"
                  y="52"
                  width="22"
                  height="24"
                  rx="1.5"
                  fill="#F8FAFC"
                  stroke="#94A3B8"
                  strokeWidth="0.6"
                />
                <rect x="16" y="56" width="16" height="3.5" fill={ingredient.color} />
                <rect x="16" y="63" width="12" height="2" fill="#334155" />
                <rect x="16" y="68" width="14" height="2" fill="#64748B" />
              </g>
            )}
          </svg>
        </div>

        {/* Bottle Metadata */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="truncate">{ingredient.subCategory}</span>
            {ingredient.abv > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-amber-400/90 shrink-0">
                  {ingredient.abv % 1 === 0 ? ingredient.abv.toFixed(0) : ingredient.abv.toFixed(1)}% ABV
                </span>
              </>
            )}
          </div>
          <h4 className="text-sm font-semibold text-slate-100 leading-snug mt-0.5 line-clamp-2">
            {ingredient.name}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1" title={ingredient.flavorNote}>
            {ingredient.flavorNote}
          </p>
        </div>
      </div>

      {/* Quick Bitters 1-6 Dash Selector OR Quick Wine/Beer Pours */}
      {ingredient.type === IngredientType.BITTERS && !isDepleted && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1">
          <span className="text-[11px] text-slate-400">Quick Dashes:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((dashes) => (
              <button
                key={dashes}
                type="button"
                onClick={() => onPour(ingredient, Number((dashes * 0.06).toFixed(2)))}
                className={`px-1.5 py-0.5 text-[11px] font-mono tabular-nums rounded transition-colors ${
                  selectedBittersDashes === dashes
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 font-semibold'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
                title={`Pour ${dashes} ${dashes === 1 ? 'dash' : 'dashes'}`}
              >
                {dashes}d
              </button>
            ))}
          </div>
        </div>
      )}

      {ingredient.type === IngredientType.WINE && !isDepleted && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1.5">
          <span className="text-[11px] text-slate-400">Sommelier Pours:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPour(ingredient, 4.0)}
              className="px-2 py-0.5 text-[11px] font-mono tabular-nums bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded transition-colors"
            >
              +4 oz Glass
            </button>
            <button
              type="button"
              onClick={() => onPour(ingredient, 8.0)}
              className="px-2 py-0.5 text-[11px] font-mono tabular-nums bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded transition-colors"
            >
              +8 oz Carafe
            </button>
          </div>
        </div>
      )}

      {ingredient.type === IngredientType.BEER && !isDepleted && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1.5">
          <span className="text-[11px] text-slate-400">Draft Pours:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPour(ingredient, 8.0)}
              className="px-2 py-0.5 text-[11px] font-mono tabular-nums bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded transition-colors"
            >
              +8 oz Half-Pint
            </button>
            <button
              type="button"
              onClick={() => onPour(ingredient, 12.0)}
              className="px-2 py-0.5 text-[11px] font-mono tabular-nums bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded transition-colors"
            >
              +12 oz Full Pour
            </button>
          </div>
        </div>
      )}

      {/* Depletion Progress & Pour Action Row */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[11px] font-mono tabular-nums text-slate-400">
            {remainingOz.toFixed(1)} / {ingredient.maxCapacityOz.toFixed(1)} oz
          </span>
          <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full transition-all duration-200 ${
                fillPct < 20 ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {fillPct < 95 && (
            <button
              type="button"
              onClick={() => onRefill(ingredient.id)}
              className="px-2 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/90 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Refill bottle to full capacity"
            >
              Refill
            </button>
          )}
          <button
            type="button"
            disabled={isDepleted}
            onClick={() => onPour(ingredient, pourAmount)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              isDepleted
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isDepleted ? 'Empty' : pourLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
