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
