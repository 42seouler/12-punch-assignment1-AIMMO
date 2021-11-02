import { PostsEntity } from "src/posts/posts.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;
    
    @Column()
    password: string;
    
    // one user many posts
    @OneToMany(() => PostsEntity, (post) => post.user)
    posts: PostsEntity[];
}