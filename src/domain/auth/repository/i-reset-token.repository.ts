import { ResetToken } from "../entity/resetToken";

export interface IResetTokenRepository {
	createResetToken(resetToken: ResetToken): Promise<ResetToken>;
	findTokenById(token: string): Promise<ResetToken | null>;
}
