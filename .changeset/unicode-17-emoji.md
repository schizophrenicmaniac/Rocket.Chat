---
'@rocket.chat/meteor': patch
'@rocket.chat/federation-matrix': patch
'@rocket.chat/pdf-worker': patch
---

Fixes emojis added in Unicode 17 (e.g. 🫪 distorted face) not being recognized as emojis; they now render like other emojis and can be picked and written with their shortcodes
