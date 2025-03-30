-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "sex" "Sex" NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "coverImageUrl" TEXT NOT NULL,
    "lyricUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genreId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "artists_name_key" ON "artists"("name");

-- CreateIndex
CREATE UNIQUE INDEX "songs_name_key" ON "songs"("name");

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
