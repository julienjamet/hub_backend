/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import fs from 'fs';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { User, Post, Comment } from '@/interfaces/groupomania/groupomania.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { Users } from '../../../mongoose/models/groupomania/users.js';
import { Posts } from '../../../mongoose/models/groupomania/posts.js';
/****************************************************/
/************************************************************************/


/******************************************************[ DELETE ROUTES ]*/
export default (app: Application): void => {
    /**
     * DELETE USER
     * @param { string } id
    **/
    app.delete('/groupomania/users/:id', (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id)) {
            res.status(404).json({ message: `Ce compte n'existe pas !` });

            return;
        }

        Users.findOne({ _id: req.params.id })

            .then((user: User | null): Response | void => {
                if (user) {
                    if (user.pseudo != res.locals.user.pseudo) {
                        return res.status(401).json({ message: 'Vous ne pouvez pas supprimer un autre utilisateur que vous !' });
                    }

                    const filename: string | undefined = user.picture?.split('/profil/')[1];

                    if (filename !== 'random-user.png') {
                        fs.unlink(`../frontend/public/uploads/profil/${filename}`, () => {
                            Users.deleteOne({ _id: req.params.id })

                                .then((): Response => res.status(200).json({ message: `Le compte de ${user.pseudo} a été supprimé !` }))

                                .catch((error: Error): Response => res.status(500).json({ error }));
                        })
                    }
                    else {
                        Users.deleteOne({ _id: req.params.id })

                            .then((): Response => res.status(200).json({ message: `Le compte de ${user.pseudo} a été supprimé !` }))

                            .catch((error: Error): Response => res.status(500).json({ error }));
                    }
                }
            })

            .catch((error: Error): Response => res.status(500).json({ error }));
    });


    /**
     * DELETE POST
     * @param { string } id
    **/
    app.delete('/groupomania/posts/:id', (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id)) {
            res.status(404).json({ message: `Ce post n'existe pas !` });

            return;
        }

        Posts.findOne({ _id: req.params.id })

            .then((post: Post | null): Response | void => {
                if (post) {
                    if (post.posterId != res.locals.user._id && res.locals.user._id != `${process.env.ADMIN_ID}`) {
                        return res.status(401).json({ message: `Vous ne pouvez pas supprimer le post de quelqu'un d'autre !` });
                    }

                    const filename: string | undefined = post.picture?.split('/profil/')[1];

                    if (filename) {
                        fs.unlink(`../frontend/public/uploads/profil/${filename}`, (): void => {
                            Posts.deleteOne({ _id: req.params.id })

                                .then((): Response => res.status(200).json({ message: `Le post a été supprimé !` }))

                                .catch((error: Error): Response => res.status(500).json({ error }));
                        })
                    }
                    else {
                        Posts.deleteOne({ _id: req.params.id })

                            .then((): Response => res.status(200).json({ message: `Le post a été supprimé !` }))

                            .catch((error: Error): Response => res.status(500).json({ error }));
                    }
                }
            })

            .catch((error: Error): Response => res.status(404).json({ error }));
    });


    /**
     * DELETE COMMENT
     * @param { string } id
    **/
    app.delete('/groupomania/posts/comments/:id', (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id)) {
            res.status(404).json({ message: `Ce post n'existe pas !` });

            return;
        }

        if (req.body.commenterId != res.locals.user._id && res.locals.user._id != `${process.env.ADMIN_ID}`) {
            res.status(401).json({ message: `Vous ne pouvez pas supprimer un commentaire à la place de quelqu'un d'autre !` });

            return;
        }

        Posts.findOne({ _id: req.params.id })

            .then((post: Post | null): Response | void => {
                if (post) {
                    const commentToEdit: Comment | undefined = post.comments.find((comment: Comment): boolean => comment._id == req.body.commentId);

                    if (commentToEdit == undefined) {
                        return res.status(404).json({ message: `Ce commentaire n'existe pas !` });
                    }

                    if (commentToEdit.commenterId != res.locals.user._id && res.locals.user._id != `${process.env.ADMIN_ID}`) {
                        return res.status(401).json({ message: `Vous ne pouvez pas supprimer un commentaire qui n'est pas le vôtre !` });
                    }
                    else {
                        Posts.updateOne({ _id: req.params.id }, { $pull: { comments: { _id: req.body.commentId } } })

                            .then((): Response => res.status(200).json({ message: 'Vous avez supprimé votre commentaire !' }))

                            .catch((error: Error) => res.status(500).json({ error }));
                    }
                }
            })

            .catch((error: Error): Response => res.status(404).json({ error }));
    });
};
/************************************************************************/