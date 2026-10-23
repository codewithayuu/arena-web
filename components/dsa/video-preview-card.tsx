import React from 'react';
import { Play } from 'lucide-react';

interface VideoPreviewCardProps {
  title?: string;
  duration?: string;
}

export function VideoPreviewCard({
  title = 'Video Explanation: Two Pointers & Sliding Window Masterclass',
  duration = 'Duration: 18 mins · 1080p Full HD',
}: VideoPreviewCardProps) {
  return (
    <div className="relative rounded-xl border border-border bg-zinc-950 overflow-hidden shadow-lg group cursor-pointer aspect-video max-w-2xl mx-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center p-4">
        <div className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
          <Play className="h-7 w-7 ml-1 fill-current" />
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-bold text-white">
            {title}
          </h4>
          <p className="text-xs text-zinc-300 mt-1">
            {duration}
          </p>
        </div>
      </div>
    </div>
  );
}
