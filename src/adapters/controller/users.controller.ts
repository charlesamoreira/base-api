import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../domain/auth/jwt-auth.guard";

@Controller("users")
export class UsersController {
	@UseGuards(JwtAuthGuard)
	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
