import { Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "./token.service";
import { UsersService } from "../../users/users.service";
import { User } from "../../users/entity/user";
import { compare } from "bcrypt";

@Injectable()
export class AuthService {
	constructor(
		private tokenService: TokenService,
		private usersService: UsersService,
	) {}

	async login(data: any) {
		const user = await this.usersService.findByUsername(data.username);
		if (user && (await compare(data.password, user.password))) {
			delete user.password;
			const token = await this.tokenService.generateAccessToken(user);
			const refresh = await this.tokenService.generateRefreshToken(
				user,
				60 * 60 * 24 * 30,
			);

			return {
				user,
				token,
				refresh,
			};
		}
		throw new UnauthorizedException("The login is invalid");
	}

	async register(data: User) {
		const user = await this.usersService.create(data);
		delete user.password;

		const token = await this.tokenService.generateAccessToken(user);
		const refresh = await this.tokenService.generateRefreshToken(
			user,
			60 * 60 * 24 * 30,
		);

		return {
			user,
			token,
			refresh,
		};
	}

	async refresh(data: any) {
		const { user, token } =
			await this.tokenService.createAccessTokenFromRefreshToken(
				data.refresh_token,
			);
		delete user.password;

		return {
			user,
			token,
			refresh: undefined,
		};
	}
}
