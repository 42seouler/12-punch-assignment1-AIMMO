import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({ timestamps: true })
export class User extends Document {
  @Factory(() => {
    const num = Math.random() * 5000;
    return `user${num}@gmail.com`;
  })
  @Prop()
  email: string;

  @Factory('Aaa12345')
  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
