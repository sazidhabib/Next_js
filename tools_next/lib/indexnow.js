// IndexNow API Utility for Bing, Yandex, and AI Search Engines
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tools.nextdigit.dev'
export const DEFAULT_INDEXNOW_KEY = 'c1de78c6886e4d5091abfileconvert2026'

export function getIndexNowKey() {
  return process.env.INDEXNOW_KEY || DEFAULT_INDEXNOW_KEY
}

export function getIndexNowKeyLocation() {
  const key = getIndexNowKey()
  return `${BASE_URL}/${key}.txt`
}

/**
 * Submit URLs to the IndexNow protocol (Bing, Yandex, Naver, Seznam, etc.)
 * @param {string[]} urlList - Array of URLs to submit for instant indexing
 * @returns {Promise<{ success: boolean, status: number, data?: any, error?: string }>}
 */
export async function submitToIndexNow(urlList = []) {
  if (!urlList || urlList.length === 0) {
    return { success: false, error: 'No URLs provided for indexing' }
  }

  const host = new URL(BASE_URL).host
  const key = getIndexNowKey()
  const keyLocation = getIndexNowKeyLocation()

  // Format URLs to ensure absolute path
  const formattedUrls = urlList.map((url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
  })

  const payload = {
    host,
    key,
    keyLocation,
    urlList: formattedUrls,
  }

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    })

    // IndexNow returns 200 OK or 202 Accepted on success
    if (response.status === 200 || response.status === 202) {
      return {
        success: true,
        status: response.status,
        submittedCount: formattedUrls.length,
        message: `Successfully notified IndexNow for ${formattedUrls.length} URLs`,
      }
    }

    const text = await response.text()
    return {
      success: false,
      status: response.status,
      error: `IndexNow returned status ${response.status}: ${text}`,
    }
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to connect to IndexNow API',
    }
  }
}
