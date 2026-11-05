# ToolNest

A responsive static website with five browser-based utilities and dedicated SEO-friendly pages.

## Included tools
- Word Counter (`word-counter.html`)
- Image Compressor (`image-compressor.html`)
- Image Resizer (`image-resizer.html`)
- Case Converter (`case-converter.html`)
- Percentage Calculator (`percentage-calculator.html`)

## Run locally
Open `index.html` in a modern browser. For best testing, serve this folder with a local static server.

## Deploy to Cloudflare Pages
1. Create a GitHub repository and upload every file and the root-level files in this folder.
2. In Cloudflare, open Workers & Pages > Create > Pages > Connect to Git.
3. Select the repository.
4. Framework preset: None.
5. Build command: leave blank.
6. Build output directory: `/` or `.` if the dashboard asks for a relative path.
7. Deploy. You will first receive a `pages.dev` address.
8. After buying the domain, add it in the Pages project's Custom domains settings and follow Cloudflare's DNS instructions.

## Contact
Current public contact email: fuls2172004@gmail.com. Replace this later if you create a domain-based mailbox.

## Before public launch
- Confirm the final domain. The current canonical URLs, sitemap and robots.txt use `https://toolnests.store`. If you choose a different domain, update those URLs first.
- Review the Privacy Policy and Terms in `index.html` so they accurately describe your real hosting, analytics, advertising, cookie/consent and contact practices.
- Test all tools on desktop and mobile, including image formats and large files.
- Add a consent solution appropriate for the locations and ad technologies you use.
- Submit the sitemap in Google Search Console after the custom domain is live.
- Apply for AdSense only when the site is complete, useful, accessible and compliant. Approval is not guaranteed.
- Ad placeholders are not real ads and do not load ads.

## Technical notes
- Image operations run locally in the browser using Canvas; images are not intentionally uploaded to a ToolNest backend.
- PNG output is lossless; the quality slider applies to JPG and WebP only.
- Large images can use substantial device memory.
- This static site has no backend, account system, analytics, or server-side contact form.

## Additional browser-side tools

- CSV / JSON Converter
- HEX Color Picker
- CSS Gradient Generator
- Text Sorter and Deduplicator
- HTML Preview (sandboxed)
- Markdown Preview (safe basic renderer)

These tools run locally in the browser and do not require a paid API.


## PDF tools (added November 2026)
- PDF Merger: combine multiple PDFs.
- PDF Splitter: extract selected pages and ranges.
- PDF to JPG: render pages and download individual images or a ZIP.
- JPG to PDF: create a PDF from JPG, PNG, or WebP images.

PDF tools run in the browser and load pdf-lib, PDF.js, and JSZip from public CDNs. An internet connection is required. Large documents may use significant device memory. Password-protected or malformed PDFs may not work.


## PDF tools added
- PDF Merger: combine multiple PDFs into one file.
- PDF Splitter: extract selected pages or ranges.
- PDF to JPG: render each PDF page as a downloadable JPG.
- JPG to PDF: place multiple JPG/PNG images into a PDF.

These PDF tools process documents in the browser. They load PDF libraries from public CDNs, so an internet connection is required for the PDF library to load. Documents are not uploaded to a ToolNest server by these tools.


## Additional tools batch
Added 15 pages: PDF Editor, PDF to Word, Word to PDF, Background Remover (manual transparent eraser; AI removal requires an external service), Video Compressor, Image to Text OCR, Speech to Text, Audio to WAV Converter, Image Upscaler (interpolation, not AI), Invoice Generator, Resume Builder, Screenshot Editor, Favicon Generator, QR Code Scanner, and Meta Tag Generator.

Some tools load open-source libraries from public CDNs and therefore require an internet connection. Browser support and output quality vary. PDF-to-Word extracts text and does not preserve complex layouts; Word-to-PDF uses the browser print dialog; speech recognition depends on browser support; background removal is manual rather than AI-powered.


## Advanced usability update
- Added a shared progressive-enhancement layer (`advanced.js`) to all HTML pages.
- File upload areas support drag and drop and show selected file names and sizes.
- Tool pages include Reset and Share controls.
- Ctrl/Cmd + Enter triggers the primary action on tool pages.
- Individual tool pages receive WebApplication structured data.
- Added visible keyboard focus and mobile-friendly toolbar styling.
- These are usability and discoverability improvements, not a claim that every tool has AI-grade capabilities.
- Browser testing of every input/output combination is still required before AdSense submission.
