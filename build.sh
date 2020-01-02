#!/bin/bash


# prepare directories
rm -rf lib
mkdir lib
rm -rf dist
rm -rf example
mkdir example

# compile TypeScript

tsc # compiles js files in src, creates dist directory and moves compiled files there

# prepare lib
mv dist/wporg-mini.js lib/wporg-mini.js

# Create example
mv dist/example.index.js example/index.js
cd example
npm init -y
yarn add "request"
yarn add "request-promise"
rm -rf node_modules
rm yarn.lock
cd ../

# Create final distribution using npm pack so it uses the .npmignore file

mkdir -p ./dist
npm pack
tar -xzf *.tgz 
rm *.tgz
mv  package/* ./dist && rm -r package
