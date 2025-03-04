import { Inject, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { hash } from "bcrypt";
import { User } from "../entity/user";
import { IUserRepository } from "../repository/i-user.repository";
import { UserFilter } from "../entity/user-filter";
import { Page, PageOptions } from "../../../common/dtos";
import { Status } from "../../../common/constants";

@Injectable()
export class UserService {
	constructor(
		@Inject("UserRepository")
		private readonly usersRepository: IUserRepository,
	) {}

	async create(data: User): Promise<User | undefined> {
		const existingFromUsername = await this.getUsers({ username: data.username }, { take: 1, skip: 0 });

		if (existingFromUsername.meta.itemCount > 0) {
			throw new UnprocessableEntityException("Username already in use");
		}

		const user = await this.usersRepository.create({
			...data,
			status: Status.Active,
			theme: "light",
			password: await hash(data.password, 10),
		});

		return user;
	}

	async getUserById(id: string): Promise<User> {
		return this.usersRepository.getUserById(id);
	}

	async getUsers(filter: UserFilter, pageOptionsDto: PageOptions): Promise<Page<User>> {
		return this.usersRepository.getUsers(filter, pageOptionsDto);
	}

	async updateUser(user: User) {
		await this.usersRepository.update(user);
	}

	async removeUser(id: string) {
		await this.usersRepository.deleteUser({ id });
	}
}
