import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt); // to use promise instead of callback

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private repo: Repository<UsersEntity>
    ) {}

    async signUp(email, password) {
        const users = await this.repo.find({ email });
        if (users.length) throw new BadRequestException('Email in use');

        // hash the users password
            // generate salt
        const salt = randomBytes(8).toString('hex'); //16 characters

            // hash the salt + password
        const hash = (await scrypt(password, salt, 32)) as Buffer;

            // join the hashed result and salt together
        const hashedPassword = `${salt}.${hash.toString('hex')}` as string;

        // create new user and save
        return this.createUser(email, hashedPassword)
    }
    
    private async createUser(email, password) {
        const user = await this.repo.create({email, password})
        await this.repo.save(user);
        return user;
    }

    async signIn(email, password) {
        const [user] = await this.repo.find({ email });
        if (!user) throw new NotFoundException('user not found');

        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer
        
        if (storedHash !== hash.toString('hex')) throw new BadRequestException('wrong password')
        
        return user;
    }

    async findOne(id: number) {
        if (!id) return null; // Need to return null cuz repo returns id of first user if id is null
        return await this.repo.findOne(id);
    }
}
