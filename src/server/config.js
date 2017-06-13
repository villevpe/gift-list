const compression = require('compression');

const config = {
    compression: { 
        filter: compressOnlyUncompressed 
    },
    port: process.env.PORT || 3000,
    session: {
        cookie: {
            maxAge: 60 * 60 * 1000,
            httpOnly: false
        },
        name: '_sid',
        secret: '7214N-46X41-89H16',
        resave: true,
        saveUninitialized: true
    }
};

function compressOnlyUncompressed(req, res) {
    if (res.getHeader('Content-Encoding') === 'gzip') {
        return false;
    }
    return compression.filter(req, res);
}


module.exports = config;