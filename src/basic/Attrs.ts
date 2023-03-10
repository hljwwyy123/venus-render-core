export default class Attrs {
  mount: object; // 挂载点
  origin: object;
  merged: object;

  added: Set<string>;
  modified: Set<string>;
  deleted: Set<string>;

  public constructor(mount: object) {
    this.mount = mount;
    this.origin = {};
    this.merged = {};
    this.added = new Set();
    this.modified = new Set();
    this.deleted = new Set();
  }

  public getAttrs(): object {
    return this.merged;
  }

  public setAttrs(origin: object, attrs: object, deleted: object) {
    this.merged = this.merge(origin, attrs, deleted);
    this.diff(origin, this.merged, deleted);
    this.writeAttrs(this.merged, deleted);
  }

  public getDifference(): object {
    const { origin, merged, added, modified, deleted } = this;
    return { origin, merged, added, modified, deleted };
  }

  public clearDifference(): void {
    this.origin = this.merged;
    this.added.clear();
    this.modified.clear();
    this.deleted.clear();
  }

  public writeAttrs(attrs: object, deleted: object): void {
    for (let key in attrs) {
      if (!key.startsWith("_")) {
        this.mount[key] = attrs[key];
      }
    }

    for (let key in deleted) {
      if (!key.startsWith("_")) {
        if (this.mount[key] !== undefined) delete this.mount[key];
      }
    }
  }

  /**
   *
   * @param origin
   * @param merged
   * @param deleted
   */
  private diff(origin: object, merged: object, deleted: object): void {
    for (let key in merged) {
      if (origin[key] === undefined) {
        this.added.add(key);
      } else if (merged[key] !== origin[key]) {
        this.modified.add(key);
      }
    }

    for (let key in deleted) {
      this.deleted.add(key);
    }
  }

  merge(origin: object, modified: object, deleted: object): object {
    const mergedAttrs = { ...origin, ...modified };
    for (let key in deleted) if (mergedAttrs[key] !== undefined) delete mergedAttrs[key];
    return mergedAttrs;
  }
}
