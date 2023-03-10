function parseTransformation(m) {
  if (!m || m === "") {
    return 1;
  }
  const transformations = m.match(/(\w+?\s*\([^)]*\))/g);
  let mat = 1;
  if (transformations) {
    for (let i = transformations.length - 1; i >= 0; i--) {
      const parts = /(\w+?)\s*\(([^)]*)\)/.exec(transformations[i]);
      if (parts) {
        const name = parts[1].toLowerCase();
        const args = parts[2].match(/(?:\+|-)?(?:(?:\d*\.\d+)|(?:\d+))(?:e(?:\+|-)?\d+)?/g);
        switch (name) {
          case "matrix":
            mat *= parseFloat(args[0]);
            break;
          case "scale":
            mat *= parseFloat(args[0]);
            break;
          default:
        }
      }
    }
  }
  return mat;
}

function parseSvg(svg) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");

  const svgDom = doc.children[0];

  let viewBox = svgDom.getAttribute("viewBox");
  let width = svgDom.getAttribute("width");
  let height = svgDom.getAttribute("height");
  const transform = svgDom.getAttribute("transform");

  if (viewBox) {
    const [x, y, w, h] = viewBox.split(/\s/);
    width = w;
    height = h;
  } else {
    viewBox = `0 0 ${width} ${height}`;
  }

  return {
    viewBox,
    width: +width,
    height: +height,
    scale: parseTransformation(transform),
  };
}

export { parseSvg };
