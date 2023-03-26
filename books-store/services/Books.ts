
abstract class BooksRepository {
    abstract createBook(book: object): void | string;

    abstract getBook(id: string): object | void;

    abstract getBooks(): object | void;

    abstract updateBook(id: string): string | void;

    abstract deleteBook(id: string): string | void;
}