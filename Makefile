.PHONY: lint icons

default: lint

lint:
	git ls-files | grep -e '.js$' | xargs node_modules/.bin/eslint

icons: icons/256.png
	convert icons/256.png -resize 32 32.png
	convert icons/256.png -resize 48 48.png
	convert icons/256.png -resize 64 64.png
	convert icons/256.png -resize 96 96.png
	convert icons/256.png -resize 128 128.png
