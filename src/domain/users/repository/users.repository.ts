import { User } from "../entity/user";

export interface UsersRepository {
	create(user: User): Promise<User>;
	findById(id: string): Promise<User>;
	findByUsername(username: string): Promise<User[]>;
	update(user: User): Promise<void>;
}
