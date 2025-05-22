/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
/****************************************************/

/******************************************[ ENUMS ]*/
import { ansi } from './enums/enums.js';
/****************************************************/

/****************************************[ METHODS ]*/
import { setCorsAllowedOrigin, setHelmetConfig } from './methods/methods.js';
/****************************************************/

/************************************[ MAIN ROUTER ]*/
import MainRouter from './routes/router.js';
/****************************************************/
/************************************************************************/


/************************************************************[ HUB APP ]*/
const app: Application = express();

/*******************[ JSON PARSER & SECURITY RULES ]*/
app.use(express.json());

// -- cors config
const allowedOrigin: string = setCorsAllowedOrigin();

const corsOptions: object = {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Authorization']
};

// -- helmet config
const helmetOptions: object = setHelmetConfig();

app.use(cors(corsOptions));
app.use(helmet(helmetOptions));
/****************************************************/


/**************************************[ LISTENING ]*/
const port: number = Number(process.env.PORT);

app.listen(port, '0.0.0.0', (): void => console.log(`${ansi.green}Server launched on port [ ${ansi.yellow}${port}${ansi.green} ]`));
/****************************************************/


/************************************[ MAIN ROUTER ]*/
MainRouter(app);
/****************************************************/
/************************************************************************/