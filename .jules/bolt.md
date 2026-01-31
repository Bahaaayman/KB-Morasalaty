# Bolt's Journal

## 2024-05-22 - [Missing Journal]
**Learning:** The journal file was missing, so I created it.
**Action:** Always check for the journal file and create it if it doesn't exist.

## 2024-05-22 - [Lazy Loading Images]
**Learning:** The `templates.html` page contained several images below the fold that were loading immediately. This consumes bandwidth and slows down initial rendering.
**Action:** Applied `loading="lazy"` and `decoding="async"` to all images in `templates.html`. This is a standard optimization for static sites without a build step.
