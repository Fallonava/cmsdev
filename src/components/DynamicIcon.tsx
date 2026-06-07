"use client";

import { LucideProps, icons } from "lucide-react";

interface IconProps extends LucideProps {
  name: string;
}

export default function DynamicIcon({ name, ...props }: IconProps) {
  // Find the exact name or try to format it
  let IconComponent = (icons as any)[name];

  if (!IconComponent) {
    // If the name is like "book-marked", try converting to PascalCase "BookMarked"
    const pascalCaseName = name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");
    
    IconComponent = (icons as any)[pascalCaseName];
  }

  if (IconComponent) {
    return <IconComponent {...props} />;
  }

  // Fallback if the name is completely invalid
  const FallbackIcon = icons.BookMarked;
  return <FallbackIcon {...props} />;
}
