/**
 * 事件对象
 */
export interface IEventOptions {
  /**事件信道名称 */
  pipeline?: string;
}

interface DocumentEvent {
  srcEvent: MouseEvent; //	Source event object, type TouchEvent, MouseEvent or PointerEvent.
}

interface HammerEvent {
  deltaX: number; //	Movement of the X axis.
  deltaY: number; // Movement of the Y axis.
  deltaTime: number; //	Total time in ms since the first input.
  distance: number; //	Distance moved.
  angle: number; //	Angle moved.
  velocityX: number; //	Velocity on the X axis, in px/ms.
  velocityY: number; //	Velocity on the Y axis, in px/ms
  velocity: number; //	Highest velocityX/Y value.
  direction: number; //	Direction moved. Matches the DIRECTION constants.
  offsetDirection: number; //	Direction moved from it’s starting point. Matches the DIRECTION constants.
  scale: number; //	Scaling that has been done when multi-touch. 1 on a single touch.
  rotation: number; //	Rotation (in deg) that has been done when multi-touch. 0 on a single touch.
  center: number; //	Center position for multi-touch, or just the single pointer.
  pointerType: any;//	Primary pointer type, could be touch, mouse, pen or kinect.
  pointers: any[]; //	Array with all pointers, including the ended pointers (touchend, mouseup).
}

export interface IGestureEvent extends DocumentEvent, HammerEvent, MouseEvent {
  eventName: string;
  pageX: number;
  pageY: number;
}