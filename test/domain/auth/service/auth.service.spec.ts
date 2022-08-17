import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import { AuthService } from "../../../../src/domain/auth/service/auth.service";
import { TokenService } from "../../../../src/domain/auth/service/token.service";
import { UsersService } from "../../../../src/domain/users/users.service";
import { UserMock } from "../../../mock/user";

const TokenMock = { ìd: 123 };

describe("AuthService", () => {
	let service: AuthService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ envFilePath: ".test.env", isGlobal: true }),
				JwtModule.register({
					secret: process.env.JWT_SECREAT,
					signOptions: { expiresIn: process.env.JWT_EXPIRES },
				}),
			],
			providers: [
				AuthService,
				JwtService,
				UsersService,
				TokenService,
				{
					provide: "UsersRepository",
					useValue: {
						findByUsername: () => [UserMock],
					},
				},
				{
					provide: "RefreshTokenRepository",
					useValue: {
						createRefreshToken: () => TokenMock,
					},
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	after(async () => {
		await module.close();
	});

	it("should be login", async () => {
		const token = await service.login({
			username: "test@test.com",
			password: "123",
		});
		expect(token.token).to.be.an("string");
	});
});
