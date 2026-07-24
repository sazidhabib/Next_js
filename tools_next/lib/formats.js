export const CATEGORIES = {
  documents: { name: 'Documents', icon: '📄', count: 23 },
  images: { name: 'Images', icon: '🖼️', count: 42 },
  video: { name: 'Video', icon: '🎬', count: 28 },
  audio: { name: 'Audio', icon: '🎵', count: 21 },
  spreadsheets: { name: 'Spreadsheets', icon: '📊', count: 8 },
  slides: { name: 'Slides', icon: '📽️', count: 11 },
  ebooks: { name: 'E-books', icon: '📚', count: 22 },
  archives: { name: 'Archives', icon: '📦', count: 39 },
  vector: { name: 'Vector', icon: '✏️', count: 10 },
  cad: { name: 'CAD', icon: '📐', count: 3 },
  fonts: { name: 'Fonts', icon: '🔤', count: 5 },
}

export const FORMATS = {
  documents: [
    { id: 'abw', name: 'ABW', ext: '.abw', desc: 'AbiWord Document' },
    { id: 'djvu', name: 'DJVU', ext: '.djvu', desc: 'DjVu Image' },
    { id: 'doc', name: 'DOC', ext: '.doc', desc: 'Microsoft Word (legacy)' },
    { id: 'docm', name: 'DOCM', ext: '.docm', desc: 'Microsoft Word Macro' },
    { id: 'docx', name: 'DOCX', ext: '.docx', desc: 'Microsoft Word' },
    { id: 'dot', name: 'DOT', ext: '.dot', desc: 'Word Dot Template' },
    { id: 'dotx', name: 'DOTX', ext: '.dotx', desc: 'Word XML Template' },
    { id: 'html', name: 'HTML', ext: '.html', desc: 'HyperText Markup Language' },
    { id: 'hwp', name: 'HWP', ext: '.hwp', desc: 'Haansoft Word Processor' },
    { id: 'hwpx', name: 'HWPX', ext: '.hwpx', desc: 'Haansoft Word Processor XML' },
    { id: 'lwp', name: 'LWP', ext: '.lwp', desc: 'Lotus Word Pro' },
    { id: 'md', name: 'MD', ext: '.md', desc: 'Markdown' },
    { id: 'odt', name: 'ODT', ext: '.odt', desc: 'OpenDocument Text' },
    { id: 'pages', name: 'PAGES', ext: '.pages', desc: 'Apple Pages' },
    { id: 'pdf', name: 'PDF', ext: '.pdf', desc: 'Portable Document Format' },
    { id: 'rst', name: 'RST', ext: '.rst', desc: 'reStructuredText' },
    { id: 'rtf', name: 'RTF', ext: '.rtf', desc: 'Rich Text Format' },
    { id: 'sdw', name: 'SDW', ext: '.sdw', desc: 'StarWriter Document' },
    { id: 'tex', name: 'TEX', ext: '.tex', desc: 'LaTeX Document' },
    { id: 'txt', name: 'TXT', ext: '.txt', desc: 'Plain Text' },
    { id: 'wpd', name: 'WPD', ext: '.wpd', desc: 'WordPerfect Document' },
    { id: 'wps', name: 'WPS', ext: '.wps', desc: 'Microsoft Works Document' },
    { id: 'zabw', name: 'ZABW', ext: '.zabw', desc: 'AbiWord Compressed' },
  ],
  images: [
    { id: 'ai', name: 'AI', ext: '.ai', desc: 'Adobe Illustrator' },
    { id: 'apng', name: 'APNG', ext: '.apng', desc: 'Animated PNG' },
    { id: 'arw', name: 'ARW', ext: '.arw', desc: 'Sony Raw Image' },
    { id: 'avif', name: 'AVIF', ext: '.avif', desc: 'AV1 Image Format' },
    { id: 'bmp', name: 'BMP', ext: '.bmp', desc: 'Bitmap Image' },
    { id: 'cr2', name: 'CR2', ext: '.cr2', desc: 'Canon Raw Image' },
    { id: 'cr3', name: 'CR3', ext: '.cr3', desc: 'Canon Raw Image (new)' },
    { id: 'crw', name: 'CRW', ext: '.crw', desc: 'Canon Raw Image (old)' },
    { id: 'dcr', name: 'DCR', ext: '.dcr', desc: 'Kodak Raw Image' },
    { id: 'dng', name: 'DNG', ext: '.dng', desc: 'Digital Negative' },
    { id: 'erf', name: 'ERF', ext: '.erf', desc: 'Epson Raw Image' },
    { id: 'gif', name: 'GIF', ext: '.gif', desc: 'Graphics Interchange Format' },
    { id: 'heic', name: 'HEIC', ext: '.heic', desc: 'High Efficiency Image' },
    { id: 'heif', name: 'HEIF', ext: '.heif', desc: 'High Efficiency Image Format' },
    { id: 'ico', name: 'ICO', ext: '.ico', desc: 'Icon File' },
    { id: 'jfif', name: 'JFIF', ext: '.jfif', desc: 'JPEG File Interchange' },
    { id: 'jpeg', name: 'JPEG', ext: '.jpeg', desc: 'Joint Photographic Experts Group' },
    { id: 'jpg', name: 'JPG', ext: '.jpg', desc: 'JPEG Image' },
    { id: 'mos', name: 'MOS', ext: '.mos', desc: 'Leaf Raw Image' },
    { id: 'mrw', name: 'MRW', ext: '.mrw', desc: 'Minolta Raw Image' },
    { id: 'nef', name: 'NEF', ext: '.nef', desc: 'Nikon Raw Image' },
    { id: 'odd', name: 'ODD', ext: '.odd', desc: 'OpenDocument Drawing' },
    { id: 'orf', name: 'ORF', ext: '.orf', desc: 'Olympus Raw Image' },
    { id: 'pef', name: 'PEF', ext: '.pef', desc: 'Pentax Raw Image' },
    { id: 'png', name: 'PNG', ext: '.png', desc: 'Portable Network Graphics' },
    { id: 'psb', name: 'PSB', ext: '.psb', desc: 'Photoshop Large' },
    { id: 'psd', name: 'PSD', ext: '.psd', desc: 'Adobe Photoshop' },
    { id: 'raf', name: 'RAF', ext: '.raf', desc: 'Fujifilm Raw Image' },
    { id: 'raw', name: 'RAW', ext: '.raw', desc: 'Raw Image Data' },
    { id: 'rw2', name: 'RW2', ext: '.rw2', desc: 'Panasonic Raw Image' },
    { id: 'sk', name: 'SK', ext: '.sk', desc: 'Skencil Drawing' },
    { id: 'sk1', name: 'SK1', ext: '.sk1', desc: 'sK1 Drawing' },
    { id: 'svg', name: 'SVG', ext: '.svg', desc: 'Scalable Vector Graphics' },
    { id: 'svgz', name: 'SVGZ', ext: '.svgz', desc: 'Compressed SVG' },
    { id: 'tga', name: 'TGA', ext: '.tga', desc: 'Targa Image' },
    { id: 'tif', name: 'TIF', ext: '.tif', desc: 'Tagged Image File' },
    { id: 'tiff', name: 'TIFF', ext: '.tiff', desc: 'Tagged Image File Format' },
    { id: 'webp', name: 'WEBP', ext: '.webp', desc: 'WebP Image' },
    { id: 'wmf', name: 'WMF', ext: '.wmf', desc: 'Windows Metafile' },
    { id: 'xcf', name: 'XCF', ext: '.xcf', desc: 'GIMP Image' },
    { id: 'x3f', name: 'X3F', ext: '.x3f', desc: 'Sigma Raw Image' },
  ],
  video: [
    { id: '3gp', name: '3GP', ext: '.3gp', desc: '3GPP Multimedia' },
    { id: '3g2', name: '3G2', ext: '.3g2', desc: '3GPP2 Multimedia' },
    { id: 'avi', name: 'AVI', ext: '.avi', desc: 'Audio Video Interleave' },
    { id: 'flv', name: 'FLV', ext: '.flv', desc: 'Flash Video' },
    { id: 'm4v', name: 'M4V', ext: '.m4v', desc: 'MPEG-4 Video' },
    { id: 'mkv', name: 'MKV', ext: '.mkv', desc: 'Matroska Video' },
    { id: 'mov', name: 'MOV', ext: '.mov', desc: 'QuickTime Movie' },
    { id: 'mp4', name: 'MP4', ext: '.mp4', desc: 'MPEG-4 Part 14' },
    { id: 'mpeg', name: 'MPEG', ext: '.mpeg', desc: 'MPEG Video' },
    { id: 'mpg', name: 'MPG', ext: '.mpg', desc: 'MPEG Video' },
    { id: 'mts', name: 'MTS', ext: '.mts', desc: 'AVCHD Video' },
    { id: 'mxf', name: 'MXF', ext: '.mxf', desc: 'Material Exchange Format' },
    { id: 'ogv', name: 'OGV', ext: '.ogv', desc: 'Ogg Video' },
    { id: 'ts', name: 'TS', ext: '.ts', desc: 'Transport Stream' },
    { id: 'vob', name: 'VOB', ext: '.vob', desc: 'Video Object' },
    { id: 'webm', name: 'WEBM', ext: '.webm', desc: 'WebM Video' },
    { id: 'wmv', name: 'WMV', ext: '.wmv', desc: 'Windows Media Video' },
    { id: 'asf', name: 'ASF', ext: '.asf', desc: 'Advanced Systems Format' },
    { id: 'divx', name: 'DIVX', ext: '.divx', desc: 'DivX Video' },
    { id: 'f4v', name: 'F4V', ext: '.f4v', desc: 'Flash MP4 Video' },
    { id: 'm2ts', name: 'M2TS', ext: '.m2ts', desc: 'Blu-ray BDAV' },
    { id: 'mpv', name: 'MPV', ext: '.mpv', desc: 'MPEG Video' },
    { id: 'nsv', name: 'NSV', ext: '.nsv', desc: 'Nullsoft Video' },
    { id: 'rm', name: 'RM', ext: '.rm', desc: 'RealMedia' },
    { id: 'rmvb', name: 'RMVB', ext: '.rmvb', desc: 'RealMedia Variable Bitrate' },
    { id: 'swf', name: 'SWF', ext: '.swf', desc: 'Shockwave Flash' },
    { id: 'viv', name: 'VIV', ext: '.viv', desc: 'VivoActive Video' },
    { id: 'wtv', name: 'WTV', ext: '.wtv', desc: 'Windows TV' },
  ],
  audio: [
    { id: 'aac', name: 'AAC', ext: '.aac', desc: 'Advanced Audio Coding' },
    { id: 'ac3', name: 'AC3', ext: '.ac3', desc: 'Dolby Digital' },
    { id: 'aif', name: 'AIF', ext: '.aif', desc: 'Audio Interchange File' },
    { id: 'aiff', name: 'AIFF', ext: '.aiff', desc: 'Audio Interchange File Format' },
    { id: 'amr', name: 'AMR', ext: '.amr', desc: 'Adaptive Multi-Rate' },
    { id: 'ape', name: 'APE', ext: '.ape', desc: 'Monkey\'s Audio' },
    { id: 'au', name: 'AU', ext: '.au', desc: 'Sun/NeXT Audio' },
    { id: 'dts', name: 'DTS', ext: '.dts', desc: 'DTS Coherent Acoustics' },
    { id: 'flac', name: 'FLAC', ext: '.flac', desc: 'Free Lossless Audio Codec' },
    { id: 'm4a', name: 'M4A', ext: '.m4a', desc: 'MPEG-4 Audio' },
    { id: 'm4b', name: 'M4B', ext: '.m4b', desc: 'MPEG-4 Audiobook' },
    { id: 'mid', name: 'MID', ext: '.mid', desc: 'MIDI File' },
    { id: 'midi', name: 'MIDI', ext: '.midi', desc: 'Musical Instrument Digital Interface' },
    { id: 'mp3', name: 'MP3', ext: '.mp3', desc: 'MPEG Audio Layer III' },
    { id: 'mpc', name: 'MPC', ext: '.mpc', desc: 'Musepack Audio' },
    { id: 'oga', name: 'OGA', ext: '.oga', desc: 'Ogg Audio' },
    { id: 'ogg', name: 'OGG', ext: '.ogg', desc: 'Ogg Vorbis' },
    { id: 'opus', name: 'OPUS', ext: '.opus', desc: 'Opus Audio' },
    { id: 'tta', name: 'TTA', ext: '.tta', desc: 'True Audio' },
    { id: 'wav', name: 'WAV', ext: '.wav', desc: 'Waveform Audio' },
    { id: 'wma', name: 'WMA', ext: '.wma', desc: 'Windows Media Audio' },
  ],
  spreadsheets: [
    { id: 'csv', name: 'CSV', ext: '.csv', desc: 'Comma-Separated Values' },
    { id: 'ods', name: 'ODS', ext: '.ods', desc: 'OpenDocument Spreadsheet' },
    { id: 'xls', name: 'XLS', ext: '.xls', desc: 'Microsoft Excel (legacy)' },
    { id: 'xlsb', name: 'XLSB', ext: '.xlsb', desc: 'Excel Binary Workbook' },
    { id: 'xlsm', name: 'XLSM', ext: '.xlsm', desc: 'Excel Macro-Enabled' },
    { id: 'xlsx', name: 'XLSX', ext: '.xlsx', desc: 'Microsoft Excel' },
    { id: 'xlt', name: 'XLT', ext: '.xlt', desc: 'Excel Template' },
    { id: 'xltx', name: 'XLTX', ext: '.xltx', desc: 'Excel XML Template' },
  ],
  slides: [
    { id: 'dps', name: 'DPS', ext: '.dps', desc: 'Kingsoft Presentation' },
    { id: 'key', name: 'KEY', ext: '.key', desc: 'Apple Keynote' },
    { id: 'odp', name: 'ODP', ext: '.odp', desc: 'OpenDocument Presentation' },
    { id: 'pot', name: 'POT', ext: '.pot', desc: 'PowerPoint Template' },
    { id: 'potm', name: 'POTM', ext: '.potm', desc: 'PowerPoint Macro Template' },
    { id: 'potx', name: 'POTX', ext: '.potx', desc: 'PowerPoint XML Template' },
    { id: 'pps', name: 'PPS', ext: '.pps', desc: 'PowerPoint Show' },
    { id: 'ppsm', name: 'PPSM', ext: '.ppsm', desc: 'PowerPoint Macro Show' },
    { id: 'ppsx', name: 'PPSX', ext: '.ppsx', desc: 'PowerPoint XML Show' },
    { id: 'ppt', name: 'PPT', ext: '.ppt', desc: 'Microsoft PowerPoint (legacy)' },
    { id: 'pptx', name: 'PPTX', ext: '.pptx', desc: 'Microsoft PowerPoint' },
  ],
  ebooks: [
    { id: 'azw', name: 'AZW', ext: '.azw', desc: 'Kindle eBook' },
    { id: 'azw3', name: 'AZW3', ext: '.azw3', desc: 'Kindle Format 8' },
    { id: 'azw4', name: 'AZW4', ext: '.azw4', desc: 'Kindle Print Replica' },
    { id: 'cbc', name: 'CBC', ext: '.cbc', desc: 'Comic Book Collection' },
    { id: 'cbr', name: 'CBR', ext: '.cbr', desc: 'Comic Book RAR' },
    { id: 'cbz', name: 'CBZ', ext: '.cbz', desc: 'Comic Book ZIP' },
    { id: 'chm', name: 'CHM', ext: '.chm', desc: 'Compiled HTML Help' },
    { id: 'djvu', name: 'DJVU', ext: '.djvu', desc: 'DjVu eBook' },
    { id: 'epub', name: 'EPUB', ext: '.epub', desc: 'Electronic Publication' },
    { id: 'fb2', name: 'FB2', ext: '.fb2', desc: 'FictionBook 2' },
    { id: 'htmlz', name: 'HTMLZ', ext: '.htmlz', desc: 'Compressed HTML' },
    { id: 'lit', name: 'LIT', ext: '.lit', desc: 'Microsoft LIT' },
    { id: 'lrf', name: 'LRF', ext: '.lrf', desc: 'Sony BroadBand eBook' },
    { id: 'mobi', name: 'MOBI', ext: '.mobi', desc: 'Mobipocket eBook' },
    { id: 'pdb', name: 'PDB', ext: '.pdb', desc: 'Palm Database' },
    { id: 'pml', name: 'PML', ext: '.pml', desc: 'Palm Markup Language' },
    { id: 'prc', name: 'PRC', ext: '.prc', desc: 'PocketRocket eBook' },
    { id: 'rb', name: 'RB', ext: '.rb', desc: 'Rocket eBook' },
    { id: 'snb', name: 'SNB', ext: '.snb', desc: 'Shanda eBook' },
    { id: 'tcr', name: 'TCR', ext: '.tcr', desc: 'Text Compression for Reader' },
    { id: 'txtz', name: 'TXTZ', ext: '.txtz', desc: 'Compressed Text eBook' },
    { id: 'kepub', name: 'KEPUB', ext: '.kepub', desc: 'Kobo eBook' },
  ],
  archives: [
    { id: '7z', name: '7Z', ext: '.7z', desc: '7-Zip Archive' },
    { id: 'bz2', name: 'BZ2', ext: '.bz2', desc: 'Bzip2 Compressed' },
    { id: 'cab', name: 'CAB', ext: '.cab', desc: 'Cabinet Archive' },
    { id: 'cpio', name: 'CPIO', ext: '.cpio', ext: '.cpio', desc: 'Copy In/Out Archive' },
    { id: 'deb', name: 'DEB', ext: '.deb', desc: 'Debian Package' },
    { id: 'gz', name: 'GZ', ext: '.gz', desc: 'Gzip Compressed' },
    { id: 'iso', name: 'ISO', ext: '.iso', desc: 'Disc Image' },
    { id: 'lz', name: 'LZ', ext: '.lz', desc: 'Lzip Compressed' },
    { id: 'lzma', name: 'LZMA', ext: '.lzma', desc: 'LZMA Compressed' },
    { id: 'lzo', name: 'LZO', ext: '.lzo', desc: 'LZO Compressed' },
    { id: 'lz4', name: 'LZ4', ext: '.lz4', desc: 'LZ4 Compressed' },
    { id: 'rar', name: 'RAR', ext: '.rar', desc: 'WinRAR Archive' },
    { id: 'rpm', name: 'RPM', ext: '.rpm', desc: 'Red Hat Package' },
    { id: 'sz', name: 'SZ', ext: '.sz', desc: 'Snappy Compressed' },
    { id: 'tar', name: 'TAR', ext: '.tar', desc: 'Tape Archive' },
    { id: 'tbz2', name: 'TBZ2', ext: '.tbz2', desc: 'Tar Bzip2' },
    { id: 'tgz', name: 'TGZ', ext: '.tgz', desc: 'Tar Gzip' },
    { id: 'tlz', name: 'TLZ', ext: '.tlz', desc: 'Tar Lzip' },
    { id: 'xz', name: 'XZ', ext: '.xz', desc: 'XZ Compressed' },
    { id: 'z', name: 'Z', ext: '.z', desc: 'Z Compressed' },
    { id: 'zip', name: 'ZIP', ext: '.zip', desc: 'ZIP Archive' },
    { id: 'zst', name: 'ZST', ext: '.zst', desc: 'Zstandard Compressed' },
    { id: 'zstd', name: 'ZSTD', ext: '.zstd', desc: 'Zstandard' },
    { id: 'dd', name: 'DD', ext: '.dd', desc: 'Disk Dump' },
    { id: 'cpio', name: 'CPIO', ext: '.cpio', desc: 'cpio Archive' },
    { id: 'squashfs', name: 'SQUASHFS', ext: '.squashfs', desc: 'SquashFS' },
    { id: 'warc', name: 'WARC', ext: '.warc', desc: 'Web ARChive' },
    { id: 'xar', name: 'XAR', ext: '.xar', desc: 'eXtensible ARchive' },
    { id: 'dmg', name: 'DMG', ext: '.dmg', desc: 'Apple Disk Image' },
    { id: 'fat', name: 'FAT', ext: '.fat', desc: 'FAT Filesystem Image' },
    { id: 'ext', name: 'EXT', ext: '.ext', desc: 'Ext Filesystem Image' },
    { id: 'ntfs', name: 'NTFS', ext: '.ntfs', desc: 'NTFS Filesystem Image' },
    { id: 'vhd', name: 'VHD', ext: '.vhd', desc: 'Virtual Hard Disk' },
    { id: 'vhdx', name: 'VHDX', ext: '.vhdx', desc: 'Virtual Hard Disk v2' },
    { id: 'vdi', name: 'VDI', ext: '.vdi', desc: 'VirtualBox Disk Image' },
    { id: 'vmdk', name: 'VMDK', ext: '.vmdk', desc: 'VMware Disk' },
    { id: 'qcow2', name: 'QCOW2', ext: '.qcow2', desc: 'QEMU Copy-On-Write v2' },
    { id: 'viv', name: 'VIV', ext: '.viv', desc: 'VivoActive Archive' },
    { id: 'jar', name: 'JAR', ext: '.jar', desc: 'Java ARchive' },
  ],
  vector: [
    { id: 'cgm', name: 'CGM', ext: '.cgm', desc: 'Computer Graphics Metafile' },
    { id: 'dwg', name: 'DWG', ext: '.dwg', desc: 'AutoCAD Drawing' },
    { id: 'dxf', name: 'DXF', ext: '.dxf', desc: 'Drawing Exchange Format' },
    { id: 'emf', name: 'EMF', ext: '.emf', desc: 'Enhanced Metafile' },
    { id: 'eps', name: 'EPS', ext: '.eps', desc: 'Encapsulated PostScript' },
    { id: 'odg', name: 'ODG', ext: '.odg', desc: 'OpenDocument Drawing' },
    { id: 'pnm', name: 'PNM', ext: '.pnm', desc: 'Portable Anymap' },
    { id: 'ppm', name: 'PPM', ext: '.ppm', desc: 'Portable Pixmap' },
    { id: 'ps', name: 'PS', ext: '.ps', desc: 'PostScript' },
    { id: 'svg', name: 'SVG', ext: '.svg', desc: 'Scalable Vector Graphics' },
  ],
  cad: [
    { id: 'dwg', name: 'DWG', ext: '.dwg', desc: 'AutoCAD Drawing Database' },
    { id: 'dxf', name: 'DXF', ext: '.dxf', desc: 'AutoCAD DXF' },
    { id: 'stl', name: 'STL', ext: '.stl', desc: 'Stereolithography 3D Model' },
  ],
  fonts: [
    { id: 'otf', name: 'OTF', ext: '.otf', desc: 'OpenType Font' },
    { id: 'ttf', name: 'TTF', ext: '.ttf', desc: 'TrueType Font' },
    { id: 'woff', name: 'WOFF', ext: '.woff', desc: 'Web Open Font Format' },
    { id: 'woff2', name: 'WOFF2', ext: '.woff2', desc: 'Web Open Font Format 2' },
    { id: 'eot', name: 'EOT', ext: '.eot', desc: 'Embedded OpenType' },
  ],
}

