/**
 * easy-lazyload v1.1
 * By qiqiboy, http://www.qiqiboy.com, http://weibo.com/qiqiboy, 2014/01/26
 */

;
(function(ROOT, NS, Struct, undefined){
	"use strict";
	
	var win=window,
		ret=[],
		bind=false,
		timer=null,
		tick=function(){
			var i=0,
				doc=document.documentElement,
				body=document.body;
			/* tick由浏览器resize或者scroll时触发，所以此刻更新相关数值 */
			WST=win.pageYOffset || doc&&doc.scrollTop || body.scrollTop || 0;
			WSL=win.pageXOffset || doc&&doc.scrollLeft || body.scrollLeft || 0;
			WH=win.innerHeight || doc&&doc.clientHeight || body.clientHeight || 0;
			WW=win.innerWidth || doc&&doc.clientWidth || body.clientWidth || 0;

			while(i<ret.length){
				ret[i].length?ret[i++].check():ret.splice(i,1);
			}

			!ret.length && (bind=!removeEvent()); //队列为空则取消事件绑定
		},
		getOffset=function(elem){
			var top=0,left=0,offset;
			while(elem){
				if("getBoundingClientRect" in elem){
					offset=elem.getBoundingClientRect();
					top=offset.top+WST;
					left=offset.left+WSL;
					elem=null;
				}else{//maybe need ???
					left+=elem.offsetLeft||0;
					top+=elem.offsetTop||0;
					elem=elem.offsetParent;
				}
			}
			return {top:top,left:left};
		},
		resize=function(){
			clearTimeout(timer);
			timer=setTimeout(tick,100);
		},
		addEvent=function(){
			try{
				if(win.addEventListener){
					win.addEventListener('resize',resize,false);
					win.addEventListener('scroll',resize,false);
				}else{
					win.attachEvent('onresize',resize);
					win.attachEvent('onscroll',resize);
				}
			}catch(e){
				return false;
			}
			return true;
		},
		removeEvent=function(){
			try{
				if(win.removeEventListener){
					win.removeEventListener('resize',resize,false);
					win.removeEventListener('scroll',resize,false);
				}else{
					win.detachEvent('onresize',resize);
					win.detachEvent('onscroll',resize);
				}
			}catch(e){
				return false;
			}
			return true;
		},
		WST,WSL,WW,WH;//浏览器scrollTop scrollLeft innerWidth innerHeight
		
	Struct.fn=Struct.prototype={
		length:0,
		splice:[].splice,
		init:function(elem, func){
			if(typeof elem == 'string'){
				elem=document.getElementById(elem);
			}
			this.merge(elem);
			this.cb=func||function(){//默认回调为替换图片src
				if(this.nodeName.toLowerCase()=='img')
					this.src=this.getAttribute('data-original');
			};
			if(this.length){
				ret.push(this);
				resize();
				!bind && (bind=addEvent())
			}
			return this;
		},
		merge:function(elem){
			var arr=[],
				type=typeof elem,
				i=this.length,
				j=0;
			if(elem){
				arr=type!='function' && type!='string' && (elem.length===0 || elem.length && (elem.length-1) in elem) ? elem : [elem];
				while(j<arr.length){
					if(arr[j] && arr[j].nodeType==1)//确保是DOM节点
						this[i++]=arr[j++];
				}
				this.length=i;
			}
			return this;
		},
		check:function(){
			var i=0,
				elem,
				offset;
			while(i<this.length){
				elem=this[i];
				offset=getOffset(elem);
				if(offset.top+elem.offsetHeight>WST && offset.top<WST+WH && offset.left+elem.offsetWidth>WSL && offset.left<WSL+WW){
					this.cb.call(this.splice(i,1)[0]);
				}else i++;
			}
			return this;
		}
	}
	
	Struct.fn.init.prototype=Struct.fn;
	
	return ROOT[NS]=Struct;
	
})(window, 'LazyLoad',function(elem, func){
	return new arguments.callee.fn.init(elem, func);
});