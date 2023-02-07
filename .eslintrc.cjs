module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'plugin:import/errors',
        'plugin:import/warnings',
    ],
    globals: {
        console: true,
    },
    env: {
        es6: true,
        browser: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            legacyDecorators: true,
        },
        babelOptions: {
            plugins: ['@babel/plugin-syntax-import-assertions'],
        },
    },
    rules: {
        '@typescript-eslint/no-unused-vars': 1,
        'import/imports-first': [
            2,
            'absolute-first',
        ],
        'import/no-duplicates': 2,
        camelcase: [
            'error',
            {
                properties: 'never',
                ignoreDestructuring: false,
            },
        ],
        eqeqeq: 2,
        'no-var': 2,
        'no-mixed-spaces-and-tabs': [2],
        semi: [
            2,
            'always',
        ],
        'no-extra-semi': 2,
        'block-spacing': 2,
        'space-infix-ops': 2,
        'template-curly-spacing': 2,
        'padded-blocks': [
            2,
            'never',
        ],
        'switch-colon-spacing': [
            'error',
            {
                after: true,
                before: false,
            },
        ],
        'function-paren-newline': [
            0,
            'multiline',
        ],
        'yield-star-spacing': [
            2,
            'after',
        ],
        'generator-star-spacing': [
            2,
            {
                before: false,
                after: true,
            },
        ],
        'arrow-spacing': [
            2,
            {
                before: true,
                after: true,
            },
        ],
        'keyword-spacing': [
            2,
            {
                before: true,
            },
        ],
        'semi-spacing': [
            2,
            {
                before: false,
                after: true,
            },
        ],
        'key-spacing': [
            2,
            {
                beforeColon: false,
                afterColon: true,
            },
        ],
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1,
                maxEOF: 1,
            },
        ],
        indent: [
            2,
            4,
            {
                SwitchCase: 1,
            },
        ],
        quotes: [
            2,
            'single',
        ],
        'quote-props': [
            2,
            'as-needed',
        ],
        'max-len': [
            2,
            {
                code: 160,
                tabWidth: 4,
                ignoreUrls: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],
        curly: [
            2,
            'multi-line',
        ],
        'array-element-newline': [
            2,
            'consistent',
        ],
        'object-curly-newline': [
            0,
            {
                ObjectExpression: {
                    multiline: true,
                    minProperties: 5,
                },
                ObjectPattern: {
                    multiline: true,
                    minProperties: 5,
                },
                ImportDeclaration: {
                    multiline: true,
                    minProperties: 10,
                },
                ExportDeclaration: {
                    multiline: true,
                    minProperties: 5,
                },
            },
        ],
        'no-console': 0,
        'no-caller': 2,
        'no-empty-pattern': 2,
        'no-new-wrappers': 2,
        'comma-spacing': [
            2,
            {
                before: false,
                after: true,
            },
        ],
        'object-curly-spacing': [
            2,
            'always',
        ],
        'comma-style': [
            'error',
            'last',
        ],
        'func-call-spacing': [
            'error',
            'never',
        ],
        'computed-property-spacing': [
            'error',
            'never',
        ],
        'arrow-body-style': [
            'error',
            'as-needed',
        ],
        'arrow-parens': ['error', 'as-needed'],
        'no-alert': 2,
        'no-unused-vars': 1,
        'no-new-object': 2,
        'no-useless-computed-key': 2,
        'no-useless-constructor': 2,
        'no-magic-numbers': 0,
        'no-floating-decimal': 2,
        'no-else-return': 2,
        'no-implied-eval': 2,
        'no-lone-blocks': 2,
        'no-eq-null': 2,
        'no-eval': 2,
        'no-void': 2,
        'no-loop-func': 2,
        'no-useless-return': 2,
        'no-return-assign': 2,
        'no-self-assign': 2,
        'no-script-url': 2,
        'no-useless-call': 2,
        'space-unary-ops': 2,
        'no-extend-native': 2,
        'no-extra-bind': 2,
        'no-div-regex': 2,
        'comma-dangle': [
            'error',
            'always-multiline',
        ],
        'spaced-comment': [
            'error',
            'always',
            {
                markers: ['/'],
            },
        ],
        'space-in-parens': [
            'error',
            'never',
        ],
        'array-bracket-newline': [
            'error',
            {
                multiline: true,
                minItems: 12,
            },
        ],
        'array-bracket-spacing': [
            'error',
            'never',
        ],
        'no-use-before-define': [
            2,
            {
                functions: false,
                classes: false,
            },
        ],
        'no-underscore-dangle': [
            2,
            {
                enforceInMethodNames: true,
            },
        ],
        'no-debugger': 0,
        'dot-notation': 2,
        'guard-for-in': 2,
        'no-multi-str': 2,
        'no-new': 2,
        'no-proto': 2,
        'no-return-await': 2,
        'brace-style': 2,
        radix: 2,
        'no-shadow': [
            0,
            {
                hoist: 'never',
            },
        ],
        'require-await': 0,
        'no-self-compare': 2,
        'no-throw-literal': 2,
        'no-new-func': 2,
        'default-case': 2,
        'prefer-spread': 2,
        'prefer-rest-params': 2,
        'no-multi-spaces': [
            'error',
            {
                ignoreEOLComments: true,
                exceptions: {
                    Property: false,
                },
            },
        ],
        'accessor-pairs': [
            'error',
            {
                getWithoutSet: true,
            },
        ],
        'no-param-reassign': 0,
        'prefer-template': 2,
        'getter-return': 2,
        'no-await-in-loop': 2,
        'block-scoped-var': 2,
        'class-methods-use-this': 0,
        'object-shorthand': [
            'error',
            'always',
        ],
        'array-callback-return': [
            'error',
            {
                allowImplicit: true,
            },
        ],
        'prefer-const': [
            2,
            {
                destructuring: 'any',
                ignoreReadBeforeAssign: true,
            },
        ],
        'linebreak-style': 0,
        'new-cap': [
            'error',
            {
                newIsCap: true,
            },
        ],
        'no-mixed-operators': [
            'error',
            {
                groups: [
                    ['+', '-', '*', '/', '%', '**'],
                    ['&', '|', '^', '~', '<<', '>>', '>>>'],
                    ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
                    ['&&', '||'],
                    ['in', 'instanceof'],
                ],
                allowSamePrecedence: true,
            },
        ],
        'rest-spread-spacing': ['error', 'never'],
        'import/no-extraneous-dependencies': 0,
        'import/no-unresolved': 0,
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: [
                    '.js',
                    '.ts',
                    '.jsx',
                    '.tsx',
                    '.json',
                ],
            },
        },
        'import/extensions': ['node_modules'],
        'import/core-modules': [],
        'import/ignore': [
            'node_modules',
            '\\.(coffee|scss|css|less|hbs|svg|json)$',
        ],
    },
};
  