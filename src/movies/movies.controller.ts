import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.moviesService.getBySlug(slug);
  }

	@Get('by-actor/:actorId')
	async getByActorId(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
		return this.moviesService.getByActorId(actorId)
	}

  @Post('by-genres')
	@HttpCode(200)
	async getByGenreIds(
		@Body('genreIds')
		genreIds: Types.ObjectId[]
	) {
		return this.moviesService.getByGenreIds(genreIds);
	}

  @Get() 
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.moviesService.getAll(searchTerm);
  }

  @Get('/most-popular')
	async getMostPopular() {
		return this.moviesService.getMostPopular()
	}

  @Post('/update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.moviesService.updateCountOpened(slug)
	}

  @Get()
  async getById(@Param('id') id: string) {
    return this.moviesService.getById(id);
  }

  @Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.moviesService.create()
	}

  @UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateMovieDto
	) {
		const updateMovie = await this.moviesService.update(id, dto)
		if (!updateMovie) throw new NotFoundException('Movie not found')
		return updateMovie
	}

	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.moviesService.delete(id)
		if (!deletedDoc) throw new NotFoundException('Movie not found')
	}
}
