import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  Calculator,
  History,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Crown,
  Lock,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { calculateExpectedGoals, getFullPrediction } from './lib/predictor';
import { FRENCH_LEAGUE_TEAMS } from './constants';
import { getTotalGoalsInsight } from './services/geminiService';

export default function App() {
  const [selectedHomeId, setSelectedHomeId] = useState(FRENCH_LEAGUE_TEAMS[0].id);
  const [selectedAwayId, setSelectedAwayId] = useState(FRENCH_LEAGUE_TEAMS[1].id);
  
  const [homeForm, setHomeForm] = useState<string[]>(['W', 'W', 'D', 'L', 'L']);
  const [awayForm, setAwayForm] = useState<string[]>(['L', 'D', 'W', 'L', 'W']);

  const toggleForm = (team: 'home' | 'away', index: number) => {
    const states = ['W', 'D', 'L'];
    const currentForm = team === 'home' ? [...homeForm] : [...awayForm];
    const currentIndex = states.indexOf(currentForm[index]);
    const nextState = states[(currentIndex + 1) % 3];
    currentForm[index] = nextState;
    if (team === 'home') setHomeForm(currentForm);
    else setAwayForm(currentForm);
  };

  const homeTeamInfo = FRENCH_LEAGUE_TEAMS.find(t => t.id === selectedHomeId)!;
  const awayTeamInfo = FRENCH_LEAGUE_TEAMS.find(t => t.id === selectedAwayId)!;

  // Calculate form momentum
  const getFormWeight = (form: string[]) => {
    return form.reduce((acc, curr) => acc + (curr === 'W' ? 1.2 : curr === 'D' ? 1 : 0.8), 0) / 5;
  };

  // Stats inputs
  const [homeAvgScored, setHomeAvgScored] = useState(homeTeamInfo.baseAttack);
  const [homeAvgConceded, setHomeAvgConceded] = useState(homeTeamInfo.baseDefense);
  const [awayAvgScored, setAwayAvgScored] = useState(awayTeamInfo.baseAttack);
  const [awayAvgConceded, setAwayAvgConceded] = useState(awayTeamInfo.baseDefense);
  
  // Odds inputs
  const [oddsHome, setOddsHome] = useState(2.10);
  const [oddsDraw, setOddsDraw] = useState(3.40);
  const [oddsAway, setOddsAway] = useState(3.60);
  const [oddsOver25, setOddsOver25] = useState(1.85);

  const [isPremium, setIsPremium] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [showStandings, setShowStandings] = useState(false);

  // Sync stats when team changes
  useEffect(() => {
    setHomeAvgScored(homeTeamInfo.baseAttack);
    setHomeAvgConceded(homeTeamInfo.baseDefense);
  }, [selectedHomeId]);

  useEffect(() => {
    setAwayAvgScored(awayTeamInfo.baseAttack);
    setAwayAvgConceded(awayTeamInfo.baseDefense);
  }, [selectedAwayId]);

  const prediction = useMemo(() => {
    const homeMomentum = getFormWeight(homeForm);
    const awayMomentum = getFormWeight(awayForm);
    
    const { homeExp, awayExp } = calculateExpectedGoals(
      homeAvgScored * homeMomentum,
      homeAvgConceded / homeMomentum, // Better form = harder to score against
      awayAvgScored * awayMomentum,
      awayAvgConceded / awayMomentum
    );
    return getFullPrediction(homeExp, awayExp, {
      home: oddsHome,
      draw: oddsDraw,
      away: oddsAway,
      over25: oddsOver25
    });
  }, [homeAvgScored, homeAvgConceded, awayAvgScored, awayAvgConceded, oddsHome, oddsDraw, oddsAway, oddsOver25, homeForm, awayForm]);

  const handlePredict = async () => {
    setIsPredicting(true);
    setAiInsight(null);
    
    // Simulate complex calculation
    await new Promise(r => setTimeout(r, 1500));
    
    if (isPremium) {
      const insight = await getTotalGoalsInsight(
        homeTeamInfo.name, 
        awayTeamInfo.name, 
        prediction.over2_5Prob, 
        prediction.expectedHomeGoals + prediction.expectedAwayGoals
      );
      setAiInsight(insight);
    }
    
    setIsPredicting(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* Premium Banner */}
      <div className="bg-emerald-600/10 border-b border-emerald-500/20 py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap px-4 w-fit">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mx-6">
              <Zap className="w-3 h-3" /> Ligue 1 Virtual Edition - French League Matchday LIVE Analyser
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-lg leading-tight tracking-tight uppercase italic">Pro Predictor <span className="text-emerald-500">v3.0</span></h1>
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-neutral-500" />
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Ligue 1 France Virtual Optimization</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setShowStandings(!showStandings)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                showStandings 
                ? 'bg-emerald-500 text-neutral-950 shadow-lg' 
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-emerald-500/50'
              }`}
             >
               <TrendingUp className="w-4 h-4" />
               CLASSEMENT
             </button>
             <button 
              onClick={() => setIsPremium(!isPremium)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                isPremium 
                ? 'bg-amber-400 text-neutral-950 shadow-lg shadow-amber-900/20' 
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-amber-400/50'
              }`}
             >
               <Crown className={`w-4 h-4 ${isPremium ? 'animate-bounce' : ''}`} />
               {isPremium ? 'PREMIUM ACTIVE' : 'GO PREMIUM'}
             </button>
             <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/50 border border-neutral-800 text-[10px] font-bold text-neutral-500">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
               SECURED
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-neutral-900/50 border border-neutral-800 rounded-[2.5rem] p-8 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Calculator className="w-4 h-4 text-emerald-500" />
                </div>
                <h2 className="font-bold text-sm text-neutral-200 uppercase tracking-tight">Configuration Engine</h2>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-500/50" />
            </div>
            
            <div className="space-y-8">
              {/* Team Selections */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Domicile (Home)
                  </label>
                  <div className="flex gap-3">
                    <div className="w-14 h-14 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center p-2 shrink-0">
                      <img src={homeTeamInfo.logoUrl} alt={homeTeamInfo.name} className="w-full h-full object-contain" />
                    </div>
                    <select 
                      value={selectedHomeId}
                      onChange={e => setSelectedHomeId(e.target.value)}
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-2xl px-4 py-3 text-sm font-bold focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
                      style={{ borderLeft: `6px solid ${homeTeamInfo.color}` }}
                    >
                      {FRENCH_LEAGUE_TEAMS.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-center -my-3 relative z-10">
                   <div className="bg-neutral-950 p-2 rounded-full border border-neutral-800">
                     <RefreshCw className="w-4 h-4 text-neutral-600" />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Extérieur (Away)
                   </label>
                   <div className="flex gap-3">
                    <div className="w-14 h-14 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center p-2 shrink-0">
                      <img src={awayTeamInfo.logoUrl} alt={awayTeamInfo.name} className="w-full h-full object-contain" />
                    </div>
                    <select 
                      value={selectedAwayId}
                      onChange={e => setSelectedAwayId(e.target.value)}
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-2xl px-4 py-3 text-sm font-bold focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
                      style={{ borderLeft: `6px solid ${awayTeamInfo.color}` }}
                    >
                      {FRENCH_LEAGUE_TEAMS.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 space-y-4">
                 <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                     <span className="text-[9px] font-black text-neutral-500 uppercase">League Rank</span>
                     <span className="text-sm font-black text-white italic">#{homeTeamInfo.rank} vs #{awayTeamInfo.rank}</span>
                   </div>
                   <div className="flex flex-col text-right">
                     <span className="text-[9px] font-black text-neutral-500 uppercase">Match Diff</span>
                     <span className="text-sm font-black text-emerald-500">{Math.abs(homeTeamInfo.rank - awayTeamInfo.rank)} Pos</span>
                   </div>
                 </div>
                 
                 <div className="h-px bg-neutral-800" />
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-neutral-500 uppercase">Recent Form (Home)</span>
                       <div className="flex gap-1.5">
                         {homeForm.map((res, i) => (
                           <button 
                             key={i} 
                             onClick={() => toggleForm('home', i)}
                             className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${
                               res === 'W' ? 'bg-emerald-500 text-neutral-950' : 
                               res === 'D' ? 'bg-neutral-800 text-neutral-400' : 
                               'bg-red-500 text-white'
                             }`}
                           >
                             {res === 'W' ? '✓' : res === 'D' ? '•' : '✗'}
                           </button>
                         ))}
                       </div>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-neutral-500 uppercase">Recent Form (Away)</span>
                       <div className="flex gap-1.5">
                         {awayForm.map((res, i) => (
                           <button 
                             key={i} 
                             onClick={() => toggleForm('away', i)}
                             className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${
                               res === 'W' ? 'bg-emerald-500 text-neutral-950' : 
                               res === 'D' ? 'bg-neutral-800 text-neutral-400' : 
                               'bg-red-500 text-white'
                             }`}
                           >
                             {res === 'W' ? '✓' : res === 'D' ? '•' : '✗'}
                           </button>
                         ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="h-px bg-neutral-800/50" />

              {/* Stats Inputs */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4">
                    <div className="text-[9px] font-black text-neutral-600 uppercase text-center border-b border-neutral-800 pb-2">Home Power (L5)</div>
                    <div className="space-y-1">
                      <span className="text-[8px] text-neutral-500 uppercase pl-1 font-bold">ATTACK</span>
                      <input 
                        type="number" step="0.1" value={homeAvgScored}
                        onChange={e => setHomeAvgScored(parseFloat(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm font-mono focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] text-neutral-500 uppercase pl-1 font-bold">DEFENSE</span>
                      <input 
                        type="number" step="0.1" value={homeAvgConceded}
                        onChange={e => setHomeAvgConceded(parseFloat(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm font-mono focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="text-[9px] font-black text-neutral-600 uppercase text-center border-b border-neutral-800 pb-2">Away Power (L5)</div>
                    <div className="space-y-1">
                      <span className="text-[8px] text-neutral-500 uppercase pl-1 font-bold">ATTACK</span>
                      <input 
                        type="number" step="0.1" value={awayAvgScored}
                        onChange={e => setAwayAvgScored(parseFloat(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm font-mono focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] text-neutral-500 uppercase pl-1 font-bold">DEFENSE</span>
                      <input 
                        type="number" step="0.1" value={awayAvgConceded}
                        onChange={e => setAwayAvgConceded(parseFloat(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm font-mono focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                 </div>
              </div>

              <div className="h-px bg-neutral-800/50" />

              {/* Odds Inputs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">Bet261 Live Market</label>
                   <div className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-black">1 X 2 SYSTEM</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                   <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 focus-within:border-emerald-500/30 transition-all text-center">
                    <span className="text-[8px] text-neutral-600 block uppercase font-bold mb-1 italic">V1</span>
                    <input 
                      type="number" step="0.01" value={oddsHome}
                      onChange={e => setOddsHome(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent text-sm font-mono font-bold focus:outline-none text-neutral-200 text-center"
                    />
                  </div>
                   <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 focus-within:border-emerald-500/30 transition-all text-center">
                    <span className="text-[8px] text-neutral-600 block uppercase font-bold mb-1 italic">Draw (X)</span>
                    <input 
                      type="number" step="0.01" value={oddsDraw}
                      onChange={e => setOddsDraw(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent text-sm font-mono font-bold focus:outline-none text-neutral-200 text-center"
                    />
                  </div>
                   <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 focus-within:border-emerald-500/30 transition-all text-center">
                    <span className="text-[8px] text-neutral-600 block uppercase font-bold mb-1 italic">V2</span>
                    <input 
                      type="number" step="0.01" value={oddsAway}
                      onChange={e => setOddsAway(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent text-sm font-mono font-bold focus:outline-none text-neutral-200 text-center"
                    />
                  </div>
                </div>
                <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 focus-within:border-emerald-500/30 transition-all flex items-center justify-between px-6">
                    <span className="text-[10px] text-neutral-500 block uppercase font-black italic">Over 2.5 Market</span>
                    <input 
                      type="number" step="0.01" value={oddsOver25}
                      onChange={e => setOddsOver25(parseFloat(e.target.value) || 0)}
                      className="bg-transparent text-base font-mono font-black focus:outline-none text-emerald-400 text-right w-20"
                    />
                </div>
              </div>


              <button 
                onClick={handlePredict}
                disabled={isPredicting}
                className="w-full group bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:cursor-not-allowed text-neutral-950 font-black py-4 rounded-[2rem] shadow-xl shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isPredicting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    ANALYZING RNG DATA...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    PREDICT NOW
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </section>

          <div className="flex items-center gap-4 px-4">
             <div className="flex -space-x-3">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-neutral-950 bg-neutral-900 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-emerald-500/20 flex items-center justify-center">
                       <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                 </div>
               ))}
             </div>
             <p className="text-[10px] font-bold text-neutral-600 uppercase">Trusted by 12,400+ Predictors</p>
          </div>
        </div>

        {/* Dashboard Results */}
        <div className="lg:col-span-8 space-y-8">
          
          <AnimatePresence>
            {showStandings && (
              <motion.section 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] overflow-hidden"
              >
                <div className="p-8 border-b border-neutral-800 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <TrendingUp className="w-5 h-5 text-emerald-500" />
                     <h3 className="font-black text-lg uppercase italic">Classement Virtuel France</h3>
                   </div>
                   <button onClick={() => setShowStandings(false)} className="text-neutral-500 hover:text-white">
                      <Lock className="w-4 h-4" />
                   </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-neutral-950/50 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Equipe</th>
                        <th className="px-4 py-4 text-center">Rank</th>
                        <th className="px-4 py-4 text-center">Att Power</th>
                        <th className="px-4 py-4 text-center">Def Power</th>
                        <th className="px-4 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                      {FRENCH_LEAGUE_TEAMS.sort((a, b) => a.rank - b.rank).map((team) => (
                        <tr key={team.id} className={`hover:bg-emerald-500/5 transition-colors group ${
                          team.id === selectedHomeId || team.id === selectedAwayId ? 'bg-emerald-500/10 border-l-4 border-emerald-500' : ''
                        }`}>
                          <td className="px-6 py-4 flex items-center gap-4">
                            <span className="text-[10px] font-bold text-neutral-600 w-4">{team.rank}</span>
                            <div className="w-8 h-8 rounded-lg bg-neutral-800 p-1 shadow-inner">
                               <img src={team.logoUrl} alt="" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-sm font-bold text-neutral-300 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{team.name}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${team.rank <= 3 ? 'bg-emerald-500/20 text-emerald-400' : team.rank >= 16 ? 'bg-red-500/20 text-red-500' : 'bg-neutral-800 text-neutral-500'}`}>
                              #{team.rank}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-mono text-sm text-emerald-500 font-bold">{team.baseAttack.toFixed(1)}</td>
                          <td className="px-4 py-4 text-center font-mono text-sm text-red-400 font-bold">{team.baseDefense.toFixed(1)}</td>
                          <td className="px-4 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <button 
                                onClick={() => {
                                  setSelectedHomeId(team.id);
                                  setShowStandings(false);
                                }}
                                className="text-[9px] font-black bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 px-3 py-1 rounded transition-all uppercase"
                               >
                                 HOME
                               </button>
                               <button 
                                onClick={() => {
                                  setSelectedAwayId(team.id);
                                  setShowStandings(false);
                                }}
                                className="text-[9px] font-black bg-neutral-800 hover:bg-red-500 hover:text-white px-3 py-1 rounded transition-all uppercase"
                               >
                                 AWAY
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Main Predictor View */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-[3rem] overflow-hidden shadow-2xl shadow-neutral-950 relative border-b-8 border-emerald-900/30">
            {isPredicting && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-6"
              >
                 <div className="relative">
                   <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                   <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-emerald-500 animate-pulse" />
                 </div>
                 <div className="text-center">
                   <h3 className="text-xl font-black italic uppercase tracking-tighter">Running Poisson v3 Engine</h3>
                   <p className="text-sm text-neutral-500 font-bold uppercase tracking-widest mt-1">Calculating RNG variance for Bet261</p>
                 </div>
              </motion.div>
            )}

            <div className="p-10 border-b border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 pt-12">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
                       <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] animate-pulse">Server-Side Active</span>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 uppercase font-mono">HASH: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-2xl text-[10px] font-black text-neutral-400 uppercase italic">
                       Odds: {oddsHome} - {oddsDraw} - {oddsAway}
                    </div>
                    <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                      prediction.riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      prediction.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                      {prediction.riskLevel} Risk
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 items-center text-center gap-8 px-4">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="flex flex-col items-center">
                       <div className="w-24 h-24 rounded-[3rem] bg-neutral-800 border-b-4 border-neutral-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform p-3 shadow-2xl relative">
                          <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
                          <img src={homeTeamInfo.logoUrl} alt={homeTeamInfo.name} className="w-full h-full object-contain relative z-10" />
                       </div>
                       <span className="text-sm font-black text-neutral-200 uppercase tracking-tight">{homeTeamInfo.name}</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                         {(prediction.homeWinProb * 100).toFixed(0)}<span className="text-3xl text-emerald-500 ml-1">%</span>
                       </div>
                    </div>
                  </motion.div>
                  
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative group">
                       <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
                       <div className="w-16 h-16 rounded-full border-2 border-neutral-800 bg-neutral-900 flex items-center justify-center relative shadow-inner">
                         <span className="text-2xl font-black text-neutral-600 italic">X</span>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Draw Chance</span>
                          <div className="text-3xl font-black text-neutral-100 tabular-nums">{(prediction.drawProb * 100).toFixed(1)}%</div>
                       </div>
                       
                       {/* Exact Score & Prediction 1X2 */}
                       <div className="pt-4 border-t border-neutral-800/50 space-y-3">
                          <div className="bg-emerald-600 inline-block px-4 py-1.5 rounded-full shadow-lg shadow-emerald-900/40">
                             <span className="text-[10px] font-black text-neutral-950 uppercase italic">Prediction: {prediction.finalPrediction === '1' ? 'HOME WIN' : prediction.finalPrediction === '2' ? 'AWAY WIN' : 'DRAW'}</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Score Exact Probable</span>
                            <div className="text-4xl font-black text-white italic tracking-tighter">
                              {prediction.mostLikelyScore.home} - {prediction.mostLikelyScore.away}
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="flex flex-col items-center">
                       <div className="w-24 h-24 rounded-[3rem] bg-neutral-800 border-b-4 border-neutral-950 flex items-center justify-center mb-4 p-3 shadow-2xl relative">
                          <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
                          <img src={awayTeamInfo.logoUrl} alt={awayTeamInfo.name} className="w-full h-full object-contain relative z-10" />
                       </div>
                       <span className="text-sm font-black text-neutral-200 uppercase tracking-tight">{awayTeamInfo.name}</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <div className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                         {(prediction.awayWinProb * 100).toFixed(0)}<span className="text-3xl text-emerald-500 ml-1">%</span>
                       </div>
                    </div>
                  </motion.div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-neutral-800">
               {/* Goals Intel */}
               <div className="p-8 space-y-6 bg-neutral-900/50">
                 <div className="flex items-center gap-3">
                   <Target className="w-5 h-5 text-emerald-500" />
                   <h4 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">Goals Intel</h4>
                 </div>
                 <div className="space-y-6">
                   <StatRow label="Over 1.5 Goals" value={(prediction.over1_5Prob * 100).toFixed(1) + '%'} progress={prediction.over1_5Prob} color="emerald" />
                   <StatRow label="Over 2.5 Goals" value={(prediction.over2_5Prob * 100).toFixed(1) + '%'} progress={prediction.over2_5Prob} color="emerald" />
                   <StatRow label="Under 2.5 Goals" value={(prediction.under2_5Prob * 100).toFixed(1) + '%'} progress={prediction.under2_5Prob} color="neutral" />
                 </div>
               </div>

               {/* AI Intelligence */}
               <div className="p-8 space-y-6 bg-emerald-500/[0.02] col-span-1 md:col-span-2 relative">
                  {!isPremium && (
                    <div className="absolute inset-0 z-10 bg-neutral-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center group cursor-pointer" onClick={() => setIsPremium(true)}>
                       <div className="bg-amber-400 p-3 rounded-2xl mb-4 shadow-lg shadow-amber-900/40 group-hover:scale-110 transition-transform">
                         <Lock className="w-5 h-5 text-neutral-900" />
                       </div>
                       <h5 className="text-sm font-black text-white uppercase italic tracking-tighter">AI Expert Predictor Locked</h5>
                       <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1 max-w-[200px]">Unlock professional 1X2 and Score Exact intelligence. Used by pro bettors.</p>
                       <div className="mt-4 flex items-center gap-2 text-amber-400 text-[10px] font-black uppercase font-bold border-b border-amber-400/30 pb-0.5">
                         ACTIVE PREMIUM ACCESS <ChevronRight className="w-4 h-4" />
                       </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <h4 className="text-[11px] font-black text-amber-400 uppercase tracking-[0.2em]">Expert Verdict Engine</h4>
                    </div>
                    {isPremium && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full">
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span className="text-[8px] font-black text-amber-400 uppercase">Premium Intelligence</span>
                      </div>
                    )}
                  </div>

                  {/* Comparison Stats Table */}
                  <div className="bg-neutral-950/50 border border-neutral-800 rounded-[2rem] overflow-hidden">
                    <table className="w-full text-left text-xs">
                       <thead>
                          <tr className="bg-neutral-900/50 text-[10px] font-black text-neutral-500 uppercase tracking-widest border-b border-neutral-800">
                             <th className="px-6 py-3">Paramètre</th>
                             <th className="px-4 py-3 text-emerald-500 italic">DOMICILE</th>
                             <th className="px-4 py-3 text-red-400 italic">EXTÉRIEUR</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-neutral-800/30">
                          <tr>
                             <td className="px-6 py-4 font-bold text-neutral-500">CLASSEMENT</td>
                             <td className="px-4 py-4 text-white font-black italic">#{homeTeamInfo.rank}</td>
                             <td className="px-4 py-4 text-white font-black italic">#{awayTeamInfo.rank}</td>
                          </tr>
                          <tr>
                             <td className="px-6 py-4 font-bold text-neutral-500">ATT POWER</td>
                             <td className="px-4 py-4 text-emerald-500 font-mono font-bold">{homeAvgScored.toFixed(1)}</td>
                             <td className="px-4 py-4 text-emerald-500 font-mono font-bold">{awayAvgScored.toFixed(1)}</td>
                          </tr>
                          <tr>
                             <td className="px-6 py-4 font-bold text-neutral-500">DEF POWER</td>
                             <td className="px-4 py-4 text-red-400 font-mono font-bold">{homeAvgConceded.toFixed(1)}</td>
                             <td className="px-4 py-4 text-red-400 font-mono font-bold">{awayAvgConceded.toFixed(1)}</td>
                          </tr>
                          <tr className="bg-emerald-500/5">
                             <td className="px-6 py-4 font-black text-neutral-400 uppercase italic">RECENT FORM</td>
                             <td className="px-4 py-4">
                                <div className="flex gap-1">
                                   {homeForm.map((f, i) => (
                                     <span key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-black ${
                                       f === 'W' ? 'bg-emerald-500 text-neutral-950' : f === 'D' ? 'bg-neutral-800 text-neutral-400' : 'bg-red-500 text-white'
                                     }`}>{f === 'W' ? '✓' : f === 'D' ? '•' : '✗'}</span>
                                   ))}
                                </div>
                             </td>
                             <td className="px-4 py-4">
                                <div className="flex gap-1">
                                   {awayForm.map((f, i) => (
                                     <span key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-black ${
                                       f === 'W' ? 'bg-emerald-500 text-neutral-950' : f === 'D' ? 'bg-neutral-800 text-neutral-400' : 'bg-red-500 text-white'
                                     }`}>{f === 'W' ? '✓' : f === 'D' ? '•' : '✗'}</span>
                                   ))}
                                </div>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                        <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-3 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-2 opacity-5">
                             <Target className="w-12 h-12" />
                           </div>
                           <span className="text-[9px] font-black text-neutral-600 uppercase block tracking-tighter">AI Analysis Insight</span>
                           <p className="text-xs text-neutral-300 leading-relaxed font-bold italic">
                             {aiInsight || (isPremium ? "Generer Predictor..." : "Analyse bloquée...")}
                           </p>
                        </div>
                        
                        <div className="p-5 rounded-3xl bg-emerald-600 text-neutral-950 shadow-xl shadow-emerald-900/20">
                           <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Final Prediction 1X2</div>
                           <div className="text-3xl font-black italic tracking-tighter flex items-center justify-between">
                             <span>{prediction.finalPrediction === '1' ? 'VICTOIRE DOM' : prediction.finalPrediction === '2' ? 'VICTOIRE EXT' : 'MATCH NUL'}</span>
                             <div className="bg-neutral-950 text-emerald-400 w-10 h-10 rounded-full flex items-center justify-center text-xl not-italic">
                               {prediction.finalPrediction}
                             </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="p-6 rounded-[2rem] bg-neutral-950 border-2 border-emerald-500/30 flex flex-col items-center justify-center text-center relative group">
                           <div className="absolute -top-3 bg-emerald-500 text-neutral-950 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg italic">
                             Conseil Score Exact
                           </div>
                           <div className="text-6xl font-black text-white italic tracking-tighter mb-1 drop-shadow-lg group-hover:scale-110 transition-transform">
                             {prediction.mostLikelyScore.home} - {prediction.mostLikelyScore.away}
                           </div>
                           <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Confiance Mathématique</span>
                        </div>

                        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                           <div>
                             <span className="text-[9px] font-black text-neutral-600 uppercase block">Total Buts Exp.</span>
                             <span className="text-2xl font-black text-emerald-400 italic">{(prediction.expectedHomeGoals + prediction.expectedAwayGoals).toFixed(2)}</span>
                           </div>
                           <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                             <TrendingUp className="w-5 h-5 text-emerald-500" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Value Bets Table */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-black text-xl text-neutral-100 uppercase italic">Edge Radar <span className="text-emerald-500">Live</span></h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-neutral-500 uppercase bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800">
                <Zap className="w-3 h-3 text-amber-500" />
                Scanned 42 Markets
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {prediction.valueBets.map((bet, i) => (
                  <motion.div
                    key={bet.market}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative bg-neutral-900/40 border border-neutral-800 rounded-[2.5rem] p-8 hover:bg-neutral-900 hover:border-emerald-500/40 transition-all cursor-default overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Target className="w-24 h-24 text-white -rotate-12" />
                    </div>

                    <div className="flex items-start justify-between mb-8 relative z-10">
                       <div className="space-y-1">
                         <div className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Market Logic</div>
                         <div className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase italic">{bet.market}</div>
                       </div>
                       <div className="text-right">
                         <div className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Value Edge</div>
                         <div className="text-3xl font-black text-emerald-500 flex items-center justify-end gap-1">
                            <TrendingUp className="w-4 h-4 mb-2" />
                            +{bet.edge.toFixed(1)}<span className="text-lg mb-1">%</span>
                         </div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 relative z-10">
                       <ValueTag label="CALC. PROB" value={(bet.prob * 100).toFixed(0) + '%'} color="emerald" />
                       <ValueTag label="MARKET ODDS" value={bet.odds.toFixed(2)} color="neutral" />
                       <ValueTag label="FAIR ODDS" value={(1 / bet.prob).toFixed(2)} color="emerald" />
                    </div>
                    
                    {i === 0 && (
                      <div className="mt-6 flex items-center justify-center p-2 rounded-2xl bg-emerald-500 text-neutral-950 font-black text-[10px] uppercase tracking-tighter">
                         Highly Recommended Strategy
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {prediction.valueBets.length === 0 && (
                <div className="col-span-full py-20 text-center bg-neutral-900/20 border-2 border-dashed border-neutral-800 rounded-[3rem]">
                   <Info className="w-10 h-10 text-neutral-800 mx-auto mb-4" />
                   <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">No mathematical edge detected for these odds.</p>
                   <p className="text-[10px] text-neutral-700 uppercase mt-2">Try adjusting the team strengths or market odds.</p>
                </div>
              )}
            </div>
          </section>

          {/* Tips / Disclaimer */}
          <section className="bg-neutral-900/30 border border-neutral-800 divide-y divide-neutral-800 rounded-[2.5rem]">
             <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                     <AlertTriangle className="w-5 h-5 text-amber-400" />
                   </div>
                   <h4 className="font-black text-neutral-200 uppercase tracking-tight">Virtual RNG Disclaimer</h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                  Les résultats du Virtual Football de Bet261 sont générés par un algorithme de nombres aléatoires (RNG). 
                  Cet outil utilise la distribution de Poisson pour estimer les chances mathématiques et ne garantit en aucun cas un gain. 
                  Millez de manière responsable (Min 21+).
                </p>
             </div>
             <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <History className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-neutral-600 uppercase block">Engine Sensitivity</span>
                    <span className="text-sm font-bold text-neutral-300 italic">Poisson-V3 Multi-Core</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="px-6 py-3 rounded-2xl border border-neutral-800 text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors" onClick={() => window.location.reload()}>
                     Reset Engine
                   </button>
                   <button className="px-6 py-3 rounded-2xl bg-white text-neutral-950 text-xs font-black uppercase tracking-widest shadow-lg shadow-white/5 hover:scale-105 transition-all">
                     Export Analysis
                   </button>
                </div>
             </div>
          </section>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-neutral-900 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Integrated Intelligence by Google Gemini</span>
           </div>
           <div className="flex gap-8">
              <span className="text-[9px] font-bold uppercase">Poisson Logic v3.2</span>
              <span className="text-[9px] font-bold uppercase">RNG Scanner Active</span>
              <span className="text-[9px] font-bold uppercase">© 2026 Virtual Pro Predictor</span>
           </div>
        </div>
      </footer>
    </div>
  );
}

function StatRow({ label, value, progress, color }: { label: string, value: string, progress: number, color: 'emerald' | 'neutral' }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-black text-neutral-100 italic">{value}</span>
      </div>
      <div className="h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          className={`h-full rounded-full ${color === 'emerald' ? 'bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-neutral-600'}`}
        />
      </div>
    </div>
  )
}

function ValueTag({ label, value, color }: { label: string, value: string, color: 'emerald' | 'neutral' }) {
  return (
    <div className="bg-neutral-950 p-4 rounded-[1.5rem] border border-neutral-800/80 transition-transform hover:scale-105">
      <span className="text-[9px] text-neutral-600 block uppercase font-black mb-1 tracking-tighter">{label}</span>
      <span className={`text-sm font-mono font-black ${color === 'emerald' ? 'text-emerald-400' : 'text-neutral-400'}`}>{value}</span>
    </div>
  )
}
