import { initDb, Setting } from '@/lib/db/models/index';

const DEFAULT_SETTINGS = {
  appName: 'HRMS Pro',
  appSubtitle: 'Enterprise Compliance',
  companyName: 'The Royal Kitchen Hospitality Ltd',
  appLogo: '',
  sponsorLicenceNo: '0W01ABC89',
  complianceOfficer: 'James Wilson',
  complianceEmail: 'compliance@hrms.local',
  currencySymbol: '£',
  visaWarningDays: 90,
  rtwWarningDays: 30,
};

let cachedSettings = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 5000; // Cache for 5s in memory

export async function getServerSettings() {
  const now = Date.now();
  if (cachedSettings && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedSettings;
  }

  try {
    await initDb();
    const setting = await Setting.findOne();
    if (setting) {
      cachedSettings = JSON.parse(JSON.stringify(setting.get({ plain: true })));
      lastFetchTime = now;
      return cachedSettings;
    }
  } catch (error) {
    console.warn('getServerSettings fallback:', error.message);
  }

  return cachedSettings || DEFAULT_SETTINGS;
}

export function invalidateServerSettingsCache() {
  cachedSettings = null;
  lastFetchTime = 0;
}
