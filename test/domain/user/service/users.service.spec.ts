import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import { UserService } from "../../../../src/domain/user/service/user.service";
import { UserMock } from "../../../mock/user";

describe("UsersService", () => {
	let service: UserService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: "UsersRepository",
					useValue: {
						findByUsername: () => [UserMock],
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
		const user = await service.findByUsername("test@test.com");
		expect(user.id).to.equal("123");
	});
});
