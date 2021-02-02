const mongoose = require('mongoose');
const schema = mongoose.Schema;
const accountTypeSchema = new schema({
    type: {
    1: {type: String, required:true, default:"Module Coordinator"},
    2: {type: String, required:true, default:"Teacher Assistant"},
    3: {type: String, required:true, default:"Student"},
    4: {type: String, required:true, default:"Writer"},
    5: {type: String, required:true, default:"Revisor"}
    }
});

const accountType = mongoose.model('accountType', accountTypeSchema);
module.exports = accountType;