var path = require('path');

module.exports = {
    entry: "./src/js/app.js",
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/build/",
        filename: "app.js"
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.css$/,
                loaders: ["style", "css"]
            }
        ]
    }
};