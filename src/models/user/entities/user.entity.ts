import { BaseEntity } from "src/common/database/base-entity";
import { Column, Entity } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({type: 'varchar', nullable: true})
  refreshToken: string | null;
}