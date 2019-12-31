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
var WPThemeIndexer = /** @class */ (function () {
    function WPThemeIndexer(Options, rp) {
        this.self = this;
        // this.setDefaultOptions;
        //  this.WPIndexerOptions = Options;
        var defaultOptions = {
            apiDelay: 1000,
            maxItemsPerPage: 1,
            maxPages: 1
        };
        //merges default settings with specified options
        this.WPIndexerOptions = __assign(__assign({}, defaultOptions), Options);
        this.RequestPromise = rp;
    }
    WPThemeIndexer.prototype.getOptions = function () {
        console.log(JSON.stringify(this.WPIndexerOptions));
    };
    WPThemeIndexer.prototype.updateAllThemes = function () {
        var self = this.self;
        var rpOptions = {
            uri: 'https://api.wordpress.org/themes/info/1.1/?action=query_themes',
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        RequestPromise(rpOptions)
            .then(function (body) {
            self.getThemes(body);
        })
            .catch(function (err) {
            console.log('api failed ' + err);
        });
    };
    WPThemeIndexer.prototype.getThemes = function (body) {
        var self = this.self;
        this.numberOfThemePages = parseInt(body["info"]["pages"]);
        this.numberOfThemes = parseInt(body["info"]["results"]);
        this.themesPerPage = Math.floor(this.numberOfThemes / this.numberOfThemePages);
        var numberOfThemesOnPage = this.themesPerPage;
        var themeCounter = 0;
        var pageNumber = 1;
        // cycle through each page, and then ...
        while (pageNumber <= this.numberOfThemePages && pageNumber <= this.WPIndexerOptions.maxPages) {
            //since the last page may have less than a full page, figure determine the remaining
            if (pageNumber == this.numberOfThemePages)
                numberOfThemesOnPage = (this.numberOfThemes - (this.themesPerPage * pageNumber));
            //..and then loop through each item in the page
            this.getThemesInPage(pageNumber, numberOfThemesOnPage);
            if (themeCounter >= this.numberOfThemes)
                break;
            themeCounter++;
            pageNumber++;
        }
    };
    WPThemeIndexer.prototype.getThemesInPage = function (pageNumber, numberOfThemesOnPage) {
        var self = this.self;
        function getPageThemes(pageNumber, numberOfThemesOnPage, body) {
            var themeCounter = 0;
            while (themeCounter < numberOfThemesOnPage && themeCounter < self.WPIndexerOptions.maxItemsPerPage) {
                console.log('PageNumber: ' + pageNumber + ' Item Number: ' + themeCounter + ' ' + body["themes"][themeCounter]["name"]);
                //     console.log(pageNumber + ',' + themeCounter + ': ' + body["themes"][themeCounter]["name"])
                themeCounter++;
            }
            return;
        }
        var rpOptions = {
            uri: "https://api.wordpress.org/themes/info/1.1/?action=query_themes&request[page]=" + pageNumber,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        function makeApiCall() {
            self.RequestPromise(rpOptions)
                .then(function (body) {
                getPageThemes(pageNumber, numberOfThemesOnPage, body);
            })
                .catch(function (err) {
                console.log('Error:Couldn\'t retrieve page from ' + rpOptions.uri);
            });
        }
        // we need to have a progressively long delay or they all will happen at approx the same time.
        setTimeout(makeApiCall, pageNumber * self.WPIndexerOptions.apiDelay);
    };
    return WPThemeIndexer;
}());
var options = {
    apiDelay: 1000,
    maxPages: 3,
    maxItemsPerPage: 5
};
var RequestPromise = require("request-promise");
var wpThemes = new WPThemeIndexer(options, RequestPromise);
wpThemes.updateAllThemes();
wpThemes.getOptions();
