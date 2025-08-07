/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application } from 'express';
/****************************************************/

/*****************************************[ ROUTES ]*/
import HubRouter from './hub/router.js';
import PokemonRouter from './pokemon/router.js';
import GroupomaniaRouter from './groupomania/router.js'
/****************************************************/
/************************************************************************/


/********************************************************[ MAIN ROUTER ]*/
export default (app: Application): void => {
    HubRouter(app);
    PokemonRouter(app);
    GroupomaniaRouter(app);
};
/************************************************************************/