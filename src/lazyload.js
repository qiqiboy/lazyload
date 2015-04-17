/**
 * easy-lazyload v1.5
 * By qiqiboy, http://www.qiqiboy.com, http://weibo.com/qiqiboy, 2014/08/22
 */

;
(function(ROOT, NS, Struct, undefined){
	"use strict";
	
	var DOC=ROOT.document,
		getOffset=function(elem){
			var top=0,left=0,offset;
			if("getBoundingClientRect" in elem){
				offset=elem.getBoundingClientRect();
				top=offset.top+WST;
				left=offset.left+WSL;
			}else{//maybe need ???
				top+=elem.scrollTop||0;
				left+=elem.scrollLeft||0;
				while(elem){
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
				return elem.lazyData||(elem.lazyData={ret:[],bind:null,lastTime:0,tick:function(){
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
					var data=Data(elem),
                        now=+new Date;
					if(now-data.lastTime>100){
                        data.lastTime=now;
                        data.tick();
                    }
				}});
			}
			if(value==null){
				return Data(elem)[key];
			}
			return Data(elem)[key]=value;
		},
        isHidden=function(elem){
            var doc=DOC.documentElement;
            return (elem.currentStyle||getComputedStyle(elem,null)||elem.style).display=='none' || doc!==elem && !(
				doc.contains ? doc.contains(elem) : doc.compareDocumentPosition && doc.compareDocumentPosition(b)&16
			);
        },
		WST=0,WSL=0;
			
	Struct.fn=Struct.prototype={
		constructor:Struct,
		length:0,
		splice:[].splice,
		dcb:function(){//默认回调函数
			var orig=this.getAttribute('data-original');
			if(orig)this.src=orig;
		},
		init:function(elem, range, callback){
			var container,
				type=typeof range;

			if(type=='function'){
				callback=range;
			}else if(type=='object'){
				callback=range.callback;
				container=range.container;
				range=range.range;
				if(this.isArrayLike(container)){
					container=container[0];
				}
				if(typeof container=='string'){
					container=DOC.getElementById(container);
				}
				if(container==null||container.nodeType!=1||container.nodeName.toLowerCase()=='body'||container.nodeName.toLowerCase()=='html'){
					container=ROOT;
				}
			}

			this.cb=callback||this.dcb;
			this.range=parseFloat(range)||0;
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
		isArrayLike:function(elem){
			var type=typeof elem;
			return !!elem && type!='function' && type!='string' && (elem.length===0 || elem.length && (elem.length-1) in elem);
		},
		merge:function(elem){
			var i=this.length,
				j=0,
				arr=this.isArrayLike(elem) ? elem : [elem];
			while(j<arr.length){
				if(arr[j] && arr[j].nodeType==1)//确保是DOM节点
					this[i++]=arr[j];
				j++;
			}
			this.length=i;
			return this;
		},
		check:function(){
			var i=0,range=this.range,
				data=Data(this.container),
				elem,
				offset;
			while(i<this.length){
				elem=this[i];
				offset=getOffset(elem);
				if(!isHidden(elem) && offset.top+elem.offsetHeight+range>=data.WST && offset.top-range<=data.WST+data.WH && offset.left+elem.offsetWidth+range>=data.WSL && offset.left-range<=data.WSL+data.WW){
					this.cb.call(this.splice(i,1)[0]);
				}else i++;
			}
			return this;
		},
        empty:function(){
            this.length=0;
            return this;
        }
	}
	
	Struct.fn.init.prototype=Struct.fn;
	
	return ROOT[NS]=Struct;
	
})(window, 'LazyLoad',function(elem, range, callback){
	return new arguments.callee.fn.init(elem, range, callback);
});
