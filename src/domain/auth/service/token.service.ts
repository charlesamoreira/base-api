import { Inject, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RefreshToken } from "../entity/refreshToken";
import { IRefreshTokenRepository } from "../repository/i-refresh-token.repository";
import { User } from "../../user/entity/user";
import { TokenExpiredError } from "jsonwebtoken";
import { UserService } from "../../user/service/user.service";

export interface RefreshTokenPayload {
	jti: string;
	sub: string;
}

@Injectable()
export class TokenService {
	constructor(
		@Inject("RefreshTokenRepository")
		private readonly refreshTokenRepository: IRefreshTokenRepository,
		private jwtService: JwtService,
		private usersService: UserService,
	) {}

	public async generateAccessToken(user: User): Promise<string> {
		const payload = { ...user };
		return this.jwtService.sign(payload, {
			secret: process.env.JWT_SECREAT,
			subject: user.id,
		});
	}

	public async generateRefreshToken(user: User, expiresIn: number): Promise<string> {
		const refreshToken = new RefreshToken();

		refreshToken.id = user.id;
		refreshToken.isRevoked = false;

		const expiration = new Date();
		expiration.setTime(expiration.getTime() + expiresIn);

		refreshToken.expires = expiration;

		const token = await this.refreshTokenRepository.createRefreshToken(refreshToken);

		const payload = { ...user };
		return this.jwtService.sign(payload, {
			secret: process.env.JWT_SECREAT,
			expiresIn,
			subject: user.id,
			jwtid: token.id,
		});
	}

	public async resolveRefreshToken(encoded: string): Promise<{ user: User; token: RefreshToken }> {
		const payload = await this.decodeRefreshToken(encoded);
		const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

		if (!token) {
			throw new UnprocessableEntityException("Refresh token not found");
		}

		if (token.isRevoked) {
			throw new UnprocessableEntityException("Refresh token revoked");
		}

		const user = await this.getUserFromRefreshTokenPayload(payload);

		if (!user) {
			throw new UnprocessableEntityException("Refresh token malformed");
		}

		return { user, token };
	}

	public async createAccessTokenFromRefreshToken(refresh: string): Promise<{ token: string; user: User }> {
		const { user } = await this.resolveRefreshToken(refresh);

		const token = await this.generateAccessToken(user);

		return { user, token };
	}

	private async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
		try {
			return this.jwtService.verify(token);
		} catch (e) {
			if (e instanceof TokenExpiredError) {
				throw new UnprocessableEntityException("Refresh token expired");
			} else {
				throw new UnprocessableEntityException("Refresh token malformed");
			}
		}
	}

	private async getUserFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<User> {
		const subId = payload.sub;

		if (!subId) {
			throw new UnprocessableEntityException("Refresh token malformed");
		}

		const user = await this.usersService.getUserById(subId);

		if (!user) {
			throw new UnprocessableEntityException("Refresh token malformed");
		}

		return user;
	}

	private async getStoredTokenFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<RefreshToken | null> {
		const tokenId = payload.jti;

		if (!tokenId) {
			throw new UnprocessableEntityException("Refresh token malformed");
		}

		return this.refreshTokenRepository.findTokenById(tokenId);
	}
}
