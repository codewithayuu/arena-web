'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X } from 'lucide-react';

interface DsaMindmapProps {
  src?: string;
  alt?: string;
}

export function DsaMindmap({
  src = '/images/dsa-mindmap.svg',
  alt = 'Data Structures and Algorithms Mindmap',
}: DsaMindmapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-lg border border-border/40 bg-muted/10">
        <Image
          src={src}
          alt={alt}
          width={1280}
          height={720}
          className="w-full h-auto cursor-pointer transition-transform hover:scale-[1.01]"
          priority
          onClick={() => setIsFullscreen(true)}
        />
      </div>
      <div
        className="mt-2 mb-6 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
        onClick={() => setIsFullscreen(true)}
      >
        <Maximize2 className="h-3 w-3" />
        <span>Fullscreen</span>
      </div>

      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 rounded-full bg-background/80 p-2 text-foreground hover:bg-background transition-colors"
            aria-label="Close fullscreen"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="max-w-6xl max-h-[90vh] overflow-auto rounded-lg">
            <Image
              src={src}
              alt={alt}
              width={1920}
              height={1080}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
