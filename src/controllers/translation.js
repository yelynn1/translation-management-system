// Import necessary modules or libraries
const logger = require("../utils/logger");
const { connectToDatabase } = require("../db/connection");
const { copyKeysIfNotExists } = require("../utils/documentUtil");

// Initialize database and translations collection
let db, translations;
(async function () {
  db = await connectToDatabase();
  translations = db.collection("translations");
})();

// Controller functions
const getTranslations = async (req, res) => {
  const { lang } = req.params;
  logger.info(`Fetching translations for language: ${lang}`);
  let result = await translations.findOne({ lang: lang }, { projection: { _id: 0 } });
  res.send(result).status(200);
}

const updateTranslation = async (req, res) => {
  const { lang } = req.params;
  const data = req.body;
  let updateQueryForLang = { $set: {} };

  for (let key in data) {
    updateQueryForLang.$set[`translations.${key}`] = data[key];
  }

  await translations.updateOne({ lang: lang }, updateQueryForLang, { upsert: true });
  let updatedLanguage = await translations.findOne({ lang: lang }, { projection: { _id: 1, translations: 1 } });

  let otherLangs = await translations.find({ lang: { $ne: lang } }).toArray();
  for (let i = 0; i < otherLangs.length; i++) {
    let translationValues = otherLangs[i].translations;
    copyKeysIfNotExists(updatedLanguage.translations, translationValues);
    await translations.updateOne({ _id: otherLangs[i]._id }, { $set: { translations: translationValues } });
  }

  res.send().status(200);
}

const deleteTranslation = async (req, res) => {
  const { keys } = req.body;
  let deleteQuery = { $unset: {} };
  keys?.forEach(key => {
    deleteQuery.$unset[`translations.${key}`] = 1;
  });

  await translations.updateMany({}, deleteQuery, { upsert: true });
  res.send().status(200);
}

// Export the controller functions
module.exports = {
  getTranslations,
  updateTranslation,
  deleteTranslation
}