const express = require('express');
const server = express();
server.use(express.json())

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

server.get('/api/projects/:id', (req,res) => {
    const { id } = req.params;
    console.log(id)
    try {        
        if(id) {
            Projects.get(id)
                .then(proj => {
                    res.status(200).json({
                        id: proj.id,
                        name: proj.name,
                        description: proj.description,
                        completed: proj.completed
                    })
                })
                .catch(err => {
                    res.status(404).json({
                        message: "Id does not exist",
                        err: err.message
                    })
            })
        }
        else {
            res.status(404).json({
                message: "Invalid Id"
            })
        }
    }
    catch(err){
        res.status(500).json({
            message: "Our Bad... Something on our end is messed up",
            err: err.message,
            stack: err.stack 
        })
    }
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

server.put('/api/projects/:id', async (req,res,next) => {
    const { id } = req.params;
    const { name, description, completed } = req.body;
    try{
        const idCheck = await Projects.get(id)
        if(idCheck){
            if( !name || !description ){
                res.status(400).json({
                    message: 'Either Name and Desciption required'
                })
            }
            else{
                Projects.update(id, req.body)
                    .then(proj => {
                        res.status(200).json(proj)
                    })
                    .catch(err => {
                        next(err)
                    })
            }
        }
        else {
            res.status(404).json({
                message: 'Valid Id required'
            })
        }
    }
    catch(err){
        next(err)
    }
})

server.delete('/api/projects/:id', async (req,res,next) => {
    const { id } = req.params;
    const idCheck = await Projects.get(id);
    try{ 
        if(idCheck){
            const deletedItem = await Projects.remove(id)
            res.status(200).json(deletedItem)
        }
        else{
            res.status(404).json({
                message: `Invalid Id: Could not Delete/Find Project with Id: ${id}`
            })
        }
    }
    catch(err){
        next(err)
    }
})



// ****  Fall Back Error Message  ****

server.use('/', (err,req,res, next) => {
    res.status(500).json({
        message: "Our Bad... Something on our end is messed up",
        err: err.message,
        stack: err.stack 
    })
})

module.exports = server;

