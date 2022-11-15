// Write your "actions" router here!
const express = require('express');
const {
    validateActionId,
    checkForProperUpdates
} = require('./actions-middlware');
const Action = require('./actions-model');
const router = express.Router();


router.get('/', (req, res, next) => {
    Action.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            next(err);
        })
})

router.get('/:id', validateActionId, (req, res, next) => {
    // try{
        
    // }
    // catch(err){
    //     next(err);
    // }
})

router.post('/', (req,res) => {
    console.log(`post`)
})

router.put('/:id', (req,res) => {
    console.log(`put`)
})

router.delete('/:id', (req,res) => {
    console.log(`delete`)
})

module.exports = router;