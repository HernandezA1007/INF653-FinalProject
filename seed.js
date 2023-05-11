const mongoose = require('mongoose');
const State = require('../models/State');
const fs = require('fs');

const statesData = JSON.parse(fs.readFileSync('./states.json', 'utf8'));

// Can use this to seed the database with the states.json file
async function seedDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connection successful');

        await State.deleteMany({});
        console.log('Deleted all states');

        await State.insertMany(statesData);
        console.log('Inserted states data');

        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
    console.error('Error occurred while seeding the database');
    console.error(error);
    process.exit(1);
    }
}

seedDB(); 