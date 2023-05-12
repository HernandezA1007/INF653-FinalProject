const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateController');


// GET requests
router.get('/', stateController.getStates);
router.get('/:state', stateController.getState);
router.get('/:state/funfact', stateController.getFunFact); // funfact does not work
router.get('/:state/capital', stateController.getCapital);
router.get('/:state/nickname', stateController.getNickname);
router.get('/:state/population', stateController.getPopulation);
router.get('/:state/admission', stateController.getAdmission);

// POST requests
router.post('/:stateCode/funfacts', stateController.addFunFact);

// PATCH requests
router.patch('/:state/funfact', stateController.updateFunFact);

// DELETE requests
router.delete('/:state/funfact', stateController.deleteFunFact);

// Middleware
// router.get('/:state', stateController.checkState, stateController.getState);
// router.get('/:state/funfact', stateController.checkState, stateController.getFunFact);
// router.post('/:state/funfact', stateController.checkState, stateController.addFunFact);
// router.patch('/:state/funfact', stateController.checkState, stateController.updateFunFact);
// router.delete('/:state/funfact', stateController.checkState, stateController.deleteFunFact);

module.exports = router
