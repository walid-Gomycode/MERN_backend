const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,   
        required: true,
        unique: true,
        trim: true,
    },
    email: {  
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    phone: String,   
    profilePicture: {
        type: String,
        default: '../uploads/avatar.jpg', // default picture
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollectionRole',
        required: true,
    },
}, { timestamps: true, versionKey: false });  // timestamps : date de creation et de modification

const User = mongoose.model('CollectionUser', userSchema);

module.exports = User;