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

server.use('/', (req,res) => {
    res.status(404).json({
        message: "Not Found"
    })
})

module.exports = server;

// {throw new Error(`NOOOOOO`)}
