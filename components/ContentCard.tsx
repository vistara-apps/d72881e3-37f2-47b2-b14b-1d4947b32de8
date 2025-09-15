'use client';

import { ContentPiece } from '@/lib/types';
import { formatNumber, formatDate, cn } from '@/lib/utils';
import { Heart, MessageCircle, Share2, Zap, Eye } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter } from './ui/Card';

interface ContentCardProps {
  content: ContentPiece;
  variant?: 'simple' | 'withRevenue' | 'remixable';
  className?: string;
  onRemix?: (contentId: string) => void;
  onLike?: (contentId: string) => void;
  onShare?: (contentId: string) => void;
}

export function ContentCard({ 
  content, 
  variant = 'simple', 
  className,
  onRemix,
  onLike,
  onShare 
}: ContentCardProps) {
  return (
    <Card className={cn('overflow-hidden hover:shadow-neon-sm transition-all duration-200', className)}>
      {/* Media Preview */}
      <div className="relative aspect-video bg-muted">
        <img
          src={content.mediaUrl}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        {variant === 'remixable' && (
          <div className="absolute top-2 right-2">
            <div className="bg-accent/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-accent border border-accent/30">
              Remixable
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white text-sm">
          <Eye className="w-4 h-4" />
          {formatNumber(content.views)}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {content.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {content.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {content.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-surface rounded-full text-xs text-muted-foreground border border-border"
            >
              #{tag}
            </span>
          ))}
        </div>

        {variant === 'withRevenue' && (
          <div className="bg-surface/50 rounded-md p-3 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revenue Generated</span>
              <span className="font-semibold text-accent">$24.50</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Your Share (80%)</span>
              <span className="font-semibold text-foreground">$19.60</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <button
            onClick={() => onLike?.(content.contentId)}
            className="flex items-center gap-1 hover:text-accent transition-colors"
          >
            <Heart className="w-4 h-4" />
            {formatNumber(content.likes)}
          </button>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {formatNumber(content.remixes)}
          </div>
          <span className="text-xs">
            {formatDate(content.createdAt)}
          </span>
        </div>

        <div className="flex gap-2">
          {variant === 'remixable' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemix?.(content.contentId)}
            >
              <Zap className="w-4 h-4 mr-1" />
              Remix
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare?.(content.contentId)}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
