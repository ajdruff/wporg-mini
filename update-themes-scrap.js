

//let myRequest = new Request('https://mdn.github.io/fetch-examples/fetch-request/flowers.jpg');

var RequestPromise = require('request-promise');

var WpThemes = {

    options={}

}

WpThemes.options.apiDelay = 1000;

/*
Outline

get info > get themes > iterates through pages, for each page calls getThemesInPage
*/
var rpOptions = {
    uri: 'https://api.wordpress.org/themes/info/1.1/?action=query_themes',

    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
};

RequestPromise(rpOptions)
    .then(


        function (body) {

            getThemes(body)
        }

    )
    .catch(function (err) {
        console.log('api failed ' + err)
    });


return;

function say(something) {
    console.log(something)

}


//configuration



function getThemes(body) {

    WpThemes.THEMES_PAGE_COUNT = parseInt(body["info"]["pages"]);
    WpThemes.THEMES_TOTAL_COUNT = parseInt(body["info"]["results"]);
    WpThemes.THEMES_PER_PAGE = parseInt(Math.floor(WpThemes.THEMES_TOTAL_COUNT / WpThemes.THEMES_PAGE_COUNT));


    var themeCounter = 0
    var pageNumber = 1;
    // cycle through each page, and then ...
    for (; pageNumber <= WpThemes.THEMES_PAGE_COUNT;) {
        //since the last page may have less than a full page, figure determine the remaining
        if (pageNumber == WpThemes.THEMES_PAGE_COUNT) numberOfThemesOnPage = parseInt(WpThemes.THEMES_TOTAL_COUNT - (WpThemes.THEMES_PER_PAGE * pageNumber))

        //..and then loop through each item in the page
        getThemesInPage(pageNumber, WpThemes.THEMES_PER_PAGE);

        if (themeCounter >= WpThemes.THEMES_TOTAL_COUNT || themeCounter >= 3) break;
        themeCounter++;
        pageNumber++;
    }
}


function getThemesInPage(pageNumber, numberOfThemesOnPage) {


    getThemes = function (pageNumber, numberOfThemesOnPage, body) {

        var themeCounter = 0
        for (; themeCounter < numberOfThemesOnPage;) {
            console.log('PageNumber: ' + pageNumber + ' Item Number: ' + themeCounter + ' ' + body["themes"][themeCounter]["name"])
            //     console.log(pageNumber + ',' + themeCounter + ': ' + body["themes"][themeCounter]["name"])
            themeCounter++;

            if (themeCounter >= numberOfThemesOnPage || themeCounter >= 10) return;
        }


        return;

    }



    var rpOptions = {
        uri: "https://api.wordpress.org/themes/info/1.1/?action=query_themes&request[page]=" + pageNumber, //todo: get real url

        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };
    function makeApiCall() {
        RequestPromise(rpOptions)
            .then(


                function (body) {

                    getThemes(pageNumber, numberOfThemesOnPage, body)
                }

            )

            .catch(function (err) {
                console.log('Error:Couldn\'t retrieve page from ' + rpOptions.uri)
            });
    }
    // we need to have a progressively long delay or they all will happen at approx the same time.
    setTimeout(makeApiCall, pageNumber * WpThemes.options.apiDelay);


}

false && request("https://api.wordpress.org/themes/info/1.1/?action=query_themes&request[page]=2"
    , { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }

        console.log(body);

        var currentThemeTotal = 0
        var currentPage = 1;
        var themeTotalOnPage = 24
        for (; currentPage <= THEMES_PAGE_COUNT;) {
            //call request here
            var currentThemeOnPage = 0
            for (; currentThemeOnPage < themeTotalOnPage;) {

                console.log(currentPage + ',' + currentThemeOnPage + ': ' + body["themes"][currentThemeOnPage]["name"])
                currentThemeOnPage++;
                currentThemeTotal++;
                if (currentThemeTotal >= THEMES_TOTAL_COUNT) break;
            }
            if (currentThemeTotal >= THEMES_TOTAL_COUNT) break;
            currentPage++;
        }



        return;
        var document = body["themes"][0];
        console.log(document);
        indexDocuments(document)
    });

const AppSearchClient = require('@elastic/app-search-node')
//const AppSearchAPIConnector =require ('@elastic/search-ui-app-search-connector');
const connector = {
    hostIdentifier: "",
    engineName: "themes",
    searchKey: "private-f776am23u4hb86ckqfvxoybz",
    endpointBase: "http://localhost:3002",
    baseUrlFn: "http://localhost:3002/api/as/v1/"
};

const baseUrlFn = () => connector.baseUrlFn

const client = new AppSearchClient(undefined, connector.searchKey, baseUrlFn)


function indexDocuments(documents) {
    client
        .indexDocuments(connector.engineName, documents)
        .then(response => console.log(response))
        .catch(error => console.log(error))

}