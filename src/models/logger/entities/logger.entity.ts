import { BaseEntity } from "src/common/database/base-entity";
import { Column, Entity } from "typeorm";
import { LogLevel } from "../types";

@Entity("logs")
export class Log extends BaseEntity {
  @Column()
  requestId: string

  @Column()
  message: string;

  @Column({
    enum: LogLevel
  })
  level: string;

  @Column()
  trace: string;
}