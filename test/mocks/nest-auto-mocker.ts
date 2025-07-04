import { MockFactory } from "@nestjs/testing";
import Sinon from "sinon";
import { UserService } from "../../src/domain/user/service/user.service";

export const nestAutoMocker: MockFactory = (token?) => {
	switch (token) {
		case UserService:
			return Sinon.createStubInstance(UserService);
	}

	throw new Error("AutoMocker: Undefined Token: " + token?.toString());
};
