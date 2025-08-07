/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { User, Post, Comment } from '@/interfaces/groupomania/groupomania.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { Users } from '../../../mongoose/models/groupomania/users.js';
import { Posts } from '../../../mongoose/models/groupomania/posts.js';
/****************************************************/
/************************************************************************/


/*******************************************************[ PATCH ROUTES ]*/
export default (app: Application): void => {
    /**
     * FOLLOW USER
     * @param { string } id
    **/
    app.patch('/groupomania/users/follow/:id', (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id) || !isValidObjectId(req.body.idToFollow)) {
            res.status(404).json({ message: `Ce compte n'existe pas !` });

            return;
        }

        if (req.params.id == req.body.idToFollow) {
            res.status(400).json({ message: `Vous ne pouvez pas vous suivre vous-même !` });

            return;
        }

        if (req.params.id != res.locals.user._id) {
            res.status(401).json({ message: `Vous ne pouvez pas suivre quelqu'un à la place de quelqu'un d'autre !` })

            return;
        }

        Users.findOne({ _id: req.params.id })

            .then((follower: User | null): Response | void => {
                if (follower) {
                    const followings: string | undefined = follower.followings?.find(id => id == req.body.idToFollow);

                    if (followings != undefined) {
                        return res.status(400).json({ message: `Vous suivez déjà cette personne !` });
                    }

                    Users.updateOne({ _id: req.params.id }, { $push: { followings: req.body.idToFollow } })

                        .then((): void => {
                            Users.findOne({ _id: req.body.idToFollow })

                                .then((following: User | null): void => {
                                    if (following) {
                                        Users.updateOne({ _id: req.body.idToFollow }, { $push: { followers: req.params.id } })

                                            .then((): Response => res.status(200).json({ message: `${follower.pseudo} suit ${following.pseudo} !` }));
                                    }
                                })
                        })
                }
            })

            .catch((): Response => res.status(404).json({ message: `Ce compte n'existe pas !` }));
    });


    /**
     * UNFOLLOW USER
     * @param { string } id
    **/
    app.patch('/groupomania/users/unfollow/:id', (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id) || !isValidObjectId(req.body.idToUnfollow)) {
            res.status(404).json({ message: `Ce compte n'existe pas !` });

            return;
        }

        if (req.params.id != res.locals.user._id) {
            res.status(401).json({ message: `Vous ne pouvez pas arrêter de suivre quelqu'un à la place de quelqu'un d'autre !` });

            return;
        }

        Users.findOne({ _id: req.params.id })

            .then((follower: User | null): Response | void => {
                if (follower) {
                    const followings: string | undefined = follower.followings?.find(id => id == req.body.idToUnfollow);

                    if (followings == undefined) {
                        return res.status(400).json({ message: `Vous ne pouvez pas arrêter de suivre quelqu'un que vous ne suiviez pas !` });
                    }

                    Users.updateOne({ _id: req.params.id }, { $pull: { followings: req.body.idToUnfollow } })

                        .then((): void => {
                            Users.findOne({ _id: req.body.idToUnfollow })

                                .then((following: User | null): void => {
                                    if (following) {
                                        Users.updateOne({ _id: req.body.idToUnfollow }, { $pull: { followers: req.params.id } })

                                            .then((): Response => res.status(200).json({ message: `${follower.pseudo} ne suit plus ${following.pseudo} !` }));
                                    }
                                })
                        })
                }
            })

            .catch((): Response => res.status(404).json({ message: `Ce compte n'existe pas !` }));
    });


    /**
     * LIKE POST
     * @param { string } id
    **/
    app.patch('/groupomania/posts/like/:id', (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id)) {
            res.status(404).json({ message: `Ce post n'existe pas !` });

            return;
        }

        if (req.body.id != res.locals.user._id) {
            res.status(401).json({ message: `Vous ne pouvez pas liker un post à la place de quelqu'un d'autre !` });

            return;
        }

        Posts.findOne({ _id: req.params.id })

            .then((post: Post | null): Response | void => {
                if (post) {
                    const likers: string | undefined = post.likers.find((id: string): boolean => id == res.locals.user._id);

                    if (likers != undefined) {
                        return res.status(400).json({ message: `Vous aviez déjà liké ce post !` });
                    }

                    Posts.updateOne({ _id: req.params.id }, { $push: { likers: res.locals.user._id } })

                        .then((): void => {
                            Users.updateOne({ _id: req.body.id }, { $push: { likes: req.params.id } })

                                .then((): Response => res.status(200).json({ message: `Vous avez liké ce post !` }));
                        });
                }
            })

            .catch((): Response => res.status(404).json({ message: `Ce post n'existe pas !` }));
    });


    /**
     * UNLIKE POST
     * @param { string } id
    **/
    app.patch('/groupomania/posts/unlike/:id', (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id)) {
            res.status(404).json({ message: `Ce post n'existe pas !` });

            return;
        }

        if (req.body.id != res.locals.user._id) {
            res.status(401).json({ message: `Vous ne pouvez pas arrêter de liker un post à la place de quelqu'un d'autre !` });

            return;
        }

        Posts.findOne({ _id: req.params.id })

            .then((post: Post | null): Response | void => {
                if (post) {
                    const likers: string | undefined = post.likers.find((id: string): boolean => id == res.locals.user._id);

                    if (likers == undefined) {
                        return res.status(400).json({ message: `Vous ne likiez pas ce post !` });
                    }

                    Posts.updateOne({ _id: req.params.id }, { $pull: { likers: res.locals.user._id } })

                        .then((): void => {
                            Users.updateOne({ _id: req.body.id }, { $pull: { likes: req.params.id } })

                                .then((): Response => res.status(200).json({ message: `Vous avez arrêté de liker ce post !` }));
                        });
                }
            })

            .catch((): Response => res.status(404).json({ message: `Ce post n'existe pas !` }));
    });


    /**
     * COMMENT POST
     * @param { string } id
    **/
    app.patch('/groupomania/posts/comment/:id', (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id)) {
            res.status(404).json({ message: `Ce post n'existe pas !` });

            return;
        }

        if (req.body.commenterId != res.locals.user._id) {
            res.status(401).json({ message: `Vous ne pouvez pas commenter un post à la place de quelqu'un d'autre !` });

            return;
        }

        Posts.findOne({ _id: req.params.id })

            .then((post: Post | null): Response | void => {
                if (post) {
                    Posts.updateOne({ _id: req.params.id }, {
                        $push: {
                            comments: {
                                commenterId: req.body.commenterId,
                                commenterPseudo: res.locals.user.pseudo,
                                text: req.body.text,
                                timestamp: new Date().getTime()
                            }
                        }
                    })

                        .then((): Response => res.status(200).json({ message: `Vous avez commenté ce post !` }));
                }
            })

            .catch((): Response => res.status(404).json({ message: `Ce post n'existe pas !` }));
    });


    /**
     * EDIT COMMENT
     * @param { string } id
    **/
    app.patch('/groupomania/posts/comment/edit/:id', (req: Request, res: Response): void => {
        if (!isValidObjectId(req.params.id)) {
            res.status(404).json({ message: `Ce post n'existe pas !` });

            return;
        }

        if (req.body.commenterId != res.locals.user._id && res.locals.user._id != `${process.env.ADMIN_ID}`) {
            res.status(401).json({ message: `Vous ne pouvez pas modifier un commentaire à la place de quelqu'un d'autre !` });

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
                        return res.status(401).json({ message: `Vous ne pouvez pas modifier un commentaire qui n'est pas le vôtre !` });
                    }
                    else {
                        commentToEdit.text = req.body.text;

                        if (post.save) {
                            post.save();

                            return res.status(200).json({ message: `Vous avez modifié votre commentaire !` });
                        }
                    }
                }
            })

            .catch((): Response => res.status(404).json({ message: `Ce post n'existe pas !` }));
    });
};
/************************************************************************/