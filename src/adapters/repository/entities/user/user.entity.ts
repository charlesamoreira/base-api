import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class UserEntity {
	@PrimaryGeneratedColumn("uuid")
		id: string;

	@Column({type: "varchar", length: 250})
	public name: string;

	@Column({type: "varchar", length: 100})
	public password: string;

	@Column({type: "varchar", length: 20})
	public status: string;

	@Column({type: "varchar", length: 20})
	public theme: string;

	@Column({type: "varchar", length: 100})
	public username: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
	public created_at: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
	public updated_at: Date;
}
