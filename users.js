import fs from 'fs'

function getUsers() {
    let users = fs.readFileSync('users.json', {encoding:'utf8'})
    return users
}

function saveUsers(users) {
    fs.writeFileSync('users.json', "utf8", JSON.stringify(users))
}

function addUser(user) {
    let users = this.getUsers() || {}
    users[user.name] = user
    this.saveUsers(users)
}

function updateUser(user) {
    let thisUser = (this.getUsers())[user.name] || {}
    userClass.keys().forEach(key => { if (user[key]) { thisUser[key] = user[key] } })
    this.saveUsers(thisUser)
}

export default {
    getUsers,
    saveUsers,
    addUser,
    updateUser
}