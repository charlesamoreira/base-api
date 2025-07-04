import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("refresh-token")
export class RefreshTokenEntity {
	@PrimaryGeneratedColumn("uuid")
		id: string;

	@Column({type: "boolean"})
	public isRevoked: boolean;

	@CreateDateColumn({ type: "timestamp" })
	public expires: Date;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
	public created_at: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
	public updated_at: Date;
}
