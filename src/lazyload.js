/**
 * easy-lazyload v1.1
 * By qiqiboy, http://www.qiqiboy.com, http://weibo.com/qiqiboy, 2014/01/26
 */

;
(function(ROOT, NS, Struct, undefined){
	"use strict";
	
	var DOC=ROOT.document,
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
		addEvent=function(elem){
			try{
				var win=ROOT,
					resize=Data(elem,'resize');
				if(win.addEventListener){
					win.addEventListener('resize',resize,false);
					elem.addEventListener('scroll',resize,false);
				}else{
					win.attachEvent('onresize',resize);
					elem.attachEvent('onscroll',resize);
				}
			}catch(e){
				return false;
			}
			return true;
		},
		removeEvent=function(elem){
			try{
				var win=ROOT,
					resize=Data(elem,'resize');
				if(win.removeEventListener){
					win.removeEventListener('resize',resize,false);
					elem.removeEventListener('scroll',resize,false);
				}else{
					win.detachEvent('onresize',resize);
					elem.detachEvent('onscroll',resize);
				}
			}catch(e){
				return false;
			}
			return true;
		},
		Data=function(elem, key, value){
			if(key==null){
				return elem.lazyData||(elem.lazyData={ret:[],bind:null,timer:null,tick:function(){
					var i=0,
						win=elem,
						data=Data(win),
						doc=DOC.documentElement,
						body=DOC.body,
						isWin=win!=null&&win==win.window;
					/* tick由浏览器resize或者scroll时触发，所以此刻更新相关数值 */
					data.WST=(isWin ? win.pageYOffset || doc&&doc.scrollTop || body.scrollTop : getOffset(win).top) || 0;
					data.WSL=(isWin ? win.pageXOffset || doc&&doc.scrollLeft || body.scrollLeft : getOffset(win).left) || 0;
					data.WH=(isWin ? win.innerHeight || doc&&doc.clientHeight || body.clientHeight : win.clientHeight) || 0;
					data.WW=(isWin ? win.innerWidth || doc&&doc.clientWidth || body.clientWidth : win.clientWidth) || 0;
					
					if(isWin){
						WST=data.WST;
						WSL=data.WSL;
					}
					
					while(i<data.ret.length){
						data.ret[i].length?data.ret[i++].check():delete data.ret.splice(i,1)[0].checking;
					}
		
					!data.ret.length && (data.bind=!removeEvent(win)); //队列为空则取消事件绑定
				},resize:function(){
					var data=Data(elem);
					clearTimeout(data.timer);
					data.timer=setTimeout(data.tick,100);
				}});
			}
			if(value==null){
				return Data(elem)[key];
			}
			return Data(elem)[key]=value;
		},
		WST=0,WSL=0;
			
	Struct.fn=Struct.prototype={
		length:0,
		splice:[].splice,
		dcb:function(){//默认回调函数
			var orig=this.getAttribute('data-original');
			if(orig)this.src=orig;
		},
		init:function(elem, cfg){
			var func,container,
				type=typeof cfg;
			if(type=='function'){
				func=cfg;
			}else if(type=='object'){
				func=cfg.callback;
				container=cfg.container==null||
					cfg.container.nodeType!=1||
					cfg.container.nodeName.toLowerCase()=='body'||
					cfg.container.nodeName.toLowerCase()=='html' ?
					0 : cfg.container;
			}
			this.cb=func||this.dcb;
			this.container=container||ROOT;
			return this.push(elem);
		},
		push:function(elem){
			if(typeof elem == 'string'){
				elem=DOC.getElementById(elem);
			}
			this.merge(elem);
			if(this.length){
				var data=Data(this.container);
				if(!this.checking){
					data.ret.push(this);
					this.checking=true;
				}
				data.resize();
				!data.bind && (data.bind=addEvent(this.container))
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
				data=Data(this.container),
				elem,
				offset;
			while(i<this.length){
				elem=this[i];
				offset=getOffset(elem);
				if(offset.top+elem.offsetHeight>=data.WST && offset.top<=data.WST+data.WH && offset.left+elem.offsetWidth>=data.WSL && offset.left<=data.WSL+data.WW){
					this.cb.call(this.splice(i,1)[0]);
				}else i++;
			}
			return this;
		}
	}
	
	Struct.fn.init.prototype=Struct.fn;
	
	return ROOT[NS]=Struct;
	
})(window, 'LazyLoad',function(elem, cfg){
	return new arguments.callee.fn.init(elem, cfg);
});