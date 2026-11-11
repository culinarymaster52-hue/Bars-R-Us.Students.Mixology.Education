import { BeerCatalogEntry, WineCatalogEntry } from '../models/CocktailModels';
import { ATTACHED_BEER_LIST, ATTACHED_WINE_CATALOG } from './ExpandedBarCatalog';

const CURATED_ESTATE_WINES: WineCatalogEntry[] = [
  {
    id: 'wine_chablis_premier',
    name: 'Domaine Laroche Chablis 1er Cru',
    style: 'White',
    varietal: 'Chardonnay (Unoaked)',
    region: 'Burgundy, France',
    vintage: '2022',
    abv: 13.0,
    color: '#FEF9C3',
    pourOptionsOz: [4, 8],
    tastingNotes: 'Kimmeridgian oyster-shell minerality, green apple, Meyer lemon zest, razor-sharp acidity.',
    pairing: 'Raw bar oysters, seared scallops, goat cheese crostini',
  },
  {
    id: 'wine_sancerre_loire',
    name: 'Comte Lafond Sancerre Blanc',
    style: 'White',
    varietal: 'Sauvignon Blanc',
    region: 'Loire Valley, France',
    vintage: '2023',
    abv: 12.8,
    color: '#FEFCE8',
    pourOptionsOz: [4, 8],
    tastingNotes: 'Flinty silex stone, white grapefruit, gooseberry, crushed elderflower.',
    pairing: 'Crottin de Chavignol chèvre, ceviche, herb-roasted poultry',
  },
  {
    id: 'wine_barolo_docg',
    name: 'Pio Cesare Barolo DOCG',
    style: 'Red',
    varietal: 'Nebbiolo',
    region: 'Piedmont, Italy',
    vintage: '2019',
    abv: 14.5,
    color: '#991B1B',
    pourOptionsOz: [4, 8],
    tastingNotes: 'Crushed rose petal, tar, sour Marasca cherry, Alba white truffle, firm Nebbiolo tannins.',
    pairing: 'Tajarin pasta with white truffle, braised short ribs, aged Parmigiano',
  },
  {
    id: 'wine_champagne_ruinart',
    name: 'Ruinart Blanc de Blancs Champagne NV',
    style: 'Sparkling',
    varietal: '100% Premier Cru Chardonnay',
    region: 'Reims, Champagne, France',
    vintage: 'NV',
    abv: 12.5,
    color: '#FEF08A',
    pourOptionsOz: [4, 8],
    tastingNotes: 'Citron, white peach, toasted brioche, chalk crayères cellar minerality, pinpoint bubbles.',
    pairing: 'Caviar blinis, tempura prawns, triple-cream Brillat-Savarin',
  },
];

export const WINE_CATALOG: WineCatalogEntry[] = [
  ...CURATED_ESTATE_WINES,
  ...ATTACHED_WINE_CATALOG,
];

export const BEER_CATALOG: BeerCatalogEntry[] = [
  ...ATTACHED_BEER_LIST,
];
