import express from "express";
import { body, validationResult } from "express-validator";
import Channel from "../Schema/ChannelSchema.js";
import User from "../Schema/UserSchema.js";
import { StreamChat } from "stream-chat";

const router = express.Router();

router.post("/create", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    userId,
    channelType,
    channelName,
    channelImage,
    channelMembers,
    channelDescription,
  } = req.body;

  try {
    //// Find the user who is creating the channel
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    ////Create a channel in the database
    const newChannel = new Channel({
      admin: userId,
      name: channelName,
      type: channelType,
      members: [...channelMembers],
      description: channelDescription,
      image: channelImage,
    });
    await newChannel.save();

    ////create Channel in the StreamChat
    const apisecret = process.env.APISECRET;
    const apikey = process.env.APIKEY;
    const client = StreamChat.getInstance(apikey, apisecret);

    // Create a channel on Stream without connecting the user
    const channel = client.channel(channelType, newChannel._id.toString(), {
      created_by_id: userId,
      name: channelName,
      members: [...channelMembers, userId],
      image: channelImage || "",
      description: channelDescription || "",
    });
    await channel.create();

    //// Push the newChannel id user Channel list
    user.channel.push(newChannel._id);
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Channel created successfully",
        newChannel,
      });
  } catch (error) {
    console.error("Error creating channel:", error);
    res
      .status(400)
      .json({
        success: false,
        message: "Channel creation failed",
        error: error.message,
      });
  }
});
router.get("/public", async (req, res) => {
  try {
    const data = await Channel.find({});
    const filter = data.filter((item) => item.type === "team");
    res
      .status(200)
      .json({ success: true, message: "Channel fetched", data: filter });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error fetching Channels", error });
  }
});

router.delete("/delete/:channelId", async (req, res) => {
  const { channelId } = req.params;

  try {
    // Find the channel in your database
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    await Channel.findByIdAndDelete(channelId);
    
    await User.updateMany(
      { channel: channelId },
      { $pull: { channel: channelId } }
    );

    // Delete the channel from Stream
    const apisecret = process.env.APISECRET;
    const apikey = process.env.APIKEY;

    const client = StreamChat.getInstance(apikey, apisecret);
    const streamChannel = client.channel(channel.type, channelId.toString());

    await streamChannel.delete();

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    console.error("Error deleting channel:", error);
    res
      .status(500)
      .json({ message: "Channel deletion failed", error: error.message });
  }
});

export default router;
