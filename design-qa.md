# Static continuous-board and portfolio hover QA — 2026-09-08

**Comparison target**

- Static source: `C:\Users\masser\Desktop\网页文件\网页元素\页面\连续-06.png` (8000 × 18000).
- Hover-state references: `卡片示意-08.png` through `卡片示意-12.png`.
- Exact colour overlays: `卡片位置-08.png` through `卡片位置-12.png` (five RGBA 8000 × 4500 canvases).
- Implementation: `http://127.0.0.1:4173/#portfolio`, checked in the selected in-app browser at 1638 × 1228 CSS px.
- Flow reviewed: Portfolio loads in grayscale → pointer/focus enters one card → only its matching colour overlay appears → pointer/focus leaves → grayscale source returns.

**Verified composition**

- Navigation, animated Home cover, static About, Portfolio, Contact artwork, section dimensions, and section continuity remain unchanged.
- Each colour asset is rendered as a complete 8000 × 4500 transparent overlay over the matching 16:9 Portfolio panel. It is not cropped, resized independently, or repositioned.
- Alpha bounds were measured from the supplied files and used for the five interaction targets: 08 `(788,1529)–(2258,3795)`, 09 `(2026,1526)–(3500,3798)`, 10 `(3263,1526)–(4739,3800)`, 11 `(4504,1528)–(5977,3798)`, and 12 `(5744,1529)–(7215,3796)`.
- Browser comparison against the supplied hover references confirmed that the colour card top, left, width, height, crop, radius, and overlap align with the baked grayscale card.

**Verified behavior**

- Default Portfolio state shows the original five grayscale cards with their baked shadows and labels.
- Hovering or keyboard-focusing a card fades in only that card's supplied colour state.
- The selected card keeps the supplied size and position; no scale, translation, rotation, modal, or click action was added.
- Leaving the card restores the original grayscale row.
- Browser checks captured the default state and multiple colour states, including the supplied car and trendy-toys overlays.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed


# Cosmetics cards 05–06 video viewer QA — 2026-09-09

**Video mapping**

- Card 05 `KERASTASE` → `cosmetics-kerastase-video.mp4` (720 × 1280, 19.029 seconds).
- Card 06 `LANCOME` → `cosmetics-lancome-video.mp4` (1080 × 1350, 20.015 seconds).
- Implementation checked in the selected in-app browser at 1638 × 1228 CSS px.

**Verified composition and behavior**

- Cards 05 and 06 use the exact second-row center and right card bounds from the supplied cosmetics board.
- Each card opens its assigned video in the existing centered, dimmed full-work viewer with the supplied ESC prompt and native video controls.
- Both videos began playback automatically with sound in the tested browser; the implementation retries muted if a browser blocks audible autoplay.
- Pressing Escape removes the viewer and video element, stops playback, restores the cosmetics page to `scrollTop: 304`, and restores keyboard focus to the card that opened it.
- Clicking the supplied exit prompt also removes the viewer and video element while preserving the page scroll position.
- The page exposes all six work buttons, and browser logs contain no errors or warnings.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# CLARINS full-work viewer QA — 2026-09-09

**Comparison targets**

- Open-state mock: `查看作品元素_画板 1.png` (8000 × 4500).
- Dim layer: `查看作品元素-02.png` (8000 × 4500, uniform 60% alpha black).
- Exit control: `查看作品元素-03.png` (transparent artwork at source coordinates 2072 × 603 through 2746 × 814).
- Full artwork: `作品集合_画板 1.png` (4009 × 22814).
- Implementation: `/cosmetics`, checked in the selected in-app browser at 1638 × 1280 CSS px.

**Verified composition**

- Clicking the first CLARINS card keeps the cosmetics page visible beneath the supplied dim layer and opens the full artwork in the reference-width centered column.
- The artwork begins at the supplied vertical offset and keeps its original 4009:22814 aspect ratio without cropping or stretching.
- The supplied `按ESC退出` artwork stays at the reference top-left coordinates and remains visible while the long artwork scrolls.
- The modal owns the visible right scrollbar while the cosmetics page beneath it is locked.

