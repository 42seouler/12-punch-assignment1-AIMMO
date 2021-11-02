import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CommentsEntity } from './comments.entity';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsEntity)
        private repo: Repository<CommentsEntity>
    ) {}

    async findOne(id: number) {
        if (!id) return null;
        return await this.repo.findOne(id)
    }
    
    async findAll(offset: number = 0, limit: number = 10) {
        const [comments, count] = await this.repo.findAndCount({
            order: { id: 'ASC' },
            skip: offset,
            take: limit
        });
        return { comments, count }
    }

    createComment(comment: CommentDto, user: UsersEntity) {
        const date = new Date(Date.now());
        const newcomment = this.repo.create({...comment, date})
        newcomment.user = user;
        newcomment.author = user.id;
        return this.repo.save(newcomment);
    }


    async updateComment(id: number, attrs: Partial<CommentsEntity>) {
        const comment = await this.findOne(id);
        if (!comment) throw new NotFoundException('comment not found')
        
        Object.assign(comment, attrs);
        
        return this.repo.save(comment);
    }
    
    async deleteComment(id: number) {
        const comment = await this.findOne(id);
        if (!comment) throw new NotFoundException('comment not found');
        
        return this.repo.remove(comment);
    }
}
