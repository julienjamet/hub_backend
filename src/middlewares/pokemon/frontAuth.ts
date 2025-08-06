/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Response } from 'express';
import jwt from 'jsonwebtoken';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { authRequest } from '@/interfaces/pokemon/pokemon.js';
/****************************************************/
/************************************************************************/


/**********************************************[ FRONT AUTH MIDDLEWARE ]*/
export const frontAuth: (req: authRequest, res: Response) => void = (req, res) => {
    const token: string = req.cookies?.token;
    const tokenKey: string = process.env.TOKEN_KEY || 'token_key';

    try {
        if (token) {
            const decodedToken: { name: string } = jwt.verify(token, tokenKey) as { name: string };
            const name: string = decodedToken.name;
    
            req.auth = { name: name };
    
            res.status(200).json({ auth: req.auth });
        }
    }
    catch (error) {
        console.error(error);

        res.status(401).json({ message: `Tu n'es pas authentifié(e) !` });

        return;
    }
};
/************************************************************************/