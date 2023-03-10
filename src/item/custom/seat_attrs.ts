export const dataKeys = ["id", "standId", "floorId", "areaId", "blockId", "rowId", "entranceId", "name", "sort", "rowSort", "seatType", "rowType", "editType", "seatList", "spec"];
export const seatKeys = [
  "xCoord",
  "yCoord",
  "showLabel",
  "logicName",
  "fontSize",
  "fontStroke",
  "fontFill",
  "fontDrawable",
  "fill",
  "stroke",
  "strokeWidth",
  "drawable",
  "arcFill",
  "arcStroke",
  "arcStrokeWidth",
  "arcDrawable",
];

const textWidth = 7;
const textHeight = 14;
const seatSize = 12;

export function decomposeSeat(attrs) {
  return [
    {
      cx: attrs.xCoord + seatSize,
      cy: attrs.yCoord + seatSize,
      r: seatSize,
      startAngle: 0,
      endAngle: 6.283185307179586,
      fill: attrs.fill,
      stroke: attrs.stroke,
      strokeWidth: attrs.strokeWidth,
    },
    {
      cx: attrs.xCoord + seatSize,
      cy: attrs.yCoord + seatSize,
      r: seatSize,
      startAngle: 4.71238898038469,
      endAngle: 6.283185307179586,
      fill: attrs.arcFill,
      stroke: attrs.arcStroke,
      strokeWidth: attrs.arcStrokeWidth,
    },
    {
      x: attrs.xCoord + seatSize - (textWidth / 2) * attrs.logicName.length,
      y: attrs.yCoord + seatSize - textHeight / 2,
      text: attrs.logicName,
      fontSize: attrs.fontSize,
      stroke: attrs.fontStroke,
      fill: attrs.fontFill,
    },
  ];
}
