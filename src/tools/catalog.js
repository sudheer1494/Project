// Plain tool catalog data (no JSX / icon component imports) so it can be
// consumed by both the React app (registry.js) and Node build scripts
// (sitemap + SEO prerender). `icon` is a lucide-react export name resolved
// to a component in registry.js. `component` maps to tools/components.js.

export const CATALOG = [
  // ---------- PDF TOOLS ----------
  { slug: 'merge-pdf', name: 'Merge PDF', category: 'pdf', icon: 'Combine', component: 'MergePdf', description: 'Combine multiple PDFs into one document.', keywords: ['combine', 'join', 'pdf'] },
  { slug: 'split-pdf', name: 'Split PDF', category: 'pdf', icon: 'Scissors', component: 'SplitPdf', description: 'Extract pages or split a PDF into separate files.', keywords: ['extract', 'pages', 'separate'] },
  { slug: 'compress-pdf', name: 'Compress PDF', category: 'pdf', icon: 'Minimize2', component: 'CompressPdf', description: 'Reduce the file size of your PDF.', keywords: ['reduce', 'size', 'shrink'] },
  { slug: 'pdf-to-word', name: 'PDF to Word', category: 'pdf', icon: 'FileText', component: 'PdfToWord', description: 'Convert a PDF into editable text you can copy.', keywords: ['docx', 'convert', 'editable'] },
  { slug: 'word-to-pdf', name: 'Word to PDF', category: 'pdf', icon: 'FileType2', component: 'WordToPdf', description: 'Turn text or a DOCX into a clean PDF.', keywords: ['docx', 'convert'] },
  { slug: 'pdf-to-jpg', name: 'PDF to JPG', category: 'pdf', icon: 'FileImage', component: 'PdfToJpg', description: 'Convert each PDF page into an image.', keywords: ['image', 'png', 'convert'] },
  { slug: 'jpg-to-pdf', name: 'JPG to PDF', category: 'pdf', icon: 'Images', component: 'JpgToPdf', description: 'Combine images into a single PDF.', keywords: ['image', 'png', 'convert'] },
  { slug: 'rotate-pdf', name: 'Rotate PDF', category: 'pdf', icon: 'RotateCw', component: 'RotatePdf', description: 'Rotate all pages in a PDF document.', keywords: ['turn', 'orientation'] },
  { slug: 'protect-pdf', name: 'Protect PDF', category: 'pdf', icon: 'Lock', component: 'ProtectPdf', description: 'Add password protection to a PDF.', keywords: ['password', 'encrypt', 'secure'] },
  { slug: 'unlock-pdf', name: 'Unlock PDF', category: 'pdf', icon: 'Unlock', component: 'UnlockPdf', description: 'Remove the password from a protected PDF.', keywords: ['password', 'decrypt', 'remove'] },
  { slug: 'watermark-pdf', name: 'Add Watermark', category: 'pdf', icon: 'Stamp', component: 'WatermarkPdf', description: 'Stamp text onto every page of a PDF.', keywords: ['stamp', 'overlay', 'brand'] },
  { slug: 'page-numbers-pdf', name: 'Add Page Numbers', category: 'pdf', icon: 'Hash', component: 'PageNumbersPdf', description: 'Insert page numbers into your PDF.', keywords: ['numbering', 'pages'] },

  // ---------- IMAGE TOOLS ----------
  { slug: 'compress-image', name: 'Compress Image', category: 'image', icon: 'Minimize2', component: 'CompressImage', description: 'Reduce image file size (JPG, PNG, WebP).', keywords: ['shrink', 'optimize', 'size'] },
  { slug: 'resize-image', name: 'Resize Image', category: 'image', icon: 'Maximize', component: 'ResizeImage', description: 'Change image width and height.', keywords: ['scale', 'dimensions'] },
  { slug: 'crop-image', name: 'Crop Image', category: 'image', icon: 'Crop', component: 'CropImage', description: 'Crop to custom dimensions or aspect ratio.', keywords: ['cut', 'trim'] },
  { slug: 'convert-image', name: 'Convert Image', category: 'image', icon: 'Replace', component: 'ConvertImage', description: 'Convert between JPG, PNG, WebP and more.', keywords: ['format', 'jpg', 'png', 'webp'] },
  { slug: 'remove-background', name: 'Remove Background', category: 'image', icon: 'Eraser', component: 'RemoveBackground', description: 'Erase a solid background from an image.', keywords: ['transparent', 'cutout'] },
  { slug: 'watermark-image', name: 'Add Watermark', category: 'image', icon: 'Type', component: 'WatermarkImage', description: 'Overlay text onto an image.', keywords: ['text', 'logo', 'brand'] },
  { slug: 'rotate-flip-image', name: 'Rotate / Flip Image', category: 'image', icon: 'FlipHorizontal2', component: 'RotateFlipImage', description: 'Rotate by degrees or flip an image.', keywords: ['mirror', 'turn'] },
  { slug: 'image-to-base64', name: 'Image to Base64', category: 'image', icon: 'Binary', component: 'ImageToBase64', description: 'Encode an image to a Base64 data URI.', keywords: ['encode', 'data uri'] },

  // ---------- UTILITIES ----------
  { slug: 'word-counter', name: 'Word Counter', category: 'utility', icon: 'Pilcrow', component: 'WordCounter', description: 'Count words, characters and sentences.', keywords: ['count', 'text', 'words'] },
  { slug: 'case-converter', name: 'Case Converter', category: 'utility', icon: 'CaseSensitive', component: 'CaseConverter', description: 'UPPERCASE, lowercase, Title Case and more.', keywords: ['text', 'capitalize'] },
  { slug: 'color-picker', name: 'Color Picker', category: 'utility', icon: 'Pipette', component: 'ColorPicker', description: 'Pick and convert HEX, RGB and HSL.', keywords: ['hex', 'rgb', 'hsl'] },
  { slug: 'qr-code-generator', name: 'QR Code Generator', category: 'utility', icon: 'QrCode', component: 'QrCodeGenerator', description: 'Generate QR codes from text or URLs.', keywords: ['barcode', 'url'] },
  { slug: 'url-encoder', name: 'URL Encoder / Decoder', category: 'utility', icon: 'Link2', component: 'UrlEncoder', description: 'Encode or decode URL strings.', keywords: ['percent', 'escape'] },
  { slug: 'base64', name: 'Base64 Encode / Decode', category: 'utility', icon: 'FileCode2', component: 'Base64Tool', description: 'Convert text to and from Base64.', keywords: ['encode', 'decode'] },
  { slug: 'password-generator', name: 'Password Generator', category: 'utility', icon: 'KeyRound', component: 'PasswordGenerator', description: 'Generate strong, random passwords.', keywords: ['random', 'secure'] },
  { slug: 'json-formatter', name: 'JSON Formatter', category: 'utility', icon: 'Braces', component: 'JsonFormatter', description: 'Prettify, minify and validate JSON.', keywords: ['pretty', 'validate', 'beautify'] },
  { slug: 'markdown-to-html', name: 'Markdown to HTML', category: 'utility', icon: 'Code2', component: 'MarkdownToHtml', description: 'Convert Markdown into HTML with a live preview.', keywords: ['md', 'convert', 'preview'] },
  { slug: 'character-counter', name: 'Character Counter', category: 'utility', icon: 'Hash', component: 'CharacterCounter', description: 'Count characters with and without spaces.', keywords: ['count', 'letters'] },
]

export const CATEGORY_LABELS = {
  pdf: 'PDF Tools',
  image: 'Image Tools',
  utility: 'Utilities',
}
