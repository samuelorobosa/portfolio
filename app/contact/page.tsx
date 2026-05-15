import type { Metadata } from "next";
import Contact from "../components/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Open to full-time roles, freelance contracts, and interesting problems. Get in touch with Samuel Amagbakhen.",
};

export default function ContactPage() {
  return <Contact />;
}
