import { ConnectionsService } from '../services/ConnectionsService'
import { MessagesService } from '../services/MessagesService'
import { UsersService } from '../services/UsersService'

interface IParams {
  text: string
  email: string
}

const client = (io) => {
  io.on('connect', socket => {
    const usersService = new UsersService()
    const messagesService = new MessagesService()
    const connectionsService = new ConnectionsService()
    
    socket.on('client_first_access', async params => {
      console.log(params)

      const { text, email } = params as IParams

      let user = await usersService.findByEmail(email)

      if (!user) {
        user = await usersService.create(email)

        await connectionsService.create({
          socket_id: socket.id,
          user_id: user.id
        })
      } else {
        let connection = await connectionsService.findByUserId(user.id)
        
        if (!connection) {
          connection = await connectionsService.create({
            socket_id: socket.id,
            user_id: user.id
          })
        } else {
          connection.socket_id = socket.id

          await connectionsService.create(connection)
        }
      }

      await messagesService.create({
        text: text,
        user_id: user.id
      })
    })
  })
}

export { client }