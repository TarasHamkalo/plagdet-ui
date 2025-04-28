const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: [
          /node_modules\/monaco-editor/ // Only apply this loader to monaco-editor
        ]
      },

      {
        test: /\.ttf$/,
        type: 'asset/resource',
        include: [
          /node_modules\/monaco-editor/ // Only apply this loader to monaco-editor
        ]
      }
    ]
  },
  plugins: [
    new MonacoEditorWebpackPlugin({
      languages: ['plaintext'],
      features: ['!gotoSymbol'],
      publicPath: '/plagdet-ui/assets/monaco/'
    })
  ]
};

// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
//
// module.exports = {
//     plugins: [
//         new MonacoWebpackPlugin({
//             publicPath: '/plagdet-ui/assets/monaco/',
//             filename: 'assets/monaco/[name].worker.js',
//             languages: ['javascript', 'typescript', 'json', 'css', 'html', 'plaintext']
//         })
//     ]
// };
