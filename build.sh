#!/bin/bash


# prepare directories
rm -rf lib
mkdir lib
rm -rf dist
rm -rf example
mkdir example

# compile TypeScript

tsc # compiles to dist

# prepare lib
mv dist/wporg-mini.js lib/wporg-mini.js

# build example
mv dist/example.index.js example/index.js
cd example
npm init -y
yarn add "request"
yarn add "request-promise"
rm -rf node_modules
rm yarn.lock


# Release

#        npm run build
#        np