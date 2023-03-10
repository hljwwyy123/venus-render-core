import { Circle, Image, Line, Path, Polygon, Polyline, Rect, Svg, Text, Title } from "@/item/index";

function getDomAttrs(dom) {
  const attrs = {};
  const styleAttrs = {};

  dom.getAttributeNames().forEach(name => {
    if (name === "style") {
      dom
        .getAttribute(name)
        .split(";")
        .forEach(sty => {
          const kv = sty
            .trim()
            .split(":")
            .map(s => s.trim());
          if (kv.length === 2) styleAttrs[kv[0]] = kv[1];
        });
    } else {
      const names = name
        .trim()
        .split(":")
        .map(kv => kv.trim());
      if (names.length === 1) attrs[name] = dom.getAttribute(name);
      else if (names.length === 2) attrs[names[1]] = dom.getAttribute(name);
    }
  });

  return { ...attrs, ...styleAttrs };
}

function creatShapeByTagName(tagName, dom) {
  const attrs = getDomAttrs(dom);

  switch (tagName) {
    case "text":
      attrs.text = dom.innerHTML;
      break;

    case "image":
      if (attrs.href && !attrs.src) attrs.src = attrs.href;
      break;

    default:
      break;
  }

  return createShape(tagName, attrs);
}

function createShape(name, attrs) {
  let shape;

  switch (name) {
    case "circle":
      shape = new Circle(attrs);
      break;

    case "rect":
      shape = new Rect(attrs);
      break;

    case "line":
      shape = new Line(attrs);
      break;

    case "path":
      shape = new Path(attrs);
      break;

    case "polygon":
      shape = new Polygon(attrs);
      break;

    case "polyline":
      shape = new Polyline(attrs);
      break;

    case "text":
      shape = new Text(attrs);
      break;

    case "image":
      shape = new Image(attrs);
      break;

    case "svg":
      shape = new Svg(attrs);
      break;

    case "title":
      shape = new Title(attrs);
      break;

    default:
      break;
  }

  return shape;
}

function parseSvgDom(svg) {
  const children = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");

  const svgDom = doc.children[0];
  for (let i = 0; i < svgDom.children.length; i++) {
    const dom = svgDom.children[i];
    const tagName = dom.tagName;
    const shape = creatShapeByTagName(tagName, dom);
    if (shape) children.push(shape);
    else console.log("error!", tagName, dom);
  }

  return children;
}

export { getDomAttrs, parseSvgDom, creatShapeByTagName };
