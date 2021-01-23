function getUserByEmail(email, users) {
  for (let userID in users) {
    if (users[userID].email === email) {
      return users[userID];
    }
  }
};

module.exports = getUserByEmail ;