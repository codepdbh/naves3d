import * as THREE from 'three';

export class TextureGenerator {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  /**
   * Create a pixelated grid canvas texture with nearest-neighbor sampling.
   */
  public static createPixelTexture(
    width: number,
    height: number,
    drawCallback: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
    cacheKey?: string
  ): THREE.CanvasTexture {
    if (cacheKey && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      drawCallback(ctx, width, height);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;

    if (cacheKey) {
      this.cache.set(cacheKey, texture);
    }

    return texture;
  }

  /**
   * Generates a 8-bit metallic hull texture for ships
   */
  public static createShipHullTexture(mainColor: string, detailColor: string): THREE.CanvasTexture {
    const key = `ship_${mainColor}_${detailColor}`;
    return this.createPixelTexture(
      32,
      32,
      (ctx, w, h) => {
        ctx.fillStyle = mainColor;
        ctx.fillRect(0, 0, w, h);

        // Pixel panel grid
        ctx.fillStyle = detailColor;
        for (let x = 0; x < w; x += 4) {
          ctx.fillRect(x, 0, 1, h);
        }
        for (let y = 0; y < h; y += 4) {
          ctx.fillRect(0, y, w, 1);
        }

        // Highlights
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(2, 2, 8, 2);
        ctx.fillRect(22, 2, 8, 2);

        // Dark shadows
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, h - 4, w, 4);
      },
      key
    );
  }

  /**
   * Generates a pixelated asteroid rock texture
   */
  public static createAsteroidTexture(): THREE.CanvasTexture {
    return this.createPixelTexture(
      32,
      32,
      (ctx, w, h) => {
        ctx.fillStyle = '#4a4e59';
        ctx.fillRect(0, 0, w, h);

        // Craters & rock dither
        ctx.fillStyle = '#2c2f36';
        ctx.fillRect(4, 4, 8, 8);
        ctx.fillRect(18, 14, 10, 10);

        ctx.fillStyle = '#787e8f';
        ctx.fillRect(6, 4, 4, 2);
        ctx.fillRect(20, 14, 6, 2);

        ctx.fillStyle = '#1c1e22';
        ctx.fillRect(8, 8, 4, 4);
        ctx.fillRect(22, 18, 6, 6);
      },
      'asteroid_rock'
    );
  }

  /**
   * Generates laser projectile texture
   */
  public static createLaserTexture(color: string): THREE.CanvasTexture {
    return this.createPixelTexture(
      16,
      16,
      (ctx, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);

        // Bright core
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(4, 4, 8, 8);
      },
      `laser_${color}`
    );
  }

  /**
   * Generates Pickup Icon texture
   */
  public static createPickupTexture(symbol: string, color: string): THREE.CanvasTexture {
    return this.createPixelTexture(
      32,
      32,
      (ctx, w, h) => {
        ctx.fillStyle = '#111122';
        ctx.fillRect(0, 0, w, h);

        // Outer border
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, 2);
        ctx.fillRect(0, h - 2, w, 2);
        ctx.fillRect(0, 0, 2, h);
        ctx.fillRect(w - 2, 0, 2, h);

        // Icon text/symbol
        ctx.fillStyle = color;
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, w / 2, h / 2 + 2);
      },
      `pickup_${symbol}_${color}`
    );
  }
}
