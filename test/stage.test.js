import Stage from '../src/Stage.ts'
import SvgLayer from '../src/layer/SvgLayer';

describe('test stage API', () => {
  let stage;

  beforeAll(()=> {
    const container = document.createElement("div");
    container.style.width = '1000px';
    container.style.height = '1000px';
    document.body.appendChild(container)
    stage = new Stage({ container });
  });

  test('addLayer ', () => {
    const layer1 = new SvgLayer({name: 'layer1'});
    const layer2 = new SvgLayer({name: 'layer2'});
    stage.addLayer(layer1);
    stage.addLayer(layer2);
    expect(stage.layers.length).toBe(2);
  });

  test('add duplicate Layer failed', () => {
    expect(() => {
      const layer1 = new SvgLayer({ name: 'layer1' });
      stage.addLayer(layer1);
    }).toThrowError('Duplicate Layer name');
  });

  test('getLayer', () => {
    const layer = stage.getLayer('layer1');
    expect(layer.options.name).toBe('layer1');
  });
  test('removeLayer', () => {
    const layer = stage.getLayer('layer1');
    expect(stage.removeLayer(layer)).toBeTruthy();
  });

  test('remove a not exist layer', () => {
    const layer = stage.getLayer('none');
    expect(stage.removeLayer(layer)).not.toBeTruthy();
  });

  test('remove layer with layer name', () => {
    expect(stage.removeLayer('layer')).not.toBeTruthy();
  });
});