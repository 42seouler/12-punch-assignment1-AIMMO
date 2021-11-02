import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Comment } from '../comments/entities/comment.entity';

@Schema({ timestamps: true })
export class Bucket extends Document {
  @Prop()
  count: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Comment.name }] })
  comment: Comment[];
}

export const BucketSchema = SchemaFactory.createForClass(Bucket);
