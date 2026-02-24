import { 
  Controller, 
  Get, 
  Post, 
  Delete,
  Patch,
  Param, 
  Body, 
  HttpCode, 
  HttpStatus, 
  NotFoundException 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';


/*
  -------------------------------
  USERS CONTROLLER - STATUS CODES
  -------------------------------
  200 OK          -> Successfully fetched or deleted a resource
  201 Created     -> Successfully created a new resource
  404 Not Found   -> Resource with given ID does not exist
  400 Bad Request -> Invalid data provided (handled in DTO validation)
  500 Internal    -> Server error (automatically handled by Nest)
*/

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // -----------------------------
  // GET ALL USERS
  // -----------------------------
  @Get()
  @HttpCode(HttpStatus.OK) // 200
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    return users;
  }

  // -----------------------------
  // GET SINGLE USER BY ID
  // -----------------------------
  @Get(':id')
  @HttpCode(HttpStatus.OK) // 200
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`); // 404
    }
    return user;
  }

  // -----------------------------
  // CREATE NEW USER
  // -----------------------------
@Post()
async create(@Body() userData: CreateUserDto) {
  const newUser = await this.usersService.create(userData);
  return {
    message: 'User created successfully', // 201
    user: newUser,
  };
}

  // -----------------------------
  // DELETE USER BY ID
  // -----------------------------
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`); // 404
    }
    await this.usersService.remove(id);
    return { message: `User ${id} deleted successfully` }; // 200
  }

  @Patch('deactivate/:id')
  async deactivate(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`); // 404
    }

    user.status = 'inactive';
    await this.usersService.update(user.id, user); // make sure update method exists in service

    return {
      message: `User ${id} deactivated successfully`, // 200
      data: user,
    };
  }
}
