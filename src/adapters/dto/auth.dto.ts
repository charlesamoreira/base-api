import { ApiProperty } from "@nestjs/swagger";

class TokenDto {
	@ApiProperty()
		accessToken: string;

	@ApiProperty()
		refreshToken: string;

	@ApiProperty()
		type: string;
}

class User {
	@ApiProperty()
		id: string;

	@ApiProperty()
		name: string;

	@ApiProperty()
		username: string;
}

export class AuthRequestDto {
	@ApiProperty()
		username: string;

	@ApiProperty()
		password: string;
}

export class AuthResponseDto {
	@ApiProperty({ type: () => User })
		user: User;

	@ApiProperty()
		token: TokenDto;
}
