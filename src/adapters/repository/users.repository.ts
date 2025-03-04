import { Injectable } from "@nestjs/common";
import { User } from "../../domain/user/entity/user";
import { IUserRepository } from "../../domain/user/repository/i-user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntityMapper } from "./mappers/user/user-entity.mapper";
import { UserFilter } from "../../domain/user/entity/user-filter";
import { UserEntity } from "./entities/user/user.entity";
import { Page, PageMeta, PageOptions } from "../../common/dtos";

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>,
	) {}

	async create(data: User): Promise<User> {
		const result = await this.usersRepository.save(UserEntityMapper.letfToRight(data));
		data.id = result.id;
		return data;
	}

	async deleteUser(filter: UserFilter): Promise<void> {
		await this.usersRepository.delete({ ...(filter.id && { id: filter.id }) });
	}

	async getUserById(id: string): Promise<User> {
		const user = await this.usersRepository.findOneBy({ id });
		return UserEntityMapper.rightToLeft(user);
	}

	async getUsers(filter: UserFilter, pageOptionsDto: PageOptions): Promise<Page<User>> {
		const queryBuilder = this.usersRepository.createQueryBuilder();

		queryBuilder.orderBy("user.createdAt", pageOptionsDto.order).skip(pageOptionsDto.skip).take(pageOptionsDto.take);

		if (filter.id) {
			queryBuilder.andWhere("user.id = :id", { id: filter.id });
		}
		if (filter.username) {
			queryBuilder.andWhere("user.username = :username", { username: filter.username });
		}

		const itemCount = await queryBuilder.getCount();
		const { entities } = await queryBuilder.getRawAndEntities();

		const pageMetaDto = new PageMeta({ itemCount, pageOptions: pageOptionsDto });

		return new Page(
			entities.map((u) => UserEntityMapper.rightToLeft(u)),
			pageMetaDto,
		);
	}

	async update(user: User): Promise<void> {
		await this.usersRepository.update({ id: user.id }, UserEntityMapper.letfToRight(user));
	}
}
