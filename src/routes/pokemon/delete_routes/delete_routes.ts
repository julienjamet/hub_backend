/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Response } from 'express';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { authRequest, Pokemon } from '@/interfaces/pokemon/pokemon.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { Pokemons } from '../../../mongoose/models/pokemon/pokemon.js';
/****************************************************/
/************************************************************************/


/******************************************************[ DELETE ROUTES ]*/
export default (app: Application): void => {
    /**
     * DELETE A POKEMON
     * @param { string } id
    **/
    app.delete('/pokemon/:id', (req: authRequest, res: Response): void => {
        const id: string = req.params.id;

        if (req.auth !== undefined) {
            const trainerName: string = req.auth.name;

            Pokemons.findOne({ _id: id, trainers: { $in: trainerName } })

                .then((pokemon: Pokemon | null): void => {
                    if (pokemon) {
                        const pokemonName: string = pokemon.name;

                        Pokemons.updateOne({ name: pokemonName }, { $pull: { trainers: trainerName } })

                            .then((): void => {
                                const message: string = `Tu as relâché ton ${pokemonName.toUpperCase()} !`;

                                res.status(200).json({ message: message });
                            })

                            .catch((error: Error): void => {
                                const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                                res.status(500).json({ message: message, error: error });
                            });
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