export interface LLGInfo {
  id: string;
  code: string;
  name: string;
  type: 'RURAL' | 'URBAN';
  headquarters: string;
  wardsCount: number;
  description: string;
  defaultWards: string[];
}

export const BULOLO_LLGS: LLGInfo[] = [
  {
    id: 'llg-mumeng',
    code: 'MUMENG',
    name: 'Mumeng Rural LLG',
    type: 'RURAL',
    headquarters: 'Mumeng Station',
    wardsCount: 20,
    description: 'Encompassing the highway corridor, Zenag poultry & agricultural hub, Sambio, Patep, and surrounding mountainous communities.',
    defaultWards: [
      'Ward 01 - Sambio',
      'Ward 02 - Zenag',
      'Ward 03 - Patep',
      'Ward 04 - Kumalu',
      'Ward 05 - Mumeng Station',
      'Ward 06 - Bangalum',
      'Ward 07 - Towang',
      'Ward 08 - Yanta'
    ]
  },
  {
    id: 'llg-watut',
    code: 'WATUT',
    name: 'Watut Rural LLG',
    type: 'RURAL',
    headquarters: 'Maralina',
    wardsCount: 16,
    description: 'Covers Upper, Middle, and Lower Watut River basins, rich in alluvial gold, cocoa, coffee, and river valley communities.',
    defaultWards: [
      'Ward 01 - Upper Watut / Akikanda',
      'Ward 02 - Middle Watut / Maralina',
      'Ward 03 - Lower Watut / Tsile Tsile',
      'Ward 04 - Kapau',
      'Ward 05 - Dangal',
      'Ward 06 - Minjiman'
    ]
  },
  {
    id: 'llg-buang',
    code: 'BUANG',
    name: 'Buang Rural LLG',
    type: 'RURAL',
    headquarters: 'Mangga',
    wardsCount: 18,
    description: 'Renowned for highland vegetable cultivation, Arabica coffee, rugged mountain ridges, and strong village cooperative traditions.',
    defaultWards: [
      'Ward 01 - Mambump',
      'Ward 02 - Papiol',
      'Ward 03 - Mangga Station',
      'Ward 04 - Saganing',
      'Ward 05 - Dawot',
      'Ward 06 - Kaisenik (Buang)'
    ]
  },
  {
    id: 'llg-bulolo-urban',
    code: 'BULOLO_URBAN',
    name: 'Bulolo Urban LLG',
    type: 'URBAN',
    headquarters: 'Bulolo Town Civic Centre',
    wardsCount: 6,
    description: 'The administrative, commercial, timber milling, forestry, and educational hub of Bulolo District.',
    defaultWards: [
      'Ward 01 - Bulolo Central / Forest Admin',
      'Ward 02 - Golf Club / Residential',
      'Ward 03 - Compound & Market Area',
      'Ward 04 - Forestry College Zone',
      'Ward 05 - Post Office & Commercial Sector',
      'Ward 06 - Settlement & Outer Periphery'
    ]
  }
];

export const DISTRICT_METADATA = {
  country: 'Papua New Guinea',
  province: 'Morobe Province',
  district: 'Bulolo District',
  capital: 'Bulolo Town',
  mpOffice: 'Bulolo District Administration & Parliamentary Electorate Office',
  currency: 'PGK',
  currencySymbol: 'K',
  postalCode: '422',
  emergencyNumbers: {
    police: '+675 474 5222',
    hospital: '+675 474 5234',
    disasterOffice: '+675 474 5000'
  }
};
