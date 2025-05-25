/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Request, Response } from 'express';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { PageHeader, Project } from '@/interfaces/hub/hub.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { PageHeaders } from '../../../mongoose/models/hub/page_headers.js';
import { Projects } from '../../../mongoose/models/hub/projects.js';
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


    /**
     * GET PROJECTS
     * @param { string } category
    **/
    app.get('/projects/:category', (req: Request, res: Response): void => {
        const category: string = req.params.category;

        Projects.find({ category }).sort({ number: 1 })

            .then((projects: Project[]): Response => res.status(200).send(projects))

            .catch((error: Error): Response => res.status(500).send(error));
    });
};
/************************************************************************/