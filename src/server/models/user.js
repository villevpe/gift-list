const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "demo";

class User {

    static authenticate(password) {
        return password === ACCESS_TOKEN;
    }
}

module.exports = User;