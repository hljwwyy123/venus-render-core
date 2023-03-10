enum ItemType {
  Element = 0,
  SVG,
  TITLE,
  OTHER,

  GroupElement = 50,
  GROUP,

  GraphicsElement = 100, // Shape
  IMAGE,
  CACHE,
  PATH,

  TextElement = 110,
  TEXT,

  GeometryElement = 120,
  LINE,
  RECT,
  CIRCLE,
  POLYGON,
  POLYLINE,
  ARC,
}

export default ItemType;
