/**
 * Remix tools and utilities for CreatorShare
 */

export interface RemixTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'filter' | 'effect' | 'text' | 'shape' | 'transform';
  apply: (canvas: HTMLCanvasElement, options?: any) => Promise<void>;
}

export class RemixTools {
  private tools: Map<string, RemixTool> = new Map();

  constructor() {
    this.initializeTools();
  }

  private initializeTools() {
    // Filter tools
    this.addTool({
      id: 'grayscale',
      name: 'Grayscale',
      description: 'Convert image to grayscale',
      icon: '🎨',
      category: 'filter',
      apply: this.applyGrayscale.bind(this)
    });

    this.addTool({
      id: 'sepia',
      name: 'Sepia',
      description: 'Apply sepia tone filter',
      icon: '🏜️',
      category: 'filter',
      apply: this.applySepia.bind(this)
    });

    this.addTool({
      id: 'blur',
      name: 'Blur',
      description: 'Apply blur effect',
      icon: '🌫️',
      category: 'effect',
      apply: this.applyBlur.bind(this)
    });

    this.addTool({
      id: 'brightness',
      name: 'Brightness',
      description: 'Adjust brightness',
      icon: '☀️',
      category: 'effect',
      apply: this.applyBrightness.bind(this)
    });

    this.addTool({
      id: 'contrast',
      name: 'Contrast',
      description: 'Adjust contrast',
      icon: '🌓',
      category: 'effect',
      apply: this.applyContrast.bind(this)
    });

    this.addTool({
      id: 'saturation',
      name: 'Saturation',
      description: 'Adjust color saturation',
      icon: '🌈',
      category: 'effect',
      apply: this.applySaturation.bind(this)
    });

    this.addTool({
      id: 'hue-rotate',
      name: 'Hue Rotate',
      description: 'Rotate color hues',
      icon: '🎭',
      category: 'effect',
      apply: this.applyHueRotate.bind(this)
    });

    this.addTool({
      id: 'invert',
      name: 'Invert',
      description: 'Invert colors',
      icon: '🔄',
      category: 'effect',
      apply: this.applyInvert.bind(this)
    });

    this.addTool({
      id: 'pixelate',
      name: 'Pixelate',
      description: 'Create pixel art effect',
      icon: '🎮',
      category: 'effect',
      apply: this.applyPixelate.bind(this)
    });

    // Transform tools
    this.addTool({
      id: 'flip-horizontal',
      name: 'Flip Horizontal',
      description: 'Flip image horizontally',
      icon: '⬅️➡️',
      category: 'transform',
      apply: this.applyFlipHorizontal.bind(this)
    });

    this.addTool({
      id: 'flip-vertical',
      name: 'Flip Vertical',
      description: 'Flip image vertically',
      icon: '⬆️⬇️',
      category: 'transform',
      apply: this.applyFlipVertical.bind(this)
    });

    this.addTool({
      id: 'rotate-90',
      name: 'Rotate 90°',
      description: 'Rotate image 90 degrees clockwise',
      icon: '🔄',
      category: 'transform',
      apply: this.applyRotate90.bind(this)
    });
  }

  private addTool(tool: RemixTool) {
    this.tools.set(tool.id, tool);
  }

  getTool(id: string): RemixTool | undefined {
    return this.tools.get(id);
  }

  getToolsByCategory(category: string): RemixTool[] {
    return Array.from(this.tools.values()).filter(tool => tool.category === category);
  }

  getAllTools(): RemixTool[] {
    return Array.from(this.tools.values());
  }

