
# for version in `browser-sync --version` 
# do
# if [ $version != "v6.12.0" ]
browser-sync start --server --port 8001 --files "*.css, *.html, *.js"
