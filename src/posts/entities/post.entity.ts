import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/user.entity';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  author: User;
  @Prop()
  title: string;
  @Prop()
  content: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
