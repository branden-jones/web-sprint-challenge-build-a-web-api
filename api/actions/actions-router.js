// Write your "actions" router here!
const express = require('express');
const {
    validateActionId,
    checkForProperFormat,
    validProjectId
} = require('./actions-middlware');

const Action = require('./actions-model');
// const Project = require('../projects/projects-model');
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
    try{
        res.json(req.body);
    }
    catch(err){
        next(err);
    }
})

router.post('/', checkForProperFormat, validProjectId, async (req, res, next) => { //eslint-disable-line
    const { project_id, notes, description } = req.body;
    const newAction = await Action.insert({project_id, notes, description});
    console.log(newAction)
    res.status(201).json(newAction);
}) 

router.put('/:id', checkForProperFormat, async (req,res, next) => {
    const validAction = await Action.get(req.params.id)
    if(validAction){
        const action = await Action.update(req.params.id, req.body)
        console.log(`Action Change Check`,action)
        res.status(200).json(action);
    }
    else{
        next({
            status: 404,
            message: "Action does not exist with that ID"
        })
    }
    
})

router.delete('/:id', validateActionId, async (req,res) => {
    const deleted = await Action.remove(req.params.id)
    res.status(200).json(deleted)
})

router.use((err,req,res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack 
    })
})

module.exports = router;