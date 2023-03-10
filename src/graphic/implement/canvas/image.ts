import CanvasImageGraphicInterface from "../../interface/canvas/image";
import { ItemType } from "@/item/index";
import { Image } from "@/graphic/types/shape";
import { qrDecompose } from "@/graphic/utils/matrix";
import { getClearBox } from "@/graphic/utils/box";

const cacheMap = new Map();

const loadingQueue = new Map();

function draw(context, imageCanvas, width, height, translateX, translateY, scaleX, scaleY, angle, x, y) {
  context.save();
  context.translate(x + translateX, y + translateY);
  context.rotate((angle * Math.PI) / 180);
  context.scale(scaleX, scaleY);
  context.drawImage(imageCanvas, 0, 0, width, height);
  context.restore();
}

function getImageName(src, width, height, fill = "#gggggg") {
  return `${src}${fill}w@${width}h@${height}`;
}

function getImageCanvas(img, fill, width, height) {
  const w = width || img.width;
  const h = height || img.height;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.setAttribute("width", w);
  canvas.setAttribute("height", h);
  context.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
  if (!fill) return canvas;
  const colorRGBA = getRGB(fill.split("#").join("0x"));
  let imageData = context.getImageData(0, 0, w, h);
  for (let i = 0, n = imageData.data.length; i < n; i += 4) {
    imageData.data[i] = colorRGBA.r + imageData.data[i] - 255; //red;
    imageData.data[i + 1] = colorRGBA.g + imageData.data[i + 1] - 255; //green
    imageData.data[i + 2] = colorRGBA.b + imageData.data[i + 2] - 255; //blue
  }
  context.putImageData(imageData, 0, 0);
  return canvas;
}

function getRGB($rgb) {
  return { r: ($rgb >> 16) & 0xff, g: ($rgb >> 8) & 0xff, b: $rgb & 0xff };
}

function getImageCanvasAndDraw(cacheImage, fill, width, height, imageName, context, translateX, translateY, scaleX, scaleY, angle, x, y) {
  const imageCanvas = getImageCanvas(cacheImage, fill, width, height);
  cacheMap.set(imageName, imageCanvas);
  draw(context, imageCanvas, width, height, translateX, translateY, scaleX, scaleY, angle, x, y);
}

const CanvasImageGraphic: CanvasImageGraphicInterface = {
  type: ItemType.IMAGE,
  /**
   * 在canvas中绘制图片
   *
   * @param image 图片对象
   * @param context canvas上下文
   *
   * @returns void
   */
  draw: function (image: Image, context: CanvasRenderingContext2D): void {
    const { x = 0, y = 0, width = 100, height = 100, src, matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, fill } = image;
    if (!src) {
      return console.error("无法绘制src属性为空的图片！");
    }
    const { angle, scaleX, scaleY, translateX, translateY } = qrDecompose(matrix);

    let cacheImage = cacheMap.get(src);
    const imageName = getImageName(src, width, height, fill);
    let cacheImageCanvas = cacheMap.get(imageName);
    const loadingObj = { fill, width, height, imageName, context, translateX, translateY, scaleX, scaleY, angle, x, y };
    let loadingImages = loadingQueue.get(src);
    if (cacheImage && cacheImageCanvas) {
      draw(context, cacheImageCanvas, width, height, translateX, translateY, scaleX, scaleY, angle, x, y);
    } else if (loadingImages) {
      loadingImages.push(loadingObj);
    } else {
      let img = document.createElement("img");
      img.src = src;
      loadingQueue.set(src, [loadingObj]);
      img.addEventListener(
        "load",
        () => {
          cacheMap.set(src, img);
          const loadingImages = loadingQueue.get(src);
          for (const imageObj of loadingImages) {
            const { fill, width, height, imageName, context, translateX, translateY, scaleX, scaleY, angle, x, y } = imageObj;
            let cacheImageCanvas = cacheMap.get(imageName);
            if (!cacheImageCanvas) {
              getImageCanvasAndDraw(img, fill, width, height, imageName, context, translateX, translateY, scaleX, scaleY, angle, x, y);
            } else {
              draw(context, cacheImageCanvas, width, height, translateX, translateY, scaleX, scaleY, angle, x, y);
            }
          }
          loadingQueue.delete(src);
          img = null;
        },
        false
      );
    }
    cacheImage = null;
    cacheImageCanvas = null;
    loadingImages = null;
  },
  /**
   * 在canvas中擦除图片
   *
   * @param image 图片对象
   * @param context canvas上下文
   *
   * @returns void
   */
  clear: function (image: Image, context: CanvasRenderingContext2D): void {
    const clearBox = getClearBox(image);
    context.clearRect(clearBox.x, clearBox.y, clearBox.width, clearBox.height);
  },
  getClearBox,
};

export default CanvasImageGraphic;
