/**
 * Domain Models mirroring com.example.model.CocktailModels.kt
 * Application ID: com.barsrus.mixology.pub
 */

export enum IngredientType {
  SPIRIT = 'SPIRIT',
  APERITIF = 'APERITIF',
  BITTERS = 'BITTERS',
  WINE = 'WINE',
  BEER = 'BEER',
  MIXER = 'MIXER',
  GARNISH = 'GARNISH',
  ICE = 'ICE',
}

export const INGREDIENT_TYPE_LABELS: Record<IngredientType, string> = {
  [IngredientType.SPIRIT]: 'Spirits & Liqueurs',
  [IngredientType.APERITIF]: 'Apéritifs & Vermouths',
  [IngredientType.BITTERS]: 'Aromatic Bitters',
  [IngredientType.WINE]: 'Fine Wine & Champagne',
  [IngredientType.BEER]: 'Craft Beer & Cider',
  [IngredientType.MIXER]: 'Mixers & Syrups',
  [IngredientType.GARNISH]: 'Garnishes',
  [IngredientType.ICE]: 'Ice & Cooling',
};

export enum GlassType {
  ROCKS = 'ROCKS',
  COUPE = 'COUPE',
  HIGHBALL = 'HIGHBALL',
  COLLINS = 'COLLINS',
  MARTINI = 'MARTINI',
  NICK_AND_NORA = 'NICK_AND_NORA',
  COPPER_MUG = 'COPPER_MUG',
  HURRICANE = 'HURRICANE',
  FLUTE = 'FLUTE',
  WINE_GLASS = 'WINE_GLASS',
  PINT_GLASS = 'PINT_GLASS',
  GLENCAIRN = 'GLENCAIRN',
}

export interface GlassSpec {
  id: GlassType;
  name: string;
  capacityOz: number;
  recommendedIce: string;
  silhouetteDescription: string;
}

export const GLASS_SPECS: Record<GlassType, GlassSpec> = {
  [GlassType.ROCKS]: {
    id: GlassType.ROCKS,
    name: 'Old Fashioned / Rocks',
    capacityOz: 10.5,
    recommendedIce: '2-inch King Cube or Standard Cubes',
    silhouetteDescription: 'Heavy base lowball tumbler for spirit-forward builds',
  },
  [GlassType.COUPE]: {
    id: GlassType.COUPE,
    name: 'Crystal Coupe',
    capacityOz: 5.5,
    recommendedIce: 'Served Up (Chilled, No Ice)',
    silhouetteDescription: 'Broad shallow saucer bowl on slender stem',
  },
  [GlassType.HIGHBALL]: {
    id: GlassType.HIGHBALL,
    name: 'Highball Tumbler',
    capacityOz: 12.0,
    recommendedIce: 'Standard Cubes or Collins Spear',
    silhouetteDescription: 'Tall chimney glass for carbonated highballs',
  },
  [GlassType.COLLINS]: {
    id: GlassType.COLLINS,
    name: 'Collins Chimney',
    capacityOz: 14.0,
    recommendedIce: 'Collins Ice Spear or Pebbles',
    silhouetteDescription: 'Extra-tall cylindrical glass for lengthened sours and fizzes',
  },
  [GlassType.MARTINI]: {
    id: GlassType.MARTINI,
    name: 'V-Shaped Martini',
    capacityOz: 6.0,
    recommendedIce: 'Served Up (Double Strained)',
    silhouetteDescription: 'Iconic inverted cone bowl preventing hand warmth transfer',
  },
  [GlassType.NICK_AND_NORA]: {
    id: GlassType.NICK_AND_NORA,
    name: 'Nick & Nora',
    capacityOz: 5.0,
    recommendedIce: 'Served Up (Stirred & Strained)',
    silhouetteDescription: '1930s speakeasy bell-curved stemmed glass',
  },
  [GlassType.COPPER_MUG]: {
    id: GlassType.COPPER_MUG,
    name: 'Hammered Copper Mug',
    capacityOz: 14.0,
    recommendedIce: 'Crushed or Cubed Ice',
    silhouetteDescription: 'Thermal-conductive vessel for Mules and Bucks',
  },
  [GlassType.HURRICANE]: {
    id: GlassType.HURRICANE,
    name: 'Tiki / Hurricane Tulip',
    capacityOz: 16.0,
    recommendedIce: 'Pebble / Crushed Ice Mound',
    silhouetteDescription: 'Curved tulip lamp glass for tropical multi-rum builds',
  },
  [GlassType.FLUTE]: {
    id: GlassType.FLUTE,
    name: 'Champagne Flute',
    capacityOz: 6.5,
    recommendedIce: 'Chilled Neat (No Ice)',
    silhouetteDescription: 'Narrow nucleation bowl preserving fine perlage',
  },
  [GlassType.WINE_GLASS]: {
    id: GlassType.WINE_GLASS,
    name: 'Bordeaux / Universal Wine',
    capacityOz: 16.0,
    recommendedIce: 'Chilled Neat or Spritz Cubes',
    silhouetteDescription: 'Tapered tulip bowl concentrating varietal aromatics',
  },
  [GlassType.PINT_GLASS]: {
    id: GlassType.PINT_GLASS,
    name: 'Imperial Nonic Pint',
    capacityOz: 16.0,
    recommendedIce: 'Draft Chilled (No Ice)',
    silhouetteDescription: 'Ridged grip pub pint for ales, stouts, and lagers',
  },
  [GlassType.GLENCAIRN]: {
    id: GlassType.GLENCAIRN,
    name: 'Glencairn Nosing Glass',
    capacityOz: 6.0,
    recommendedIce: 'Neat or 2 Drops Spring Water',
    silhouetteDescription: 'Thistle-shaped crystal nosing vessel for single malts',
  },
};

