/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import mongoose, { Schema, Model } from 'mongoose';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { Project } from '@/interfaces/hub/hub.js';
/****************************************************/

/************************************[ CONNECTIONS ]*/
import { hubConnection } from '../../connections/hub.js';
/****************************************************/
/************************************************************************/


/******************************************************[ PROJECT MODEL ]*/
/*****************************************[ SCHEMA ]*/
const project: object = {
    number: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    skills: { type: [Object], required: true },
    difficulty: { type: Number, required: true },
    startings: { type: [Object], required: true },
    category: { type: String, required: true },
    available: { type: Boolean, required: true }
};

const projectSchema: Schema<Project> = new mongoose.Schema(project);
/****************************************************/


/******************************************[ MODEL ]*/
export const Projects: Model<Project> = hubConnection.model('Projects', projectSchema);
/****************************************************/
/************************************************************************/