export const CREDIT_COSTS = {
  general: 1,
  office_to_pdf: 2,
  iwork_to_pdf: 2,
  pdf_to_office: 4,
}

export const POPULAR_CONVERSIONS = [
  { from: 'pdf', to: 'docx', label: 'PDF to Word' },
  { from: 'docx', to: 'pdf', label: 'Word to PDF' },
  { from: 'jpg', to: 'png', label: 'JPG to PNG' },
  { from: 'png', to: 'jpg', label: 'PNG to JPG' },
  { from: 'mp4', to: 'mp3', label: 'Video to Audio' },
  { from: 'heic', to: 'jpg', label: 'HEIC to JPG' },
  { from: 'pdf', to: 'jpg', label: 'PDF to Image' },
  { from: 'xlsx', to: 'csv', label: 'Excel to CSV' },
  { from: 'pptx', to: 'pdf', label: 'PowerPoint to PDF' },
  { from: 'html', to: 'pdf', label: 'HTML to PDF' },
  { from: 'mp3', to: 'wav', label: 'MP3 to WAV' },
  { from: 'webp', to: 'png', label: 'WebP to PNG' },
  { from: 'mkv', to: 'mp4', label: 'MKV to MP4' },
  { from: 'csv', to: 'xlsx', label: 'CSV to Excel' },
  { from: 'epub', to: 'pdf', label: 'EPUB to PDF' },
]

