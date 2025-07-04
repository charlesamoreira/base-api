import { User } from "../../../src/domain/user/entity/user";

const user = new User();
user.id = "123";
user.name = "Test user";
user.password = "$2b$10$YBB6WxRNgNo1IcMrNrSPMewLpnzFTDTEPMjYHX9S/7VoOL4K/WfYG";
user.username = "test@test.com";

export const UserMock = user;
