const chatModel = require("../Models/chatModel");

//Create a chat
//findUserChats
//findChat

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) {
      return res.status(200).json(chat);
    }
    const newChat = new chatModel({ members: [firstId, secondId] });
    const response = await newChat.save();
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json(error);
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await chatModel.find({ members: { $in: [userId] } });
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error finding user chats:", error);
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });
    if (chat) {
      return res.status(200).json(chat);
    }
    res.status(404).json("Chat not found");
  } catch (error) {
    console.error("Error finding chat:", error);
    res.status(500).json(error);
  }
};

module.exports = { createChat, findUserChats, findChat };
