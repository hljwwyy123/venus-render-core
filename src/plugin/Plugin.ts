import Stage from "@/Stage";
import Event from "@/core/Event";
import invariant from "invariant";

export default abstract class Plugin extends Event {
  public stage: Stage;
  public pluginId: string;
  public invoking: boolean;

  constructor(pluginId) {
    invariant(pluginId, "Plugin constructor need a pluginId");
    super({ pipeline: "plugin" });
    this.pluginId = pluginId;
    this.invoking = false;
  }

  /**
   * 唤醒插件
   * @param {pluginId} 插件id
   */
  public abstract invoke();

  /**
   * 挂起插件
   */
  public abstract revoke();
}
