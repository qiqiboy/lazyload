lazyload
==========

> javascript节点惰性加载执行组件

> 注意：本组件并非专用于图片的延迟加载，还可以用于普通节点的延迟加载（事件执行）。

> 有问题欢迎微博交流http://weibo.com/qiqiboy

## 如何使用
```javascript
// 首先在页面中引入lazyload.js

/**
 * @param elem string 节点id
 *		  	   Element 节点对象
 *		  	   Array | imageCollection 一组图片的集合引用
 *			   jQuery jquery对象，比如lazyload($('img.lazy'));
 * @param cfg Object|Function {callback:function(){},container:window} 如果cfg是一个函数，则默认为回调函数
 */

LazyLoad=function(elem, callback){}

//调用
LazyLoad(elem,function(){});
LazyLoad($('img.lazy'),function(){});
LazyLoad([img,img1,img2[,...,imgN]],{callback:function(){},container:document.getElementById('container'));

//如果想用于图片lazyload
LazyLoad(elem,function(){
	this.src=this.getAttribute('data-original');
});

````

## demo地址
请点击http://u.boy.im/lazyload