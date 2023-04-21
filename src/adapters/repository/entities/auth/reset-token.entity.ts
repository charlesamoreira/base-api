import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("reset-token")
export class ResetTokenEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	public token: string;

	@Column()
	public userId: string;

	@CreateDateColumn({ type: "timestamp" })
	public expires: Date;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
	public created_at: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
	public updated_at: Date;
}