**Verified behavior**

- The exact first-card area opens the viewer with a mouse click or keyboard activation.
- Mouse-wheel scrolling moves the full artwork while the underlying cosmetics page remains at `scrollTop: 0`.
- Pressing Escape closes the viewer, restores focus to the first card, and preserves the underlying scroll position.
- The supplied exit control is also a clickable button.
- Browser logs contain no errors or warnings.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# IP, car, and materials detail routes QA — 2026-09-09

**Comparison targets**

- IP route: `卡片-02-13.png` with `卡片透明-13.png` (8000 × 4500).
- Car route: `卡片-02-14.png` with `卡片透明-14.png` (8000 × 4500).
- Materials route: `卡片-02-15.png` with `卡片透明-15.png` (8000 × 4500).
- Implementations: `/trendy-toys`, `/car-pattern`, and `/materials`, checked in the selected in-app browser at 1280 × 720 CSS px.

**Verified composition**

- Each background and transparent board share the original 8000 × 4500 coordinate system. The card crops, positions, gaps, labels, rounded corners, title artwork, grid, number pills, and right rail match the supplied full-page mockups.
- Recomposition against the supplied mockups produced effectively identical pixels: the IP and car pages have near-zero mean channel error; the materials board remains below 0.3 mean channel levels within its alpha bounds and is visually indistinguishable.
- The IP page shows two cards, the car page shows one full-width card, and the materials page shows three cards with no clipping or unintended scaling.

**Verified behavior**

- Portfolio cards 02, 03, and 04 remain responsive to the existing grayscale-to-colour hover/focus behavior and now navigate to their matching detail routes.
- Each route has a keyboard-accessible return link to `/#portfolio` and a distinct document title.
- Portfolio card 05 remains hover-only.
- Browser console inspection reported no errors or warnings.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# Cosmetics detail route QA — 2026-09-09

**Comparison target**

- Page mock: `美妆系列面板_画板 1 副本 5.png` (8000 × 4500).
- Background: `codex-clipboard-725a1c6a-d543-429f-82e0-943a62c92cf4.png` (8000 × 4500).
- Work board: `美妆系列面板-作品_画板 1 副本 5.png` (8000 × 7734, transparent).
- Implementation: `http://127.0.0.1:4173/cosmetics`, checked in the selected in-app browser at 1638 × 1228 CSS px.

**Verified composition**

- The supplied background and transparent work board use the same full-width coordinate system, preserving the six cards' exact crops, spacing, rounded corners, labels, and grid alignment.
- The background grid is extended beneath the taller work board without exposing the scrollbar baked into the source screenshot.
- The first viewport matches the supplied mock's title, Chinese label, numbered controls, three-column card layout, dark grid background, and visible right scrollbar.
- Scrolling to the lower limit shows all three bottom cards and their labels without clipping or overlap.

**Verified behavior**

- Portfolio card 1 remains hover-responsive and opens `/cosmetics` in the same browser tab.
- Mouse-wheel and scrollbar navigation expose the second row of work.
- Number controls 1–3 return to the first row; number controls 4–6 move to the second row. Hash URLs preserve that row after reload.
- The browser Back action returns to `/#portfolio`; a keyboard-accessible return link is also present.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# Cosmetics cards 02–04 full-work viewer QA — 2026-09-09

**Artwork mapping**

- Card 02 `UNREAL` → `作品集合-02.png` (4009 × 25197).
- Card 03 `DERAN` → `作品集合-03.png` (4009 × 24406).
- Card 04 `SCATTERED` → `作品集合-04.png` (4009 × 21677).
- Implementation checked in the selected in-app browser at 1638 × 1280 CSS px.

**Verified composition and behavior**

