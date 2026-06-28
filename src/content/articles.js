// Blog article content. Bodies are Markdown (rendered with `marked`).
// Adding an article = append an entry here; routing, listing, sitemap, SEO
// metadata and JSON-LD all pick it up automatically.
//
// Keep articles genuinely useful and substantive. Do NOT mass-produce thin,
// near-duplicate pages — Google penalizes "scaled content abuse".

export const ARTICLES = [
  {
    slug: 'how-to-merge-pdf-files-online-free',
    title: 'How to Merge PDF Files Online for Free (2026 Guide)',
    description:
      'Combine multiple PDFs into one document in seconds — free, in your browser, with no watermark or sign-up. Step-by-step guide plus tips on page order and file size.',
    category: 'PDF',
    date: '2026-06-20',
    readMinutes: 4,
    relatedTools: ['merge-pdf', 'split-pdf', 'compress-pdf'],
    body: `Merging PDFs is one of the most common document tasks — combining invoices, stitching together scanned pages, or assembling a report from several files. Here's how to do it for free without uploading anything to a server.

## The fastest way: merge in your browser

With a client-side tool like [ToolsBase Merge PDF](/tool/merge-pdf), your files never leave your device:

1. **Open the Merge PDF tool** and drag in two or more PDFs.
2. **Reorder** the files with the up/down arrows so the pages end up in the right sequence.
3. Click **Merge PDFs** — the combined file downloads instantly.

Because the merging happens locally using JavaScript (via the open-source \`pdf-lib\`), there's no upload, no queue, and no watermark.

## Why client-side merging is safer

Most "free" online PDF tools upload your file to their servers, process it there, and (hopefully) delete it afterward. For anything sensitive — contracts, IDs, financial statements — that's a real privacy risk. Browser-based tools sidestep it entirely: the document is processed in memory on your own machine.

## Tips for clean results

- **Check page order before merging.** It's much easier than re-splitting later.
- **Compress afterward if needed.** Merged files can get large; run the result through [Compress PDF](/tool/compress-pdf).
- **Need only some pages?** Use [Split PDF](/tool/split-pdf) first to extract the ranges you want, then merge.

## Frequently asked questions

**Is it really free?** Yes — no account, no watermark, no page limit for typical documents.

**Will the quality drop?** No. Merging copies pages as-is; it doesn't re-encode them.

**Does it work on mobile?** Yes, it runs in any modern mobile browser.`,
  },
  {
    slug: 'how-to-compress-pdf-without-losing-quality',
    title: 'How to Compress a PDF Without Losing Quality',
    description:
      'Reduce PDF file size for email and uploads while keeping text sharp. Learn what actually makes PDFs large and how to shrink them safely.',
    category: 'PDF',
    date: '2026-06-19',
    readMinutes: 5,
    relatedTools: ['compress-pdf', 'merge-pdf', 'pdf-to-jpg'],
    body: `A 30 MB PDF won't fit through most email attachment limits and is slow to upload. The good news: most large PDFs are bloated for fixable reasons.

## What makes a PDF large?

- **High-resolution images** — by far the most common cause.
- **Embedded fonts** that aren't subset.
- **Redundant objects** from repeated edits and re-saves.

## How to compress a PDF

Use [Compress PDF](/tool/compress-pdf): drop in your file and download the optimized version. It rewrites the document structure with object streams to strip redundancy — entirely in your browser.

For image-heavy PDFs, the biggest wins come from the images themselves. If you built the PDF from photos or scans, compress those first with [Compress Image](/tool/compress-image), then assemble the PDF.

## Compress without wrecking quality

- **Target the right size, not the smallest.** Aim just under the limit you need (e.g. 10 MB for Gmail).
- **Keep text as text.** Avoid tools that flatten everything to images — your PDF becomes unsearchable and blurry.
- **Compress once.** Repeatedly compressing already-compressed images degrades them with no real size benefit.

## When you need a server-grade squeeze

Browser compression is great for structure and re-encoding, but downsampling embedded images aggressively is sometimes better handled by a dedicated desktop tool for very large scanned archives. For everyday documents, client-side compression is more than enough.`,
  },
  {
    slug: 'how-to-compress-images-for-web',
    title: 'How to Compress Images for the Web (JPG, PNG & WebP)',
    description:
      'Make your images load faster without visible quality loss. A practical guide to formats, quality settings and when to use WebP.',
    category: 'Image',
    date: '2026-06-18',
    readMinutes: 5,
    relatedTools: ['compress-image', 'convert-image', 'resize-image'],
    body: `Images are usually the heaviest part of a web page. Compressing them is the single highest-impact thing you can do for load speed and Core Web Vitals.

## Pick the right format

- **JPG** — photographs and complex images. Lossy but excellent ratios.
- **PNG** — graphics with sharp edges or transparency. Lossless, larger.
- **WebP** — modern all-rounder; ~25–35% smaller than JPG at similar quality.

Convert between them with [Convert Image](/tool/convert-image).

## Compress in your browser

[Compress Image](/tool/compress-image) lets you set a quality level and see the before/after size. A quality of **70–80%** is the sweet spot for JPG/WebP — large savings with no visible difference for most photos.

## Resize before you compress

A 4000px-wide photo displayed at 800px wastes enormous bandwidth. **Resize to the actual display size first** with [Resize Image](/tool/resize-image), then compress. This often cuts file size more than compression alone.

## A simple workflow

1. **Resize** to the max width you'll actually display.
2. **Convert** to WebP (or keep JPG for broad compatibility).
3. **Compress** at ~75% quality.
4. Compare the result — bump quality up only if you see artifacts.

## Why do it client-side?

No upload means instant results and full privacy — useful when the images are product shots, client work, or anything you'd rather not hand to a random server.`,
  },
  {
    slug: 'how-to-convert-pdf-to-jpg',
    title: 'How to Convert PDF to JPG (Each Page as an Image)',
    description:
      'Turn PDF pages into high-quality JPG images for slides, thumbnails or sharing. Free, browser-based, no sign-up.',
    category: 'PDF',
    date: '2026-06-17',
    readMinutes: 3,
    relatedTools: ['pdf-to-jpg', 'jpg-to-pdf', 'compress-image'],
    body: `Sometimes you need a PDF as images — to drop a page into a slide deck, post a preview, or generate thumbnails. Converting each page to a JPG takes seconds.

## Convert PDF to JPG

Open [PDF to JPG](/tool/pdf-to-jpg) and drop in your file. Each page renders to a high-resolution image you can download individually. It uses Mozilla's \`pdf.js\` renderer, so the output is crisp.

## Tips

- **Need a single combined image?** Convert the pages, then stitch them in any image editor — or keep them as a gallery.
- **Going the other way?** [JPG to PDF](/tool/jpg-to-pdf) builds a PDF from images.
- **Large output?** Run the JPGs through [Compress Image](/tool/compress-image) before sharing.

## Why the quality is good

The tool renders each page at 2× scale before exporting, so text and lines stay sharp even when zoomed — far better than screenshotting the page.`,
  },
  {
    slug: 'how-to-remove-image-background-free',
    title: 'How to Remove an Image Background for Free',
    description:
      'Erase a solid background from a photo or logo right in your browser. When client-side removal works best and how to get a clean cutout.',
    category: 'Image',
    date: '2026-06-16',
    readMinutes: 4,
    relatedTools: ['remove-background', 'convert-image', 'watermark-image'],
    body: `Removing a background gives you a transparent PNG you can drop onto any color or design. Here's how to do it free without an account.

## Quick background removal

[Remove Background](/tool/remove-background) samples the corner colors of your image and makes matching pixels transparent. Adjust the **tolerance** slider until the background disappears cleanly, then download the transparent PNG.

## When this works best

Client-side, color-based removal shines on:

- Product photos on a **solid, evenly-lit backdrop**
- **Logos** and graphics on a flat color
- Headshots shot against a plain wall

For busy backgrounds or fine hair detail, an AI segmentation tool will do better — but for the common "white background" case, color keying is instant and private.

## Get a cleaner cutout

- **Start with even lighting.** Shadows create color variation the keyer reads as foreground.
- **Nudge the tolerance gradually.** Too high eats into your subject; too low leaves a halo.
- **Export as PNG** to preserve transparency, then re-use it with [Convert Image](/tool/convert-image) or stamp it with [Add Watermark](/tool/watermark-image).`,
  },
  {
    slug: 'how-to-generate-qr-code-for-url',
    title: 'How to Generate a QR Code for a URL (Free, No Expiry)',
    description:
      'Create a permanent QR code for any link or text in seconds. Why static QR codes never expire and how to use them well.',
    category: 'Utilities',
    date: '2026-06-15',
    readMinutes: 3,
    relatedTools: ['qr-code-generator', 'url-encoder', 'base64'],
    body: `QR codes bridge print and digital — menus, posters, business cards, packaging. A static QR code you generate yourself is free and **never expires**.

## Make a QR code

Open [QR Code Generator](/tool/qr-code-generator), paste your URL or text, pick a size, and download the PNG. That's it — it's generated locally in your browser.

## Static vs dynamic — avoid the trap

Many "free QR" sites create **dynamic** codes that route through their servers and **stop working** unless you pay. The code ToolsBase generates is **static**: the URL is encoded directly into the image, so it works forever with no subscription and no tracking middleman.

## Tips for scannable codes

- **Keep the URL short.** Longer data means a denser, harder-to-scan code. Shorten links first if needed.
- **Print big enough.** A good rule: the code should be at least 2 × 2 cm for close scanning, larger for posters.
- **Maintain contrast and quiet zone.** Keep dark-on-light and leave white margin around it.
- **Test before printing** with a couple of phones.`,
  },
  {
    slug: 'are-online-pdf-tools-safe',
    title: 'Are Online PDF Tools Safe? Client-Side vs Server-Side',
    description:
      'The privacy difference between browser-based and upload-based tools — and how to tell which one you are using.',
    category: 'Privacy',
    date: '2026-06-14',
    readMinutes: 5,
    relatedTools: ['merge-pdf', 'compress-pdf', 'protect-pdf'],
    body: `"Free online PDF tool" can mean two very different things for your privacy. The distinction comes down to **where the processing happens**.

## Server-side tools (upload-based)

Your file is uploaded to the provider's servers, processed there, and stored — at least temporarily. You're trusting their security, their retention policy, and their integrity. For invoices, contracts, IDs or medical records, that's a meaningful risk, even with a good privacy policy.

## Client-side tools (browser-based)

The file is processed **in your browser** using JavaScript. It never travels to a server. ToolsBase runs the vast majority of its tools this way — [Merge PDF](/tool/merge-pdf), [Compress PDF](/tool/compress-pdf), image tools and all the text utilities are 100% local.

## How to tell which one you're using

- **Watch your network.** Open dev tools → Network tab. A client-side tool won't upload your file.
- **Check the speed.** Instant results on a large file usually mean local processing.
- **Read the privacy note.** Honest tools say plainly whether files are uploaded.

## The honest exceptions

Some operations genuinely can't be done safely in a browser — **password-encrypting a PDF**, for example, needs server-side cryptography. A trustworthy tool will tell you that instead of pretending. (ToolsBase shows a clear notice on [Protect PDF](/tool/protect-pdf) rather than faking it.)

## Bottom line

For sensitive documents, prefer client-side tools and verify with the network tab. Convenience and privacy don't have to be a trade-off.`,
  },
  {
    slug: 'how-to-create-strong-passwords',
    title: 'How to Create Strong Passwords (Length Beats Complexity)',
    description:
      'Why a long random password beats a short complex one, how to generate one safely, and the habits that actually keep accounts secure.',
    category: 'Utilities',
    date: '2026-06-13',
    readMinutes: 4,
    relatedTools: ['password-generator', 'base64', 'qr-code-generator'],
    body: `Most password advice is outdated. The single biggest factor in password strength is **length**, not whether you sprinkled in a \`!\` or a \`7\`.

## Why length wins

Each extra character multiplies the number of guesses an attacker must make. A 16-character random password is astronomically harder to brute-force than an 8-character one, even a "complex" 8-character one. That's why modern guidance (including NIST) emphasizes length and discourages forced complexity rules.

## Generate one safely

[Password Generator](/tool/password-generator) creates passwords using your browser's cryptographically secure random number generator (\`crypto.getRandomValues\`) — not the weak \`Math.random()\`. Set the length to **16+**, keep all character sets on, and copy it straight into your password manager.

## The habits that matter more than the password itself

1. **Use a password manager.** It's the only realistic way to have a unique strong password per site.
2. **Turn on two-factor authentication.** Even a leaked password is useless without the second factor.
3. **Never reuse passwords.** One breach shouldn't unlock everything.
4. **Use a passphrase for the one you must memorize** (your password manager's master password) — four or five random words are long and rememberable.

## Quick checklist

- 16+ characters ✅
- Randomly generated ✅
- Unique per account ✅
- Stored in a manager ✅
- 2FA enabled ✅`,
  },
]

export const getArticleBySlug = (slug) => ARTICLES.find((a) => a.slug === slug)

// Related articles from the same category (excluding the current one).
export function getRelatedArticles(slug, count = 3) {
  const article = getArticleBySlug(slug)
  if (!article) return []
  const same = ARTICLES.filter((a) => a.category === article.category && a.slug !== slug)
  const others = ARTICLES.filter((a) => a.category !== article.category && a.slug !== slug)
  return [...same, ...others].slice(0, count)
}
