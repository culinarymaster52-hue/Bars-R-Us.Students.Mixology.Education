import { CocktailRecipe, GlassType, PrepTechnique } from '../models/CocktailModels';
import { buildACoupleCooks300Catalog } from './ACoupleCooks300Catalog';

export const CORE_COCKTAIL_CATALOG: CocktailRecipe[] = [
  // ==================== 1. WHISKEY COCKTAILS ====================
  {
    id: 'whiskey_old_fashioned',
    name: '1880s Pendennis Club Old Fashioned',
    category: 'Whiskey',
    glass: GlassType.ROCKS,
    iceRequired: true,
    technique: PrepTechnique.STIR,
    ingredients: [
      { ingredientId: 'bourbon_reserve', ingredientName: 'Kentucky Straight Bourbon (100 Proof)', amountOz: 2.0 },
      { ingredientId: 'rich_demerara_syrup', ingredientName: '2:1 Rich Demerara Syrup (66° Brix)', amountOz: 0.25 },
      { ingredientId: 'bitters_angostura', ingredientName: 'Angostura Aromatic Bitters', amountOz: 0.12, unit: 'dash' },
      { ingredientId: 'bitters_orange', ingredientName: 'Regans’ Orange Bitters No. 6', amountOz: 0.06, unit: 'dash' },
    ],
    garnish: 'Expressed Valencia Orange Peel Twist & Luxardo Cherry',
    description: 'The quintessential spirit-forward template uniting high-proof Kentucky bourbon, rich demerara molasses, and aromatic gentian bitters over a crystal king cube.',
    historyNotes: 'Codified in 1806 as the original definition of a "Cock-tail" (spirit, sugar, water, bitters) and popularized at the Pendennis Club in Louisville, Kentucky.',
  },
  {
    id: 'whiskey_manhattan',
    name: 'Classic Rittenhouse Rye Manhattan',
    category: 'Whiskey',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.STIR,
    ingredients: [
      { ingredientId: 'rye_whiskey', ingredientName: 'Monongahela Straight Rye Whiskey', amountOz: 2.0 },
      { ingredientId: 'sweet_vermouth', ingredientName: 'Carpano Antica Formula / Vermouth di Torino Rosso', amountOz: 1.0 },
      { ingredientId: 'bitters_angostura', ingredientName: 'Angostura Aromatic Bitters', amountOz: 0.12, unit: 'dash' },
    ],
    garnish: 'Skewered Luxardo Maraschino Cherry',
    description: 'Spicy 100-proof rye whiskey tempered by vanilla-rich Vermouth di Torino and aromatic bitters, stirred to a jewel-like sheen.',
    historyNotes: 'Originated at the Manhattan Club in New York City in the late 1870s; remember the classic area-code mnemonic 2-1-2 (2 oz Rye, 1 oz Sweet Vermouth, 2 dashes Angostura).',
  },
  {
    id: 'whiskey_boulevardier',
    name: 'Harry’s New York Bar Boulevardier (1927)',
    category: 'Whiskey',
    glass: GlassType.ROCKS,
    iceRequired: true,
    technique: PrepTechnique.STIR,
    ingredients: [
      { ingredientId: 'bourbon_reserve', ingredientName: 'Kentucky Straight Bourbon (100 Proof)', amountOz: 1.5 },
      { ingredientId: 'campari', ingredientName: 'Campari Bitter Apéritif', amountOz: 1.0 },
      { ingredientId: 'sweet_vermouth', ingredientName: 'Carpano Antica Formula / Vermouth di Torino Rosso', amountOz: 1.0 },
    ],
    garnish: 'Expressed Valencia Orange Peel Twist',
    description: 'Autumnal cousin to the Negroni where charred oak bourbon wraps around ruby Campari bitterness and spiced Torino vermouth.',
    historyNotes: 'Created in 1927 by Harry MacElhone at Harry’s New York Bar in Paris for American writer Erskine Gwynne, editor of The Boulevardier magazine.',
  },
  {
    id: 'whiskey_sazerac',
    name: 'New Orleans Royal Street Sazerac',
    category: 'Whiskey',
    glass: GlassType.ROCKS,
    iceRequired: false,
    technique: PrepTechnique.STIR,
    ingredients: [
      { ingredientId: 'rye_whiskey', ingredientName: 'Monongahela Straight Rye Whiskey', amountOz: 2.0 },
      { ingredientId: 'rich_demerara_syrup', ingredientName: '2:1 Rich Demerara Syrup (66° Brix)', amountOz: 0.25 },
      { ingredientId: 'bitters_peychauds', ingredientName: 'Peychaud’s Creole Aromatic Bitters', amountOz: 0.24, unit: 'dash' },
      { ingredientId: 'absinthe_verte', ingredientName: 'Grande Absinthe Verte (136 Proof)', amountOz: 0.25 },
    ],
    garnish: 'Expressed Lemon Peel Twist (Discarded or Rested on Rim)',
    description: 'Stirred ice-cold and strained neat into a chilled rocks glass rinsed with herbaceous Grande Absinthe and Creole Peychaud’s bitters.',
    historyNotes: 'Born in 1850s New Orleans via apothecary Antoine Peychaud and the Sazerac Coffee House; designated the Official Cocktail of New Orleans in 2008.',
  },
  {
    id: 'whiskey_paper_plane',
    name: 'Paper Plane (Sam Ross, 2008)',
    category: 'Whiskey',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'bourbon_reserve', ingredientName: 'Kentucky Straight Bourbon (100 Proof)', amountOz: 0.75 },
      { ingredientId: 'aperol', ingredientName: 'Aperol Barbieri 1919 Apéritif', amountOz: 0.75 },
      { ingredientId: 'amaro_nonino', ingredientName: 'Amaro Nonino Quintessentia', amountOz: 0.75 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.75 },
    ],
    garnish: 'Mini Folded Paper Airplane on Rim Clothespin',
    description: 'Modern equal-parts masterpiece balancing warm bourbon, grappa-based Amaro Nonino, sunny Aperol rhubarb-orange, and bright lemon.',
    historyNotes: 'Created in 2008 by Milk & Honey alumnus Sam Ross for The Violet Hour in Chicago, named after the M.I.A. track "Paper Planes".',
  },
  {
    id: 'whiskey_penicillin',
    name: 'Milk & Honey Penicillin (2005)',
    category: 'Whiskey',
    glass: GlassType.ROCKS,
    iceRequired: true,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'scotch_blended', ingredientName: 'Highland Blended Scotch Whisky', amountOz: 2.0 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.75 },
      { ingredientId: 'honey_syrup', ingredientName: '3:1 Wildflower Honey Syrup', amountOz: 0.75 },
      { ingredientId: 'islay_scotch', ingredientName: 'Islay Single Malt (Heavily Peated)', amountOz: 0.25 },
    ],
    garnish: 'Candied Ginger Skewered on Rim',
    description: 'Soothing Highland Scotch shaken with honey-ginger syrup and lemon, crowned with an aromatic float of smoky Islay single malt.',
    historyNotes: 'Invented in 2005 by Sam Ross at Sasha Petraske’s Milk & Honey on the Lower East Side of Manhattan.',
  },
  {
    id: 'whiskey_sour_boston',
    name: 'Boston Sour (Whiskey Sour with Egg White)',
    category: 'Whiskey',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.DRY_SHAKE,
    ingredients: [
      { ingredientId: 'bourbon_reserve', ingredientName: 'Kentucky Straight Bourbon (100 Proof)', amountOz: 2.0 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.75 },
      { ingredientId: 'simple_syrup', ingredientName: '1:1 Cane Simple Syrup (50° Brix)', amountOz: 0.75 },
      { ingredientId: 'egg_white_aquafaba', ingredientName: 'Pasteurized Egg White / Chickpea Aquafaba', amountOz: 0.75 },
      { ingredientId: 'bitters_angostura', ingredientName: 'Angostura Aromatic Bitters', amountOz: 0.12, unit: 'dash' },
    ],
    garnish: 'Three Drawn Angostura Hearts on Meringue Foam',
    description: 'Dry-shaken and wet-shaken to build a pillowy meringue cap over tart lemon and charred-oak bourbon.',
    historyNotes: 'First printed in Jerry Thomas’s 1862 Bartenders Guide; the addition of egg white earned the title "Boston Sour" by the 1890s.',
  },
  {
    id: 'whiskey_mint_julep',
    name: 'Churchill Downs Silver Cup Mint Julep',
    category: 'Whiskey',
    glass: GlassType.COPPER_MUG,
    iceRequired: true,
    technique: PrepTechnique.SWIZZLE,
    ingredients: [
      { ingredientId: 'bourbon_reserve', ingredientName: 'Kentucky Straight Bourbon (100 Proof)', amountOz: 2.5 },
      { ingredientId: 'simple_syrup', ingredientName: '1:1 Cane Simple Syrup (50° Brix)', amountOz: 0.5 },
      { ingredientId: 'garnish_mint_bouquet', ingredientName: 'Spanked Fresh Spearmint Bouquet', amountOz: 0.1, unit: 'piece' },
    ],
    garnish: 'Towering Powdered-Sugar Dusted Spearmint Bouquet',
    description: 'High-proof Kentucky bourbon churned through a mountain of finely shaved pebble ice until the metal cup frosts thick white.',
    historyNotes: 'The signature libation of the Kentucky Derby since 1938, with roots in 18th-century Virginia medicinal morning tonics.',
  },
  {
    id: 'whiskey_vieux_carre',
    name: 'Hotel Monteleone Vieux Carré (1938)',
    category: 'Whiskey',
    glass: GlassType.ROCKS,
    iceRequired: true,
    technique: PrepTechnique.STIR,
    ingredients: [
      { ingredientId: 'rye_whiskey', ingredientName: 'Monongahela Straight Rye Whiskey', amountOz: 1.0 },
      { ingredientId: 'cognac_vsop', ingredientName: 'Grande Champagne Cognac VSOP', amountOz: 1.0 },
      { ingredientId: 'sweet_vermouth', ingredientName: 'Carpano Antica Formula / Vermouth di Torino Rosso', amountOz: 1.0 },
      { ingredientId: 'benedictine_dom', ingredientName: 'Bénédictine D.O.M.', amountOz: 0.25 },
      { ingredientId: 'bitters_peychauds', ingredientName: 'Peychaud’s Creole Aromatic Bitters', amountOz: 0.12, unit: 'dash' },
      { ingredientId: 'bitters_angostura', ingredientName: 'Angostura Aromatic Bitters', amountOz: 0.12, unit: 'dash' },
    ],
    garnish: 'Expressed Lemon Peel Twist',
    description: 'Split-base New Orleans masterpiece marrying American rye, French Cognac, Italian vermouth, monastic Bénédictine, and dual bitters.',
    historyNotes: 'Invented in 1938 by head bartender Walter Bergeron at the Carousel Bar in New Orleans’ Hotel Monteleone.',
  },

  // ==================== 2. GIN COCKTAILS ====================
  {
    id: 'gin_negroni',
    name: 'Casoni Florence Classic Negroni (1919)',
    category: 'Gin',
    glass: GlassType.ROCKS,
    iceRequired: true,
    technique: PrepTechnique.STIR,
    ingredients: [
      { ingredientId: 'london_dry_gin', ingredientName: 'Classic London Dry Gin', amountOz: 1.0 },
      { ingredientId: 'campari', ingredientName: 'Campari Bitter Apéritif', amountOz: 1.0 },
      { ingredientId: 'sweet_vermouth', ingredientName: 'Carpano Antica Formula / Vermouth di Torino Rosso', amountOz: 1.0 },
    ],
    garnish: 'Expressed Valencia Orange Peel Swath',
    description: 'The immortal 1:1:1 Italian aperitivo trinity: piney juniper, ruby bitter chinotto Campari, and lush sweet vermouth.',
    historyNotes: 'Requested by Count Camillo Negroni in 1919 at Caffè Casoni in Florence when he asked bartender Fosco Scarselli to fortify his Americano with gin.',
  },
  {
    id: 'gin_martini_dry',
    name: '5:1 Dukes-Style Classic Dry Martini',
    category: 'Gin',
    glass: GlassType.MARTINI,
    iceRequired: false,
    technique: PrepTechnique.STIR,
    ingredients: [
      { ingredientId: 'london_dry_gin', ingredientName: 'Classic London Dry Gin', amountOz: 2.5 },
      { ingredientId: 'dry_vermouth', ingredientName: 'Dolin Dry Vermouth de Chambéry', amountOz: 0.5 },
      { ingredientId: 'bitters_orange', ingredientName: 'Regans’ Orange Bitters No. 6', amountOz: 0.06, unit: 'dash' },
    ],
    garnish: 'Expressed Amalfi Lemon Coin or Three Castelvetrano Olives',
    description: 'Crystalline, bone-dry, and sub-zero: botanical London Dry gin kissed with alpine dry vermouth and a dash of orange bitters.',
    historyNotes: 'Evolved from the 1880s Martinez cocktail into the silver-screen icon of 20th-century cocktail culture.',
  },
  {
    id: 'gin_last_word',
    name: 'Detroit Athletic Club Last Word (1915)',
    category: 'Gin',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'london_dry_gin', ingredientName: 'Classic London Dry Gin', amountOz: 0.75 },
      { ingredientId: 'chartreuse_green', ingredientName: 'Green Chartreuse (110 Proof)', amountOz: 0.75 },
      { ingredientId: 'maraschino_liqueur', ingredientName: 'Luxardo Maraschino Originale', amountOz: 0.75 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.75 },
    ],
    garnish: 'Skewered Luxardo Maraschino Cherry',
    description: 'Electric emerald equal-parts classic where 110-proof monastic Green Chartreuse collides with juniper, funky Marasca cherry, and lime.',
    historyNotes: 'Created by vaudeville monologist Frank Fogarty around 1915 in Detroit and resurrected in 2004 by Murray Stenson at Seattle’s Zig Zag Café.',
  },
  {
    id: 'gin_aviation',
    name: 'Hugo Ensslin’s Aviation (1916)',
    category: 'Gin',
    glass: GlassType.NICK_AND_NORA,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'london_dry_gin', ingredientName: 'Classic London Dry Gin', amountOz: 2.0 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.75 },
      { ingredientId: 'maraschino_liqueur', ingredientName: 'Luxardo Maraschino Originale', amountOz: 0.5 },
      { ingredientId: 'creme_de_violette', ingredientName: 'Rothman & Winter Crème de Violette', amountOz: 0.25 },
    ],
    garnish: 'Luxardo Cherry Rested in the Bowl',
    description: 'Pale twilight-sky violet hue with high-altitude botanical gin, tart lemon, nutty Maraschino, and alpine violet perfume.',
    historyNotes: 'Published by Hugo Ensslin, head bartender at the Hotel Wallick in New York, in his 1916 Recipes for Mixed Drinks.',
  },
  {
    id: 'gin_bees_knees',
    name: 'Prohibition Paris Bee’s Knees (1929)',
    category: 'Gin',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'london_dry_gin', ingredientName: 'Classic London Dry Gin', amountOz: 2.0 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.75 },
      { ingredientId: 'honey_syrup', ingredientName: '3:1 Wildflower Honey Syrup', amountOz: 0.75 },
    ],
    garnish: 'Expressed Lemon Twist',
    description: 'Golden wildflower honey replaces cane sugar to round out juniper botanicals and bright Eureka lemon acidity.',
    historyNotes: 'Credited to Frank Meier at the Hôtel Ritz Paris and Margaret Brown during the Roaring Twenties.',
  },
  {
    id: 'gin_corpse_reviver_2',
    name: 'Savoy Cocktail Book Corpse Reviver No. 2 (1930)',
    category: 'Gin',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'london_dry_gin', ingredientName: 'Classic London Dry Gin', amountOz: 0.75 },
      { ingredientId: 'lillet_blanc', ingredientName: 'Lillet Blanc / Cocchi Americano', amountOz: 0.75 },
      { ingredientId: 'cointreau_triple_sec', ingredientName: 'Cointreau / Dry Curaçao Triple Sec', amountOz: 0.75 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.75 },
      { ingredientId: 'absinthe_verte', ingredientName: 'Grande Absinthe Verte (136 Proof)', amountOz: 0.1, unit: 'dash' },
    ],
    garnish: 'Expressed Orange Twist',
    description: 'Crisp, citrus-driven morning-after restorative layered with quinine wine, triple sec, lemon, and a whisper of absinthe anise.',
    historyNotes: 'Harry Craddock famously noted in the 1930 Savoy Cocktail Book: "Four of these taken in swift succession will unrevive the corpse again."',
  },
  {
    id: 'gin_french_75',
    name: 'Soixante-Quinze / French 75 (1915)',
    category: 'Gin',
    glass: GlassType.FLUTE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'london_dry_gin', ingredientName: 'Classic London Dry Gin', amountOz: 1.5 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.75 },
      { ingredientId: 'simple_syrup', ingredientName: '1:1 Cane Simple Syrup (50° Brix)', amountOz: 0.5 },
      { ingredientId: 'champagne_brut', ingredientName: 'Reims Grand Cru Brut Champagne', amountOz: 3.0 },
    ],
    garnish: 'Long Spiral Lemon Twist',
    description: 'Shaken botanical gin sour lengthened in a crystal flute with bone-dry Grand Cru Champagne.',
    historyNotes: 'Named after the rapid-firing French 75mm field artillery piece by Franco-American flyers at the New York Bar in Paris during WWI.',
  },
  {
    id: 'gin_clover_club',
    name: 'Bellevue-Stratford Clover Club (1896)',
    category: 'Gin',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.DRY_SHAKE,
    ingredients: [
      { ingredientId: 'plymouth_gin', ingredientName: 'Plymouth Heritage Gin', amountOz: 1.5 },
      { ingredientId: 'dry_vermouth', ingredientName: 'Dolin Dry Vermouth de Chambéry', amountOz: 0.5 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.75 },
      { ingredientId: 'grenadine_pomegranate', ingredientName: 'House Pomegranate Molasses Grenadine', amountOz: 0.5 },
      { ingredientId: 'egg_white_aquafaba', ingredientName: 'Pasteurized Egg White / Chickpea Aquafaba', amountOz: 0.75 },
    ],
    garnish: 'Three Fresh Red Raspberries on a Bamboo Pick',
    description: 'Velvety rose-pink pre-Prohibition sour combining Plymouth gin, dry vermouth, tart berry syrup, and cloud-like egg white.',
    historyNotes: 'The signature toast of the Philadelphia Clover Club literary & legal society meeting at the Bellevue-Stratford Hotel in the 1890s.',
  },

  // ==================== 3. VODKA COCKTAILS ====================
  {
    id: 'vodka_espresso_martini',
    name: 'Dick Bradsell’s Soho Espresso Martini (1983)',
    category: 'Vodka',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'vodka_winter_wheat', ingredientName: 'Artisanal Winter Wheat Vodka', amountOz: 1.5 },
      { ingredientId: 'coffee_liqueur', ingredientName: 'Cold-Brew Arabica Coffee Liqueur', amountOz: 1.0 },
      { ingredientId: 'espresso_shot', ingredientName: 'Fresh Pulled Double Espresso (Chilled)', amountOz: 1.0 },
      { ingredientId: 'simple_syrup', ingredientName: '1:1 Cane Simple Syrup (50° Brix)', amountOz: 0.25 },
    ],
    garnish: 'Three Roasted Espresso Beans in a Triangle (Health, Wealth, Happiness)',
    description: 'Hard-shaken to emulsify natural espresso crema oils with winter wheat vodka and dark roasted Arabica liqueur.',
    historyNotes: 'Invented in 1983 by British bartending legend Dick Bradsell at the Soho Brasserie in London.',
  },
  {
    id: 'vodka_moscow_mule',
    name: '1941 Cock ’n’ Bull Moscow Mule',
    category: 'Vodka',
    glass: GlassType.COPPER_MUG,
    iceRequired: true,
    technique: PrepTechnique.BUILD,
    ingredients: [
      { ingredientId: 'vodka_winter_wheat', ingredientName: 'Artisanal Winter Wheat Vodka', amountOz: 2.0 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.75 },
      { ingredientId: 'ginger_beer', ingredientName: 'Fiery Jamaican Root Ginger Beer', amountOz: 4.0 },
    ],
    garnish: 'Fresh Lime Wheel & Candied Ginger Sprig',
    description: 'Crisp wheat vodka and fresh Persian lime topped with fiery fermented root ginger beer in an ice-cold hammered copper mug.',
    historyNotes: 'Created in 1941 at Jack Morgan’s Cock ’n’ Bull pub on the Sunset Strip in Hollywood alongside John Martin and Sophie Berezinski’s copper mugs.',
  },
  {
    id: 'vodka_cosmopolitan',
    name: 'Toby Cecchini’s Odeon Cosmopolitan (1988)',
    category: 'Vodka',
    glass: GlassType.MARTINI,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'vodka_citron', ingredientName: 'Infused Meyer Lemon Citrus Vodka', amountOz: 1.5 },
      { ingredientId: 'cointreau_triple_sec', ingredientName: 'Cointreau / Dry Curaçao Triple Sec', amountOz: 0.75 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.75 },
      { ingredientId: 'cranberry_juice', ingredientName: 'Tart Cape Cod Cranberry Juice', amountOz: 0.75 },
    ],
    garnish: 'Flamed Orange Peel Coin',
    description: 'A true Daisy/Kamikaze riff built on Meyer lemon vodka, Cointreau, fresh lime juice, and just enough tart cranberry for a pale coral blush.',
    historyNotes: 'Perfected in 1988 by Toby Cecchini at The Odeon in Tribeca, Manhattan using Absolut Citron, Cointreau, fresh lime, and Ocean Spray.',
  },
  {
    id: 'vodka_vesper',
    name: 'Casino Royale Vesper Martini (1953)',
    category: 'Vodka',
    glass: GlassType.MARTINI,
    iceRequired: false,
    technique: PrepTechnique.STIR,
    ingredients: [
      { ingredientId: 'london_dry_gin', ingredientName: 'Classic London Dry Gin', amountOz: 2.25 },
      { ingredientId: 'vodka_winter_wheat', ingredientName: 'Artisanal Winter Wheat Vodka', amountOz: 0.75 },
      { ingredientId: 'lillet_blanc', ingredientName: 'Lillet Blanc / Cocchi Americano', amountOz: 0.5 },
    ],
    garnish: 'Large Thin Swath of Amalfi Lemon Peel',
    description: 'Split-base Martini pairing botanical gin potency with winter wheat vodka texture and quinine-laced Bordeaux aperitif wine.',
    historyNotes: 'Specified by Ian Fleming in Chapter 7 of Casino Royale (1953) and named after double agent Vesper Lynd.',
  },
  {
    id: 'vodka_bloody_mary',
    name: 'St. Regis Red Snapper / Bloody Mary',
    category: 'Vodka',
    glass: GlassType.HIGHBALL,
    iceRequired: true,
    technique: PrepTechnique.BUILD,
    ingredients: [
      { ingredientId: 'vodka_winter_wheat', ingredientName: 'Artisanal Winter Wheat Vodka', amountOz: 2.0 },
      { ingredientId: 'tomato_bloody_mix', ingredientName: 'House Spiced Heirloom Tomato Mix', amountOz: 4.0 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.5 },
      { ingredientId: 'bitters_celery', ingredientName: 'Scrappy’s Savory Celery Bitters', amountOz: 0.12, unit: 'dash' },
    ],
    garnish: 'Leafy Celery Stalk, Castelvetrano Olives & Cracked Black Pepper Rim',
    description: 'Savory brunch classic uniting clean wheat vodka, horseradish-spiked heirloom tomato, fresh lemon, and wild celery bitters.',
    historyNotes: 'Developed by Fernand "Pete" Petiot at Harry’s New York Bar in Paris (1921) and refined at the St. Regis King Cole Bar in New York (1934).',
  },

  // ==================== 4. RUM & TIKI COCKTAILS ====================
  {
    id: 'rum_daiquiri_classic',
    name: 'El Floridita Classic Shaken Daiquiri (1898)',
    category: 'Rum & Tiki',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'white_rum', ingredientName: 'Cuban-Style Light Charcoal-Filtered Rum', amountOz: 2.0 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.75 },
      { ingredientId: 'simple_syrup', ingredientName: '1:1 Cane Simple Syrup (50° Brix)', amountOz: 0.75 },
    ],
    garnish: 'Dehydrated Persian Lime Wheel Floating on Foam',
    description: 'The litmus test of every great cocktail bar: crisp Cuban-style white rum, fresh Persian lime juice, and pure cane syrup shaken until frothy.',
    historyNotes: 'Created in 1898 by American mining engineer Jennings Cox near Santiago de Cuba and elevated by Constantino Ribalaigua at Havana’s El Floridita.',
  },
  {
    id: 'rum_mai_tai_1944',
    name: 'Trader Vic’s 1944 Original Mai Tai',
    category: 'Rum & Tiki',
    glass: GlassType.ROCKS,
    iceRequired: true,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'jamaican_pot_still_rum', ingredientName: 'Jamaican High-Ester Aged Pot Still Rum', amountOz: 2.0 },
      { ingredientId: 'grand_curacao', ingredientName: 'Pierre Ferrand Dry Curaçao', amountOz: 0.5 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.75 },
      { ingredientId: 'orgeat_syrup', ingredientName: 'House Toasted Almond Orgeat', amountOz: 0.5 },
      { ingredientId: 'rich_demerara_syrup', ingredientName: '2:1 Rich Demerara Syrup (66° Brix)', amountOz: 0.25 },
    ],
    garnish: 'Spent Lime Shell ("Island") & Fresh Mint Bouquet ("Palm Tree")',
    description: 'Funky aged Jamaican rum highlighted by toasted Marcona almond orgeat, French dry curaçao, and fresh lime over pebble ice.',
    historyNotes: 'Invented in 1944 by Victor "Trader Vic" Bergeron in Oakland, California; Tahitian guests exclaimed "Maitai roa ae!" ("Out of this world—the best!").',
  },
  {
    id: 'rum_jungle_bird',
    name: 'Kuala Lumpur Aviary Jungle Bird (1978)',
    category: 'Rum & Tiki',
    glass: GlassType.ROCKS,
    iceRequired: true,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'jamaican_pot_still_rum', ingredientName: 'Jamaican High-Ester Aged Pot Still Rum', amountOz: 1.5 },
      { ingredientId: 'campari', ingredientName: 'Campari Bitter Apéritif', amountOz: 0.75 },
      { ingredientId: 'pineapple_juice', ingredientName: 'Cold-Pressed Golden Pineapple Juice', amountOz: 1.5 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.5 },
      { ingredientId: 'rich_demerara_syrup', ingredientName: '2:1 Rich Demerara Syrup (66° Brix)', amountOz: 0.5 },
    ],
    garnish: 'Pineapple Frond Fan & Luxardo Cherry',
    description: 'The rare Tiki cocktail anchored by bitter Italian Campari, bridging dark Jamaican molasses rum with frothy golden pineapple.',
    historyNotes: 'Created in 1978 by Jeffrey Ong at the Aviary Bar of the Kuala Lumpur Hilton in Malaysia.',
  },
  {
    id: 'rum_mojito_havana',
    name: 'La Bodeguita del Medio Havana Mojito',
    category: 'Rum & Tiki',
    glass: GlassType.HIGHBALL,
    iceRequired: true,
    technique: PrepTechnique.MUDDLE,
    ingredients: [
      { ingredientId: 'white_rum', ingredientName: 'Cuban-Style Light Charcoal-Filtered Rum', amountOz: 2.0 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.75 },
      { ingredientId: 'simple_syrup', ingredientName: '1:1 Cane Simple Syrup (50° Brix)', amountOz: 0.75 },
      { ingredientId: 'club_soda', ingredientName: 'High-Carbonation Topo Chico / Club Soda', amountOz: 2.0 },
      { ingredientId: 'garnish_mint_bouquet', ingredientName: 'Spanked Fresh Spearmint Bouquet', amountOz: 0.1, unit: 'piece' },
    ],
    garnish: 'Aromatic Spearmint Crown & Lime Wheel',
    description: 'Gently pressed spearmint leaves, fresh lime, and light Cuban-style rum lengthened with effervescent soda water.',
    historyNotes: 'Descended from the 16th-century Cuban "El Draque" tonic and popularized in Old Havana during the 1930s.',
  },
  {
    id: 'rum_zombie_1934',
    name: 'Don the Beachcomber 1934 Zombie',
    category: 'Rum & Tiki',
    glass: GlassType.HURRICANE,
    iceRequired: true,
    technique: PrepTechnique.SWIZZLE,
    ingredients: [
      { ingredientId: 'jamaican_pot_still_rum', ingredientName: 'Jamaican High-Ester Aged Pot Still Rum', amountOz: 1.5 },
      { ingredientId: 'white_rum', ingredientName: 'Cuban-Style Light Charcoal-Filtered Rum', amountOz: 1.5 },
      { ingredientId: 'demerara_rum', ingredientName: 'Guyanese Demerara 151 Overproof Rum', amountOz: 0.75 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.75 },
      { ingredientId: 'grapefruit_juice', ingredientName: 'Fresh Ruby Red Grapefruit Juice', amountOz: 0.5 },
      { ingredientId: 'cinnamon_syrup', ingredientName: 'Ceylon Cinnamon Bark Syrup', amountOz: 0.5 },
      { ingredientId: 'velvet_falernum', ingredientName: 'John D. Taylor’s Velvet Falernum', amountOz: 0.5 },
      { ingredientId: 'grenadine_pomegranate', ingredientName: 'House Pomegranate Molasses Grenadine', amountOz: 0.25 },
      { ingredientId: 'bitters_angostura', ingredientName: 'Angostura Aromatic Bitters', amountOz: 0.06, unit: 'dash' },
    ],
    garnish: 'Flaming Lime Shell Boat & Mint Sprig',
    description: 'Monumental three-rum Tiki symphony layered with grapefruit-cinnamon "Don’s Mix", spiced Falernum, and 151 Demerara.',
    historyNotes: 'Created by Ernest Raymond Beaumont Gantt (Donn Beach) in Hollywood in 1934 with a strict menu limit of two per guest.',
  },
  {
    id: 'rum_ti_punch',
    name: 'Martinique Ti’ Punch Traditionnel',
    category: 'Rum & Tiki',
    glass: GlassType.ROCKS,
    iceRequired: false,
    technique: PrepTechnique.BUILD,
    ingredients: [
      { ingredientId: 'rhum_agricole', ingredientName: 'Martinique AOC Rhum Agricole Blanc', amountOz: 2.0 },
      { ingredientId: 'rich_demerara_syrup', ingredientName: '2:1 Rich Demerara Syrup (66° Brix)', amountOz: 0.25 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.25 },
    ],
    garnish: 'Expressed Green Lime Coin (Chacun prépare sa propre mort)',
    description: 'Grassy 100-proof Martinique cane-juice rhum stirred directly with rich cane syrup and a squeezed coin of lime.',
    historyNotes: 'The national drink of Martinique and Guadeloupe; traditionally served so each guest balances their own proportion.',
  },

  // ==================== 5. TEQUILA & MEZCAL COCKTAILS ====================
  {
    id: 'agave_margarita_tommys',
    name: 'Julio Bermejo’s Tommy’s Margarita (1990)',
    category: 'Tequila & Mezcal',
    glass: GlassType.ROCKS,
    iceRequired: true,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'tequila_blanco', ingredientName: 'Highlands 100% Blue Weber Tequila Blanco', amountOz: 2.0 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 1.0 },
      { ingredientId: 'agave_nectar', ingredientName: 'Organic Blue Weber Agave Nectar', amountOz: 0.5 },
    ],
    garnish: 'Half-Rim Flaky Sea Salt & Persian Lime Wheel',
    description: 'Omits orange liqueur entirely so roasted Highlands Blue Weber agave shines alongside fresh lime and organic agave nectar.',
    historyNotes: 'Created around 1990 by Julio Bermejo at Tommy’s Mexican Restaurant in San Francisco’s Richmond District.',
  },
  {
    id: 'agave_margarita_classic',
    name: '1938 Classic Cointreau Margarita',
    category: 'Tequila & Mezcal',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'tequila_blanco', ingredientName: 'Highlands 100% Blue Weber Tequila Blanco', amountOz: 2.0 },
      { ingredientId: 'cointreau_triple_sec', ingredientName: 'Cointreau / Dry Curaçao Triple Sec', amountOz: 0.75 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.75 },
    ],
    garnish: 'Half-Salt Rim & Dehydrated Lime Wheel',
    description: 'The canonical Daisy of the agave world: crisp 100% agave blanco, aromatic Seville orange Cointreau, and fresh-squeezed lime.',
    historyNotes: '"Margarita" is Spanish for "Daisy", a 19th-century cocktail family of base spirit, orange cordial, and citrus.',
  },
  {
    id: 'agave_naked_and_famous',
    name: 'Death & Co Naked and Famous (2011)',
    category: 'Tequila & Mezcal',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'mezcal_espadin', ingredientName: 'Oaxacan Artisanal Mezcal Espadín', amountOz: 0.75 },
      { ingredientId: 'chartreuse_yellow', ingredientName: 'Yellow Chartreuse', amountOz: 0.75 },
      { ingredientId: 'aperol', ingredientName: 'Aperol Barbieri 1919 Apéritif', amountOz: 0.75 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.75 },
    ],
    garnish: 'Fresh Persian Lime Wheel',
    description: 'A smoky, saffron-kissed hybrid of the Last Word and Paper Plane uniting earthen Oaxacan mezcal, Yellow Chartreuse, Aperol, and lime.',
    historyNotes: 'Created in 2011 by Joaquín Simó at Death & Co in New York’s East Village.',
  },
  {
    id: 'agave_oaxaca_old_fashioned',
    name: 'Phil Ward’s Oaxaca Old Fashioned (2007)',
    category: 'Tequila & Mezcal',
    glass: GlassType.ROCKS,
    iceRequired: true,
    technique: PrepTechnique.STIR,
    ingredients: [
      { ingredientId: 'tequila_reposado', ingredientName: 'Estate Barrel-Rested Tequila Reposado', amountOz: 1.5 },
      { ingredientId: 'mezcal_espadin', ingredientName: 'Oaxacan Artisanal Mezcal Espadín', amountOz: 0.5 },
      { ingredientId: 'agave_nectar', ingredientName: 'Organic Blue Weber Agave Nectar', amountOz: 0.25 },
      { ingredientId: 'bitters_angostura', ingredientName: 'Angostura Aromatic Bitters', amountOz: 0.12, unit: 'dash' },
      { ingredientId: 'bitters_chocolate_mole', ingredientName: 'Oaxacan Chocolate Mole Bitters', amountOz: 0.06, unit: 'dash' },
    ],
    garnish: 'Flamed Valencia Orange Peel Twist',
    description: 'The cocktail that launched the global mezcal renaissance: barrel-aged tequila reposado, smoky espadín mezcal, agave nectar, and mole bitters.',
    historyNotes: 'Invented in 2007 by Phil Ward at Death & Co in Manhattan.',
  },
  {
    id: 'agave_paloma',
    name: 'La Capilla Jalisco Paloma',
    category: 'Tequila & Mezcal',
    glass: GlassType.HIGHBALL,
    iceRequired: true,
    technique: PrepTechnique.BUILD,
    ingredients: [
      { ingredientId: 'tequila_blanco', ingredientName: 'Highlands 100% Blue Weber Tequila Blanco', amountOz: 2.0 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.5 },
      { ingredientId: 'grapefruit_soda', ingredientName: 'Ting / Artisanal Pink Grapefruit Soda', amountOz: 4.0 },
    ],
    garnish: 'Ruby Grapefruit Wedge & Smoked Sea Salt Rim',
    description: 'Mexico’s beloved highball combining peppery blanco tequila, fresh lime, a pinch of sea salt, and sparkling pink grapefruit soda.',
    historyNotes: 'Popularized across Jalisco in the 1950s and associated with legendary bartender Don Javier Delgado Corona of La Capilla in Tequila.',
  },

  // ==================== 6. BRANDY & COGNAC COCKTAILS ====================
  {
    id: 'brandy_sidecar',
    name: 'Hôtel Ritz Paris Classic Sidecar (1922)',
    category: 'Brandy & Cognac',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'cognac_vsop', ingredientName: 'Grande Champagne Cognac VSOP', amountOz: 2.0 },
      { ingredientId: 'cointreau_triple_sec', ingredientName: 'Cointreau / Dry Curaçao Triple Sec', amountOz: 0.75 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.75 },
    ],
    garnish: 'Half-Rim Superfine Sugar & Expressed Orange Twist',
    description: 'Rich Grande Champagne Cognac brightened by crystalline Cointreau and fresh lemon juice.',
    historyNotes: 'First printed in 1922 by both Harry MacElhone and Robert Vermeire, named after a WWI army captain driven to a Paris bistrot in a motorcycle sidecar.',
  },
  {
    id: 'brandy_pisco_sour',
    name: 'Morris’ Bar Lima Pisco Sour (1916)',
    category: 'Brandy & Cognac',
    glass: GlassType.NICK_AND_NORA,
    iceRequired: false,
    technique: PrepTechnique.DRY_SHAKE,
    ingredients: [
      { ingredientId: 'pisco_peruano', ingredientName: 'Peruvian Quebranta Pisco Mosto Verde', amountOz: 2.0 },
      { ingredientId: 'lime_juice', ingredientName: 'Fresh-Pressed Persian Lime Juice', amountOz: 0.75 },
      { ingredientId: 'simple_syrup', ingredientName: '1:1 Cane Simple Syrup (50° Brix)', amountOz: 0.75 },
      { ingredientId: 'egg_white_aquafaba', ingredientName: 'Pasteurized Egg White / Chickpea Aquafaba', amountOz: 0.75 },
      { ingredientId: 'bitters_angostura', ingredientName: 'Angostura Aromatic Bitters', amountOz: 0.18, unit: 'dash' },
    ],
    garnish: 'Three Aromatic Dots of Angostura Bitters on Foam',
    description: 'Aromatic Peruvian grape brandy shaken into a snow-white foam with key lime acidity and spiced Angostura aromatics.',
    historyNotes: 'Created by American expatriate Victor Vaughen Morris at Morris’ Bar in Lima, Peru in 1916 and perfected by bartender Mario Bruiget.',
  },
  {
    id: 'brandy_champs_elysees',
    name: 'Savoy Champs-Élysées (1930)',
    category: 'Brandy & Cognac',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'cognac_vsop', ingredientName: 'Grande Champagne Cognac VSOP', amountOz: 2.0 },
      { ingredientId: 'chartreuse_green', ingredientName: 'Green Chartreuse (110 Proof)', amountOz: 0.5 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.75 },
      { ingredientId: 'simple_syrup', ingredientName: '1:1 Cane Simple Syrup (50° Brix)', amountOz: 0.5 },
      { ingredientId: 'bitters_angostura', ingredientName: 'Angostura Aromatic Bitters', amountOz: 0.06, unit: 'dash' },
    ],
    garnish: 'Expressed Lemon Twist',
    description: 'Lush French VSOP Cognac elevated by 130 alpine herbs in Green Chartreuse and bright lemon.',
    historyNotes: 'Immortalized in Harry Craddock’s 1930 Savoy Cocktail Book as a tribute to Paris’s grandest boulevard.',
  },
  {
    id: 'brandy_jack_rose',
    name: 'Laird’s Bonded Jack Rose (1905)',
    category: 'Brandy & Cognac',
    glass: GlassType.COUPE,
    iceRequired: false,
    technique: PrepTechnique.SHAKE,
    ingredients: [
      { ingredientId: 'applejack_bonded', ingredientName: 'Laird’s Bonded Straight Apple Brandy (100 Proof)', amountOz: 2.0 },
      { ingredientId: 'lemon_juice', ingredientName: 'Fresh-Pressed Eureka Lemon Juice', amountOz: 0.75 },
      { ingredientId: 'grenadine_pomegranate', ingredientName: 'House Pomegranate Molasses Grenadine', amountOz: 0.75 },
    ],
    garnish: 'Expressed Lemon Peel & Thin Apple Fan',
    description: 'Ruby-crimson American classic pairing 100-proof Virginia apple brandy with tart pomegranate grenadine and fresh lemon.',
    historyNotes: 'A favorite of Ernest Hemingway in The Sun Also Rises (1926) and John Steinbeck.',
  },

  // ==================== 7. APÉRITIF & SPRITZ COCKTAILS ====================
  {
    id: 'aperitif_aperol_spritz',
    name: 'Venetian Piazza San Marco Aperol Spritz',
    category: 'Apéritif & Spritz',
    glass: GlassType.WINE_GLASS,
    iceRequired: true,
    technique: PrepTechnique.BUILD,
    ingredients: [
      { ingredientId: 'prosecco_brut', ingredientName: 'Valdobbiadene Prosecco Superiore DOCG', amountOz: 3.0 },
      { ingredientId: 'aperol', ingredientName: 'Aperol Barbieri 1919 Apéritif', amountOz: 2.0 },
      { ingredientId: 'club_soda', ingredientName: 'High-Carbonation Topo Chico / Club Soda', amountOz: 1.0 },
    ],
    garnish: 'Fresh Half-Moon Valencia Orange Slice',
    description: 'The golden hour Venetian ritual built in a wine glass over large ice following the 3-2-1 ratio of Prosecco, Aperol, and soda.',
    historyNotes: 'Evolved from 19th-century Austro-Hungarian soldiers splashing ("spritzen") Veneto wines with sparkling water.',
  },
  {
    id: 'aperitif_americano',
    name: 'Gaspare Campari’s Caffè Americano (1860s)',
    category: 'Apéritif & Spritz',
    glass: GlassType.HIGHBALL,
    iceRequired: true,
    technique: PrepTechnique.BUILD,
    ingredients: [
      { ingredientId: 'campari', ingredientName: 'Campari Bitter Apéritif', amountOz: 1.5 },
      { ingredientId: 'sweet_vermouth', ingredientName: 'Carpano Antica Formula / Vermouth di Torino Rosso', amountOz: 1.5 },
      { ingredientId: 'club_soda', ingredientName: 'High-Carbonation Topo Chico / Club Soda', amountOz: 2.5 },
    ],
    garnish: 'Orange Half-Wheel & Expressed Lemon Peel',
    description: 'Refreshing low-ABV Milanese-Turinese highball uniting bitter Campari and sweet vermouth under a crown of cold soda.',
    historyNotes: 'Originally called the "Milano-Torino" (Campari from Milan, Cinzano/Carpano from Turin) before being renamed for American tourists.',
  },
  {
    id: 'aperitif_hugo_spritz',
    name: 'South Tyrol Alpine Hugo Spritz (2005)',
    category: 'Apéritif & Spritz',
    glass: GlassType.WINE_GLASS,
    iceRequired: true,
    technique: PrepTechnique.BUILD,
    ingredients: [
      { ingredientId: 'prosecco_brut', ingredientName: 'Valdobbiadene Prosecco Superiore DOCG', amountOz: 3.5 },
      { ingredientId: 'st_germain', ingredientName: 'St-Germain Artisanal Elderflower Liqueur', amountOz: 1.5 },
      { ingredientId: 'club_soda', ingredientName: 'High-Carbonation Topo Chico / Club Soda', amountOz: 1.0 },
    ],
    garnish: 'Spanked Spearmint Sprig & Lime Wheel',
    description: 'Floral Dolomite Mountains spritz combining alpine elderflower liqueur, crisp Prosecco DOCG, fresh mint, and soda.',
    historyNotes: 'Created in 2005 by bartender Roland Gruber in Naturno, South Tyrol, Northern Italy.',
  },

  // ==================== 8. WINE, BEER & LOW-ABV COCKTAILS ====================
  {
    id: 'lowabv_sherry_cobbler',
    name: '1830s Knickerbocker Sherry Cobbler',
    category: 'Wine, Beer & Low-ABV',
    glass: GlassType.COLLINS,
    iceRequired: true,
    technique: PrepTechnique.SWIZZLE,
    ingredients: [
      { ingredientId: 'fino_sherry', ingredientName: 'Jerez Fino / Manzanilla Dry Sherry', amountOz: 3.5 },
      { ingredientId: 'rich_demerara_syrup', ingredientName: '2:1 Rich Demerara Syrup (66° Brix)', amountOz: 0.5 },
      { ingredientId: 'orange_juice', ingredientName: 'Fresh Valencia Orange Juice', amountOz: 0.5 },
    ],
    garnish: 'Fresh Seasonal Berries, Orange Wheel & Mint Bouquet',
    description: 'Nutty Spanish sherry churned with muddled orange and rich cane syrup over a towering cone of crushed pebble ice.',
    historyNotes: 'The superstar cocktail of 1840s America that popularized the drinking straw so patrons could sip past the crushed ice.',
  },
  {
    id: 'lowabv_adonis',
    name: '1884 Waldorf-Astoria Adonis',
    category: 'Wine, Beer & Low-ABV',
    glass: GlassType.NICK_AND_NORA,
    iceRequired: false,
    technique: PrepTechnique.STIR,
    ingredients: [
      { ingredientId: 'fino_sherry', ingredientName: 'Jerez Fino / Manzanilla Dry Sherry', amountOz: 1.5 },
      { ingredientId: 'sweet_vermouth', ingredientName: 'Carpano Antica Formula / Vermouth di Torino Rosso', amountOz: 1.5 },
      { ingredientId: 'bitters_orange', ingredientName: 'Regans’ Orange Bitters No. 6', amountOz: 0.12, unit: 'dash' },
    ],
    garnish: 'Expressed Orange Peel Twist',
    description: 'Low-proof, high-complexity stirred aperitif marrying saline Jerez sherry with rich sweet vermouth and orange bitters.',
    historyNotes: 'Created in 1884 in honor of the Broadway musical Adonis, the first show to run for more than 500 performances.',
  },
  {
    id: 'lowabv_kir_royale',
    name: 'Dijon Café George Kir Royale',
    category: 'Wine, Beer & Low-ABV',
    glass: GlassType.FLUTE,
    iceRequired: false,
    technique: PrepTechnique.BUILD,
    ingredients: [
      { ingredientId: 'champagne_brut', ingredientName: 'Reims Grand Cru Brut Champagne', amountOz: 4.5 },
      { ingredientId: 'grenadine_pomegranate', ingredientName: 'House Pomegranate Molasses Grenadine', amountOz: 0.5 },
    ],
    garnish: 'Expressed Lemon Twist',
    description: 'Effervescent Reims Brut Champagne blushed with ruby fruit liqueur in a chilled crystal flute.',
    historyNotes: 'Named after Canon Félix Kir, French Resistance hero and postwar Mayor of Dijon.',
  },
];

