/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Response } from 'express';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { authRequest, Pokemon, Trainer } from '@/interfaces/pokemon/pokemon.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { Pokemons } from '../../../mongoose/models/pokemon/pokemon.js';
import { Trainers } from '../../../mongoose/models/pokemon/trainers.js';
/****************************************************/
/************************************************************************/


/*********************************************************[ GET ROUTES ]*/
export default (app: Application): void => {
    /**
     * GET ALL POKEMON
    **/
    app.get('/pokemon', (req: authRequest, res: Response): void => {
        if (req.auth !== undefined) {
            const name: string = req.auth.name;

            const filters: { trainers: string, type?: string | undefined } = {
                trainers: name
            };

            const types: string[] = ['FEU', 'EAU', 'PLANTE', 'NORMAL', 'VOL', 'INSECTE', 'ELECTRIK', 'FÉE', 'DRAGON', 'POISON', 'COMBAT', 'GLACE', 'PSY', 'ROCHE', 'SOL'];

            if (req.query.type) {
                const query: string = req.query.type as string;
                let typeValidator: boolean = false;

                for (const each of types) {
                    if (query.toUpperCase() === each) {
                        typeValidator = true;
                    }
                }

                if (typeValidator) {
                    filters.type = query.toUpperCase();
                }
                else {
                    res.status(400).json({ message: `Ce type n'existe pas !` });

                    return;
                }
            }

            Pokemons.find(filters).select({ "__v": 0, "evolve": 0, "trainers": 0, "level": 0, "isCatchable": 0 }).sort({ number: 1 })

                .then((pokedex: Pokemon[]): void => {
                    Trainers.findOne({ name: name })

                        .then((trainer: Trainer | null) => {
                            if (trainer) {
                                let message: string;

                                if (req.query.type) {
                                    message = `Salut ${name.toUpperCase()} ! Tu as attrapé ${pokedex.length} Pokemon de type ${filters.type?.toUpperCase()} !`;

                                    return res.status(200).json({ message: message, pokedex: pokedex });
                                }
                                else {
                                    const rank: string = trainer.rank;
                                    let forNextRank: number;
                                    let messageRank: string = '';

                                    if (rank === "DÉBUTANT") {
                                        forNextRank = 43 - pokedex.length;
                                    }
                                    else if (rank === "COLLECTIONNEUR") {
                                        forNextRank = 115 - pokedex.length;
                                    }
                                    else if (rank === "CHASSEUR") {
                                        forNextRank = 146 - pokedex.length;
                                    }
                                    else if (rank === "CHAMPION") {
                                        forNextRank = 150 - pokedex.length;
                                    }
                                    else if (rank === "MAÎTRE DRESSEUR") {
                                        forNextRank = 1;
                                    }
                                    else {
                                        forNextRank = 0;
                                    }

                                    messageRank = `Il te manque ${forNextRank} Pokemon pour accéder au niveau supérieur !`;

                                    if (pokedex.length === 0) {
                                        message = `Salut ${name.toUpperCase()} ! Tu n'as attrapé aucun Pokemon ! Il est temps de commencer ton aventure !`;
                                    }
                                    else if (pokedex.length === 151) {
                                        message = `Salut ${name.toUpperCase()} ! Tu as attrapé tous les Pokemon ! Félicitations !`;

                                        return res.status(200).json({ message: message, rank: rank, pokedex: pokedex });
                                    }
                                    else if (pokedex.length >= 100) {
                                        message = `Salut ${name.toUpperCase()} ! Tu as déjà attrapé ${pokedex.length} Pokemon ! Tu y es presque !`;
                                    }
                                    else {
                                        message = `Salut ${name.toUpperCase()} ! Tu as déjà attrapé ${pokedex.length} Pokemon ! Continue comme ça !`;
                                    }

                                    res.status(200).json({ message: message, rank: rank, forNextRank: messageRank, pokedex: pokedex });
                                }
                            }
                            else {
                                const message: string = `Ce dresseur n'existe pas !`;

                                res.status(404).json({ error: message });
                            }
                        })

                        .catch((error: Error) => {
                            const message: string = `Ce dresseur n'existe pas !`;

                            res.status(404).json({ message: message, error: error });
                        });
                })

                .catch((error: Error): void => {
                    const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                    res.status(500).json({ message: message, error: error });
                });
        }
        else {
            const message: string = `Tu n'es pas authentifié(e) !`;

            res.status(401).json({ message: message });
        }
    });


    /**
     * GET ONE POKEMON
     * @param { string } id
    **/
    app.get('/pokemon/:id', (req: authRequest, res: Response): void => {
        if (req.auth !== undefined) {
            const id: string = req.params.id;
            const name: string = req.auth.name;

            Pokemons.findOne({ _id: id, trainers: { $in: name } }).select({ "__v": 0, "_id": 0, "trainers": 0, "level": 0, "isCatchable": 0 })

                .then((pokemon: Pokemon | null): void => {
                    if (pokemon) {
                        const message: string = `Ton ${pokemon.name.toUpperCase()} est très heureux !`;

                        res.status(200).json({ message: message, pokemon: pokemon });
                    }
                    else {
                        const message: string = `Ce Pokemon n'est pas présent dans ton Pokedex !`;

                        res.status(404).json({ error: message });
                    }
                })
                
                .catch((error: Error): void => {
                    const message: string = `Cet identifiant n'est pas valable !`;

                    res.status(400).json({ message: message, error: error });
                });
        }
        else {
            const message: string = `Tu n'es pas authentifié(e) !`;

            res.status(401).json({ message: message });
        }
    });
};
/************************************************************************/