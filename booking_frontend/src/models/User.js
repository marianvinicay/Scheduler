// User.js

class User {
    constructor(jsonUser, policy) {
        this.id = jsonUser.id;
        this.name = jsonUser.name;
        this.balance = jsonUser.balance;
        this.policy = policy;
    }
}

export default User;