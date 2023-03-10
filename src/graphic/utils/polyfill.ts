// if (typeof window !== 'undefined') {
// it's safe to use window now
const _SVGGraphicsElement = window.SVGGraphicsElement || window.SVGElement;
const originalSetAttribute = _SVGGraphicsElement.prototype.setAttribute;
_SVGGraphicsElement.prototype.setAttribute = function (key, value) {
  const oldValue = this.getAttribute(key);
  if (oldValue !== value) {
    originalSetAttribute.call(this, key, value);
  }
};
_SVGGraphicsElement.prototype.setStyle = function (key, value) {
  const oldValue = this.style[key];
  if (oldValue !== value) {
    this.style[key] = value;
  }
};
// }
