import fs from 'node:fs/promises';
import path from 'node:path';
import { MediaAnalysis } from '../timeline/types';

const ANALYSIS_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), '.cineflow_data', 'analysis');

function getCachePath(assetId: string): string {
  const safeId = assetId.replace(/[^a-zA-Z0-9_-]/g, '') || 'unknown';
  return path.join(ANALYSIS_DIR, `${safeId}.json`);
}

export async function loadCachedAnalysis(assetId: string): Promise<MediaAnalysis | null> {
  try {
    const raw = await fs.readFile(getCachePath(assetId), 'utf8');
    return JSON.parse(raw) as MediaAnalysis;
  } catch {
    return null;
  }
}

export async function saveCachedAnalysis(analysis: MediaAnalysis): Promise<void> {
  await fs.mkdir(ANALYSIS_DIR, { recursive: true });
  await fs.writeFile(getCachePath(analysis.assetId), JSON.stringify(analysis, null, 2), 'utf8');
}
