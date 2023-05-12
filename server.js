// Import required modules
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const states = require('./routes/states');
const State = require('./models/State');


const app = express();

console.log(process.env.DATABASE_URI); 

// Middleware setup
app.use(express.static('public')); // Serve static files - HTML, CSS, JS /index.html

// Enable cross-origin resource sharing
app.use(cors());

app.use(express.json());

// Database setup

// Connect to MongoDB Atlas
async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connection successful');
    } catch (error) {
        console.error('MongoDB connection failed');
        console.error(error);
        process.exit(1);
    }
}

// Connect to database
connectDB();

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected to db!');
});

// const statesFunFacts = [
//     {
//         stateCode: 'KS',
//         funfacts: [
//             'Kansas is named after the Kansa Native American tribe, which inhabited the area.', 
//             'Dodge City is the windiest city in the United States.', 
//             'The geographic center of the 48 contiguous (connected) states is located in Smith County, Kansas.']
//       },
//       {
//         stateCode: 'MO',
//         funfacts: [
//             'The ice cream cone was invented at the St. Louis World’s Fair in 1904.', 
//             'Missouri is known as the "Cave State" with over 6000 recorded caves.', 
//             'The tallest man in documented medical history was from Missouri.']
//       },
//       {
//         stateCode: 'OK',
//         funfacts: [
//             'Oklahoma has the largest Native American population of any state in the U.S.', 
//             'Oklahoma is one of only two states whose capital cities name includes the state name.', 
//             'The first parking meter was installed in Oklahoma City in 1935.']
//       },
//       {
//         stateCode: 'NE',
//         funfacts: [
//             'Nebraska is the birthplace of the Reuben sandwich.', 
//             'The Lied Jungle located in Omaha is the world’s largest indoor rain forest.', 
//             'Nebraska has more miles of river than any other state.']
//       },
//       {
//         stateCode: 'CO',
//         funfacts: [
//             'Colorado is the only U.S. state that lies entirely above 1000 meters elevation.', 
//             'The world’s largest natural hot springs pool located in Glenwood Springs.', 
//             'Colorado has the highest paved road in North America.']
//       },    
// ];

/* This was used to add the fun facts to the mongoDB collection */
// statesFunFacts.forEach(stateFunFact => {
//     const state = new State(stateFunFact);
//     state.save()
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
// });

// Routing
app.use('/states', states); 

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use((req, res) => {
    res.status(404).json({ error: '404 Not Found' });
});

// Server setup


// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});