import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        ...globals.jest,
      },
    },


    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    settings: { react: { version: 'detect', }, },

    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-console': 0,
      'block-scoped-var': 'error',
      curly: ['error', 'multi-line'],
      eqeqeq: 'error',
      'guard-for-in': 'error',
      'no-alert': 'error',
      'no-multi-spaces': 'error',
      'no-return-await': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'wrap-iife': 'error',
      yoda: 'error',
      'no-shadow': 1,
      'no-undef-init': 'error',
      'no-label-var': 'error',
      'array-bracket-newline': ['error', { multiline: true }],
      'array-bracket-spacing': ['error', 'never'],
      'array-element-newline': ['error', { multiline: true }],
      'block-spacing': ['error', 'never'],
      'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
      'comma-spacing': [
        'error',
        {
          before: false,
          after: true
        }
      ],
      'comma-style': ['error', 'last'],
      'eol-last': ['error', 'always'],
      'func-call-spacing': ['error', 'never'],
      'implicit-arrow-linebreak': ['error', 'beside'],
      'key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true,
          mode: 'strict'
        }
      ],
      'keyword-spacing': [
        'error',
        {
          before: true,
          after: true
        }
      ],
      'max-len': [
        'error',
        {
          code: 120,
          tabWidth: 4,
          comments: 80,
          ignoreUrls: true
        }
      ],
      'multiline-comment-style': ['error', 'starred-block'],
      'multiline-ternary': ['error', 'always'],
      'no-array-constructor': 'error',
      'no-lonely-if': 'error',
      'no-multi-assign': 'error',
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'no-new-object': 'error',
      'no-trailing-spaces': 'error',
      'no-underscore-dangle': 'error',
      'no-unneeded-ternary': 'error',
      'no-whitespace-before-property': 'error',
      'object-curly-newline': ['error', { multiline: true }],
      'object-curly-spacing': [
        'error',
        'always',
        {
          arraysInObjects: false,
          objectsInObjects: true
        }
      ],
      'object-property-newline': 'error',
      'operator-assignment': ['error', 'always'],
      'padded-blocks': ['error', 'never'],
      'spaced-comment': ['error', 'always'],
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-spacing': [
        'error',
        {
          before: true,
          after: true
        }
      ],
      'no-confusing-arrow': ['error', { allowParens: true }],
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': [
        'error',
        {
          object: true,
          array: true
        }
      ],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'quote-props': ['error', 'as-needed'],
      'semi-spacing': 'error',
      'semi-style': ['error', 'last'],
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
    },
  },
];
