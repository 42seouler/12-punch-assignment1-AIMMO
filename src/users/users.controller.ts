import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService
    ) {}

    @Post('/signup')
    async signUp(@Body() body: UserDto, @Session() session: any) {
        const user = await this.usersService.signUp(body.email, body.password);
        session.userId = user.id
        return user;
    }
    
    @Post('/signin')
    async signIn(@Body() body: UserDto, @Session() session: any) {
        const user = await this.usersService.signIn(body.email, body.password);
        session.userId = user.id
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Get('/whoami')
    whoami(@Session() user: UsersEntity) {
        return user;
    }

}
