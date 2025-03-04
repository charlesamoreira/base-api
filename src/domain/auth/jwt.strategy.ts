import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { UserService } from "../user/service/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private usersService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECREAT,
		});
	}

	async validate(token: { id: string }) {
		const user = await this.usersService.getUserById(token.id);

		if (!user) {
			return null;
		}

		delete user.password;
		return user;
	}
}
