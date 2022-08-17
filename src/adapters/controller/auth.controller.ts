import { Controller, Request, Post } from "@nestjs/common";
import { AuthService } from "../../domain/auth/service/auth.service";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("login")
	async login(@Request() req) {
		const payload = await this.authService.login(req.body);

		return this.buildResponse(payload);
	}

	@Post("register")
	async register(@Request() req) {
		const payload = await this.authService.register(req.body);

		return this.buildResponse(payload);
	}

	@Post("/refresh")
	public async refresh(@Request() req) {
		const payload = await this.authService.refresh(req.body);

		return this.buildResponse(payload);
	}

	buildResponse = (payload) => {
		return {
			user: payload.user,
			token: {
				type: "bearer",
				access_token: payload.token,
				...(payload.refresh ? { refresh_token: payload.refresh } : {}),
			},
		};
	};
}
