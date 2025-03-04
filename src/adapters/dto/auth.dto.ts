class TokenDto {
	accessToken: string;
	refreshToken: string;
	type: string;
}

class User {
	id: string;
	name: string;
	username: string;
}

export class AuthRequestDto {
	username: string;
	password: string;
}

export class AuthResponseDto {
	user: User;
	token: TokenDto;
}
