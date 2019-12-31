//"use strict";
//'use strict';
exports.__esModule = true;
var WPThemeIndexer = /** @class */ (function () {
    function WPThemeIndexer(Options, rp) {
        this.WPIndexerOptions = Options;
        this.RequestPromise = rp;
    }
    WPThemeIndexer.prototype.updateAllThemes = function () {
        var rpOptions = {
            uri: 'https://api.wordpress.org/themes/info/1.1/?action=query_themes',
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        RequestPromise(rpOptions)
            .then(function (body) {
            this.getThemes(body);
        })["catch"](function (err) {
            console.log('api failed ' + err);
        });
    };
    WPThemeIndexer.prototype.getThemes = function (body) {
        this.numberOfThemePages = parseInt(body["info"]["pages"]);
        this.numberOfThemes = parseInt(body["info"]["results"]);
        this.themesPerPage = Math.floor(this.numberOfThemes / this.numberOfThemePages);
        var numberOfThemesOnPage = this.themesPerPage;
        var themeCounter = 0;
        var pageNumber = 1;
        // cycle through each page, and then ...
        while (pageNumber <= this.numberOfThemePages) {
            //since the last page may have less than a full page, figure determine the remaining
            if (pageNumber == this.numberOfThemePages)
                numberOfThemesOnPage = (this.numberOfThemes - (this.themesPerPage * pageNumber));
            //..and then loop through each item in the page
            this.getThemesInPage(pageNumber, numberOfThemesOnPage);
            if (themeCounter >= this.numberOfThemes || themeCounter >= 3)
                break;
            themeCounter++;
            pageNumber++;
        }
    };
    WPThemeIndexer.prototype.getThemesInPage = function (pageNumber, numberOfThemesOnPage) {
        function getPageThemes(pageNumber, numberOfThemesOnPage, body) {
            var themeCounter = 0;
            while (themeCounter < numberOfThemesOnPage) {
                console.log('PageNumber: ' + pageNumber + ' Item Number: ' + themeCounter + ' ' + body["themes"][themeCounter]["name"]);
                //     console.log(pageNumber + ',' + themeCounter + ': ' + body["themes"][themeCounter]["name"])
                themeCounter++;
                if (themeCounter >= numberOfThemesOnPage || themeCounter >= 10)
                    return;
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
            this.RequestPromise(rpOptions)
                .then(function (body) {
                getPageThemes(pageNumber, numberOfThemesOnPage, body);
            })["catch"](function (err) {
                console.log('Error:Couldn\'t retrieve page from ' + rpOptions.uri);
            });
        }
        // we need to have a progressively long delay or they all will happen at approx the same time.
        setTimeout(makeApiCall, pageNumber * this.WPIndexerOptions.apiDelay);
    };
    return WPThemeIndexer;
}());
var options = {
    apiDelay: 1000
};
var RequestPromise = require("request-promise");
var wpThemes = new WPThemeIndexer(options, RequestPromise);
wpThemes.updateAllThemes();
