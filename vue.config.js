module.exports = {
    lintOnSave: false,
    configureWebpack: {
        externals: {
            Personalize: 'Personalize',
            PSDPreview: 'PSDPreview'
        },
        resolve: {
            alias: require('./aliases.config').webpack,
        },
    }
}