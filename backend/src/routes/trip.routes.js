const tripRouter = require('express').Router();
const { generatePlan, getPlans, getPlan } = require('../controllers/trip.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

tripRouter.post('/generate_plan',authenticateToken, generatePlan);
tripRouter.get('/', authenticateToken, getPlans);
tripRouter.get('/:id', authenticateToken, getPlan);

module.exports = tripRouter