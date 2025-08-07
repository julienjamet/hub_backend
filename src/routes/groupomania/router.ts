/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application } from 'express';
/****************************************************/

/************************************[ MIDDLEWARES ]*/
import { auth } from '../../middlewares/groupomania/auth.js';
/****************************************************/

/*****************************************[ ROUTES ]*/
import GetRoutes from './get_routes/get_routes.js';
import PostRoutes from './post_routes/post_routes.js';
import PutRoutes from './put_routes/put_routes.js';
import PatchRoutes from './patch_routes/patch_routes.js';
import DeleteRoutes from './delete_routes/delete_routes.js';
/****************************************************/
/************************************************************************/


/*************************************************[ GROUPOMANIA ROUTER ]*/
export default (app: Application): void => {
    app.use('/groupomania/users', auth);
    app.use('/groupomania/posts', auth);

    GetRoutes(app);
    PostRoutes(app);
    PutRoutes(app);
    PatchRoutes(app);
    DeleteRoutes(app);
};
/************************************************************************/