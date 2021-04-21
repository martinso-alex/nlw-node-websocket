import { Request, Response } from "express"
import { MessagesService } from "../services/MessagesService"

class MessagesController {
  async create (req: Request, res: Response) {
    const { user_id, admin_id, text } = req.body

    const messagesService = new MessagesService()

    const message = await messagesService.create({
      user_id,
      admin_id,
      text
    })

    res.json(message)
  }

  async listByUser (req: Request, res: Response) {
    const { id } = req.params

    const messagesService = new MessagesService()

    const list = await messagesService.listByUser(id)

    res.json(list)
  }
}

export { MessagesController }