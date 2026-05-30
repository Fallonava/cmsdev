"use client";

import dynamic from "next/dynamic";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { BookMarked, Trophy } from "lucide-react";

interface IconProps extends LucideProps {
  name: string;
}

export default function DynamicIcon({ name, ...props }: IconProps) {
  const lowercaseName = name.toLowerCase();
  
  // Try to find a matching icon in dynamic imports
  const iconKey = Object.keys(dynamicIconImports).find(key => key.toLowerCase() === lowercaseName) as keyof typeof dynamicIconImports;

  if (iconKey) {
    const LucideIcon = dynamic(dynamicIconImports[iconKey], {
      loading: () => <div style={{ width: props.size || 24, height: props.size || 24 }} className="animate-pulse bg-gray-200 rounded-md" />,
    });
    return <LucideIcon {...props} />;
  }

  // Fallbacks if the name is invalid
  return <BookMarked {...props} />;
}
