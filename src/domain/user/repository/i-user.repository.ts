import { User } from "../entity/user";
import { UserFilter } from "../entity/user-filter";

export interface IUserRepository {
	create(user: User): Promise<User>;
	deleteUser(filter: UserFilter): Promise<void>;
	getUsers(filter: UserFilter): Promise<User[]>;
	update(user: User): Promise<void>;
}
