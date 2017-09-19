'use strict';

const autoprefixer = require('autoprefixer');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const srcPath = path.join(__dirname, '../src');
const paths = require('./paths');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const publicPath = '/';
const publicUrl = '';

const appDirectory = fs.realpathSync(process.cwd());
// We support resolving modules according to `NODE_PATH`.
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

module.exports = {
    entry: [
        require.resolve('react-dev-utils/webpackHotDevClient'),
        paths.appIndexJs
    ],

    output: {
        filename: 'static/js/bundle.js',
        publicPath: publicPath,
        path: paths.appBuild,
        pathinfo: true
    },

    resolve: {
        modules: ['node_modules', paths.appNodeModules].concat(
            // It is guaranteed to exist because we tweak it in `env.js`
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),
        extensions: ['.js', '.json', '.jsx'],
        plugins: [
            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
        ],
    },

    module: {
        strictExportPresence: true,
        rules: [
            // First, run the linter.
            // It's important to do this before Babel processes the JS.
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                use: [
                  {
                    options: {
                        formatter: eslintFormatter,
                        eslintPath: require.resolve('eslint'),
                    },
                    loader: require.resolve('eslint-loader'),
                  },
                ],
                include: paths.appSrc,
            },
            {
                oneOf: [
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: 10000,
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
                // Process JS with Babel.
                {
                    test: /\.(js|jsx)$/,
                    include: paths.appSrc,
                    loader: require.resolve('babel-loader'),
                    options: {
                        cacheDirectory: true,
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        require.resolve('style-loader'),
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: {
                                // Necessary for external CSS imports to work
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    autoprefixer({
                                        browsers: [
                                            '>1%',
                                            'last 4 versions',
                                            'Firefox ESR',
                                            'not ie < 9', // React doesn't support IE8 anyway
                                        ],
                                        flexbox: 'no-2009',
                                    }),
                                ],
                            },
                        },
                    ],
                },
                {
                    // Exclude `js` files to keep "css" loader working as it injects
                    // it's runtime that would otherwise processed through "file" loader.
                    // Also exclude `html` and `json` extensions so they get processed
                    // by webpacks internal loaders.
                    exclude: [/\.js$/, /\.html$/, /\.json$/],
                    loader: require.resolve('file-loader'),
                    options: {
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
                ],
            },
        ],
    },
    plugins: [
        // Makes some environment variables available in index.html.
        new InterpolateHtmlPlugin({
            'NODE_ENV': 'development',
            'PUBLIC_URL': publicUrl
        }),
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin()
    ]
};
