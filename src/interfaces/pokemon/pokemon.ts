/************************************************************[ IMPORTS ]*/
import { Request } from 'express';
/************************************************************************/


/*********************************************************[ INTERFACES ]*/
export interface authRequest extends Request {
    auth?: { name: string } | undefined;
};


export interface Trainer {
    name: string;
    password: string;
    level: number;
    rank: string;
    save?: () => Promise<void>;
};


export interface Pokemon {
    _id: string;
    number: number;
    name: string;
    evolve: string;
    description: string;
    picture: string;
    type: string[];
    trainers: string[];
    __v: number;
    level: number;
    isCatchable: boolean;
};

export type FilteredPokemon = Omit<Pokemon, '_id' | 'evolve' | '__v' | 'trainers' | 'level' | 'isCatchable'>;
/************************************************************************/