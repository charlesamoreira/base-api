import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RefreshToken } from "../../domain/auth/entity/refreshToken";
import { IRefreshTokenRepository } from "../../domain/auth/repository/i-refresh-token.repository";
import { RefreshTokenEntity } from "./entities/auth/refresh-token.entity";
import { RefreshTokenEntityMapper } from "./mappers/auth/refresh-token-entity.mapper";

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
	constructor(
		@InjectRepository(RefreshTokenEntity)
		private refreshTokenRepository: Repository<RefreshTokenEntity>,
	) {}

	async createRefreshToken(data: RefreshToken): Promise<RefreshToken> {
		await this.refreshTokenRepository.upsert(RefreshTokenEntityMapper.letfToRight(data), ["id"]);
		return data;
	}

	async findTokenById(id: string): Promise<RefreshToken> {
		const token = await this.refreshTokenRepository.findOne({
			where: {
				id,
			},
		});
		return token ? RefreshTokenEntityMapper.rightToLeft(token) : null;
	}
}
