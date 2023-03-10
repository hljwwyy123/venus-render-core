## [0.1.1] 2020-11-05 @大来
### Change
- Item 修改 @大来
    - Item 的 _parent 变为 _layer
    - Item 增加 setLayer() 方法
    - Item 增加 _ref 变量 setRef() 和 getRef() 方法
- package 修改 @大来
    - license 修改为 MIT
    - 去掉 EventEmitter 的依赖

## [0.1.2] 2020-12-01 @达仁
### Change
- 修改打包方式，esm

## [0.1.3] 2020-12-07 @达仁
### Change
- Layer render option
- Layer addItem 删除去重校验
- CanvasRender gridCanvas renderItem 坐标转换
- Stage 增加 mouseMoveContainer option
- Interface 目录修改

## [0.1.4] 2020-12-22 @达仁

- Stage fitBoxToViewport 越界处理
## [0.1.5] 2021-02-08 @大来 @弋辰

- 优化 attrs() 方法
- 增加svg基础图形path、polygon、rect的扩展属性{data-xxx}
- stag初始化增加zoomOpposite开关，控制缩放是否反向
## [0.1.6] 2021-02-20 @大来
- 优化 attrs() 引发的 camel命名的bug（getItemBySvg text font-size）

## [0.1.7] 2021-02-20 @达仁
- SVGRender renderItem graphics断言修改

## [0.1.8] 2021-02-24 @达仁
- 修复 setAttrs()的bugs @大来
- SvgRender 增加item.render() 的容错处理
- SvgRender 修复strokeWidth 的bug
