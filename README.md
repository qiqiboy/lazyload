lazyload
==========

> javascript图片延迟加载组件

> 完整的实现需配合后端，简单来说就是输出到页面上的图片需要将src留空位置设置为一个临时小图片，真实的地址写到data-original属性中。

> 没有什么可配置项，因为很简单，不想把组件写复杂了，所以如果又需要修改data-attribute或者定义回调函数，可以自行fork修改下源码，以适合自己的项目使用。

> 有问题欢迎微博交流http://weibo.com/qiqiboy

## 如何使用
```javascript
// 首先在页面中引入lazyload.js

/**
 * @param img string 图片id或者某个节点id，如果是后者则会lazyload该节点下所有img
 *		  	  image 单个图片对象
 *		  	  Array | imageCollection 一组图片的集合引用
 *			  jQuery jquery对象，比如lazyload($('img.lazy'));
 */

lazyload=function(img){}

//调用
lazyload(img);
lazyload('imgID');
lazyload('elementID');
lazyload(parent.getElementsByTagName('img'));
lazyload($('img.lazy'));
lazyload([img,img1,img2[,...,imgN]]);

````

## demo地址
请点击http://u.boy.im/lazyload