import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  message: Message[];
  createdAt: Date;
}

const UserSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true, "user name is required."],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "email is required."],
    unique: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      "please use a valid email.",
    ],
  },

  password: {
    type: String,
    required: [true, "password is required."],
  },

  verifyCode: {
    type: String,
    required: [true, "verifyCode is required."],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCodeExpiry is required."],
  },

  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },

  message: [MessageSchema],

  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const UserModal =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModal;
