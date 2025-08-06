/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { authRequest } from '@/interfaces/pokemon/pokemon.js';
/****************************************************/
/************************************************************************/


/****************************************************[ AUTH MIDDLEWARE ]*/
export const auth: (req: Request, res: Response, next: NextFunction) => void = (req, res, next) => {
    const token: string = req.cookies?.token;
    const tokenKey: string = process.env.TOKEN_KEY || 'token_key';

    try {
        if (token) {
            const decodedToken: { name: string } = jwt.verify(token, tokenKey) as { name: string };
            const name: string = decodedToken.name;
    
            (req as authRequest).auth = { name: name };
    
            next();
        }
    }
    catch (error) {
        console.error(error);

        res.status(401).json({ message: `Tu n'es pas authentifié(e) !` });

        return;
    }
};
/************************************************************************/