import { Circle, Image, Line, Other, Path, Polygon, Polyline, Rect, Text } from "@/item/index";
import { isString } from "@/util/index";
import Item from "@/item/Item";
import { Matrix } from "@/index";

export function getSizeBySvg(svg): object {
  let el: object = getSvgByAny(svg);
  let width = el.getAttribute("width") || 0;
  let height = el.getAttribute("height") || 0;
  let viewBox = el.getAttribute("viewBox");
  const transform = el.getAttribute("transform");
  if (viewBox) {
    let vArr = [];
    if (viewBox.indexOf(",") > -1) {
      vArr = viewBox.split(",");
    } else {
      vArr = viewBox.split(" ");
    }
    const vw = parseFloat(vArr[2]);
    const vh = parseFloat(vArr[3]);

    width = Math.max(vw, width);
    height = Math.max(vh, height);
  } else {
    viewBox = `0 0 ${width} ${height}`;
  }

  const size = { width, height, viewBox, scale: parseTransformation(transform) };
  return size;
}

/**
 * 解析transformations,IE坑爹
 * @param {*} m
 */
function parseTransformation(m) {
  if (!m || m === "") {
    return 1;
  }

  const transformations = m.match(/(\w+?\s*\([^)]*\))/g);

  let mat = 1;

  if (transformations) {
    for (let i = transformations.length - 1; i >= 0; i--) {
      const parts = /(\w+?)\s*\(([^)]*)\)/.exec(transformations[i]);
      if (parts) {
        const name = parts[1].toLowerCase();
        const args = parts[2].match(/(?:\+|-)?(?:(?:\d*\.\d+)|(?:\d+))(?:e(?:\+|-)?\d+)?/g);

        switch (name) {
          case "matrix":
            mat = mat * parseFloat(args[0]);
            break;
          case "scale":
            mat = mat * parseFloat(args[0]);
            break;
          default:
        }
      }
    }
  }
  return mat;
}

export function getItemByDomString(domString: string): Text {
  const parser = new DOMParser();
  const doc = parser.parseFromString(domString, "image/svg+xml");
  const text = doc.children[0];
  return new Text({
    x: Number(text.getAttribute("x")),
    y: Number(text.getAttribute("y")),
    symbolid: Number(text.getAttribute("symbolid")),
    symboltype: Number(text.getAttribute("symboltype")),
    text: text.innerHTML,
  });
}

export function stringToDom(domString: string): any {
  const parser = new DOMParser();
  const doc = parser.parseFromString(domString, "image/svg+xml");
  return doc.children[0];
}

function parseMatrix(transform) {
  const matrix = new Matrix();
  if (transform && transform.indexOf("matrix(") === 0) {
    const m = transform.substring("matrix(".length, transform.length - 1);
    const [a, b, c, d, e, f] = m.split(/, *| +/).map(i => +i);
    matrix.setTransform(a, b, c, d, e, f);
  }
  return matrix;
}

export function getItemsBySvg(svg: any): Item[] {
  let el: any = getSvgByAny(svg);
  let items: Item[] = [];
  let childs: any = el.children;

  for (let child of childs) {
    let item: Item;
    // let style: string = child.getAttribute("style");
    let styleMap: any = {};
    for (let key of child.getAttributeNames()) {
      if (child.getAttribute(key)) styleMap[key] = child.getAttribute(key);
      if (key === "style") {
        let styleItems: string[] = child.getAttribute(key).split(";");
        for (let styleItem of styleItems) {
          if (styleItem && styleItem.split(":").length > 1) {
            styleMap[styleItem.split(":")[0].trim()] = styleItem.split(":")[1].trim();
          }
        }
      }
    }
    // if(style) {
    //   let styleItems: string[] = style.split(";");
    //   for (let styleItem of styleItems) {
    //     styleMap[styleItem.split(":")[0]] = styleItem.split(":")[1];
    //   }
    // }
    if (child.localName === "path") {
      item = new Path({
        d: child.getAttribute("d"),
        ...styleMap,
      });
    } else if (child.localName === "rect") {
      // console.log(styleMap)
      item = new Rect({
        ...styleMap,
        x: Number(child.getAttribute("x")),
        y: Number(child.getAttribute("y")),
        width: Number(child.getAttribute("width")),
        height: Number(child.getAttribute("height")),
      });
    } else if (child.localName === "line") {
      item = new Line({
        ...styleMap,
        x1: Number(child.getAttribute("x1")),
        y1: Number(child.getAttribute("y1")),
        x2: Number(child.getAttribute("x2")),
        y2: Number(child.getAttribute("y2")),
      });
    } else if (child.localName === "circle") {
      item = new Circle({
        ...styleMap,
        cx: Number(child.getAttribute("cx")),
        cy: Number(child.getAttribute("cy")),
        r: Number(child.getAttribute("r")),
      });
    } else if (child.localName === "text") {
      styleMap["fontSize"] = parseInt((styleMap["font-size"] || styleMap["fontSize"]), 10);
      item = new Text({
        ...styleMap,
        matrix: parseMatrix(styleMap.transform),
        x: Number(child.getAttribute("x")),
        y: Number(child.getAttribute("y")),
        text: child.textContent,
      });
    } else if (child.localName === "polygon") {
      item = new Polygon({
        ...styleMap,
        points: child.getAttribute("points"),
      });
    } else if (child.localName === "polyline") {
      item = new Polyline({
        ...styleMap,
        points: child.getAttribute("points"),
      });
    } else if (child.localName === "image") {
      item = new Image({
        ...styleMap,
        x: Number(child.getAttribute("x")),
        y: Number(child.getAttribute("y")),
        width: Number(child.getAttribute("width")),
        height: Number(child.getAttribute("height")),
        src: child.getAttribute("xlink:href"),
        "xlink:href": child.getAttribute("xlink:href"),
      });
    } else {
      let attrs: object = {};
      for (let attributeName of child.getAttributeNames()) {
        attrs[attributeName] = child.getAttribute(attributeName);
      }
      item = new Other(child.tagName, attrs);
    }
    item.setAttrs({
      isLoad: false,
      symbolid: child.getAttribute("symbolid"),
      symboltype: child.getAttribute("symboltype"),
    });
    items.push(item);
  }
  return items;
}

function getSvgByAny(svg: any): Object {
  if (isString(svg)) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    return doc.getElementsByTagName("svg")[0];
  } else {
    return svg;
  }
}
