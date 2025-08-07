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


/************************************[ GROUPOMANIA DATABASE CONNECTION ]*/
const username: string = process.env.DB_USERNAME_2 || '';
const password: string = process.env.DB_PASSWORD_GROUPOMANIA || '';
const dbName: string = process.env.DB_NAME_GROUPOMANIA || '';

const groupomaniaConnectionString: string = `mongodb+srv://${username}:${password}@cluster0.rghagbi.mongodb.net/${dbName}`;

const params: DbConnectParams = {
    connectionString: groupomaniaConnectionString,
    dbName: dbName
};

export const groupomaniaConnection: mongoose.Connection = connectToDatabase(params);
/************************************************************************/