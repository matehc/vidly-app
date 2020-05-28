const Joi = require('joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const genreSchema = Schema({
    name: {type: String, required: true}
    
});

const Genre =  mongoose.model("Genre", genreSchema);


router.get('/', async (req, res, next) => {
    try {
        const genres = await Genre.find();
        console.log(genres);
        res.send(genres);
    } catch(err) {
        console.log(err.message);
    }
    
});


router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const genre = await Genre.findById({_id: id});
        res.send(genre);
    }
    catch (err){
        res.status(404).send(`The genre you reqested does not exist`);
        console.log(err.message);
    }
});

router.post('/', (req, res, next) => {
    const gName = req.body.name;
    const {error} = validateGenreName(req.body);

    if(error) {
        res.status(403).send(error.details[0].message);
    }

    async function createGenre() {
        try {
            
            const genre = new Genre({
                name: gName
            })
    
            const result = await genre.save();
        
            res.send(result);
        } catch (err) {
            console.log(err.message)
        }
    }
    
    createGenre();
   
})

router.put('/:id',async (req, res, next) => {   
    const id = req.params.id;
    const name = req.body.name;
    const {error} = validateGenreName({name});
    console.log(name);
    if(error) {
        res.status(403).send(error.details[0].message);
        return
    }
    
    try {
        const genre = await Genre.findById({_id: id});
        const result =  await genre.updateOne({
            $set: {
                name: name
            }
        }, {new: true});

        res.send(result);

    } catch(err) {
        console.log(err.message);
        res.status(404).send(`something went wrong while updating the database`);
    }

});

router.delete('/:id', async (req, res, next) => {
    const genreId = req.params.id;
   
        try {
            const genre = await Genre.findByIdAndRemove({_id: genreId});
            res.send(genre);
        } 
        catch (err) {
            console.log(err.message);
        }
    // async function removeGenreById(id) {
    // }
    
    
})



// Validator

const validateGenreName = (genre) => {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema);
}

module.exports = router;