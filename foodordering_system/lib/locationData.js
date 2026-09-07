// Comprehensive international location data for GloriaFood restaurant setup wizard

export const COUNTRIES_DATA = [
  {
    code: 'US',
    name: 'United States',
    defaultCity: 'New York',
    defaultState: 'New York',
    defaultZip: '10001',
    timezone: 'America/New_York',
    lat: 40.7128,
    lng: -74.006,
    timezones: [
      { value: 'America/New_York', label: 'Eastern Time (ET) - New York, Miami, Atlanta' },
      { value: 'America/Chicago', label: 'Central Time (CT) - Chicago, Dallas, Houston' },
      { value: 'America/Denver', label: 'Mountain Time (MT) - Denver, Salt Lake' },
      { value: 'America/Phoenix', label: 'Mountain Standard Time (No DST) - Arizona' },
      { value: 'America/Los_Angeles', label: 'Pacific Time (PT) - Los Angeles, San Francisco, Seattle' },
      { value: 'America/Anchorage', label: 'Alaska Time (AKT) - Anchorage' },
      { value: 'Pacific/Honolulu', label: 'Hawaii-Aleutian Time (HST) - Honolulu' },
    ],
    states: [
      'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California',
      'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida',
      'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
      'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
      'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
      'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio',
      'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
      'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
      'Vermont', 'Virgin Islands', 'Virginia', 'Washington', 'West Virginia',
      'Wisconsin', 'Wyoming'
    ]
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    defaultCity: 'London',
    defaultState: 'Greater London',
    defaultZip: 'W1D 4PG',
    timezone: 'Europe/London',
    lat: 51.5074,
    lng: -0.1278,
    timezones: [
      { value: 'Europe/London', label: 'Greenwich Mean Time / British Summer Time (GMT/BST)' },
    ],
    states: [
      'Greater London', 'West Midlands', 'Greater Manchester', 'West Yorkshire',
      'Hampshire', 'Surrey', 'Kent', 'Essex', 'Lancashire', 'Merseyside',
      'South Yorkshire', 'Tyne and Wear', 'Staffordshire', 'Nottinghamshire',
      'Scotland - Lothian (Edinburgh)', 'Scotland - Strathclyde (Glasgow)',
      'Scotland - Grampian (Aberdeen)', 'Scotland - Highlands',
      'Wales - South Glamorgan (Cardiff)', 'Wales - Swansea', 'Wales - Newport',
      'Northern Ireland - Belfast', 'Northern Ireland - Derry'
    ]
  },
  {
    code: 'CA',
    name: 'Canada',
    defaultCity: 'Toronto',
    defaultState: 'Ontario',
    defaultZip: 'M5V 2T6',
    timezone: 'America/Toronto',
    lat: 43.6532,
    lng: -79.3832,
    timezones: [
      { value: 'America/St_Johns', label: 'Newfoundland Time (NT) - St. John’s' },
      { value: 'America/Halifax', label: 'Atlantic Time (AT) - Halifax' },
      { value: 'America/Toronto', label: 'Eastern Time (ET) - Toronto, Montreal, Ottawa' },
      { value: 'America/Winnipeg', label: 'Central Time (CT) - Winnipeg' },
      { value: 'America/Edmonton', label: 'Mountain Time (MT) - Calgary, Edmonton' },
      { value: 'America/Vancouver', label: 'Pacific Time (PT) - Vancouver, Victoria' },
    ],
    states: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
      'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
      'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec',
      'Saskatchewan', 'Yukon'
    ]
  },
  {
    code: 'AU',
    name: 'Australia',
    defaultCity: 'Sydney',
    defaultState: 'New South Wales',
    defaultZip: '2000',
    timezone: 'Australia/Sydney',
    lat: -33.8688,
    lng: 151.2093,
    timezones: [
      { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST/AEDT) - Sydney, Melbourne, Canberra' },
      { value: 'Australia/Brisbane', label: 'AEST (No DST) - Brisbane, Gold Coast' },
      { value: 'Australia/Adelaide', label: 'Australian Central Time (ACST/ACDT) - Adelaide' },
      { value: 'Australia/Darwin', label: 'ACST (No DST) - Darwin' },
      { value: 'Australia/Perth', label: 'Australian Western Standard Time (AWST) - Perth' },
      { value: 'Australia/Hobart', label: 'Tasmania Time - Hobart' },
    ],
    states: [
      'Australian Capital Territory', 'New South Wales', 'Northern Territory',
      'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
    ]
  },
  {
    code: 'DE',
    name: 'Germany',
    defaultCity: 'Berlin',
    defaultState: 'Berlin',
    defaultZip: '10115',
    timezone: 'Europe/Berlin',
    lat: 52.52,
    lng: 13.405,
    timezones: [
      { value: 'Europe/Berlin', label: 'Central European Time (CET/CEST) - Berlin, Frankfurt, Munich' },
    ],
    states: [
      'Baden-Württemberg', 'Bavaria (Bayern)', 'Berlin', 'Brandenburg',
      'Bremen', 'Hamburg', 'Hesse (Hessen)', 'Lower Saxony (Niedersachsen)',
      'Mecklenburg-Vorpommern', 'North Rhine-Westphalia (Nordrhein-Westfalen)',
      'Rhineland-Palatinate (Rheinland-Pfalz)', 'Saarland', 'Saxony (Sachsen)',
      'Saxony-Anhalt (Sachsen-Anhalt)', 'Schleswig-Holstein', 'Thuringia (Thüringen)'
    ]
  },
  {
    code: 'FR',
    name: 'France',
    defaultCity: 'Paris',
    defaultState: 'Île-de-France',
    defaultZip: '75001',
    timezone: 'Europe/Paris',
    lat: 48.8566,
    lng: 2.3522,
    timezones: [
      { value: 'Europe/Paris', label: 'Central European Time (CET/CEST) - Paris, Lyon, Marseille' },
    ],
    states: [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany (Bretagne)',
      'Centre-Val de Loire', 'Corsica (Corse)', 'Grand Est', 'Hauts-de-France',
      'Île-de-France (Paris)', 'Normandy (Normandie)', 'Nouvelle-Aquitaine',
      'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
    ]
  },
  {
    code: 'IT',
    name: 'Italy',
    defaultCity: 'Rome',
    defaultState: 'Lazio',
    defaultZip: '00100',
    timezone: 'Europe/Rome',
    lat: 41.9028,
    lng: 12.4964,
    timezones: [
      { value: 'Europe/Rome', label: 'Central European Time (CET/CEST) - Rome, Milan, Florence' },
    ],
    states: [
      'Abruzzo', 'Basilicata', 'Calabria', 'Campania (Naples)', 'Emilia-Romagna (Bologna)',
      'Friuli Venezia Giulia', 'Lazio (Rome)', 'Liguria', 'Lombardy (Milan)',
      'Marche', 'Molise', 'Piedmont (Turin)', 'Puglia', 'Sardinia',
      'Sicily (Palermo)', 'Tuscany (Florence)', 'Trentino-Alto Adige',
      'Umbria', 'Valle d\'Aosta', 'Veneto (Venice)'
    ]
  },
  {
    code: 'ES',
    name: 'Spain',
    defaultCity: 'Madrid',
    defaultState: 'Community of Madrid',
    defaultZip: '28001',
    timezone: 'Europe/Madrid',
    lat: 40.4168,
    lng: -3.7038,
    timezones: [
      { value: 'Europe/Madrid', label: 'Central European Time (CET/CEST) - Madrid, Barcelona, Valencia' },
      { value: 'Atlantic/Canary', label: 'Western European Time (WET/WEST) - Canary Islands' },
    ],
    states: [
      'Andalusia (Seville, Malaga)', 'Aragon', 'Asturias', 'Balearic Islands (Mallorca, Ibiza)',
      'Basque Country (Bilbao, San Sebastian)', 'Canary Islands', 'Cantabria',
      'Castile and León', 'Castilla-La Mancha', 'Catalonia (Barcelona)',
      'Community of Madrid', 'Extremadura', 'Galicia', 'La Rioja',
      'Navarre', 'Region of Murcia', 'Valencian Community'
    ]
  },
  {
    code: 'IN',
    name: 'India',
    defaultCity: 'Mumbai',
    defaultState: 'Maharashtra',
    defaultZip: '400001',
    timezone: 'Asia/Kolkata',
    lat: 19.076,
    lng: 72.8777,
    timezones: [
      { value: 'Asia/Kolkata', label: 'India Standard Time (IST) - Mumbai, Delhi, Bengaluru' },
    ],
    states: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
      'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
      'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
      'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Delhi (NCT)', 'Chandigarh', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
    ]
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    defaultCity: 'Dhaka',
    defaultState: 'Dhaka Division',
    defaultZip: '1212',
    timezone: 'Asia/Dhaka',
    lat: 23.8103,
    lng: 90.4125,
    timezones: [
      { value: 'Asia/Dhaka', label: 'Bangladesh Standard Time (BST) - Dhaka, Chittagong, Sylhet' },
    ],
    states: [
      'Dhaka Division', 'Chattogram Division', 'Sylhet Division',
      'Khulna Division', 'Rajshahi Division', 'Barishal Division',
      'Rangpur Division', 'Mymensingh Division'
    ]
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    defaultCity: 'Dubai',
    defaultState: 'Dubai',
    defaultZip: '00000',
    timezone: 'Asia/Dubai',
    lat: 25.2048,
    lng: 55.2708,
    timezones: [
      { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST) - Dubai, Abu Dhabi, Sharjah' },
    ],
    states: [
      'Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'
    ]
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    defaultCity: 'Riyadh',
    defaultState: 'Riyadh Region',
    defaultZip: '11564',
    timezone: 'Asia/Riyadh',
    lat: 24.7136,
    lng: 46.6753,
    timezones: [
      { value: 'Asia/Riyadh', label: 'Arabia Standard Time (AST) - Riyadh, Jeddah, Mecca' },
    ],
    states: [
      'Riyadh Region', 'Makkah Region (Jeddah, Mecca)', 'Eastern Province (Dammam, Khobar)',
      'Madinah Region', 'Asir Region', 'Tabuk Region', 'Hail Region',
      'Northern Borders', 'Jazan Region', 'Najran Region', 'Al Bahah Region', 'Al Jawf Region', 'Qassim Region'
    ]
  },
  {
    code: 'BR',
    name: 'Brazil',
    defaultCity: 'São Paulo',
    defaultState: 'São Paulo',
    defaultZip: '01000-000',
    timezone: 'America/Sao_Paulo',
    lat: -23.5505,
    lng: -46.6333,
    timezones: [
      { value: 'America/Sao_Paulo', label: 'Brasília Time (BRT) - São Paulo, Rio de Janeiro, Brasília' },
      { value: 'America/Manaus', label: 'Amazon Time (AMT) - Manaus' },
      { value: 'America/Fortaleza', label: 'Northeast Brazil - Fortaleza, Salvador' },
      { value: 'America/Noronha', label: 'Fernando de Noronha Time (FNT)' },
    ],
    states: [
      'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará',
      'Distrito Federal (Brasília)', 'Espírito Santo', 'Goiás', 'Maranhão',
      'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará',
      'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro',
      'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima',
      'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
    ]
  },
  {
    code: 'MX',
    name: 'Mexico',
    defaultCity: 'Mexico City',
    defaultState: 'Mexico City (CDMX)',
    defaultZip: '06000',
    timezone: 'America/Mexico_City',
    lat: 19.4326,
    lng: -99.1332,
    timezones: [
      { value: 'America/Mexico_City', label: 'Central Time (CST) - Mexico City, Guadalajara, Monterrey' },
      { value: 'America/Cancun', label: 'Eastern Time (EST) - Cancun, Quintana Roo' },
      { value: 'America/Tijuana', label: 'Pacific Time (PST) - Tijuana, Baja California' },
      { value: 'America/Hermosillo', label: 'Sonora Standard Time - Hermosillo' },
    ],
    states: [
      'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
      'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
      'Guerrero', 'Hidalgo', 'Jalisco (Guadalajara)', 'Mexico City (CDMX)',
      'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León (Monterrey)', 'Oaxaca',
      'Puebla', 'Querétaro', 'Quintana Roo (Cancun)', 'San Luis Potosí',
      'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
      'Veracruz', 'Yucatán (Mérida)', 'Zacatecas'
    ]
  },
  {
    code: 'SG',
    name: 'Singapore',
    defaultCity: 'Singapore',
    defaultState: 'Central Region',
    defaultZip: '018989',
    timezone: 'Asia/Singapore',
    lat: 1.3521,
    lng: 103.8198,
    timezones: [
      { value: 'Asia/Singapore', label: 'Singapore Standard Time (SGT) - Singapore' },
    ],
    states: [
      'Central Region', 'East Region', 'North Region', 'North-East Region', 'West Region'
    ]
  },
  {
    code: 'MY',
    name: 'Malaysia',
    defaultCity: 'Kuala Lumpur',
    defaultState: 'Kuala Lumpur',
    defaultZip: '50450',
    timezone: 'Asia/Kuala_Lumpur',
    lat: 3.139,
    lng: 101.6869,
    timezones: [
      { value: 'Asia/Kuala_Lumpur', label: 'Malaysia Time (MYT) - Kuala Lumpur, Penang, Johor' },
    ],
    states: [
      'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka',
      'Negeri Sembilan', 'Pahang', 'Penang (Pulau Pinang)', 'Perak', 'Perlis',
      'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
    ]
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    defaultCity: 'Auckland',
    defaultState: 'Auckland',
    defaultZip: '1010',
    timezone: 'Pacific/Auckland',
    lat: -36.8485,
    lng: 174.7633,
    timezones: [
      { value: 'Pacific/Auckland', label: 'New Zealand Standard Time (NZST/NZDT) - Auckland, Wellington' },
      { value: 'Pacific/Chatham', label: 'Chatham Islands Standard Time' },
    ],
    states: [
      'Auckland', 'Bay of Plenty', 'Canterbury (Christchurch)', 'Gisborne',
      'Hawke\'s Bay', 'Manawatū-Whanganui', 'Marlborough', 'Nelson',
      'Northland', 'Otago (Dunedin, Queenstown)', 'Southland', 'Taranaki',
      'Tasman', 'Waikato (Hamilton)', 'Wellington', 'West Coast'
    ]
  },
  {
    code: 'NL',
    name: 'Netherlands',
    defaultCity: 'Amsterdam',
    defaultState: 'North Holland',
    defaultZip: '1012 JS',
    timezone: 'Europe/Amsterdam',
    lat: 52.3676,
    lng: 4.9041,
    timezones: [
      { value: 'Europe/Amsterdam', label: 'Central European Time (CET/CEST) - Amsterdam, Rotterdam, The Hague' },
    ],
    states: [
      'Drenthe', 'Flevoland', 'Friesland', 'Gelderland', 'Groningen',
      'Limburg', 'North Brabant', 'North Holland (Amsterdam)', 'Overijssel',
      'South Holland (Rotterdam, The Hague)', 'Utrecht', 'Zeeland'
    ]
  },
];

