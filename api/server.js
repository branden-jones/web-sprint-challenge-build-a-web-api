const express = require('express');
const { 
    logger,
    validateProjectId,
    checkForValidUpdate,
    } = require('./projects/projects-middleware');
const server = express();

server.use(express.json())
server.use(logger)

const Projects = require('./projects/projects-model');

// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!

server.get('/api/projects', (req,res) => {
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

server.get('/api/projects/:id', validateProjectId, (req,res) => {
    const { completed, actions, description, id, name } = req.proj;
    res.status(200).json({
        id: id,
        name: name,
        description: description,
        actions: actions.length,
        completed: completed
    });
})

server.post('/api/projects', (req,res, next) => {
    const { name, description } = req.body
    try{
        if( !name || !description ){
            res.status(400).json({
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

server.put('/api/projects/:id', validateProjectId, checkForValidUpdate, async (req,res,next) => {
    try{
        const updatedProj = await Projects.update(req.params.id, req.body)
        res.status(200).json(updatedProj)
    }
    catch(err){
        next(err)
    }
})

server.delete('/api/projects/:id', validateProjectId, async (req,res,next) => {
    try{ 
        const deletedItem = await Projects.remove(req.params.id)
        res.status(200).json(deletedItem)
    }
    catch(err){
        next(err)
    }
})

server.get('/api/projects/:id/actions', async (req,res, next) => {
    const { id } = req.params;
    const idCheck = await Projects.get(id)
    try {        
        if(idCheck){
            const actions = await Projects.getProjectActions(id);
            res.json(actions)
        }
        else{
            res.status(404).json({
                message: "Invalid Id"
            })
        }
    }
    catch(err){
        next(err)
    }
})

// ****  Fall Back Error Message  ****

server.use((err,req,res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack 
    })
})

module.exports = server;

