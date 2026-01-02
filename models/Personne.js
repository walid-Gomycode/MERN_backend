const mongoose = require('mongoose');

const personneSchema = new mongoose.Schema({
    matricule: {
        type: String,   
        required: true,
        unique: true,
        trim: true,
    },
    prenom: {  
        type: String,
        required: true,
        trim: true,
    },
    nom: {
        type: String,
        required: true,
        trim: true,
    }, 
    cin: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }, 
    dateNais:{
        type: Date,
        required: true,
    },
    organisme: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollectionOrganisme',
        required: true,
    },
}, { timestamps: true, versionKey: false });  // timestamps : date de creation et de modification

const Personne = mongoose.model('CollectionPersonne', personneSchema);

module.exports = Personne;