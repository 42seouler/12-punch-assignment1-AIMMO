import { UsersEntity } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PostsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    post: string;
    
    @Column()
    date: Date;
    
    @Column()
    author: number;

    // many posts one user 
    // or one user can write many posts
    @ManyToOne(() => UsersEntity, (user) => user.posts) 
    user: UsersEntity;
}