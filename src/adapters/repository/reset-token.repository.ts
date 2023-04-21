import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ResetToken } from "../../domain/auth/entity/resetToken";
import { IResetTokenRepository } from "../../domain/auth/repository/i-reset-token.repository";
import { ResetTokenEntity } from "./entities/auth/reset-token.entity";
import { ResetTokenEntityMapper } from "./mappers/auth/reset-token-entity.mapper";

@Injectable()
export class ResetTokenRepository implements IResetTokenRepository {
	constructor(
		@InjectRepository(ResetTokenEntity)
		private resetTokenRepository: Repository<ResetTokenEntity>,
	) {}

	async createResetToken(data: ResetToken): Promise<ResetToken> {
		const token = await this.resetTokenRepository.upsert(ResetTokenEntityMapper.letfToRight(data), ["userId"]);
		data.id = token.identifiers[0].id;
		return data;
	}

	async findTokenById(id: string): Promise<ResetToken> {
		const token = await this.resetTokenRepository.findOne({
			where: {
				id,
			},
		});
		return token ? ResetTokenEntityMapper.rightToLeft(token) : null;
	}
}
