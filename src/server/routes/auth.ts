import * as express from 'express';
import * as parser from 'body-parser';
import { User } from '../models/user';

const router = express.Router();
const jsonParser = parser.json();

router.post('/authenticated', jsonParser, (req: express.Request, res: express.Response) => {
    if (req.session && req.session.authenticated) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

router.post('/login', jsonParser, (req, res) => {
    processAuthentication(req)
        .then(() => res.sendStatus(200))
        .catch((error: Error) => {
            console.log(error);
            res.sendStatus(401);
        });
});

function processAuthentication(request: express.Request) {
    const password = request.body.p;
    return new Promise((resolve, reject) => {
        if (typeof password === 'string' && User.authenticate(password)) {
            request.session.authenticated = true;
            resolve();
        } else {
            request.session.authenticated = false;
            reject();
        }
    });
}

export const authRouter = router;

export function authGuard(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.session && req.session.authenticated) {
        next();
    } else {
        console.log(req.session);
        res.sendStatus(401);
    }
}
