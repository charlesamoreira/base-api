import { Status } from "../../../common/constants";

export class UserDto {
	public id: string;
	public name: string;
	public password: string;
	public status: Status;
}
