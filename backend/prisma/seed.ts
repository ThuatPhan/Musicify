import { PrismaClient, Sex } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const genres = [
    "Pop",
    "Rock",
    "Rap",
    "Hip-Hop",
    "Jazz",
    "Classical",
    "Electronic",
    "Reggae",
    "Blues",
    "Country",
    "R&B",
  ];
  const genreRecords = await Promise.all(
    genres.map(
      async (genre) =>
        await prisma.genre.upsert({
          where: { name: genre },
          update: {},
          create: { name: genre },
        })
    )
  );
  const artists = [
    {
      name: "Dalab",
      avatar:
        "https://res.cloudinary.com/dmz26yafu/image/upload/v1742101416/Uploads/1742101412165-c0d3dd27-8ab2-429a-a2a4-a17d9cde005a.jpg",
      dateOfBirth: new Date("2007-02-17"),
      sex: Sex.MALE,
    },
    {
      name: "Obito",
      avatar:
        "https://res.cloudinary.com/dmz26yafu/image/upload/v1742101356/Uploads/1742101354629-1374437d-2b99-483a-a349-3ebe4aeca86d.jpg",
      dateOfBirth: new Date("2001-09-20"),
      sex: Sex.MALE,
    },
    {
      name: "Orange",
      avatar:
        "https://res.cloudinary.com/dmz26yafu/image/upload/v1742185036/Uploads/1742185027385-96906afb-2d0d-4a86-b07d-b21a2092e908.webp",
      dateOfBirth: new Date("1997-02-17"),
      sex: Sex.FEMALE,
    },
    {
      name: "Hoàng Dũng",
      avatar:
        "https://res.cloudinary.com/dmz26yafu/image/upload/v1742192477/Uploads/1742192467120-c174f3c6-1304-4497-9a3b-6d0a9a89e4d7.jpg",
      dateOfBirth: new Date("1995-11-04"),
      sex: Sex.MALE,
    },
  ];
  const artistRecords = await Promise.all(
    artists.map(async (artist) =>
      prisma.artist.upsert({
        where: { name: artist.name },
        update: {},
        create: artist,
      })
    )
  );
  const songs = [
    {
      name: "Bầu trời mới",
      sourceUrl:
        "https://res.cloudinary.com/dmz26yafu/video/upload/v1742100865/Uploads/1742100860236-d051aab6-0fc4-455e-b4e7-330590fe7d21.mp3",
      coverImageUrl:
        "https://res.cloudinary.com/dmz26yafu/image/upload/v1742102226/Uploads/1742102223965-0465e34d-f4dc-4022-af0c-dd6c1d581515.jpg",
      lyricUrl:
        "https://res.cloudinary.com/dmz26yafu/raw/upload/v1742205527/Uploads/1742205520659-b7b4027b-3bf4-4096-8625-d9e462f5633f",
      duration: 262,
      releaseDate: new Date("2017-01-06"),
      genreId: genreRecords[0].id, // Pop
      artistId: artistRecords[0].id, // Dalab
    },
    {
      name: "Thức giấc",
      sourceUrl:
        "https://res.cloudinary.com/dmz26yafu/video/upload/v1742100660/Uploads/1742100656267-4d3b7075-ac1a-4f9c-ba7b-f660e6592610.mp3",
      coverImageUrl:
        "https://res.cloudinary.com/dmz26yafu/image/upload/v1742102265/Uploads/1742102263386-d61c40af-f0a9-40d5-9148-528bf7b81c2e.jpg",
      lyricUrl:
        "https://res.cloudinary.com/dmz26yafu/raw/upload/v1742205576/Uploads/1742205567898-a5dd1e1c-af15-4a09-810e-0ead7096b1fc",
      duration: 269,
      releaseDate: new Date("2017-01-06"),
      genreId: genreRecords[0].id, // Pop
      artistId: artistRecords[0].id, // Dalab
    },
    {
      name: "Em hát ai nghe",
      sourceUrl:
        "https://res.cloudinary.com/dmz26yafu/video/upload/v1742192228/Uploads/1742192207559-7b0e81ea-b8ec-4ac2-8421-c894ad2bf568.mp3",
      coverImageUrl:
        "https://res.cloudinary.com/dmz26yafu/image/upload/v1742192301/Uploads/1742192291927-a1bff717-c30c-4971-9c9f-af18eaec08b7.jpg",
      lyricUrl:
        "https://res.cloudinary.com/dmz26yafu/raw/upload/v1742205613/Uploads/1742205607700-2937ad82-ab5f-46ef-9801-5822c55619ac",
      duration: 279,
      releaseDate: new Date("2017-01-06"),
      genreId: genreRecords[0].id, // Pop
      artistId: artistRecords[2].id, // Orange
    },
    {
      name: "Nàng thơ",
      sourceUrl:
        "https://res.cloudinary.com/dmz26yafu/video/upload/v1742192401/Uploads/1742192375451-f8c88464-1022-456c-b6da-25d15e93f10c.mp3",
      coverImageUrl:
        "https://res.cloudinary.com/dmz26yafu/image/upload/v1742192364/Uploads/1742192353765-c2da6709-7a7b-4887-bac6-1e9e4a095c50.jpg",
      lyricUrl:
        "https://res.cloudinary.com/dmz26yafu/raw/upload/v1742205654/Uploads/1742205649002-4645d83d-5087-4b2a-b0a1-72d2c0795694",
      duration: 254,
      releaseDate: new Date("2017-01-06"),
      genreId: genreRecords[0].id, // Pop
      artistId: artistRecords[3].id, // Hoàng Dũng
    },
  ];

  await Promise.all(
    songs.map((song) =>
      prisma.song.upsert({
        where: { name: song.name },
        update: {},
        create: song,
      })
    )
  );

  console.log("Data seeded successfully ✅");
}

main()
  .catch((e) => {
    console.log("Failed when seeding data ❌: ", e);
  })
  .finally(async () => {
    prisma.$disconnect();
  });
