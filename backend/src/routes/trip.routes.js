const tripRouter = require('express').Router();
const { generatePlan } = require('../controllers/trip.controller');

tripRouter.post('/generate_plan', generatePlan);

module.exports = tripRouter