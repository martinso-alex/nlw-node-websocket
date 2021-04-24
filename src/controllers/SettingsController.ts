import { Request, Response } from "express"
import { SettingsService } from "../services/SettingsService"

class SettingsController {
  async create (req: Request, res: Response) {
    const { chat, username } = req.body

    const settingsService = new SettingsService()
    
    try {
      const setting = await settingsService.create({ chat, username })
  
      res.json(setting)
    } catch (error) {
      res.status(400).json({message: error.message})
    }
  }

  async findByUsername (req: Request, res: Response) {
    const { username } = req.params

    const settingsService = new SettingsService()

    const setting = await settingsService.findByUsername(username)

    res.json(setting)
  }
}

export { SettingsController }