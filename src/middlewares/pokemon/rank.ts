/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Response, NextFunction } from 'express';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { authRequest } from '@/interfaces/pokemon/pokemon.js';
/****************************************************/

/*****************************************[ MODELS ]*/
import { Pokemons } from '../../mongoose/models/pokemon/pokemon.js';
import { Trainers } from '../../mongoose/models/pokemon/trainers.js';
/****************************************************/
/************************************************************************/


/****************************************************[ RANK MIDDLEWARE ]*/
export const rank: (req: authRequest, res: Response, next: NextFunction) => void = (req, res, next) => {
    if (req.auth !== undefined) {
        const name: string = req.auth.name;

        Pokemons.find({ trainers: name }).countDocuments()

            .then((numberOfPokemon: number): void => {
                if (numberOfPokemon === 151) {
                    Trainers.updateOne({ name: name }, { $set: { level: 6, rank: 'LÉGENDE' } })

                        .then((): void => next())

                        .catch((error: Error): void => {
                            const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                            res.status(500).json({ message: message, error: error });
                        })
                }
                else if (numberOfPokemon === 150) {
                    Trainers.updateOne({ name: name }, { $set: { level: 5, rank: 'MAÎTRE DRESSEUR' } })

                        .then((): void => next())

                        .catch((error: Error): void => {
                            const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                            res.status(500).json({ message: message, error: error });
                        })
                }
                else if (numberOfPokemon >= 146) {
                    Trainers.updateOne({ name: name }, { $set: { level: 4, rank: 'CHAMPION' } })

                        .then((): void => next())

                        .catch((error: Error): void => {
                            const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                            res.status(500).json({ message: message, error: error });
                        })
                }
                else if (numberOfPokemon >= 115) {
                    Trainers.updateOne({ name: name }, { $set: { level: 3, rank: 'CHASSEUR' } })

                        .then((): void => next())

                        .catch((error: Error): void => {
                            const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                            res.status(500).json({ message: message, error: error });
                        })
                }
                else if (numberOfPokemon >= 43) {
                    Trainers.updateOne({ name: name }, { $set: { level: 2, rank: 'COLLECTIONNEUR' } })

                        .then((): void => next())

                        .catch((error: Error): void => {
                            const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                            res.status(500).json({ message: message, error: error });
                        })
                }
                else {
                    next();
                }
            })

            .catch((error: Error): void => {
                const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                res.status(500).json({ message: message, error: error });
            })
    }
    else {
        const message: string = `Tu n'es pas authentifié(e) !`;

        res.status(401).json({ message: message });
    }
};
/************************************************************************/