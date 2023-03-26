
abstract class BooksRepository {
    abstract createBook(book: object): string | Error;

    abstract getBook(id: string): object | Error;

    abstract getBooks(): object | Error;

    abstract updateBook(id: string): string | Error;

    abstract deleteBook(id: string): string | Error;
}