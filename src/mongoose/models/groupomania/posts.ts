/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import mongoose, { Schema, Model } from 'mongoose';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { Post } from '@/interfaces/groupomania/groupomania.js';
/****************************************************/

/************************************[ CONNECTIONS ]*/
import { groupomaniaConnection } from '../../connections/groupomania.js';
/****************************************************/
/************************************************************************/


/*********************************************************[ POST MODEL ]*/
/*****************************************[ SCHEMA ]*/
const post: object = {
    posterId: { type: String, required: true },
    posterPseudo: { type: String },
    message: { type: String, maxlength: 500, trim: true },
    picture: { type: String },
    likers: { type: [String], required: true },
    comments: {
        type: [
            {
                commenterId: String,
                commenterPseudo: String,
                text: String,
                timestamp: Number
            }
        ], required: true
    }
};

const postSchema: Schema<Post> = new mongoose.Schema(post, { timestamps: true });
/****************************************************/


/******************************************[ MODEL ]*/
export const Posts: Model<Post> = groupomaniaConnection.model('Posts', postSchema);
/****************************************************/
/************************************************************************/