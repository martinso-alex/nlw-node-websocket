import { getCustomRepository, Repository } from "typeorm"
import { User } from "../entities/User"
import { UsersRepository } from "../repositories/UsersRepository"

class UsersService {
  private usersRepository: Repository<User>

  constructor () {
    this.usersRepository = getCustomRepository(UsersRepository)
  }

  async create (email: string) {
    const userExists = await this.usersRepository.findOne({})

    if (userExists) return userExists

    const user = this.usersRepository.create({email})

    return await this.usersRepository.save(user)
  }
}

export { UsersService }