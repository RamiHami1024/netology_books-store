import { Router, Request, Response } from 'express'
const router = Router()
import { storage } from '../middleware/'
import { getData } from '../services/getDataIncrement'
import { existsSync, unlinkSync } from 'fs'
import { authenticate } from 'passport'
import { createUser } from '../db/user'
import { Books } from '../models/books'
import { iAuthenticate } from '../interfaces/index';
import multer from 'multer'

const upload = multer({ storage: storage })

router.get('/', async (req: Request, res: Response) => {
    res.render('index', {
        title: 'Главная'
    })
})

router.get('/users/login', (req: Request, res: Response) => {
    res.render('user/form', { title: 'Регистрация', book: {} })
})

router.post(
    '/users/login',
    authenticate('local', { failureRedirect: '/' }),
    (req: Request, res: Response) => {
        res.redirect('/user/me')
    }
)

router.post(
    '/users/registry',
    (req: Request, res: Response) => {
        const { username, password } = req.body

        try {
            createUser(username, password)
            res.redirect('/')
        } catch (error) {
            console.log(error)
            res.status(500).json({ code: 500, message: "Server error" })
        }
    })

router.get('/user/me',
    (req: iAuthenticate, res: Response, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/users/login')
        }
        next()
    },
    (req: iAuthenticate, res: Response) => {
        res.render('user/profile', { title: 'Профиль', user: req.user })
    })

router.get('/books', async (req: Request, res: Response) => {
    try {
        const books = await Books.find()

        res.render('books/index', {
            title: 'Главная',
            books: books
        })
    } catch (e) {
        res.status(500).json(e)
    }


})

router.get('/books/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const data = await getData(id)

    try {
        const book = await Books.findById(id)

        res.render(`books/view`, {
            title: book.title,
            book: book,
            views: data.message
        })
    } catch (e) {
        console.log(e)
        res.status(404).json({ code: 404, message: 'Not found' })
    }

    // res.render('books/view', {
    //     title: book.title,
    //     book: book,
    //     views: data.message
    // })
})

router.get('/book/create', (req: Request, res: Response) => {
    res.render('books/create', {
        title: 'Загрузить книгу',
        book: {}
    })
})


router.post('/book/create', upload.single('book'), async (req: Request, res: Response) => {
    const fileBook = req.file ? req.file.path : ''
    const fileName = req.file ? req.file.filename : fileBook.split('/')[1]
    const { title, description, authors, favorite } = req.body
    const newBook = new Books({
        title,
        description,
        authors,
        favorite,
        fileBook,
        fileName
    })

    try {
        await newBook.save()
        res.redirect(`/books`)
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 500, message: 'Server error' })
    }
})

router.get('/books/:id/download', async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const fileName = await Books.findById(id)

        // res.json(fileName)
        if (existsSync(fileName.fileBook)) {
            res.download(fileName.fileBook)
        }
    } catch (e) {
        res.status(500).json({ error: 500, message: 'File not found' })
    }
})

router.get('/books/update/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const book = await Books.findById(id)

        if (req.file) {
            unlinkSync(req.file.path)
        }

        res.render('books/update', {
            title: 'Редактировать книгу',
            book: book
        })
    } catch (e) {
        console.log(e)
        res.status(404).json({ code: 404, message: 'Not found' })
    }
})

router.post('/books/update/:id', upload.single('book'), async (req: Request, res: Response) => {
    const { id } = req.params
    const fileBook = req.file ? req.file.path : ''
    const fileName = req.file ? req.file.filename : fileBook.split('/')[1]
    const {
        title,
        description,
        authors,
        favorite,
    } = req.body
    try {
        const item = await Books.findById(id)

        if (fileBook || fileName) {
            unlinkSync(`./${item.fileBook}`)
        }

        await Books.findByIdAndUpdate(id, {
            title,
            description,
            authors,
            favorite,
            fileBook,
            fileName
        })
        res.redirect(`/books/${id}`)
    } catch (e) {
        console.log(e)
        res.status(404).json({ code: 404, message: 'Not found' })
    }
})

router.post('/book/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const fileName = await Books.findById(id)

        unlinkSync(`./${fileName.fileBook}`)
        await Books.deleteOne({ _id: id })
        res.redirect('/books')
    } catch (e) {
        console.log(e)
        res.status(404).json({ code: 404, message: 'Not found' })
    }
})


export { router }