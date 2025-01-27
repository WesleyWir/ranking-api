import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';

@Controller('players')
export class PlayersController {

    constructor(private readonly playersService: PlayersService) { }

    @Post()
    async createUpdatePlayer(
        @Body() createPlayerPayload: CreatePlayerDto
    ) {
        await this.playersService.createUpdatePlayer(createPlayerPayload);
    }

    @Get()
    async getAllPlayers(
        @Query('email') email: string
    ): Promise<Player[] | Player> {
        if (email) {
            return await this.playersService.findPlayerByEmail(email);
        }
        return await this.playersService.getAllPlayers();
    }

    async deletePlayer(
        @Query('email') email: string
    ){
        await this.playersService.deletePlayer(email);
    }
}
