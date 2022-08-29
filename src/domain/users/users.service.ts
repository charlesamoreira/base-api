import { Inject, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { hash } from "bcrypt";
import { User } from "./entity/user";
import { UsersRepository } from "./repository/users.repository";
@Injectable()
export class UsersService {
	constructor(
		@Inject("UsersRepository")
		private readonly usersRepository: UsersRepository,
	) {}

	async create(data: User): Promise<User | undefined> {
		const existingFromUsername = await this.findByUsername(data.username);

		if (existingFromUsername) {
			throw new UnprocessableEntityException("Username already in use");
		}

		return this.usersRepository.create({
			...data,
			password: await hash(data.password, 10),
		});
	}

	async findById(id: string): Promise<User | undefined> {
		return this.usersRepository.findById(id);
	}

	async findByUsername(username: string): Promise<User | undefined> {
		const users = await this.usersRepository.findByUsername(username);
		return users.length > 0 ? users[0] : undefined;
	}

	async updateUser(user: User) {
		await this.usersRepository.update(user);
	}
}
