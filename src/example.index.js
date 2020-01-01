const wpOrg = require('wporg-mini')

const options = {
    apiDelay: 2000,
    maxPages: 3,
    maxItemsPerPage: 1
}



//var RequestPromise = require("request-promise");

const wpThemes = new wpOrg(options, "themes");
const wpPlugins = new wpOrg(options, "plugins");
function printOutItem(item, pageNumber, itemNumber) {
    console.log('PageNumber: ' + pageNumber + ' Item Number: ' + itemNumber + ' ' + item["name"])
    //console.log(item["name"])
}
wpThemes.getAllItems(printOutItem);

false && wpPlugins.getAllItems(printOutItem);


