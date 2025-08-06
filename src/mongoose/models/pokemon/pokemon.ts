/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import mongoose, { Schema, Model } from 'mongoose';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { Pokemon } from '@/interfaces/pokemon/pokemon.js';
/****************************************************/

/************************************[ CONNECTIONS ]*/
import { pokemonConnection } from '../../connections/pokemon.js';
/****************************************************/
/************************************************************************/


/******************************************************[ POKEMON MODEL ]*/
/*****************************************[ SCHEMA ]*/
const pokemon: object = {
    number: { type: Number, required: true },
    name: { type: String, unique: true, required: true, uppercase: true },
    evolve: { type: String, uppercase: true },
    description: { type: String, required: true },
    picture: { type: String, required: true },
    type: { type: [String], required: true },
    trainers: { type: [String], uppercase: true },
    level: { type: Number, required: true },
    isCatchable: { type: Boolean, required: true }
};

const pokemonSchema: Schema<Pokemon> = new mongoose.Schema(pokemon);
/****************************************************/


/******************************************[ MODEL ]*/
export const Pokemons: Model<Pokemon> = pokemonConnection.model('Pokemon', pokemonSchema);
/****************************************************/
/************************************************************************/