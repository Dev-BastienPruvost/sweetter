const User = require('../models/user.model');

exports.createUser = async user => {
  try {
    const hashedPassword = await User.hashPassword(user.password);
    const newUser = new User({
      username: user.username,
      local: {
        email: user.email,
        password: hashedPassword
      }
    });
    return newUser.save();
  } catch (err) {
    throw err;
  }
};

exports.findUserByEmail = email => {
  return User.findOne({ 'local.email': email }).exec();
};

exports.findUserById = userId => {
  return User.findById(userId).exec();
};

exports.findUserByUsername = username => {
  return User.findOne({ username }).exec();
};

exports.searchUsersByUsername = search => {
  const reg = `^${search}`;
  const regExp = new RegExp(reg, 'i');
  return User.find({ username: { $regex: regExp } }).exec();
};

exports.addUserIdToCurrentUserFollowing = (currentUser, userId) => {
  currentUser.following = [...currentUser.following, userId];
  return currentUser.save();
};

exports.addCurrentUserIdToUserFollowers = async (currentUser, userId) => {
  try {
    const user = await User.findById(userId);
    user.followers = [...user.followers, currentUser._id];
    return user.save();
  } catch (err) {
    throw err;
  }
};

exports.removeUserIdFromCurrentUserFollowing = (currentUser, userId) => {
  currentUser.following = currentUser.following.filter(objId => objId.toString() !== userId);
  return currentUser.save();
};

exports.removeCurrentUserIdFromUserFollowers = async (currentUser, userId) => {
  try {
    const user = await User.findById(userId);
    user.followers = user.followers.filter(objId => objId.toString() !== currentUser._id.toString());
    return user.save();
  } catch (err) {
    throw err;
  }
};
