// User.js

class User {
    constructor(jsonUser, policies) {
        this.id = jsonUser.id;
        this.name = jsonUser.name;
        this.email = jsonUser.email;
        this.balance = jsonUser.balance;
        this.policies = policies;
    }
}

export default User;