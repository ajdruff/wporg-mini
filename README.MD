# Wporg Mini

This project provides a npm module that can query the WP Org API.Currently it supports pulling down plugin and theme information only.

Written in TypeScript, compiled to JavaScript as a node module. See 'Developer' section for how to deploy.

## Installation

        npm install wporg-mini

or to install from local source:

        git clone htts://github.com/ajdruff/wporg-mini.git
        cd wporg-mini
        npm run build
        npm install dist/

## Options

When creating the wpOrg object,you can pass options in its constructor.

    options = {
                apiDelay: 2000, //the number of microseconds between api calls
                maxPages: 3, // the maximum number of pages. If you set this to a very high number, 9999 for example, it will stop after retrieving all pages
                maxItemsPerPage: 1 // the maximum items to retrieve from each page. WordPress default appears to be 23
            }

## Example

An example is included in the GitHub project, clone and run it:

        git clone htts://github.com/ajdruff/wporg-mini.git
        cd wporg-mini/example
        npm install
        node ./index.js

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