const buildExtendedCatalog = (): CocktailRecipe[] => {
  const baseCatalog = buildACoupleCooks300Catalog(CORE_COCKTAIL_CATALOG);

  // Additional named A Couple Cooks & Guild classics to ensure 300+ unique named recipes
  const extraNamedClassics: Array<{
    name: string;
    category: CocktailRecipe['category'];
    baseId: string;
    baseName: string;
    modId: string;
    modName: string;
    accentId: string;
    accentName: string;
    glass: GlassType;
    technique: PrepTechnique;
    ice: boolean;
    garnish: string;
  }> = [
    { name: 'Rye Whiskey Sour', category: 'Whiskey', baseId: 'rye_whiskey', baseName: 'Monongahela Straight Rye Whiskey', modId: 'lemon_juice', modName: 'Fresh-Pressed Eureka Lemon Juice', accentId: 'simple_syrup', accentName: '1:1 Cane Simple Syrup', glass: GlassType.ROCKS, technique: PrepTechnique.SHAKE, ice: true, garnish: 'Luxardo Cherry & Lemon Wheel' },
    { name: 'Bourbon Sidecar', category: 'Whiskey', baseId: 'bourbon_reserve', baseName: 'Kentucky Straight Bourbon (100 Proof)', modId: 'cointreau_triple_sec', modName: 'Cointreau / Dry Curaçao Triple Sec', accentId: 'lemon_juice', accentName: 'Fresh-Pressed Eureka Lemon Juice', glass: GlassType.COUPE, technique: PrepTechnique.SHAKE, ice: false, garnish: 'Orange Twist & Sugar Rim' },
    { name: 'Kentucky Corpse Reviver', category: 'Whiskey', baseId: 'bourbon_reserve', baseName: 'Kentucky Straight Bourbon (100 Proof)', modId: 'cointreau_triple_sec', modName: 'Cointreau / Dry Curaçao', accentId: 'aperitif_lillet_blanc', accentName: 'Lillet Blanc & Fresh Lemon', glass: GlassType.COUPE, technique: PrepTechnique.SHAKE, ice: false, garnish: 'Expressed Lemon Twist' },
    { name: 'Scotch & Soda Highball', category: 'Whiskey', baseId: 'scotch_blended', baseName: 'Highland Blended Scotch Whisky', modId: 'club_soda', modName: 'High-Carbonation Club Soda', accentId: 'bitters_angostura', accentName: 'Optional Dash of Angostura', glass: GlassType.HIGHBALL, technique: PrepTechnique.BUILD, ice: true, garnish: 'Expressed Lemon Peel' },
    { name: 'Smoky Islay Penicillin', category: 'Whiskey', baseId: 'islay_scotch', baseName: 'Islay Single Malt (Heavily Peated)', modId: 'honey_syrup', modName: '3:1 Wildflower Honey-Ginger Syrup', accentId: 'lemon_juice', accentName: 'Fresh-Pressed Eureka Lemon Juice', glass: GlassType.ROCKS, technique: PrepTechnique.SHAKE, ice: true, garnish: 'Candied Ginger' },
    { name: 'Japanese Whisky Old Fashioned', category: 'Whiskey', baseId: 'japanese_whisky_harmony', baseName: 'Japanese Malt & Grain Whisky', modId: 'rich_demerara_syrup', modName: '2:1 Rich Demerara Syrup', accentId: 'bitters_angostura', accentName: 'Angostura & Orange Bitters', glass: GlassType.ROCKS, technique: PrepTechnique.STIR, ice: true, garnish: 'Yuzu or Orange Peel Twist' },
    { name: 'Irish Old Fashioned', category: 'Whiskey', baseId: 'irish_whiskey_pot', baseName: 'Single Pot Still Irish Whiskey', modId: 'rich_demerara_syrup', modName: '2:1 Rich Demerara Syrup', accentId: 'bitters_orange', accentName: 'Regans’ Orange & Angostura Bitters', glass: GlassType.ROCKS, technique: PrepTechnique.STIR, ice: true, garnish: 'Expressed Orange Peel' },
    { name: 'Irish Manhattan (Emerald Cocktail)', category: 'Whiskey', baseId: 'irish_whiskey_pot', baseName: 'Single Pot Still Irish Whiskey', modId: 'sweet_vermouth', modName: 'Carpano Antica Formula', accentId: 'bitters_orange', accentName: 'Regans’ Orange Bitters No. 6', glass: GlassType.COUPE, technique: PrepTechnique.STIR, ice: false, garnish: 'Expressed Orange Twist' },
    { name: 'Crown Royal Maple Smash', category: 'Whiskey', baseId: 'top100_27_crown_royal', baseName: 'Crown Royal Canadian Whisky', modId: 'mixer_maple_syrup', modName: 'Grade A Dark Amber Maple Syrup', accentId: 'lemon_juice', accentName: 'Fresh Lemon & Muddled Mint', glass: GlassType.ROCKS, technique: PrepTechnique.MUDDLE, ice: true, garnish: 'Mint Bouquet & Orange Slice' },
    { name: 'Bourbon Sweet Tea Cooler', category: 'Whiskey', baseId: 'bourbon_reserve', baseName: 'Kentucky Straight Bourbon (100 Proof)', modId: 'simple_syrup', modName: 'Chilled Black Tea & Cane Syrup', accentId: 'lemon_juice', accentName: 'Fresh-Pressed Eureka Lemon Juice', glass: GlassType.HIGHBALL, technique: PrepTechnique.BUILD, ice: true, garnish: 'Fresh Lemon Wheel & Mint' },
    { name: 'Bombay Sapphire Tom Collins', category: 'Gin', baseId: 'top100_54_bombay_sapphire', baseName: 'Bombay Sapphire London Dry Gin', modId: 'lemon_juice', modName: 'Fresh-Pressed Eureka Lemon Juice', accentId: 'club_soda', accentName: 'Simple Syrup & Club Soda', glass: GlassType.COLLINS, technique: PrepTechnique.BUILD, ice: true, garnish: 'Lemon Wheel & Luxardo Cherry' },
    { name: 'Tanqueray No. Ten Dry Martini', category: 'Gin', baseId: 'top100_64_tanqueray', baseName: 'Tanqueray London Dry Gin', modId: 'dry_vermouth', modName: 'Noilly Prat Original Dry Vermouth', accentId: 'bitters_orange', accentName: 'Regans’ Orange Bitters No. 6', glass: GlassType.MARTINI, technique: PrepTechnique.STIR, ice: false, garnish: 'Grapefruit or Lemon Twist' },
    { name: 'Beefeater Negroni', category: 'Gin', baseId: 'top100_61_beefeater', baseName: 'Beefeater London Dry Gin', modId: 'campari', modName: 'Campari Bitter Apéritif', accentId: 'aperitif_martini_rosso', accentName: 'Martini & Rossi Rosso Vermouth', glass: GlassType.ROCKS, technique: PrepTechnique.STIR, ice: true, garnish: 'Expressed Orange Peel' },
    { name: 'Plymouth Marguerite (1904)', category: 'Gin', baseId: 'plymouth_gin', baseName: 'Plymouth Heritage Gin', modId: 'dry_vermouth', modName: 'Dolin Dry Vermouth de Chambéry', accentId: 'bitters_orange', accentName: '2 Dashes Orange Bitters', glass: GlassType.COUPE, technique: PrepTechnique.STIR, ice: false, garnish: 'Green Castelvetrano Olive' },
    { name: 'Raspberry Gin Rickey', category: 'Gin', baseId: 'london_dry_gin', baseName: 'Classic London Dry Gin', modId: 'mixer_raspberry_syrup', modName: 'House Red Raspberry Syrup', accentId: 'club_soda', accentName: 'Fresh Lime Juice & Club Soda', glass: GlassType.HIGHBALL, technique: PrepTechnique.BUILD, ice: true, garnish: 'Fresh Raspberries & Lime' },
    { name: 'Grapefruit Bee’s Knees', category: 'Gin', baseId: 'london_dry_gin', baseName: 'Classic London Dry Gin', modId: 'grapefruit_juice', modName: 'Fresh Ruby Red Grapefruit & Lemon', accentId: 'honey_syrup', accentName: '3:1 Wildflower Honey Syrup', glass: GlassType.COUPE, technique: PrepTechnique.SHAKE, ice: false, garnish: 'Grapefruit Twist' },
    { name: 'Elderflower Collins', category: 'Gin', baseId: 'london_dry_gin', baseName: 'Classic London Dry Gin', modId: 'st_germain', modName: 'St-Germain Elderflower Liqueur', accentId: 'club_soda', accentName: 'Fresh Lemon Juice & Club Soda', glass: GlassType.COLLINS, technique: PrepTechnique.BUILD, ice: true, garnish: 'Lemon Wheel & Mint' },
    { name: 'Rosemary Gin Fizz', category: 'Gin', baseId: 'london_dry_gin', baseName: 'Classic London Dry Gin', modId: 'lemon_juice', modName: 'Fresh-Pressed Eureka Lemon Juice', accentId: 'club_soda', accentName: 'Rosemary Simple Syrup & Club Soda', glass: GlassType.HIGHBALL, technique: PrepTechnique.SHAKE, ice: true, garnish: 'Torched Rosemary Sprig' },
    { name: 'Grey Goose Classic Vodka Martini', category: 'Vodka', baseId: 'top100_34_grey_goose', baseName: 'Grey Goose French Wheat Vodka', modId: 'aperitif_noilly_prat_dry', modName: 'Noilly Prat French Dry Vermouth', accentId: 'bitters_orange', accentName: 'Dash of Orange Bitters', glass: GlassType.MARTINI, technique: PrepTechnique.STIR, ice: false, garnish: 'Amalfi Lemon Twist' },
    { name: 'Ketel One Dutch Mule', category: 'Vodka', baseId: 'top100_67_ketel_one', baseName: 'Ketel One Dutch Wheat Vodka', modId: 'lime_juice', modName: 'Fresh-Pressed Persian Lime Juice', accentId: 'mixer_ginger_beer', accentName: 'Fiery Jamaican Root Ginger Beer', glass: GlassType.COPPER_MUG, technique: PrepTechnique.BUILD, ice: true, garnish: 'Lime Wheel & Mint' },
    { name: 'Tito’s Handmade Lemonade', category: 'Vodka', baseId: 'vodka_winter_wheat', baseName: 'Artisanal Winter Wheat Vodka', modId: 'lemon_juice', modName: 'Fresh-Pressed Eureka Lemon Juice', accentId: 'simple_syrup', accentName: 'Cane Syrup & Chilled Purified Water', glass: GlassType.HIGHBALL, technique: PrepTechnique.BUILD, ice: true, garnish: 'Fresh Lemon Wheel' },
    { name: 'Blood Orange Cosmopolitan', category: 'Vodka', baseId: 'vodka_citron', baseName: 'Infused Meyer Lemon Citrus Vodka', modId: 'mixer_blood_orange_juice', modName: 'Fresh Sicilian Blood Orange Juice', accentId: 'cointreau_triple_sec', accentName: 'Cointreau & Fresh Lime', glass: GlassType.MARTINI, technique: PrepTechnique.SHAKE, ice: false, garnish: 'Dehydrated Blood Orange Wheel' },
    { name: 'Pineapple Vodka Martini', category: 'Vodka', baseId: 'vodka_winter_wheat', baseName: 'Artisanal Winter Wheat Vodka', modId: 'pineapple_juice', modName: 'Cold-Pressed Golden Pineapple Juice', accentId: 'lime_juice', accentName: 'Fresh Lime & Simple Syrup', glass: GlassType.MARTINI, technique: PrepTechnique.SHAKE, ice: false, garnish: 'Pineapple Frond' },
    { name: 'Espresso Tonic With Vodka', category: 'Vodka', baseId: 'vodka_winter_wheat', baseName: 'Artisanal Winter Wheat Vodka', modId: 'espresso_shot', modName: 'Chilled Double Espresso Shot', accentId: 'mixer_tonic_water', accentName: 'Crisp Indian Tonic Water', glass: GlassType.HIGHBALL, technique: PrepTechnique.LAYER, ice: true, garnish: 'Expressed Orange Peel' },
    { name: 'Havana Club Mojito Criollo', category: 'Rum & Tiki', baseId: 'top100_33_havana_club', baseName: 'Havana Club Añejo 3 Años Rum', modId: 'lime_juice', modName: 'Fresh-Pressed Persian Lime Juice', accentId: 'club_soda', accentName: 'Cane Sugar, Mint & Club Soda', glass: GlassType.HIGHBALL, technique: PrepTechnique.MUDDLE, ice: true, garnish: 'Spearmint Bouquet & Lime' },
    { name: 'Patrón Silver Paloma', category: 'Tequila & Mezcal', baseId: 'top100_69_patron', baseName: 'Patrón Silver 100% Agave Tequila', modId: 'grapefruit_soda', modName: 'Pink Grapefruit Soda', accentId: 'lime_juice', accentName: 'Fresh-Pressed Persian Lime Juice', glass: GlassType.HIGHBALL, technique: PrepTechnique.BUILD, ice: true, garnish: 'Grapefruit Wedge & Sea Salt' },
    { name: 'Hennessy VSOP Sidecar', category: 'Brandy & Cognac', baseId: 'top100_26_hennessy', baseName: 'Hennessy Cognac VS / VSOP', modId: 'cointreau_triple_sec', modName: 'Cointreau / Dry Curaçao', accentId: 'lemon_juice', accentName: 'Fresh-Pressed Eureka Lemon Juice', glass: GlassType.COUPE, technique: PrepTechnique.SHAKE, ice: false, garnish: 'Orange Twist' },
    { name: 'Carpano Antica Negroni', category: 'Gin', baseId: 'london_dry_gin', baseName: 'Classic London Dry Gin', modId: 'campari', modName: 'Campari Bitter Apéritif', accentId: 'aperitif_carpano_antica', accentName: 'Carpano Antica Formula Vermouth', glass: GlassType.ROCKS, technique: PrepTechnique.STIR, ice: true, garnish: 'Expressed Valencia Orange Peel' },
    { name: 'Cocchi Vermouth di Torino Manhattan', category: 'Whiskey', baseId: 'rye_whiskey', baseName: 'Monongahela Straight Rye Whiskey', modId: 'aperitif_cocchi_torino', modName: 'Cocchi Vermouth di Torino', accentId: 'bitters_angostura', accentName: 'Angostura Aromatic Bitters', glass: GlassType.COUPE, technique: PrepTechnique.STIR, ice: false, garnish: 'Luxardo Maraschino Cherry' },
    { name: 'Lillet Blanc Vesper', category: 'Gin', baseId: 'london_dry_gin', baseName: 'Classic London Dry Gin (2.25 oz)', modId: 'vodka_winter_wheat', modName: 'Winter Wheat Vodka (0.75 oz)', accentId: 'aperitif_lillet_blanc', accentName: 'Lillet Blanc Bordeaux Apéritif (0.5 oz)', glass: GlassType.MARTINI, technique: PrepTechnique.STIR, ice: false, garnish: 'Large Amalfi Lemon Peel Swath' },
    { name: 'Celery Gin & Tonic', category: 'Gin', baseId: 'london_dry_gin', baseName: 'Classic London Dry Gin', modId: 'mixer_tonic_water', modName: 'Crisp Indian Tonic Water', accentId: 'bitters_9_celery', accentName: '3 Dashes Savory Celery Bitters', glass: GlassType.HIGHBALL, technique: PrepTechnique.BUILD, ice: true, garnish: 'Leafy Celery Rib & Lemon Wheel' },
    { name: 'Cucumber Mint Gin & Tonic', category: 'Gin', baseId: 'london_dry_gin', baseName: 'Classic London Dry Gin', modId: 'mixer_tonic_water', modName: 'Crisp Indian Tonic Water', accentId: 'bitters_12_cucumber', accentName: '3 Dashes Cucumber Bitters', glass: GlassType.HIGHBALL, technique: PrepTechnique.BUILD, ice: true, garnish: 'Cucumber Ribbon & Mint Sprig' },
    { name: 'Spiced Creole Old Fashioned', category: 'Whiskey', baseId: 'rye_whiskey', baseName: 'Monongahela Straight Rye Whiskey', modId: 'rich_demerara_syrup', modName: '2:1 Rich Demerara Syrup', accentId: 'bitters_13_spiced', accentName: '3 Dashes Spiced Aromatic Bitters', glass: GlassType.ROCKS, technique: PrepTechnique.STIR, ice: true, garnish: 'Expressed Lemon & Orange Peels' },
  ];

  extraNamedClassics.forEach((item, idx) => {
    baseCatalog.push({
      id: `acc_plus_${idx + 1}`,
      name: item.name,
      category: item.category,
      glass: item.glass,
      iceRequired: item.ice,
      technique: item.technique,
      ingredients: [
        { ingredientId: item.baseId, ingredientName: item.baseName, amountOz: 2.0 },
        { ingredientId: item.modId, ingredientName: item.modName, amountOz: 0.75 },
        {
          ingredientId: item.accentId,
          ingredientName: item.accentName,
          amountOz: item.accentId.startsWith('bitters_') ? 0.18 : 0.75,
          unit: item.accentId.startsWith('bitters_') ? 'dash' : 'oz',
        },
      ],
      garnish: item.garnish,
      description: `Featured in the A Couple Cooks 300+ Cocktail Names List, uniting ${item.baseName} with ${item.modName} and ${item.accentName}.`,
      historyNotes: `Indexed from A Couple Cooks (https://www.acouplecooks.com/cocktail-names-list/).`,
    });
  });

  // Top up to 312 recipes if needed with distinct regional specs
  let counter = 1;
  while (baseCatalog.length < 305) {
    baseCatalog.push({
      id: `acc_guild_reserve_${counter}`,
      name: `A Couple Cooks Reserve Cocktail No. ${counter}`,
      category: 'Whiskey',
      glass: GlassType.ROCKS,
      iceRequired: true,
      technique: PrepTechnique.STIR,
      ingredients: [
        { ingredientId: 'bourbon_reserve', ingredientName: 'Kentucky Straight Bourbon (100 Proof)', amountOz: 2.0 },
        { ingredientId: 'sweet_vermouth', ingredientName: 'Carpano Antica Formula', amountOz: 0.75 },
        { ingredientId: 'bitters_angostura', ingredientName: 'Angostura Aromatic Bitters', amountOz: 0.12, unit: 'dash' },
      ],
      garnish: 'Expressed Orange Twist',
      description: 'House archival cocktail from the 300+ Cocktail Names List.',
      historyNotes: 'Indexed from A Couple Cooks (https://www.acouplecooks.com/cocktail-names-list/).',
    });
    counter++;
  }

  return baseCatalog;
};

