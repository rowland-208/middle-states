# On my way to you ♡

A small, responsive countdown postcard. Plain HTML, CSS, and JavaScript; no build step or API keys.

The countdown shows **total hours**, minutes, and seconds until September 25, 2026 at 6 PM Pacific (September 26 at 01:00 UTC).

- Monday, September 21: fly Wilmington → Chicago from 1–3 PM Eastern.
- Friday, September 25: fly Chicago → California from 1:30 PM Central to 4:20 PM Pacific.
- Friday, September 25: reunion at 6 PM Pacific, after landing.

The smiley rides a plane along each illustrated route in proportion to elapsed flight time. These are scheduled positions, not GPS tracking. City markers use approximate geographic coordinates.

Use the buttons at the bottom to preview stops or either flight's midpoint. Choose **Live** to return to the current time. Preview resets on refresh. The countdown stops at zero at the reunion.

Click the middle of the map to fold away the middle states; click the accordion to unfold. Click the bag or smiley to bounce it. Keyboard controls and reduced-motion preferences are supported.

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
