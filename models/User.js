class User {
    constructor({ id, name, email, username, password }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
    }
}

module.exports = User;