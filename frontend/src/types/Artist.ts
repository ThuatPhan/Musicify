import { Sex } from "@src/types/Enums";

export type Artist = {
  id: string;
  name: string;
  dateOfBirth: string;
  avatar: string;
  sex: Sex;
};
