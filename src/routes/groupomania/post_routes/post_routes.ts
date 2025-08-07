/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { Post, User } from '@/interfaces/groupomania/groupomania.js';
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


/********************************************************[ POST ROUTES ]*/
export default (app: Application): void => {
    /**
     * SIGN UP
    **/
    app.post('/groupomania/signup', (req: Request, res: Response): void => {
        if (req.body.pseudo == '' || req.body.email == '' || req.body.password == '') {
            res.status(400).json({ message: 'Le formulaire est incomplet !' });

            return;
        }

        if (
            /^([A-Z])([a-zéèç0-9]+).{1,}(-[A-Z][a-zéèêïç]+)?$/.test(req.body.pseudo) &&
            /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(req.body.email) &&
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(req.body.password)
        ) {
            bcrypt.hash(req.body.password, 10)

                .then((hash: string): void => {
                    const user: User = new Users<User>({
                        pseudo: req.body.pseudo,
                        email: req.body.email,
                        password: hash
                    })

                    if (user.save) {
                        user.save()

                            .then((): Response => res.status(201).json({ message: `Bienvenue ${req.body.pseudo} ! Votre compte a été créé !` }))

                            .catch((error: Error): void => {
                                const errors: { pseudo: string, email: string } = errorHandling(error);

                                res.status(400).json({ errors });
                            })
                    }
                })

                .catch((error: Error): Response => res.status(500).json({ error }));
        }
        else {
            if (!/^([A-Z])([a-zéèç0-9]+).{1,}(-[A-Z][a-zéèêïç]+)?$/.test(req.body.pseudo)) {
                res.status(400).json({ message: `Veuillez entrer un pseudo d'au moins 3 caractères commençant par une lettre majuscule` });

                return;
            }
            if (!/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(req.body.email)) {
                res.status(400).json({ message: 'Veuillez entrer une adresse email valide' });

                return;
            }
            if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(req.body.password)) {
                res.status(400).json({ message: `Veuillez entrer un mot de passe d'au moins 8 caractères comprenant au moins une majuscule, une minuscule, un chiffre et un caractère spécial` });

                return;
            }
        }
    });


    /**
     * LOGIN
    **/
    app.post('/groupomania/login', (req: Request, res: Response): void => {
        if (req.body.email == '' || req.body.password == '') {
            res.status(400).json({ message: 'Le formulaire est incomplet !' });

            return;
        }

        Users.findOne({ email: req.body.email })

            .then((user: User | null): void => {
                if (user) {
                    bcrypt.compare(req.body.password, user.password)

                        .then((valid: boolean): Response | void => {
                            if (!valid) {
                                return res.status(401).json({ message: 'Le mot de passe est incorrect !' });
                            }
                            else {
                                const token: string = jwt.sign(
                                    { userId: user._id },
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '120h' }
                                );

                                res.cookie('token', token, { httpOnly: true });
                                res.status(200).json({ message: `Bonjour ${user.pseudo} ! Vous êtes maintenant connecté(e) à votre session !` });
                            }
                        })

                        .catch((error: Error): Response => res.status(500).json({ error }));
                }
            })

            .catch((): Response => res.status(404).json({ message: `Il n'existe aucun compte associé à l'adresse email '${req.body.email}' !` }));
    });


    /**
     * CREATE POST
    **/
    app.post('/groupomania/posts', uploadImage.single('image'), (req: Request, res: Response): void => {
        if (req.body.posterId != res.locals.user._id) {
            res.status(401).json({ message: `Vous ne pouvez pas créer un post à la place de quelqu'un d'autre !` })

            return;
        }

        const newPost: Post = new Posts(req.file ? {
            posterId: req.body.posterId,
            posterPseudo: res.locals.user.pseudo,
            message: req.body.message,
            picture: `./uploads/profil/${req.file.filename}`,
            likers: [],
            comments: []
        } : {
            posterId: req.body.posterId,
            posterPseudo: res.locals.user.pseudo,
            message: req.body.message,
            likers: [],
            comments: []
        });

        if (newPost.save) {
            newPost.save()

                .then((): Response => res.status(201).json({ message: 'Votre post a été créé !' }))

                .catch((error: Error): Response => res.status(500).json(error));
        }
    });


    /**
     * LOGOUT
    **/
    app.post('/logout', (req: Request, res: Response): void => {
        res.cookie('token', '', { maxAge: 1 });
        res.redirect('/home');

        console.log('Vous êtes maintenant déconnecté(e) de votre session, à bientôt !');
    });
};
/************************************************************************/