module.exports = UserModel = [];
class UserService {

    async findUser(name) {
        const user = await UserModel.find(s => s.name == name);
        return user;
    }

    createUser(data) {
        var userId = UserModel.length;
        UserModel.push({ userId: userId, ...data});
        return userId;
    }
}

module.exports = new UserService();
