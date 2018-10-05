.PHONY: lint chrome firefox
GIT_ROOT = $(shell git rev-parse --show-toplevel)

default: lint chrome firefox

lint:
	git ls-files | grep -e '.js$$' | xargs node_modules/.bin/eslint

build/manifest.json: manifest.json
	mkdir -p build/
	cp -a \
		icons/ \
		LICENSE.md \
		manifest.json \
		README.md \
		user-script.js \
		build/

icons: icons/256.png
	convert icons/256.png -resize 32 32.png
	convert icons/256.png -resize 48 48.png
	convert icons/256.png -resize 64 64.png
	convert icons/256.png -resize 96 96.png
	convert icons/256.png -resize 128 128.png

chrome: build/manifest.json
	# Make build dir
	test -d "$(GIT_ROOT)/dist" || mkdir "$(GIT_ROOT)/dist"

	# Write private key
	test -f "$(GIT_ROOT)/dist/key.pem" || echo "$${CHROME_KEY}" > "$(GIT_ROOT)/dist/key.pem"

	# Build crx
	node_modules/.bin/crx pack \
		--output="$(GIT_ROOT)/dist/born-to-be-alive.crx" \
		--private-key="$(GIT_ROOT)/dist/key.pem" \
		--zip-output="/tmp/born-to-be-alive-chrome.zip" \
		"$(GIT_ROOT)/build"

	# Remove key
	rm "$(GIT_ROOT)/dist/key.pem"

firefox: build/manifest.json
	node_modules/.bin/web-ext build \
		--source-dir build/ \
		--artifacts-dir="$(GIT_ROOT)/dist/" \
		--no-input \
		--overwrite-dest

	mv "$(GIT_ROOT)/dist/"*.zip "$(GIT_ROOT)/dist/born-to-be-alive.zip"
