import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../domain/auth/jwt-auth.guard";
import { UserService } from "../../domain/user/service/user.service";
import { ApiPaginatedResponse } from "../../common/decorators";
import { UserDto } from "../dto/user/user.dto";
import { Page, PageOptions } from "../../common/dtos";

@UseGuards(JwtAuthGuard)
@Controller("user/v1")
export class UsersController {
	constructor(private usersService: UserService) {}

	@Delete(":id")
	deleteUser(@Param("id") id: string) {
		return this.usersService.removeUser(id);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiPaginatedResponse(UserDto)
	async getUsers(
	  @Query() pageOptionsDto: PageOptions,
	): Promise<Page<UserDto>> {
	  return this.usersService.getUsers({}, pageOptionsDto);
	}
}
