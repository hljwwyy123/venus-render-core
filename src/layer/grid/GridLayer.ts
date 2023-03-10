import { ILayerOptions, IGridLayerOptions } from "../../declarations/ILayer";
import { RootNodeData } from "../../declarations/IRender";
import Layer from "../Layer";
import Render from "@/render/Render";
import Item from "@/item/index";
import pull from "lodash.pull";
import uniqBy from "lodash.uniqby";

export class GridLayer extends Layer {
  private gridSize: number;
  private gridMap: any;
  private gridNameMap: any;
  public removedGridNames: Array<string>;

  constructor(options?: IGridLayerOptions) {
    super(options);
    this.gridMap = {};
    this.gridNameMap = {};
    this.gridSize = (options && options.size > 0) ? options.size : 1000;
    this.renderEngine = [];
    this.removedGridNames = [];
  }

  public removeAllItem(): void {
    super.removeAllItem();
    Object.values(this.gridMap).map(grid => {
      grid.items.length = 0;
    });
    Object.values(this.gridNameMap).map(grid => {
      grid.items.length = 0;
    });
  }

  public removeItem(item: Item): void {
    super.removeItem(item);
    const gridNameMap = this.getGridMapByItem(item);
    Object.keys(gridNameMap).map(name => {
      if (!this.gridNameMap[name]) {
        this.gridNameMap[name] = gridNameMap[name];
      }
      //删除
      //1.修复关联grid的items
      item.relatedGridNames.map(gridName => {
        // this.gridNameMap[name].items
        pull(this.gridNameMap[gridName].items, item);
      });
    });
    item.relatedGridNames = Object.keys(gridNameMap);
  }

  /**
   * @override Layer.insertBeforeItem
   * @param item
   */
  public insertItem(item: Item): void {
    super.insertItem(item);
    const gridNameMap = this.getGridMapByItem(item);
    Object.keys(gridNameMap).map(name => {
      if (!this.gridNameMap[name]) {
        this.gridNameMap[name] = gridNameMap[name];
      }
      if (this.gridNameMap[name].items.indexOf(item) === -1) {
        this.gridNameMap[name].items.unshift(item);
      }
    });
    item.relatedGridNames = Object.keys(gridNameMap);
  }
  /**
   * @override Layer.addItem
   * @param item
   */
  public addItem(item: Item): void {
    super.addItem(item);
    const gridNameMap = this.getGridMapByItem(item);
    Object.keys(gridNameMap).map(name => {
      if (!this.gridNameMap[name]) {
        this.gridNameMap[name] = gridNameMap[name];
      }
      if (this.gridNameMap[name].items.indexOf(item) === -1) {
        this.gridNameMap[name].items.push(item);
      }
    });
    item.relatedGridNames = Object.keys(gridNameMap);
  }

  public updateItem(item: Item): void {
    super.updateItem(item);
    const gridNameMap = this.getGridMapByItem(item);
    // 找到之前关联的gridnames，如果不存在 则移除
    item.relatedGridNames.forEach(name => {
      if (!gridNameMap[name]) {
        pull(this.gridNameMap[name].items, item);
        if (this.removedGridNames.indexOf(name) === -1) {
          this.removedGridNames.push(name);
        }
      }
    });
    Object.keys(gridNameMap).map(name => {
      if (!this.gridNameMap[name]) {
        this.gridNameMap[name] = gridNameMap[name];
      }
      if (this.gridNameMap[name].items.indexOf(item) === -1 && this.items.indexOf(item) !== -1) {
        this.gridNameMap[name].items.push(item);
      }
    });
    item.relatedGridNames = Object.keys(gridNameMap);
  }

  /**
   * getGridSize
   * return number
   */
  public getGridSize(): number {
    return this.gridSize;
  }

  /**
   * setGridSize
   * @param size number
   */
  public set setGridSize(size: number) {
    this.gridSize = size;
  }

  /**
   * getGridMap
   * return any
   */
  public getGridMap(): any {
    return this.gridMap;
  }

  /**
   * setGridMap
   * @param map
   */
  public setGridMap(map: any) {
    this.gridMap = map;
  }

