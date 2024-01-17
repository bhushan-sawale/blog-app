import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const post = this.postRepository.create({ ...createPostDto });
      const result = await this.postRepository.save(post);
      return {
        status: 200,
        result: result,
      };
    } catch (error) {
      return { error: error };
    }
  }

  async findAll() {
    try {
      const result = await this.postRepository.find({
        where: { isActive: true },
      });
      return {
        status: 200,
        result: result,
      };
    } catch (error) {
      return { error: error };
    }
  }

  async findOne(id: number) {
    return await this.postRepository.findOne({ where: { id, isActive: true } });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.find({ where: { id } });
    console.log('🚀 ~ PostService ~ update ~ post:', post);

    if (post.length == 0) {
      throw new NotFoundException();
    } else {
      return await this.postRepository
        .createQueryBuilder()
        .update(updatePostDto)
        .set({ content: updatePostDto.content })
        .where('id = :id', { id: id })
        .execute();
    }
  }

  async remove(id: number) {
    const post = await this.postRepository.find({ where: { id } });
    console.log('🚀 ~ PostService ~ update ~ post:', post);

    if (post.length == 0) {
      throw new NotFoundException();
    } else {
      return await this.postRepository
        .createQueryBuilder()
        .update()
        .set({ isActive: false })
        .where('id = :id', { id: id })
        .execute();
    }
  }
}
