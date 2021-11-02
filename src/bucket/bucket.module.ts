import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bucket, BucketSchema } from './bucket.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bucket.name,
        schema: BucketSchema,
      },
    ]),
  ],
})
export class BucketModule {}
