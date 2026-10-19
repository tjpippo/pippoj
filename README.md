# Pippo Jeamanukoolkit, portfolio

A static site: open `index.html` in a browser, or upload the whole folder to any static host (GitHub Pages, Netlify, Vercel). No build step.

- `index.html`: home (hero, work, experience, how I work, contact)
- `work-food-loops.html`, `work-no-cloudy-days.html`: case studies
- `assets/site.css`: all styles and design tokens (colors at the top)
- `assets/site.js`: shared behavior (copy email, clocks, contents rail, phone reel)
- `images/`, `resume/`

## Adding the missing images

Some case-study figures stay hidden until their image file exists. Add each image to `images/` with exactly this name:

Food Loops
- fl-concepts.jpg (the three concept sketches)
- fl-convergence.jpg (concepts merging around the scanner)
- fl-lofi-midfi.jpg (lo-fi to mid-fi screens)
- fl-finals.jpg (final hi-fi screens)

No Cloudy Days
- ncd-journey-map.jpg
- ncd-device-sketch.jpg
- ncd-v1-v2.jpg
- ncd-01-dashboard.png, ncd-02-breathing.png, ncd-03-checkin.png, ncd-04-risk.png

To see where each one goes, open a page with `#draft` at the end of the URL (for example `work-food-loops.html#draft`). Every missing image then shows as a box that names its file.
