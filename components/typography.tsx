import React from "react";
interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className = "" }: HeadingProps) {
  return (
    <h1
      className={`text-4xl font-medium capitalize leading-[1.5] tracking-tight ${className}`}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = "" }: HeadingProps) {
  return (
    <h2 className={`text-2xl font-semibold tracking-tight ${className}`}>
      {children}
    </h2>
  );
}

export function H3({ children, className = "" }: HeadingProps) {
  return (
    <h3 className={`text-lg font-medium text-black ${className}`}>
      {children}
    </h3>
  );
}

export function P({ children, className = "" }: HeadingProps) {
  return <p className={`text-brand-text text-sm ${className}`}>{children}</p>;
}

export function Detail({ children, className = "" }: HeadingProps) {
  return <p className={`text-xs ${className}`}>{children}</p>;
}
