import { Schema, model } from 'mongoose'

export const usersSchema = new Schema({
    username: {
        type: "string",
        required: true,
        unique: true
    },
    password: {
        type: "string",
        required: true
    }
})

export const Users = model('Users', usersSchema) 