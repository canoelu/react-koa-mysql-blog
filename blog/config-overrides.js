const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const path = require('path');
const {getLoader} = require('react-app-rewired');

module.exports = function override(config, env) {
    config = injectBabelPlugin(['import', {libraryName: 'antd', style: true}], config);
    config = rewireLess(config, env, {
        modifyVars: {"@primary-color": "@red-6"},
    });
    config = rewireStylus(config, env, {
        sourceMap: false
    });
    return config;
}


// from react-app-rewire-less
function rewireStylus(config, env, stylusLoaderOptions = {}) {
    const stylusExtension = /\.styl$/;

    const fileLoader = getLoader(
        config.module.rules,
        rule =>
            rule.loader &&
            typeof rule.loader === 'string' &&
            (rule.loader.indexOf(`${path.sep}file-loader${path.sep}`) !== -1 ||
                rule.loader.indexOf(`@file-loader${path.sep}`) !== -1)
    );
    fileLoader.exclude.push(stylusExtension);

    const cssRules = getLoader(
        config.module.rules, rule => String(rule.test) === String(/\.css$/)
    );

    let stylusRules;
    if (env === 'production') {
        stylusRules = {
            test: stylusExtension,
            loader: [
                // TODO: originally this part is wrapper in extract-text-webpack-plugin
                //       which we cannot do, so some things like relative publicPath
                //       will not work.
                //       https://github.com/timarney/react-app-rewired/issues/33
                ...cssRules.loader,
                {loader: 'stylus-loader', options: stylusLoaderOptions}
            ]
        };
    } else {
        stylusRules = {
            test: stylusExtension,
            use: [
                ...cssRules.use,
                {loader: 'stylus-loader', options: stylusLoaderOptions}
            ]
        };
    }

    config.module.rules.push(stylusRules);

    return config;
}
