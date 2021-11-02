/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

fdescribe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService;

  beforeEach(async () => {
    
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id, email: "test@test.com",
          password: 'test'
        } as User)
      },
      findAll: () => {
        return Promise.resolve([{id: 1, email: 'test', password: 'test'} as User])
      },
      create: ({email, password}) => {
        return Promise.resolve({
          "password": password,
          "email": email,
          "_id": "randomString",
          "createdAt": "today",
          "updatedAt": "today",
          "__v": 0
        })
      },
      update: (id: string) => {
        return Promise.resolve({
          id: id,
          "password": "password",
          "email": "email",
          "_id": "randomString",
          "createdAt": "today",
          "updatedAt": "today",
          "__v": 0
        })
      }, 
      remove: (id: string) => {
        return Promise.resolve('user deleted')
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of users', async () => {
    let findAllMethod = jest.spyOn(fakeUsersService, 'findAll')
    await controller.findAll({ limit: 10, offset: 10 })
    expect(findAllMethod).toHaveBeenCalled();
  });

  it('should create a user', async () => {
    let createMethod = jest.spyOn(fakeUsersService, 'create')
    await controller.create({email:"test@test.com", password: "test"})
    expect(createMethod).toHaveBeenCalled();
  });

  it('should find the searched user', async () => {
    let findOneMethod = jest.spyOn(fakeUsersService, 'findOne')
    await controller.findOne('asdf')
    expect(findOneMethod).toHaveBeenCalled();
  });
  
  it('should update the user', async () => {
    let updateMethod = jest.spyOn(fakeUsersService, 'update')
    await controller.update('asdf', {email: 'hi@hi'})
    expect(updateMethod ).toHaveBeenCalled();
  });

  it('should remove the user', async () => {
    let removeMethod = jest.spyOn(fakeUsersService, 'remove')
    await controller.remove('asdf')
    expect(removeMethod).toHaveBeenCalled();
  });
  
});
