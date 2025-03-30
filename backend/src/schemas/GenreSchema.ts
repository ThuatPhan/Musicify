import { z } from "zod";

const genreSchema = z.object({
  name: z.string().min(5, "Name must be as least 5 characters"),
});

export default genreSchema;
export type Genre = z.infer<typeof genreSchema>;