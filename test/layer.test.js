import Stage from '../src/Stage.ts'
import SvgLayer from '../src/layer/SvgLayer';
import CanvasLayer, { Circle } from '../src/layer/CanvasLayer';
import CanvasGridLayer from "../src/layer/grid/CanvasGridLayer";

describe('test Layer API', () => {

  test('createLayer without options', () => {
    const svgLayer = new SvgLayer();
    expect(svgLayer).toBeInstanceOf(SvgLayer);
  });

  test('create canvas Layer with name option', () => {
    const svgLayerWithName = new CanvasLayer({ name: 'layer_test' });
    expect(svgLayerWithName.options.name).toBe('layer_test');
  });

  test('createLayer with renderOption ', () => {
    const svgLayerWithName = new SvgLayer({ 
      name: 'layer_test', 
      renderOptions: { 
        transform: { 
          scale: 2 
        } 
      } 
    });
    expect(svgLayerWithName.options.renderOptions.transform.scale).toBe(2);
  });

  test('create canvasGridLayer', () => {
    const gridLayer = new CanvasGridLayer();
    expect(gridLayer).toBeInstanceOf(CanvasGridLayer)
  });

  test('create canvasGridLayer with size option', () => {
    const gridLayer = new CanvasGridLayer({ size: 2000 });
    expect(gridLayer.options.size).toBe(2000);
  });

  test('render cavnasGridLayer with no option', () => {
    const gridLayer = new CanvasGridLayer();
    gridLayer.render();
    expect(1).toBe(1);
  });

  test('render CanvasGridLayer with sync option', () => {
    const gridLayer = new CanvasGridLayer();
    gridLayer.render({ sync: true});
    expect(1).toBe(1);
  });

});