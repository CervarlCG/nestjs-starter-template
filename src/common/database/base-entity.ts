import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column({
    type: "timestamp",
    onUpdate: "CURRENT_TIMESTAMP",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column({
    type: "timestamp",
    nullable: true
  })
  deletedAt: Date
}