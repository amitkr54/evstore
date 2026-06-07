"use client";

import React from "react";

interface BrandLogoProps {
  logo: string;
  className?: string;
  color?: string;
}

export default function BrandLogo({ logo, className = "w-6 h-6", color }: BrandLogoProps) {
  if (!logo) return null;

  // If the logo string is an SVG element
  if (logo.trim().startsWith("<svg")) {
    return (
      <div 
        className={`${className} flex items-center justify-center`} 
        style={{ color: color || "currentColor" }}
        dangerouslySetInnerHTML={{ __html: logo }} 
      />
    );
  }

  // If the logo string is an image URL
  if (logo.startsWith("http") || logo.startsWith("/")) {
    return (
      <img 
        src={logo} 
        alt="Brand Logo" 
        className={`${className} object-contain`} 
      />
    );
  }

  // Fallback to text/emoji
  return (
    <span className="text-xl select-none" role="img" aria-label="brand-logo">
      {logo}
    </span>
  );
}
