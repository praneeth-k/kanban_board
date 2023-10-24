const User = require("./model/user");

module.exports.getUserFromDB = async (username) => {
  const userFromDB = await User.findOne({}).where({ name: username });

  return userFromDB;
};

module.exports.addUserToDB = async (user) => {
  let ret = true;
  try {
    const userFromDB = await this.getUserFromDB(user.name);
    if (userFromDB) {
      ret = false;
    } else {
      const userCreationStatus = await User.create({
        name: user.name,
        password: "" + user.password,
      }).catch((err) => {
        console.log(err);
        ret = false;
      });
      ret = userCreationStatus;
    }
  } catch (error) {
    console.log(error);
    ret = false;
  }
  return ret;
};
