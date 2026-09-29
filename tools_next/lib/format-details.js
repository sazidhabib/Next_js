// Format specifications, MIME types, and technical attributes for programmatic SEO
import { getFormat, FORMAT_IDS_BY_CATEGORY, CATEGORIES } from './formats.js'

export const FORMAT_SPECS = {
  // Documents
  pdf: {
    developer: 'Adobe Systems / ISO',
    mime: 'application/pdf',
    type: 'Document / Page Layout',
    lossy: 'Lossless (Text/Vector) / Variable',
    transparency: 'Yes',
    bestFor: 'Universal document sharing, printing, archiving, and digital signing',
    released: '1993',
  },
  docx: {
    developer: 'Microsoft Corporation',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    type: 'Word Processing Document',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Editing text documents, office reporting, and team collaboration',
    released: '2007',
  },
  doc: {
    developer: 'Microsoft Corporation',
    mime: 'application/msword',
    type: 'Word Processing Document (Legacy)',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Legacy Microsoft Word compatibility',
    released: '1983',
  },
  txt: {
    developer: 'Standard / RFC 2046',
    mime: 'text/plain',
    type: 'Plain Text',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Unformatted notes, coding scripts, and raw text storage',
    released: '1960s',
  },
  rtf: {
    developer: 'Microsoft Corporation',
    mime: 'application/rtf',
    type: 'Rich Text Format',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Cross-platform styled document exchange without proprietary macros',
    released: '1987',
  },
  odt: {
    developer: 'OASIS / Sun Microsystems',
    mime: 'application/vnd.oasis.opendocument.text',
    type: 'OpenDocument Text',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Open-source office productivity (LibreOffice / OpenOffice)',
    released: '2005',
  },
  html: {
    developer: 'W3C / WHATWG',
    mime: 'text/html',
    type: 'Hypertext Markup Language',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Web pages, email templates, and online documentation',
    released: '1993',
  },
  md: {
    developer: 'John Gruber / Aaron Swartz',
    mime: 'text/markdown',
    type: 'Markdown Document',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Technical documentation, README files, and developer notes',
    released: '2004',
  },

  // Images
  png: {
    developer: 'PNG Development Group / W3C',
    mime: 'image/png',
    type: 'Raster Image',
    lossy: 'Lossless',
    transparency: 'Yes (Full 8-bit Alpha Channel)',
    bestFor: 'Logos, graphics, screenshots, and images with transparent backgrounds',
    released: '1996',
  },
  jpg: {
    developer: 'Joint Photographic Experts Group (JPEG)',
    mime: 'image/jpeg',
    type: 'Raster Image',
    lossy: 'Lossy',
    transparency: 'No',
    bestFor: 'Photographs, complex artwork, and small web image file sizes',
    released: '1992',
  },
  jpeg: {
    developer: 'Joint Photographic Experts Group (JPEG)',
    mime: 'image/jpeg',
    type: 'Raster Image',
    lossy: 'Lossy',
    transparency: 'No',
    bestFor: 'Digital photography, web publishing, and social media',
    released: '1992',
  },
  webp: {
    developer: 'Google LLC',
    mime: 'image/webp',
    type: 'Next-Gen Raster Image',
    lossy: 'Both (Lossy & Lossless)',
    transparency: 'Yes (Alpha Channel)',
    bestFor: 'High-speed modern web delivery with 30%+ smaller file sizes than PNG/JPEG',
    released: '2010',
  },
  avif: {
    developer: 'Alliance for Open Media (AOMedia)',
    mime: 'image/avif',
    type: 'Next-Gen AV1 Image Format',
    lossy: 'Both (Lossy & Lossless)',
    transparency: 'Yes (HDR & Alpha)',
    bestFor: 'Ultra-compressed next-generation web images with superior fidelity',
    released: '2019',
  },
  svg: {
    developer: 'World Wide Web Consortium (W3C)',
    mime: 'image/svg+xml',
    type: 'Vector Graphic (XML)',
    lossy: 'Lossless (Vector Resolution-Independent)',
    transparency: 'Yes',
    bestFor: 'Icons, UI elements, responsive logos, and scalable illustrations',
    released: '2001',
  },
  gif: {
    developer: 'CompuServe (Steve Wilhite)',
    mime: 'image/gif',
    type: 'Animated Raster Graphic',
    lossy: 'Lossless (256 Colors)',
    transparency: 'Yes (1-bit index)',
    bestFor: 'Short animations, looping memes, and simple web graphics',
    released: '1987',
  },
  heic: {
    developer: 'MPEG / Apple Inc.',
    mime: 'image/heic',
    type: 'High Efficiency Image Container',
    lossy: 'Lossy / Lossless (HEVC based)',
    transparency: 'Yes',
    bestFor: 'iPhone/iPad photos capturing maximum dynamic range at half JPEG size',
    released: '2015',
  },
  ico: {
    developer: 'Microsoft Corporation',
    mime: 'image/vnd.microsoft.icon',
    type: 'Icon Image File',
    lossy: 'Lossless',
    transparency: 'Yes',
    bestFor: 'Website favicons and desktop application icons',
    released: '1985',
  },
  bmp: {
    developer: 'Microsoft Corporation',
    mime: 'image/bmp',
    type: 'Bitmap Graphic',
    lossy: 'Uncompressed',
    transparency: 'Limited',
    bestFor: 'Raw uncompressed image editing and legacy Windows graphics',
    released: '1985',
  },
  tiff: {
    developer: 'Aldus / Adobe Systems',
    mime: 'image/tiff',
    type: 'Raster Graphics Image',
    lossy: 'Lossless / Uncompressed',
    transparency: 'Yes',
    bestFor: 'High-end printing, scanning, medical imaging, and professional photography',
    released: '1986',
  },

  // Audio
  mp3: {
    developer: 'Fraunhofer IIS / ISO',
    mime: 'audio/mpeg',
    type: 'Compressed Audio',
    lossy: 'Lossy',
    transparency: 'N/A',
    bestFor: 'Universal audio playback, music streaming, podcasts, and audiobooks',
    released: '1993',
  },
  wav: {
    developer: 'Microsoft & IBM',
    mime: 'audio/wav',
    type: 'Uncompressed PCM Audio',
    lossy: 'Lossless (Uncompressed)',
    transparency: 'N/A',
    bestFor: 'Studio recording, professional audio editing, and lossless archiving',
    released: '1991',
  },
  flac: {
    developer: 'Xiph.Org Foundation',
    mime: 'audio/flac',
    type: 'Free Lossless Audio Codec',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Audiophile listening and bit-perfect music preservation at ~50% WAV size',
    released: '2001',
  },
  aac: {
    developer: 'Bell Labs, Fraunhofer, Dolby, Sony, Nokia',
    mime: 'audio/aac',
    type: 'Advanced Audio Coding',
    lossy: 'Lossy',
    transparency: 'N/A',
    bestFor: 'Apple Music, YouTube streaming, and superior quality at low bitrates',
    released: '1997',
  },
  m4a: {
    developer: 'Apple Inc.',
    mime: 'audio/mp4',
    type: 'MPEG-4 Audio Layer',
    lossy: 'Lossy (AAC) / ALAC',
    transparency: 'N/A',
    bestFor: 'iTunes music, iOS voice memos, and Apple ecosystem playback',
    released: '2004',
  },
  ogg: {
    developer: 'Xiph.Org Foundation',
    mime: 'audio/ogg',
    type: 'Ogg Vorbis Audio',
    lossy: 'Lossy',
    transparency: 'N/A',
    bestFor: 'Open-source game sound effects, Spotify streaming, and web audio',
    released: '2000',
  },

  // Video
  mp4: {
    developer: 'ISO / IEC / Moving Picture Experts Group',
    mime: 'video/mp4',
    type: 'MPEG-4 Part 14 Video Container',
    lossy: 'Lossy (H.264 / H.265)',
    transparency: 'No',
    bestFor: 'Universal video streaming, social media uploads, and smartphone playback',
    released: '2001',
  },
  mkv: {
    developer: 'Matroska Open Source Group',
    mime: 'video/x-matroska',
    type: 'Matroska Multimedia Container',
    lossy: 'Flexible (Supports any codec)',
    transparency: 'No',
    bestFor: 'High-definition movies with multiple audio tracks, chapter marks, and subtitles',
    released: '2002',
  },
  mov: {
    developer: 'Apple Inc.',
    mime: 'video/quicktime',
    type: 'QuickTime Movie',
    lossy: 'Lossy / ProRes Lossless',
    transparency: 'Yes (ProRes 4444)',
    bestFor: 'Professional video editing in Final Cut Pro, Premiere, and macOS playback',
    released: '1991',
  },
  avi: {
    developer: 'Microsoft Corporation',
    mime: 'video/x-msvideo',
    type: 'Audio Video Interleave',
    lossy: 'Lossy / Uncompressed',
    transparency: 'No',
    bestFor: 'Legacy PC media playback and raw video capture',
    released: '1992',
  },
  webm: {
    developer: 'Google LLC',
    mime: 'video/webm',
    type: 'Open Web Media Video',
    lossy: 'Lossy (VP8 / VP9 / AV1)',
    transparency: 'Yes (Alpha channel video)',
    bestFor: 'HTML5 web video, transparent overlays, and lightweight browser playback',
    released: '2010',
  },

  // Spreadsheets
  xlsx: {
    developer: 'Microsoft Corporation',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    type: 'Excel XML Spreadsheet',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Financial modeling, data analytics, formulas, charts, and business accounting',
    released: '2007',
  },
  xls: {
    developer: 'Microsoft Corporation',
    mime: 'application/vnd.ms-excel',
    type: 'Excel Binary Spreadsheet (Legacy)',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Legacy Microsoft Excel compatibility',
    released: '1987',
  },
  csv: {
    developer: 'Standard / RFC 4180',
    mime: 'text/csv',
    type: 'Comma-Separated Values',
    lossy: 'Lossless (Raw data only)',
    transparency: 'N/A',
    bestFor: 'Database export/import, data science (Python/R), and universal tabular data exchange',
    released: '1972',
  },

  // Slides
  pptx: {
    developer: 'Microsoft Corporation',
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    type: 'PowerPoint XML Presentation',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Pitch decks, business presentations, slide animations, and school lectures',
    released: '2007',
  },
  ppt: {
    developer: 'Microsoft Corporation',
    mime: 'application/vnd.ms-powerpoint',
    type: 'PowerPoint Presentation (Legacy)',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Legacy PowerPoint presentation support',
    released: '1987',
  },

  // Ebooks
  epub: {
    developer: 'International Digital Publishing Forum (IDPF)',
    mime: 'application/epub+zip',
    type: 'Electronic Publication',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Reflowable eBooks on Apple Books, Kobo, Google Play Books, and e-readers',
    released: '2007',
  },
  mobi: {
    developer: 'Mobipocket / Amazon.com',
    mime: 'application/x-mobipocket-ebook',
    type: 'Mobipocket eBook',
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: 'Kindle e-readers and legacy Amazon book devices',
    released: '2000',
  },

  // Archives
  zip: {
    developer: 'Phil Katz (PKWARE)',
    mime: 'application/zip',
    type: 'Compressed Archive',
    lossy: 'Lossless (DEFLATE / LZMA)',
    transparency: 'N/A',
    bestFor: 'Universal file compression, bundle downloading, and email attachments',
    released: '1989',
  },
  tar: {
    developer: 'AT&T Bell Laboratories',
    mime: 'application/x-tar',
    type: 'Tape Archive (Uncompressed)',
    lossy: 'Lossless (Uncompressed)',
    transparency: 'N/A',
    bestFor: 'Linux/Unix file packaging and preservation of file permissions',
    released: '1979',
  },
  '7z': {
    developer: 'Igor Pavlov',
    mime: 'application/x-7z-compressed',
    type: '7-Zip Compressed Archive',
    lossy: 'Lossless (LZMA2)',
    transparency: 'N/A',
    bestFor: 'Maximum compression ratios and AES-256 encrypted archives',
    released: '1999',
  },
}

