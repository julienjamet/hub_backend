/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { User } from '@/interfaces/groupomania/groupomania.js';
/****************************************************/

/*****************************************[ MODELS ]*/
import { Users } from '../../mongoose/models/groupomania/users.js';
/****************************************************/
/************************************************************************/


/****************************************************[ AUTH MIDDLEWARE ]*/
export const auth: (req: Request, res: Response, next: NextFunction) => void = (req, res, next) => {
    const token: string = req.cookies?.token;
    const tokenKey: string = 'RANDOM_TOKEN_SECRET';

    if (token != undefined) {
        const decodedToken: { userId: string } = jwt.verify(token, tokenKey) as { userId: string };
        const userId: string = decodedToken.userId;

        Users.findOne({ _id: userId })

            .then((user: User | null): void => {
                if (user) {
                    res.locals.user = user;

                    next();
                }
            })

            .catch((): Response => {
                res.locals.user = null;

                res.cookie('token', '', { maxAge: 1 });

                return res.status(401).json({ message: `Votre jeton d'authentification n'est pas valide !` });
            });
    }
    else {
        res.locals.user = null;

        return res.status(401).json({ message: `Vous n'êtes pas authentifié(e) !` });
    }
};
/************************************************************************/