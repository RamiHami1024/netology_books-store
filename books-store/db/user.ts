import { iUser } from '../interfaces'
import { Users } from '../models/users'

export const findById = async function (id: string, cb: Function) {
    try {
        const user = await Users.findById(id)

        Object.keys(user).length ?
            cb(null, user) :
            cb(null, null)
    } catch (error) {
        throw Error(error)
    }
}

export const findByUsername = async function (username: string, cb: Function) {
    try {
        const user = await Users.find({ usserName: username })

        Object.keys(user).length ?
            cb(null, user) :
            cb(null, null)
    } catch (error) {
        throw Error(error)
    }
}

export const verifyPassword = (user: Array<iUser>, password: string): boolean => {
    return user[0].password === password
}

export const createUser = async function (username: string, password: string): Promise<void> {
    const newUser = new Users({ username, password })

    try {
        await newUser.save()
    } catch (error) {
        throw Error(error)
    }
}