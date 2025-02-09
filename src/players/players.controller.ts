import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { PlayersValidationParametersPipe } from './pipes/players-validation-parameters.pipe';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('players')
export class PlayersController {

    constructor(private readonly playersService: PlayersService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async createPlayer(
        @Body() payload: CreatePlayerDto
    ): Promise<Player> {
        return await this.playersService.createPlayer(payload);
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    async updatePlayer(
        @Body() payload: UpdatePlayerDto,
        @Param('id', PlayersValidationParametersPipe) id: string
    ): Promise<void> {
        await this.playersService.updatePlayer(id, payload);
    }

    @Get()
    async getAllPlayers(): Promise<Player[]> {
        return await this.playersService.getAllPlayers();
    }

    @Get('/:id')
    async getPlayerById(
        @Param('id', PlayersValidationParametersPipe) id: string
    ): Promise<Player> {
        return await this.playersService.findPlayerById(id);
    }

    @Delete('/:id')
    async deletePlayer(
        @Query('id', PlayersValidationParametersPipe) id: string
    ) {
        await this.playersService.deletePlayer(id);
    }
}
