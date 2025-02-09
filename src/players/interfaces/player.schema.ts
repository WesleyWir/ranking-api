import * as mongoose from "mongoose";

export const PlayerSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ranking: { type: String, default: 'A' },
    rankingPosition: { type: Number, default: 1 },
    profilePhotoUrl: { type: String, default: null }
}, { timestamps: true, collection: 'players' });