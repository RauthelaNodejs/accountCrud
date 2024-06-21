const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
    first_name: { type: String, required: true, maxlength: 100 },
    last_name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, maxlength: 100 },
    phone: { type: String, required: true, maxlength: 16 },
    password: { type: String, required: true, maxlength: 50 },
    birthday: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
    last_modified: { type: Date, default: Date.now },
    isDel: { type: Boolean,default: false},

})
let accountModel = mongoose.model('account', accountSchema)
module.exports = {
    accountModel
}