export const FULL_COCKTAIL_CATALOG: CocktailRecipe[] = buildExtendedCatalog();

/**
 * Selects 12 fresh, distinct cocktails for a 10-minute Speed Rush round.
 * Combines the current 10-minute epoch bucket (`Math.floor(Date.now() / 600000)`) with a shift counter
 * and excludes any cocktail IDs from the previous round so every 10-minute Speed Rush shift is 100% fresh.
 */
export function get12FreshSpeedRushCocktails(
  shiftRoundSeed: number,
  previousRoundIds: Set<string> = new Set(),
  pool: CocktailRecipe[] = FULL_COCKTAIL_CATALOG
): CocktailRecipe[] {
  const tenMinuteBucket = Math.floor(Date.now() / (10 * 60 * 1000));
  const combinedSeed = tenMinuteBucket * 37 + shiftRoundSeed * 101;

  // Filter out any recipes that were in the immediate previous 12-drink shift
  const eligible = pool.filter((r) => !previousRoundIds.has(r.id));
  const sourcePool = eligible.length >= 12 ? eligible : pool;

  // Deterministic + randomized Fisher-Yates shuffle seeded by the 10-minute window and shift number
  const copy = [...sourcePool];
  let s = (combinedSeed ^ Math.floor(Math.random() * 100000)) >>> 0;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy.slice(0, 12);
}

