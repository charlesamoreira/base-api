import { User } from "../../../../domain/user/entity/user";
import { UserEntity } from "../../entities/user/user.entity";

export class UserEntityMapper {
	static letfToRight = (item: User): UserEntity => {
		const entity = new UserEntity();

		entity.id = item.id;
		entity.name = item.name;
		entity.password = item.password;
		entity.status = item.status;
		entity.theme = item.theme;
		entity.username = item.username;

		return entity;
	};

	static rightToLeft = (entity: UserEntity): User => {
		const item = new User();

		item.id = entity.id;
		item.name = entity.name;
		item.password = entity.password;
		item.status = entity.status;
		item.theme = entity.theme;
		item.username = entity.username;
		return item;
	};
}
