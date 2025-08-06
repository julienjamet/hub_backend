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


/****************************************[ POKEMON DATABASE CONNECTION ]*/
const username: string = process.env.DB_USERNAME || '';
const password: string = process.env.DB_PASSWORD_POKEMON || '';
const dbName: string = process.env.DB_NAME_POKEMON || '';

const pokemonConnectionString: string = `mongodb+srv://${username}:${password}@pokemon.aliq4hh.mongodb.net/${dbName}`;

const params: DbConnectParams = {
    connectionString: pokemonConnectionString,
    dbName: dbName
};

export const pokemonConnection: mongoose.Connection = connectToDatabase(params);
/************************************************************************/