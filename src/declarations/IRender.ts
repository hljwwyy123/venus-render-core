import Item from "../item/Item";
export interface IRenderData {
  addedList?: Item | Array<Item>;
  updatedList?: Item | Array<Item>;
  deletedList?: Item | Array<Item>;
  sync?: boolean;
}

export interface IRenderOptions {
  sync?: boolean;
}
export interface RootNodeData {
  width: number;
  height: number;
  x?: number;
  y?: number;
  row?: number;
  col?: number;
  name?: string;
  items?: Array<Item>;
}