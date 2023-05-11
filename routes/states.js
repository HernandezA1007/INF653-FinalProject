const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateController');


router.get('/', stateController.getStates);
router.get('/:state', stateController.getState);


module.exports = router
