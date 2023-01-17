const { Router } = require("express");
// const checkData = require("../middlewares/checkData");
const  { activitiesPost, activitiesGet }  = require('../controllers/contActivities')
const abilitiesRouter = Router();

abilitiesRouter.post('/',activitiesPost)
abilitiesRouter.get('/',activitiesGet)



module.exports = abilitiesRouter;
