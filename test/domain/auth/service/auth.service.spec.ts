import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import { AuthService } from "../../../../src/domain/auth/service/auth.service";
import { TokenService } from "../../../../src/domain/auth/service/token.service";
import { UserService } from "../../../../src/domain/user/service/user.service";
import { UserMock } from "../../../mocks/fakes/user";
import Sinon from "sinon";
import { nestAutoMocker } from "../../../mocks/nest-auto-mocker";

const TokenMock = { ìd: 123 };

describe("AuthService", () => {
	let service: AuthService;
	let module: TestingModule;
	let userService: Sinon.SinonStubbedInstance<UserService>;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [ConfigModule.forRoot({ envFilePath: ".test.env", isGlobal: true }), JwtModule.register({ secret: process.env.JWT_SECREAT, signOptions: { expiresIn: process.env.JWT_EXPIRES } })],
			providers: [
				AuthService,
				JwtService,
				TokenService,
				UserService,
				{ provide: "RefreshTokenRepository", useValue: { createRefreshToken: () => TokenMock } },
				{ provide: "ResetTokenRepository", useValue: { createResetToken: () => TokenMock } },
				{
					provide: "UserRepository",
					useValue: {
						getUsers: () => [UserMock],
					},
				},
			],
		})
			.useMocker(nestAutoMocker)
			.compile();

		service = module.get<AuthService>(AuthService);
		userService = module.get(UserService);
	});

	after(async () => {
		await module.close();
	});

	it("should be login", async () => {
		Sinon.stub(userService, "getUsers").resolves([UserMock]);
		const token = await service.login({ username: "test@test.com", password: "123" });
		expect(token.token).to.be.an("string");
	});
});
