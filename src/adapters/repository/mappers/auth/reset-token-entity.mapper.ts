import { ResetToken } from "../../../../domain/auth/entity/resetToken";
import { ResetTokenEntity } from "../../entities/auth/reset-token.entity";

export class ResetTokenEntityMapper {
	static letfToRight = (item: ResetToken): ResetTokenEntity => {
		const entity = new ResetTokenEntity();

		entity.id = item.id;
		entity.expires = item.expires;
		entity.token = item.token;
		entity.userId = item.userId;

		return entity;
	};

	static rightToLeft = (entity: ResetTokenEntity): ResetToken => {
		const item = new ResetToken();

		item.id = entity.id;
		item.expires = entity.expires;
		item.expires = entity.expires;
		item.token = entity.token;
		item.userId = entity.userId;

		return item;
	};
}
