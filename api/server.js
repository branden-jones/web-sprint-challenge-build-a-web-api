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

// server.post('/api/projects', (req,res) => {
//     try{
//         Projects.insert()
//             .then(results => {
//                 console.log(results)
//             })
//             .catch(err => console.log(err))
//     }
//     catch(err){
//         res.status(500).json({
//             message: "Our Bad... Something on our end is messed up",
//             err: err.message,
//             stack: err.stack 
//         })
//     }
// })

server.use('/', (req,res) => {
    res.status(404).json({
        message: "Not Found"
    })
})

module.exports = server;

// {throw new Error(`NOOOOOO`)}
