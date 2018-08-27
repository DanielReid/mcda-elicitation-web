'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
let basePath = path.join(__dirname, '/');

let config = {
  entry: {
    'main': basePath + '/app/js/main.js',
    'signin': basePath + '/app/js/signin.js',
    // 'manual': basePath + '/app/js/manual.js',
    'error': basePath + 'app/js/error.js'
  },

  output: {
    // Output directory
    path: basePath + '/dist/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },

  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/, // <-- This

    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'angular1-templateurl-loader'
      }],
      exclude: [/(.*)\/angular-foundation-6\/(.*)/] // uses $templatecache so dont replace 
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.html$/,
      loader: 'raw-loader'
    }, {
      test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/', // where the fonts will go
          publicPath: 'fonts/' // override the default path
        }
      }]
    }, {
      test: /\.(png|jp(e*)g|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8000, // Convert images < 8kb to base64 strings
          name: 'images/[hash]-[name].[ext]'
        }
      }]
    }]
  },

  resolve: {
    alias: {
      'mcda': basePath + '/app/js',
      'mcdaweb': basePath + '/app/js/mcda-web',
      'jQuery': 'jquery',
      'angular-patavi-client': 'angular-patavi-client/patavi',
      'error-reporting': 'error-reporting/errorReportingDirective',
      'export-directive': 'export-directive/export-directive',
      'help-popup': 'help-popup/help-directive',
      'page-title-service': 'page-title-service/pageTitleService',
      'd3': 'd3/d3.min',
      'MathJax': 'MathJax/MathJax',
      'mmfoundation': 'angular-foundation-6/dist/angular-foundation',
      'clipboard':'clipboard/dist/clipboard.min'
    },
    modules: [
      // Files path which will be referenced while bundling
      'node_modules',
      basePath + '/app'
    ],
    extensions: ['.css', 'html', '.js'] // File types
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index.html',
      inject: 'head',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: 'signin.html',
      template: 'app/signin.html',
      inject: 'head',
      chunks: ['signin']
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'manual.html',
    //   template: 'app/manual.html',
    //   inject: 'head',
    //   chunks: ['manual']
    // }),  
      new HtmlWebpackPlugin({
      filename: 'error.html',
      template: 'app/error.html',
      inject: 'head',
      chunks: ['error']
    }),
    new CleanWebpackPlugin(['dist'])
  ],

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};

module.exports = config;
