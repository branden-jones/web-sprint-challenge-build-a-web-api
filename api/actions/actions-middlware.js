// add middlewares here related to actions

const Action = require('./actions-model');
const Project = require('../projects/projects-model')

async function validateActionId(req,res,next){
    const { id } = req.params;
    const action = await Action.get(id);
    if(!action){
        next({
            status: 404,
            message: 'There is not an action with this ID'
        })
    }
    else{
        req.body = action
        next();
    }
}

async function validProjectId(req,res,next){
    const { project_id, notes, description }= req.body
    const project = await Project.get(project_id)
    if(project){
        req.body = {
            project_id: project_id,
            notes: notes,
            description: description
        };
        next()
    }
    else{
        next({
            status: 400,
            message: "Valid Project Id is required"
        })
    }
}

async function checkForProperFormat (req,res,next){
    const { description, notes } = req.body;
    if (!notes ||
        !notes.trim() ||
        !description ||
        !description.trim()){
            next({
                status: 400,
                message: "Notes and Description are required"
            })
        }
    else {
        next()
    }
}

module.exports = {
    validateActionId,
    checkForProperFormat,
    validProjectId
}