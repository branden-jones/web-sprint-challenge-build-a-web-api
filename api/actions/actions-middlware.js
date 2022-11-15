// add middlewares here related to actions

const Action = require('./actions-model');

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
        res.json(action)
        next();
    }
}

async function checkForProperUpdates (req,res,next){

}

module.exports = {
    validateActionId,
    checkForProperUpdates
}