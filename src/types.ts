export interface TeamStats {
  name: string;
  goalsScored: number[]; // Last matches
  goalsConceded: number[];
  avgScored: number;
  avgConceded: number;
}

export interface PredictionResult {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  over1_5Prob: number;
  over2_5Prob: number;
  under2_5Prob: number;
  expectedHomeGoals: number;
  expectedAwayGoals: number;
  mostLikelyScore: { home: number; away: number };
  finalPrediction: '1' | 'X' | '2';
  valueBets: ValueBet[];
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface ValueBet {
  market: string;
  prob: number;
  odds: number;
  edge: number;
}
