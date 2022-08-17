import { Injectable } from "@nestjs/common";
import { FirestoreService } from "@nhogs/nestjs-firebase";
import { RefreshToken } from "../../domain/auth/entity/refreshToken";
import { RefreshTokenRepository } from "../../domain/auth/repository/refreshToken.repository";

@Injectable()
export class RefreshTokenFirebaseRepository implements RefreshTokenRepository {
	constructor(private readonly firestoreService: FirestoreService) {}

	converter = {
		toFirestore: (refreshToken: RefreshToken) => {
			return {
				id: refreshToken.id,
				isRevoked: refreshToken.isRevoked,
				expires: refreshToken.expires,
				userId: refreshToken.userId,
			};
		},
		fromFirestore: (snapshot, options) => {
			const data = snapshot.data(options);
			const refreshToken = new RefreshToken(snapshot.id);
			refreshToken.isRevoked = data.isRevoked;
			refreshToken.expires = data.expires;
			refreshToken.userId = data.userId;
			return refreshToken;
		},
	};

	async createRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken> {
		const collection = this.firestoreService
			.collection("refreshTokens")
			.withConverter<RefreshToken>(this.converter);

		const doc = await this.firestoreService.addDoc<RefreshToken>(
			collection,
			refreshToken,
		);

		const snapshot = await this.firestoreService.getDoc(doc);
		return snapshot.data();
	}

	async findTokenById(id: string): Promise<RefreshToken> {
		const doc = this.firestoreService
			.doc("refreshTokens", id)
			.withConverter<RefreshToken>(this.converter);

		const snapshot = await this.firestoreService.getDoc(doc);
		return snapshot.data();
	}
}
