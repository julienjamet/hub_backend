/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import mongoose from 'mongoose';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { DbConnectParams } from '@/interfaces/interfaces.js';
/****************************************************/

/****************************************[ METHODS ]*/
import { connectToDatabase } from '../../methods/methods.js';
/****************************************************/
/************************************************************************/


/********************************************[ HUB DATABASE CONNECTION ]*/
const username: string = process.env.DB_USERNAME || '';
const password: string = process.env.DB_PASSWORD || '';
const dbName: string = process.env.DB_NAME_HUB || '';

const hubConnectionString: string = `mongodb+srv://${username}:${password}@hub.msa2gtr.mongodb.net/${dbName}`;

const params: DbConnectParams = {
    connectionString: hubConnectionString,
    dbName: dbName
};

export const hubConnection: mongoose.Connection = connectToDatabase(params);
/************************************************************************/