"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var rp = require("request-promise");
var WpOrgClient = /** @class */ (function () {
    function WpOrgClient(Options, wpType) {
        this.themeConfig = {
            baseUrl: "https://api.wordpress.org/themes/info/1.1/?action=query_themes",
            itemName: "theme",
        };
        this.pluginConfig = {
            baseUrl: "https://api.wordpress.org/plugins/info/1.1/?action=query_plugins",
            itemName: "plugin",
        };
        this.wpConfig = { "themes": this.themeConfig, "plugins": this.pluginConfig };
        this.self = this;
        this.wpType = wpType;
        //  this.WpOrgClientOptions = Options;
        var defaultOptions = {
            apiDelay: 1000,
            maxItemsPerPage: 1,
            maxPages: 1
        };
        //merges default settings with specified options
        this.WpOrgClientOptions = __assign(__assign({}, defaultOptions), Options);
        this.RequestPromise = rp;
    }
    WpOrgClient.prototype.getOptions = function () {
        console.log(JSON.stringify(this.WpOrgClientOptions));
    };
    WpOrgClient.prototype.getAllItems = function (callback) {
        var self = this.self;
        var rpOptions = {
            uri: this.wpConfig[self.wpType].baseUrl,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        self.RequestPromise(rpOptions)
            .then(function (body) {
            self.getItems(body, callback);
        })
            .catch(function (err) {
            console.log('api failed ' + err);
        });
    };
    WpOrgClient.prototype.getItems = function (body, callback) {
        var self = this.self;
        this.numberOfPages = parseInt(body["info"]["pages"]);
        this.numberOfItems = parseInt(body["info"]["results"]);
        this.numberOfItemsPerPage = Math.floor(this.numberOfItems / this.numberOfPages);
        var numberOfItemsOnPage = this.numberOfItemsPerPage;
        var itemNumber = 0;
        var pageNumber = 1;
        // cycle through each page, and then ...
        while (pageNumber <= this.numberOfPages && pageNumber <= this.WpOrgClientOptions.maxPages) {
            //since the last page may have less than a full page, figure determine the remaining
            if (pageNumber == this.numberOfPages)
                numberOfItemsOnPage = (this.numberOfItems - (this.numberOfItemsPerPage * pageNumber));
            //..and then loop through each item in the page
            this.getItemsInPage(pageNumber, numberOfItemsOnPage, callback);
            if (itemNumber >= this.numberOfItems)
                break;
            itemNumber++;
            pageNumber++;
        }
    };
    WpOrgClient.prototype.getItemsInPage = function (pageNumber, numberOfItemsOnPage, callback) {
        var self = this.self;
        function getPageItems(pageNumber, numberOfItemsOnPage, body) {
            var itemNumber = 0;
            while (itemNumber < numberOfItemsOnPage && itemNumber < self.WpOrgClientOptions.maxItemsPerPage) {
                callback(body[self.wpType][itemNumber], pageNumber, itemNumber);
                itemNumber++;
            }
            return;
        }
        var rpOptions = {
            uri: this.wpConfig[self.wpType].baseUrl + "&request[page]=" + pageNumber,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        function makeApiCall() {
            self.RequestPromise(rpOptions)
                .then(function (body) {
                getPageItems(pageNumber, numberOfItemsOnPage, body);
            })
                .catch(function (err) {
                console.log('Error:Couldn\'t retrieve page from ' + rpOptions.uri);
                console.log(err);
            });
        }
        // we need to have a progressively long delay or they all will happen at approx the same time.
        setTimeout(makeApiCall, pageNumber * self.WpOrgClientOptions.apiDelay);
    };
    return WpOrgClient;
}());
module.exports = WpOrgClient;
/* import RequestPromise = require("request-promise");

const wpThemeIndex = new WpOrgClient(options, "themes", RequestPromise);
const wpPluginIndex = new WpOrgClient(options, "plugins", RequestPromise);
function printOutItem(item: any) {

    console.log(JSON.stringify(item))
}
wpThemeIndex.getAllItems(printOutItem);

false && wpPluginIndex.getAllItems(printOutItem);
 */ 
