import { SectionBullet } from "./icons";

interface SectionLabelProps {
  children: React.ReactNode;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-[10px] text-[10px] font-bold tracking-[0.12em] uppercase text-muted mb-9">
      <SectionBullet />
      {children}
    </div>
  );
}
