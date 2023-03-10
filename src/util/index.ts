/*
 * @Author: daren、xiaobo
 * @Date: 2019-11-21
 */
import { pathBBox, pointInSvgPath, pointInSvgPathBox, getPointsAndIntersectingPaths } from "@/util/pointInSvgPath";

import { getItemsBySvg, getSizeBySvg, getItemByDomString, stringToDom } from "./svg";
import { functionTypeAnnotation } from "@babel/types";

const isMobile = (function () {
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent) || hasTouchEvent()) {
    return true;
  }
  return false;
})();

function hasTouchEvent() {
  if (typeof window !== "undefined") {
    return "ontouchstart" in window;
  }
  return false;
}
/**
 * 计算缩放比例, 实现css background-size:contain
 * @param  {number} viewPortWith
 * @param  {number} viewPortHeight
 * @param  {number} contentWdith
 * @param  {number} contentHeight
 */
function calcFitViewPortZoom(viewPortWith: number, viewPortHeight: number, contentWdith: number, contentHeight: number): number {
  let fitZoom = 1;
  const containerRatio = viewPortWith / viewPortHeight;
  const contentRatio = contentWdith / contentHeight;
  if (contentRatio > containerRatio) {
    fitZoom = viewPortWith < contentWdith ? viewPortWith / contentWdith : viewPortWith / contentWdith;
  } else {
    fitZoom = viewPortHeight < contentHeight ? viewPortHeight / contentHeight : viewPortHeight / contentHeight;
  }
  return fitZoom;
}
/**
 * 计算content 相对于dimensions 的偏移量，使content 相对居中
 */
function calcContentOffset(zoom: number, contentWidth: number, contentHeight: number, dimensionWidth: number, dimensionHeight: number): object {
  return {
    x: (dimensionWidth - contentWidth) / 2,
    y: (dimensionHeight - contentHeight) / 2,
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(Math.min(v, max), min);
}

/**
 * 判断数据是否是数组类型
 */
function isArray(o: any): boolean {
  return Object.prototype.toString.call(o) === "[object Array]";
}

/**
 * 判断数据是否是对象类型
 */
function isObject(o: any): boolean {
  return Object.prototype.toString.call(o) === "[object Object]";
}

/**
 * 判断数据是否是函数类型
 */
function isFunction(o: any): boolean {
  return Object.prototype.toString.call(o) === "[object Function]";
}

/**
 * 判断对象是否为字符串类型
 * @param o
 */
function isString(o: any) {
  //判断对象是否是字符串
  return Object.prototype.toString.call(o) === "[object String]";
}

/**
 * 深拷贝
 */
function deepClone(initialObj: any): any {
  const obj: any = {};
  if (typeof initialObj !== "object") {
    return initialObj;
  }
  for (const key in initialObj) {
    if (typeof initialObj[key] === "object") {
      //对数组特殊处理
      if (Array.isArray(initialObj[key])) {
        //用map方法返回新数组，将数组中的元素递归
        obj[key] = initialObj[key].map((item: any) => deepClone(item));
      } else {
        //递归返回新的对象
        obj[key] = deepClone(initialObj[key]);
      }
    } else if (typeof initialObj[key] === "function") {
      //返回新函数
      obj[key] = initialObj[key].bind(obj);
    } else {
      //基本类型直接返回
      obj[key] = initialObj[key];
    }
  }
  return obj;
}
function getBBox(seat) {
  return { x: seat.xCoord - 12, y: seat.yCoord - 12, width: 24, height: 24 };
}
/**
 * 获取多个对象的矩形区
 * @param {*} elements
 */
function getElementsFrame(elements) {
  let ax = -Infinity;
  let ay = -Infinity;

  let bx = Infinity;
  let by = Infinity;
  elements.forEach(element => {
    let bbox = getBBox(element);
    ax = Math.max(ax, bbox.x + bbox.width);
    ay = Math.max(ay, bbox.y + bbox.height);

    bx = Math.min(bx, bbox.x);
    by = Math.min(by, bbox.y);
  });

  return {
    x: bx,
    y: by,
    width: ax - bx,
    height: ay - by,
  };
}

const raf =
  typeof window !== "undefined"
    ? window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    : function () {};

const cancelRAF =
  typeof window !== "undefined"
    ? window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      window.clearTimeout
    : function () {};

/**
 * 驼峰命名和短横线命名互转
 * @param  {number} key
 * @param  {number} value
 * @return {string}
 */

const toCamelCaseOrKebabCase = (key, value) => {
  if (key === "camel") {
    return value.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
  } else {
    return value.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
};

const getOffsetTop = el => {
  var offset = el.offsetTop;
  if (el.offsetParent != null) offset += getOffsetTop(el.offsetParent);
  return offset;
};
const getOffsetLeft = el => {
  var offset = el.offsetLeft;
  if (el.offsetParent != null) offset += getOffsetLeft(el.offsetParent);
  return offset;
};

export {
  isArray,
  isFunction,
  isMobile,
  isObject,
  isString,
  calcFitViewPortZoom,
  deepClone,
  clamp,
  pathBBox,
  pointInSvgPath,
  pointInSvgPathBox,
  getPointsAndIntersectingPaths,
  calcContentOffset,
  getItemsBySvg,
  getSizeBySvg,
  getElementsFrame,
  raf,
  cancelRAF,
  getItemByDomString,
  stringToDom,
  toCamelCaseOrKebabCase,
  getOffsetTop,
  getOffsetLeft,
};
