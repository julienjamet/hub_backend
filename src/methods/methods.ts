/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import dotenv from 'dotenv';
/****************************************************/
/************************************************************************/


/************************************************************[ METHODS ]*/
dotenv.config();

const environment: string = process.env.NODE_ENV || '';

/************************[ SET CORS ALLOWED ORIGIN ]*/
export const setCorsAllowedOrigin: () => string[] = () => {
    switch (environment) {
        case 'production':
            return (process.env.HUB_PROD_URL || '').split(',');

        case 'preproduction':
            return (process.env.HUB_PREPROD_URL || '').split(',');

        case 'development':
        default:
            return ['http://localhost:3000', 'http://localhost:5173'];
    }
};
/****************************************************/


/******************************[ SET HELMET CONFIG ]*/
export const setHelmetConfig: () => object = () => {
    switch (environment) {
        case 'production':
        case 'preproduction':
        default:
            return {
                contentSecurityPolicy: {
                    directives: {
                        // -- restrict the loading of resources to the same origin ( self )
                        defaultSrc: ["'self'"],
                        // -- allow only scripts from the same origin ( self )
                        scriptSrc: ["'self'"],
                        // -- allow only styles from the same origin ( self )
                        styleSrc: ["'self'"],
                        // -- allow only fonts from the same origin ( self )
                        fontSrc: ["'self'"],
                        // -- allow images from the same origin ( self ) and data URIs ( e.g., inline images )
                        imgSrc: ["'self'", 'data:'],
                        // -- allow connections ( e.g., AJAX, WebSockets ) only to the same origin ( self )
                        connectSrc: ["'self'"],
                        // -- prevent usage of <object>, <embed>, <applet> elements to load resources from any origin
                        objectSrc: ["'none'"],
                        // -- enforce the upgrade of insecure HTTP requests to HTTPS
                        upgradeInsecureRequests: []
                    },
                },
                // -- specifies the referrer policy for the document. 'no-referrer' means no referrer information will be sent
                referrerPolicy: { policy: 'no-referrer' },
                // -- enforces Cross-Origin Embedder Policy ( COEP ), blocking cross-origin resources from being loaded by the page unless they explicitly allow it
                crossOriginEmbedderPolicy: true
            };

        case 'development':
            return {};
    }
};
/****************************************************/
/************************************************************************/