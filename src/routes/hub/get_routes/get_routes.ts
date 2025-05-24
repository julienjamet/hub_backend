/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Request, Response } from 'express';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { HubPagePresentation, HubProject } from '../../../interfaces/hub/hub.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { hubPagePresentations } from '../../../mongoose/models/hub/page_presentation.js';
import { HubProjects } from '../../../mongoose/models/hub/projects.js';
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


    // GET ALL PROJECTS ( c-[R]-u-d )
    app.get('/projects/:category', (req: Request, res: Response): void => {
        const category: string = req.params.category;

        HubProjects.find({ category }).sort({ number: 1 })

            .then((projects: HubProject[]): Response => res.status(200).send(projects))

            .catch((error: Error): Response => res.status(500).send(error));
    });
};
/************************************************************************/