import { RefreshToken } from "../entity/refreshToken";

export interface RefreshTokenRepository {
	createRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken>;
	findTokenById(id: string): Promise<RefreshToken | null>;
}
