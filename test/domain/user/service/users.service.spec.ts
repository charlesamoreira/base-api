import { Test, TestingModule } from "@nestjs/testing";
import { expect } from "chai";
import { UsersService } from "../../../../src/domain/users/users.service";
import { UserMock } from "../../../mock/user";

describe("UsersService", () => {
	let service: UsersService;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: "UsersRepository",
					useValue: {
						findByUsername: () => [UserMock],
					},
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	after(async () => {
		await module.close();
	});

	it("should findOne", async () => {
		const user = await service.findByUsername("test@test.com");
		expect(user.id).to.equal("123");
	});
});
