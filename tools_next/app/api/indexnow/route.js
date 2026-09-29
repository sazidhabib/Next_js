import { NextResponse } from 'next/server'
import { submitToIndexNow, getIndexNowKey, getIndexNowKeyLocation } from '@/lib/indexnow'
import { POPULAR_CONVERSIONS, getAllCategoryHubSlugs } from '@/lib/formats'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tools.nextdigit.dev'

export async function GET() {
  return NextResponse.json({
    service: 'IndexNow Instant Search Indexing',
    engine: 'Bing, Yandex, Naver, Seznam, ChatGPT Search, Copilot',
    key: getIndexNowKey(),
    keyLocation: getIndexNowKeyLocation(),
    status: 'Ready',
    instructions: {
      submitSingle: 'POST { "urls": ["/webp-to-png"] }',
      submitBatch: 'POST { "urls": ["/image-converter", "/pdf-to-docx", "/mp4-to-mp3"] }',
      submitTopPopular: 'POST { "submitTopTier": true }',
    },
  })
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    let urlsToSubmit = []

    if (body.submitTopTier) {
      // Gather top tier URLs (Categories + Top Popular Conversions)
      const categories = getAllCategoryHubSlugs().map((slug) => `${BASE_URL}/${slug}`)
      const popular = POPULAR_CONVERSIONS.map((p) => `${BASE_URL}/${p.from}-to-${p.to}`)
      urlsToSubmit = [`${BASE_URL}/`, ...categories, ...popular]
    } else if (Array.isArray(body.urls) && body.urls.length > 0) {
      urlsToSubmit = body.urls
    } else if (typeof body.url === 'string' && body.url) {
      urlsToSubmit = [body.url]
    } else {
      return NextResponse.json(
        { error: 'Please provide "urls" array or "submitTopTier: true"' },
        { status: 400 }
      )
    }

    const result = await submitToIndexNow(urlsToSubmit)
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
