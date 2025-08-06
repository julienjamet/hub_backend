/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application } from 'express';
/****************************************************/

/************************************[ MIDDLEWARES ]*/
import { frontAuth } from '../../middlewares/pokemon/frontAuth.js';
import { auth } from '../../middlewares/pokemon/auth.js';
import { rank } from '../..//middlewares/pokemon/rank.js';
/****************************************************/

/*****************************************[ ROUTES ]*/
import GetRoutes from './get_routes/get_routes.js';
import PostRoutes from './post_routes/post_routes.js';
import PutRoutes from './put_routes/put_routes.js';
import DeleteRoutes from './delete_routes/delete_routes.js';
/****************************************************/
/************************************************************************/


/*****************************************************[ POKEMON ROUTER ]*/
export default (app: Application): void => {
    app.get('/frontauth', frontAuth);
    app.use('/pokemon', auth, rank);

    GetRoutes(app);
    PostRoutes(app);
    PutRoutes(app);
    DeleteRoutes(app);
};
/************************************************************************/