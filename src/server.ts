import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import path from 'path'

import { client } from './websocket/client'

import './database'
import { routes } from './routes'

const app = express()

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.json())
app.use(routes)

app.set('views', path.join(__dirname, '..', 'public'))
app.engine("html", require('ejs').renderFile)
app.set('view engine', 'html')

app.get('/pages/client', (req, res) => res.render('html/client.html'))

const http = createServer(app)
const io = new Server(http)

io.on('connection', (socket: Socket) => {
  console.log("novo socket: ", socket.id)
})

client(io)

http.listen(3333, () => console.log('server is running on port 3333'))