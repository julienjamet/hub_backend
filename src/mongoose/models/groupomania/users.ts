/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import mongoose, { Schema, Model } from 'mongoose';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { User } from '@/interfaces/groupomania/groupomania.js';
/****************************************************/

/************************************[ CONNECTIONS ]*/
import { groupomaniaConnection } from '../../connections/groupomania.js';
/****************************************************/
/************************************************************************/


/*********************************************************[ USER MODEL ]*/
/*****************************************[ SCHEMA ]*/
const user: object = {
    pseudo: { type: String, unique: true, required: true, maxlength: 15, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, maxlength: 1024 },
    picture: { type: String, default: './uploads/profil/random-user.png' },
    bio: { type: String, maxlength: 1024 },
    followers: { type: [String] },
    followings: { type: [String] },
    likes: { type: [String] }
};

const userSchema: Schema<User> = new mongoose.Schema(user, {timestamps: true});
/****************************************************/


/******************************************[ MODEL ]*/
export const Users: Model<User> = groupomaniaConnection.model('Users', userSchema);
/****************************************************/
/************************************************************************/