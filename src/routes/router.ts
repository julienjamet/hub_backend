/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application } from 'express';
/****************************************************/

/*****************************************[ ROUTES ]*/
import HubRouter from './hub/router.js';
/****************************************************/
/************************************************************************/


/********************************************************[ MAIN ROUTER ]*/
export default (app: Application): void => {
    HubRouter(app);
};
/************************************************************************/