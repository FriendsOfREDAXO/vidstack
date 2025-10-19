export default [
    {
        files: ['config/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                window: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
        },
    },
    {
        files: ['../assets/src/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script', // IIFE, not module
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
                jQuery: 'readonly',
                Node: 'readonly',
                MutationObserver: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
        },
    },
];
