import { Schema, model, Document, Types } from "mongoose";

export interface IRecord extends Document {
  artist: string;
  album: string;
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Record = model<IRecord>("Record", recordSchema);
export default Record;
