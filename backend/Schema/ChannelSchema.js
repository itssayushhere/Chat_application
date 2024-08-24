import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  type: { type: String, required: true },
  members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  moderators: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
  image:{type:String},
  description:{type:String}
});

export default mongoose.model('Channel', ChannelSchema);