export function getFormatSpec(id) {
  if (!id) return null
  const key = id.toLowerCase()
  if (FORMAT_SPECS[key]) return FORMAT_SPECS[key]
  
  const baseFmt = getFormat(id)
  return {
    developer: 'Standard Format Specification',
    mime: `application/x-${key}`,
    type: `${baseFmt?.name || key.toUpperCase()} File`,
    lossy: 'Lossless',
    transparency: 'N/A',
    bestFor: `${baseFmt?.desc || key.toUpperCase()} storage and data interchange`,
    released: 'Standard Specification',
  }
}

export function generatePairFAQs(fromFmt, toFmt) {
  return [
    {
      question: `How do I convert ${fromFmt.name} to ${toFmt.name} for free?`,
      answer: `You can convert ${fromFmt.name} to ${toFmt.name} online for free using FileConvert: 1) Upload your ${fromFmt.name} file, 2) Select ${toFmt.name} as output format, 3) Click Convert and download your converted ${toFmt.name} file in seconds. No software installation or sign-up required.`,
    },
    {
      question: `Will converting ${fromFmt.name} to ${toFmt.name} lose quality?`,
      answer: `FileConvert uses optimized conversion engines to preserve maximum visual fidelity, layout structure, and audio/video bitrate. Whenever converting between compatible formats, your file is processed with lossless or highest-grade encoding settings.`,
    },
    {
      question: `Are my uploaded ${fromFmt.name} files safe and private?`,
      answer: `Yes, your privacy is our top priority. All file transfers are secured with 256-bit SSL encryption. Your uploaded ${fromFmt.name} files and converted ${toFmt.name} files are automatically and permanently deleted from our servers within 60 minutes. We never view, share, or store your files.`,
    },
    {
      question: `Can I convert ${fromFmt.name} to ${toFmt.name} on iPhone, Android, or Mac?`,
      answer: `Yes! FileConvert is a browser-based cloud tool. It works seamlessly across all platforms including iPhone (iOS), Android, Windows, Mac, Linux, and ChromeOS without installing any apps.`,
    },
    {
      question: `What is the maximum file size for converting ${fromFmt.name} files?`,
      answer: `Free users can convert files up to 100MB per file with batch processing. For larger files and unlimited concurrent conversions, check our flexible Pro plans.`,
    },
  ]
}

