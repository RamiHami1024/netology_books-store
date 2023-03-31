import 'reflect-metadata'
import { injectable } from 'inversify'

@injectable()
export abstract class BooksRepository {
    abstract createBook(book: object): string | Error;

    abstract getBook(id: string): Promise<object | Error>;

    abstract getBooks(): object | Error;

    abstract updateBook(id: string): string | Error;

    abstract deleteBook(id: string): string | Error;
}