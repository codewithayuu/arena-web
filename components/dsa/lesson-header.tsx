import React from 'react';
import { Clock, CalendarDays } from 'lucide-react';
import Badge from '@/components/smoothui/badge';

interface LessonHeaderProps {
  title: string;
  readTime?: string;
  lastUpdated?: string;
}

export function LessonHeader({
  title,
  readTime = '5 min read',
  lastUpdated = 'September 25, 2026',
}: LessonHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-foreground leading-tight">
        {title}
      </h1>
      <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
        {readTime && (
          <Badge variant="outline" size="sm" className="gap-1.5 font-medium text-muted-foreground bg-muted/40 border-border/40">
            <Clock className="h-3.5 w-3.5" />
            <span>{readTime}</span>
          </Badge>
        )}
        {lastUpdated && (
          <Badge variant="outline" size="sm" className="gap-1.5 font-medium text-muted-foreground bg-muted/40 border-border/40">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{lastUpdated.startsWith('Updated') ? lastUpdated : `Updated ${lastUpdated}`}</span>
          </Badge>
        )}
      </div>
    </header>
  );
}