- Cards 02 and 03 use the exact first-row card bounds from the transparent cosmetics board; card 04 uses the exact second-row left-card bounds.
- Each card opens its matching supplied long artwork at the same centered width, vertical offset, dim level, and exit-control position as card 01.
- Mouse-wheel scrolling moves each long artwork while the underlying cosmetics page remains locked.
- Card 04 was opened with the underlying page at `scrollTop: 304`; after modal scrolling and Escape, the page returned to `scrollTop: 304` and focus returned to card 04.
- At the time of this image-viewer check, cards 05 and 06 remained unchanged; their later video-viewer QA is recorded separately above.
- Browser logs contain no errors or warnings.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# IP and car full-work viewers QA — 2026-09-09

**Artwork mapping**

- IP card 01 `GENKI SUSHI 元气寿司` → `trendy-toys-genki-full.png` (4009 × 24269).
- IP card 02 `MEIYOU PUNK 梅友朋克` → `trendy-toys-meiyou-full.png` (4009 × 21864).
- Car card 01 `PORSCHE 汽车涂装系列渲染` → `car-pattern-porsche-full.png` (4009 × 26726).
- Implementation checked in the selected in-app browser at 1280 × 720 CSS px.

**Verified composition and behavior**

- Both IP cards use the exact left and right card bounds from the supplied 8000 × 4500 transparent board; the car interaction covers the exact single wide-card bounds.
- Each card opens its matching supplied long artwork at the same centered width, dim level, and fixed ESC-control position as the cosmetics image viewer.
- The images retain their 4009px source width and original aspect ratio without stretching or cropping.
- PageDown and mouse-wheel scrolling move the long artwork inside the viewer while the underlying detail page remains locked.
- Escape closes the viewer, restores the background page position, and returns keyboard focus to the card that opened it.
- Browser DOM snapshots show the expected dialog and accessible labels; browser logs contain no errors or warnings.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# Car re-upload and materials full-work viewers QA — 2026-09-10

**Artwork mapping**

- Car card 01 `PORSCHE 汽车涂装系列渲染` → re-uploaded `作品集合-07.png` (4009 × 26726).
- Materials card 01 `FAIRWOOD 大快活餐饮物料渲染` → `作品集合-08.png` (4009 × 28205).
- Materials card 02 `BANTIANYAO 半天妖餐饮物料渲染` → `作品集合-09.png` (4009 × 15557).
- Materials card 03 `MOMOYO MOMOYO饮品物料渲染` → `作品集合-10.png` (4009 × 21553).
- Implementation checked in the selected in-app browser at 1638 × 1280 CSS px.

**Verified composition and behavior**

- The three Materials hit areas match the exported card bounds: card 01 `x70 y202 w473 h593`, card 02 `x573 y202 w473 h593`, and card 03 `x1077 y202 w473 h593`.
- All three Materials cards open the correct supplied long artwork, centered over the dimmed detail page without stretching or cropping.
- The re-uploaded PORSCHE artwork opens from the car card and displays the supplied mobile and desktop design sequence.
- PageDown and mouse-wheel scrolling move the long artwork while the underlying page remains locked.
- Escape closes each viewer and returns keyboard focus to the card that opened it.
- Browser DOM snapshots expose the expected dialog and descriptive accessible labels; browser logs contain no errors or warnings.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# Video-editing detail route QA — 2026-09-10

**Source mapping**

- Portfolio card 05 `视频剪辑作品` → `/video-editing`.
- Detail header and first viewport → `剪辑系列面板-16.png` (8000 × 4500).
- Eight-card artwork board → `剪辑面板透明-16.png` (8000 × 10850).

**Verified composition and behavior**

