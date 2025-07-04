import { Inject, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { hash } from "bcrypt";
import { User } from "../entity/user";
import { IUserRepository } from "../repository/i-user.repository";
import { UserFilter } from "../entity/user-filter";

@Injectable()
export class UserService {
	constructor(
		@Inject("UserRepository")
		private readonly userRepository: IUserRepository,
	) {}

	async create(data: User): Promise<User | undefined> {
		const existingFromUsername = await this.getUsers({ username: data.username });

		if (existingFromUsername.length > 0) {
			throw new UnprocessableEntityException("Username already in use");
		}

		const user = await this.userRepository.create({
			...data,
			status: "active",
			theme: "light",
			password: await hash(data.password, 10),
		});

		return user;
	}

	async getUsers(filter: UserFilter): Promise<User[]> {
		return this.userRepository.getUsers(filter);
	}

	async updateUser(user: User) {
		await this.userRepository.update(user);
	}

	async removeUser(id: string) {
		await this.userRepository.deleteUser({ id });
	}
}
