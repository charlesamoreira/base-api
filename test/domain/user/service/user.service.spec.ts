import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import { UserService } from "../../../../src/domain/user/service/user.service";
import { UserMock } from "../../../mocks/fakes/user";

describe("UsersService", () => {
	let service: UserService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: "UserRepository",
					useValue: {
						getUsers: () => [UserMock],
					},
				},
			],
		}).compile();

		service = module.get<UserService>(UserService);
	});

	after(async () => {
		await module.close();
	});

	it("should findOne", async () => {
		const user = await service.getUsers({ username: "teste@123.com" });
		expect(user[0].id).to.equal("123");
	});
});
