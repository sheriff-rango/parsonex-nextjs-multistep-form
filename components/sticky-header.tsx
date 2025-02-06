import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function StickyHeader({
  title,
  link,
  buttonText,
}: {
  title: string;
  link?: string;
  buttonText?: string;
}) {
  return (
    <div className="sticky top-16 z-10 flex items-center justify-between bg-gray-bg">
      <H1>{title}</H1>
      {link && (
        <Link href={link}>
          <Button>{buttonText}</Button>
        </Link>
      )}
    </div>
  );
}