  public getGridMapByItem(item: Item): any {
    // console.log('this.removedGridNames:',this.removedGridNames)
    let gridLeftTop: RootNodeData = this.getColAndRow(item._bounding.x, item._bounding.y);
    let gridRightBottom: RootNodeData = this.getColAndRow(item._bounding.x + item._bounding.width, item._bounding.y + item._bounding.height);
    let restRowGridNum: number = gridRightBottom.row - gridLeftTop.row + 1;
    let restColGridNum: number = gridRightBottom.col - gridLeftTop.col + 1;
    const gridNameMap = {};
    for (let i = 0; i < restColGridNum; i++) {
      for (let j = 0; j < restRowGridNum; j++) {
        const name = gridLeftTop.row + j + "-" + (gridLeftTop.col + i);
        if (!gridNameMap[name]) {
          let restGrid: RootNodeData = {
            width: this.gridSize + 2,
            height: this.gridSize + 2,
            x: (gridLeftTop.row + j) * this.gridSize,
            y: (gridLeftTop.col + i) * this.gridSize,
            row: gridLeftTop.row + j,
            col: gridLeftTop.col + i,
            name,
            items: [],
          };
          gridNameMap[name] = restGrid;
        }
      }
    }
    return gridNameMap;
  }

  /**
   * 获取元素所在网格，一个对象最多可能在四个网格
   * return {newGrids, Grids}
   * @param item
   */
  public getGridsByItem(item: Item): Array<Render> {
    let grids: Array<Render> = [];
    let gridNameMap: any = {};
    let gridLeftTop: RootNodeData = this.getColAndRow(item._bounding.x, item._bounding.y);
    let gridRightBottom: RootNodeData = this.getColAndRow(item._bounding.x + item._bounding.width, item._bounding.y + item._bounding.height);
    let restRowGridNum: number = gridRightBottom.row - gridLeftTop.row + 1;
    let restColGridNum: number = gridRightBottom.col - gridLeftTop.col + 1;
    for (let i = 0; i < restColGridNum; i++) {
      for (let j = 0; j < restRowGridNum; j++) {
        const name = gridLeftTop.row + j + "-" + (gridLeftTop.col + i);
        let restGrid: RootNodeData = {
          width: this.gridSize + 2,
          height: this.gridSize + 2,
          x: (gridLeftTop.row + j) * this.gridSize,
          y: (gridLeftTop.col + i) * this.gridSize,
          row: gridLeftTop.row + j,
          col: gridLeftTop.col + i,
          name,
        };
        gridNameMap[name] = restGrid;
      }
    }
    for (const gName in gridNameMap) {
      let grid = this.gridMap[gName];
      if (!grid) {
        grid = this.gridMap[gName] = this.createGridView({
          ...gridNameMap[gName],
          items: (this.gridNameMap[gName] && this.gridNameMap[gName].items) || [],
        });
        this.getView().appendChild(grid.rootNode);
        if (!(this.renderEngine instanceof Render)) {
          this.renderEngine.push(grid);
        }
      }
      grids.push(grid);
    }
    return grids;
  }

  /**
   * 获取 point 所在 grid
   * @param x
   * @param y
   */
  public getGridByPoint(x: number, y: number): object {
    const gridName = this.getGridName(x, y);
    return this.gridMap[gridName];
  }
  /**
   * 重写基类Layer histTest
   * 碰撞point所在grid里的items
   *
   * @param x 碰撞点 X 坐标
   * @param y 碰撞点 Y 坐标
   * @returns 碰撞的item
   *
   */
  public hitTest(x: number, y: number): Array<Item> {
    let els: Array<Item> = [];
    let grid = this.getGridByPoint(x, y);
    if (!grid) return;
    let gridItems = this.getGridByPoint(x, y).items || [];
    for (let i = 0; i < gridItems.length; i++) {
      const el: Item = gridItems[i];
      if (el.isPointInside(x, y)) {
        els.push(el);
      }
    }
    return els;
  }

  /**
   * 创建网格基础
   * @param {*} coord
   * @param {*} cr
   */
  public createGridView(cr: RootNodeData): Render {
    let render: Render;
    return render;
  }

  /**
   * 获取网格名称
   * @param {*} x
   * @param {*} y
   * return string
   */
  private getGridName(x: number, y: number): string {
    let cr: any;
    cr = this.getColAndRow(x, y);
    return cr.row + "-" + cr.col;
  }

  /**
   * 获取网格行列
   * @param {*} x
   * @param {*} y
   * return {row, col}
   */
  private getColAndRow(x: number, y: number): RootNodeData {
    let root: RootNodeData = {
      row: Math.floor(x / this.gridSize),
      col: Math.floor(y / this.gridSize),
      width: this.gridSize,
      height: this.gridSize,
      x: Math.floor(x / this.gridSize) * this.gridSize,
      y: Math.floor(y / this.gridSize) * this.gridSize,
    };
    return root;
  }
}
