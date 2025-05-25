/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Request, Response } from 'express';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { PageHeader } from '@/interfaces/hub/hub.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { PageHeaders } from '../../../mongoose/models/hub/page_headers.js';
/****************************************************/
/************************************************************************/


/*********************************************************[ GET ROUTES ]*/
export default (app: Application): void => {
    /**
     * GET PAGE HEADER
     * @param { string } location
    **/
    app.get('/page_header/:location', (req: Request, res: Response): void => {
        const location: string = req.params.location;

        PageHeaders.findOne({ location })

            .then((pageHeader: PageHeader | null): void => {
                if (pageHeader) {
                    res.status(200).send(pageHeader);
                }
                else {
                    res.status(404).send('Page header not found');
                }
            })

            .catch((error: Error): Response => res.status(500).send(error));
    });
};
/************************************************************************/