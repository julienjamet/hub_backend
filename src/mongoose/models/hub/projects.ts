/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import mongoose, { Schema, Model } from 'mongoose';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { HubProject } from '../../../interfaces/hub/hub.js';
/****************************************************/

/************************************[ CONNECTIONS ]*/
import { hubConnection } from '../../connections/hub.js';
/****************************************************/
/************************************************************************/


/**************************************************[ HUB PROJECT MODEL ]*/
/*****************************************[ SCHEMA ]*/
const hubProject: object = {
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

const hubProjectSchema: Schema<HubProject> = new mongoose.Schema(hubProject);
/****************************************************/


/******************************************[ MODEL ]*/
export const HubProjects: Model<HubProject> = hubConnection.model('HubProjects', hubProjectSchema);
/****************************************************/
/************************************************************************/