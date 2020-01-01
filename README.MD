# Wporg Mini

This project provides a npm module that can query the [WordPress.org API](https://codex.wordpress.org/WordPress.org_API).Currently it supports pulling down plugin and theme information only.

Written in TypeScript, compiled to JavaScript as a node module. See 'Developer' section for how to deploy.

## Installation

## From the npm repository

        npm install wporg-mini


## OR From local source:

**First clone and build**

        git clone git@github.com:ajdruff/wporg-mini.git
        cd wporg-mini
        yarn install && npm run build

By running the build, you have compiled TypeScript into the lib distribution folder `dist/`. You can now install it from within your node project. Its recommended you use yarn instead of npm since yarn seems to deal with dependencies better.

        cd /path/to/your/node/project
        yarn add /path/to/wporg-min/dist
        yarn install

See the Example section below for working code.

## Options

When creating the wpOrg object,you can pass options in its constructor.

    options = {
                apiDelay: 2000, //the number of microseconds between api calls
                maxPages: 3, // the maximum number of pages. If you set this to a very high number, 9999 for example, it will stop after retrieving all pages
                maxItemsPerPage: 1 // the maximum items to retrieve from each page. WordPress default appears to be 23
            }

## Example 

An example is included in the GitHub project, clone and run it:

        git clone git@github.com:ajdruff/wporg-mini.git
        cd wporg-mini/example
        yarn add ../dist/  #(if installed locally)
        yarn install
        node ./index.js

Upon successful execution, it will list the first few themes of the first few pages of the WordPress.org Theme directory.

## Usage

**#add the module**

        const wpOrg = require('wporg-mini')

**#set options**

        const options = {
            apiDelay: 2000,
            maxPages: 3,
            maxItemsPerPage: 1
        }

**#create an instance**


        const wpThemes = new wpOrg(
            options, //see options section of readme
            "themes"   // 'themes' or 'plugins'
            );


**#create a callback to process the result**

        function printOutItem(item, pageNumber, itemNumber) {
            console.log('PageNumber: ' + pageNumber + ' Item Number: ' + itemNumber + ' ' + item["name"])
     
        }

**get all items and process with the callback**

        wpThemes.getAllItems(printOutItem);

## TypeScript


## Build

This project is written in TypeScript. After making changes, use the npm build script which calls tsc to compiled and copy to the distribution directory.

To create a local build whose target is ./dist: 

    npm run build

To install the local build :

    npm install /path/to/dist/


## Authors

Andrew Druffner <andrew@nomstock.com>

## Contributions Welcome

Please submit a pull request! 
