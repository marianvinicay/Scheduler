// User.js

class User {
    constructor(jsonUser, policies) {
        this.id = jsonUser.id;
        this.name = jsonUser.name;
        this.balance = jsonUser.balance;
        this.policies = policies;
    }
}

export default User;