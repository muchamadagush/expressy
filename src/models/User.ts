import mongoose, { Document, Schema } from "mongoose"
import bcrypt from 'bcryptjs'
import validator from 'validator'

export interface IUser {
  username: string
  fullName: string
  email: string
  password: string
}

export interface IUserModel extends IUser, Document { }

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('email is invalid');
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate(value: string) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password should not contain word: password');
      }
    },
  }
}, {
  versionKey: false,
  timestamps: true
})

UserSchema.statics.findByCredentials = async (username: string, password: string) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Unable to login');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Unable to login');

  return user;
}

const User = mongoose.model('User', UserSchema);

module.exports = User
