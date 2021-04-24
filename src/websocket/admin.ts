import { ConnectionsService } from "../services/ConnectionsService"
import { MessagesService } from "../services/MessagesService"

const admin = (io) => {
  io.on('connect', async socket => {
    const messagesService = new MessagesService()
    const connectionsService = new ConnectionsService()

    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin()

    io.emit('admin_list_all_users', allConnectionsWithoutAdmin)

    socket.on('admin_list_messages_by_user', async (params, callback) => {
      const { user_id } = params

      const allMessages = await messagesService.listByUser(user_id)
      callback(allMessages)

      const connection = await connectionsService.findByUserId(user_id)
      connection.admin_id = socket.id
      await connectionsService.create(connection)

      io.emit('admin_list_all_users', allConnectionsWithoutAdmin)
    })

    socket.on('admin_send_message', async params => {
      const { user_id, text } = params

      await messagesService.create({
        text,
        user_id,
        admin_id: socket.id
      })

      const { socket_id } = await connectionsService.findByUserId(user_id)

      io.to(socket_id).emit('admin_send_to_client', {
        text,
        socket_id: socket.id
      })
    })
  })
}

export { admin }