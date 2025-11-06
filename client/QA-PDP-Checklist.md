QA Checklist — Product Detail Pages (PDP)

Goal
- Verify PDP pages (Eco Joy, Eco Zeon, Cruze Blade, Eco Shine, Eco Swift, Cruzeon, Rapid Shine, Eco Glider, etc.) use shared styles and that the lightbox zoom shows the full, centered image on desktop and mobile viewports.

Start the dev server (PowerShell)
```
cd "c:\akshit zruze\client"
npm run dev
```

Open the printed URL (usually http://localhost:5173) and visit the product pages listed below.

Pages to test
- /ec ojoy -> visit the route that renders `EcoJoy.jsx`
- /ecozeon -> `EcoZeon.jsx`
- /cruze-blade -> `CruzeBladeDetails.jsx` (or the route used in your app)
- /eco-shine -> `EcoShine.jsx`
- /eco-swift -> `ecoswift.jsx`
- /cruzeon -> `cruzeon.jsx`
- /rapid-shine -> `Rapidshine.jsx`
- /eco-glider -> `ecoglider.jsx`

Manual test checklist (for each page)
1) Page loads without console errors
   - Expected: no build/runtime errors in browser console.
   - Screenshot: screenshots/<pagename>/console.png
2) Layout & responsive breakpoints
   - Test widths: 1280px (desktop), 1024px (tablet landscape), 768px (tablet), 480px (phone), 360px (small phone).
   - Expected: grid collapses to one-column on small widths; thumbnails stack or scroll; title/CTA readable.
   - Screenshot filenames:
     - screenshots/<pagename>/desktop-1280.png
     - screenshots/<pagename>/tablet-768.png
     - screenshots/<pagename>/phone-360.png
3) Gallery thumbnails
   - Click thumbnails — expected: main hero image updates to that thumbnail.
   - Screenshot: screenshots/<pagename>/thumb-click.png (showing selected thumb highlighted)
4) Lightbox / Zoom behavior
   - Click the main hero image.
   - Expected: a full-screen overlay appears; the whole scooter is visible, centered, and not clipped (top or bottom). The image should fit entirely within viewport (no cropping). On small screens, the image is scrollable if it doesn't fit.
   - Screenshot: screenshots/<pagename>/lightbox-desktop.png and screenshots/<pagename>/lightbox-phone.png
5) Sticky CTA (mobile)
   - On small widths (<=768px) the sticky CTA (if present) should appear at bottom and not overlap unreadable content.
   - Screenshot: screenshots/<pagename>/sticky-cta-phone.png
6) Accessibility & keyboard
   - Tab into thumbnail and hero; expected: focus outline visible; pressing Enter/Space on hero opens lightbox.
   - Screenshot: screenshots/<pagename>/focus-thumb.png
7) Variant swatches
   - Click color swatches; expected: selected swatch shows selected state and hero image set resets to first image of that variant.
   - Screenshot: screenshots/<pagename>/swatches.png

Where to save screenshots
- Organize screenshots under `client/screenshots/<pagename>/` and use the filenames suggested above. If you prefer, attach screenshots to the issue/PR or send them in chat and I can review.

How to capture console logs
- In browser devtools → Console: right click → Save as... or copy the output and save as `console.txt` under the page screenshots folder.

If you see failures
- 1) If lightbox still clips the image: collect the screenshot + browser console logs and the exact page URL + viewport size and attach them. I'll iterate on CSS to adjust max-height or centering.
- 2) If other layout regresses: note the page-specific CSS filename present in `src/pages` (e.g., `EcoShine.css`) and I'll either convert it into an override or remove it.

Optional automated screenshot command (PowerShell + Playwright / Puppeteer)
- If you'd like I can add a small Playwright script to capture the screenshots automatically; tell me and I'll add it.

Acceptance criteria (QA pass)
- All tested product pages open without console errors.
- Lightbox shows the full scooter image (centered and fully visible) on desktop and mobile viewports.
- Responsive behavior matches the shared PDP layout across breakpoints.

Notes
- I updated pages to import `src/styles/pdp.css` so styles are centralized. If you kept per-page CSS files as overrides, they may still affect visuals.
- If you want, after you attach 2–3 example screenshots (desktop + phone) I will make any fine-tuning edits immediately.

---

Suggested first screenshots to provide (so I can verify quickly)
- `screenshots/EcoJoy/lightbox-desktop.png` — desktop 1280 width while lightbox open
- `screenshots/EcoJoy/lightbox-phone.png` — phone 360 width while lightbox open
- `screenshots/EcoZeon/lightbox-desktop.png`

Thanks — attach screenshots here or tell me to run the dev server and I will start it and help validate locally.