  // Filter and effect implementations
  private async applyGrayscale(canvas: HTMLCanvasElement): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = gray;     // Red
      data[i + 1] = gray; // Green
      data[i + 2] = gray; // Blue
      // Alpha (data[i + 3]) remains unchanged
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private async applySepia(canvas: HTMLCanvasElement): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));     // Red
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // Green
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private async applyBlur(canvas: HTMLCanvasElement, options?: { radius?: number }): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radius = options?.radius || 2;

    // Simple box blur implementation
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);

    const width = canvas.width;
    const height = canvas.height;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        let count = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const index = (ny * width + nx) * 4;
              r += data[index];
              g += data[index + 1];
              b += data[index + 2];
              a += data[index + 3];
              count++;
            }
          }
        }

        const outputIndex = (y * width + x) * 4;
        output[outputIndex] = r / count;
        output[outputIndex + 1] = g / count;
        output[outputIndex + 2] = b / count;
        output[outputIndex + 3] = a / count;
      }
    }

    ctx.putImageData(new ImageData(output, width, height), 0, 0);
  }

  private async applyBrightness(canvas: HTMLCanvasElement, options?: { value?: number }): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const value = options?.value || 30;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] + value);     // Red
      data[i + 1] = Math.min(255, data[i + 1] + value); // Green
      data[i + 2] = Math.min(255, data[i + 2] + value); // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private async applyContrast(canvas: HTMLCanvasElement, options?: { value?: number }): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const value = options?.value || 20;
    const factor = (259 * (value + 255)) / (255 * (259 - value));

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));     // Red
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128)); // Green
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128)); // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private async applySaturation(canvas: HTMLCanvasElement, options?: { value?: number }): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const value = options?.value || 50;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      data[i] = Math.min(255, Math.max(0, gray + (r - gray) * (value / 100)));     // Red
      data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * (value / 100))); // Green
      data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * (value / 100))); // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private async applyHueRotate(canvas: HTMLCanvasElement, options?: { degrees?: number }): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const degrees = options?.degrees || 90;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;

      let h = 0;
      if (delta !== 0) {
        if (max === r) h = ((g - b) / delta) % 6;
        else if (max === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        h *= 60;
      }

      h = (h + degrees) % 360;

      const c = delta;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = max - c;

      let newR = 0, newG = 0, newB = 0;

      if (h >= 0 && h < 60) { newR = c; newG = x; newB = 0; }
      else if (h >= 60 && h < 120) { newR = x; newG = c; newB = 0; }
      else if (h >= 120 && h < 180) { newR = 0; newG = c; newB = x; }
      else if (h >= 180 && h < 240) { newR = 0; newG = x; newB = c; }
      else if (h >= 240 && h < 300) { newR = x; newG = 0; newB = c; }
      else { newR = c; newG = 0; newB = x; }

      data[i] = Math.round((newR + m) * 255);     // Red
      data[i + 1] = Math.round((newG + m) * 255); // Green
      data[i + 2] = Math.round((newB + m) * 255); // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private async applyInvert(canvas: HTMLCanvasElement): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];     // Red
      data[i + 1] = 255 - data[i + 1]; // Green
      data[i + 2] = 255 - data[i + 2]; // Blue
      // Alpha remains unchanged
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private async applyPixelate(canvas: HTMLCanvasElement, options?: { size?: number }): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = options?.size || 10;
    const width = canvas.width;
    const height = canvas.height;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        // Get average color of the block
        let r = 0, g = 0, b = 0, a = 0;
        let count = 0;

        for (let dy = 0; dy < size && y + dy < height; dy++) {
          for (let dx = 0; dx < size && x + dx < width; dx++) {
            const index = ((y + dy) * width + (x + dx)) * 4;
            r += data[index];
            g += data[index + 1];
            b += data[index + 2];
            a += data[index + 3];
            count++;
          }
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        a = Math.round(a / count);

        // Apply average color to the entire block
        for (let dy = 0; dy < size && y + dy < height; dy++) {
          for (let dx = 0; dx < size && x + dx < width; dx++) {
            const index = ((y + dy) * width + (x + dx)) * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private async applyFlipHorizontal(canvas: HTMLCanvasElement): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const flippedData = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width / 2; x++) {
        const leftIndex = (y * width + x) * 4;
        const rightIndex = (y * width + (width - 1 - x)) * 4;

        // Swap pixels
        for (let i = 0; i < 4; i++) {
          const temp = data[leftIndex + i];
          flippedData[leftIndex + i] = data[rightIndex + i];
          flippedData[rightIndex + i] = temp;
        }
      }
    }

    ctx.putImageData(new ImageData(flippedData, width, height), 0, 0);
  }

  private async applyFlipVertical(canvas: HTMLCanvasElement): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const flippedData = new Uint8ClampedArray(data);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height / 2; y++) {
        const topIndex = (y * width + x) * 4;
        const bottomIndex = ((height - 1 - y) * width + x) * 4;

        // Swap pixels
        for (let i = 0; i < 4; i++) {
          const temp = data[topIndex + i];
          flippedData[topIndex + i] = data[bottomIndex + i];
          flippedData[bottomIndex + i] = temp;
        }
      }
    }

    ctx.putImageData(new ImageData(flippedData, width, height), 0, 0);
  }

  private async applyRotate90(canvas: HTMLCanvasElement): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const rotatedData = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIndex = (y * width + x) * 4;
        const destIndex = (x * height + (height - 1 - y)) * 4;

        rotatedData[destIndex] = data[srcIndex];     // R
        rotatedData[destIndex + 1] = data[srcIndex + 1]; // G
        rotatedData[destIndex + 2] = data[srcIndex + 2]; // B
        rotatedData[destIndex + 3] = data[srcIndex + 3]; // A
      }
    }

    // Create new canvas with rotated dimensions
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = height;
    tempCanvas.height = width;
    const tempCtx = tempCanvas.getContext('2d')!;

    tempCtx.putImageData(new ImageData(rotatedData, height, width), 0, 0);

    // Clear original canvas and draw rotated image
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(tempCanvas, -height / 2, -width / 2);
    ctx.restore();
  }
}

// Export singleton instance
export const remixTools = new RemixTools();

