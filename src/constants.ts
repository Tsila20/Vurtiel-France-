export interface TeamInfo {
  id: string;
  name: string;
  shortName: string;
  baseAttack: number;
  baseDefense: number;
  color: string;
  logoUrl: string;
  rank: number;
}

export const FRENCH_LEAGUE_TEAMS: TeamInfo[] = [
  { id: 'lille', name: 'Lille OSC', shortName: 'LIL', baseAttack: 1.6, baseDefense: 1.1, color: '#E01E13', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8639.png', rank: 4 },
  { id: 'toulouse', name: 'Toulouse FC', shortName: 'TFC', baseAttack: 1.2, baseDefense: 1.4, color: '#4B367C', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9941.png', rank: 11 },
  { id: 'lens', name: 'RC Lens', shortName: 'RCL', baseAttack: 1.5, baseDefense: 1.0, color: '#EC1C24', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8586.png', rank: 6 },
  { id: 'auxerre', name: 'AJ Auxerre', shortName: 'AJA', baseAttack: 1.1, baseDefense: 1.7, color: '#005CA9', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8590.png', rank: 17 },
  { id: 'marseille', name: 'Olympique de Marseille', shortName: 'OM', baseAttack: 1.9, baseDefense: 1.2, color: '#00ABDF', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8592.png', rank: 3 },
  { id: 'lehavre', name: 'Le Havre AC', shortName: 'HAC', baseAttack: 1.0, baseDefense: 1.8, color: '#005CA9', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8521.png', rank: 15 },
  { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', baseAttack: 2.5, baseDefense: 0.9, color: '#004170', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9847.png', rank: 1 },
  { id: 'brest', name: 'Stade Brestois 29', shortName: 'SB29', baseAttack: 1.4, baseDefense: 1.1, color: '#ED1B24', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8507.png', rank: 5 },
  { id: 'monaco', name: 'AS Monaco', shortName: 'ASM', baseAttack: 2.1, baseDefense: 1.3, color: '#E41C2D', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9829.png', rank: 2 },
  { id: 'strasbourg', name: 'RC Strasbourg', shortName: 'RCSA', baseAttack: 1.3, baseDefense: 1.5, color: '#005CA9', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9849.png', rank: 10 },
  { id: 'angers', name: 'Angers SCO', shortName: 'SCO', baseAttack: 0.9, baseDefense: 1.9, color: '#000000', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8159.png', rank: 18 },
  { id: 'metz', name: 'FC Metz', shortName: 'FCM', baseAttack: 1.0, baseDefense: 1.8, color: '#960032', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8550.png', rank: 16 },
  { id: 'nice', name: 'OGC Nice', shortName: 'OGCN', baseAttack: 1.5, baseDefense: 0.8, color: '#D21D25', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8481.png', rank: 7 },
  { id: 'nantes', name: 'FC Nantes', shortName: 'FCN', baseAttack: 1.1, baseDefense: 1.6, color: '#F7E700', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9830.png', rank: 14 },
  { id: 'lyon', name: 'Olympique Lyonnais', shortName: 'OL', baseAttack: 1.8, baseDefense: 1.4, color: '#DA251D', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9848.png', rank: 8 },
  { id: 'parisfc', name: 'Paris FC', shortName: 'PFC', baseAttack: 1.2, baseDefense: 1.5, color: '#002E61', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8184.png', rank: 12 },
  { id: 'lorient', name: 'FC Lorient', shortName: 'FCL', baseAttack: 1.3, baseDefense: 1.7, color: '#F88E00', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/8682.png', rank: 13 },
  { id: 'rennes', name: 'Stade Rennais FC', shortName: 'SRFC', baseAttack: 1.7, baseDefense: 1.3, color: '#E31E24', logoUrl: 'https://images.fotmob.com/image_resources/logo/teamlogo/9851.png', rank: 9 },
];
