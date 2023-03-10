import "@babel/polyfill";
// stage
import Stage from "./Stage";
import Layer from "./layer/Layer";
import TransformManager from "@/basic/Transform";

// item
import { Circle, Arc, Cache, Rect, Image, Line, Path, Polygon, Polyline, Text, Group, ItemType } from "@/item";

// layer
import CanvasLayer, {
  Circle as CanvasCircle,
  Arc as CanvasArc,
  Cache as CanvasCache,
  Rect as CanvasRect,
  Image as CanvasImage,
  Line as CanvasLine,
  Path as CanvasPath,
  Polygon as CanvasPolygon,
  Polyline as CanvasPolyline,
  Text as CanvasText,
  Group as CanvasGroup,
} from "@/layer/CanvasLayer";

import SvgLayer, {
  Circle as SvgCircle,
  Rect as SvgRect,
  Image as SvgImage,
  Line as SvgLine,
  Path as SvgPath,
  Polygon as SvgPolygon,
  Polyline as SvgPolyline,
  Text as SvgText,
  Group as SvgGroup,
} from "@/layer/SvgLayer";

import Plugin from "@/plugin/Plugin";

import CanvasGridLayer, {
  Circle as CanvasGridCircle,
  Rect as CanvasGridRect,
  Image as CanvasGridImage,
  Line as CanvasGridLine,
  Path as CanvasGridPath,
  Polygon as CanvasGridPolygon,
  Polyline as CanvasGridPolyline,
  Text as CanvasGridText,
} from "@/layer/grid/CanvasGridLayer";
import HtmlLayer from "@/layer/HtmlLayer";

// util
import {
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
  getSizeBySvg,
  getItemsBySvg,
  getElementsFrame,
  getItemByDomString,
  stringToDom,
} from "@/util/index";

// event
import { EventList } from "./core/Event";

import Matrix from "./basic/Matrix";
import Attrs from "./basic/Attrs";
import BBox from "./basic/BBox";
import Point from "./basic/Point";
import Item, { Shape } from "./item/index";
import { CanvasGraphic } from "@/graphic";

export {
  Stage,
  Layer,
  EventList,
  CanvasLayer,
  SvgLayer,
  CanvasGridLayer,
  HtmlLayer,
  // item
  ItemType,
  Circle,
  Arc,
  Cache,
  Rect,
  Image,
  Line,
  Path,
  Polygon,
  Polyline,
  Text,
  Group,
  // canvas layer
  CanvasCircle,
  CanvasArc,
  CanvasCache,
  CanvasImage,
  CanvasRect,
  CanvasLine,
  CanvasPath,
  CanvasPolygon,
  CanvasPolyline,
  CanvasText,
  CanvasGroup,
  // svg layer
  SvgCircle,
  SvgRect,
  SvgImage,
  SvgLine,
  SvgPath,
  SvgPolygon,
  SvgPolyline,
  SvgText,
  SvgGroup,
  // CanvasGrid layer
  CanvasGridCircle,
  CanvasGridRect,
  CanvasGridImage,
  CanvasGridLine,
  CanvasGridPath,
  CanvasGridPolygon,
  CanvasGridPolyline,
  CanvasGridText,
  // util
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
  getSizeBySvg,
  getItemsBySvg,
  getElementsFrame,
  getItemByDomString,
  stringToDom,
  // basic
  Attrs,
  Matrix,
  Item,
  Shape,
  BBox,
  Point,
  Plugin,
  TransformManager,
  CanvasGraphic,
};

export default Stage;
