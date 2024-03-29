module.exports = {
    entry: __dirname + '/public/index.jsx',
    module: {
      rules: [
        { 
          test: [/\.jsx$/],
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env']
            }
          }
        }
      ]
    },
     output: {
      filename: 'bundle.js',
      path: __dirname + '/client'
    }
  };
  const path = require('path');
const SRC_DIR = path.join(__dirname, '/public');
const DIST_DIR = path.join(__dirname, '/client');

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
},
  module: {
    rules: [
      {
        test: [/\.jsx$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
};