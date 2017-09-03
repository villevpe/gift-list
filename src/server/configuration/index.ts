import { Request, Response } from 'express';

const config = {
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

export default config;
