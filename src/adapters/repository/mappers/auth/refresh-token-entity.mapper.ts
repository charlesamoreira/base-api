import { RefreshToken } from "../../../../domain/auth/entity/refreshToken";
import { RefreshTokenEntity } from "../../entities/auth/refresh-token.entity";

export class RefreshTokenEntityMapper {
	static letfToRight = (item: RefreshToken): RefreshTokenEntity => {
		const entity = new RefreshTokenEntity();

		entity.id = item.id;
		entity.isRevoked = item.isRevoked;
		entity.expires = item.expires;

		return entity;
	};

	static rightToLeft = (entity: RefreshTokenEntity): RefreshToken => {
		const item = new RefreshToken();

		item.id = entity.id;
		item.isRevoked = entity.isRevoked;
		item.expires = entity.expires;

		return item;
	};
}
