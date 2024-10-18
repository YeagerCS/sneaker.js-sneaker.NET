const path = require('path'); 

module.exports = { 
  mode: 'none', 
  entry: './index.js', 
  output: { 
    path: __dirname,
    filename: 'bundle.js' 
  }, 
  devServer: { 
    static: {
      directory: __dirname
    } ,
    historyApiFallback: true
  }, 
  resolve: {
    extensions: [".js", ".ts", ".snkr", ".sneaker", ".tsnkr", ".tsneaker"]
  },
  module: { 
    rules: [ 
      { 
        test: /\.css$/, 
        use: [ 'style-loader', 'css-loader' ] 
      }, 
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: { 
          loader: 'babel-loader', 
          options: { 
            presets: [ '@babel/preset-env' ] 
          } 
        } 
      }, 
      {
        test: /\.tsx?/,
        use: 'ts-loader',
      }
    ] 
  } 
};
