import 'reflect-metadata'
import { Container } from 'inversify'
import { BooksRepository } from '../Books'

export const container = new Container();
container.bind(BooksRepository).toSelf();