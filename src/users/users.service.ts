import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User WITH id ${id} not found`);
    }
    return user;
  }

async create(userData: Partial<User>): Promise<{ message: string; user: User }> {
  const newUser = this.usersRepository.create({
    ...userData,
    created_at: new Date(), // default now
  });

  const savedUser = await this.usersRepository.save(newUser);

  // return friendly response
  return {
    message: `User ${savedUser.id} created successfully`, // 201
    user: savedUser,
  };
}

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

async update(id: number, userData: Partial<User>): Promise<User> {
  await this.usersRepository.update(id, userData);
  return this.findOne(id);
}
}
