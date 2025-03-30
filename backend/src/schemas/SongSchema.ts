import { z } from "zod";

const songSchema = z.object({
  name: z.string().min(5, "Song name must be as least 5 characters"),
  genreId: z.string().uuid(),
  artistId: z.string().uuid(),
});

export default songSchema;
export type Song = z.infer<typeof songSchema>;
