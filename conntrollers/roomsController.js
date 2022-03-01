const RoomDto = require('../dtos/room.dto');
const roomService = require('../services/room-service');

class RoomController {
    async create(req, res) {
        // room
        const name = req.body;

        if (!name) {
            return res
                .status(400)
                .json({ message: 'Name field is required!' });
        }

        const roomId = await roomService.create({ name });

        return res.json({roomId});
    }

    async index(req, res) {
        const rooms = await roomService.getAllRooms();
        return res.json(rooms);
    }

    async show(req, res) {
        const room = await roomService.getRoom(req.params.roomId);
        return res.json(room);
    }
}


module.exports = new RoomController();