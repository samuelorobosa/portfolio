import type { Metadata } from "next";
import { getListeningProfiles } from "../lib/spotify";
import MusicProfile from "../components/MusicProfile";
import NowPlaying from "../components/NowPlaying";
import SectionLabel from "../components/SectionLabel";

export const metadata: Metadata = {
  title: "Music",
  description:
    "What Samuel Amagbakhen is listening to: now playing, top artists, top tracks, and genres from Spotify.",
};

export const revalidate = 3600;

export default async function MusicPage() {
  const profiles = await getListeningProfiles();

  return (
    <>
      <NowPlaying />
      {profiles ? (
        <MusicProfile profiles={profiles} />
      ) : (
        <section className="px-4 sm:px-8 md:px-[52px] py-10 sm:py-12 md:py-[52px] border-b border-faint">
          <SectionLabel>On repeat</SectionLabel>
          <p className="text-[18px] font-light leading-[1.72] text-mid max-w-[520px]">
            My listening stats are taking a break. Check back soon.
          </p>
        </section>
      )}
    </>
  );
}