export enum PrepTechnique {
  STIR = 'STIR',
  SHAKE = 'SHAKE',
  BUILD = 'BUILD',
  MUDDLE = 'MUDDLE',
  DRY_SHAKE = 'DRY_SHAKE',
  SWIZZLE = 'SWIZZLE',
  LAYER = 'LAYER',
  FLAME = 'FLAME',
}

export const PREP_TECHNIQUE_INFO: Record<
  PrepTechnique,
  { label: string; dilutionFactor: number; tempDropC: number; description: string }
> = {
  [PrepTechnique.STIR]: {
    label: 'Stir in Mixing Glass',
    dilutionFactor: 0.22,
    tempDropC: 18,
    description: '35 rotations with bar spoon; preserves silky texture and crystal clarity for spirit-only drinks.',
  },
  [PrepTechnique.SHAKE]: {
    label: 'Hard Shake (Boston Shaker)',
    dilutionFactor: 0.32,
    tempDropC: 24,
    description: '12-second vigorous whip-and-piston shake; aerates citrus, syrups, cream, and egg whites.',
  },
  [PrepTechnique.BUILD]: {
    label: 'Build in Glass',
    dilutionFactor: 0.12,
    tempDropC: 12,
    description: 'Pour directly over fresh ice in the serving vessel and gently lift with bar spoon.',
  },
  [PrepTechnique.MUDDLE]: {
    label: 'Muddle & Build',
    dilutionFactor: 0.15,
    tempDropC: 14,
    description: 'Press herbs, citrus, or sugar cube in the base to express essential oils before adding spirits.',
  },
  [PrepTechnique.DRY_SHAKE]: {
    label: 'Dry Shake + Wet Shake',
    dilutionFactor: 0.30,
    tempDropC: 22,
    description: 'Emulsify proteins without ice first, then add king ice to chill and lock in meringue foam.',
  },
  [PrepTechnique.SWIZZLE]: {
    label: 'Swizzle in Crushed Ice',
    dilutionFactor: 0.36,
    tempDropC: 25,
    description: 'Spin a Lélé swizzle stick between palms in pebble ice until heavy frost coats the exterior.',
  },
  [PrepTechnique.LAYER]: {
    label: 'Float / Specific Gravity Layer',
    dilutionFactor: 0.05,
    tempDropC: 8,
    description: 'Pour lower-Brix / higher-ABV spirits gently over the back of a bar spoon for distinct strata.',
  },
  [PrepTechnique.FLAME]: {
    label: 'Express & Flame Citrus / Torch',
    dilutionFactor: 0.20,
    tempDropC: 16,
    description: 'Caramelize expressed limonene oils over an open flame or smoke rosemary/oak chips.',
  },
};

export interface Ingredient {
  id: string;
  name: string;
  type: IngredientType;
  subCategory: string;
  abv: number;
  color: string; // Hex color for canvas fluid rendering
  standardPourOz: number;
  unit: 'oz' | 'dash' | 'piece';
  flavorNote: string;
  origin?: string;
  maxCapacityOz: number;
}

export interface MeasuredIngredient {
  ingredientId: string;
  ingredientName: string;
  amountOz: number;
  unit?: 'oz' | 'dash' | 'piece';
}

export interface CocktailRecipe {
  id: string;
  name: string;
  category:
    | 'Whiskey'
    | 'Gin'
    | 'Vodka'
    | 'Rum & Tiki'
    | 'Tequila & Mezcal'
    | 'Brandy & Cognac'
    | 'Apéritif & Spritz'
    | 'Wine, Beer & Low-ABV'
    | 'Custom House';
  glass: GlassType;
  iceRequired: boolean;
  technique: PrepTechnique;
  ingredients: MeasuredIngredient[];
  garnish: string;
  description: string;
  historyNotes: string;
  isCustom?: boolean;
  isFavorite?: boolean;
  creatorName?: string;
  creationTimestamp?: number;
}

export interface BarTool {
  id: string;
  name: string;
  category: 'Vessel' | 'Strainer' | 'Measure' | 'Agitator' | 'Garnish & Prep';
  associatedTechnique?: PrepTechnique;
  purpose: string;
  proTip: string;
}

export interface WineCatalogEntry {
  id: string;
  name: string;
  style: 'White' | 'Red' | 'Sparkling' | 'Rosé' | 'Fortified / Dessert';
  varietal: string;
  region: string;
  vintage: string;
  abv: number;
  color: string;
  pourOptionsOz: [number, number]; // [4, 8]
  tastingNotes: string;
  pairing: string;
}

export interface BeerCatalogEntry {
  id: string;
  name: string;
  breweryStyle: string;
  origin: string;
  abv: number;
  ibu: number;
  srmColor: string;
  pourOptionsOz: [number, number]; // [8, 12]
  tastingNotes: string;
}
