import { Schema, model, Document, Types } from "mongoose";

export interface IRecord extends Document {
  artist: string;
  album: string;
  owner: Types.ObjectId;
  genre?: string;
  isFavorite?: boolean;
  listened?: boolean;
}

const recordSchema = new Schema<IRecord>({
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  genre: { type: String },
  isFavorite: { type: Boolean, default: false },
  listened: { type: Boolean, default: false },
});

const Record = model<IRecord>("Record", recordSchema);
export default Record;
