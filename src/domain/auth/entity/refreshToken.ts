export class RefreshToken {
	constructor(public id: string) {}

	public userId: string;
	public isRevoked: boolean;
	public expires: Date;
}
