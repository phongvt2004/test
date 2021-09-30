const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb+srv://phongvt2004:baoboisiudangiu@cluster0.tz2hg.mongodb.net/project?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('connect successfuly');
    } catch (error) {
        console.log('Cannot connect');
    }
}

module.exports = { connect };
