import { Delete, Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuid } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PlayersService {
    private readonly logger = new Logger(PlayersService.name)

    constructor(@InjectModel('Player') private playerModel: Model<Player>) { }

    async createUpdatePlayer(payload: CreatePlayerDto): Promise<Player> {
        const { email } = payload;
        const existingPlayer = await this.playerModel.findOne({ email }).exec();
        if (existingPlayer) {
            return this.update(payload);
        }
        return this.create(payload);
    }

    async getAllPlayers(): Promise<Player[]> {
        return await this.playerModel.find().exec();
    }

    async findPlayerByEmail(email: string): Promise<Player> {
        const player = await this.playerModel.findOne({ email }).exec();
        if (!player) {
            throw new Error(`Player with email ${email} not found`);
        }
        return player;
    }

    private async create(createPlayerPayload: CreatePlayerDto): Promise<Player> {
        const createdPlayer = new this.playerModel(createPlayerPayload);
        return await createdPlayer.save();
    }

    private async update(updatePlayerPayload: CreatePlayerDto): Promise<Player> {
        this.logger.log('INFO', `Updating player: ${JSON.stringify(updatePlayerPayload)}`);
        return await this.playerModel.findOneAndUpdate({ email: updatePlayerPayload.email }, { $set: updatePlayerPayload }).exec();
    }

    @Delete()
    async deletePlayer(email: string): Promise<any> {
        this.logger.log('INFO', `Deleting player: ${email}`);
        return await this.playerModel.deleteOne({ email }).exec();
    }
}