// Fallback all standard global timezones
export const GLOBAL_TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'America/New_York (Eastern Time - US & Canada)' },
  { value: 'America/Chicago', label: 'America/Chicago (Central Time - US & Canada)' },
  { value: 'America/Denver', label: 'America/Denver (Mountain Time - US & Canada)' },
  { value: 'America/Phoenix', label: 'America/Phoenix (Arizona - Mountain Standard)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (Pacific Time - US & Canada)' },
  { value: 'America/Anchorage', label: 'America/Anchorage (Alaska Time)' },
  { value: 'Pacific/Honolulu', label: 'Pacific/Honolulu (Hawaii Time)' },
  { value: 'America/Toronto', label: 'America/Toronto (Eastern Canada)' },
  { value: 'America/Vancouver', label: 'America/Vancouver (Pacific Canada)' },
  { value: 'America/Mexico_City', label: 'America/Mexico_City (Central Mexico)' },
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (Brasília Time)' },
  { value: 'America/Buenos_Aires', label: 'America/Buenos_Aires (Argentina)' },
  { value: 'Europe/London', label: 'Europe/London (GMT / BST - UK & Ireland)' },
  { value: 'Europe/Dublin', label: 'Europe/Dublin (Irish Standard Time)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET / CEST - France)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET / CEST - Germany)' },
  { value: 'Europe/Rome', label: 'Europe/Rome (CET / CEST - Italy)' },
  { value: 'Europe/Madrid', label: 'Europe/Madrid (CET / CEST - Spain)' },
  { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam (CET / CEST - Netherlands)' },
  { value: 'Europe/Brussels', label: 'Europe/Brussels (CET / CEST - Belgium)' },
  { value: 'Europe/Zurich', label: 'Europe/Zurich (CET / CEST - Switzerland)' },
  { value: 'Europe/Vienna', label: 'Europe/Vienna (CET / CEST - Austria)' },
  { value: 'Europe/Stockholm', label: 'Europe/Stockholm (CET / CEST - Sweden)' },
  { value: 'Europe/Athens', label: 'Europe/Athens (EET / EEST - Greece)' },
  { value: 'Europe/Istanbul', label: 'Europe/Istanbul (Turkey Time)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (Gulf Standard Time - UAE)' },
  { value: 'Asia/Riyadh', label: 'Asia/Riyadh (Arabia Standard Time - Saudi Arabia)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (India Standard Time)' },
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (Bangladesh Standard Time)' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok (Indochina Time - Thailand, Vietnam)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (Singapore Standard Time)' },
  { value: 'Asia/Kuala_Lumpur', label: 'Asia/Kuala_Lumpur (Malaysia Time)' },
  { value: 'Asia/Hong_Kong', label: 'Asia/Hong_Kong (Hong Kong Time)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (Japan Standard Time)' },
  { value: 'Asia/Seoul', label: 'Asia/Seoul (Korea Standard Time)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST / AEDT - Sydney, Melbourne)' },
  { value: 'Australia/Brisbane', label: 'Australia/Brisbane (AEST - Brisbane)' },
  { value: 'Australia/Adelaide', label: 'Australia/Adelaide (ACST / ACDT)' },
  { value: 'Australia/Perth', label: 'Australia/Perth (AWST - Perth)' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZST / NZDT - New Zealand)' },
];