- The supplied title, black grid, 1–8 index row, three-column layout, artwork crops, labels, and card radii remain aligned in the original 8000px coordinate system.
- The page preserves the full 10850px board aspect ratio and continues the supplied black grid below the first viewport.
- Normal mouse-wheel scrolling reaches the second and third card rows, including cards 07 and 08.
- Each of the eight baked number controls has a matching accessible link; controls 1–3 return to the first row, 4–6 position the second row, and 7–8 position the last row.
- Clicking Portfolio card 05 navigates to `/video-editing` in the current tab, and the detail page provides a return link to the Portfolio section.
- Browser DOM snapshots expose the expected route, artwork description, and all eight quick-position labels.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# Video-editing card playback QA — 2026-09-10

**Video mapping and playback**

- Card 01 → `video-editing-01.mp4` (`6月30日 (1).mp4`), duration 73.5 seconds.
- Card 02 → `video-editing-02.mp4` (`a80f185dfcab7563c01256e44f22653c_raw.mp4`), duration 40.8 seconds.
- Card 03 → `video-editing-03.mp4` (`b6f0d13b01e96e10790dc0868efc3257_raw.mp4`), duration 48.9 seconds.
- Card 04 → `video-editing-04.mp4` (`孟博士防晒科普(1).mp4`), duration 68.6 seconds.
- Card 05 → `video-editing-05.mp4` (`七夕喜鹊桥.mp4`), duration 52.7 seconds.
- Card 06 → `video-editing-06.mp4` (`普罗米修斯.mp4`), duration 42.2 seconds.
- Card 07 → `video-editing-07.mp4` (`孟博士补水科普.mp4`), duration 62.4 seconds.
- Card 08 → `video-editing-08.mp4` (`夏天是什么颜色.mp4`), duration 21.7 seconds.
- Browser playback checks reported `readyState: 4` and `paused: false` for all eight cards after opening.

**Verified interaction**

- All eight transparent hit areas align with the supplied three-row card board at the 1280 × 720 viewport.
- Clicking any card opens its matching video in the centered dimmed viewer with native playback, volume, progress, and fullscreen controls.
- The clicked video starts automatically; if the browser blocks audible autoplay, playback continues muted rather than failing.
- Escape and the supplied exit control close the viewer, stop and unload the video, restore the detail-page position, and return keyboard focus to the originating card.
- After closing card 08, the dialog contained zero remaining video elements and focus returned to card 08.
- Browser logs contain no errors or warnings.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# Shared artwork back-button QA — 2026-09-10

**Reference and asset preparation**

- Used the supplied `新图标-02.png` source and cropped its nontransparent artwork from the 8000 × 4500 canvas to a compact 371 × 269 PNG without scaling or redrawing the icon.
- Matched the supplied `新图标_画板 1.png` placement: the desktop control begins at 26.125vw from the left and 7.625vw from the top, with a 4.7vw width.
- The shared control has a 48px minimum size and a responsive mobile position and size.

**Verified interaction**

- Cosmetics image card 01 shows the new back-arrow at the reference position. Clicking it removes the viewer and returns focus to card 01.
- Cosmetics video card 05 shows the same control. Clicking it removes the viewer and video element, restores the card view, and returns focus to card 05.
- The shared control was verified on `/trendy-toys`, `/car-pattern`, and `/materials`; each resolves `/assets/artwork-back-icon.png` and exposes the accessible label `返回作品列表`.
- Video Editing card 01 uses the same control. Clicking it removes the video viewer and returns focus to the originating card.
- Browser logs contain no errors or warnings.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# Scroll-scrubbed About and Contact reveal QA — 2026-09-10

**Verified visual behavior**

- About keeps the supplied typography and layout unchanged. Its Chinese paragraph leads and the English paragraph follows later in one scroll-scrubbed timeline.
- Contact keeps the supplied baked text, grid, arrow, avatar, and QR artwork unchanged. Its three text groups reveal from left to right in sequence; the circular arrow reveals from top to bottom.
- Scroll position directly controls every visual state: moving down advances the reveal, moving up reverses it, and stopping holds the current frame. The timeline runs from the panel reaching 72% of the viewport height until it reaches 30%.
- Reduced-motion preferences show all copy immediately and remove the directional covers.

**Browser verification**

