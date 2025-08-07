/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Request } from 'express';
import multer from 'multer';
/****************************************************/
/************************************************************************/


/*************************************************************[ MULTER ]*/
// STORAGE OPTIONS
const storageOptions: object = {
    destination: './files/groupomania/tmp/',
    filename: (req: Request, file: { originalname: string }, callback: CallableFunction): void => callback(null, file.originalname)
};

// STORAGE
const storage: multer.StorageEngine = multer.diskStorage(storageOptions);

// UPLOAD OPTIONS
const uploadOptions: object = {
    storage: storage,
    fileFilter: (req: Request, file: { mimetype: string }, callback: CallableFunction): void => {
        if (file.mimetype.startsWith('image/')) {
            callback(null, true);
        }
        else {
            callback(new Error('Le fichier n\'est pas une image.'));
        }
    }
};

// UPLOAD
export const uploadImage: multer.Multer = multer(uploadOptions);
/************************************************************************/