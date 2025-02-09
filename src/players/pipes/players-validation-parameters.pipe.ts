import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";


export class PlayersValidationParametersPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException(`Parameter ${metadata.data} is required`)
        }
        return value;
    }
}