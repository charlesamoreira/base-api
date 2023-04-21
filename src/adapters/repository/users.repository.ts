import { Injectable } from "@nestjs/common";
import { User } from "../../domain/user/entity/user";
import { IUserRepository } from "../../domain/user/repository/i-user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntityMapper } from "./mappers/user/user-entity.mapper";
import { UserFilter } from "../../domain/user/entity/user-filter";
import { UserEntity } from "./entities/user/user.entity";

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>,
	) {}

	async create(data: User): Promise<User> {
		const result = await this.usersRepository.insert(UserEntityMapper.letfToRight(data));
		data.id = result.identifiers[0].id;
		return data;
	}

	async deleteUser(filter: UserFilter): Promise<void> {
		await this.usersRepository.delete({ ...(filter.id && { id: filter.id }) });
	}

	async getUsers(filter: UserFilter): Promise<User[]> {
		const users = await this.usersRepository.find({
			where: {
				...(filter.id && { id: filter.id }),
				...(filter.username && { username: filter.username }),
			},
		});
		return users.map((u) => UserEntityMapper.rightToLeft(u));
	}

	async update(user: User): Promise<void> {
		await this.usersRepository.update({ id: user.id }, UserEntityMapper.letfToRight(user));
	}

}
