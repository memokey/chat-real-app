const router = require('express').Router();

const roomsController = require('./conntrollers/roomsController');


router.post('/api/rooms', roomsController.create);
router.get('/api/rooms', roomsController.index);
router.get('/api/rooms/:roomId', roomsController.show);

router.get('/api/test', (req, res) => res.json({ msg: 'OK' }));

module.exports = router;
