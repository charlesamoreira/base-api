import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private usersService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECREAT,
			signOptions: {
				expiresIn: process.env.JWT_EXPIRES,
			},
		});
	}

	async validate(token) {
		const user = await this.usersService.findById(token.id);
		delete user.password;

		if (!user) {
			return null;
		}

		return user;
	}
}
