import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const result = await this.userRepository.save(user);
      return {
        status: 200,
        result: result,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  }

  async findAll() {
    try {
      const result = await this.userRepository.find({
        where: { isActive: true },
      });
      return {
        status: 200,
        result: result,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  }

  async findOne(id: string) {
    // return await this.userRepository.findOne({ where: { email: id } });
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :id OR user.mobile = :id', { id })
      .getMany();
  }

  async findByEmail(email: string) {
    // return await this.userRepository.findOne({ where: { email: id } });
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .execute();
  }

  async findById(id: string) {
    return await this.userRepository.findOne({ where: { email: id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const post = await this.userRepository.find({ where: { id } });
    console.log('🚀 ~ PostService ~ update ~ post:', post);

    if (post.length == 0) {
      throw new NotFoundException();
    } else {
      return await this.userRepository
        .createQueryBuilder()
        .update(updateUserDto)
        .set({ ...updateUserDto })
        .where('id = :id', { id: id })
        .execute();
    }
  }

  async remove(id: number) {
    const post = await this.userRepository.find({ where: { id } });
    console.log('🚀 ~ PostService ~ delete ~ user:', post);

    if (post.length == 0) {
      throw new NotFoundException();
    } else {
      return await this.userRepository
        .createQueryBuilder()
        .update()
        .set({ isActive: false })
        .where('id = :id', { id: id })
        .execute();
    }
  }
}
