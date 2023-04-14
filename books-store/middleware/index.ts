import { Request } from 'express'
import multer from 'multer'
import path from 'path'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const storage = multer.diskStorage({
    destination: (
        request: Request,
        file: Express.Multer.File,
        callback: DestinationCallback
    ): void => {
        callback(null, 'public')
    },
    filename: (
        request: Request,
        file: Express.Multer.File,
        callback: FileNameCallback
    ): void => {
        callback(null, `${Date.now()}${path.extname(file.originalname)}`)
    }
})
