//'use strict';
interface IndexerOptions {
    apiDelay?: number,
    maxItemsPerPage?: number,
    maxPages?: number
}



import * as rp from "request-promise";

class WpOrgClient {
    constructor(Options: IndexerOptions, wpType: 'themes' | 'plugins') {
        this.self = this;
        this.wpType = wpType;
        //  this.WpOrgClientOptions = Options;
        let defaultOptions = {
            apiDelay: 1000,
            maxItemsPerPage: 1,
            maxPages: 1

        }
        //merges default settings with specified options
        this.WpOrgClientOptions = { ...defaultOptions, ...Options };


        this.RequestPromise = rp;


    }

    private self;

    private WpOrgClientOptions: IndexerOptions;
    private wpType: 'themes' | 'plugins';
    private RequestPromise: object;


    private themeConfig: object = {
        baseUrl: "https://api.wordpress.org/themes/info/1.1/?action=query_themes",
        itemName: "theme",
    }

    private pluginConfig: object = {
        baseUrl: "https://api.wordpress.org/plugins/info/1.1/?action=query_plugins",
        itemName: "plugin",
    }

    private wpConfig: object = { "themes": this.themeConfig, "plugins": this.pluginConfig }


    public getOptions(): void {

        console.log(JSON.stringify(this.WpOrgClientOptions))


    }
    public getAllItems(callback: FunctionStringCallback): void {

        let self = this.self


        const rpOptions: object = {
            uri: this.wpConfig[self.wpType].baseUrl,

            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };

        self.RequestPromise(rpOptions)
            .then(


                function (body) {

                    self.getItems(body, callback)
                }

            )
            .catch(function (err: object) {
                console.log('api failed ' + err)
            });



    }

    private numberOfPages: number;
    private numberOfItems: number;
    private numberOfItemsPerPage: number;

    private getItems(body: object, callback): void {

        let self = this.self;

        this.numberOfPages = parseInt(body["info"]["pages"]);
        this.numberOfItems = parseInt(body["info"]["results"]);
        this.numberOfItemsPerPage = Math.floor(this.numberOfItems / this.numberOfPages);
        let numberOfItemsOnPage: number = this.numberOfItemsPerPage;

        let itemNumber: number = 0;
        let pageNumber: number = 1;
        // cycle through each page, and then ...
        while (pageNumber <= this.numberOfPages && pageNumber <= this.WpOrgClientOptions.maxPages) {
            //since the last page may have less than a full page, figure determine the remaining
            if (pageNumber == this.numberOfPages) numberOfItemsOnPage = (this.numberOfItems - (this.numberOfItemsPerPage * pageNumber))

            //..and then loop through each item in the page
            this.getItemsInPage(pageNumber, numberOfItemsOnPage, callback)

            if (itemNumber >= this.numberOfItems) break;
            itemNumber++;
            pageNumber++;
        }
    }


    private getItemsInPage(pageNumber: number, numberOfItemsOnPage: number, callback): void {
        let self = this.self

        function getPageItems(
            pageNumber: number,
            numberOfItemsOnPage: number,
            body: object
        ): void {

            let itemNumber = 0
            while (itemNumber < numberOfItemsOnPage && itemNumber < self.WpOrgClientOptions.maxItemsPerPage) {

                callback(body[self.wpType][itemNumber], pageNumber, itemNumber);

                itemNumber++;

            }


            return;

        }



        let rpOptions = {
            uri: this.wpConfig[self.wpType].baseUrl + "&request[page]=" + pageNumber,

            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        function makeApiCall() {


            self.RequestPromise(rpOptions)
                .then(


                    function (body: object) {

                        getPageItems(pageNumber, numberOfItemsOnPage, body)
                    }

                )

                .catch(function (err) {
                    console.log('Error:Couldn\'t retrieve page from ' + rpOptions.uri)
                    console.log(err)
                });
        }
        // we need to have a progressively long delay or they all will happen at approx the same time.
        setTimeout(makeApiCall, pageNumber * self.WpOrgClientOptions.apiDelay);


    }



}


export = WpOrgClient;

/* import RequestPromise = require("request-promise");

const wpThemeIndex = new WpOrgClient(options, "themes", RequestPromise);
const wpPluginIndex = new WpOrgClient(options, "plugins", RequestPromise);
function printOutItem(item: any) {

    console.log(JSON.stringify(item))
}
wpThemeIndex.getAllItems(printOutItem);

false && wpPluginIndex.getAllItems(printOutItem);
 */