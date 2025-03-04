import { Controller, Request, Post, Body } from "@nestjs/common";

import { plainToClass } from "class-transformer";
import { AuthService } from "../../domain/auth/service/auth.service";
import { User } from "../../domain/user/entity/user";
import { AuthRequestDto, AuthResponseDto } from "../dto/auth.dto";

@Controller("auth/v1")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("login")
	async login(@Body() data: AuthRequestDto): Promise<AuthResponseDto> {
		const payload = await this.authService.login(data);

		return this.buildResponse(payload);
	}

	@Post("register")
	async register(@Body() data: AuthRequestDto): Promise<AuthResponseDto> {
		const payload = await this.authService.register(plainToClass(User, data));

		return this.buildResponse(payload);
	}

	@Post("refresh")
	public async refresh(@Request() req): Promise<AuthResponseDto> {
		const payload = await this.authService.refresh(req.body);

		return this.buildResponse(payload);
	}

	@Post("reset")
	async reset(@Body() data): Promise<void> {
		await this.authService.reset(data);
	}

	@Post("requestReset")
	async requestReset(@Body() data: AuthRequestDto): Promise<void> {
		await this.authService.requestReset(plainToClass(User, data));
	}

	buildResponse = (payload): AuthResponseDto => {
		return {
			user: payload.user,
			token: {
				type: "bearer",
				accessToken: payload.token,
				refreshToken: payload.refresh,
			},
		};
	};
}
