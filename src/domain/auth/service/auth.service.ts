import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "./token.service";
import { UserService } from "../../user/service/user.service";
import { User } from "../../user/entity/user";
import { compare, hash } from "bcrypt";
import { AuthRequestDto } from "../../../adapters/dto/auth.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { randomBytes } from "crypto";
import { IResetTokenRepository } from "../repository/i-reset-token.repository";

const expiresIn = 60 * 60 * 24 * 30;
@Injectable()
export class AuthService {
	constructor(
		private tokenService: TokenService,
		private readonly mailService: MailerService,
		private usersService: UserService,
		@Inject("ResetTokenRepository")
		private readonly resetTokenRepository: IResetTokenRepository,
	) {}

	async login(data: AuthRequestDto) {
		const user = await this.usersService.getUsers({ username: data.username }, { take: 1, skip: 0 });
		if (user.meta.itemCount === 1 && (await compare(data.password, user[0].password))) {
			delete user[0].password;
			const token = await this.tokenService.generateAccessToken(user[0]);
			const refresh = await this.tokenService.generateRefreshToken(user[0], expiresIn);

			return {
				user: user[0],
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
		const refresh = await this.tokenService.generateRefreshToken(user, expiresIn);

		if (process.env.MAILER_ADMIN) {
			this.mailService.sendMail({
				to: process.env.MAILER_ADMIN,
				subject: "New user registred",
				template: "./support",
				context: {
					message: `New User: ${user.name} - ${user.username}`,
				},
			});
		}

		return {
			user,
			token,
			refresh,
		};
	}

	async refresh(data: any) {
		const { user, token } = await this.tokenService.createAccessTokenFromRefreshToken(data.refreshToken);
		delete user.password;

		return {
			user,
			token,
			refresh: undefined,
		};
	}

	async requestReset(data: User) {
		const users = await this.usersService.getUsers(data,{take: 1, skip: 0});
		if (users.meta.itemCount !== 1) {
			throw new UnauthorizedException("The login is invalid");
		}

		const token = randomBytes(32).toString("hex");

		const expiration = new Date();
		expiration.setTime(expiration.getTime() + expiresIn);

		const resetToken = await this.resetTokenRepository.createResetToken({ expires: expiration, token: await hash(token, 10), userId: users[0].id });

		await this.mailService.sendMail({
			to: users[0].username,
			subject: "MilhasWallet - Reset de senha",
			template: "./resetPassword",
			context: {
				id: resetToken.id,
				name: users[0].name,
				token,
			},
		});
	}

	async reset(data: any) {
		const resetToken = await this.resetTokenRepository.findTokenById(data.id);

		if (resetToken.expires < new Date()) {
			throw new UnauthorizedException("Invalid or expired password reset token");
		}

		const isValid = await compare(data.token, resetToken.token);
		if (!isValid) {
			throw new UnauthorizedException("Invalid or expired password reset token");
		}

		const user = await this.usersService.getUserById(resetToken.userId);

		user.password = await hash(data.password, 10);
		await this.usersService.updateUser(user);

		this.mailService.sendMail({
			to: user.username,
			subject: "MilhasWallet - Senha alterada com sucesso",
			template: "./resetPasswordSuccessfuly",
			context: {
				id: resetToken.id,
				name: user.name,
			},
		});
	}
}
