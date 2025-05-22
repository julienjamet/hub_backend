/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import mongoose, { Schema, Model } from 'mongoose';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { HubPagePresentation } from '../../../interfaces/hub/hub.js';
/****************************************************/

/************************************[ CONNECTIONS ]*/
import { hubConnection } from '../../connections/hub.js';
/****************************************************/
/************************************************************************/


/****************************************[ HUB PAGE PRESENTATION MODEL ]*/
/*****************************************[ SCHEMA ]*/
const hubPagePresentation: object = {
    location: { type: String, required: true },
    text: { type: [String], required: true }
};

const hubPagePresentationSchema: Schema<HubPagePresentation> = new mongoose.Schema(hubPagePresentation);
/****************************************************/


/******************************************[ MODEL ]*/
export const hubPagePresentations: Model<HubPagePresentation> = hubConnection.model('hubPagePresentations', hubPagePresentationSchema);
/****************************************************/
/************************************************************************/