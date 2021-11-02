import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User, UserSchema } from 'src/users/user.entity';
import * as mongoose from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { Comment } from '../../comments/entities/comment.entity';
import { Bucket } from '../../bucket/bucket.entity';

@Schema({ timestamps: true })
export class Post extends Document {
  @Factory(() => {
    const userModel = mongoose.model('User', UserSchema);
    userModel
      .find()
      .limit(100)
      .exec()
      .then((data) => {
        const arr = data.map((el) => el._id);
        const random = Math.floor(Math.random() * arr.length);
        return arr[random];
      });
  })
  // @Factory('6181115dc7e1e43d6f2ce70f')
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  author: User;

  @Factory((faker) =>
    faker.random.arrayElement([
      'yellow',
      'red',
      'blue',
      'white',
      'orange',
      'purple',
      'green',
    ]),
  )
  @Prop()
  title: string;

  @Factory((faker) =>
    faker.random.arrayElement([
      'banana',
      'apple',
      'mango',
      'pineapple',
      'lemon',
      'watermelon',
      'plum',
    ]),
  )
  @Prop()
  content: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Comment.name }] })
  comment: Comment[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Bucket.name }] })
  bucket: Bucket[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
