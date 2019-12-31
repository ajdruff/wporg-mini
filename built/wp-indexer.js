"use strict";
//'use strict';
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
Object.defineProperty(exports, "__esModule", { value: true });
var WpIndexer = /** @class */ (function () {
    function WpIndexer(Options, wpType, rp) {
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
        //  this.WpIndexerOptions = Options;
        var defaultOptions = {
            apiDelay: 1000,
            maxItemsPerPage: 1,
            maxPages: 1
        };
        //merges default settings with specified options
        this.WpIndexerOptions = __assign(__assign({}, defaultOptions), Options);
        this.RequestPromise = rp;
    }
    WpIndexer.prototype.getOptions = function () {
        console.log(JSON.stringify(this.WpIndexerOptions));
        console.log(JSON.stringify(this.wpConfig["themes"]));
        console.log(JSON.stringify(this.wpConfig["themes"].baseUrl));
    };
    WpIndexer.prototype.updateAllItems = function () {
        var self = this.self;
        var rpOptions = {
            uri: this.wpConfig[self.wpType].baseUrl,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        RequestPromise(rpOptions)
            .then(function (body) {
            self.getItems(body);
        })
            .catch(function (err) {
            console.log('api failed ' + err);
        });
    };
    WpIndexer.prototype.getItems = function (body) {
        var self = this.self;
        this.numberOfPages = parseInt(body["info"]["pages"]);
        this.numberOfItems = parseInt(body["info"]["results"]);
        this.numberOfItemsPerPage = Math.floor(this.numberOfItems / this.numberOfPages);
        var numberOfItemsOnPage = this.numberOfItemsPerPage;
        var itemCounter = 0;
        var pageNumber = 1;
        // cycle through each page, and then ...
        while (pageNumber <= this.numberOfPages && pageNumber <= this.WpIndexerOptions.maxPages) {
            //since the last page may have less than a full page, figure determine the remaining
            if (pageNumber == this.numberOfPages)
                numberOfItemsOnPage = (this.numberOfItems - (this.numberOfItemsPerPage * pageNumber));
            //..and then loop through each item in the page
            this.getItemsInPage(pageNumber, numberOfItemsOnPage);
            if (itemCounter >= this.numberOfItems)
                break;
            itemCounter++;
            pageNumber++;
        }
    };
    WpIndexer.prototype.getItemsInPage = function (pageNumber, numberOfItemsOnPage) {
        var self = this.self;
        function getPageItems(pageNumber, numberOfItemsOnPage, body) {
            var itemCounter = 0;
            while (itemCounter < numberOfItemsOnPage && itemCounter < self.WpIndexerOptions.maxItemsPerPage) {
                console.log('PageNumber: ' + pageNumber + ' Item Number: ' + itemCounter + ' ' + body[self.wpType][itemCounter]["name"]);
                //     console.log(pageNumber + ',' + itemCounter + ': ' + body["themes"][itemCounter]["name"])
                itemCounter++;
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
        setTimeout(makeApiCall, pageNumber * self.WpIndexerOptions.apiDelay);
    };
    return WpIndexer;
}());
var options = {
    apiDelay: 1000,
    maxPages: 3,
    maxItemsPerPage: 5
};
var RequestPromise = require("request-promise");
var wpThemeIndex = new WpIndexer(options, "themes", RequestPromise);
var wpPluginIndex = new WpIndexer(options, "plugins", RequestPromise);
false && wpThemeIndex.updateAllItems();
true && wpPluginIndex.updateAllItems();
//wpIndex.getOptions();
