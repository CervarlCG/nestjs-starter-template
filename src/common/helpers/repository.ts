import { IsNull } from "typeorm";

export function getDeletedAtWhereClausule( allowDeleted: boolean = false ) {
  return !allowDeleted ? { deletedAt: IsNull() } : {};
}