/************************************************************[ IMPORTS ]*/
/*************************************[ INTERFACES ]*/
import { Errors } from '@/interfaces/groupomania/groupomania.js';
/****************************************************/
/************************************************************************/


/**************************************************************[ TYPES ]*/
type ErrorHandling = (error: Error) => Errors;
/************************************************************************/


/************************************************************[ METHODS ]*/
export const errorHandling: ErrorHandling = (error) => {
    const errors: Errors = { pseudo: '', email: '' };

    if (error.message.includes('pseudo')) {
        errors.pseudo = 'Ce pseudo est déjà utilisé !';
    }

    if (error.message.includes('email')) {
        errors.email = 'Cette adresse email est déjà utilisée !';
    }

    return errors;
};
/************************************************************************/