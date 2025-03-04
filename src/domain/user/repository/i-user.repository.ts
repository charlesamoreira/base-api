import { Page, PageOptions } from "../../../common/dtos";
import { User } from "../entity/user";
import { UserFilter } from "../entity/user-filter";

export interface IUserRepository {
	create(user: User): Promise<User>;
	deleteUser(filter: UserFilter): Promise<void>;
	getUserById(id: string): Promise<User>;
	getUsers(filter: UserFilter, pageOptionsDto: PageOptions): Promise<Page<User>>;
	update(user: User): Promise<void>;
}
