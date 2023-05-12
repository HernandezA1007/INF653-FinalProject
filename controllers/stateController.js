// const State = require('../models/State');
const fs = require('fs');
const path = require('path');
const State = require('../models/State');

// const statesData = JSON.parse(fs.readFileSync('./states.json', 'utf8'));
const statesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../states.json'), 'utf8'));


/* Middleware */
// exports.checkState = async (req, res, next) => {
//     const stateCode = req.params.state.toUpperCase();
//     // Fetch all state codes from the database
//     const states = await State.find({}, 'stateCode');
//     const stateCodes = states.map(state => state.stateCode);
    
//     if (!stateCodes.includes(stateCode)) {
//       return res.status(400).json({ error: 'Invalid state code.' });
//     }
//     req.stateCode = stateCode;
//     next();
//   };


/* GET requests */
exports.getStates = async (req, res) => {
    try {
        // Get the contig, minpop, maxpop, and codes query parameters
        const contig = req.query.contig;
        let minpop = req.query.minpop;
        let maxpop = req.query.maxpop;
        let codes = req.query.codes; // codes can be used to look at specific states
        // for example localhost:5000/states?codes=ny,ca,tx

        // Convert minpop and maxpop to numbers
        minpop = minpop ? Number(minpop) : 0;
        maxpop = maxpop ? Number(maxpop) : Number.MAX_SAFE_INTEGER;

        // Split the codes string into an array and convert to upper case
        codes = codes ? codes.toUpperCase().split(',') : null;

        // Filter states based on the contig parameter
        let filteredStatesData = statesData;
        if (contig === 'true') {
            filteredStatesData = statesData.filter(state => state.code !== 'AK' && state.code !== 'HI');
        } else if (contig === 'false') {
            filteredStatesData = statesData.filter(state => state.code === 'AK' || state.code === 'HI');
        }

        // Further filter states based on minpop and maxpop for Population request
        filteredStatesData = filteredStatesData.filter(state => state.population >= minpop && state.population <= maxpop);

        // If codes is not null, further filter states based on the codes array
        if (codes) {
            filteredStatesData = filteredStatesData.filter(state => codes.includes(state.code));
        }

        const statesWithFacts = await Promise.all(filteredStatesData.map(async (state) => {
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

// funfacts does not work 
exports.getFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();
        const stateData = statesData.find(state => state.code === stateCode);
        if (stateData == null ) {
            return res.status(404).json({ message: 'Cannot find state' });
        }

        const stateFacts = await State.findOne({ stateCode: stateCode.toLowerCase() });
        if (!stateFacts || stateFacts.funfacts.length === 0) { // Note the change here
            return res.status(404).json({ message: 'Cannot find fun facts for this state' });
        }

        const randomFact = stateFacts.funfacts[Math.floor(Math.random() * stateFacts.funfacts.length)]; // And here
        res.json({ state: stateData.state, funFact: randomFact });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getCapital = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();
        const state = statesData.find(state => state.code === stateCode);
        if (!state) {
            return res.status(404).json({ message: 'Cannot find state' });
        }
        res.json({ state: state.state, capital: state.capital_city });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getNickname = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();
        const state = statesData.find(state => state.code === stateCode);
        if (!state) {
            return res.status(404).json({ message: 'Cannot find state' });
        }
        res.json({ state: state.state, nickname: state.nickname });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getPopulation = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();
        const state = statesData.find(state => state.code === stateCode);
        if (!state) {
            return res.status(404).json({ message: 'Cannot find state' });
        }
        res.json({ state: state.state, population: state.population });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getAdmission = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();
        const state = statesData.find(state => state.code === stateCode);
        if (!state) {
            return res.status(404).json({ message: 'Cannot find state' });
        }
        res.json({ state: state.state, admitted: state.admission_date });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


/* POST request */
exports.addFunFact = async (req, res) => {
    try {
        const { funFact } = req.body;
        if (!funFact) {
            return res.status(400).json({ message: "Fun fact is required." });
        }

        const stateCode = req.params.stateCode.toUpperCase();
        const state = await State.findOne({ stateCode });

        if (!state) {
            return res.status(404).json({ message: "State not found." });
        }

        state.funfacts.push(funFact);
        await state.save();

        res.json({ message: "Fun fact added successfully.", funFact: funFact });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/* PATCH request */
exports.updateFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();
        const { oldFact, newFact } = req.body;

        if (!oldFact || !newFact) {
            return res.status(400).json({ message: 'Both oldFact and newFact are required.' });
        }

        const state = await State.findOne({ stateCode });
        if (!state) {
            return res.status(404).json({ message: 'State not found.' });
        }

        const factIndex = state.funfacts.indexOf(oldFact);
        if (factIndex === -1) {
            return res.status(404).json({ message: 'Fun fact not found.' });
        }

        state.funfacts[factIndex] = newFact;
        await state.save();

        res.json({ message: 'Fun fact updated successfully.', funFact: newFact });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

/* DELETE request */
exports.deleteFunFact = async (req, res) => {
    try {
      const stateCode = req.params.state.toUpperCase();
      const fact = req.body.funFact;
      const state = await State.findOne({ stateCode });
      if (!state || !state.funfacts.includes(fact)) {
        return res.status(404).json({ message: 'Fun fact not found.' });
      }
      state.funfacts = state.funfacts.filter(f => f !== fact);
      await state.save();
      res.json({ message: 'Fun fact deleted successfully.', funFact: fact });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

  