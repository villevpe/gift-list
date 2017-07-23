const webpackConfig = require('./webpack.config.js');

module.exports = (config) => {
    config.set({
        browsers: ['Chrome'], // ChromeHeadless
        frameworks: ['mocha', 'sinon-chai'],
        reporters: ['spec'],
        files: [
            'src/**/*.spec.ts'
        ],
        preprocessors: {
            'src/**/*.spec.ts': ['webpack', 'sourcemap'],
            'src/**/!(*spec).ts': ['coverage']
        },
        plugins: [
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-sinon-chai',
            'karma-webpack',
            'karma-spec-reporter',
            'karma-coverage',
            'karma-sourcemap-loader'
        ],
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            dir: './coverage',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ]
        },
        logLevel: config.LOG_ERROR,
        mime: {
            'text/x-typescript': ['ts']
        },
        webpack: webpackConfig
    });
};
