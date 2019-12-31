"use strict";
//'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var WPThemeIndexer = /** @class */ (function () {
    function WPThemeIndexer(Options, rp) {
        this.setDefaultOptions;
        this.self = this;
        this.WPIndexerOptions = Options;
        //   this.WPIndexerOptions = { ...this.WPIndexerOptions, ...Options };
        this.RequestPromise = rp;
    }
    WPThemeIndexer.prototype.setDefaultOptions = function () {
        this.WPIndexerOptions = {
            apiDelay: 1000,
            maxItemsPerPage: 99,
            maxPages: 9999
        };
        return;
    };
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
    maxItemsPerPage: 5,
    maxPages: 2
};
var RequestPromise = require("request-promise");
var wpThemes = new WPThemeIndexer(options, RequestPromise);
wpThemes.updateAllThemes();
//wpThemes.getOptions();
