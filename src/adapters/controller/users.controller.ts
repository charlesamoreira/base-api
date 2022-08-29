import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../domain/auth/jwt-auth.guard";

@ApiBearerAuth()
@ApiTags("profile")
@Controller("users/v1")
export class UsersController {
	@UseGuards(JwtAuthGuard)
	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
