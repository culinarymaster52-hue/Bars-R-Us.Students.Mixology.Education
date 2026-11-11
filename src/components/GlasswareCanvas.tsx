import React from 'react';
import {
  GLASS_SPECS,
  GlassType,
  Ingredient,
  PREP_TECHNIQUE_INFO,
  PrepTechnique,
} from '../models/CocktailModels';

export interface PouredLayer {
  ingredient: Ingredient;
  amountOz: number;
}

interface GlasswareCanvasProps {
  glass: GlassType;
  pouredLayers: PouredLayer[];
  iceAdded: boolean;
  iceStyle: 'king' | 'pebble' | 'cubes';
  garnishName: string | null;
  activeTechnique: PrepTechnique;
  isAnimatingTechnique: boolean;
  isLayeredMode: boolean;
  activeSmokeWood?: {
    id: string;
    name: string;
    smokeColor: string;
  } | null;
}

function blendHexColors(layers: PouredLayer[]): string {
  const fluidLayers = layers.filter(
    (l) => l.ingredient.type !== 'GARNISH' && l.ingredient.type !== 'ICE' && l.amountOz > 0
  );
  if (fluidLayers.length === 0) return '#F59E0B';

  let totalOz = 0;
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;

  for (const item of fluidLayers) {
    const hex = item.ingredient.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 200;
    const g = parseInt(hex.substring(2, 4), 16) || 140;
    const b = parseInt(hex.substring(4, 6), 16) || 60;
    rSum += r * item.amountOz;
    gSum += g * item.amountOz;
    bSum += b * item.amountOz;
    totalOz += item.amountOz;
  }

  if (totalOz <= 0) return '#F59E0B';
  const r = Math.round(rSum / totalOz);
  const g = Math.round(gSum / totalOz);
  const b = Math.round(bSum / totalOz);
  return `rgb(${r}, ${g}, ${b})`;
}

