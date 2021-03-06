import { getCustomRepository, Repository } from "typeorm"
import { Setting } from "../entities/Setting"
import { SettingsRepository } from "../repositories/SettingsRepository"

interface ISettingsCreate {
  chat: boolean
  username: string
}

class SettingsService {
  private settingsRepository: Repository<Setting>

  constructor () {
    this.settingsRepository = getCustomRepository(SettingsRepository)
  }

  async create ({ chat, username }: ISettingsCreate) {
    const userAlreadyExists = await this.settingsRepository.findOne({ username })

    if (userAlreadyExists) throw new Error('User already exists!')

    const setting = this.settingsRepository.create({
      chat,
      username
    })

    return await this.settingsRepository.save(setting)
  }

  async findByUsername (username: string) {
    return await this.settingsRepository.findOne({ username })
  }
}

export { SettingsService }