export const FORMAT_IDS_BY_CATEGORY = Object.entries(FORMATS).reduce(
  (acc, [category, formats]) => {
    formats.forEach((f) => {
      acc[f.id] = { ...f, category }
    })
    return acc
  },
  {}
)

export function getFormat(id) {
  if (!id) return null
  return FORMAT_IDS_BY_CATEGORY[id.toLowerCase()] || null
}

export function getFormatsByCategory(category) {
  return FORMATS[category] || []
}

export function getAllFormatIds() {
  return Object.keys(FORMAT_IDS_BY_CATEGORY)
}

export function isValidConversion(from, to) {
  const fromFmt = getFormat(from)
  const toFmt = getFormat(to)
  if (!fromFmt || !toFmt) return false
  if (from === to) return false
  return true
}

export function getPopularConversions() {
  return POPULAR_CONVERSIONS
}

export function getConversionPairs() {
  const pairs = []
  const allFormats = getAllFormatIds()

  for (const from of allFormats) {
    for (const to of allFormats) {
      if (from !== to) {
        pairs.push({ from, to })
      }
    }
  }

  return pairs
}

export function getTopConversionPairs(limit = 500) {
  return getConversionPairs().slice(0, limit)
}

export function getCreditCost(from, to) {
  const officeFormats = ['doc', 'docx', 'docm', 'dot', 'dotx', 'odt', 'rtf', 'txt']
  const iworkFormats = ['pages', 'key', 'numbers']
  const pdfFormat = 'pdf'

  if (officeFormats.includes(from) && to === pdfFormat) return CREDIT_COSTS.office_to_pdf
  if (iworkFormats.includes(from) && to === pdfFormat) return CREDIT_COSTS.iwork_to_pdf
  if (from === pdfFormat && officeFormats.includes(to)) return CREDIT_COSTS.pdf_to_office
  return CREDIT_COSTS.general
}
