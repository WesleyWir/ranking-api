export interface Player {
    readonly _id: string;
    readonly phone: string;
    readonly email: string;
    name: string;
    ranking: string;
    rankingPosition: number;
    profilePhotoUrl: string;
}