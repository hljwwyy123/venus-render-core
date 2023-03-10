/*
 * @Author: daren
 * @Date: 2019-11-19
 */
import { IEventOptions } from "../declarations/IEvent";
import { EventEmitter } from "events";

export default class Event extends EventEmitter {
  // readonly event: EventEmitter;
  namespace: string; // 信道
  constructor(name: IEventOptions) {
    super();
    this.namespace = name.pipeline;
    // this.event = new EventEmitter();
  }

  /**
   * 发送事件
   * @param  {string} event - 事件名称
   * @param  {any} ...arg
   * @returns boolean
   */
  emit(event: string, ...arg: any): boolean {
    let eventName = event.includes(":") ? event : `${this.namespace}:${event}`;
    return super.emit(eventName, ...arg);
  }
  /**
   * 监听事件
   * @param  {string} event
   * @param  {(...args:any[])=>void} listener
   */
  on(event: string, listener: (...args: any[]) => void) {
    let eventName = "";
    const eventList = event.toString().split(" ");
    if (eventList.length > 1) {
      // 监听多个事件
      eventList.forEach(e => {
        eventName = e.includes(":") ? e : `${this.namespace}:${e}`;
        super.on(eventName, listener);
      });
    } else {
      eventName = event.includes(":") ? event : `${this.namespace}:${event}`;
      return super.on(eventName, listener);
    }
  }

  /**
   * 监听一次事件,监听一次之后立即销毁
   * @param  {string} event
   * @param  {(...args:any[])=>void} listener
   */
  once(event: string, listener: (...args: any[]) => void) {
    let eventName = event.includes(":") ? event : `${this.namespace}:${event}`;
    return super.once(eventName, listener);
  }
  /**
   * 移除事件监听
   * @param  {string} event
   * @param  {(...args:any[])=>void} listener
   */
  off(event: string, listener: (...args: any[]) => void) {
    let eventName = "";
    const eventList = event.toString().split(" ");
    if (eventList.length > 1) {
      // 监听多个事件
      eventList.forEach(e => {
        eventName = e.includes(":") ? e : `${this.namespace}:${e}`;
        super.off(eventName, listener);
      });
    } else {
      eventName = event.includes(":") ? event : `${this.namespace}:${event}`;
      return super.off(eventName, listener);
    }
  }
}

export enum EventList {
  CLICK = "click",
  DBCLICK = "dbclick",
  RIGHTCLICK = "rightclick",
  MOUSEMOVE = "mousemove",
  PANSTART = "panstart",
  PAN = "pan",
  PANEND = "panend",
  ZOOM = "stage:zoom",
  ITEMMOUSEENTER = "item:mouseenter",
  ITEMMOUSELEAVE = "item:mouseenter",
}
