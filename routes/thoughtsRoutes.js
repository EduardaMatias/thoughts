const express = require('express');
const router = express.Router();

const checkAuth = require('../helpers/auth').checkAuth;

const ThoughtController = require('../controlles/ThoughtController');

router.get('/dashboard', checkAuth, ThoughtController.dashboard);
router.get('/add', checkAuth, ThoughtController.createThought);
router.get('/edit/:id', checkAuth, ThoughtController.editThought);
router.get('/', ThoughtController.showThoughts);

router.post('/add', checkAuth, ThoughtController.createThoughtPost);
router.post('/remove/:id', checkAuth, ThoughtController.removeThought);
router.post('/edit/:id', checkAuth, ThoughtController.editThoughtPost);

module.exports = router;
