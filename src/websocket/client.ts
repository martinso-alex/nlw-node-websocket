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

      const allMessages = await messagesService.listByUser(user.id)

      socket.emit('client_list_all_messages', allMessages)

      const allUsers = await connectionsService.findAllWithoutAdmin()

      io.emit('admin_list_all_users', allUsers)
    })

    socket.on('client_send_to_admin', async params => {
      const { text, socket_id } = params

      const { user_id, user } = await connectionsService.findBySocketId(socket.id)

      const message = await messagesService.create({
        text,
        user_id
      })

      io.to(socket_id).emit('admin_receive_message', {
        message: message,
        socket_id: socket.id,
        user_id: user_id,
        email: user.email
      })
    })
  })
}

export { client }