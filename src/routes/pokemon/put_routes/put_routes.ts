/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Response } from 'express';
import omit from 'lodash.omit';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { authRequest, Pokemon, FilteredPokemon, Trainer } from '@/interfaces/pokemon/pokemon.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { Pokemons } from '../../../mongoose/models/pokemon/pokemon.js';
import { Trainers } from '../../../mongoose/models/pokemon/trainers.js';
/****************************************************/
/************************************************************************/


/*********************************************************[ PUT ROUTES ]*/
export default (app: Application): void => {
    /**
     * MAKE A POKEMON EVOLVE
     * @param { string } id
    **/
    app.put('/pokemon/:id', (req: authRequest, res: Response): void => {
        const id: string = req.params.id;

        if (req.body && Object.keys(req.body).length !== 0) {
            res.status(400).json({ message: `Il n'y a rien à envoyer ici !` });

            return;
        }

        if (req.auth !== undefined) {
            const trainerName: string = req.auth.name;

            Pokemons.findOne({ _id: id, trainers: { $in: trainerName } })

                .then((pokemon: Pokemon | null): void => {
                    if (pokemon) {
                        const pokemonName: string = pokemon.name;

                        if (pokemon.evolve) {
                            Pokemons.findOne({ name: pokemon.evolve }).lean()

                                .then((evolution: Pokemon | null): void => {
                                    if (evolution) {
                                        const evolutionName: string = evolution.name;

                                        if (!evolution.trainers.includes(trainerName)) {
                                            Trainers.findOne({ name: trainerName })

                                                .then((trainer: Trainer | null) => {
                                                    if (trainer) {
                                                        if (evolution.level <= trainer.level) {
                                                            Pokemons.updateOne({ name: evolutionName }, { $push: { trainers: trainerName } })

                                                                .then((): void => {
                                                                    const message: string = `Bravo ${trainerName.toUpperCase()} ! Ton ${pokemonName.toUpperCase()} évolue en ${evolutionName.toUpperCase()} !`;

                                                                    const filteredEvolution: FilteredPokemon = omit(evolution, ['evolve', '__v', 'trainers', 'level', 'isCatchable']);

                                                                    res.status(200).json({ message: message, pokemon: filteredEvolution });
                                                                })

                                                                .catch((error: Error): void => {
                                                                    const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                                                                    res.status(500).json({ message: message, error: error });
                                                                });
                                                        }
                                                        else {
                                                            const message: string = `Tu n'es pas encore assez expérimenté(e) pour faire évoluer ton ${pokemonName.toUpperCase()} ! Entraîne-toi sur des Pokemon moins puissants !`;

                                                            res.status(403).json({ message: message });
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
                                        }
                                        else {
                                            const message: string = `Tu possèdes déjà un ${evolutionName.toUpperCase()} ! ${pokemonName} n'évolue pas !`;

                                            res.status(403).json({ message: message });
                                        }
                                    }
                                    else {
                                        const message: string = `${pokemonName.toUpperCase()} ne peut pas évoluer !`;

                                        res.status(400).json({ message: message });
                                    }
                                })

                                .catch((error: Error): void => {
                                    const message: string = `${pokemonName.toUpperCase()} ne peut pas évoluer !`;

                                    res.status(400).json({ message: message, error: error });
                                });
                        }
                        else {
                            const message: string = `${pokemonName.toUpperCase()} ne peut pas évoluer !`;

                            res.status(400).json({ message: message });
                        }
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