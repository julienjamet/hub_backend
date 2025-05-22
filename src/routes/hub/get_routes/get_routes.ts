/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Request, Response } from 'express';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { HubPagePresentation } from '../../../interfaces/hub/hub.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { hubPagePresentations } from '../../../mongoose/models/hub/page_presentation.js';
/****************************************************/
/************************************************************************/


/*********************************************************[ GET ROUTES ]*/
export default (app: Application): void => {
    // GET PAGE PRESENTATION ( c-[R]-u-d )
    app.get('/page_presentation/:location', (req: Request, res: Response): void => {
        const location: string = req.params.location;

        hubPagePresentations.findOne({ location })

            .then((pagePresentation: HubPagePresentation | null): void => {
                if (pagePresentation) {
                    res.status(200).send(pagePresentation);
                }
                else {
                    res.status(404).send('Page presentation not found');
                }
            })

            .catch((error: Error): Response => res.status(500).send(error));
    });
};
/************************************************************************/