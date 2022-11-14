// add middlewares here related to projects
const Projects = require('./projects-model');

function logger(req, res, next) {
    // DO YOUR MAGIC
    const timeStamp = new Date().toLocaleString();
    const method = req.method;
    const url = req.originalUrl
    console.log(`[${timeStamp}] ${method} to ${url}`);
    next();
  }

  async function validateProjectId(req,res,next){
    const { id } =req.params;
    const idCheck = await Projects.get(id);
    if(idCheck){
        req.proj = idCheck;
        next()
    }
    else{
        next({
            status: 404,
            message: "Id does not exist",
        })
    }
  }

  async function checkForValidUpdate (req,res,next){
    const { name, description, completed } = req.body;
    if( !name || !name.trim() || !description || !description.trim() ) {
        next({
            status: 400,
            message: "Valid Name and Description required"
        })
    }
    else {
        console.log(`middleware`,req.body)
        req.body = {
            name: name.trim(),
            description: description.trim(),
            completed: completed
        };
        next()
    }
  }

  module.exports = {
    logger,
    validateProjectId,
    checkForValidUpdate,
  };