/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import mongoose, { Schema, Model } from 'mongoose';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { PageHeader } from '@/interfaces/hub/hub.js';
/****************************************************/

/************************************[ CONNECTIONS ]*/
import { hubConnection } from '../../connections/hub.js';
/****************************************************/
/************************************************************************/


/**************************************************[ PAGE HEADER MODEL ]*/
/*****************************************[ SCHEMA ]*/
const pageHeader: object = {
    location: { type: String, required: true },
    text: { type: [String], required: true }
};

const pageHeaderSchema: Schema<PageHeader> = new mongoose.Schema(pageHeader);
/****************************************************/


/******************************************[ MODEL ]*/
export const PageHeaders: Model<PageHeader> = hubConnection.model('PageHeaders', pageHeaderSchema);
/****************************************************/
/************************************************************************/