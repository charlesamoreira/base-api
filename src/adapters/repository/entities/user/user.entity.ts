import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class UserEntity {
	@PrimaryGeneratedColumn("uuid")
		id: string;

	@Column()
	public name: string;

	@Column()
	public password: string;

	@Column()
	public status: string;

	@Column()
	public theme: string;

	@Column()
	public username: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
	public created_at: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
	public updated_at: Date;
}
