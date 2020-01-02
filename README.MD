# Wporg Mini

This project provides a npm module that can query the [WordPress.org API](https://codex.wordpress.org/WordPress.org_API).Currently it supports pulling down plugin and theme information only.

Written in TypeScript, compiled to JavaScript as a node module. See 'Developer' section for how to deploy.

> Note that only the GitHub repo, not the npm repository, contains example files and the build script. 
> To build and use the example, read the `Developer Docs` section below.
>
* [Wporg Mini on GitHub](https://github.com/ajdruff/wporg-mini)
* [Wporg Mini on npm](https://www.npmjs.com/package/wporg-mini)

## Installation

## From the npm repository

        npm install wporg-mini



## Options

When creating the wpOrg object,you can pass options in its constructor.

    options = {
                apiDelay: 2000, //the number of microseconds between api calls
                maxPages: 3, // the maximum number of pages. If you set this to a very high number, 9999 for example, it will stop after retrieving all pages
                maxItemsPerPage: 1 // the maximum items to retrieve from each page. WordPress default appears to be 23
            }

## Example

An example is included in the GitHub project, clone and run it:

Clone

        git clone git@github.com:ajdruff/wporg-mini.git
        cd wporg-mini/example

Install

        yarn add wporg-mini 
        
>if you built from source using the Developer section below, you'll use:
> 
>       yarn add ../dist #run this only if you are installing remotely and are not running `yarn add wporg-mini`

Run the example to list a few themes

        node ./index.js

Output - Upon successful execution, the callback function in the example prints out the first few themes of the first few pages of the WordPress.org Theme directory.

        PageNumber: 1 Item Number: 0 Theme:Pokama Lite
        PageNumber: 2 Item Number: 0 Theme:Store Commerce
        PageNumber: 3 Item Number: 0 Theme:Switch Lite

To get a similar output for plugins, just uncomment the plugins code in example/index.js:

        //Plugins
        const wpPlugins = new wpOrg(options, "plugins");
        wpPlugins.getAllItems(printOutPlugin);

>Note that the sequence of results will sometimes be unpredictable due to the asynchronous nature of the API calls. For example, if you run both at the same time, you'll notice that the results are intermixed even though you call the themes api endpoints before starting the plugin api calls.

## Usage

**#add the module**

        const wpOrg = require('wporg-mini')

**#set options**

        const options = {
            apiDelay: 2000, 
            maxPages: 3,
            maxItemsPerPage: 1
        }

With these options, wporg-mini will wait 2 seconds before requesting another item from the API, and it will get the first 3 pages and will only retrieve one result per page.

**#create an instance of the wpOrg module**

        const wpThemes = new wpOrg(
            options, //see options section of readme
            "themes"   // 'themes' or 'plugins'
            );


**#create a callback to process the result**

        function printOutTheme(item, pageNumber, itemNumber) {
            console.log('PageNumber: ' + pageNumber + ' Item Number: ' + itemNumber + ' Theme:' + item["name"])

        }

**Call the getAllItems method to retrieve the results and trigger the callback**

       wpThemes.getAllItems(printOutTheme);

## Developer Docs

This section only applies to you if want to modify the module source code and rebuild it for distribution.

### Requirements

To build the package locally you will need:

* A Bash shell environment
* TypeScript compiler
* yarn
* npm
* git

### Local Install

**Clone and build**

        git clone git@github.com:ajdruff/wporg-mini.git
        cd wporg-mini
        npm run build


This does the following::

1. Compiles the TypeScript file src/wporg-mini.tsc into dist/lib/wporg-mini.js
2. Adds nodejs package.json and supporting files to directory dist
3. Recreates the example directory and contents

To install into your project:

        cd /path/to/your/node/project
        yarn add /path/to/wporg-min/dist

Try out the example to see how you'd install it locally and use it in a project.

### Making Changes

To modify the code, you must edit the files in src and then build the project.

so... the general flow is:

**Edit**

        vim src/wporg-mini.ts

**Build**

        npm run build

>the resulting module will be built in directory `dist`. See Example for how you'd install.

**Commit**

Something like:

    git commit -am 'added an awesome feature'
    git checkout master
    git merge my awesome-feature

**Release**

        np

>this uses the np package and will push to the npm and remote repo

## Authors

Andrew Druffner <andrew@nomstock.com>

## Contributions Welcome

Please submit a pull request! 


## License

[MIT](https://opensource.org/licenses/MIT)