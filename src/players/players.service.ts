import { BadRequestException, Delete, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuid } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
    private readonly logger = new Logger(PlayersService.name)

    constructor(@InjectModel('Player') private playerModel: Model<Player>) { }

    async createPlayer(payload: CreatePlayerDto): Promise<Player> {
        const { email } = payload;
        const existingPlayer = await this.playerModel.findOne({ email }).exec();
        if (existingPlayer) {
            throw new BadRequestException(`Player email ${email} already exists`)
        }
        return this.create(payload);
    }

    async updatePlayer(id: string, payload: UpdatePlayerDto): Promise<void> {
        const existingPlayer = await this.playerModel.findOne({ id }).exec();
        if (!existingPlayer) {
            throw new NotFoundException(`Player ${id} not found`);
        }
        await this.update(id, payload);
    }

    async getAllPlayers(): Promise<Player[]> {
        return await this.playerModel.find().exec();
    }

    async findPlayerById(id: string): Promise<Player> {
        const player = await this.playerModel.findOne({ id }).exec();
        if (!player) {
            throw new Error(`Player with id ${id} not found`);
        }
        return player;
    }

    private async create(createPlayerPayload: CreatePlayerDto): Promise<Player> {
        const createdPlayer = new this.playerModel(createPlayerPayload);
        return await createdPlayer.save();
    }

    private async update(id: string, updatePlayerPayload: UpdatePlayerDto): Promise<Player> {
        this.logger.log('INFO', `Updating player: ${JSON.stringify(updatePlayerPayload)}`);
        return await this.playerModel.findOneAndUpdate({ id }, { $set: updatePlayerPayload }).exec();
    }

    @Delete()
    async deletePlayer(id: string): Promise<any> {
        const player = await this.playerModel.findOne({ id }).exec();
        if (!player) {
            throw new Error(`Player with id ${id} not found`);
        }
        this.logger.log('INFO', `Deleting player: ${id}`);
        return await this.playerModel.deleteOne({ id }).exec();
    }
}
