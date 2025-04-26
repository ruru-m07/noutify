.PHONY: full quick

full:
	bunx next build
	npm run electron:build
	bunx electron-builder --linux dir --x64

quick:
	npm run electron:build
	bunx electron-builder --linux dir --x64