- About was sampled across six forward-scroll positions: progress increased from `0.0046` to `1.0000`, Chinese opacity increased from `0.01104` to `1`, and English opacity entered later before reaching `1`. Five reverse-scroll samples decreased the same progress back to `0.0325` with the copy fading back out.
- Contact was sampled across six forward-scroll positions: progress increased from `0.0000` to `1.0000`; the three horizontal covers reduced in order to `scaleX(0)` and the arrow cover ended at `scaleY(0)`. Four reverse-scroll samples restored the covers in the same scroll-controlled sequence.
- The Contact middle frame at progress `0.4357` and the completed frame preserve the original alignment without clipping or layout movement.
- The production preview added no new runtime errors; the only retained console entry was a stale Vite development websocket message from before the production preview reload.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed


---

# Home cursor sound-prompt QA — 2026-09-10

**Verified visual and interaction behavior**

- The desktop Home panel shows a white translucent pill above the mouse pointer, using the existing portfolio type and a speaker icon from the installed icon library.
- With audio muted, the prompt reads `点击任意位置即可开启摇滚` and uses the speaker-wave icon.
- Clicking Home unmutes and continues the hero video, changes the prompt to `点击任意位置即可停止摇滚`, and swaps to the muted-speaker icon.
- Clicking Home again mutes the video without interrupting playback and restores the initial prompt.
- The prompt follows the pointer, stays inside safe horizontal viewport bounds, ignores pointer events, and hides when the pointer leaves Home. It remains hidden on mobile.

**Browser verification**

- First click at `(800, 600)` produced `videoMuted: false`, `videoPaused: false`, the stop-rock prompt, and matching pointer coordinates.
- Second click at `(1040, 520)` produced `videoMuted: true`, `videoPaused: false`, the start-rock prompt, and updated pointer coordinates.
- Leaving the Home panel changed prompt opacity to `0` and removed its visible state.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# Custom red arrow cursor QA — 2026-09-10

**Asset preparation**

- Used the supplied `Red Dodge Challenger Cursor--cursor--SweezyCursors.png` artwork as the source.
- Produced a high-quality 64 × 64 transparent PNG for browser cursor use and set the hotspot to `(3, 1)` at the upper-left arrow tip.
- The cursor asset is served from `/assets/custom-site-cursor.png` with HTTP 200 and `image/png` content.

**Browser verification**

- Computed cursor styles on the document body, Home panel, navigation links, portfolio card hit areas, and the Home sound prompt all resolve to the custom cursor asset with the same hotspot.
- The Home sound control still unmutes the video on click and updates the pointer-following prompt without intercepting pointer events.
- The cursor keeps the browser's standard arrow fallback if custom-cursor rendering is unavailable.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.
- No P0, P1, or P2 visual or interaction issues remain in the requested scope.

final result: passed

---

# Portable HTML export QA — 2026-09-10

**Export contents**

- Created `exports/DERAN-2026-portfolio-html/DERAN-2026-作品集.html` as the delivery entry file.
- Inlined the production JavaScript and CSS into the HTML; there are no external hashed JavaScript or CSS bundle tags.
- Copied the complete production asset set into the sibling `assets` directory so all long artwork, videos, fonts, icons, and the custom cursor remain available.
- Added file-protocol route support using `?page=` so all five portfolio category pages can open from the exported HTML and return to the Portfolio section.
- Added `使用说明.txt` with opening and folder-layout instructions.

**Static verification**

- Confirmed a valid HTML doctype, inline module script, inline stylesheet, relative favicon, offline route code, and exported custom cursor asset.
- The export contains 104 assets and totals approximately 1.22 GB because it includes all full-length artwork and 13 source videos.
- Browser automation could not directly open a `file://` URL because the in-app browser blocks local-file navigation by policy; the normal HTTP production preview remains verified separately.

**Build verification**

- `pnpm build` passed.
- `pnpm test:sites` passed: 4 tests, 0 failures.

final result: passed
