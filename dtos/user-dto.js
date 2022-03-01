class UserDao{
    id;
    phone; activated;
    createdAt;
    name;

    constructor(user){
        this.id = user._id;
        this.activated = user.activated;
        this.avatar = user.avatar ? `${user.avatar}` : null;
        this.phone = user.phone;
        this.createdAt = user.createdAt;
        this.name = user.name;
    }
}


module.exports = UserDao;
