const tripRouter = require('express').Router();
const { generatePlan, getPlans, getPlan, tripChatBotGemini } = require('../controllers/trip.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

tripRouter.post('/generate-plan',authenticateToken, generatePlan);
tripRouter.get('/', authenticateToken, getPlans);
tripRouter.get('/:id', authenticateToken, getPlan);
tripRouter.post("/chat", authenticateToken,tripChatBotGemini);

module.exports = tripRouter