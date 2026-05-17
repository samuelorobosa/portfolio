import type { Metadata } from "next";
import WorkList from "../components/WorkList";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A selection of full-stack projects built with React, Next.js, Go, FastAPI, and more.",
};

export default function ProjectsPage() {
  return <WorkList title="All work" />;
}
