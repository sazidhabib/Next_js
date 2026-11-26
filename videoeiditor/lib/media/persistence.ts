'use client';

const DB_NAME = 'cineflow_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaBlob(assetId: string, blob: Blob): Promise<void> {
  try {
    const db = await openMediaDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(blob, assetId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (err) {
    console.warn('Unable to persist media blob in IndexedDB:', err);
  }
}

export async function loadMediaBlob(assetId: string): Promise<Blob | null> {
  try {
    const db = await openMediaDB();
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(assetId);
      req.onsuccess = () => resolve(req.result as Blob | undefined);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return blob ?? null;
  } catch (err) {
    console.warn('Unable to load media blob from IndexedDB:', err);
    return null;
  }
}

export async function loadMediaBlobUrl(assetId: string): Promise<string | null> {
  const blob = await loadMediaBlob(assetId);
  return blob ? URL.createObjectURL(blob) : null;
}

export async function deleteMediaBlob(assetId: string): Promise<void> {
  try {
    const db = await openMediaDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(assetId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (err) {
    console.warn('Unable to delete media blob from IndexedDB:', err);
  }
}

const DEFAULT_AUDIO_THUMB =
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80';
const DEFAULT_VIDEO_THUMB =
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=80';

/**
 * Probes real duration and generates a real thumbnail frame for local video/audio/image files.
 */
export async function probeMediaFile(
  file: File,
  objectUrl: string
): Promise<{ duration: number; thumbnail: string; type: 'video' | 'audio' | 'image' }> {
  const type: 'video' | 'audio' | 'image' = file.type.startsWith('video/')
    ? 'video'
    : file.type.startsWith('audio/')
    ? 'audio'
    : 'image';

  if (type === 'image') {
    return { duration: 5, thumbnail: objectUrl, type };
  }

  if (type === 'audio') {
    const duration = await new Promise<number>((resolve) => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.src = objectUrl;
      const cleanup = () => {
        audio.removeAttribute('src');
        audio.load();
      };
      audio.onloadedmetadata = () => {
        const d = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 10;
        cleanup();
        resolve(parseFloat(d.toFixed(2)));
      };
      audio.onerror = () => {
        cleanup();
        resolve(10);
      };
    });
    return { duration, thumbnail: DEFAULT_AUDIO_THUMB, type };
  }

  // Video file: read duration and capture a thumbnail frame
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    let settled = false;
    const finish = (duration: number, thumbnail: string) => {
      if (settled) return;
      settled = true;
      video.removeAttribute('src');
      video.load();
      resolve({
        duration: parseFloat(Math.max(0.5, duration).toFixed(2)),
        thumbnail,
        type,
      });
    };

    const timeout = setTimeout(() => finish(10, DEFAULT_VIDEO_THUMB), 4000);

    video.onloadedmetadata = () => {
      const dur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 10;
      const seekTarget = Math.min(0.5, dur * 0.15);
      video.currentTime = seekTarget;
    };

    video.onseeked = () => {
      clearTimeout(timeout);
      const dur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 10;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 180;
        const ctx = canvas.getContext('2d');
        if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumb = canvas.toDataURL('image/jpeg', 0.72);
          finish(dur, thumb);
          return;
        }
      } catch {
        // Fallback thumbnail if canvas capture fails
      }
      finish(dur, DEFAULT_VIDEO_THUMB);
    };

    video.onerror = () => {
      clearTimeout(timeout);
      finish(10, DEFAULT_VIDEO_THUMB);
    };
  });
}
