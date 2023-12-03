// Import necessary modules or libraries
const logger = require("../utils/logger");
const { connectToDatabase } = require("../db/connection");
const { setValuesToNull, copyKeysIfNotExists } = require("../utils/documentUtil");

(async function () {
  db = await connectToDatabase();
  translations = db.collection("translations");
})();

const createLanguage = async (req, res) => {
  const { lang, name } = req.body;
  logger.info(`Creating language: ${lang}`);
  // find default language
  let defaultLang = await translations.findOne({ default: true });
  let translationValues = {};
  if (defaultLang) {
    // copy translations keys from default language
    translationValues = defaultLang.translations;
    // loop through nested object and set values from translations keys to null
    setValuesToNull(translationValues);
  }
  // create new language
  let result = await translations.insertOne({ lang, name, translations: translationValues });
  res.send(result).status(200);
}

const setDefaultLanguage = async (req, res) => {
  const { lang } = req.params;
  logger.info(`Setting default language: ${lang}`);

  // check if lang exists
  let langToUpdate = await translations.findOne({ lang: lang }, projection = { projection: { _id: 1 } });
  // if exists continue
  if (!langToUpdate) {
    res.send("Language does not exist").status(400);
    return;
  }

  // find default language
  let defaultLangs = await translations.find({ default: true }, { projection: { _id: 1 } }).toArray();
  // set default lang to false
  for (let i = 0; i < defaultLangs.length; i++) {
    let result = await translations.updateOne({ _id: defaultLangs[i]._id }, { $set: { default: false } });
  }
  // set default to true
  let result = await translations.updateOne({ _id: langToUpdate._id }, { $set: { default: true } });
  res.send(result).status(200);
}

// syncKeys
const syncKeys = async (req, res) => {
  logger.info(`Syncing keys`);
  let defaultLang = await translations.findOne({ default: true });
  let otherLangs = await translations.find({ default: false }).toArray();
  for (let i = 0; i < otherLangs.length; i++) {
    let translationValues = otherLangs[i].translations;
    copyKeysIfNotExists(defaultLang.translations, translationValues);
    await translations.updateOne({ _id: otherLangs[i]._id }, { $set: { translations: translationValues } });
  }
  res.send().status(200);
}

// Export the controller functions

module.exports = {
  createLanguage,
  setDefaultLanguage,
  syncKeys
}