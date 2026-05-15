interface SectionLabelProps {
  children: React.ReactNode;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-[10px] text-[10px] font-bold tracking-[0.12em] uppercase text-muted mb-9">
      <span className="text-green text-2xl leading-none relative top-[5px]">·</span>
      {children}
    </div>
  );
}
