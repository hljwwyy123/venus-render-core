# 概述

## 这是一个图形渲染库 支持2d、webgl和SVG渲染模式
### 对大数据量渲染做了性能保障
#### 垂直分层和横向切片

## 插件机制

### 支持插件的热插拔机制


## 借助 react-reconclier 获得更友好的开发体验

```
import { Stage, SvgLayer,CanvasLayer,  Circle, Rect, Text } from 'venue-render-core';

const App = ()=>{
	return (<Stage contentWidth={400} contentHeight={400}>
		<SvgLayer>
			<Circle cx={10} cy={10} r={5} fill="red"/>
		</SvgLayer>
	</Stage>)sou
}s

```