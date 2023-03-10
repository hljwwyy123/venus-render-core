// @ts-ignore
import { Stage, Layer, SvgLayer, CanvasLayer, CanvasGridLayer, Item, Circle } from 'aseat-core';
import { getItemsBySvg, getSizeBySvg } from "@/util/svg";
import { seatFactory } from "./seatFactory";

import "./demo.css";
class Demo {
  svgItem: [];
  clickItem: object;
  stageWidth: number;
  stageHeight: number;
  svgLayer: SvgLayer;
  seatLayer: Layer;
  stage: Stage;
  hoverSeat: Item;

  constructor(){
    this.stage = new Stage({
      container: document.querySelector('#aseat'),
      contentWidth: 0,
      contentHeight: 0,
      maxZoom: 2,
      dimensionWidth: 20000,
      dimensionHeight: 20000,
      zoomOpposite: true,
    });
    window['stage'] = this.stage;
    this.svgLayer = new SvgLayer();
    // this.seatLayer = new CanvasLayer();
    this.seatLayer = new CanvasGridLayer({ size: 60 });
    this.stage.addLayer(this.svgLayer);
    this.stage.addLayer(this.seatLayer);
    this.fetchSvg().then((res) => {
      const svgDom = res.model.svgDetail;
      this.initAseat(svgDom);
    });
  }

  fetchSvg() {
    const url = '/demo/test/mock.json'
    return new Promise((resolve, reject) => {
      fetch(url).then(res => { resolve(res.json())})
    })
  }

  initAseat(svgDom) {
    let items = getItemsBySvg(svgDom);
    items.forEach(item => {
      item.setAttrs({
        symbolid: '111',
        symboltype: '7',
        extendsAttr: ['symbolid', 'symboltype'],
      })
    })
    let svgSize: object= getSizeBySvg(svgDom);
    this.svgLayer.addItems(items);
    this.svgLayer.render();
    this.svgLayer.getRootNode().setAttribute("id", "svgLayer");
    this.stage.resize(this.stage.viewPortWidth, this.stage.viewPortHeight,svgSize.width, svgSize.height);
    this.attachEvent();
    seatFactory(this.seatLayer, 300, 300, 30, 30 )
  }

  attachEvent = () => {
    this.svgLayer.on("item:click",(e)=> {
      const fitItem = e.items[e.items.length - 1];
      console.log(fitItem)
      this.stage.fitBoxToViewport(fitItem._bounding);
    });
    this.stage.on("zoom", e => {
      console.log(e)
    });
    this.seatLayer.on("item:mouseenter", this.onMouseEnter);
    this.seatLayer.on("item:mouseleave", this.onMouseLeave);
  }

  onMouseEnter = e => {
    this.hoverSeat = e.item;
    // 备份mouseEnter 时座位原来的样式，mouseLeave的时候还原
    this.hoverSeat.setAttrs({
      fill: "green",
      strokeWidth: 3,
    });
    this.seatLayer.updateItem(this.hoverSeat);
    this.seatLayer.render();
  };

  onMouseLeave = () => {
    if (this.hoverSeat) {
      this.hoverSeat.setAttrs({
        fill: "red",
        strokeWidth: 1,
      });
      this.seatLayer.updateItem(this.hoverSeat);
      this.seatLayer.render();
      this.hoverSeat = null;
    }
  };

}

const demo = new Demo();
window['demo'] = demo