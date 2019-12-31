//'use strict';

interface IndexerOptions {
    apiDelay?: number,
    maxItemsPerPage?: number,
    maxPages?: number
}



class WPThemeIndexer {
    constructor(Options: IndexerOptions, rp: object) {
        this.self = this;
        // this.setDefaultOptions;

        //  this.WPIndexerOptions = Options;
        let defaultOptions = {
            apiDelay: 1000,
            maxItemsPerPage: 1,
            maxPages: 1

        }
        //merges default settings with specified options
        this.WPIndexerOptions = { ...defaultOptions, ...Options };


        this.RequestPromise = rp;


    }

    private self;

    private WPIndexerOptions: IndexerOptions;

    private RequestPromise: object;

    public getOptions(): void {

        console.log(JSON.stringify(this.WPIndexerOptions))

    }
    public updateAllThemes(): void {

        let self = this.self


        const rpOptions: object = {
            uri: 'https://api.wordpress.org/themes/info/1.1/?action=query_themes',

            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };

        RequestPromise(rpOptions)
            .then(


                function (body) {

                    self.getThemes(body)
                }

            )
            .catch(function (err: object) {
                console.log('api failed ' + err)
            });



    }

    private numberOfThemePages: number;
    private numberOfThemes: number;
    private themesPerPage: number;

    private getThemes(body: object): void {

        let self = this.self;

        this.numberOfThemePages = parseInt(body["info"]["pages"]);
        this.numberOfThemes = parseInt(body["info"]["results"]);
        this.themesPerPage = Math.floor(this.numberOfThemes / this.numberOfThemePages);
        let numberOfThemesOnPage: number = this.themesPerPage;

        let themeCounter: number = 0;
        let pageNumber: number = 1;
        // cycle through each page, and then ...
        while (pageNumber <= this.numberOfThemePages && pageNumber <= this.WPIndexerOptions.maxPages) {
            //since the last page may have less than a full page, figure determine the remaining
            if (pageNumber == this.numberOfThemePages) numberOfThemesOnPage = (this.numberOfThemes - (this.themesPerPage * pageNumber))

            //..and then loop through each item in the page
            this.getThemesInPage(pageNumber, numberOfThemesOnPage)

            if (themeCounter >= this.numberOfThemes) break;
            themeCounter++;
            pageNumber++;
        }
    }


    private getThemesInPage(pageNumber: number, numberOfThemesOnPage: number): void {
        let self = this.self

        function getPageThemes(
            pageNumber: number,
            numberOfThemesOnPage: number,
            body: object
        ): void {

            let themeCounter = 0
            while (themeCounter < numberOfThemesOnPage && themeCounter < self.WPIndexerOptions.maxItemsPerPage) {
                console.log('PageNumber: ' + pageNumber + ' Item Number: ' + themeCounter + ' ' + body["themes"][themeCounter]["name"])
                //     console.log(pageNumber + ',' + themeCounter + ': ' + body["themes"][themeCounter]["name"])
                themeCounter++;

            }


            return;

        }



        let rpOptions = {
            uri: "https://api.wordpress.org/themes/info/1.1/?action=query_themes&request[page]=" + pageNumber, //todo: get real url

            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        function makeApiCall() {


            self.RequestPromise(rpOptions)
                .then(


                    function (body: object) {

                        getPageThemes(pageNumber, numberOfThemesOnPage, body)
                    }

                )

                .catch(function (err) {
                    console.log('Error:Couldn\'t retrieve page from ' + rpOptions.uri)
                });
        }
        // we need to have a progressively long delay or they all will happen at approx the same time.
        setTimeout(makeApiCall, pageNumber * self.WPIndexerOptions.apiDelay);


    }
}

const options = {
    apiDelay: 1000,
    maxPages: 3,
    maxItemsPerPage: 5
}


import RequestPromise = require("request-promise");

const wpThemes = new WPThemeIndexer(options, RequestPromise);

wpThemes.updateAllThemes();

wpThemes.getOptions();