export const GlasswareCanvas: React.FC<GlasswareCanvasProps> = ({
  glass,
  pouredLayers,
  iceAdded,
  iceStyle,
  garnishName,
  activeTechnique,
  isAnimatingTechnique,
  isLayeredMode,
  activeSmokeWood = null,
}) => {
  const spec = GLASS_SPECS[glass];
  const fluidLayers = pouredLayers.filter(
    (l) => l.ingredient.type !== 'GARNISH' && l.ingredient.type !== 'ICE'
  );
  const rawVolumeOz = fluidLayers.reduce((acc, item) => acc + item.amountOz, 0);
  const techInfo = PREP_TECHNIQUE_INFO[activeTechnique];
  const dilutedVolumeOz = rawVolumeOz * (1 + (rawVolumeOz > 0 ? techInfo.dilutionFactor * 0.5 : 0));

  // Calculate ABV of the finished drink
  const pureAlcoholOz = fluidLayers.reduce(
    (acc, item) => acc + item.amountOz * (item.ingredient.abv / 100),
    0
  );
  const finalAbv = dilutedVolumeOz > 0 ? (pureAlcoholOz / dilutedVolumeOz) * 100 : 0;

  const fillRatio = Math.min(0.92, rawVolumeOz / Math.max(4, spec.capacityOz * 0.78));
  const blendedColor = blendHexColors(fluidLayers);
  const hasCarbonation = fluidLayers.some(
    (l) =>
      l.ingredient.subCategory === 'Carbonated' ||
      l.ingredient.subCategory === 'Waters, Sodas & Tonics' ||
      l.ingredient.subCategory === 'Sparkling Wine' ||
      l.ingredient.type === 'BEER'
  );
  const hasEggOrCream = fluidLayers.some(
    (l) =>
      l.ingredient.id === 'egg_white_aquafaba' ||
      l.ingredient.id === 'heavy_cream' ||
      l.ingredient.id === 'espresso_shot' ||
      l.ingredient.subCategory === 'Cream, Egg & Coffee'
  );

  // Define SVG clip paths & bowl coordinates per glass silhouette
  const getBowlGeometry = (g: GlassType) => {
    switch (g) {
      case GlassType.COUPE:
        return {
          bowlPath: 'M 75 95 C 75 160, 225 160, 225 95 Z',
          stemPath: 'M 150 145 L 150 255 M 105 255 L 195 255',
          bowlTopY: 95,
          bowlBottomY: 146,
          rimX: 215,
          rimY: 95,
        };
      case GlassType.MARTINI:
        return {
          bowlPath: 'M 68 90 L 150 172 L 232 90 Z',
          stemPath: 'M 150 172 L 150 255 M 105 255 L 195 255',
          bowlTopY: 90,
          bowlBottomY: 170,
          rimX: 224,
          rimY: 90,
        };
      case GlassType.NICK_AND_NORA:
        return {
          bowlPath: 'M 92 90 C 90 155, 118 168, 150 168 C 182 168, 210 155, 208 90 Z',
          stemPath: 'M 150 168 L 150 255 M 108 255 L 192 255',
          bowlTopY: 90,
          bowlBottomY: 168,
          rimX: 205,
          rimY: 90,
        };
      case GlassType.FLUTE:
        return {
          bowlPath: 'M 118 65 C 115 150, 128 180, 150 182 C 172 180, 185 150, 182 65 Z',
          stemPath: 'M 150 182 L 150 255 M 112 255 L 188 255',
          bowlTopY: 65,
          bowlBottomY: 182,
          rimX: 180,
          rimY: 65,
        };
      case GlassType.WINE_GLASS:
        return {
          bowlPath: 'M 102 75 C 82 145, 112 182, 150 182 C 188 182, 218 145, 198 75 Z',
          stemPath: 'M 150 182 L 150 255 M 108 255 L 192 255',
          bowlTopY: 75,
          bowlBottomY: 182,
          rimX: 196,
          rimY: 75,
        };
      case GlassType.HIGHBALL:
      case GlassType.COLLINS:
        return {
          bowlPath: 'M 100 68 L 106 245 L 194 245 L 200 68 Z',
          stemPath: 'M 106 245 L 194 245 L 194 256 L 106 256 Z',
          bowlTopY: 68,
          bowlBottomY: 245,
          rimX: 198,
          rimY: 68,
        };
      case GlassType.COPPER_MUG:
        return {
          bowlPath: 'M 96 105 L 102 245 C 102 252, 198 252, 198 245 L 204 105 Z',
          stemPath: 'M 202 125 C 236 125, 236 215, 200 215',
          bowlTopY: 105,
          bowlBottomY: 246,
          rimX: 198,
          rimY: 105,
        };
      case GlassType.HURRICANE:
        return {
          bowlPath: 'M 102 68 C 118 115, 86 168, 108 215 C 120 232, 180 232, 192 215 C 214 168, 182 115, 198 68 Z',
          stemPath: 'M 150 226 L 150 255 M 112 255 L 188 255',
          bowlTopY: 68,
          bowlBottomY: 225,
          rimX: 195,
          rimY: 68,
        };
      case GlassType.PINT_GLASS:
        return {
          bowlPath: 'M 94 68 L 90 112 L 108 250 L 192 250 L 210 112 L 206 68 Z',
          stemPath: '',
          bowlTopY: 68,
          bowlBottomY: 250,
          rimX: 202,
          rimY: 68,
        };
      case GlassType.GLENCAIRN:
        return {
          bowlPath: 'M 118 92 C 122 130, 92 162, 108 205 C 120 224, 180 224, 192 205 C 208 162, 178 130, 182 92 Z',
          stemPath: 'M 122 220 L 114 252 L 186 252 L 178 220 Z',
          bowlTopY: 92,
          bowlBottomY: 218,
          rimX: 180,
          rimY: 92,
        };
      case GlassType.ROCKS:
      default:
        return {
          bowlPath: 'M 88 118 L 96 238 L 204 238 L 212 118 Z',
          stemPath: 'M 96 238 L 204 238 L 204 256 L 96 256 Z',
          bowlTopY: 118,
          bowlBottomY: 238,
          rimX: 208,
          rimY: 118,
        };
    }
  };

  const geom = getBowlGeometry(glass);
  const bowlHeight = geom.bowlBottomY - geom.bowlTopY;
  const liquidHeight = bowlHeight * fillRatio;
  const liquidTopY = geom.bowlBottomY - liquidHeight;

  return (
    <div className="relative flex flex-col items-center justify-between bg-[#0F1623] border border-slate-800/80 rounded-xl p-5 select-none">
      {/* Top Telemetry Strip */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">{spec.name}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{spec.capacityOz.toFixed(1)} oz cap</span>
          {activeSmokeWood && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-medium">
                Smoked ({activeSmokeWood.name})
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 font-mono tabular-nums">
          <span className="text-amber-400 font-medium">
            {rawVolumeOz.toFixed(2)} oz poured
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-300">{finalAbv.toFixed(1)}% ABV</span>
        </div>
      </div>

      {/* Central Interactive Glass & Shaker SVG Stage */}
      <div className="relative w-full h-72 flex items-center justify-center my-1">
        <svg
          viewBox="0 0 300 280"
          className={`w-64 h-64 transition-transform duration-200 ${
            isAnimatingTechnique ? 'scale-105 -rotate-3' : 'scale-100 rotate-0'
          }`}
          role="img"
          aria-label={`Interactive ${spec.name} containing ${rawVolumeOz.toFixed(2)} ounces of liquid`}
        >
          <defs>
            <clipPath id={`bowl-clip-${glass}`}>
              <path d={geom.bowlPath} />
            </clipPath>
            <linearGradient id="glass-sheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.03)" />
              <stop offset="80%" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
            </linearGradient>
            <linearGradient id="copper-sheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <radialGradient id="smoke-plume" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor={activeSmokeWood?.smokeColor ?? '#CBD5E1'} stopOpacity="0.65" />
              <stop offset="65%" stopColor={activeSmokeWood?.smokeColor ?? '#94A3B8'} stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Subtle Bar Mat Reflection Grid */}
          <ellipse cx="150" cy="262" rx="72" ry="8" fill="rgba(245, 158, 11, 0.08)" />
          <line x1="55" y1="262" x2="245" y2="262" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1.5" />

          {/* Clipped Liquid & Ice Interior */}
          <g clipPath={`url(#bowl-clip-${glass})`}>
            {/* Background inside glass */}
            <rect x="50" y="50" width="200" height="210" fill="rgba(15, 23, 42, 0.45)" />

            {/* Liquid Fill: Either Stratified Layers or Blended */}
            {rawVolumeOz > 0 && !isLayeredMode && (
              <rect
                x="50"
                y={liquidTopY}
                width="200"
                height={liquidHeight + 10}
                fill={blendedColor}
                fillOpacity={0.86}
                className="transition-all duration-200"
              />
            )}

            {rawVolumeOz > 0 && isLayeredMode && (
              <g>
                {(() => {
                  let currentBottom = geom.bowlBottomY;
                  return fluidLayers.map((layer, idx) => {
                    const layerFrac = layer.amountOz / Math.max(0.1, rawVolumeOz);
                    const segH = liquidHeight * layerFrac;
                    const segY = currentBottom - segH;
                    currentBottom = segY;
                    return (
                      <rect
                        key={`${layer.ingredient.id}_${idx}`}
                        x="50"
                        y={segY}
                        width="200"
                        height={segH + 1}
                        fill={layer.ingredient.color}
                        fillOpacity={0.88}
                      />
                    );
                  });
                })()}
              </g>
            )}

            {/* Egg White / Espresso / Nitro Foam Collar */}
            {rawVolumeOz > 0 && (hasEggOrCream || activeTechnique === PrepTechnique.DRY_SHAKE) && (
              <rect
                x="55"
                y={Math.max(geom.bowlTopY, liquidTopY - 10)}
                width="190"
                height="11"
                fill="#FEFCE8"
                fillOpacity="0.92"
              />
            )}

            {/* Ice Rendering Inside Bowl */}
            {iceAdded && (
              <g opacity="0.72">
                {iceStyle === 'king' ? (
                  <rect
                    x="114"
                    y={Math.max(geom.bowlTopY + 12, geom.bowlBottomY - 76)}
                    width="72"
                    height="68"
                    rx="8"
                    fill="rgba(224, 242, 254, 0.42)"
                    stroke="rgba(255, 255, 255, 0.65)"
                    strokeWidth="1.5"
                  />
                ) : iceStyle === 'pebble' ? (
                  <g>
                    {Array.from({ length: 18 }).map((_, i) => {
                      const row = Math.floor(i / 4);
                      const col = i % 4;
                      return (
                        <rect
                          key={i}
                          x={100 + col * 24 + (row % 2) * 6}
                          y={geom.bowlBottomY - 22 - row * 22}
                          width="18"
                          height="16"
                          rx="4"
                          fill="rgba(224, 242, 254, 0.5)"
                          stroke="rgba(255,255,255,0.55)"
                          strokeWidth="1"
                        />
                      );
                    })}
                  </g>
                ) : (
                  <g>
                    <rect
                      x="108"
                      y={geom.bowlBottomY - 52}
                      width="38"
                      height="36"
                      rx="6"
                      transform="rotate(-8 125 200)"
                      fill="rgba(224, 242, 254, 0.42)"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.2"
                    />
                    <rect
                      x="148"
                      y={geom.bowlBottomY - 64}
                      width="38"
                      height="36"
                      rx="6"
                      transform="rotate(11 165 190)"
                      fill="rgba(224, 242, 254, 0.42)"
                      stroke="rgba(255,255,254,0.6)"
                      strokeWidth="1.2"
                    />
                  </g>
                )}
              </g>
            )}

            {/* Rising Carbonation Perlage Bubbles */}
            {rawVolumeOz > 0 && hasCarbonation && (
              <g fill="rgba(255,255,255,0.65)">
                <circle cx="132" cy={liquidTopY + 25} r="2" />
                <circle cx="148" cy={liquidTopY + 45} r="1.5" />
                <circle cx="164" cy={liquidTopY + 18} r="2.2" />
                <circle cx="140" cy={liquidTopY + 65} r="1.8" />
                <circle cx="158" cy={liquidTopY + 55} r="1.4" />
              </g>
            )}

            {/* Aromatic Wood Smoke Swirl Inside Headspace */}
            {activeSmokeWood && (
              <g>
                <ellipse
                  cx="150"
                  cy={Math.max(geom.bowlTopY + 20, liquidTopY - 12)}
                  rx="68"
                  ry="28"
                  fill="url(#smoke-plume)"
                />
                <path
                  d={`M 105 ${liquidTopY} C 125 ${liquidTopY - 28}, 175 ${liquidTopY - 28}, 195 ${liquidTopY}`}
                  fill="none"
                  stroke={activeSmokeWood.smokeColor}
                  strokeOpacity="0.45"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Copper Mug Solid Exterior Overlay if Copper Mug selected */}
            {glass === GlassType.COPPER_MUG && (
              <rect
                x="60"
                y="95"
                width="180"
                height="160"
                fill="url(#copper-sheen)"
                fillOpacity="0.32"
              />
            )}

            {/* Crystal Specular Highlight */}
            <rect x="50" y="50" width="200" height="210" fill="url(#glass-sheen)" />
          </g>

          {/* Liquid Meniscus Line */}
          {rawVolumeOz > 0 && (
            <line
              x1="92"
              y1={liquidTopY}
              x2="208"
              y2={liquidTopY}
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.5"
              clipPath={`url(#bowl-clip-${glass})`}
            />
          )}

          {/* Stem & Base */}
          {geom.stemPath && (
            <path
              d={geom.stemPath}
              fill={
                glass === GlassType.ROCKS ||
                glass === GlassType.HIGHBALL ||
                glass === GlassType.COLLINS
                  ? 'rgba(226, 232, 240, 0.18)'
                  : 'none'
              }
              stroke={glass === GlassType.COPPER_MUG ? '#D97706' : 'rgba(226, 232, 240, 0.68)'}
              strokeWidth={glass === GlassType.COPPER_MUG ? '5' : '3'}
              strokeLinecap="round"
            />
          )}

          {/* Glass Bowl Outline */}
          <path
            d={geom.bowlPath}
            fill="none"
            stroke={glass === GlassType.COPPER_MUG ? '#F59E0B' : 'rgba(226, 232, 240, 0.78)'}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Aromatic Smoke Wisps Rising Above Rim */}
          {activeSmokeWood && (
            <g opacity="0.78">
              <path
                d={`M 132 ${geom.bowlTopY + 6} C 118 ${geom.bowlTopY - 18}, 148 ${geom.bowlTopY - 34}, 136 ${geom.bowlTopY - 54}`}
                fill="none"
                stroke={activeSmokeWood.smokeColor}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d={`M 154 ${geom.bowlTopY + 4} C 168 ${geom.bowlTopY - 22}, 140 ${geom.bowlTopY - 40}, 158 ${geom.bowlTopY - 60}`}
                fill="none"
                stroke={activeSmokeWood.smokeColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d={`M 172 ${geom.bowlTopY + 8} C 184 ${geom.bowlTopY - 14}, 162 ${geom.bowlTopY - 28}, 174 ${geom.bowlTopY - 46}`}
                fill="none"
                stroke={activeSmokeWood.smokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Garnish Render on Rim */}
          {garnishName && (
            <g transform={`translate(${geom.rimX - 10}, ${geom.rimY - 8})`}>
              {garnishName.toLowerCase().includes('mint') ||
              garnishName.toLowerCase().includes('rosemary') ||
              garnishName.toLowerCase().includes('basil') ? (
                <g>
                  <path
                    d="M 0 10 C -12 -8, 4 -22, 14 -6 C 24 -22, 34 -4, 12 10 Z"
                    fill="#10B981"
                    stroke="#047857"
                    strokeWidth="1.2"
                  />
                </g>
              ) : garnishName.toLowerCase().includes('cherry') ||
                garnishName.toLowerCase().includes('blackberry') ? (
                <g>
                  <line x1="-18" y1="-12" x2="12" y2="18" stroke="#D97706" strokeWidth="2" />
                  <circle cx="0" cy="4" r="9" fill="#881337" stroke="#4C0519" strokeWidth="1.5" />
                  <circle cx="-3" cy="1" r="2.2" fill="rgba(255,255,255,0.5)" />
                </g>
              ) : garnishName.toLowerCase().includes('olive') ||
                garnishName.toLowerCase().includes('onion') ? (
                <g>
                  <line x1="-20" y1="-14" x2="14" y2="20" stroke="#CBD5E1" strokeWidth="2" />
                  <ellipse cx="-4" cy="0" rx="8" ry="6" fill="#65A30D" stroke="#365314" strokeWidth="1.2" />
                  <circle cx="-4" cy="0" r="2" fill="#EF4444" />
                </g>
              ) : (
                <g>
                  <circle
                    cx="4"
                    cy="2"
                    r="16"
                    fill={
                      garnishName.toLowerCase().includes('lime')
                        ? '#84CC16'
                        : garnishName.toLowerCase().includes('orange') ||
                          garnishName.toLowerCase().includes('grapefruit')
                        ? '#F97316'
                        : '#FACC15'
                    }
                    fillOpacity="0.9"
                    stroke="#FEFCE8"
                    strokeWidth="2"
                  />
                  <circle
                    cx="4"
                    cy="2"
                    r="11"
                    fill="none"
                    stroke="rgba(255,255,255,0.45)"
                    strokeDasharray="3 2"
                  />
                </g>
              )}
            </g>
          )}

          {/* Flame / Expressed Oil Torch Effect */}
          {activeTechnique === PrepTechnique.FLAME && rawVolumeOz > 0 && (
            <g transform={`translate(150, ${geom.bowlTopY - 18})`}>
              <path
                d="M 0 -22 C 12 -6, 16 8, 0 16 C -16 8, -12 -6, 0 -22 Z"
                fill="rgba(249, 115, 22, 0.85)"
              />
              <path
                d="M 0 -12 C 6 -2, 8 6, 0 12 C -8 6, -6 -2, 0 -12 Z"
                fill="#FEF08A"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Layer Stack Readout */}
      <div className="w-full border-t border-slate-800/80 pt-3">
        {pouredLayers.length === 0 && !activeSmokeWood ? (
          <p className="text-xs text-slate-400 text-center">
            Select a bottle from the rack on the right to pour into the {spec.name}.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
            {pouredLayers.map((layer, index) => {
              const dashCount = Math.max(1, Math.round(layer.amountOz / 0.06));
              return (
                <React.Fragment key={`${layer.ingredient.id}_${index}`}>
                  {index > 0 && <span className="text-slate-600" aria-hidden="true">·</span>}
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0 border border-white/20"
                      style={{ backgroundColor: layer.ingredient.color }}
                    />
                    <span className="font-medium text-slate-200">{layer.ingredient.name}</span>
                    <span className="font-mono tabular-nums text-amber-400">
                      {layer.ingredient.unit === 'dash'
                        ? `${dashCount} ${dashCount === 1 ? 'dash' : 'dashes'}`
                        : layer.ingredient.unit === 'piece'
                        ? '1 pc'
                        : `${layer.amountOz.toFixed(2)} oz`}
                    </span>
                  </span>
                </React.Fragment>
              );
            })}
            {activeSmokeWood && (
              <>
                {pouredLayers.length > 0 && <span className="text-slate-600" aria-hidden="true">·</span>}
                <span className="text-amber-300 font-medium">
                  Infused with {activeSmokeWood.name}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
