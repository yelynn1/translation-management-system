// Import necessary modules or libraries
const translationsController = require('./translation');
const languageController = require('./language');

module.exports = {
    ...translationsController,
    ...languageController
}