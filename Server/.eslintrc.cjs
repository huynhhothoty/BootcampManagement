module.exports = {
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es2021: true,
    },
    extends: 'eslint:recommended',
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next|val' }],
    },
};
