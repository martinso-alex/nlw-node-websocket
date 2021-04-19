import express from "express"

const app = express()

app.get('/', (req, res) => res.send('hello nlw#5'))

app.listen(3333, () => console.log('server is running on port 3333'))