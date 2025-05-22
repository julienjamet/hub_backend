/************************************************************[ IMPORTS ]*/
/************************************[ NPM MODULES ]*/
import globals from 'globals';
import tseslint from 'typescript-eslint';
/****************************************************/

/*************************************[ INTERFACES ]*/
import { Linter, FlatConfig } from '@typescript-eslint/utils/ts-eslint';
/****************************************************/
/************************************************************************/


/******************************************************[ ESLINT CONFIG ]*/
/******************************************[ TYPES ]*/
type RuleSet = Linter.RulesRecord;

type ExtendedConfig = FlatConfig.Config & {
    extends: FlatConfig.ConfigArray;
};
/****************************************************/


/*****************************************[ TARGET ]*/
// -- to target TS files only
const files: string[] = ['**/*.ts'];

// -- to ignore ESLint config file
const ignores: { ignores: string[] } = {
    ignores: ['eslint.config.ts']
};
/****************************************************/


/*******************************[ LANGUAGE OPTIONS ]*/
const languageOptions: FlatConfig.LanguageOptions = {
    // -- to indicate a Node.js ( backend ) context
    globals: globals.browser,
    // -- to use the latest ECMAScript features
    ecmaVersion: 'latest',
    // -- to use ES modules ( import / export )
    sourceType: 'module',
    // -- to use TS config for type-based linting
    parserOptions: { project: './tsconfig.json' }
};
/****************************************************/


/***************************************[ TS RULES ]*/
// -- to use recommended TS linting rules
const basicTsRules: FlatConfig.ConfigArray = tseslint.configs.recommended;

// -- to enforce explicit type annotations in TypeScript
const additionalTsRules: RuleSet = {
    '@typescript-eslint/typedef': [
        'error', {
            // -- for variables
            variableDeclaration: true,
            // -- for function params
            parameter: true,
            // -- for class properties
            memberVariableDeclaration: true,
            // -- for object and interface properties
            propertyDeclaration: true
        }
    ]
};
/****************************************************/


/*****************************************[ CONFIG ]*/
const tsNodeConfig: ExtendedConfig = {
    files,
    languageOptions,
    rules: { ...additionalTsRules },
    extends: basicTsRules
};

const eslintConfig: FlatConfig.ConfigArray = tseslint.config(ignores, tsNodeConfig);
/****************************************************/


export default eslintConfig;
/************************************************************************/