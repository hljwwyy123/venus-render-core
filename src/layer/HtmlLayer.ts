import { ILayerOptions } from "../declarations/ILayer";
import { RootNodeData } from "../declarations/IRender";
import Layer from "@/layer/Layer";
import HtmlRender from "@/render/HtmlRender";

export default class HtmlLayer extends Layer {
  constructor(option?: ILayerOptions) {
    super(option);
  }

  /**
   * 重写父类 创建渲染器 功能
   */
  public createRender() {
    this.renderEngine = new HtmlRender(this.getItems(), {
      width: this.getStage().width,
      height: this.getStage().height,
    });
  }
}
