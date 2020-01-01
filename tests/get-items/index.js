const assert = require('assert');
const wpOrg = require('wporg-mini')

const options = {
    apiDelay: 1000,
    maxPages: 1,
    maxItemsPerPage: 1
}



const wpThemes = new wpOrg(options, "themes");
const wpPlugins = new wpOrg(options, "plugins");
function printOutItem(item, pageNumber, itemNumber) {

    assert.equal(itemNumber, 0, 'first item retrieved must be 0')
    assert.equal(pageNumber, 1, 'first page retrieved must be 1')
    //    assert.notEqual(item2["name"], undefined, 'retrieve one item whose name is not undefined')



    try {
        console.log('PageNumber: ' + pageNumber + ' Item Number: ' + itemNumber + ' ' + item["name"])
    }


    catch (err) {
        assert.fail("failed", "pass", 'Test failed calling callback', '###')
        console.error(err.message)
    }
}
try {

    wpThemes.getAllItems(printOutItem);
}
catch (err) {
    assert.fail("failed", "pass", 'Test Failed executing method', '###')
    console.error(err.message)


}
