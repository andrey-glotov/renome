const path = require('path');

module.exports = ({mode = 'development'}) => ({
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'eslint-loader',
                options: {
                    configFile: (mode === 'production')
                        ? path.join(__dirname, '.eslintrc.json')
                        : path.join(__dirname, '.eslintrc.dev.json'),
                    emitWarning: true,
                }
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    configFile: path.join(__dirname, 'babel.config.js')
                }
            }
        }],
    },
    mode,
    devtool: 'source-map',
    externals: {
        moment: 'moment',
    },
});
