import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username:{ type: String, required: true , unique: true}, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  image: { type: String, default: null },
  phoneNumber: { type: String, default: null },
  bio:{type:String,default:null}
});

export default mongoose.model('User', UserSchema);
