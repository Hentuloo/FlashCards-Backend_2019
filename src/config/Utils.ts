import { UserSchema, UserSchemaType } from "models/user";

export const typeUniqueByTitle = (
  types: UserSchema["types"],
  title: string
): boolean => types.some(type => type.title === title);

export const getTypeById = (
  types: UserSchema["types"],
  id: any
): UserSchemaType | undefined => types.find(type => type.id == id);
