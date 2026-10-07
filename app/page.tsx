import Hero from "./components/Hero";
import StackBar from "./components/StackBar";
import About from "./components/About";
import WorkList from "./components/WorkList";
import NowPlayingStrip from "./components/NowPlayingStrip";

export default function Home() {
  return (
    <>
      <Hero />
      <StackBar />
      <WorkList limit={3} title="Featured work" />
      <About />
      <NowPlayingStrip />
    </>
  );
}
