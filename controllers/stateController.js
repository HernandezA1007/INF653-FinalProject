// const State = require('../models/State');
const fs = require('fs');
const path = require('path');
const State = require('../models/State');

// const statesData = JSON.parse(fs.readFileSync('./states.json', 'utf8'));
const statesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../states.json'), 'utf8'));


/*
exports.getStates = async (req, res) => {
    try {
        // const states = await State.find();
        // res.json(states);
        res.json(statesData);
    } catch (err) {
        // res.status(500).json({ error: err.message });
        res.status(500).json({ error: err.message });
    }
};
*/
exports.getStates = async (req, res) => {
    try {
        const statesWithFacts = await Promise.all(statesData.map(async (state) => {
            const funFacts = await State.findOne({ stateCode: state.code });
            if (funFacts) {
                return { ...state, funFacts: funFacts.funfacts };
            }
            return state;
        }));
        res.json(statesWithFacts);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getState = async (req, res) => {
    try {
        // const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
        const stateCode = req.params.state.toUpperCase();
        console.log("Searching for state: ", stateCode);
        const state = statesData.find(state => state.code === stateCode); // === req.params.state.toUpperCase()
        if (state == null ) {
            return res.status(404).json({ message: 'Cannot find state' });
        }
        res.json(state);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};