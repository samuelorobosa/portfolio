interface EqualiserProps {
  className?: string;
}

export default function Equaliser({ className = "h-[10px]" }: EqualiserProps) {
  return (
    <span className={`flex items-end gap-[2px] ${className}`} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="eq-bar w-[2px] h-full bg-green origin-bottom"
          style={{ animationDelay: `${i * -0.35}s` }}
        />
      ))}
    </span>
  );
}
