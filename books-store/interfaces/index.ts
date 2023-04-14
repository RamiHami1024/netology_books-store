import { Request } from 'express';

export interface iBooks {
    title: string;
    description: string;
    authors: string[];
    favorite: string[];
    fileBook: string;
    fileName: string;
}

export interface iUser {
    id: string;
    userName: string;
    password: string;
}

export interface iAuthenticate extends Request {
    isAuthenticated: Function;
    user: iUser;
}

interface iBookFile {
    path: string;
    filename: string;
}


export interface iSocket {
    type: string
}