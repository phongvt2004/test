const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

const Users = new Schema(
    {
        fullname: {type: String, required: true},
        username: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        slug: { type: String, slug: 'fullname', unique: true },
        groupIds: {type: Array},
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(slug);
module.exports = mongoose.model('Users', Users);