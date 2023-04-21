import { RefreshToken } from "../entity/refreshToken";

export interface IRefreshTokenRepository {
	createRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken>;
	findTokenById(id: string): Promise<RefreshToken | null>;
}
