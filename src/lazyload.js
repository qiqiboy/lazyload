/**
 * easy-lazyload v1.0
 * By qiqiboy, http://www.qiqiboy.com, http://weibo.com/qiqiboy, 2013/12/27
 */
 
var lazyload=(function(){
	var win=window,
		ret=[],
		bind=false,
		timer=null,
		original='data-original',//如果图片地址所在属性名不同，可修改此选项
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
				!ret[i]||ret[i].loaded?ret.splice(i,1):check.call(ret[i++]);
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
		check=function(){
			var offset,orig=this.getAttribute(original);
				
			if(!this.getAttribute('src')){
				this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC';
			}
			
			offset=getOffset(this);

			if(!orig){
				this.loaded=true;
			}else if(offset.top+this.height>WST && offset.top<WST+WH && offset.left+this.width>WSL && offset.left<WSL+WW){
				this.src=orig;
				this.loaded=true;
			}
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
			}catch(e){}
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
			}catch(e){}
			return true;
		},
		WST,WSL,WW,WH;//浏览器scrollTop scrollLeft innerWidth innerHeight
	
	return function(img){
		if(typeof img == 'string'){
			img=document.getElementById(img);
		}
		if(!img)return;
		if(img.nodeName && img.nodeName.toLowerCase()!='img'){
			img=img.getElementsByTagName('img');
		}
		if(img.length){//htmlCollection -> Array
			try{
				img=[].slice.call(img,0);
			}catch(e){
				var old=img,i=0,j=img.length;
				img=[];
				while(i<j){
					img.push(old[i++]);
				}
			}
		}
		ret=ret.concat(img);
		if(ret.length){
			resize();
			!bind && (bind=addEvent())
		}
	}
})();