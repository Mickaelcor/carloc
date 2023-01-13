const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    status: { type: Boolean }
})

module.exports = mongoose.model('Car', carSchema);