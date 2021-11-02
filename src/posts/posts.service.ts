import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { PostDto } from './dto/post.dto';
import { PostsEntity } from './posts.entity';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(PostsEntity)
        private repo: Repository<PostsEntity>
    ) {}

    async findOne(id: number) {
        if (!id) return null;
        return await this.repo.findOne(id)
    }
    
    async findAll(offset: number = 0, limit: number = 10) {
        const [posts, count] = await this.repo.findAndCount({
            order: { id: 'ASC' },
            skip: offset,
            take: limit
        });
        return { posts, count }
    }

    createPost(post: PostDto, user: UsersEntity) {
        const date = new Date(Date.now());
        const newPost = this.repo.create({...post, date})
        newPost.user = user;
        newPost.author = user.id;
        return this.repo.save(newPost);
    }


    async updatePost(id: number, attrs: Partial<PostsEntity>) {
        const post = await this.findOne(id);
        if (!post) throw new NotFoundException('Post not found')
        
        Object.assign(post, attrs);
        
        return this.repo.save(post);
    }
    
    async deletePost(id: number) {
        const post = await this.findOne(id);
        if (!post) throw new NotFoundException('Post not found');
        
        return this.repo.remove(post);
    }
}
