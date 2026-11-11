/**
 * Local Repository mirroring BarCraftDatabase.kt & CocktailDao.kt
 * Persists custom recipes, favorites, bottle depletion levels, student XP/Rank, and Speed Rush leaderboard.
 */

import { CocktailRecipe } from '../models/CocktailModels';
import { BartenderRank, LeaderboardEntry, StudentProfile } from '../models/AcademyModels';
import { FULL_COCKTAIL_CATALOG } from '../data/CocktailCatalog';
import { BAR_INGREDIENTS } from '../data/BarCraftData';

const STORAGE_KEYS = {
  FAVORITES: 'bars_r_us_favorites_v6',
  CUSTOM_COCKTAILS: 'bars_r_us_custom_cocktails_v6',
  BOTTLE_LEVELS: 'bars_r_us_bottle_levels_v6',
  STUDENT_PROFILE: 'bars_r_us_student_profile_v6',
  LEADERBOARD: 'bars_r_us_leaderboard_v6',
};

export function calculateRankFromXp(xp: number): BartenderRank {
  if (xp >= 2500) return 'Master Mixologist';
  if (xp >= 1600) return 'Guild Sommelier & Cicerone';
  if (xp >= 900) return 'Lead Craft Mixologist';
  if (xp >= 350) return 'Station Bartender';
  return 'Barback Apprentice';
}

export class CocktailRepository {
  static getFavoriteIds(): Set<string> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return raw ? new Set(JSON.parse(raw)) : new Set(['whiskey_old_fashioned', 'gin_negroni', 'rum_mai_tai_1944', 'agave_margarita_tommys']);
    } catch {
      return new Set();
    }
  }

  static getCustomCocktails(): CocktailRecipe[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_COCKTAILS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static getAllCocktails(): CocktailRecipe[] {
    const favs = this.getFavoriteIds();
    const customs = this.getCustomCocktails();
    const combined = [...customs, ...FULL_COCKTAIL_CATALOG];
    return combined.map((c) => ({
      ...c,
      isFavorite: favs.has(c.id),
    }));
  }

  static toggleFavorite(cocktailId: string): Set<string> {
    const favs = this.getFavoriteIds();
    if (favs.has(cocktailId)) {
      favs.delete(cocktailId);
    } else {
      favs.add(cocktailId);
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(Array.from(favs)));
    return favs;
  }

  static insertCustomCocktail(recipe: CocktailRecipe): CocktailRecipe[] {
    const customs = this.getCustomCocktails().filter((c) => c.id !== recipe.id);
    const updated = [{ ...recipe, isCustom: true, creationTimestamp: Date.now() }, ...customs];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_COCKTAILS, JSON.stringify(updated));
    return updated;
  }

  static getBottleLevels(): Record<string, number> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOTTLE_LEVELS);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    const defaults: Record<string, number> = {};
    for (const ing of BAR_INGREDIENTS) {
      defaults[ing.id] = ing.maxCapacityOz;
    }
    return defaults;
  }

  static saveBottleLevels(levels: Record<string, number>): void {
    localStorage.setItem(STORAGE_KEYS.BOTTLE_LEVELS, JSON.stringify(levels));
  }

  static getStudentProfile(): StudentProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return {
      name: 'Apprentice Mixologist',
      rank: 'Station Bartender',
      xp: 420,
      completedQuizIds: [],
      drinksMixedCount: 14,
      highestAccuracyScore: 96,
      speedRushBestScore: 1850,
      certifiedStates: ['NY', 'CA'],
    };
  }

  static updateStudentProfile(updater: (prev: StudentProfile) => StudentProfile): StudentProfile {
    const current = this.getStudentProfile();
    const next = updater(current);
    next.rank = calculateRankFromXp(next.xp);
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(next));
    return next;
  }

  static getLeaderboard(): LeaderboardEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [
      {
        id: 'lb_1',
        bartenderName: 'Alistair Vance (Guild Master)',
        rank: 'Master Mixologist',
        score: 4820,
        drinksServed: 24,
        avgAccuracy: 99,
        tipsEarnedUsd: 186.5,
        shiftDurationMin: 10,
        timestamp: Date.now() - 86400000 * 3,
      },
      {
        id: 'lb_2',
        bartenderName: 'Elena Rostova (Soho Head Bar)',
        rank: 'Guild Sommelier & Cicerone',
        score: 3940,
        drinksServed: 19,
        avgAccuracy: 96,
        tipsEarnedUsd: 142.0,
        shiftDurationMin: 10,
        timestamp: Date.now() - 86400000 * 2,
      },
      {
        id: 'lb_3',
        bartenderName: 'Mateo Morales (Oaxaca Room)',
        rank: 'Lead Craft Mixologist',
        score: 3290,
        drinksServed: 16,
        avgAccuracy: 94,
        tipsEarnedUsd: 118.25,
        shiftDurationMin: 10,
        timestamp: Date.now() - 86400000,
      },
    ];
  }

  static addLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
    const list = [entry, ...this.getLeaderboard()]
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(list));
    return list;
  }
}
