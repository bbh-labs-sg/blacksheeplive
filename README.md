Black Sheep Live
================

Requirements
------------
* Go (https://golang.org/dl)
* Node (https://nodejs.org)

Setup
-----
1. Make sure you have installed `babel-cli` and `webpack` through NPM (`npm install -g babel-cli webpack`).
2. Go to `/public` folder and run `npm install`
3. Go to the root folder and run `go get` followed by `go build`

Run
---

1. Run `./blacksheeplive` at root folder. If you're not developing, you can stop here.
2. Run `webpack --watch` at `/public`
3. Run `babel --presets react --watch src --out-dir build` at `/public/js/components`
