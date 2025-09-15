'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import {
  Undo,
  Redo,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle,
  Download,
  Save,
  X,
  Loader2,
  Palette,
  Move,
  RotateCw,
  Trash2
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface RemixStudioProps {
  originalContent?: {
    mediaUrl: string;
    title: string;
    creatorId: string;
  };
  onSave?: (result: RemixResult) => void;
  onCancel?: () => void;
  className?: string;
}

interface RemixResult {
  canvasData: string;
  thumbnail: string;
  metadata: RemixMetadata;
}

interface RemixMetadata {
  title: string;
  description: string;
  tags: string[];
  revenueSharePercentage: number;
}

export function RemixStudio({
  originalContent,
  onSave,
  onCancel,
  className = ''
}: RemixStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(5);
  const [isSaving, setIsSaving] = useState(false);

  // Remix metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [revenueShare, setRevenueShare] = useState(90); // Default 90% to remixer

  // History for undo/redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#1a1a1a',
      selection: true,
      preserveObjectStacking: true
    });

    fabricCanvasRef.current = canvas;

    // Load original content if provided
    if (originalContent?.mediaUrl) {
      loadOriginalContent(canvas, originalContent.mediaUrl);
    } else {
      setIsLoading(false);
    }

    // Set up event listeners
    setupCanvasEvents(canvas);

    return () => {
      canvas.dispose();
    };
  }, [originalContent]);

  const loadOriginalContent = async (canvas: fabric.Canvas, mediaUrl: string) => {
    try {
      if (mediaUrl.startsWith('ipfs://')) {
        // Convert IPFS URL to gateway URL
        const cid = mediaUrl.replace('ipfs://', '');
        const gatewayUrl = `https://w3s.link/ipfs/${cid}`;

        if (mediaUrl.includes('image')) {
          fabric.Image.fromURL(gatewayUrl, (img) => {
            if (img) {
              // Scale image to fit canvas while maintaining aspect ratio
              const scale = Math.min(
                canvas.width! / img.width!,
                canvas.height! / img.height!
              ) * 0.8;

              img.scale(scale);
              img.center();
              canvas.add(img);
              canvas.renderAll();
            }
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading original content:', error);
      setIsLoading(false);
    }
  };

  const setupCanvasEvents = (canvas: fabric.Canvas) => {
    // Save state for undo/redo
    const saveState = () => {
      const json = JSON.stringify(canvas.toJSON());
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(json);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    };

    canvas.on('object:added', saveState);
    canvas.on('object:removed', saveState);
    canvas.on('object:modified', saveState);
  };

  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new fabric.IText('Edit me', {
      left: 100,
      top: 100,
      fill: selectedColor,
      fontSize: 24,
      fontFamily: 'Arial'
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };

  const addRectangle = () => {
    if (!fabricCanvasRef.current) return;

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: selectedColor,
      stroke: '#ffffff',
      strokeWidth: 2
    });

    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    fabricCanvasRef.current.renderAll();
  };

  const addCircle = () => {
    if (!fabricCanvasRef.current) return;

    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: selectedColor,
      stroke: '#ffffff',
      strokeWidth: 2
    });

    fabricCanvasRef.current.add(circle);
    fabricCanvasRef.current.setActiveObject(circle);
    fabricCanvasRef.current.renderAll();
  };

  const addTriangle = () => {
    if (!fabricCanvasRef.current) return;

    const triangle = new fabric.Triangle({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: selectedColor,
      stroke: '#ffffff',
      strokeWidth: 2
    });

    fabricCanvasRef.current.add(triangle);
    fabricCanvasRef.current.setActiveObject(triangle);
    fabricCanvasRef.current.renderAll();
  };

  const undo = () => {
    if (!fabricCanvasRef.current || historyIndex <= 0) return;

    const canvas = fabricCanvasRef.current;
    const previousState = history[historyIndex - 1];
    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
      setHistoryIndex(historyIndex - 1);
    });
  };

  const redo = () => {
    if (!fabricCanvasRef.current || historyIndex >= history.length - 1) return;

    const canvas = fabricCanvasRef.current;
    const nextState = history[historyIndex + 1];
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      setHistoryIndex(historyIndex + 1);
    });
  };

  const deleteSelected = () => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();

    activeObjects.forEach(obj => {
      canvas.remove(obj);
    });

    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const addImage = async (file: File) => {
    if (!fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const fabricImg = new fabric.Image(img, {
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5
        });
        fabricCanvasRef.current!.add(fabricImg);
        fabricCanvasRef.current!.renderAll();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      addImage(file);
    }
  };

  const exportCanvas = (): string => {
    if (!fabricCanvasRef.current) return '';
    return fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 0.8
    });
  };

  const generateThumbnail = (): string => {
    if (!fabricCanvasRef.current) return '';

    // Create a smaller version for thumbnail
    const canvas = fabricCanvasRef.current;
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    tempCanvas.width = 300;
    tempCanvas.height = 200;

    if (ctx) {
      // Scale and draw the main canvas content
      ctx.drawImage(canvas.getElement(), 0, 0, 300, 200);
    }

    return tempCanvas.toDataURL('image/jpeg', 0.7);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!fabricCanvasRef.current || !title.trim()) return;

    setIsSaving(true);

    try {
      const canvasData = exportCanvas();
      const thumbnail = generateThumbnail();

      const metadata: RemixMetadata = {
        title: title.trim(),
        description: description.trim(),
        tags,
        revenueSharePercentage: revenueShare
      };

      const result: RemixResult = {
        canvasData,
        thumbnail,
        metadata
      };

      onSave?.(result);
    } catch (error) {
      console.error('Error saving remix:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const tools = [
    { id: 'select', icon: Move, label: 'Select' },
    { id: 'text', icon: Type, label: 'Text', action: addText },
    { id: 'rectangle', icon: Square, label: 'Rectangle', action: addRectangle },
    { id: 'circle', icon: Circle, label: 'Circle', action: addCircle },
    { id: 'triangle', icon: Triangle, label: 'Triangle', action: addTriangle },
  ];

  const colors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'
  ];

  return (
    <div className={`flex flex-col h-screen bg-background ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Remix Studio</h1>
          {originalContent && (
            <p className="text-sm text-muted-foreground">
              Remixing: {originalContent.title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={undo} disabled={historyIndex <= 0}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={deleteSelected}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="w-16 bg-surface border-r border-border flex flex-col items-center py-4 space-y-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setSelectedTool(tool.id);
                tool.action?.();
              }}
              className="w-12 h-12 p-0"
            >
              <tool.icon className="w-5 h-5" />
            </Button>
          ))}

          {/* Image upload */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="ghost" size="sm" className="w-12 h-12 p-0">
              <ImageIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4 bg-surface">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="border border-border rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Properties Panel */}
          <div className="p-4 border-t border-border bg-surface">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span className="text-sm font-medium">Color:</span>
                <div className="flex gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded border-2 ${
                        selectedColor === color ? 'border-white' : 'border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Brush Size:</span>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">{brushSize}px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-surface border-l border-border p-4 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Remix Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your remix a title"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your remix"
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add a tag"
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                  />
                  <Button onClick={addTag} disabled={!tagInput.trim()}>
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Revenue Share (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={revenueShare}
                  onChange={(e) => setRevenueShare(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Remaining {100 - revenueShare}% goes to original creator
                </p>
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving || !title.trim()}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Remix
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

