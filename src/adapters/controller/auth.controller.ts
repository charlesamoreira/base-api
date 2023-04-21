import { Controller, Request, Post, Body } from "@nestjs/common";
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { AuthService } from "../../domain/auth/service/auth.service";
import { User } from "../../domain/user/entity/user";
import { AuthRequestDto, AuthResponseDto } from "../dto/auth.dto";
import { ErrorDto } from "../dto/error.dto";

@ApiTags("auth")
@Controller("auth/v1")
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({summary: "Authenticate a user"})
	@Post("login")
	@ApiOkResponse({
		description: "The authentication has been succesfully",
		type: AuthResponseDto,
	})
	@ApiBadRequestResponse({ description: "Bad Request", type: ErrorDto })
	@ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorDto })
	@ApiForbiddenResponse({ description: "Forbidden", type: ErrorDto })
	@ApiInternalServerErrorResponse({ description: "Unexpected error", type: ErrorDto })
	async login(@Body() data: AuthRequestDto): Promise<AuthResponseDto> {
		const payload = await this.authService.login(data);

		return this.buildResponse(payload);
	}

	@ApiOperation({summary: "Create and authenticate a user"})
	@ApiOkResponse({
		description: "The user has been succesfully created",
		type: AuthResponseDto,
	})
	@ApiBadRequestResponse({ description: "Bad Request", type: ErrorDto })
	@ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorDto })
	@ApiForbiddenResponse({ description: "Forbidden", type: ErrorDto })
	@ApiInternalServerErrorResponse({ description: "Unexpected error", type: ErrorDto })
	@Post("register")
	async register(@Body() data: AuthRequestDto): Promise<AuthResponseDto> {
		const payload = await this.authService.register(plainToClass(User, data));

		return this.buildResponse(payload);
	}

	@ApiOperation({summary: "Refresh a token"})
	@ApiOkResponse({
		description: "The authentication has been succesfully",
		type: AuthResponseDto,
	})
	@ApiBadRequestResponse({ description: "Bad Request", type: ErrorDto })
	@ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorDto })
	@ApiForbiddenResponse({ description: "Forbidden", type: ErrorDto })
	@ApiInternalServerErrorResponse({ description: "Unexpected error", type: ErrorDto })
	@Post("/refresh")
	public async refresh(@Request() req): Promise<AuthResponseDto> {
		const payload = await this.authService.refresh(req.body);

		return this.buildResponse(payload);
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
