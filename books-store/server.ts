import express from 'express';
import { Express } from 'express';
import { router } from './routes/main'
import mongoose, { Callback } from 'mongoose'
import session from 'express-session'
import passport from 'passport'
import passportLocal from 'passport-local'
require('dotenv').config()
import { findById, findByUsername, verifyPassword, createUser } from './db/user'
const http = require('http');
import { Server } from 'socket.io'
import { socketHandler } from './handlers/socket'
import { iUser } from './interfaces/index'

const app: Express = express();
const LocalStrategy = passportLocal.Strategy
const server = new http.Server(app)
const io = new Server(server)
const PORT = Number(process.env.PORT) || 3000
const DB_URL = process.env.DB_URL || ""
const ADMIN = process.env.ADMIN
const ADMIN_PASS = process.env.ADMIN_PASS

io.on('connection', (socket: any) => {
    socketHandler(socket)
})

async function start(PORT: number, dbUrl: string): Promise<void> {
    try {
        await mongoose.connect(dbUrl)
        console.log(mongoose.connection.readyState);
        server.listen(PORT)
    } catch (e: any) {
        throw Error(e)
    }
}

const verify = (username: string, password: string, done: Function) => {
    findByUsername(username, (err: string, user: Array<iUser>) => {
        if (err) return done(err)
        if (!user) return done(null, false)
        if (!verifyPassword(user, password)) return done(null, false)

        return done(null, user)
    })
}

const options = {
    usernameField: "username",
    passwordField: "password",
}

passport.serializeUser<any, any>((user: Array<iUser>, cb: Function) => {
    cb(null, user[0].id)
})

passport.deserializeUser(async (id: string, cb: Function) => {
    await findById(id, (err: string, user: object) => {
        if (err) return cb(err)
        cb(null, user)
    })
})

passport.use(new LocalStrategy(options), verify)

app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize())
app.use(passport.session())
app.use('/', router)
app.set('view engine', 'ejs')

start(PORT, DB_URL)
