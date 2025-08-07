/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { User, Post } from '@/interfaces/groupomania/groupomania.js';
/****************************************************/

/************************************[ MIDDLEWARES ]*/
import { auth } from '../../../middlewares/groupomania/auth.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { Users } from '../../../mongoose/models/groupomania/users.js';
import { Posts } from '../../../mongoose/models/groupomania/posts.js';
/****************************************************/
/************************************************************************/


/*********************************************************[ GET ROUTES ]*/
export default (app: Application): void => {
    /**
     * GET TOKEN
    **/
    app.get('/token', auth, (req: Request, res: Response): void => {
        res.status(200).json(res.locals.user._id);
    });


    /**
     * GET ALL USERS
    **/
    app.get('/groupomania/users', (req: Request, res: Response): void => {
        Users.find().select('-password')

            .then((users: User[]): Response => res.status(200).json(users))

            .catch((error: Error): Response => res.status(404).json({ error }));
    });


    /**
     * GET ONE USER
     * @param { string} id
    **/
    app.get('/groupomania/users/:id', (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id)) {
            res.status(404).json({ message: `Ce compte n'existe pas !` });

            return;
        }

        Users.findById(req.params.id).select('-password')

            .then((user: User | null): void => {
                if (user) {
                    res.status(200).json(user);
                }
            })

            .catch((error: Error): Response => res.status(404).json({ error }));
    });


    /**
     * GET ALL POSTS
    **/
    app.get('/groupomania/posts', (req: Request, res: Response): void => {
        Posts.find().sort({ createdAt: -1 })

            .then((posts: Post[]): Response => res.status(200).json(posts))

            .catch((error: Error): Response => res.status(404).json({ error }));
    });
};
/************************************************************************/