# browser-sync start --watch "*.html, *.css, */*.html, */*.css"
browser-sync start --proxy localhost:4000 --no-ghost-mode --serveStatic 'assets' --files "assets" --files "weeks" --files "views"
