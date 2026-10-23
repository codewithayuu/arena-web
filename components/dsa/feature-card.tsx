import React from 'react';
import { Layers, Code2, Video, Sparkles, BookOpen, LucideIcon } from 'lucide-react';

interface FeatureGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export function FeatureGrid({ children, columns = 2 }: FeatureGridProps) {
  const colClass = columns === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';
  return <div className={`grid ${colClass} gap-4`}>{children}</div>;
}

interface FeatureCardProps {
  icon?: 'layers' | 'code' | 'video' | 'sparkles' | 'book';
  title: string;
  description: string;
  id?: string;
}

const iconMap: Record<string, LucideIcon> = {
  layers: Layers,
  code: Code2,
  video: Video,
  sparkles: Sparkles,
  book: BookOpen,
};

export function FeatureCard({
  icon = 'layers',
  title,
  description,
  id,
}: FeatureCardProps) {
  const IconComponent = iconMap[icon] || Layers;

  return (
    <div className="p-4 rounded-xl border border-border bg-background space-y-2">
      <div className="flex items-center gap-2 text-primary font-bold text-sm">
        <IconComponent className="h-4 w-4" />
        <h3 id={id}>{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
