import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidationPipe } from '../pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.userService.getDataById(_id);
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(_id, dto);
	}

	@Get('profile/favorites')
	@Auth()
	async getFavorites(@User('_id') _id: Types.ObjectId) {
		return this.userService.getFavoriteMovies(_id);
	}

	@Put('profile/favorites')
	@HttpCode(200)
	@Auth()
	async toggleFavorite(
		@Body('movieId', IdValidationPipe) movieId: Types.ObjectId, 
		@User() user: UserEntity
	) {
		return this.userService.toggleFavorite(movieId, user);
	}

	@Get('count')
	@Auth('admin')
	async getCountUsers() {
		return this.userService.getCount();
	}

	@Get()
	@Auth('admin')
	async getUsers(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAll(searchTerm);
	}

	@Get(':id')
	@Auth('admin')
	async getUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.getDataById(id);
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async updateUser(
		@Param('id', IdValidationPipe) id: string,
		@Body() data: UpdateUserDto
	) {
		return this.userService.updateProfile(id, data);
	}

	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.userService.delete(id);
		if (!deletedDoc) throw new NotFoundException('Movie not found');
	}
}
