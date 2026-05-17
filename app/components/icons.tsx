import {
  ArrowLeft,
  ArrowRight,
  Circle,
  ExternalLink,
  type LucideProps,
} from "lucide-react";

type IconProps = Pick<LucideProps, "className" | "size">;

export function SectionBullet({
  className = "text-green shrink-0",
  size = 6,
}: IconProps) {
  return (
    <Circle className={`fill-current ${className}`} size={size} strokeWidth={0} aria-hidden />
  );
}

export function MetaSeparator({
  className = "text-faint shrink-0",
  size = 3,
}: IconProps) {
  return (
    <Circle className={`fill-current ${className}`} size={size} strokeWidth={0} aria-hidden />
  );
}

export function LinkExternal({
  className = "text-green shrink-0",
  size = 11,
}: IconProps) {
  return <ExternalLink className={className} size={size} aria-hidden />;
}

export function ArrowForward({
  className = "text-green shrink-0",
  size = 14,
}: IconProps) {
  return <ArrowRight className={className} size={size} aria-hidden />;
}

export function ArrowBack({ className = "shrink-0", size = 14 }: IconProps) {
  return <ArrowLeft className={className} size={size} aria-hidden />;
}