export function generateFormatHubFAQs(fmt) {
  return [
    {
      question: `What is a ${fmt.name} file?`,
      answer: `A ${fmt.name} file (${fmt.ext}) is a ${fmt.desc}. Our free converter allows you to convert ${fmt.name} files to and from dozens of popular formats including PDF, JPG, PNG, MP4, and more directly in your browser.`,
    },
    {
      question: `How to convert ${fmt.name} files online?`,
      answer: `Simply drag and drop your ${fmt.name} file into the upload zone above, pick your desired target format, and click Convert. Your file will be processed in the cloud and available for instant download.`,
    },
    {
      question: `Is it safe to convert ${fmt.name} files on FileConvert?`,
      answer: `Absolutely. We use enterprise-grade 256-bit SSL encryption for all uploads and downloads. All files are automatically deleted after 60 minutes, ensuring 100% privacy and confidentiality.`,
    },
    {
      question: `Do I need to install any software or create an account?`,
      answer: `No software, plugins, or registration is required. FileConvert runs entirely in the cloud on any desktop, tablet, or smartphone browser.`,
    },
  ]
}

export function generateCategoryHubFAQs(category) {
  return [
    {
      question: `What is the best online ${category.name} converter?`,
      answer: `FileConvert provides a fast, free, and secure online ${category.name.toLowerCase()} converter supporting over ${category.count || category.formats?.length || '20+'} different ${category.name.toLowerCase()} formats with zero software installation.`,
    },
    {
      question: `How many ${category.name.toLowerCase()} formats are supported?`,
      answer: `We support all popular and specialized ${category.name.toLowerCase()} formats including ${category.formats?.slice(0, 6).map((f) => f.name).join(', ') || 'all standard formats'} and many more.`,
    },
    {
      question: `Is file conversion in the ${category.name} category free?`,
      answer: `Yes, 100% free! You can batch convert ${category.name.toLowerCase()} files up to 100MB each with high speed, secure 256-bit SSL encryption, and automatic file cleanup after 60 minutes.`,
    },
    {
      question: `Can I convert ${category.name.toLowerCase()} files on mobile devices?`,
      answer: `Yes. FileConvert works on any device with a modern web browser, including iOS (iPhone/iPad), Android, Mac, Windows, and Linux.`,
    },
  ]
}

