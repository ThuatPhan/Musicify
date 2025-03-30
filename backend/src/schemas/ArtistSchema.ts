import { z } from "zod";

export const SexEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const artistSchema = z.object({
  name: z.string().min(5, "Name must be as least 5 characters"),
  dateOfBirth: z.coerce.date(),
  sex: SexEnum,
});
export type Artist = z.infer<typeof artistSchema>;
