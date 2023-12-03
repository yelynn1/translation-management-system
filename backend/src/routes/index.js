const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

// router.get('/', controllers.getTranslations);

// translation apis
router.get('/api/translations/:lang', controllers.getTranslations);
router.post('/api/translations/:lang', controllers.updateTranslation);
router.delete('/api/translations', controllers.deleteTranslation);

// language apis
router.post('/api/language', controllers.createLanguage);
router.put('/api/language/:lang/default', controllers.setDefaultLanguage);
router.put('/api/language/sync', controllers.syncKeys);

module.exports = router;