import { getCustomRepository, Repository } from "typeorm"
import { Message } from "../entities/Message"
import { MessagesRepository } from "../repositories/MessagesRepository"

interface IMessageCreate {
  user_id: string
  admin_id?: string
  text: string
}

class MessagesService {
  private messagesRepository: Repository<Message>

  constructor () {
    this.messagesRepository = getCustomRepository(MessagesRepository)
  }

  async create ({ user_id, admin_id, text }: IMessageCreate) {
    const message = this.messagesRepository.create({
      user_id,
      admin_id,
      text
    })

    return await this.messagesRepository.save(message)
  }

  async listByUser (user_id: string) {
    return await this.messagesRepository.find({
      where: {user_id},
      relations: ['user']
    })
  }
}

export { MessagesService }