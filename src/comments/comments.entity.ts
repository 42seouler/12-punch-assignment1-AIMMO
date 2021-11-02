import { PostsEntity } from 'src/posts/posts.entity';
import { UsersEntity } from "src/users/users.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommentsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;
    
    @Column()
    date: Date;
    
    @Column()
    author: number;

    @OneToOne(() => PostsEntity, (post) => post.id)
    post: PostsEntity

    // many posts one user 
    // or one user can write many posts
    @ManyToOne(() => UsersEntity, (user) => user.posts) 
    user: UsersEntity;
}