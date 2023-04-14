import { iSocket } from '../interfaces'

export const socketHandler = (socket: any) => {
    const { roomName } = socket.handshake.query
    socket.join(roomName)
    socket.on('message-to-room', (msg: iSocket) => {
        // Здесь могло бы быть сохранение комментариев в базу, 
        // но я не понял, как сделать так, чтобы socker.io работал
        // как midleware, чтобы подключить его к router

        msg.type = `room: ${roomName}`
        socket.to(roomName).emit('message-to-room', msg)
        socket.emit('message-to-room', msg)
    })
}
