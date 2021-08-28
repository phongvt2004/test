const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

const Groups = new Schema(
    {
        name: {type: String, required: true},
        leader: {type: String, required: true},
        class: {type: Number, required: true},
        memberIds: {type: Array},
        memberNumber: {type: Number},
        slug: { type: String, slug: 'name', unique: true },
    },
    {
        timestamps: true,
    }
)


mongoose.plugin(slug);
module.exports = mongoose.model('Groups', Groups);