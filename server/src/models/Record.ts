import { Schema, model, Document, Types } from "mongoose";

export interface IRecord extends Document {
  artist: string;
  album: string;
  genre?: string;
  isFavorite?: boolean;
  listened?: boolean;
  owner: Types.ObjectId;
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
  genre: {
    type: String,
  },
  isFavorite: {
    type: Boolean,
  },
  listened: {
    type: Boolean,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Record = model<IRecord>("Record", recordSchema);
export default Record;
