

import WpIndexer = require("WpIndexer");

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
