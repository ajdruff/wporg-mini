var wpOrg = require('wporg-mini');
var options = {
    apiDelay: 2000,
    maxPages: 3,
    maxItemsPerPage: 1
};
function printOutTheme(item, pageNumber, itemNumber) {
    console.log('PageNumber: ' + pageNumber + ' Item Number: ' + itemNumber + ' Theme:' + item["name"]);
}
function printOutPlugin(item, pageNumber, itemNumber) {
    console.log('PageNumber: ' + pageNumber + ' Item Number: ' + itemNumber + ' Plugin:' + item["name"]);
}
//Themes
var wpThemes = new wpOrg(options, //see options section of readme
"themes" // 'themes' or 'plugins'
);
wpThemes.getAllItems(printOutTheme);
//Plugins
//const wpPlugins = new wpOrg(options, "plugins");
//wpPlugins.getAllItems(printOutPlugin);
