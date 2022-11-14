

const express = require('express');
const { logger } = require('./projects/projects-middleware');
const server = express();
const projectsRouter = require('./projects/projects-router');
const actionsRouter = require('./actions/actions-router');

server.use(express.json());
server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);
server.use(logger);



// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!



// ****  Fall Back Error Message  ****

server.use('/', (req,res) => { //eslint-disable-line
    res.send(`All Is Quiet On The WEBDEV Front`)
});

module.exports = server;

