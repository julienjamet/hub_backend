/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import { Application, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import omit from 'lodash.omit';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { authRequest, Trainer, Pokemon, FilteredPokemon } from '@/interfaces/pokemon/pokemon.js';
/****************************************************/

/********************************[ MONGOOSE MODELS ]*/
import { Trainers } from '../../../mongoose/models/pokemon/trainers.js';
import { Pokemons } from '../../../mongoose/models/pokemon/pokemon.js';
/****************************************************/
/************************************************************************/


/********************************************************[ POST ROUTES ]*/
export default (app: Application): void => {
    /**
     * SIGN UP
    **/
    app.post('/trainers/signup', (req: Request, res: Response): void => {
        const name: string = req.body.name;
        const password: string = req.body.password;

        if (!name || !password) {
            res.status(400).json({ message: `Il te faut un nom et un mot de passe !` });

            return;
        }
        else {
            for (const key in req.body) {
                if (key !== 'name' && key !== 'password') {
                    res.status(400).json({ message: `Il te faut un nom et un mot de passe ! Rien de plus !` });

                    return;
                }
            }

            if (name.length > 12) {
                res.status(400).json({ message: `Ce nom est trop long ! 12 caractères au maximum !` });

                return;
            }
            else if (password.length >= 30) {
                res.status(400).json({ message: `Ce mot de passe est trop long ! 30 caractères au maximum !` });

                return;
            }
            else {
                if (!/^([^\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{2,})$/.test(name)) {
                    res.status(400).json({ message: `Ton nom doit être composé d'au moins deux lettres et ne doit comporter aucun caractère spécial !` });

                    return;
                }
                else if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/.test(password)) {
                    res.status(400).json({ message: `Il te faut faut un mot de passe fort pour protéger tes données ! Il doit être composé d'au moins 8 caractères et contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial comme '@' ou '#' !` });

                    return;
                }
                else {
                    bcrypt.hash(password, 10)

                        .then((hash: string): void => {
                            const trainer: Trainer = new Trainers<Trainer>({
                                name: name,
                                password: hash,
                                level: 1,
                                rank: 'DÉBUTANT'
                            });

                            if (trainer.save) {
                                trainer.save()

                                    .then((): Response => res.status(201).json({ message: `Bienvenue ${name.toUpperCase()} ! Tu peux maintenant te connecter à ta session !` }))

                                    .catch((error: Error): void => {
                                        const message: string = `Ce nom est déjà utilisé par un autre dresseur !`;

                                        res.status(500).json({ message: message, error: error });
                                    });
                            }
                        })

                        .catch((error: Error): void => {
                            const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                            res.status(500).json({ message: message, error: error });
                        });
                }
            }
        }
    });


    /**
     * LOGIN
    **/
    app.post('/trainers/login', (req: Request, res: Response): void => {
        const name: string = req.body.name;
        const password: string = req.body.password;

        if (!name || !password) {
            res.status(400).json({ message: `Tu dois te connecter avec un nom et un mot de passe !` });

            return;
        }
        else {
            for (const key in req.body) {
                if (key !== 'name' && key !== 'password') {
                    res.status(400).json({ message: `Tu dois te connecter avec un nom et un mot de passe ! Rien de plus !` });

                    return;
                }
            }

            if (name.length > 12) {
                res.status(400).json({ message: `Ce dresseur n'existe pas !` });

                return;
            }
            else if (password.length >= 30) {
                res.status(400).json({ message: `Le mot de passe est forcément incorrect car il ne correspond pas aux normes du Pokedex !` });

                return;
            }
            else {
                if (!/^([^\s-<>≤≥«»© ↓¬,?¿;.×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{2,})$/.test(name)) {
                    res.status(400).json({ message: `Ce dresseur n'existe pas !` });

                    return;
                }
                else if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/.test(password)) {
                    res.status(400).json({ message: `Le mot de passe est forcément incorrect car il ne correspond pas aux critères de sécurité du Pokedex !` });

                    return;
                }
                else {
                    Trainers.findOne({ name: name })

                        .then((trainer: Trainer | null): void => {
                            if (trainer) {
                                bcrypt.compare(password, trainer.password)

                                    .then((valid: boolean): void => {
                                        if (valid) {
                                            const message: string = `Bienvenue ${name.toUpperCase()} !`;
                                            const tokenKey: string = process.env.TOKEN_KEY || 'token_key';
                                            const token: string = jwt.sign({ name: name.toUpperCase() }, tokenKey, { expiresIn: '1h' });

                                            res.cookie('token', token, {
                                                httpOnly: true,
                                                secure: true,
                                                sameSite: 'none',
                                                path: '/',
                                                maxAge: 3600 * 1000
                                            });

                                            res.status(200).json({ message: message });
                                        }
                                        else {
                                            res.status(401).json({ message: `Le mot de passe est incorrect !` });
                                        }
                                    })

                                    .catch((error: Error): void => {
                                        const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                                        res.status(500).json({ message: message, error: error });
                                    });
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
            }
        }
    });


    /**
     * CATCH A POKEMON
    **/
    app.post('/pokemon', (req: authRequest, res: Response): void => {
        let pokemonName: string = req.body.name;

        if (!pokemonName) {
            res.status(400).json({ message: `Tu dois renseigner le nom du Pokemon à capturer !` });

            return;
        }
        else {
            for (const key in req.body) {
                if (key !== 'name') {
                    res.status(400).json({ message: `Il faut renseigner le nom du Pokemon à capturer ! Rien de plus !` });

                    return;
                }
            }

            if (pokemonName.length > 15) {
                res.status(400).json({ message: `Aucun Pokemon n'a un nom aussi long !` });

                return;
            }
            else {
                if (!/^([^0-9-<>≤≥«»© ↓¬,?¿;×:/÷!§¡%´*`€^¨$£²¹&~"#'{(|`_@°=+)}\[\]\\]{2,})$/.test(pokemonName)) {
                    res.status(400).json({ message: `Le nom du Pokemon doit être composé d'au moins deux lettres et ne doit comporter aucun caractère spécial !` });

                    return;
                }
                else {
                    if (pokemonName.toUpperCase() === 'NIDORAN ♀' || pokemonName.toUpperCase() === 'NIDORAN F') {
                        pokemonName = 'nidoran♀';
                    }
                    else if (pokemonName.toUpperCase() === 'NIDORAN ♂' || pokemonName.toUpperCase() === 'NIDORAN M') {
                        pokemonName = 'nidoran♂';
                    }
                    else if (pokemonName.toUpperCase() === 'M.MIME' || pokemonName.toUpperCase() === 'M MIME') {
                        pokemonName = 'm. mime';
                    }

                    Pokemons.findOne({ name: pokemonName }).lean()

                        .then((pokemon: Pokemon | null): void => {
                            if (pokemon) {
                                if (pokemon.isCatchable) {
                                    if (req.auth !== undefined) {
                                        const trainerName: string = req.auth.name;

                                        if (!pokemon.trainers.includes(trainerName)) {
                                            Trainers.findOne({ name: trainerName })

                                                .then((trainer: Trainer | null): void => {
                                                    if (trainer) {
                                                        if (pokemon.level <= trainer.level) {
                                                            Pokemons.updateOne({ name: pokemonName }, { $push: { trainers: trainerName } })

                                                                .then((): void => {
                                                                    const message: string = `Bravo ${trainerName.toUpperCase()} ! Tu as attrapé un ${pokemonName.toUpperCase()} !`

                                                                    const filteredPokemon: FilteredPokemon = omit(pokemon, ['_id', 'evolve', '__v', 'trainers', 'level', 'isCatchable']);

                                                                    res.status(201).json({ message: message, pokemon: filteredPokemon });
                                                                })

                                                                .catch((error: Error): void => {
                                                                    const message: string = `Le Pokedex est en panne ! Reviens plus tard !`;

                                                                    res.status(500).json({ message: message, error: error });
                                                                });
                                                        }
                                                        else {
                                                            const message: string = `Tu n'es pas encore assez expérimenté(e) pour attraper un ${pokemonName.toUpperCase()} ! Entraîne-toi sur des Pokemon moins puissants !`;

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
                                            const message: string = `Tu possèdes déjà un ${pokemonName.toUpperCase()} !`;

                                            res.status(403).json({ message: message });
                                        }
                                    }
                                    else {
                                        const message: string = `Tu n'es pas authentifié(e) !`;

                                        res.status(401).json({ message: message });
                                    }
                                }
                                else {
                                    const message: string = `${pokemonName.toUpperCase()} n'existe pas à l'état sauvage ! Tu ne peux l'obtenir que par évolution !`;

                                    res.status(403).json({ message: message })
                                }
                            }
                            else {
                                const message: string = `Ce Pokemon n'existe pas !`;

                                res.status(404).json({ message: message })
                            }
                        })

                        .catch((error: Error): void => {
                            const message: string = `Ce Pokemon n'existe pas !`;

                            res.status(404).json({ message: message, error: error })
                        });
                }
            }
        }
    });
};
/************************************************************************/