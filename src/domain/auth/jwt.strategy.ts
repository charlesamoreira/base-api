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
			signOptions: {
				expiresIn: process.env.JWT_EXPIRES,
			},
		});
	}

	async validate(token) {
		const users = await this.usersService.getUsers({ id: token.id });

		if (users.length === 0) {
			return null;
		}

		delete users[0].password;
		return users;
	}
}
