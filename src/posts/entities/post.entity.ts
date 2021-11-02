import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/user.entity';
import * as mongoose from 'mongoose';
import { Comment } from '../../comments/entities/comment.entity';
import { Bucket } from '../../bucket/bucket.entity';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  author: User;
  @Prop()
  title: string;
  @Prop()
  content: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Comment.name }] })
  comment: Comment[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Bucket.name }] })
  bucket: Bucket[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
