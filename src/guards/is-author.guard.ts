import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { map, switchMap } from "rxjs";
import { PostsEntity } from "src/posts/posts.entity";
import { PostsService } from "src/posts/posts.service";
import { UsersEntity } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";

export class isAuthorGuard implements CanActivate {
    constructor(
        @Inject(UsersService) private usersService,
        @Inject(PostsService) private postsService
    ) {}
    
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest()
        
        const postId = req.params.id;
        const post = await this.postsService.findOne(Number(postId));

        const userId = req.session.userId;
        const currentUser = await this.usersService.findOne(Number(userId));

        return post.author === currentUser.id
    }
}