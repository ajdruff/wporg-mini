//'use strict';

interface IndexerOptions {
    apiDelay?: number,
    maxItemsPerPage?: number,
    maxPages?: number
}



class WpIndexer {
    constructor(Options: IndexerOptions, wpType: 'themes' | 'plugins', rp: object) {
        this.self = this;
        this.wpType = wpType;
        //  this.WpIndexerOptions = Options;
        let defaultOptions = {
            apiDelay: 1000,
            maxItemsPerPage: 1,
            maxPages: 1

        }
        //merges default settings with specified options
        this.WpIndexerOptions = { ...defaultOptions, ...Options };


        this.RequestPromise = rp;


    }

    private self;

    private WpIndexerOptions: IndexerOptions;
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

        console.log(JSON.stringify(this.WpIndexerOptions))
        console.log(JSON.stringify(this.wpConfig["themes"]))
        console.log(JSON.stringify(this.wpConfig["themes"].baseUrl))

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

        RequestPromise(rpOptions)
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

        let itemCounter: number = 0;
        let pageNumber: number = 1;
        // cycle through each page, and then ...
        while (pageNumber <= this.numberOfPages && pageNumber <= this.WpIndexerOptions.maxPages) {
            //since the last page may have less than a full page, figure determine the remaining
            if (pageNumber == this.numberOfPages) numberOfItemsOnPage = (this.numberOfItems - (this.numberOfItemsPerPage * pageNumber))

            //..and then loop through each item in the page
            this.getItemsInPage(pageNumber, numberOfItemsOnPage, callback)

            if (itemCounter >= this.numberOfItems) break;
            itemCounter++;
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

            let itemCounter = 0
            while (itemCounter < numberOfItemsOnPage && itemCounter < self.WpIndexerOptions.maxItemsPerPage) {
                console.log('PageNumber: ' + pageNumber + ' Item Number: ' + itemCounter + ' ' + body[self.wpType][itemCounter]["name"])
                callback(body[self.wpType][itemCounter]);
                //     console.log(pageNumber + ',' + itemCounter + ': ' + body["themes"][itemCounter]["name"])
                itemCounter++;

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
        setTimeout(makeApiCall, pageNumber * self.WpIndexerOptions.apiDelay);


    }



}



const options = {
    apiDelay: 1000,
    maxPages: 3,
    maxItemsPerPage: 5
}



import RequestPromise = require("request-promise");

const wpThemeIndex = new WpIndexer(options, "themes", RequestPromise);
const wpPluginIndex = new WpIndexer(options, "plugins", RequestPromise);
function printOutItem(item: any) {

    console.log(JSON.stringify(item))
}
wpThemeIndex.getAllItems(printOutItem);

false && wpPluginIndex.getAllItems(printOutItem);

//wpIndex.getOptions();
interface elasticSearchConnector {
    hostIdentifier: string,
    engineName: string,
    searchKey: string,
    endpointBase: string,
    baseUrlFn: string

}

const connector: elasticSearchConnector = {
    hostIdentifier: "",
    engineName: "themes",
    searchKey: "private-f776am23u4hb86ckqfvxoybz",
    endpointBase: "http://localhost:3002",
    baseUrlFn: "http://localhost:3002/api/as/v1/"
};


import AppSearchClient = require('@elastic/app-search-node')





class ElasticAppSearchClient {

    constructor(connector: elasticSearchConnector) {

        this.self = this;
        this.self.connector = connector;
        const baseUrlFn = () => connector.baseUrlFn

        this.client = new AppSearchClient(undefined, connector.searchKey, baseUrlFn)



    }
    private self: ElasticAppSearchClient;
    private connector: elasticSearchConnector;
    private client: AppSearchClient;
    /* Updates Elastic App Search Engine with doucment */
    private indexElastAppSearchDocument(documents): void {
        this.client
            .indexDocuments(this.connector.engineName, documents)
            .then(response => console.log(response))
            .catch(error => console.log(error))

    }


}
