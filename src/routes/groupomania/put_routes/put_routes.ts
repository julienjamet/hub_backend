/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import fs from 'fs';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { User, Post, Errors } from '@/interfaces/groupomania/groupomania.js';
/****************************************************/

/************************************[ MIDDLEWARES ]*/
import { uploadImage } from '../../../middlewares/groupomania/multer.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { Users } from '../../../mongoose/models/groupomania/users.js';
import { Posts } from '../../../mongoose/models/groupomania/posts.js';
/****************************************************/

/****************************************[ METHODS ]*/
import { errorHandling } from '../../../methods/groupomania/groupomania.js';
/****************************************************/
/************************************************************************/


/*********************************************************[ PUT ROUTES ]*/
export default (app: Application): void => {
    /**
     * UPDATE USER
     * @param { string } id
    **/
    app.put('/groupomania/users/:id', uploadImage.single('image'), (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id)) {
            res.status(404).json({ message: `Ce compte n'existe pas !` });

            return;
        }

        Users.findOne({ _id: req.params.id })

            .then((user: User | null): Response | void => {
                if (user) {
                    if (user.pseudo != res.locals.user.pseudo) {
                        return res.status(401).json({ message: 'Vous ne pouvez pas modifier un autre utilisateur que vous !' });
                    }

                    const userObject: User = req.file ? {
                        ...req.body,
                        picture: `./uploads/profil/${req.file.filename}`,
                        id: user._id,
                        password: user.password,
                        followers: user.followers,
                        followings: user.followings,
                        likes: user.likes
                    } : {
                        ...req.body,
                        id: user._id,
                        password: user.password,
                        followers: user.followers,
                        followings: user.followings,
                        likes: user.likes
                    }

                    const filename: string | undefined = user.picture?.split('/profil/')[1];

                    if (req.file !== undefined && filename !== 'random-user.png') {
                        fs.unlink(`../frontend/public/uploads/profil/${filename}`, () => {
                            Users.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })

                                .then((): Response => res.status(200).json({ message: 'La modification a été effectuée !' }))

                                .catch((error: Error): void => {
                                    const errors: { pseudo: string, email: string } = errorHandling(error);

                                    res.status(400).json({ errors });
                                })
                        })
                    }
                    else if ((req.file !== undefined && filename === 'random-user.png') || req.file === undefined) {
                        Users.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })

                            .then((): Response => res.status(200).json({ message: 'La modification a été effectuée !' }))

                            .catch((error: Error): void => {
                                const errors: { pseudo: string, email: string } = errorHandling(error);

                                res.status(400).json({ errors });
                            })
                    }
                }
            })

            .catch((error: Error): Response => res.status(500).json({ error }));
    });


    /**
     * UPDATE POST
     * @param { string } id
    **/
    app.put('/groupomania/posts/:id', uploadImage.single('image'), (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id)) {
            res.status(404).json({ message: `Ce post n'existe pas !` });

            return;
        }

        Posts.findOne({ _id: req.params.id })

            .then((post: Post | null): Response | void => {
                if (post) {
                    if (post.posterId != res.locals.user._id && res.locals.user._id != `${process.env.ADMIN_ID}`) {
                        return res.status(401).json({ message: `Vous ne pouvez pas modifier le post de quelqu'un d'autre !` });
                    }

                    const postUpdate: object = {
                        message: req.body.message
                    };

                    Posts.updateOne({ _id: req.params.id }, { ...postUpdate, _id: req.params.id })

                        .then((): Response => res.status(200).json({ message: 'La modification a été effectuée !' }))

                        .catch((error: Error): void => {
                            const errors: Errors = errorHandling(error);

                            res.status(400).json({ errors });
                        });
                }
            })

            .catch((error: Error): Response => res.status(404).json({ error }));
    });
};
/************************************************************************/