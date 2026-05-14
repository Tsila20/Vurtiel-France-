/**
 * Poisson Distribution Formula: P(x; λ) = (e^-λ * λ^x) / x!
 */
export function poisson(x: number, lambda: number): number {
  if (x < 0) return 0;
  const factorial = (n: number): number => {
    if (n === 0) return 1;
    let res = 1;
    for (let i = 1; i <= n; i++) res *= i;
    return res;
  };
  return (Math.exp(-lambda) * Math.pow(lambda, x)) / factorial(x);
}

export function calculateExpectedGoals(
  teamAScored: number,
  teamAConceded: number,
  teamBScored: number,
  teamBConceded: number,
  leagueAvgHome: number = 1.5,
  leagueAvgAway: number = 1.2
): { homeExp: number; awayExp: number } {
  // Relative strengths
  const homeAttack = teamAScored / leagueAvgHome;
  const homeDefense = teamAConceded / leagueAvgAway;
  const awayAttack = teamBScored / leagueAvgAway;
  const awayDefense = teamBConceded / leagueAvgHome;

  const homeExp = homeAttack * awayDefense * leagueAvgHome;
  const awayExp = awayAttack * homeDefense * leagueAvgAway;

  return { homeExp, awayExp };
}

export function getFullPrediction(
  homeExp: number,
  awayExp: number,
  odds: { home: number; draw: number; away: number; over25: number }
) {
  const maxGoals = 8;
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  let over25 = 0;
  let over15 = 0;

  for (let h = 0; h <= maxGoals; h++) {
    for (let a = 0; a <= maxGoals; a++) {
      const prob = poisson(h, homeExp) * poisson(a, awayExp);

      if (h > a) homeWin += prob;
      else if (h === a) draw += prob;
      else awayWin += prob;

      if (h + a > 2.5) over25 += prob;
      if (h + a > 1.5) over15 += prob;
    }
  }

  // Find most likely score
  let maxProb = 0;
  let mostLikelyScore = { home: 0, away: 0 };
  for (let h = 0; h <= maxGoals; h++) {
    for (let a = 0; a <= maxGoals; a++) {
      const prob = poisson(h, homeExp) * poisson(a, awayExp);
      if (prob > maxProb) {
        maxProb = prob;
        mostLikelyScore = { home: h, away: a };
      }
    }
  }

  // Final 1X2 Prediction string
  let finalPrediction: '1' | 'X' | '2' = 'X';
  if (homeWin > awayWin && homeWin > draw) finalPrediction = '1';
  else if (awayWin > homeWin && awayWin > draw) finalPrediction = '2';

  // Value bets
  const valueBets = [];
  const checkValue = (market: string, prob: number, oddsValue: number) => {
    if (oddsValue > 0) {
      const impliedProb = 1 / oddsValue;
      if (prob > impliedProb) {
        valueBets.push({
          market,
          prob,
          odds: oddsValue,
          edge: (prob * oddsValue - 1) * 100,
        });
      }
    }
  };

  checkValue('Home Win', homeWin, odds.home);
  checkValue('Draw', draw, odds.draw);
  checkValue('Away Win', awayWin, odds.away);
  checkValue('Over 2.5', over25, odds.over25);

  return {
    homeWinProb: homeWin,
    drawProb: draw,
    awayWinProb: awayWin,
    over2_5Prob: over25,
    over1_5Prob: over15,
    under2_5Prob: 1 - over25,
    expectedHomeGoals: homeExp,
    expectedAwayGoals: awayExp,
    mostLikelyScore,
    finalPrediction,
    valueBets: valueBets.sort((a, b) => b.edge - a.edge),
    riskLevel: homeExp + awayExp > 4 || homeExp + awayExp < 1.5 ? 'High' : (homeWin > 0.6 || awayWin > 0.6 ? 'Low' : 'Medium'),
  };
}
