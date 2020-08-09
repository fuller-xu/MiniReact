const path = require('path');


module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [[
              '@babel/plugin-transform-react-jsx',
              { pragma: 'MyReact.createElement' }
            ]]
          }
        }
      }
    ]
  }
}