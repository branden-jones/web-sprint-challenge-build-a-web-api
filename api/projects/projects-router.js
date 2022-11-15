// Write your "projects" router here!

const express = require('express');
const {
    validateProjectId,
    checkForValidUpdate,
} = require('./projects-middleware');

const Projects = require('./projects-model');

const router = express.Router();



router.get('/', (req,res) => {
    Projects.get()
            .then(project => {
                res.json(project)
            })
            .catch(err => {
                res.status(500).json({
                    message: "Our Bad... Something on our end is messed up",
                    err: err.message,
                    stack: err.stack 
                })
            })
})

router.get('/:id', validateProjectId, (req,res) => {
    const { completed, actions, description, id, name } = req.proj;
    res.status(200).json({
        id: id,
        name: name,
        description: description,
        actions: actions.length,
        completed: completed
    });
})

router.post('/', (req,res, next) => {
    const { name, description } = req.body
    try{
        if( !name || !description ){
            next({
                status: 400,
                message: "Need both name and description"
            })
        }
        else{
            Projects.insert(req.body)
                .then(proj => {
                    res.status(201).json(proj)
                })
                .catch(err => 
                    next(err)
                )
        }
    }
    catch(err){
        next()
    }
})

router.put('/:id', validateProjectId, checkForValidUpdate, async (req,res,next) => {
    try{
        const updatedProj = await Projects.update(req.params.id, req.body)
        res.status(200).json(updatedProj)
    }
    catch(err){
        next(err)
    }
})

router.delete('/:id', validateProjectId, async (req,res,next) => {
    try{ 
        const deletedItem = await Projects.remove(req.params.id)
        res.status(200).json(deletedItem)
    }
    catch(err){
        next(err)
    }
})

router.get('/:id/actions', validateProjectId, async (req,res, next) => {
    try {        
            const actions = await Projects.getProjectActions(req.params.id);
            res.json(actions)
    }
    catch(err){
        next(err)
    }
})

router.use((err,req,res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack 
    })
})

module.exports = router;