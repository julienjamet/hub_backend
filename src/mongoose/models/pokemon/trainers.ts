/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import mongoose, { Schema, Model } from 'mongoose';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { Trainer } from '@/interfaces/pokemon/pokemon.js';

/****************************************************/

/************************************[ CONNECTIONS ]*/
import { pokemonConnection } from '../../connections/pokemon.js';
/****************************************************/
/************************************************************************/


/******************************************************[ TRAINER MODEL ]*/
/*****************************************[ SCHEMA ]*/
const trainer: object = {
    name: { type: String, unique: true, required: true, uppercase: true },
    password: { type: String, required: true },
    level: { type: Number, required: true },
    rank: { type: String, required: true }
};

const trainerSchema: Schema<Trainer> = new mongoose.Schema(trainer);
/****************************************************/


/******************************************[ MODEL ]*/
export const Trainers: Model<Trainer> = pokemonConnection.model('Trainers', trainerSchema);
/****************************************************/
/************************************************************************/