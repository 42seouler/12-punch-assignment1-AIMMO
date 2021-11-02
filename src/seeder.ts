import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/user.entity';
import { UsersSeeder } from './users/users.seeder';

seeder({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-course'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
}).run([UsersSeeder]);
