# On my way to you ♡

A small, responsive countdown postcard. Plain HTML, CSS, and JavaScript; no build step or API keys.

The countdown shows **total hours**, minutes, and seconds until September 25, 2026 at 6 PM Pacific (September 26 at 01:00 UTC). The scheduled location changes from Wilmington, NC to Chicago on September 21 at 2 PM Eastern (1 PM Central), then to Palo Alto, CA at the reunion time. These are scheduled stops, not GPS tracking; no flight departure times were provided. City markers use approximate geographic coordinates.

Use “A little peek at the trip” at the bottom to preview each location. Choose **Live** to return to the current time. Preview resets on refresh. The countdown stops at zero after arrival.

## Run locally

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Run schedule checks with `node --test trip.test.cjs`.

## GitHub Pages

Upload these files to a GitHub repository. In **Settings → Pages**, select **Deploy from a branch**, select your branch and **/ (root)**, then save. All asset paths are relative so project Pages URLs work. No build configuration is needed.

## Personalize

- Edit schedule timestamps in `trip.js`; explicit timezone offsets prevent visitor timezone differences. Update the visible dates in `index.html` too.
- Edit map labels, captions, and the inline SVG illustration in `index.html`.
- Colors and responsive styles live in `style.css`.

The plastic bag illustration is an original SVG. State geometry is derived from [PublicaMundi's US states GeoJSON](https://github.com/PublicaMundi/MappingAPI/blob/master/data/geojson/us-states.json). Google Fonts supplies DM Sans and Playfair Display; system fonts are used if unavailable. The supplied meme inspired the design; its image is not embedded.
