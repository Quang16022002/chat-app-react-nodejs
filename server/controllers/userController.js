const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { usernameOrPhone, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: usernameOrPhone }, { phoneNumber: usernameOrPhone }],
    });
    if (!user)
      return res.json({ msg: "Tên người dùng hoặc mật khẩu không chính xác", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Tên người dùng hoặc mật khẩu không chính xác", status: false });
    const userResponse = user.toObject();
    delete userResponse.password; 
    return res.json({ status: true, user: userResponse });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password , phone} = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      phone
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log('userId',userId)
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

module.exports.getDetailUsers = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log('userId',userId)
    const user = await User.findById(userId).select([
      "email",
      "username",
      "avatarImage",
      "nickname",
      "_id",
    ]);
    if (!user)
      return res.json({ msg: "User not found", status: false });
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.sendFriendRequest = async (req, res, next) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ msg: "User not found" });

    if (user.friendRequests.includes(friendId)) {
      return res.status(400).json({ msg: "Friend request already sent" });
    }

    friend.friendRequests.push(userId);
    await friend.save();

    return res.json({ msg: "Friend request sent" });
  } catch (ex) {
    next(ex);
  }
};

// Chấp nhận yêu cầu kết bạn
module.exports.acceptFriendRequest = async (req, res, next) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({ msg: "No friend request from this user" });
    }

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    return res.json({ msg: "Friend request accepted" });
  } catch (ex) {
    next(ex);
  }
};

// Từ chối yêu cầu kết bạn
module.exports.rejectFriendRequest = async (req, res, next) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);

    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({ msg: "No friend request from this user" });
    }

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);

    await user.save();

    return res.json({ msg: "Friend request rejected" });
  } catch (ex) {
    next(ex);
  }
};