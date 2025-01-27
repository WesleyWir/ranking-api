import { Delete, Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
    private players: Player[] = [];

    private readonly logger = new Logger(PlayersService.name)

    async createUpdatePlayer(createPlayerPayload: CreatePlayerDto): Promise<void> {
        const { email } = createPlayerPayload;
        const existingPlayer = this.players.find(player => player.email === email);
        if (existingPlayer) {
            this.update(existingPlayer, createPlayerPayload);
        }
        this.create(createPlayerPayload);
    }

    async getAllPlayers(): Promise<Player[]> {
        return this.players;
    }

    async findPlayerByEmail(email: string): Promise<Player> {
        const player = this.players.find(player => player.email === email);
        if (!player) {
            throw new Error(`Player with email ${email} not found`);
        }
        return player;
    }

    private create(createPlayerPayload: CreatePlayerDto) {
        const { name, phone, email } = createPlayerPayload;
        const player: Player = {
            _id: uuid(),
            name,
            phone,
            email,
            ranking: 'A',
            rankingPosition: 1,
            profilePhotoUrl: 'https://example.com/default-profile-photo.jpg'
        }
        this.logger.log('INFO', `Creating player: ${JSON.stringify(player)}`);
        this.players.push(player);
    }

    private update(existingPlayer: Player, updatePlayerPayload: CreatePlayerDto): void {
        const { name } = updatePlayerPayload;
        existingPlayer.name = name;
        this.logger.log('INFO', `Updating player: ${JSON.stringify(existingPlayer)}`);
    }

    @Delete()
    async deletePlayer(email: string): Promise<void>{
        const existingPlayer: Player = await this.players.find(p => p.email === email);
        this.logger.log('INFO', `Deleting player: ${JSON.stringify(existingPlayer)}`);
        this.players = this.players.filter(p => p.email !== existingPlayer.email)
    }
}
