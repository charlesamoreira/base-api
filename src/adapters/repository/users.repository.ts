import { Injectable } from "@nestjs/common";
import { FirestoreService } from "@nhogs/nestjs-firebase";
import { User } from "../../domain/users/entity/user";
import { UsersRepository } from "../../domain/users/repository/users.repository";

@Injectable()
export class UsersFirebaseRepository implements UsersRepository {
	constructor(private readonly firestoreService: FirestoreService) {}

	converter = {
		toFirestore: (user: User) => {
			return {
				name: user.name,
				username: user.username,
				password: user.password,
			};
		},
		fromFirestore: (snapshot, options) => {
			const data = snapshot.data(options);
			const user = new User(snapshot.id);
			user.name = data.name;
			user.username = data.username;
			user.password = data.password;
			return user;
		},
	};

	async create(user: User): Promise<User> {
		const collection = this.firestoreService
			.collection("users")
			.withConverter<User>(this.converter);

		const doc = await this.firestoreService.addDoc<User>(collection, user);

		const snapshot = await this.firestoreService.getDoc(doc);
		return snapshot.data();
	}

	async findById(id: string): Promise<User> {
		const doc = this.firestoreService
			.doc("users", id)
			.withConverter<User>(this.converter);

		const snapshot = await this.firestoreService.getDoc(doc);
		return snapshot.data();
	}

	async findByUsername(username: string): Promise<User[]> {
		const collection = this.firestoreService
			.collection("users")
			.withConverter<User>(this.converter);

		const q = this.firestoreService.query(
			collection,
			this.firestoreService.where("username", "==", username),
		);

		const querySnapshot = await this.firestoreService.getDocs(q);
		return querySnapshot.docs.map((doc) => doc.data());
	}

	async update(user: User): Promise<void> {
		const doc = this.firestoreService
			.doc("users", user.id)
			.withConverter<User>(this.converter);

		await this.firestoreService.updateDoc<User>(doc, user);
	}
}
