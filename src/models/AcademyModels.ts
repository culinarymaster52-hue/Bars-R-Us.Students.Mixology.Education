/**
 * Academy, Speed Rush, AI Mentor, and Alcohol Law Models
 * Mirroring com.example.model.AcademyModels.kt
 */

import { CocktailRecipe } from './CocktailModels';

export type BartenderRank =
  | 'Barback Apprentice'
  | 'Station Bartender'
  | 'Lead Craft Mixologist'
  | 'Guild Sommelier & Cicerone'
  | 'Master Mixologist';

export interface StudentProfile {
  name: string;
  rank: BartenderRank;
  xp: number;
  completedQuizIds: string[];
  drinksMixedCount: number;
  highestAccuracyScore: number;
  speedRushBestScore: number;
  certifiedStates: string[];
}

export interface QuizQuestion {
  id: string;
  module:
    | 'Classic Proportions & Families'
    | 'Distillation, Proof & Aging'
    | 'Sommelier & Cicerone Service'
    | 'Tools, Ice & Dilution Physics'
    | 'Hospitality Law & Safety';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
}

export interface AlcoholLaw {
  stateCode: string;
  stateName: string;
  minDrinkingAge: number;
  minBartendingAge: number;
  minServerAgeWineBeer: number;
  mandatoryServerTraining: 'Mandatory' | 'Voluntary (Incentivized)' | 'Local Jurisdiction';
  certificationName: string;
  maxBacLimit: number;
  lastCallTime: string;
  happyHourAllowed: boolean;
  dramShopLiability: 'Strict Statutory' | 'Limited / Visible Intoxication' | 'Case Law Only';
  keyComplianceNote: string;
}

export type CustomerMood = 'DELIGHTED' | 'PATIENT' | 'IMPATIENT' | 'FRUSTRATED';

export interface SpeedRushCustomer {
  id: string;
  name: string;
  archetype: string;
  recipe: CocktailRecipe;
  patienceMaxSec: number;
  patienceRemainingSec: number;
  mood: CustomerMood;
  baseTipUsd: number;
  specialNote: string;
}

export interface LeaderboardEntry {
  id: string;
  bartenderName: string;
  rank: BartenderRank;
  score: number;
  drinksServed: number;
  avgAccuracy: number;
  tipsEarnedUsd: number;
  shiftDurationMin: number;
  timestamp: number;
}

export type MessageSender = 'USER' | 'AI_BOT';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  isSuggestionToCreator?: boolean;
}
