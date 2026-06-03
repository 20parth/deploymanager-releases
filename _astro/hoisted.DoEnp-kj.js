var au="1.3.23";function pf(r,e,t){return Math.max(r,Math.min(e,t))}function gp(r,e,t){return(1-t)*r+t*e}function vp(r,e,t,n){return gp(r,e,1-Math.exp(-t*n))}function xp(r,e){return(r%e+e)%e}var Sp=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(r){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=r;const t=pf(0,this.currentTime/this.duration,1);e=t>=1;const n=e?1:this.easing(t);this.value=this.from+(this.to-this.from)*n}else this.lerp?(this.value=vp(this.value,this.to,this.lerp*60,r),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(r,e,{lerp:t,duration:n,easing:i,onStart:s,onUpdate:o}){this.from=this.value=r,this.to=e,this.lerp=t,this.duration=n,this.easing=i,this.currentTime=0,this.isRunning=!0,s?.(),this.onUpdate=o}};function Mp(r,e){let t;return function(...n){clearTimeout(t),t=setTimeout(()=>{t=void 0,r.apply(this,n)},e)}}var yp=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(r,e,{autoResize:t=!0,debounce:n=250}={}){this.wrapper=r,this.content=e,t&&(this.debouncedResize=Mp(this.resize,n),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},mf=class{events={};emit(r,...e){const t=this.events[r]||[];for(let n=0,i=t.length;n<i;n++)t[n]?.(...e)}on(r,e){return this.events[r]?this.events[r].push(e):this.events[r]=[e],()=>{this.events[r]=this.events[r]?.filter(t=>e!==t)}}off(r,e){this.events[r]=this.events[r]?.filter(t=>e!==t)}destroy(){this.events={}}};const Ep=100/6,Di={passive:!1};function lu(r,e){return r===1?Ep:r===2?e:1}var Tp=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new mf;constructor(r,e={wheelMultiplier:1,touchMultiplier:1}){this.element=r,this.options=e,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,Di),this.element.addEventListener("touchstart",this.onTouchStart,Di),this.element.addEventListener("touchmove",this.onTouchMove,Di),this.element.addEventListener("touchend",this.onTouchEnd,Di)}on(r,e){return this.emitter.on(r,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,Di),this.element.removeEventListener("touchstart",this.onTouchStart,Di),this.element.removeEventListener("touchmove",this.onTouchMove,Di),this.element.removeEventListener("touchend",this.onTouchEnd,Di)}onTouchStart=r=>{const{clientX:e,clientY:t}=r.targetTouches?r.targetTouches[0]:r;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:r})};onTouchMove=r=>{const{clientX:e,clientY:t}=r.targetTouches?r.targetTouches[0]:r,n=-(e-this.touchStart.x)*this.options.touchMultiplier,i=-(t-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:n,y:i},this.emitter.emit("scroll",{deltaX:n,deltaY:i,event:r})};onTouchEnd=r=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:r})};onWheel=r=>{let{deltaX:e,deltaY:t,deltaMode:n}=r;const i=lu(n,this.window.width),s=lu(n,this.window.height);e*=i,t*=s,e*=this.options.wheelMultiplier,t*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:t,event:r})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}};const cu=r=>Math.min(1,1.001-2**(-10*r));var bp=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;isTouching;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new Sp;emitter=new mf;dimensions;virtualScroll;constructor({wrapper:r=window,content:e=document.documentElement,eventsTarget:t=r,smoothWheel:n=!0,syncTouch:i=!1,syncTouchLerp:s=.075,touchInertiaExponent:o=1.7,duration:a,easing:l,lerp:c=.1,infinite:u=!1,orientation:d="vertical",gestureOrientation:h=d==="horizontal"?"both":"vertical",touchMultiplier:f=1,wheelMultiplier:g=1,autoResize:_=!0,prevent:p,virtualScroll:m,overscroll:E=!0,autoRaf:x=!1,anchors:M=!1,autoToggle:w=!1,allowNestedScroll:A=!1,__experimental__naiveDimensions:T=!1,naiveDimensions:C=T,stopInertiaOnNavigate:S=!1}={}){window.lenisVersion=au,window.lenis||(window.lenis={}),window.lenis.version=au,d==="horizontal"&&(window.lenis.horizontal=!0),i===!0&&(window.lenis.touch=!0),(!r||r===document.documentElement)&&(r=window),typeof a=="number"&&typeof l!="function"?l=cu:typeof l=="function"&&typeof a!="number"&&(a=1),this.options={wrapper:r,content:e,eventsTarget:t,smoothWheel:n,syncTouch:i,syncTouchLerp:s,touchInertiaExponent:o,duration:a,easing:l,lerp:c,infinite:u,gestureOrientation:h,orientation:d,touchMultiplier:f,wheelMultiplier:g,autoResize:_,prevent:p,virtualScroll:m,overscroll:E,autoRaf:x,anchors:M,autoToggle:w,allowNestedScroll:A,naiveDimensions:C,stopInertiaOnNavigate:S},this.dimensions=new yp(r,e,{autoResize:_}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new Tp(t,{touchMultiplier:f,wheelMultiplier:g}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(r,e){return this.emitter.on(r,e)}off(r,e){return this.emitter.off(r,e)}onScrollEnd=r=>{r instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&r.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){const r=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[r]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=r=>{r.propertyName?.includes("overflow")&&r.target===this.rootElement&&this.checkOverflow()};setScroll(r){this.isHorizontal?this.options.wrapper.scrollTo({left:r,behavior:"instant"}):this.options.wrapper.scrollTo({top:r,behavior:"instant"})}onClick=r=>{const e=r.composedPath().filter(n=>n instanceof HTMLAnchorElement&&n.href).map(n=>new URL(n.href)),t=new URL(window.location.href);if(this.options.anchors){const n=e.find(i=>t.host===i.host&&t.pathname===i.pathname&&i.hash);if(n){const i=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,s=`#${n.hash.split("#")[1]}`;this.scrollTo(s,i);return}}if(this.options.stopInertiaOnNavigate&&e.some(n=>t.host===n.host&&t.pathname!==n.pathname)){this.reset();return}};onPointerDown=r=>{r.button===1&&this.reset()};onVirtualScroll=r=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(r)===!1)return;const{deltaX:e,deltaY:t,event:n}=r;if(this.emitter.emit("virtual-scroll",{deltaX:e,deltaY:t,event:n}),n.ctrlKey||n.lenisStopPropagation)return;const i=n.type.includes("touch"),s=n.type.includes("wheel");this.isTouching=n.type==="touchstart"||n.type==="touchmove";const o=e===0&&t===0;if(this.options.syncTouch&&i&&n.type==="touchstart"&&o&&!this.isStopped&&!this.isLocked){this.reset();return}const a=this.options.gestureOrientation==="vertical"&&t===0||this.options.gestureOrientation==="horizontal"&&e===0;if(o||a)return;let l=n.composedPath();l=l.slice(0,l.indexOf(this.rootElement));const c=this.options.prevent,u=Math.abs(e)>=Math.abs(t)?"horizontal":"vertical";if(l.find(g=>g instanceof HTMLElement&&(typeof c=="function"&&c?.(g)||g.hasAttribute?.("data-lenis-prevent")||u==="vertical"&&g.hasAttribute?.("data-lenis-prevent-vertical")||u==="horizontal"&&g.hasAttribute?.("data-lenis-prevent-horizontal")||i&&g.hasAttribute?.("data-lenis-prevent-touch")||s&&g.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(g,{deltaX:e,deltaY:t}))))return;if(this.isStopped||this.isLocked){n.cancelable&&n.preventDefault();return}if(!(this.options.syncTouch&&i||this.options.smoothWheel&&s)){this.isScrolling="native",this.animate.stop(),n.lenisStopPropagation=!0;return}let d=t;this.options.gestureOrientation==="both"?d=Math.abs(t)>Math.abs(e)?t:e:this.options.gestureOrientation==="horizontal"&&(d=e),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&t>0||this.animatedScroll===this.limit&&t<0))&&(n.lenisStopPropagation=!0),n.cancelable&&n.preventDefault();const h=i&&this.options.syncTouch,f=i&&n.type==="touchend";f&&(d=Math.sign(d)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+d,{programmatic:!1,...h?{lerp:f?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){const r=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-r,this.direction=Math.sign(this.animatedScroll-r),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=r=>{const e=r-(this.time||r);this.time=r,this.animate.advance(e*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(r,{offset:e=0,immediate:t=!1,lock:n=!1,programmatic:i=!0,lerp:s=i?this.options.lerp:void 0,duration:o=i?this.options.duration:void 0,easing:a=i?this.options.easing:void 0,onStart:l,onComplete:c,force:u=!1,userData:d}={}){if((this.isStopped||this.isLocked)&&!u)return;let h=r,f=e;if(typeof h=="string"&&["top","left","start","#"].includes(h))h=0;else if(typeof h=="string"&&["bottom","right","end"].includes(h))h=this.limit;else{let g=null;if(typeof h=="string"?(g=document.querySelector(h),g||(h==="#top"?h=0:console.warn("Lenis: Target not found",h))):h instanceof HTMLElement&&h?.nodeType&&(g=h),g){if(this.options.wrapper!==window){const M=this.rootElement.getBoundingClientRect();f-=this.isHorizontal?M.left:M.top}const _=g.getBoundingClientRect(),p=getComputedStyle(g),m=this.isHorizontal?Number.parseFloat(p.scrollMarginLeft):Number.parseFloat(p.scrollMarginTop),E=getComputedStyle(this.rootElement),x=this.isHorizontal?Number.parseFloat(E.scrollPaddingLeft):Number.parseFloat(E.scrollPaddingTop);h=(this.isHorizontal?_.left:_.top)+this.animatedScroll-(Number.isNaN(m)?0:m)-(Number.isNaN(x)?0:x)}}if(typeof h=="number"){if(h+=f,this.options.infinite){if(i){this.targetScroll=this.animatedScroll=this.scroll;const g=h-this.animatedScroll;g>this.limit/2?h-=this.limit:g<-this.limit/2&&(h+=this.limit)}}else h=pf(0,h,this.limit);if(h===this.targetScroll){l?.(this),c?.(this);return}if(this.userData=d??{},t){this.animatedScroll=this.targetScroll=h,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}i||(this.targetScroll=h),typeof o=="number"&&typeof a!="function"?a=cu:typeof a=="function"&&typeof o!="number"&&(o=1),this.animate.fromTo(this.animatedScroll,h,{duration:o,easing:a,lerp:s,onStart:()=>{n&&(this.isLocked=!0),this.isScrolling="smooth",l?.(this)},onUpdate:(g,_)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=g-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=g,this.setScroll(this.scroll),i&&(this.targetScroll=g),_||this.emit(),_&&(this.reset(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(r,{deltaX:e,deltaY:t}){const n=Date.now();r._lenis||(r._lenis={});const i=r._lenis;let s,o,a,l,c,u,d,h,f,g;if(n-(i.time??0)>2e3){i.time=Date.now();const A=window.getComputedStyle(r);if(i.computedStyle=A,s=["auto","overlay","scroll"].includes(A.overflowX),o=["auto","overlay","scroll"].includes(A.overflowY),c=["auto"].includes(A.overscrollBehaviorX),u=["auto"].includes(A.overscrollBehaviorY),i.hasOverflowX=s,i.hasOverflowY=o,!(s||o))return!1;d=r.scrollWidth,h=r.scrollHeight,f=r.clientWidth,g=r.clientHeight,a=d>f,l=h>g,i.isScrollableX=a,i.isScrollableY=l,i.scrollWidth=d,i.scrollHeight=h,i.clientWidth=f,i.clientHeight=g,i.hasOverscrollBehaviorX=c,i.hasOverscrollBehaviorY=u}else a=i.isScrollableX,l=i.isScrollableY,s=i.hasOverflowX,o=i.hasOverflowY,d=i.scrollWidth,h=i.scrollHeight,f=i.clientWidth,g=i.clientHeight,c=i.hasOverscrollBehaviorX,u=i.hasOverscrollBehaviorY;if(!(s&&a||o&&l))return!1;const _=Math.abs(e)>=Math.abs(t)?"horizontal":"vertical";let p,m,E,x,M,w;if(_==="horizontal")p=Math.round(r.scrollLeft),m=d-f,E=e,x=s,M=a,w=c;else if(_==="vertical")p=Math.round(r.scrollTop),m=h-g,E=t,x=o,M=l,w=u;else return!1;return!w&&(p>=m||p<=0)?!0:(E>0?p<m:p>0)&&x&&M}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){const r=this.options.wrapper;return this.isHorizontal?r.scrollX??r.scrollLeft:r.scrollY??r.scrollTop}get scroll(){return this.options.infinite?xp(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(r){this._isScrolling!==r&&(this._isScrolling=r,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(r){this._isStopped!==r&&(this._isStopped=r,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(r){this._isLocked!==r&&(this._isLocked=r,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get className(){let r="lenis";return this.options.autoToggle&&(r+=" lenis-autoToggle"),this.isStopped&&(r+=" lenis-stopped"),this.isLocked&&(r+=" lenis-locked"),this.isScrolling&&(r+=" lenis-scrolling"),this.isScrolling==="smooth"&&(r+=" lenis-smooth"),r}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(r=>{this.rootElement.classList.add(r)})}cleanUpClassName(){for(const r of Array.from(this.rootElement.classList))(r==="lenis"||r.startsWith("lenis-"))&&this.rootElement.classList.remove(r)}};function Mi(r){if(r===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return r}function _f(r,e){r.prototype=Object.create(e.prototype),r.prototype.constructor=r,r.__proto__=e}/*!
 * GSAP 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var In={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},po={duration:.5,overwrite:!1,delay:0},Rc,jt,At,Gn=1e8,vt=1/Gn,Zl=Math.PI*2,Ap=Zl/4,wp=0,gf=Math.sqrt,Rp=Math.cos,Cp=Math.sin,$t=function(e){return typeof e=="string"},Pt=function(e){return typeof e=="function"},wi=function(e){return typeof e=="number"},Cc=function(e){return typeof e>"u"},fi=function(e){return typeof e=="object"},gn=function(e){return e!==!1},Pc=function(){return typeof window<"u"},Po=function(e){return Pt(e)||$t(e)},vf=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},sn=Array.isArray,Pp=/random\([^)]+\)/g,Lp=/,\s*/g,uu=/(?:-?\.?\d|\.)+/gi,xf=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,hs=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,tl=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Sf=/[+-]=-?[.\d]+/,Dp=/[^,'"\[\]\s]+/gi,Up=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,Rt,ei,jl,Lc,On={},Ta={},Mf,yf=function(e){return(Ta=bs(e,On))&&En},Dc=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},mo=function(e,t){return!t&&console.warn(e)},Ef=function(e,t){return e&&(On[e]=t)&&Ta&&(Ta[e]=t)||On},_o=function(){return 0},Ip={suppressEvents:!0,isStart:!0,kill:!1},pa={suppressEvents:!0,kill:!1},Np={suppressEvents:!0},Uc={},$i=[],Jl={},Tf,Rn={},nl={},hu=30,ma=[],Ic="",Nc=function(e){var t=e[0],n,i;if(fi(t)||Pt(t)||(e=[e]),!(n=(t._gsap||{}).harness)){for(i=ma.length;i--&&!ma[i].targetTest(t););n=ma[i]}for(i=e.length;i--;)e[i]&&(e[i]._gsap||(e[i]._gsap=new Yf(e[i],n)))||e.splice(i,1);return e},Cr=function(e){return e._gsap||Nc(Wn(e))[0]._gsap},bf=function(e,t,n){return(n=e[t])&&Pt(n)?e[t]():Cc(n)&&e.getAttribute&&e.getAttribute(t)||n},vn=function(e,t){return(e=e.split(",")).forEach(t)||e},Dt=function(e){return Math.round(e*1e5)/1e5||0},wt=function(e){return Math.round(e*1e7)/1e7||0},ms=function(e,t){var n=t.charAt(0),i=parseFloat(t.substr(2));return e=parseFloat(e),n==="+"?e+i:n==="-"?e-i:n==="*"?e*i:e/i},Op=function(e,t){for(var n=t.length,i=0;e.indexOf(t[i])<0&&++i<n;);return i<n},ba=function(){var e=$i.length,t=$i.slice(0),n,i;for(Jl={},$i.length=0,n=0;n<e;n++)i=t[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},Oc=function(e){return!!(e._initted||e._startAt||e.add)},Af=function(e,t,n,i){$i.length&&!jt&&ba(),e.render(t,n,!!(jt&&t<0&&Oc(e))),$i.length&&!jt&&ba()},wf=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(Dp).length<2?t:$t(e)?e.trim():e},Rf=function(e){return e},Fn=function(e,t){for(var n in t)n in e||(e[n]=t[n]);return e},Fp=function(e){return function(t,n){for(var i in n)i in t||i==="duration"&&e||i==="ease"||(t[i]=n[i])}},bs=function(e,t){for(var n in t)e[n]=t[n];return e},fu=function r(e,t){for(var n in t)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(e[n]=fi(t[n])?r(e[n]||(e[n]={}),t[n]):t[n]);return e},Aa=function(e,t){var n={},i;for(i in e)i in t||(n[i]=e[i]);return n},to=function(e){var t=e.parent||Rt,n=e.keyframes?Fp(sn(e.keyframes)):Fn;if(gn(e.inherit))for(;t;)n(e,t.vars.defaults),t=t.parent||t._dp;return e},Bp=function(e,t){for(var n=e.length,i=n===t.length;i&&n--&&e[n]===t[n];);return n<0},Cf=function(e,t,n,i,s){var o=e[i],a;if(s)for(a=t[s];o&&o[s]>a;)o=o._prev;return o?(t._next=o._next,o._next=t):(t._next=e[n],e[n]=t),t._next?t._next._prev=t:e[i]=t,t._prev=o,t.parent=t._dp=e,t},Va=function(e,t,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var s=t._prev,o=t._next;s?s._next=o:e[n]===t&&(e[n]=o),o?o._prev=s:e[i]===t&&(e[i]=s),t._next=t._prev=t.parent=null},Qi=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},Pr=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var n=e;n;)n._dirty=1,n=n.parent;return e},zp=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},Ql=function(e,t,n,i){return e._startAt&&(jt?e._startAt.revert(pa):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,i))},kp=function r(e){return!e||e._ts&&r(e.parent)},du=function(e){return e._repeat?As(e._tTime,e=e.duration()+e._rDelay)*e:0},As=function(e,t){var n=Math.floor(e=wt(e/t));return e&&n===e?n-1:n},wa=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},Ga=function(e){return e._end=wt(e._start+(e._tDur/Math.abs(e._ts||e._rts||vt)||0))},Wa=function(e,t){var n=e._dp;return n&&n.smoothChildTiming&&e._ts&&(e._start=wt(n._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),Ga(e),n._dirty||Pr(n,e)),e},Pf=function(e,t){var n;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(n=wa(e.rawTime(),t),(!t._dur||To(0,t.totalDuration(),n)-t._tTime>vt)&&t.render(n,!0)),Pr(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(n=e;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;e._zTime=-vt}},ri=function(e,t,n,i){return t.parent&&Qi(t),t._start=wt((wi(n)?n:n||e!==Rt?kn(e,n,t):e._time)+t._delay),t._end=wt(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),Cf(e,t,"_first","_last",e._sort?"_start":0),ec(t)||(e._recent=t),i||Pf(e,t),e._ts<0&&Wa(e,e._tTime),e},Lf=function(e,t){return(On.ScrollTrigger||Dc("scrollTrigger",t))&&On.ScrollTrigger.create(t,e)},Df=function(e,t,n,i,s){if(Bc(e,t,s),!e._initted)return 1;if(!n&&e._pt&&!jt&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&Tf!==Pn.frame)return $i.push(e),e._lazy=[s,i],1},Hp=function r(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||r(t))},ec=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},Vp=function(e,t,n,i){var s=e.ratio,o=t<0||!t&&(!e._start&&Hp(e)&&!(!e._initted&&ec(e))||(e._ts<0||e._dp._ts<0)&&!ec(e))?0:1,a=e._rDelay,l=0,c,u,d;if(a&&e._repeat&&(l=To(0,e._tDur,t),u=As(l,a),e._yoyo&&u&1&&(o=1-o),u!==As(e._tTime,a)&&(s=1-o,e.vars.repeatRefresh&&e._initted&&e.invalidate())),o!==s||jt||i||e._zTime===vt||!t&&e._zTime){if(!e._initted&&Df(e,t,i,n,l))return;for(d=e._zTime,e._zTime=t||(n?vt:0),n||(n=t&&!d),e.ratio=o,e._from&&(o=1-o),e._time=0,e._tTime=l,c=e._pt;c;)c.r(o,c.d),c=c._next;t<0&&Ql(e,t,n,!0),e._onUpdate&&!n&&Dn(e,"onUpdate"),l&&e._repeat&&!n&&e.parent&&Dn(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===o&&(o&&Qi(e,1),!n&&!jt&&(Dn(e,o?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},Gp=function(e,t,n){var i;if(n>t)for(i=e._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>t)return i;i=i._next}else for(i=e._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<t)return i;i=i._prev}},ws=function(e,t,n,i){var s=e._repeat,o=wt(t)||0,a=e._tTime/e._tDur;return a&&!i&&(e._time*=o/e._dur),e._dur=o,e._tDur=s?s<0?1e10:wt(o*(s+1)+e._rDelay*s):o,a>0&&!i&&Wa(e,e._tTime=e._tDur*a),e.parent&&Ga(e),n||Pr(e.parent,e),e},pu=function(e){return e instanceof _n?Pr(e):ws(e,e._dur)},Wp={_start:0,endTime:_o,totalDuration:_o},kn=function r(e,t,n){var i=e.labels,s=e._recent||Wp,o=e.duration()>=Gn?s.endTime(!1):e._dur,a,l,c;return $t(t)&&(isNaN(t)||t in i)?(l=t.charAt(0),c=t.substr(-1)==="%",a=t.indexOf("="),l==="<"||l===">"?(a>=0&&(t=t.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(t.substr(1))||0)*(c?(a<0?s:n).totalDuration()/100:1)):a<0?(t in i||(i[t]=o),i[t]):(l=parseFloat(t.charAt(a-1)+t.substr(a+1)),c&&n&&(l=l/100*(sn(n)?n[0]:n).totalDuration()),a>1?r(e,t.substr(0,a-1),n)+l:o+l)):t==null?o:+t},no=function(e,t,n){var i=wi(t[1]),s=(i?2:1)+(e<2?0:1),o=t[s],a,l;if(i&&(o.duration=t[1]),o.parent=n,e){for(a=o,l=n;l&&!("immediateRender"in a);)a=l.vars.defaults||{},l=gn(l.vars.inherit)&&l.parent;o.immediateRender=gn(a.immediateRender),e<2?o.runBackwards=1:o.startAt=t[s-1]}return new Ot(t[0],o,t[s+1])},sr=function(e,t){return e||e===0?t(e):t},To=function(e,t,n){return n<e?e:n>t?t:n},nn=function(e,t){return!$t(e)||!(t=Up.exec(e))?"":t[1]},Xp=function(e,t,n){return sr(n,function(i){return To(e,t,i)})},tc=[].slice,Uf=function(e,t){return e&&fi(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&fi(e[0]))&&!e.nodeType&&e!==ei},Yp=function(e,t,n){return n===void 0&&(n=[]),e.forEach(function(i){var s;return $t(i)&&!t||Uf(i,1)?(s=n).push.apply(s,Wn(i)):n.push(i)})||n},Wn=function(e,t,n){return At&&!t&&At.selector?At.selector(e):$t(e)&&!n&&(jl||!Rs())?tc.call((t||Lc).querySelectorAll(e),0):sn(e)?Yp(e,n):Uf(e)?tc.call(e,0):e?[e]:[]},nc=function(e){return e=Wn(e)[0]||mo("Invalid scope")||{},function(t){var n=e.current||e.nativeElement||e;return Wn(t,n.querySelectorAll?n:n===e?mo("Invalid scope")||Lc.createElement("div"):e)}},If=function(e){return e.sort(function(){return .5-Math.random()})},Nf=function(e){if(Pt(e))return e;var t=fi(e)?e:{each:e},n=Lr(t.ease),i=t.from||0,s=parseFloat(t.base)||0,o={},a=i>0&&i<1,l=isNaN(i)||a,c=t.axis,u=i,d=i;return $t(i)?u=d={center:.5,edges:.5,end:1}[i]||0:!a&&l&&(u=i[0],d=i[1]),function(h,f,g){var _=(g||t).length,p=o[_],m,E,x,M,w,A,T,C,S;if(!p){if(S=t.grid==="auto"?0:(t.grid||[1,Gn])[1],!S){for(T=-Gn;T<(T=g[S++].getBoundingClientRect().left)&&S<_;);S<_&&S--}for(p=o[_]=[],m=l?Math.min(S,_)*u-.5:i%S,E=S===Gn?0:l?_*d/S-.5:i/S|0,T=0,C=Gn,A=0;A<_;A++)x=A%S-m,M=E-(A/S|0),p[A]=w=c?Math.abs(c==="y"?M:x):gf(x*x+M*M),w>T&&(T=w),w<C&&(C=w);i==="random"&&If(p),p.max=T-C,p.min=C,p.v=_=(parseFloat(t.amount)||parseFloat(t.each)*(S>_?_-1:c?c==="y"?_/S:S:Math.max(S,_/S))||0)*(i==="edges"?-1:1),p.b=_<0?s-_:s,p.u=nn(t.amount||t.each)||0,n=n&&_<0?sm(n):n}return _=(p[h]-p.min)/p.max||0,wt(p.b+(n?n(_):_)*p.v)+p.u}},ic=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(n){var i=wt(Math.round(parseFloat(n)/e)*e*t);return(i-i%1)/t+(wi(n)?0:nn(n))}},Of=function(e,t){var n=sn(e),i,s;return!n&&fi(e)&&(i=n=e.radius||Gn,e.values?(e=Wn(e.values),(s=!wi(e[0]))&&(i*=i)):e=ic(e.increment)),sr(t,n?Pt(e)?function(o){return s=e(o),Math.abs(s-o)<=i?s:o}:function(o){for(var a=parseFloat(s?o.x:o),l=parseFloat(s?o.y:0),c=Gn,u=0,d=e.length,h,f;d--;)s?(h=e[d].x-a,f=e[d].y-l,h=h*h+f*f):h=Math.abs(e[d]-a),h<c&&(c=h,u=d);return u=!i||c<=i?e[u]:o,s||u===o||wi(o)?u:u+nn(o)}:ic(e))},Ff=function(e,t,n,i){return sr(sn(e)?!t:n===!0?!!(n=0):!i,function(){return sn(e)?e[~~(Math.random()*e.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((e-n/2+Math.random()*(t-e+n*.99))/n)*n*i)/i})},qp=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(i){return t.reduce(function(s,o){return o(s)},i)}},$p=function(e,t){return function(n){return e(parseFloat(n))+(t||nn(n))}},Kp=function(e,t,n){return zf(e,t,0,1,n)},Bf=function(e,t,n){return sr(n,function(i){return e[~~t(i)]})},Zp=function r(e,t,n){var i=t-e;return sn(e)?Bf(e,r(0,e.length),t):sr(n,function(s){return(i+(s-e)%i)%i+e})},jp=function r(e,t,n){var i=t-e,s=i*2;return sn(e)?Bf(e,r(0,e.length-1),t):sr(n,function(o){return o=(s+(o-e)%s)%s||0,e+(o>i?s-o:o)})},go=function(e){return e.replace(Pp,function(t){var n=t.indexOf("[")+1,i=t.substring(n||7,n?t.indexOf("]"):t.length-1).split(Lp);return Ff(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},zf=function(e,t,n,i,s){var o=t-e,a=i-n;return sr(s,function(l){return n+((l-e)/o*a||0)})},Jp=function r(e,t,n,i){var s=isNaN(e+t)?0:function(f){return(1-f)*e+f*t};if(!s){var o=$t(e),a={},l,c,u,d,h;if(n===!0&&(i=1)&&(n=null),o)e={p:e},t={p:t};else if(sn(e)&&!sn(t)){for(u=[],d=e.length,h=d-2,c=1;c<d;c++)u.push(r(e[c-1],e[c]));d--,s=function(g){g*=d;var _=Math.min(h,~~g);return u[_](g-_)},n=t}else i||(e=bs(sn(e)?[]:{},e));if(!u){for(l in t)Fc.call(a,e,l,"get",t[l]);s=function(g){return Hc(g,a)||(o?e.p:e)}}}return sr(n,s)},mu=function(e,t,n){var i=e.labels,s=Gn,o,a,l;for(o in i)a=i[o]-t,a<0==!!n&&a&&s>(a=Math.abs(a))&&(l=o,s=a);return l},Dn=function(e,t,n){var i=e.vars,s=i[t],o=At,a=e._ctx,l,c,u;if(s)return l=i[t+"Params"],c=i.callbackScope||e,n&&$i.length&&ba(),a&&(At=a),u=l?s.apply(c,l):s.call(c),At=o,u},qs=function(e){return Qi(e),e.scrollTrigger&&e.scrollTrigger.kill(!!jt),e.progress()<1&&Dn(e,"onInterrupt"),e},fs,kf=[],Hf=function(e){if(e)if(e=!e.name&&e.default||e,Pc()||e.headless){var t=e.name,n=Pt(e),i=t&&!n&&e.init?function(){this._props=[]}:e,s={init:_o,render:Hc,add:Fc,kill:mm,modifier:pm,rawVars:0},o={targetTest:0,get:0,getSetter:kc,aliases:{},register:0};if(Rs(),e!==i){if(Rn[t])return;Fn(i,Fn(Aa(e,s),o)),bs(i.prototype,bs(s,Aa(e,o))),Rn[i.prop=t]=i,e.targetTest&&(ma.push(i),Uc[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}Ef(t,i),e.register&&e.register(En,i,xn)}else kf.push(e)},gt=255,$s={aqua:[0,gt,gt],lime:[0,gt,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,gt],navy:[0,0,128],white:[gt,gt,gt],olive:[128,128,0],yellow:[gt,gt,0],orange:[gt,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[gt,0,0],pink:[gt,192,203],cyan:[0,gt,gt],transparent:[gt,gt,gt,0]},il=function(e,t,n){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(n-t)*e*6:e<.5?n:e*3<2?t+(n-t)*(2/3-e)*6:t)*gt+.5|0},Vf=function(e,t,n){var i=e?wi(e)?[e>>16,e>>8&gt,e&gt]:0:$s.black,s,o,a,l,c,u,d,h,f,g;if(!i){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),$s[e])i=$s[e];else if(e.charAt(0)==="#"){if(e.length<6&&(s=e.charAt(1),o=e.charAt(2),a=e.charAt(3),e="#"+s+s+o+o+a+a+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return i=parseInt(e.substr(1,6),16),[i>>16,i>>8&gt,i&gt,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),i=[e>>16,e>>8&gt,e&gt]}else if(e.substr(0,3)==="hsl"){if(i=g=e.match(uu),!t)l=+i[0]%360/360,c=+i[1]/100,u=+i[2]/100,o=u<=.5?u*(c+1):u+c-u*c,s=u*2-o,i.length>3&&(i[3]*=1),i[0]=il(l+1/3,s,o),i[1]=il(l,s,o),i[2]=il(l-1/3,s,o);else if(~e.indexOf("="))return i=e.match(xf),n&&i.length<4&&(i[3]=1),i}else i=e.match(uu)||$s.transparent;i=i.map(Number)}return t&&!g&&(s=i[0]/gt,o=i[1]/gt,a=i[2]/gt,d=Math.max(s,o,a),h=Math.min(s,o,a),u=(d+h)/2,d===h?l=c=0:(f=d-h,c=u>.5?f/(2-d-h):f/(d+h),l=d===s?(o-a)/f+(o<a?6:0):d===o?(a-s)/f+2:(s-o)/f+4,l*=60),i[0]=~~(l+.5),i[1]=~~(c*100+.5),i[2]=~~(u*100+.5)),n&&i.length<4&&(i[3]=1),i},Gf=function(e){var t=[],n=[],i=-1;return e.split(Ki).forEach(function(s){var o=s.match(hs)||[];t.push.apply(t,o),n.push(i+=o.length+1)}),t.c=n,t},_u=function(e,t,n){var i="",s=(e+i).match(Ki),o=t?"hsla(":"rgba(",a=0,l,c,u,d;if(!s)return e;if(s=s.map(function(h){return(h=Vf(h,t,1))&&o+(t?h[0]+","+h[1]+"%,"+h[2]+"%,"+h[3]:h.join(","))+")"}),n&&(u=Gf(e),l=n.c,l.join(i)!==u.c.join(i)))for(c=e.replace(Ki,"1").split(hs),d=c.length-1;a<d;a++)i+=c[a]+(~l.indexOf(a)?s.shift()||o+"0,0,0,0)":(u.length?u:s.length?s:n).shift());if(!c)for(c=e.split(Ki),d=c.length-1;a<d;a++)i+=c[a]+s[a];return i+c[d]},Ki=function(){var r="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in $s)r+="|"+e+"\\b";return new RegExp(r+")","gi")}(),Qp=/hsl[a]?\(/,Wf=function(e){var t=e.join(" "),n;if(Ki.lastIndex=0,Ki.test(t))return n=Qp.test(t),e[1]=_u(e[1],n),e[0]=_u(e[0],n,Gf(e[1])),!0},vo,Pn=function(){var r=Date.now,e=500,t=33,n=r(),i=n,s=1e3/240,o=s,a=[],l,c,u,d,h,f,g=function _(p){var m=r()-i,E=p===!0,x,M,w,A;if((m>e||m<0)&&(n+=m-t),i+=m,w=i-n,x=w-o,(x>0||E)&&(A=++d.frame,h=w-d.time*1e3,d.time=w=w/1e3,o+=x+(x>=s?4:s-x),M=1),E||(l=c(_)),M)for(f=0;f<a.length;f++)a[f](w,h,A,p)};return d={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(p){return h/(1e3/(p||60))},wake:function(){Mf&&(!jl&&Pc()&&(ei=jl=window,Lc=ei.document||{},On.gsap=En,(ei.gsapVersions||(ei.gsapVersions=[])).push(En.version),yf(Ta||ei.GreenSockGlobals||!ei.gsap&&ei||{}),kf.forEach(Hf)),u=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&d.sleep(),c=u||function(p){return setTimeout(p,o-d.time*1e3+1|0)},vo=1,g(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(l),vo=0,c=_o},lagSmoothing:function(p,m){e=p||1/0,t=Math.min(m||33,e)},fps:function(p){s=1e3/(p||240),o=d.time*1e3+s},add:function(p,m,E){var x=m?function(M,w,A,T){p(M,w,A,T),d.remove(x)}:p;return d.remove(p),a[E?"unshift":"push"](x),Rs(),x},remove:function(p,m){~(m=a.indexOf(p))&&a.splice(m,1)&&f>=m&&f--},_listeners:a},d}(),Rs=function(){return!vo&&Pn.wake()},nt={},em=/^[\d.\-M][\d.\-,\s]/,tm=/["']/g,nm=function(e){for(var t={},n=e.substr(1,e.length-3).split(":"),i=n[0],s=1,o=n.length,a,l,c;s<o;s++)l=n[s],a=s!==o-1?l.lastIndexOf(","):l.length,c=l.substr(0,a),t[i]=isNaN(c)?c.replace(tm,"").trim():+c,i=l.substr(a+1).trim();return t},im=function(e){var t=e.indexOf("(")+1,n=e.indexOf(")"),i=e.indexOf("(",t);return e.substring(t,~i&&i<n?e.indexOf(")",n+1):n)},rm=function(e){var t=(e+"").split("("),n=nt[t[0]];return n&&t.length>1&&n.config?n.config.apply(null,~e.indexOf("{")?[nm(t[1])]:im(e).split(",").map(wf)):nt._CE&&em.test(e)?nt._CE("",e):n},sm=function(e){return function(t){return 1-e(1-t)}},Lr=function(e,t){return e&&(Pt(e)?e:nt[e]||rm(e))||t},Hr=function(e,t,n,i){n===void 0&&(n=function(l){return 1-t(1-l)}),i===void 0&&(i=function(l){return l<.5?t(l*2)/2:1-t((1-l)*2)/2});var s={easeIn:t,easeOut:n,easeInOut:i},o;return vn(e,function(a){nt[a]=On[a]=s,nt[o=a.toLowerCase()]=n;for(var l in s)nt[o+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=nt[a+"."+l]=s[l]}),s},Xf=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},rl=function r(e,t,n){var i=t>=1?t:1,s=(n||(e?.3:.45))/(t<1?t:1),o=s/Zl*(Math.asin(1/i)||0),a=function(u){return u===1?1:i*Math.pow(2,-10*u)*Cp((u-o)*s)+1},l=e==="out"?a:e==="in"?function(c){return 1-a(1-c)}:Xf(a);return s=Zl/s,l.config=function(c,u){return r(e,c,u)},l},sl=function r(e,t){t===void 0&&(t=1.70158);var n=function(o){return o?--o*o*((t+1)*o+t)+1:0},i=e==="out"?n:e==="in"?function(s){return 1-n(1-s)}:Xf(n);return i.config=function(s){return r(e,s)},i};vn("Linear,Quad,Cubic,Quart,Quint,Strong",function(r,e){var t=e<5?e+1:e;Hr(r+",Power"+(t-1),e?function(n){return Math.pow(n,t)}:function(n){return n},function(n){return 1-Math.pow(1-n,t)},function(n){return n<.5?Math.pow(n*2,t)/2:1-Math.pow((1-n)*2,t)/2})});nt.Linear.easeNone=nt.none=nt.Linear.easeIn;Hr("Elastic",rl("in"),rl("out"),rl());(function(r,e){var t=1/e,n=2*t,i=2.5*t,s=function(a){return a<t?r*a*a:a<n?r*Math.pow(a-1.5/e,2)+.75:a<i?r*(a-=2.25/e)*a+.9375:r*Math.pow(a-2.625/e,2)+.984375};Hr("Bounce",function(o){return 1-s(1-o)},s)})(7.5625,2.75);Hr("Expo",function(r){return Math.pow(2,10*(r-1))*r+r*r*r*r*r*r*(1-r)});Hr("Circ",function(r){return-(gf(1-r*r)-1)});Hr("Sine",function(r){return r===1?1:-Rp(r*Ap)+1});Hr("Back",sl("in"),sl("out"),sl());nt.SteppedEase=nt.steps=On.SteppedEase={config:function(e,t){e===void 0&&(e=1);var n=1/e,i=e+(t?0:1),s=t?1:0,o=1-vt;return function(a){return((i*To(0,o,a)|0)+s)*n}}};po.ease=nt["quad.out"];vn("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(r){return Ic+=r+","+r+"Params,"});var Yf=function(e,t){this.id=wp++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:bf,this.set=t?t.getSetter:kc},xo=function(){function r(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,ws(this,+t.duration,1,1),this.data=t.data,At&&(this._ctx=At,At.data.push(this)),vo||Pn.wake()}var e=r.prototype;return e.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},e.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},e.totalDuration=function(n){return arguments.length?(this._dirty=0,ws(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(n,i){if(Rs(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(Wa(this,n),!s._dp||s.parent||Pf(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&ri(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===vt||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),Af(this,n,i)),this},e.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+du(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},e.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+du(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(n,i){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*s,i):this._repeat?As(this._tTime,s)+1:1},e.timeScale=function(n,i){if(!arguments.length)return this._rts===-vt?0:this._rts;if(this._rts===n)return this;var s=this.parent&&this._ts?wa(this.parent._time,this):this._tTime;return this._rts=+n||0,this._ts=this._ps||n===-vt?0:this._rts,this.totalTime(To(-Math.abs(this._delay),this.totalDuration(),s),i!==!1),Ga(this),zp(this)},e.paused=function(n){return arguments.length?(this._ps!==n&&(this._ps=n,n?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Rs(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==vt&&(this._tTime-=vt)))),this):this._ps},e.startTime=function(n){if(arguments.length){this._start=wt(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&ri(i,this,this._start-this._delay),this}return this._start},e.endTime=function(n){return this._start+(gn(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?wa(i.rawTime(n),this):this._tTime:this._tTime},e.revert=function(n){n===void 0&&(n=Np);var i=jt;return jt=n,Oc(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),jt=i,this},e.globalTime=function(n){for(var i=this,s=arguments.length?n:i.rawTime();i;)s=i._start+s/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):s},e.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,pu(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,pu(this),i?this.time(i):this}return this._rDelay},e.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},e.seek=function(n,i){return this.totalTime(kn(this,n),gn(i))},e.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,gn(i)),this._dur||(this._zTime=-vt),this},e.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},e.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},e.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-vt:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-vt,this},e.isActive=function(){var n=this.parent||this._dp,i=this._start,s;return!!(!n||this._ts&&this._initted&&n.isActive()&&(s=n.rawTime(!0))>=i&&s<this.endTime(!0)-vt)},e.eventCallback=function(n,i,s){var o=this.vars;return arguments.length>1?(i?(o[n]=i,s&&(o[n+"Params"]=s),n==="onUpdate"&&(this._onUpdate=i)):delete o[n],this):o[n]},e.then=function(n){var i=this,s=i._prom;return new Promise(function(o){var a=Pt(n)?n:Rf,l=function(){var u=i.then;i.then=null,s&&s(),Pt(a)&&(a=a(i))&&(a.then||a===i)&&(i.then=u),o(a),i.then=u};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},e.kill=function(){qs(this)},r}();Fn(xo.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-vt,_prom:0,_ps:!1,_rts:1});var _n=function(r){_f(e,r);function e(n,i){var s;return n===void 0&&(n={}),s=r.call(this,n)||this,s.labels={},s.smoothChildTiming=!!n.smoothChildTiming,s.autoRemoveChildren=!!n.autoRemoveChildren,s._sort=gn(n.sortChildren),Rt&&ri(n.parent||Rt,Mi(s),i),n.reversed&&s.reverse(),n.paused&&s.paused(!0),n.scrollTrigger&&Lf(Mi(s),n.scrollTrigger),s}var t=e.prototype;return t.to=function(i,s,o){return no(0,arguments,this),this},t.from=function(i,s,o){return no(1,arguments,this),this},t.fromTo=function(i,s,o,a){return no(2,arguments,this),this},t.set=function(i,s,o){return s.duration=0,s.parent=this,to(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new Ot(i,s,kn(this,o),1),this},t.call=function(i,s,o){return ri(this,Ot.delayedCall(0,i,s),o)},t.staggerTo=function(i,s,o,a,l,c,u){return o.duration=s,o.stagger=o.stagger||a,o.onComplete=c,o.onCompleteParams=u,o.parent=this,new Ot(i,o,kn(this,l)),this},t.staggerFrom=function(i,s,o,a,l,c,u){return o.runBackwards=1,to(o).immediateRender=gn(o.immediateRender),this.staggerTo(i,s,o,a,l,c,u)},t.staggerFromTo=function(i,s,o,a,l,c,u,d){return a.startAt=o,to(a).immediateRender=gn(a.immediateRender),this.staggerTo(i,s,a,l,c,u,d)},t.render=function(i,s,o){var a=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,u=i<=0?0:wt(i),d=this._zTime<0!=i<0&&(this._initted||!c),h,f,g,_,p,m,E,x,M,w,A,T;if(this!==Rt&&u>l&&i>=0&&(u=l),u!==this._tTime||o||d){if(a!==this._time&&c&&(u+=this._time-a,i+=this._time-a),h=u,M=this._start,x=this._ts,m=!x,d&&(c||(a=this._zTime),(i||!s)&&(this._zTime=i)),this._repeat){if(A=this._yoyo,p=c+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(p*100+i,s,o);if(h=wt(u%p),u===l?(_=this._repeat,h=c):(w=wt(u/p),_=~~w,_&&_===w&&(h=c,_--),h>c&&(h=c)),w=As(this._tTime,p),!a&&this._tTime&&w!==_&&this._tTime-w*p-this._dur<=0&&(w=_),A&&_&1&&(h=c-h,T=1),_!==w&&!this._lock){var C=A&&w&1,S=C===(A&&_&1);if(_<w&&(C=!C),a=C?0:u%c?c:u,this._lock=1,this.render(a||(T?0:wt(_*p)),s,!c)._lock=0,this._tTime=u,!s&&this.parent&&Dn(this,"onRepeat"),this.vars.repeatRefresh&&!T&&(this.invalidate()._lock=1,w=_),a&&a!==this._time||m!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,S&&(this._lock=2,a=C?c:-1e-4,this.render(a,!0),this.vars.repeatRefresh&&!T&&this.invalidate()),this._lock=0,!this._ts&&!m)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(E=Gp(this,wt(a),wt(h)),E&&(u-=h-(h=E._start))),this._tTime=u,this._time=h,this._act=!!x,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,a=0),!a&&u&&c&&!s&&!w&&(Dn(this,"onStart"),this._tTime!==u))return this;if(h>=a&&i>=0)for(f=this._first;f;){if(g=f._next,(f._act||h>=f._start)&&f._ts&&E!==f){if(f.parent!==this)return this.render(i,s,o);if(f.render(f._ts>0?(h-f._start)*f._ts:(f._dirty?f.totalDuration():f._tDur)+(h-f._start)*f._ts,s,o),h!==this._time||!this._ts&&!m){E=0,g&&(u+=this._zTime=-vt);break}}f=g}else{f=this._last;for(var v=i<0?i:h;f;){if(g=f._prev,(f._act||v<=f._end)&&f._ts&&E!==f){if(f.parent!==this)return this.render(i,s,o);if(f.render(f._ts>0?(v-f._start)*f._ts:(f._dirty?f.totalDuration():f._tDur)+(v-f._start)*f._ts,s,o||jt&&Oc(f)),h!==this._time||!this._ts&&!m){E=0,g&&(u+=this._zTime=v?-vt:vt);break}}f=g}}if(E&&!s&&(this.pause(),E.render(h>=a?0:-vt)._zTime=h>=a?1:-1,this._ts))return this._start=M,Ga(this),this.render(i,s,o);this._onUpdate&&!s&&Dn(this,"onUpdate",!0),(u===l&&this._tTime>=this.totalDuration()||!u&&a)&&(M===this._start||Math.abs(x)!==Math.abs(this._ts))&&(this._lock||((i||!c)&&(u===l&&this._ts>0||!u&&this._ts<0)&&Qi(this,1),!s&&!(i<0&&!a)&&(u||a||!l)&&(Dn(this,u===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(i,s){var o=this;if(wi(s)||(s=kn(this,s,i)),!(i instanceof xo)){if(sn(i))return i.forEach(function(a){return o.add(a,s)}),this;if($t(i))return this.addLabel(i,s);if(Pt(i))i=Ot.delayedCall(0,i);else return this}return this!==i?ri(this,i,s):this},t.getChildren=function(i,s,o,a){i===void 0&&(i=!0),s===void 0&&(s=!0),o===void 0&&(o=!0),a===void 0&&(a=-Gn);for(var l=[],c=this._first;c;)c._start>=a&&(c instanceof Ot?s&&l.push(c):(o&&l.push(c),i&&l.push.apply(l,c.getChildren(!0,s,o)))),c=c._next;return l},t.getById=function(i){for(var s=this.getChildren(1,1,1),o=s.length;o--;)if(s[o].vars.id===i)return s[o]},t.remove=function(i){return $t(i)?this.removeLabel(i):Pt(i)?this.killTweensOf(i):(i.parent===this&&Va(this,i),i===this._recent&&(this._recent=this._last),Pr(this))},t.totalTime=function(i,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=wt(Pn.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),r.prototype.totalTime.call(this,i,s),this._forcing=0,this):this._tTime},t.addLabel=function(i,s){return this.labels[i]=kn(this,s),this},t.removeLabel=function(i){return delete this.labels[i],this},t.addPause=function(i,s,o){var a=Ot.delayedCall(0,s||_o,o);return a.data="isPause",this._hasPause=1,ri(this,a,kn(this,i))},t.removePause=function(i){var s=this._first;for(i=kn(this,i);s;)s._start===i&&s.data==="isPause"&&Qi(s),s=s._next},t.killTweensOf=function(i,s,o){for(var a=this.getTweensOf(i,o),l=a.length;l--;)Hi!==a[l]&&a[l].kill(i,s);return this},t.getTweensOf=function(i,s){for(var o=[],a=Wn(i),l=this._first,c=wi(s),u;l;)l instanceof Ot?Op(l._targets,a)&&(c?(!Hi||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&o.push(l):(u=l.getTweensOf(a,s)).length&&o.push.apply(o,u),l=l._next;return o},t.tweenTo=function(i,s){s=s||{};var o=this,a=kn(o,i),l=s,c=l.startAt,u=l.onStart,d=l.onStartParams,h=l.immediateRender,f,g=Ot.to(o,Fn({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:a,overwrite:"auto",duration:s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale())||vt,onStart:function(){if(o.pause(),!f){var p=s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale());g._dur!==p&&ws(g,p,0,1).render(g._time,!0,!0),f=1}u&&u.apply(g,d||[])}},s));return h?g.render(0):g},t.tweenFromTo=function(i,s,o){return this.tweenTo(s,Fn({startAt:{time:kn(this,i)}},o))},t.recent=function(){return this._recent},t.nextLabel=function(i){return i===void 0&&(i=this._time),mu(this,kn(this,i))},t.previousLabel=function(i){return i===void 0&&(i=this._time),mu(this,kn(this,i),1)},t.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+vt)},t.shiftChildren=function(i,s,o){o===void 0&&(o=0);var a=this._first,l=this.labels,c;for(i=wt(i);a;)a._start>=o&&(a._start+=i,a._end+=i),a=a._next;if(s)for(c in l)l[c]>=o&&(l[c]+=i);return Pr(this)},t.invalidate=function(i){var s=this._first;for(this._lock=0;s;)s.invalidate(i),s=s._next;return r.prototype.invalidate.call(this,i)},t.clear=function(i){i===void 0&&(i=!0);for(var s=this._first,o;s;)o=s._next,this.remove(s),s=o;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),Pr(this)},t.totalDuration=function(i){var s=0,o=this,a=o._last,l=Gn,c,u,d;if(arguments.length)return o.timeScale((o._repeat<0?o.duration():o.totalDuration())/(o.reversed()?-i:i));if(o._dirty){for(d=o.parent;a;)c=a._prev,a._dirty&&a.totalDuration(),u=a._start,u>l&&o._sort&&a._ts&&!o._lock?(o._lock=1,ri(o,a,u-a._delay,1)._lock=0):l=u,u<0&&a._ts&&(s-=u,(!d&&!o._dp||d&&d.smoothChildTiming)&&(o._start+=wt(u/o._ts),o._time-=u,o._tTime-=u),o.shiftChildren(-u,!1,-1/0),l=0),a._end>s&&a._ts&&(s=a._end),a=c;ws(o,o===Rt&&o._time>s?o._time:s,1,1),o._dirty=0}return o._tDur},e.updateRoot=function(i){if(Rt._ts&&(Af(Rt,wa(i,Rt)),Tf=Pn.frame),Pn.frame>=hu){hu+=In.autoSleep||120;var s=Rt._first;if((!s||!s._ts)&&In.autoSleep&&Pn._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||Pn.sleep()}}},e}(xo);Fn(_n.prototype,{_lock:0,_hasPause:0,_forcing:0});var om=function(e,t,n,i,s,o,a){var l=new xn(this._pt,e,t,0,1,Jf,null,s),c=0,u=0,d,h,f,g,_,p,m,E;for(l.b=n,l.e=i,n+="",i+="",(m=~i.indexOf("random("))&&(i=go(i)),o&&(E=[n,i],o(E,e,t),n=E[0],i=E[1]),h=n.match(tl)||[];d=tl.exec(i);)g=d[0],_=i.substring(c,d.index),f?f=(f+1)%5:_.substr(-5)==="rgba("&&(f=1),g!==h[u++]&&(p=parseFloat(h[u-1])||0,l._pt={_next:l._pt,p:_||u===1?_:",",s:p,c:g.charAt(1)==="="?ms(p,g)-p:parseFloat(g)-p,m:f&&f<4?Math.round:0},c=tl.lastIndex);return l.c=c<i.length?i.substring(c,i.length):"",l.fp=a,(Sf.test(i)||m)&&(l.e=0),this._pt=l,l},Fc=function(e,t,n,i,s,o,a,l,c,u){Pt(i)&&(i=i(s||0,e,o));var d=e[t],h=n!=="get"?n:Pt(d)?c?e[t.indexOf("set")||!Pt(e["get"+t.substr(3)])?t:"get"+t.substr(3)](c):e[t]():d,f=Pt(d)?c?hm:Zf:zc,g;if($t(i)&&(~i.indexOf("random(")&&(i=go(i)),i.charAt(1)==="="&&(g=ms(h,i)+(nn(h)||0),(g||g===0)&&(i=g))),!u||h!==i||rc)return!isNaN(h*i)&&i!==""?(g=new xn(this._pt,e,t,+h||0,i-(h||0),typeof d=="boolean"?dm:jf,0,f),c&&(g.fp=c),a&&g.modifier(a,this,e),this._pt=g):(!d&&!(t in e)&&Dc(t,i),om.call(this,e,t,h,i,f,l||In.stringFilter,c))},am=function(e,t,n,i,s){if(Pt(e)&&(e=io(e,s,t,n,i)),!fi(e)||e.style&&e.nodeType||sn(e)||vf(e))return $t(e)?io(e,s,t,n,i):e;var o={},a;for(a in e)o[a]=io(e[a],s,t,n,i);return o},qf=function(e,t,n,i,s,o){var a,l,c,u;if(Rn[e]&&(a=new Rn[e]).init(s,a.rawVars?t[e]:am(t[e],i,s,o,n),n,i,o)!==!1&&(n._pt=l=new xn(n._pt,s,e,0,1,a.render,a,0,a.priority),n!==fs))for(c=n._ptLookup[n._targets.indexOf(s)],u=a._props.length;u--;)c[a._props[u]]=l;return a},Hi,rc,Bc=function r(e,t,n){var i=e.vars,s=i.ease,o=i.startAt,a=i.immediateRender,l=i.lazy,c=i.onUpdate,u=i.runBackwards,d=i.yoyoEase,h=i.keyframes,f=i.autoRevert,g=e._dur,_=e._startAt,p=e._targets,m=e.parent,E=m&&m.data==="nested"?m.vars.targets:p,x=e._overwrite==="auto"&&!Rc,M=e.timeline,w=i.easeReverse||d,A,T,C,S,v,L,N,B,W,Y,G,V,H;if(M&&(!h||!s)&&(s="none"),e._ease=Lr(s,po.ease),e._rEase=w&&(Lr(w)||e._ease),e._from=!M&&!!i.runBackwards,e._from&&(e.ratio=1),!M||h&&!i.stagger){if(B=p[0]?Cr(p[0]).harness:0,V=B&&i[B.prop],A=Aa(i,Uc),_&&(_._zTime<0&&_.progress(1),t<0&&u&&a&&!f?_.render(-1,!0):_.revert(u&&g?pa:Ip),_._lazy=0),o){if(Qi(e._startAt=Ot.set(p,Fn({data:"isStart",overwrite:!1,parent:m,immediateRender:!0,lazy:!_&&gn(l),startAt:null,delay:0,onUpdate:c&&function(){return Dn(e,"onUpdate")},stagger:0},o))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(jt||!a&&!f)&&e._startAt.revert(pa),a&&g&&t<=0&&n<=0){t&&(e._zTime=t);return}}else if(u&&g&&!_){if(t&&(a=!1),C=Fn({overwrite:!1,data:"isFromStart",lazy:a&&!_&&gn(l),immediateRender:a,stagger:0,parent:m},A),V&&(C[B.prop]=V),Qi(e._startAt=Ot.set(p,C)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(jt?e._startAt.revert(pa):e._startAt.render(-1,!0)),e._zTime=t,!a)r(e._startAt,vt,vt);else if(!t)return}for(e._pt=e._ptCache=0,l=g&&gn(l)||l&&!g,T=0;T<p.length;T++){if(v=p[T],N=v._gsap||Nc(p)[T]._gsap,e._ptLookup[T]=Y={},Jl[N.id]&&$i.length&&ba(),G=E===p?T:E.indexOf(v),B&&(W=new B).init(v,V||A,e,G,E)!==!1&&(e._pt=S=new xn(e._pt,v,W.name,0,1,W.render,W,0,W.priority),W._props.forEach(function(ae){Y[ae]=S}),W.priority&&(L=1)),!B||V)for(C in A)Rn[C]&&(W=qf(C,A,e,G,v,E))?W.priority&&(L=1):Y[C]=S=Fc.call(e,v,C,"get",A[C],G,E,0,i.stringFilter);e._op&&e._op[T]&&e.kill(v,e._op[T]),x&&e._pt&&(Hi=e,Rt.killTweensOf(v,Y,e.globalTime(t)),H=!e.parent,Hi=0),e._pt&&l&&(Jl[N.id]=1)}L&&Qf(e),e._onInit&&e._onInit(e)}e._onUpdate=c,e._initted=(!e._op||e._pt)&&!H,h&&t<=0&&M.render(Gn,!0,!0)},lm=function(e,t,n,i,s,o,a,l){var c=(e._pt&&e._ptCache||(e._ptCache={}))[t],u,d,h,f;if(!c)for(c=e._ptCache[t]=[],h=e._ptLookup,f=e._targets.length;f--;){if(u=h[f][t],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==t&&u.fp!==t;)u=u._next;if(!u)return rc=1,e.vars[t]="+=0",Bc(e,a),rc=0,l?mo(t+" not eligible for reset. Try splitting into individual properties"):1;c.push(u)}for(f=c.length;f--;)d=c[f],u=d._pt||d,u.s=(i||i===0)&&!s?i:u.s+(i||0)+o*u.c,u.c=n-u.s,d.e&&(d.e=Dt(n)+nn(d.e)),d.b&&(d.b=u.s+nn(d.b))},cm=function(e,t){var n=e[0]?Cr(e[0]).harness:0,i=n&&n.aliases,s,o,a,l;if(!i)return t;s=bs({},t);for(o in i)if(o in s)for(l=i[o].split(","),a=l.length;a--;)s[l[a]]=s[o];return s},um=function(e,t,n,i){var s=t.ease||i||"power1.inOut",o,a;if(sn(t))a=n[e]||(n[e]=[]),t.forEach(function(l,c){return a.push({t:c/(t.length-1)*100,v:l,e:s})});else for(o in t)a=n[o]||(n[o]=[]),o==="ease"||a.push({t:parseFloat(e),v:t[o],e:s})},io=function(e,t,n,i,s){return Pt(e)?e.call(t,n,i,s):$t(e)&&~e.indexOf("random(")?go(e):e},$f=Ic+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",Kf={};vn($f+",id,stagger,delay,duration,paused,scrollTrigger",function(r){return Kf[r]=1});var Ot=function(r){_f(e,r);function e(n,i,s,o){var a;typeof i=="number"&&(s.duration=i,i=s,s=null),a=r.call(this,o?i:to(i))||this;var l=a.vars,c=l.duration,u=l.delay,d=l.immediateRender,h=l.stagger,f=l.overwrite,g=l.keyframes,_=l.defaults,p=l.scrollTrigger,m=i.parent||Rt,E=(sn(n)||vf(n)?wi(n[0]):"length"in i)?[n]:Wn(n),x,M,w,A,T,C,S,v;if(a._targets=E.length?Nc(E):mo("GSAP target "+n+" not found. https://gsap.com",!In.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=f,g||h||Po(c)||Po(u)){i=a.vars;var L=i.easeReverse||i.yoyoEase;if(x=a.timeline=new _n({data:"nested",defaults:_||{},targets:m&&m.data==="nested"?m.vars.targets:E}),x.kill(),x.parent=x._dp=Mi(a),x._start=0,h||Po(c)||Po(u)){if(A=E.length,S=h&&Nf(h),fi(h))for(T in h)~$f.indexOf(T)&&(v||(v={}),v[T]=h[T]);for(M=0;M<A;M++)w=Aa(i,Kf),w.stagger=0,L&&(w.easeReverse=L),v&&bs(w,v),C=E[M],w.duration=+io(c,Mi(a),M,C,E),w.delay=(+io(u,Mi(a),M,C,E)||0)-a._delay,!h&&A===1&&w.delay&&(a._delay=u=w.delay,a._start+=u,w.delay=0),x.to(C,w,S?S(M,C,E):0),x._ease=nt.none;x.duration()?c=u=0:a.timeline=0}else if(g){to(Fn(x.vars.defaults,{ease:"none"})),x._ease=Lr(g.ease||i.ease||"none");var N=0,B,W,Y;if(sn(g))g.forEach(function(G){return x.to(E,G,">")}),x.duration();else{w={};for(T in g)T==="ease"||T==="easeEach"||um(T,g[T],w,g.easeEach);for(T in w)for(B=w[T].sort(function(G,V){return G.t-V.t}),N=0,M=0;M<B.length;M++)W=B[M],Y={ease:W.e,duration:(W.t-(M?B[M-1].t:0))/100*c},Y[T]=W.v,x.to(E,Y,N),N+=Y.duration;x.duration()<c&&x.to({},{duration:c-x.duration()})}}c||a.duration(c=x.duration())}else a.timeline=0;return f===!0&&!Rc&&(Hi=Mi(a),Rt.killTweensOf(E),Hi=0),ri(m,Mi(a),s),i.reversed&&a.reverse(),i.paused&&a.paused(!0),(d||!c&&!g&&a._start===wt(m._time)&&gn(d)&&kp(Mi(a))&&m.data!=="nested")&&(a._tTime=-vt,a.render(Math.max(0,-u)||0)),p&&Lf(Mi(a),p),a}var t=e.prototype;return t.render=function(i,s,o){var a=this._time,l=this._tDur,c=this._dur,u=i<0,d=i>l-vt&&!u?l:i<vt?0:i,h,f,g,_,p,m,E,x;if(!c)Vp(this,i,s,o);else if(d!==this._tTime||!i||o||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(h=d,x=this.timeline,this._repeat){if(_=c+this._rDelay,this._repeat<-1&&u)return this.totalTime(_*100+i,s,o);if(h=wt(d%_),d===l?(g=this._repeat,h=c):(p=wt(d/_),g=~~p,g&&g===p?(h=c,g--):h>c&&(h=c)),m=this._yoyo&&g&1,m&&(h=c-h),p=As(this._tTime,_),h===a&&!o&&this._initted&&g===p)return this._tTime=d,this;g!==p&&this.vars.repeatRefresh&&!m&&!this._lock&&h!==_&&this._initted&&(this._lock=o=1,this.render(wt(_*g),!0).invalidate()._lock=0)}if(!this._initted){if(Df(this,u?i:h,o,s,d))return this._tTime=0,this;if(a!==this._time&&!(o&&this.vars.repeatRefresh&&g!==p))return this;if(c!==this._dur)return this.render(i,s,o)}if(this._rEase){var M=h<a;if(M!==this._inv){var w=M?a:c-a;this._inv=M,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=a,this._invRecip=w?(M?-1:1)/w:0,this._invScale=M?-this.ratio:1-this.ratio,this._invEase=M?this._rEase:this._ease}this.ratio=E=this._invRatio+this._invScale*this._invEase((h-this._invTime)*this._invRecip)}else this.ratio=E=this._ease(h/c);if(this._from&&(this.ratio=E=1-E),this._tTime=d,this._time=h,!this._act&&this._ts&&(this._act=1,this._lazy=0),!a&&d&&!s&&!p&&(Dn(this,"onStart"),this._tTime!==d))return this;for(f=this._pt;f;)f.r(E,f.d),f=f._next;x&&x.render(i<0?i:x._dur*x._ease(h/this._dur),s,o)||this._startAt&&(this._zTime=i),this._onUpdate&&!s&&(u&&Ql(this,i,s,o),Dn(this,"onUpdate")),this._repeat&&g!==p&&this.vars.onRepeat&&!s&&this.parent&&Dn(this,"onRepeat"),(d===this._tDur||!d)&&this._tTime===d&&(u&&!this._onUpdate&&Ql(this,i,!0,!0),(i||!c)&&(d===this._tDur&&this._ts>0||!d&&this._ts<0)&&Qi(this,1),!s&&!(u&&!a)&&(d||a||m)&&(Dn(this,d===l?"onComplete":"onReverseComplete",!0),this._prom&&!(d<l&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),r.prototype.invalidate.call(this,i)},t.resetTo=function(i,s,o,a,l){vo||Pn.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||Bc(this,c),u=this._ease(c/this._dur),lm(this,i,s,o,a,u,c,l)?this.resetTo(i,s,o,a,1):(Wa(this,0),this.parent||Cf(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(i,s){if(s===void 0&&(s="all"),!i&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?qs(this):this.scrollTrigger&&this.scrollTrigger.kill(!!jt),this;if(this.timeline){var o=this.timeline.totalDuration();return this.timeline.killTweensOf(i,s,Hi&&Hi.vars.overwrite!==!0)._first||qs(this),this.parent&&o!==this.timeline.totalDuration()&&ws(this,this._dur*this.timeline._tDur/o,0,1),this}var a=this._targets,l=i?Wn(i):a,c=this._ptLookup,u=this._pt,d,h,f,g,_,p,m;if((!s||s==="all")&&Bp(a,l))return s==="all"&&(this._pt=0),qs(this);for(d=this._op=this._op||[],s!=="all"&&($t(s)&&(_={},vn(s,function(E){return _[E]=1}),s=_),s=cm(a,s)),m=a.length;m--;)if(~l.indexOf(a[m])){h=c[m],s==="all"?(d[m]=s,g=h,f={}):(f=d[m]=d[m]||{},g=s);for(_ in g)p=h&&h[_],p&&((!("kill"in p.d)||p.d.kill(_)===!0)&&Va(this,p,"_pt"),delete h[_]),f!=="all"&&(f[_]=1)}return this._initted&&!this._pt&&u&&qs(this),this},e.to=function(i,s){return new e(i,s,arguments[2])},e.from=function(i,s){return no(1,arguments)},e.delayedCall=function(i,s,o,a){return new e(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:s,onReverseComplete:s,onCompleteParams:o,onReverseCompleteParams:o,callbackScope:a})},e.fromTo=function(i,s,o){return no(2,arguments)},e.set=function(i,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new e(i,s)},e.killTweensOf=function(i,s,o){return Rt.killTweensOf(i,s,o)},e}(xo);Fn(Ot.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});vn("staggerTo,staggerFrom,staggerFromTo",function(r){Ot[r]=function(){var e=new _n,t=tc.call(arguments,0);return t.splice(r==="staggerFromTo"?5:4,0,0),e[r].apply(e,t)}});var zc=function(e,t,n){return e[t]=n},Zf=function(e,t,n){return e[t](n)},hm=function(e,t,n,i){return e[t](i.fp,n)},fm=function(e,t,n){return e.setAttribute(t,n)},kc=function(e,t){return Pt(e[t])?Zf:Cc(e[t])&&e.setAttribute?fm:zc},jf=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},dm=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},Jf=function(e,t){var n=t._pt,i="";if(!e&&t.b)i=t.b;else if(e===1&&t.e)i=t.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*e):Math.round((n.s+n.c*e)*1e4)/1e4)+i,n=n._next;i+=t.c}t.set(t.t,t.p,i,t)},Hc=function(e,t){for(var n=t._pt;n;)n.r(e,n.d),n=n._next},pm=function(e,t,n,i){for(var s=this._pt,o;s;)o=s._next,s.p===i&&s.modifier(e,t,n),s=o},mm=function(e){for(var t=this._pt,n,i;t;)i=t._next,t.p===e&&!t.op||t.op===e?Va(this,t,"_pt"):t.dep||(n=1),t=i;return!n},_m=function(e,t,n,i){i.mSet(e,t,i.m.call(i.tween,n,i.mt),i)},Qf=function(e){for(var t=e._pt,n,i,s,o;t;){for(n=t._next,i=s;i&&i.pr>t.pr;)i=i._next;(t._prev=i?i._prev:o)?t._prev._next=t:s=t,(t._next=i)?i._prev=t:o=t,t=n}e._pt=s},xn=function(){function r(t,n,i,s,o,a,l,c,u){this.t=n,this.s=s,this.c=o,this.p=i,this.r=a||jf,this.d=l||this,this.set=c||zc,this.pr=u||0,this._next=t,t&&(t._prev=this)}var e=r.prototype;return e.modifier=function(n,i,s){this.mSet=this.mSet||this.set,this.set=_m,this.m=n,this.mt=s,this.tween=i},r}();vn(Ic+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(r){return Uc[r]=1});On.TweenMax=On.TweenLite=Ot;On.TimelineLite=On.TimelineMax=_n;Rt=new _n({sortChildren:!1,defaults:po,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});In.stringFilter=Wf;var Dr=[],_a={},gm=[],gu=0,vm=0,ol=function(e){return(_a[e]||gm).map(function(t){return t()})},sc=function(){var e=Date.now(),t=[];e-gu>2&&(ol("matchMediaInit"),Dr.forEach(function(n){var i=n.queries,s=n.conditions,o,a,l,c;for(a in i)o=ei.matchMedia(i[a]).matches,o&&(l=1),o!==s[a]&&(s[a]=o,c=1);c&&(n.revert(),l&&t.push(n))}),ol("matchMediaRevert"),t.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),gu=e,ol("matchMedia"))},ed=function(){function r(t,n){this.selector=n&&nc(n),this.data=[],this._r=[],this.isReverted=!1,this.id=vm++,t&&this.add(t)}var e=r.prototype;return e.add=function(n,i,s){Pt(n)&&(s=i,i=n,n=Pt);var o=this,a=function(){var c=At,u=o.selector,d;return c&&c!==o&&c.data.push(o),s&&(o.selector=nc(s)),At=o,d=i.apply(o,arguments),Pt(d)&&o._r.push(d),At=c,o.selector=u,o.isReverted=!1,d};return o.last=a,n===Pt?a(o,function(l){return o.add(null,l)}):n?o[n]=a:a},e.ignore=function(n){var i=At;At=null,n(this),At=i},e.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof r?n.push.apply(n,i.getTweens()):i instanceof Ot&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(n,i){var s=this;if(n?function(){for(var a=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(u){return a.splice(a.indexOf(u),1)}));for(a.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,d){return d.g-u.g||-1/0}).forEach(function(u){return u.t.revert(n)}),l=s.data.length;l--;)c=s.data[l],c instanceof _n?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof Ot)&&c.revert&&c.revert(n);s._r.forEach(function(u){return u(n,s)}),s.isReverted=!0}():this.data.forEach(function(a){return a.kill&&a.kill()}),this.clear(),i)for(var o=Dr.length;o--;)Dr[o].id===this.id&&Dr.splice(o,1)},e.revert=function(n){this.kill(n||{})},r}(),xm=function(){function r(t){this.contexts=[],this.scope=t,At&&At.data.push(this)}var e=r.prototype;return e.add=function(n,i,s){fi(n)||(n={matches:n});var o=new ed(0,s||this.scope),a=o.conditions={},l,c,u;At&&!o.selector&&(o.selector=At.selector),this.contexts.push(o),i=o.add("onMatch",i),o.queries=n;for(c in n)c==="all"?u=1:(l=ei.matchMedia(n[c]),l&&(Dr.indexOf(o)<0&&Dr.push(o),(a[c]=l.matches)&&(u=1),l.addListener?l.addListener(sc):l.addEventListener("change",sc)));return u&&i(o,function(d){return o.add(null,d)}),this},e.revert=function(n){this.kill(n||{})},e.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},r}(),Ra={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];t.forEach(function(i){return Hf(i)})},timeline:function(e){return new _n(e)},getTweensOf:function(e,t){return Rt.getTweensOf(e,t)},getProperty:function(e,t,n,i){$t(e)&&(e=Wn(e)[0]);var s=Cr(e||{}).get,o=n?Rf:wf;return n==="native"&&(n=""),e&&(t?o((Rn[t]&&Rn[t].get||s)(e,t,n,i)):function(a,l,c){return o((Rn[a]&&Rn[a].get||s)(e,a,l,c))})},quickSetter:function(e,t,n){if(e=Wn(e),e.length>1){var i=e.map(function(u){return En.quickSetter(u,t,n)}),s=i.length;return function(u){for(var d=s;d--;)i[d](u)}}e=e[0]||{};var o=Rn[t],a=Cr(e),l=a.harness&&(a.harness.aliases||{})[t]||t,c=o?function(u){var d=new o;fs._pt=0,d.init(e,n?u+n:u,fs,0,[e]),d.render(1,d),fs._pt&&Hc(1,fs)}:a.set(e,l);return o?c:function(u){return c(e,l,n?u+n:u,a,1)}},quickTo:function(e,t,n){var i,s=En.to(e,Fn((i={},i[t]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),o=function(l,c,u){return s.resetTo(t,l,c,u)};return o.tween=s,o},isTweening:function(e){return Rt.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=Lr(e.ease,po.ease)),fu(po,e||{})},config:function(e){return fu(In,e||{})},registerEffect:function(e){var t=e.name,n=e.effect,i=e.plugins,s=e.defaults,o=e.extendTimeline;(i||"").split(",").forEach(function(a){return a&&!Rn[a]&&!On[a]&&mo(t+" effect requires "+a+" plugin.")}),nl[t]=function(a,l,c){return n(Wn(a),Fn(l||{},s),c)},o&&(_n.prototype[t]=function(a,l,c){return this.add(nl[t](a,fi(l)?l:(c=l)&&{},this),c)})},registerEase:function(e,t){nt[e]=Lr(t)},parseEase:function(e,t){return arguments.length?Lr(e,t):nt},getById:function(e){return Rt.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var n=new _n(e),i,s;for(n.smoothChildTiming=gn(e.smoothChildTiming),Rt.remove(n),n._dp=0,n._time=n._tTime=Rt._time,i=Rt._first;i;)s=i._next,(t||!(!i._dur&&i instanceof Ot&&i.vars.onComplete===i._targets[0]))&&ri(n,i,i._start-i._delay),i=s;return ri(Rt,n,0),n},context:function(e,t){return e?new ed(e,t):At},matchMedia:function(e){return new xm(e)},matchMediaRefresh:function(){return Dr.forEach(function(e){var t=e.conditions,n,i;for(i in t)t[i]&&(t[i]=!1,n=1);n&&e.revert()})||sc()},addEventListener:function(e,t){var n=_a[e]||(_a[e]=[]);~n.indexOf(t)||n.push(t)},removeEventListener:function(e,t){var n=_a[e],i=n&&n.indexOf(t);i>=0&&n.splice(i,1)},utils:{wrap:Zp,wrapYoyo:jp,distribute:Nf,random:Ff,snap:Of,normalize:Kp,getUnit:nn,clamp:Xp,splitColor:Vf,toArray:Wn,selector:nc,mapRange:zf,pipe:qp,unitize:$p,interpolate:Jp,shuffle:If},install:yf,effects:nl,ticker:Pn,updateRoot:_n.updateRoot,plugins:Rn,globalTimeline:Rt,core:{PropTween:xn,globals:Ef,Tween:Ot,Timeline:_n,Animation:xo,getCache:Cr,_removeLinkedListItem:Va,reverting:function(){return jt},context:function(e){return e&&At&&(At.data.push(e),e._ctx=At),At},suppressOverwrites:function(e){return Rc=e}}};vn("to,from,fromTo,delayedCall,set,killTweensOf",function(r){return Ra[r]=Ot[r]});Pn.add(_n.updateRoot);fs=Ra.to({},{duration:0});var Sm=function(e,t){for(var n=e._pt;n&&n.p!==t&&n.op!==t&&n.fp!==t;)n=n._next;return n},Mm=function(e,t){var n=e._targets,i,s,o;for(i in t)for(s=n.length;s--;)o=e._ptLookup[s][i],o&&(o=o.d)&&(o._pt&&(o=Sm(o,i)),o&&o.modifier&&o.modifier(t[i],e,n[s],i))},al=function(e,t){return{name:e,headless:1,rawVars:1,init:function(i,s,o){o._onInit=function(a){var l,c;if($t(s)&&(l={},vn(s,function(u){return l[u]=1}),s=l),t){l={};for(c in s)l[c]=t(s[c]);s=l}Mm(a,s)}}}},En=Ra.registerPlugin({name:"attr",init:function(e,t,n,i,s){var o,a,l;this.tween=n;for(o in t)l=e.getAttribute(o)||"",a=this.add(e,"setAttribute",(l||0)+"",t[o],i,s,0,0,o),a.op=o,a.b=l,this._props.push(o)},render:function(e,t){for(var n=t._pt;n;)jt?n.set(n.t,n.p,n.b,n):n.r(e,n.d),n=n._next}},{name:"endArray",headless:1,init:function(e,t){for(var n=t.length;n--;)this.add(e,n,e[n]||0,t[n],0,0,0,0,0,1)}},al("roundProps",ic),al("modifiers"),al("snap",Of))||Ra;Ot.version=_n.version=En.version="3.15.0";Mf=1;Pc()&&Rs();nt.Power0;nt.Power1;nt.Power2;nt.Power3;nt.Power4;nt.Linear;nt.Quad;nt.Cubic;nt.Quart;nt.Quint;nt.Strong;nt.Elastic;nt.Back;nt.SteppedEase;nt.Bounce;nt.Sine;nt.Expo;nt.Circ;/*!
 * CSSPlugin 3.15.0
 * https://gsap.com
 *
 * Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var vu,Vi,_s,Vc,br,xu,Gc,ym=function(){return typeof window<"u"},Ri={},vr=180/Math.PI,gs=Math.PI/180,Vr=Math.atan2,Su=1e8,Wc=/([A-Z])/g,Em=/(left|right|width|margin|padding|x)/i,Tm=/[\s,\(]\S/,ai={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},oc=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},bm=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},Am=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},wm=function(e,t){return t.set(t.t,t.p,e===1?t.e:e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},Rm=function(e,t){var n=t.s+t.c*e;t.set(t.t,t.p,~~(n+(n<0?-.5:.5))+t.u,t)},td=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},nd=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},Cm=function(e,t,n){return e.style[t]=n},Pm=function(e,t,n){return e.style.setProperty(t,n)},Lm=function(e,t,n){return e._gsap[t]=n},Dm=function(e,t,n){return e._gsap.scaleX=e._gsap.scaleY=n},Um=function(e,t,n,i,s){var o=e._gsap;o.scaleX=o.scaleY=n,o.renderTransform(s,o)},Im=function(e,t,n,i,s){var o=e._gsap;o[t]=n,o.renderTransform(s,o)},Ct="transform",Sn=Ct+"Origin",Nm=function r(e,t){var n=this,i=this.target,s=i.style,o=i._gsap;if(e in Ri&&s){if(this.tfm=this.tfm||{},e!=="transform")e=ai[e]||e,~e.indexOf(",")?e.split(",").forEach(function(a){return n.tfm[a]=yi(i,a)}):this.tfm[e]=o.x?o[e]:yi(i,e),e===Sn&&(this.tfm.zOrigin=o.zOrigin);else return ai.transform.split(",").forEach(function(a){return r.call(n,a,t)});if(this.props.indexOf(Ct)>=0)return;o.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(Sn,t,"")),e=Ct}(s||t)&&this.props.push(e,t,s[e])},id=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},Om=function(){var e=this.props,t=this.target,n=t.style,i=t._gsap,s,o;for(s=0;s<e.length;s+=3)e[s+1]?e[s+1]===2?t[e[s]](e[s+2]):t[e[s]]=e[s+2]:e[s+2]?n[e[s]]=e[s+2]:n.removeProperty(e[s].substr(0,2)==="--"?e[s]:e[s].replace(Wc,"-$1").toLowerCase());if(this.tfm){for(o in this.tfm)i[o]=this.tfm[o];i.svg&&(i.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),s=Gc(),(!s||!s.isStart)&&!n[Ct]&&(id(n),i.zOrigin&&n[Sn]&&(n[Sn]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},rd=function(e,t){var n={target:e,props:[],revert:Om,save:Nm};return e._gsap||En.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(i){return n.save(i)}),n},sd,ac=function(e,t){var n=Vi.createElementNS?Vi.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):Vi.createElement(e);return n&&n.style?n:Vi.createElement(e)},Un=function r(e,t,n){var i=getComputedStyle(e);return i[t]||i.getPropertyValue(t.replace(Wc,"-$1").toLowerCase())||i.getPropertyValue(t)||!n&&r(e,Cs(t)||t,1)||""},Mu="O,Moz,ms,Ms,Webkit".split(","),Cs=function(e,t,n){var i=t||br,s=i.style,o=5;if(e in s&&!n)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);o--&&!(Mu[o]+e in s););return o<0?null:(o===3?"ms":o>=0?Mu[o]:"")+e},lc=function(){ym()&&window.document&&(vu=window,Vi=vu.document,_s=Vi.documentElement,br=ac("div")||{style:{}},ac("div"),Ct=Cs(Ct),Sn=Ct+"Origin",br.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",sd=!!Cs("perspective"),Gc=En.core.reverting,Vc=1)},yu=function(e){var t=e.ownerSVGElement,n=ac("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=e.cloneNode(!0),s;i.style.display="block",n.appendChild(i),_s.appendChild(n);try{s=i.getBBox()}catch{}return n.removeChild(i),_s.removeChild(n),s},Eu=function(e,t){for(var n=t.length;n--;)if(e.hasAttribute(t[n]))return e.getAttribute(t[n])},od=function(e){var t,n;try{t=e.getBBox()}catch{t=yu(e),n=1}return t&&(t.width||t.height)||n||(t=yu(e)),t&&!t.width&&!t.x&&!t.y?{x:+Eu(e,["x","cx","x1"])||0,y:+Eu(e,["y","cy","y1"])||0,width:0,height:0}:t},ad=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&od(e))},er=function(e,t){if(t){var n=e.style,i;t in Ri&&t!==Sn&&(t=Ct),n.removeProperty?(i=t.substr(0,2),(i==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),n.removeProperty(i==="--"?t:t.replace(Wc,"-$1").toLowerCase())):n.removeAttribute(t)}},Gi=function(e,t,n,i,s,o){var a=new xn(e._pt,t,n,0,1,o?nd:td);return e._pt=a,a.b=i,a.e=s,e._props.push(n),a},Tu={deg:1,rad:1,turn:1},Fm={grid:1,flex:1},tr=function r(e,t,n,i){var s=parseFloat(n)||0,o=(n+"").trim().substr((s+"").length)||"px",a=br.style,l=Em.test(t),c=e.tagName.toLowerCase()==="svg",u=(c?"client":"offset")+(l?"Width":"Height"),d=100,h=i==="px",f=i==="%",g,_,p,m;if(i===o||!s||Tu[i]||Tu[o])return s;if(o!=="px"&&!h&&(s=r(e,t,n,"px")),m=e.getCTM&&ad(e),(f||o==="%")&&(Ri[t]||~t.indexOf("adius")))return g=m?e.getBBox()[l?"width":"height"]:e[u],Dt(f?s/g*d:s/100*g);if(a[l?"width":"height"]=d+(h?o:i),_=i!=="rem"&&~t.indexOf("adius")||i==="em"&&e.appendChild&&!c?e:e.parentNode,m&&(_=(e.ownerSVGElement||{}).parentNode),(!_||_===Vi||!_.appendChild)&&(_=Vi.body),p=_._gsap,p&&f&&p.width&&l&&p.time===Pn.time&&!p.uncache)return Dt(s/p.width*d);if(f&&(t==="height"||t==="width")){var E=e.style[t];e.style[t]=d+i,g=e[u],E?e.style[t]=E:er(e,t)}else(f||o==="%")&&!Fm[Un(_,"display")]&&(a.position=Un(e,"position")),_===e&&(a.position="static"),_.appendChild(br),g=br[u],_.removeChild(br),a.position="absolute";return l&&f&&(p=Cr(_),p.time=Pn.time,p.width=_[u]),Dt(h?g*s/d:g&&s?d/g*s:0)},yi=function(e,t,n,i){var s;return Vc||lc(),t in ai&&t!=="transform"&&(t=ai[t],~t.indexOf(",")&&(t=t.split(",")[0])),Ri[t]&&t!=="transform"?(s=Mo(e,i),s=t!=="transformOrigin"?s[t]:s.svg?s.origin:Pa(Un(e,Sn))+" "+s.zOrigin+"px"):(s=e.style[t],(!s||s==="auto"||i||~(s+"").indexOf("calc("))&&(s=Ca[t]&&Ca[t](e,t,n)||Un(e,t)||bf(e,t)||(t==="opacity"?1:0))),n&&!~(s+"").trim().indexOf(" ")?tr(e,t,s,n)+n:s},Bm=function(e,t,n,i){if(!n||n==="none"){var s=Cs(t,e,1),o=s&&Un(e,s,1);o&&o!==n?(t=s,n=o):t==="borderColor"&&(n=Un(e,"borderTopColor"))}var a=new xn(this._pt,e.style,t,0,1,Jf),l=0,c=0,u,d,h,f,g,_,p,m,E,x,M,w;if(a.b=n,a.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=Un(e,i.substring(4,i.indexOf(")")))),i==="auto"&&(_=e.style[t],e.style[t]=i,i=Un(e,t)||i,_?e.style[t]=_:er(e,t)),u=[n,i],Wf(u),n=u[0],i=u[1],h=n.match(hs)||[],w=i.match(hs)||[],w.length){for(;d=hs.exec(i);)p=d[0],E=i.substring(l,d.index),g?g=(g+1)%5:(E.substr(-5)==="rgba("||E.substr(-5)==="hsla(")&&(g=1),p!==(_=h[c++]||"")&&(f=parseFloat(_)||0,M=_.substr((f+"").length),p.charAt(1)==="="&&(p=ms(f,p)+M),m=parseFloat(p),x=p.substr((m+"").length),l=hs.lastIndex-x.length,x||(x=x||In.units[t]||M,l===i.length&&(i+=x,a.e+=x)),M!==x&&(f=tr(e,t,_,x)||0),a._pt={_next:a._pt,p:E||c===1?E:",",s:f,c:m-f,m:g&&g<4||t==="zIndex"?Math.round:0});a.c=l<i.length?i.substring(l,i.length):""}else a.r=t==="display"&&i==="none"?nd:td;return Sf.test(i)&&(a.e=0),this._pt=a,a},bu={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},zm=function(e){var t=e.split(" "),n=t[0],i=t[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(e=n,n=i,i=e),t[0]=bu[n]||n,t[1]=bu[i]||i,t.join(" ")},km=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var n=t.t,i=n.style,s=t.u,o=n._gsap,a,l,c;if(s==="all"||s===!0)i.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)a=s[c],Ri[a]&&(l=1,a=a==="transformOrigin"?Sn:Ct),er(n,a);l&&(er(n,Ct),o&&(o.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",Mo(n,1),o.uncache=1,id(i)))}},Ca={clearProps:function(e,t,n,i,s){if(s.data!=="isFromStart"){var o=e._pt=new xn(e._pt,t,n,0,0,km);return o.u=i,o.pr=-10,o.tween=s,e._props.push(n),1}}},So=[1,0,0,1,0,0],ld={},cd=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},Au=function(e){var t=Un(e,Ct);return cd(t)?So:t.substr(7).match(xf).map(Dt)},Xc=function(e,t){var n=e._gsap||Cr(e),i=e.style,s=Au(e),o,a,l,c;return n.svg&&e.getAttribute("transform")?(l=e.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?So:s):(s===So&&!e.offsetParent&&e!==_s&&!n.svg&&(l=i.display,i.display="block",o=e.parentNode,(!o||!e.offsetParent&&!e.getBoundingClientRect().width)&&(c=1,a=e.nextElementSibling,_s.appendChild(e)),s=Au(e),l?i.display=l:er(e,"display"),c&&(a?o.insertBefore(e,a):o?o.appendChild(e):_s.removeChild(e))),t&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},cc=function(e,t,n,i,s,o){var a=e._gsap,l=s||Xc(e,!0),c=a.xOrigin||0,u=a.yOrigin||0,d=a.xOffset||0,h=a.yOffset||0,f=l[0],g=l[1],_=l[2],p=l[3],m=l[4],E=l[5],x=t.split(" "),M=parseFloat(x[0])||0,w=parseFloat(x[1])||0,A,T,C,S;n?l!==So&&(T=f*p-g*_)&&(C=M*(p/T)+w*(-_/T)+(_*E-p*m)/T,S=M*(-g/T)+w*(f/T)-(f*E-g*m)/T,M=C,w=S):(A=od(e),M=A.x+(~x[0].indexOf("%")?M/100*A.width:M),w=A.y+(~(x[1]||x[0]).indexOf("%")?w/100*A.height:w)),i||i!==!1&&a.smooth?(m=M-c,E=w-u,a.xOffset=d+(m*f+E*_)-m,a.yOffset=h+(m*g+E*p)-E):a.xOffset=a.yOffset=0,a.xOrigin=M,a.yOrigin=w,a.smooth=!!i,a.origin=t,a.originIsAbsolute=!!n,e.style[Sn]="0px 0px",o&&(Gi(o,a,"xOrigin",c,M),Gi(o,a,"yOrigin",u,w),Gi(o,a,"xOffset",d,a.xOffset),Gi(o,a,"yOffset",h,a.yOffset)),e.setAttribute("data-svg-origin",M+" "+w)},Mo=function(e,t){var n=e._gsap||new Yf(e);if("x"in n&&!t&&!n.uncache)return n;var i=e.style,s=n.scaleX<0,o="px",a="deg",l=getComputedStyle(e),c=Un(e,Sn)||"0",u,d,h,f,g,_,p,m,E,x,M,w,A,T,C,S,v,L,N,B,W,Y,G,V,H,ae,P,ue,Ne,Ye,$,ee;return u=d=h=_=p=m=E=x=M=0,f=g=1,n.svg=!!(e.getCTM&&ad(e)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[Ct]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[Ct]!=="none"?l[Ct]:"")),i.scale=i.rotate=i.translate="none"),T=Xc(e,n.svg),n.svg&&(n.uncache?(H=e.getBBox(),c=n.xOrigin-H.x+"px "+(n.yOrigin-H.y)+"px",V=""):V=!t&&e.getAttribute("data-svg-origin"),cc(e,V||c,!!V||n.originIsAbsolute,n.smooth!==!1,T)),w=n.xOrigin||0,A=n.yOrigin||0,T!==So&&(L=T[0],N=T[1],B=T[2],W=T[3],u=Y=T[4],d=G=T[5],T.length===6?(f=Math.sqrt(L*L+N*N),g=Math.sqrt(W*W+B*B),_=L||N?Vr(N,L)*vr:0,E=B||W?Vr(B,W)*vr+_:0,E&&(g*=Math.abs(Math.cos(E*gs))),n.svg&&(u-=w-(w*L+A*B),d-=A-(w*N+A*W))):(ee=T[6],Ye=T[7],P=T[8],ue=T[9],Ne=T[10],$=T[11],u=T[12],d=T[13],h=T[14],C=Vr(ee,Ne),p=C*vr,C&&(S=Math.cos(-C),v=Math.sin(-C),V=Y*S+P*v,H=G*S+ue*v,ae=ee*S+Ne*v,P=Y*-v+P*S,ue=G*-v+ue*S,Ne=ee*-v+Ne*S,$=Ye*-v+$*S,Y=V,G=H,ee=ae),C=Vr(-B,Ne),m=C*vr,C&&(S=Math.cos(-C),v=Math.sin(-C),V=L*S-P*v,H=N*S-ue*v,ae=B*S-Ne*v,$=W*v+$*S,L=V,N=H,B=ae),C=Vr(N,L),_=C*vr,C&&(S=Math.cos(C),v=Math.sin(C),V=L*S+N*v,H=Y*S+G*v,N=N*S-L*v,G=G*S-Y*v,L=V,Y=H),p&&Math.abs(p)+Math.abs(_)>359.9&&(p=_=0,m=180-m),f=Dt(Math.sqrt(L*L+N*N+B*B)),g=Dt(Math.sqrt(G*G+ee*ee)),C=Vr(Y,G),E=Math.abs(C)>2e-4?C*vr:0,M=$?1/($<0?-$:$):0),n.svg&&(V=e.getAttribute("transform"),n.forceCSS=e.setAttribute("transform","")||!cd(Un(e,Ct)),V&&e.setAttribute("transform",V))),Math.abs(E)>90&&Math.abs(E)<270&&(s?(f*=-1,E+=_<=0?180:-180,_+=_<=0?180:-180):(g*=-1,E+=E<=0?180:-180)),t=t||n.uncache,n.x=u-((n.xPercent=u&&(!t&&n.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-u)?-50:0)))?e.offsetWidth*n.xPercent/100:0)+o,n.y=d-((n.yPercent=d&&(!t&&n.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-d)?-50:0)))?e.offsetHeight*n.yPercent/100:0)+o,n.z=h+o,n.scaleX=Dt(f),n.scaleY=Dt(g),n.rotation=Dt(_)+a,n.rotationX=Dt(p)+a,n.rotationY=Dt(m)+a,n.skewX=E+a,n.skewY=x+a,n.transformPerspective=M+o,(n.zOrigin=parseFloat(c.split(" ")[2])||!t&&n.zOrigin||0)&&(i[Sn]=Pa(c)),n.xOffset=n.yOffset=0,n.force3D=In.force3D,n.renderTransform=n.svg?Vm:sd?ud:Hm,n.uncache=0,n},Pa=function(e){return(e=e.split(" "))[0]+" "+e[1]},ll=function(e,t,n){var i=nn(t);return Dt(parseFloat(t)+parseFloat(tr(e,"x",n+"px",i)))+i},Hm=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,ud(e,t)},cr="0deg",zs="0px",ur=") ",ud=function(e,t){var n=t||this,i=n.xPercent,s=n.yPercent,o=n.x,a=n.y,l=n.z,c=n.rotation,u=n.rotationY,d=n.rotationX,h=n.skewX,f=n.skewY,g=n.scaleX,_=n.scaleY,p=n.transformPerspective,m=n.force3D,E=n.target,x=n.zOrigin,M="",w=m==="auto"&&e&&e!==1||m===!0;if(x&&(d!==cr||u!==cr)){var A=parseFloat(u)*gs,T=Math.sin(A),C=Math.cos(A),S;A=parseFloat(d)*gs,S=Math.cos(A),o=ll(E,o,T*S*-x),a=ll(E,a,-Math.sin(A)*-x),l=ll(E,l,C*S*-x+x)}p!==zs&&(M+="perspective("+p+ur),(i||s)&&(M+="translate("+i+"%, "+s+"%) "),(w||o!==zs||a!==zs||l!==zs)&&(M+=l!==zs||w?"translate3d("+o+", "+a+", "+l+") ":"translate("+o+", "+a+ur),c!==cr&&(M+="rotate("+c+ur),u!==cr&&(M+="rotateY("+u+ur),d!==cr&&(M+="rotateX("+d+ur),(h!==cr||f!==cr)&&(M+="skew("+h+", "+f+ur),(g!==1||_!==1)&&(M+="scale("+g+", "+_+ur),E.style[Ct]=M||"translate(0, 0)"},Vm=function(e,t){var n=t||this,i=n.xPercent,s=n.yPercent,o=n.x,a=n.y,l=n.rotation,c=n.skewX,u=n.skewY,d=n.scaleX,h=n.scaleY,f=n.target,g=n.xOrigin,_=n.yOrigin,p=n.xOffset,m=n.yOffset,E=n.forceCSS,x=parseFloat(o),M=parseFloat(a),w,A,T,C,S;l=parseFloat(l),c=parseFloat(c),u=parseFloat(u),u&&(u=parseFloat(u),c+=u,l+=u),l||c?(l*=gs,c*=gs,w=Math.cos(l)*d,A=Math.sin(l)*d,T=Math.sin(l-c)*-h,C=Math.cos(l-c)*h,c&&(u*=gs,S=Math.tan(c-u),S=Math.sqrt(1+S*S),T*=S,C*=S,u&&(S=Math.tan(u),S=Math.sqrt(1+S*S),w*=S,A*=S)),w=Dt(w),A=Dt(A),T=Dt(T),C=Dt(C)):(w=d,C=h,A=T=0),(x&&!~(o+"").indexOf("px")||M&&!~(a+"").indexOf("px"))&&(x=tr(f,"x",o,"px"),M=tr(f,"y",a,"px")),(g||_||p||m)&&(x=Dt(x+g-(g*w+_*T)+p),M=Dt(M+_-(g*A+_*C)+m)),(i||s)&&(S=f.getBBox(),x=Dt(x+i/100*S.width),M=Dt(M+s/100*S.height)),S="matrix("+w+","+A+","+T+","+C+","+x+","+M+")",f.setAttribute("transform",S),E&&(f.style[Ct]=S)},Gm=function(e,t,n,i,s){var o=360,a=$t(s),l=parseFloat(s)*(a&&~s.indexOf("rad")?vr:1),c=l-i,u=i+c+"deg",d,h;return a&&(d=s.split("_")[1],d==="short"&&(c%=o,c!==c%(o/2)&&(c+=c<0?o:-o)),d==="cw"&&c<0?c=(c+o*Su)%o-~~(c/o)*o:d==="ccw"&&c>0&&(c=(c-o*Su)%o-~~(c/o)*o)),e._pt=h=new xn(e._pt,t,n,i,c,bm),h.e=u,h.u="deg",e._props.push(n),h},wu=function(e,t){for(var n in t)e[n]=t[n];return e},Wm=function(e,t,n){var i=wu({},n._gsap),s="perspective,force3D,transformOrigin,svgOrigin",o=n.style,a,l,c,u,d,h,f,g;i.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),o[Ct]=t,a=Mo(n,1),er(n,Ct),n.setAttribute("transform",c)):(c=getComputedStyle(n)[Ct],o[Ct]=t,a=Mo(n,1),o[Ct]=c);for(l in Ri)c=i[l],u=a[l],c!==u&&s.indexOf(l)<0&&(f=nn(c),g=nn(u),d=f!==g?tr(n,l,c,g):parseFloat(c),h=parseFloat(u),e._pt=new xn(e._pt,a,l,d,h-d,oc),e._pt.u=g||0,e._props.push(l));wu(a,i)};vn("padding,margin,Width,Radius",function(r,e){var t="Top",n="Right",i="Bottom",s="Left",o=(e<3?[t,n,i,s]:[t+s,t+n,i+n,i+s]).map(function(a){return e<2?r+a:"border"+a+r});Ca[e>1?"border"+r:r]=function(a,l,c,u,d){var h,f;if(arguments.length<4)return h=o.map(function(g){return yi(a,g,c)}),f=h.join(" "),f.split(h[0]).length===5?h[0]:f;h=(u+"").split(" "),f={},o.forEach(function(g,_){return f[g]=h[_]=h[_]||h[(_-1)/2|0]}),a.init(l,f,d)}});var hd={name:"css",register:lc,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,n,i,s){var o=this._props,a=e.style,l=n.vars.startAt,c,u,d,h,f,g,_,p,m,E,x,M,w,A,T,C,S;Vc||lc(),this.styles=this.styles||rd(e),C=this.styles.props,this.tween=n;for(_ in t)if(_!=="autoRound"&&(u=t[_],!(Rn[_]&&qf(_,t,n,i,e,s)))){if(f=typeof u,g=Ca[_],f==="function"&&(u=u.call(n,i,e,s),f=typeof u),f==="string"&&~u.indexOf("random(")&&(u=go(u)),g)g(this,e,_,u,n)&&(T=1);else if(_.substr(0,2)==="--")c=(getComputedStyle(e).getPropertyValue(_)+"").trim(),u+="",Ki.lastIndex=0,Ki.test(c)||(p=nn(c),m=nn(u),m?p!==m&&(c=tr(e,_,c,m)+m):p&&(u+=p)),this.add(a,"setProperty",c,u,i,s,0,0,_),o.push(_),C.push(_,0,a[_]);else if(f!=="undefined"){if(l&&_ in l?(c=typeof l[_]=="function"?l[_].call(n,i,e,s):l[_],$t(c)&&~c.indexOf("random(")&&(c=go(c)),nn(c+"")||c==="auto"||(c+=In.units[_]||nn(yi(e,_))||""),(c+"").charAt(1)==="="&&(c=yi(e,_))):c=yi(e,_),h=parseFloat(c),E=f==="string"&&u.charAt(1)==="="&&u.substr(0,2),E&&(u=u.substr(2)),d=parseFloat(u),_ in ai&&(_==="autoAlpha"&&(h===1&&yi(e,"visibility")==="hidden"&&d&&(h=0),C.push("visibility",0,a.visibility),Gi(this,a,"visibility",h?"inherit":"hidden",d?"inherit":"hidden",!d)),_!=="scale"&&_!=="transform"&&(_=ai[_],~_.indexOf(",")&&(_=_.split(",")[0]))),x=_ in Ri,x){if(this.styles.save(_),S=u,f==="string"&&u.substring(0,6)==="var(--"){if(u=Un(e,u.substring(4,u.indexOf(")"))),u.substring(0,5)==="calc("){var v=e.style.perspective;e.style.perspective=u,u=Un(e,"perspective"),v?e.style.perspective=v:er(e,"perspective")}d=parseFloat(u)}if(M||(w=e._gsap,w.renderTransform&&!t.parseTransform||Mo(e,t.parseTransform),A=t.smoothOrigin!==!1&&w.smooth,M=this._pt=new xn(this._pt,a,Ct,0,1,w.renderTransform,w,0,-1),M.dep=1),_==="scale")this._pt=new xn(this._pt,w,"scaleY",w.scaleY,(E?ms(w.scaleY,E+d):d)-w.scaleY||0,oc),this._pt.u=0,o.push("scaleY",_),_+="X";else if(_==="transformOrigin"){C.push(Sn,0,a[Sn]),u=zm(u),w.svg?cc(e,u,0,A,0,this):(m=parseFloat(u.split(" ")[2])||0,m!==w.zOrigin&&Gi(this,w,"zOrigin",w.zOrigin,m),Gi(this,a,_,Pa(c),Pa(u)));continue}else if(_==="svgOrigin"){cc(e,u,1,A,0,this);continue}else if(_ in ld){Gm(this,w,_,h,E?ms(h,E+u):u);continue}else if(_==="smoothOrigin"){Gi(this,w,"smooth",w.smooth,u);continue}else if(_==="force3D"){w[_]=u;continue}else if(_==="transform"){Wm(this,u,e);continue}}else _ in a||(_=Cs(_)||_);if(x||(d||d===0)&&(h||h===0)&&!Tm.test(u)&&_ in a)p=(c+"").substr((h+"").length),d||(d=0),m=nn(u)||(_ in In.units?In.units[_]:p),p!==m&&(h=tr(e,_,c,m)),this._pt=new xn(this._pt,x?w:a,_,h,(E?ms(h,E+d):d)-h,!x&&(m==="px"||_==="zIndex")&&t.autoRound!==!1?Rm:oc),this._pt.u=m||0,x&&S!==u?(this._pt.b=c,this._pt.e=S,this._pt.r=wm):p!==m&&m!=="%"&&(this._pt.b=c,this._pt.r=Am);else if(_ in a)Bm.call(this,e,_,c,E?E+u:u);else if(_ in e)this.add(e,_,c||e[_],E?E+u:u,i,s);else if(_!=="parseTransform"){Dc(_,u);continue}x||(_ in a?C.push(_,0,a[_]):typeof e[_]=="function"?C.push(_,2,e[_]()):C.push(_,1,c||e[_])),o.push(_)}}T&&Qf(this)},render:function(e,t){if(t.tween._time||!Gc())for(var n=t._pt;n;)n.r(e,n.d),n=n._next;else t.styles.revert()},get:yi,aliases:ai,getSetter:function(e,t,n){var i=ai[t];return i&&i.indexOf(",")<0&&(t=i),t in Ri&&t!==Sn&&(e._gsap.x||yi(e,"x"))?n&&xu===n?t==="scale"?Dm:Lm:(xu=n||{})&&(t==="scale"?Um:Im):e.style&&!Cc(e.style[t])?Cm:~t.indexOf("-")?Pm:kc(e,t)},core:{_removeProperty:er,_getMatrix:Xc}};En.utils.checkPrefix=Cs;En.core.getStyleSaver=rd;(function(r,e,t,n){var i=vn(r+","+e+","+t,function(s){Ri[s]=1});vn(e,function(s){In.units[s]="deg",ld[s]=1}),ai[i[13]]=r+","+e,vn(n,function(s){var o=s.split(":");ai[o[1]]=i[o[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");vn("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(r){In.units[r]="px"});En.registerPlugin(hd);var kt=En.registerPlugin(hd)||En;kt.core.Tween;function Xm(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}function Ym(r,e,t){return e&&Xm(r.prototype,e),r}/*!
 * Observer 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var Kt,ga,Ln,Wi,Xi,vs,fd,xr,xs,dd,Ti,Zn,pd,md=function(){return Kt||typeof window<"u"&&(Kt=window.gsap)&&Kt.registerPlugin&&Kt},_d=1,ds=[],et=[],hi=[],ro=Date.now,uc=function(e,t){return t},qm=function(){var e=xs.core,t=e.bridge||{},n=e._scrollers,i=e._proxies;n.push.apply(n,et),i.push.apply(i,hi),et=n,hi=i,uc=function(o,a){return t[o](a)}},Zi=function(e,t){return~hi.indexOf(e)&&hi[hi.indexOf(e)+1][t]},so=function(e){return!!~dd.indexOf(e)},an=function(e,t,n,i,s){return e.addEventListener(t,n,{passive:i!==!1,capture:!!s})},on=function(e,t,n,i){return e.removeEventListener(t,n,!!i)},Lo="scrollLeft",Do="scrollTop",hc=function(){return Ti&&Ti.isPressed||et.cache++},La=function(e,t){var n=function i(s){if(s||s===0){_d&&(Ln.history.scrollRestoration="manual");var o=Ti&&Ti.isPressed;s=i.v=Math.round(s)||(Ti&&Ti.iOS?1:0),e(s),i.cacheID=et.cache,o&&uc("ss",s)}else(t||et.cache!==i.cacheID||uc("ref"))&&(i.cacheID=et.cache,i.v=e());return i.v+i.offset};return n.offset=0,e&&n},fn={s:Lo,p:"left",p2:"Left",os:"right",os2:"Right",d:"width",d2:"Width",a:"x",sc:La(function(r){return arguments.length?Ln.scrollTo(r,zt.sc()):Ln.pageXOffset||Wi[Lo]||Xi[Lo]||vs[Lo]||0})},zt={s:Do,p:"top",p2:"Top",os:"bottom",os2:"Bottom",d:"height",d2:"Height",a:"y",op:fn,sc:La(function(r){return arguments.length?Ln.scrollTo(fn.sc(),r):Ln.pageYOffset||Wi[Do]||Xi[Do]||vs[Do]||0})},pn=function(e,t){return(t&&t._ctx&&t._ctx.selector||Kt.utils.toArray)(e)[0]||(typeof e=="string"&&Kt.config().nullTargetWarn!==!1?console.warn("Element not found:",e):null)},$m=function(e,t){for(var n=t.length;n--;)if(t[n]===e||t[n].contains(e))return!0;return!1},nr=function(e,t){var n=t.s,i=t.sc;so(e)&&(e=Wi.scrollingElement||Xi);var s=et.indexOf(e),o=i===zt.sc?1:2;!~s&&(s=et.push(e)-1),et[s+o]||an(e,"scroll",hc);var a=et[s+o],l=a||(et[s+o]=La(Zi(e,n),!0)||(so(e)?i:La(function(c){return arguments.length?e[n]=c:e[n]})));return l.target=e,a||(l.smooth=Kt.getProperty(e,"scrollBehavior")==="smooth"),l},fc=function(e,t,n){var i=e,s=e,o=ro(),a=o,l=t||50,c=Math.max(500,l*3),u=function(g,_){var p=ro();_||p-o>l?(s=i,i=g,a=o,o=p):n?i+=g:i=s+(g-s)/(p-a)*(o-a)},d=function(){s=i=n?0:i,a=o=0},h=function(g){var _=a,p=s,m=ro();return(g||g===0)&&g!==i&&u(g),o===a||m-a>c?0:(i+(n?p:-p))/((n?m:o)-_)*1e3};return{update:u,reset:d,getVelocity:h}},ks=function(e,t){return t&&!e._gsapAllow&&e.cancelable!==!1&&e.preventDefault(),e.changedTouches?e.changedTouches[0]:e},Ru=function(e){var t=Math.max.apply(Math,e),n=Math.min.apply(Math,e);return Math.abs(t)>=Math.abs(n)?t:n},gd=function(){xs=Kt.core.globals().ScrollTrigger,xs&&xs.core&&qm()},vd=function(e){return Kt=e||md(),!ga&&Kt&&typeof document<"u"&&document.body&&(Ln=window,Wi=document,Xi=Wi.documentElement,vs=Wi.body,dd=[Ln,Wi,Xi,vs],Kt.utils.clamp,pd=Kt.core.context||function(){},xr="onpointerenter"in vs?"pointer":"mouse",fd=Ut.isTouch=Ln.matchMedia&&Ln.matchMedia("(hover: none), (pointer: coarse)").matches?1:"ontouchstart"in Ln||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?2:0,Zn=Ut.eventTypes=("ontouchstart"in Xi?"touchstart,touchmove,touchcancel,touchend":"onpointerdown"in Xi?"pointerdown,pointermove,pointercancel,pointerup":"mousedown,mousemove,mouseup,mouseup").split(","),setTimeout(function(){return _d=0},500),ga=1),xs||gd(),ga};fn.op=zt;et.cache=0;var Ut=function(){function r(t){this.init(t)}var e=r.prototype;return e.init=function(n){ga||vd(Kt)||console.warn("Please gsap.registerPlugin(Observer)"),xs||gd();var i=n.tolerance,s=n.dragMinimum,o=n.type,a=n.target,l=n.lineHeight,c=n.debounce,u=n.preventDefault,d=n.onStop,h=n.onStopDelay,f=n.ignore,g=n.wheelSpeed,_=n.event,p=n.onDragStart,m=n.onDragEnd,E=n.onDrag,x=n.onPress,M=n.onRelease,w=n.onRight,A=n.onLeft,T=n.onUp,C=n.onDown,S=n.onChangeX,v=n.onChangeY,L=n.onChange,N=n.onToggleX,B=n.onToggleY,W=n.onHover,Y=n.onHoverEnd,G=n.onMove,V=n.ignoreCheck,H=n.isNormalizer,ae=n.onGestureStart,P=n.onGestureEnd,ue=n.onWheel,Ne=n.onEnable,Ye=n.onDisable,$=n.onClick,ee=n.scrollSpeed,fe=n.capture,oe=n.allowClicks,De=n.lockAxis,Ce=n.onLockAxis;this.target=a=pn(a)||Xi,this.vars=n,f&&(f=Kt.utils.toArray(f)),i=i||1e-9,s=s||0,g=g||1,ee=ee||1,o=o||"wheel,touch,pointer",c=c!==!1,l||(l=parseFloat(Ln.getComputedStyle(vs).lineHeight)||22);var We,D,Oe,_e,Ve,Se,ze,F=this,Le=0,st=0,R=n.passive||!u&&n.passive!==!1,y=nr(a,fn),X=nr(a,zt),J=y(),te=X(),j=~o.indexOf("touch")&&!~o.indexOf("pointer")&&Zn[0]==="pointerdown",Te=so(a),ie=a.ownerDocument||Wi,ce=[0,0,0],Ie=[0,0,0],re=0,ye=function(){return re=ro()},we=function(be,je){return(F.event=be)&&f&&$m(be.target,f)||je&&j&&be.pointerType!=="touch"||V&&V(be,je)},Fe=function(){F._vx.reset(),F._vy.reset(),D.pause(),d&&d(F)},he=function(){var be=F.deltaX=Ru(ce),je=F.deltaY=Ru(Ie),de=Math.abs(be)>=i,He=Math.abs(je)>=i;L&&(de||He)&&L(F,be,je,ce,Ie),de&&(w&&F.deltaX>0&&w(F),A&&F.deltaX<0&&A(F),S&&S(F),N&&F.deltaX<0!=Le<0&&N(F),Le=F.deltaX,ce[0]=ce[1]=ce[2]=0),He&&(C&&F.deltaY>0&&C(F),T&&F.deltaY<0&&T(F),v&&v(F),B&&F.deltaY<0!=st<0&&B(F),st=F.deltaY,Ie[0]=Ie[1]=Ie[2]=0),(_e||Oe)&&(G&&G(F),Oe&&(p&&Oe===1&&p(F),E&&E(F),Oe=0),_e=!1),Se&&!(Se=!1)&&Ce&&Ce(F),Ve&&(ue(F),Ve=!1),We=0},ke=function(be,je,de){ce[de]+=be,Ie[de]+=je,F._vx.update(be),F._vy.update(je),c?We||(We=requestAnimationFrame(he)):he()},Xe=function(be,je){De&&!ze&&(F.axis=ze=Math.abs(be)>Math.abs(je)?"x":"y",Se=!0),ze!=="y"&&(ce[2]+=be,F._vx.update(be,!0)),ze!=="x"&&(Ie[2]+=je,F._vy.update(je,!0)),c?We||(We=requestAnimationFrame(he)):he()},ot=function(be){if(!we(be,1)){be=ks(be,u);var je=be.clientX,de=be.clientY,He=je-F.x,Pe=de-F.y,Be=F.isDragging;F.x=je,F.y=de,(Be||(He||Pe)&&(Math.abs(F.startX-je)>=s||Math.abs(F.startY-de)>=s))&&(Oe||(Oe=Be?2:1),Be||(F.isDragging=!0),Xe(He,Pe))}},U=F.onPress=function(Ue){we(Ue,1)||Ue&&Ue.button||(F.axis=ze=null,D.pause(),F.isPressed=!0,Ue=ks(Ue),Le=st=0,F.startX=F.x=Ue.clientX,F.startY=F.y=Ue.clientY,F._vx.reset(),F._vy.reset(),an(H?a:ie,Zn[1],ot,R,!0),F.deltaX=F.deltaY=0,x&&x(F))},Q=F.onRelease=function(Ue){if(!we(Ue,1)){on(H?a:ie,Zn[1],ot,!0);var be=!isNaN(F.y-F.startY),je=F.isDragging,de=je&&(Math.abs(F.x-F.startX)>3||Math.abs(F.y-F.startY)>3),He=ks(Ue);!de&&be&&(F._vx.reset(),F._vy.reset(),u&&oe&&Kt.delayedCall(.08,function(){if(ro()-re>300&&!Ue.defaultPrevented){if(Ue.target.click)Ue.target.click();else if(ie.createEvent){var Pe=ie.createEvent("MouseEvents");Pe.initMouseEvent("click",!0,!0,Ln,1,He.screenX,He.screenY,He.clientX,He.clientY,!1,!1,!1,!1,0,null),Ue.target.dispatchEvent(Pe)}}})),F.isDragging=F.isGesturing=F.isPressed=!1,d&&je&&!H&&D.restart(!0),Oe&&he(),m&&je&&m(F),M&&M(F,de)}},K=function(be){return be.touches&&be.touches.length>1&&(F.isGesturing=!0)&&ae(be,F.isDragging)},Z=function(){return(F.isGesturing=!1)||P(F)},se=function(be){if(!we(be)){var je=y(),de=X();ke((je-J)*ee,(de-te)*ee,1),J=je,te=de,d&&D.restart(!0)}},Re=function(be){if(!we(be)){be=ks(be,u),ue&&(Ve=!0);var je=(be.deltaMode===1?l:be.deltaMode===2?Ln.innerHeight:1)*g;ke(be.deltaX*je,be.deltaY*je,0),d&&!H&&D.restart(!0)}},Ze=function(be){if(!we(be)){var je=be.clientX,de=be.clientY,He=je-F.x,Pe=de-F.y;F.x=je,F.y=de,_e=!0,d&&D.restart(!0),(He||Pe)&&Xe(He,Pe)}},dt=function(be){F.event=be,W(F)},pt=function(be){F.event=be,Y(F)},it=function(be){return we(be)||ks(be,u)&&$(F)};D=F._dc=Kt.delayedCall(h||.25,Fe).pause(),F.deltaX=F.deltaY=0,F._vx=fc(0,50,!0),F._vy=fc(0,50,!0),F.scrollX=y,F.scrollY=X,F.isDragging=F.isGesturing=F.isPressed=!1,pd(this),F.enable=function(Ue){return F.isEnabled||(an(Te?ie:a,"scroll",hc),o.indexOf("scroll")>=0&&an(Te?ie:a,"scroll",se,R,fe),o.indexOf("wheel")>=0&&an(a,"wheel",Re,R,fe),(o.indexOf("touch")>=0&&fd||o.indexOf("pointer")>=0)&&(an(a,Zn[0],U,R,fe),an(ie,Zn[2],Q),an(ie,Zn[3],Q),oe&&an(a,"click",ye,!0,!0),$&&an(a,"click",it),ae&&an(ie,"gesturestart",K),P&&an(ie,"gestureend",Z),W&&an(a,xr+"enter",dt),Y&&an(a,xr+"leave",pt),G&&an(a,xr+"move",Ze)),F.isEnabled=!0,F.isDragging=F.isGesturing=F.isPressed=_e=Oe=!1,F._vx.reset(),F._vy.reset(),J=y(),te=X(),Ue&&Ue.type&&U(Ue),Ne&&Ne(F)),F},F.disable=function(){F.isEnabled&&(ds.filter(function(Ue){return Ue!==F&&so(Ue.target)}).length||on(Te?ie:a,"scroll",hc),F.isPressed&&(F._vx.reset(),F._vy.reset(),on(H?a:ie,Zn[1],ot,!0)),on(Te?ie:a,"scroll",se,fe),on(a,"wheel",Re,fe),on(a,Zn[0],U,fe),on(ie,Zn[2],Q),on(ie,Zn[3],Q),on(a,"click",ye,!0),on(a,"click",it),on(ie,"gesturestart",K),on(ie,"gestureend",Z),on(a,xr+"enter",dt),on(a,xr+"leave",pt),on(a,xr+"move",Ze),F.isEnabled=F.isPressed=F.isDragging=!1,Ye&&Ye(F))},F.kill=F.revert=function(){F.disable();var Ue=ds.indexOf(F);Ue>=0&&ds.splice(Ue,1),Ti===F&&(Ti=0)},ds.push(F),H&&so(a)&&(Ti=F),F.enable(_)},Ym(r,[{key:"velocityX",get:function(){return this._vx.getVelocity()}},{key:"velocityY",get:function(){return this._vy.getVelocity()}}]),r}();Ut.version="3.15.0";Ut.create=function(r){return new Ut(r)};Ut.register=vd;Ut.getAll=function(){return ds.slice()};Ut.getById=function(r){return ds.filter(function(e){return e.vars.id===r})[0]};md()&&Kt.registerPlugin(Ut);/*!
 * ScrollTrigger 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var ve,cs,Qe,ut,Cn,at,Yc,Da,yo,oo,Ks,Uo,en,Xa,dc,un,Cu,Pu,us,xd,cl,Sd,cn,pc,Md,yd,zi,mc,qc,Ss,$c,ao,_c,ul,Io=1,tn=Date.now,hl=tn(),Yn=0,Zs=0,Lu=function(e,t,n){var i=wn(e)&&(e.substr(0,6)==="clamp("||e.indexOf("max")>-1);return n["_"+t+"Clamp"]=i,i?e.substr(6,e.length-7):e},Du=function(e,t){return t&&(!wn(e)||e.substr(0,6)!=="clamp(")?"clamp("+e+")":e},Km=function r(){return Zs&&requestAnimationFrame(r)},Uu=function(){return Xa=1},Iu=function(){return Xa=0},ti=function(e){return e},js=function(e){return Math.round(e*1e5)/1e5||0},Ed=function(){return typeof window<"u"},Td=function(){return ve||Ed()&&(ve=window.gsap)&&ve.registerPlugin&&ve},Fr=function(e){return!!~Yc.indexOf(e)},bd=function(e){return(e==="Height"?$c:Qe["inner"+e])||Cn["client"+e]||at["client"+e]},Ad=function(e){return Zi(e,"getBoundingClientRect")||(Fr(e)?function(){return ya.width=Qe.innerWidth,ya.height=$c,ya}:function(){return Ei(e)})},Zm=function(e,t,n){var i=n.d,s=n.d2,o=n.a;return(o=Zi(e,"getBoundingClientRect"))?function(){return o()[i]}:function(){return(t?bd(s):e["client"+s])||0}},jm=function(e,t){return!t||~hi.indexOf(e)?Ad(e):function(){return ya}},li=function(e,t){var n=t.s,i=t.d2,s=t.d,o=t.a;return Math.max(0,(n="scroll"+i)&&(o=Zi(e,n))?o()-Ad(e)()[s]:Fr(e)?(Cn[n]||at[n])-bd(i):e[n]-e["offset"+i])},No=function(e,t){for(var n=0;n<us.length;n+=3)(!t||~t.indexOf(us[n+1]))&&e(us[n],us[n+1],us[n+2])},wn=function(e){return typeof e=="string"},rn=function(e){return typeof e=="function"},Js=function(e){return typeof e=="number"},Sr=function(e){return typeof e=="object"},Hs=function(e,t,n){return e&&e.progress(t?0:1)&&n&&e.pause()},Gr=function(e,t,n){if(e.enabled){var i=e._ctx?e._ctx.add(function(){return t(e,n)}):t(e,n);i&&i.totalTime&&(e.callbackAnimation=i)}},Wr=Math.abs,wd="left",Rd="top",Kc="right",Zc="bottom",Ur="width",Ir="height",lo="Right",co="Left",uo="Top",ho="Bottom",Nt="padding",Hn="margin",Ps="Width",jc="Height",Bt="px",Vn=function(e){return Qe.getComputedStyle(e.nodeType===Node.DOCUMENT_NODE?e.scrollingElement:e)},Jm=function(e){var t=Vn(e).position;e.style.position=t==="absolute"||t==="fixed"?t:"relative"},Nu=function(e,t){for(var n in t)n in e||(e[n]=t[n]);return e},Ei=function(e,t){var n=t&&Vn(e)[dc]!=="matrix(1, 0, 0, 1, 0, 0)"&&ve.to(e,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationX:0,rotationY:0,scale:1,skewX:0,skewY:0}).progress(1),i=e.getBoundingClientRect?e.getBoundingClientRect():e.scrollingElement.getBoundingClientRect();return n&&n.progress(0).kill(),i},Ua=function(e,t){var n=t.d2;return e["offset"+n]||e["client"+n]||0},Cd=function(e){var t=[],n=e.labels,i=e.duration(),s;for(s in n)t.push(n[s]/i);return t},Qm=function(e){return function(t){return ve.utils.snap(Cd(e),t)}},Jc=function(e){var t=ve.utils.snap(e),n=Array.isArray(e)&&e.slice(0).sort(function(i,s){return i-s});return n?function(i,s,o){o===void 0&&(o=.001);var a;if(!s)return t(i);if(s>0){for(i-=o,a=0;a<n.length;a++)if(n[a]>=i)return n[a];return n[a-1]}else for(a=n.length,i+=o;a--;)if(n[a]<=i)return n[a];return n[0]}:function(i,s,o){o===void 0&&(o=.001);var a=t(i);return!s||Math.abs(a-i)<o||a-i<0==s<0?a:t(s<0?i-e:i+e)}},e_=function(e){return function(t,n){return Jc(Cd(e))(t,n.direction)}},Oo=function(e,t,n,i){return n.split(",").forEach(function(s){return e(t,s,i)})},qt=function(e,t,n,i,s){return e.addEventListener(t,n,{passive:!i,capture:!!s})},Yt=function(e,t,n,i){return e.removeEventListener(t,n,!!i)},Fo=function(e,t,n){n=n&&n.wheelHandler,n&&(e(t,"wheel",n),e(t,"touchmove",n))},Ou={startColor:"green",endColor:"red",indent:0,fontSize:"16px",fontWeight:"normal"},Bo={toggleActions:"play",anticipatePin:0},Ia={top:0,left:0,center:.5,bottom:1,right:1},va=function(e,t){if(wn(e)){var n=e.indexOf("="),i=~n?+(e.charAt(n-1)+1)*parseFloat(e.substr(n+1)):0;~n&&(e.indexOf("%")>n&&(i*=t/100),e=e.substr(0,n-1)),e=i+(e in Ia?Ia[e]*t:~e.indexOf("%")?parseFloat(e)*t/100:parseFloat(e)||0)}return e},zo=function(e,t,n,i,s,o,a,l){var c=s.startColor,u=s.endColor,d=s.fontSize,h=s.indent,f=s.fontWeight,g=ut.createElement("div"),_=Fr(n)||Zi(n,"pinType")==="fixed",p=e.indexOf("scroller")!==-1,m=_?at:n.tagName==="IFRAME"?n.contentDocument.body:n,E=e.indexOf("start")!==-1,x=E?c:u,M="border-color:"+x+";font-size:"+d+";color:"+x+";font-weight:"+f+";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";return M+="position:"+((p||l)&&_?"fixed;":"absolute;"),(p||l||!_)&&(M+=(i===zt?Kc:Zc)+":"+(o+parseFloat(h))+"px;"),a&&(M+="box-sizing:border-box;text-align:left;width:"+a.offsetWidth+"px;"),g._isStart=E,g.setAttribute("class","gsap-marker-"+e+(t?" marker-"+t:"")),g.style.cssText=M,g.innerText=t||t===0?e+"-"+t:e,m.children[0]?m.insertBefore(g,m.children[0]):m.appendChild(g),g._offset=g["offset"+i.op.d2],xa(g,0,i,E),g},xa=function(e,t,n,i){var s={display:"block"},o=n[i?"os2":"p2"],a=n[i?"p2":"os2"];e._isFlipped=i,s[n.a+"Percent"]=i?-100:0,s[n.a]=i?"1px":0,s["border"+o+Ps]=1,s["border"+a+Ps]=0,s[n.p]=t+"px",ve.set(e,s)},Je=[],gc={},Eo,Fu=function(){return tn()-Yn>34&&(Eo||(Eo=requestAnimationFrame(Ai)))},Xr=function(){(!cn||!cn.isPressed||cn.startX>at.clientWidth)&&(et.cache++,cn?Eo||(Eo=requestAnimationFrame(Ai)):Ai(),Yn||zr("scrollStart"),Yn=tn())},fl=function(){yd=Qe.innerWidth,Md=Qe.innerHeight},Qs=function(e){et.cache++,(e===!0||!en&&!Sd&&!ut.fullscreenElement&&!ut.webkitFullscreenElement&&(!pc||yd!==Qe.innerWidth||Math.abs(Qe.innerHeight-Md)>Qe.innerHeight*.25))&&Da.restart(!0)},Br={},t_=[],Pd=function r(){return Yt(Ge,"scrollEnd",r)||Ar(!0)},zr=function(e){return Br[e]&&Br[e].map(function(t){return t()})||t_},An=[],Ld=function(e){for(var t=0;t<An.length;t+=5)(!e||An[t+4]&&An[t+4].query===e)&&(An[t].style.cssText=An[t+1],An[t].getBBox&&An[t].setAttribute("transform",An[t+2]||""),An[t+3].uncache=1)},Dd=function(){return et.forEach(function(e){return rn(e)&&++e.cacheID&&(e.rec=e())})},Qc=function(e,t){var n;for(un=0;un<Je.length;un++)n=Je[un],n&&(!t||n._ctx===t)&&(e?n.kill(1):n.revert(!0,!0));ao=!0,t&&Ld(t),t||zr("revert")},Ud=function(e,t){et.cache++,(t||!hn)&&et.forEach(function(n){return rn(n)&&n.cacheID++&&(n.rec=0)}),wn(e)&&(Qe.history.scrollRestoration=qc=e)},hn,Nr=0,Bu,n_=function(){if(Bu!==Nr){var e=Bu=Nr;requestAnimationFrame(function(){return e===Nr&&Ar(!0)})}},Id=function(){at.appendChild(Ss),$c=!cn&&Ss.offsetHeight||Qe.innerHeight,at.removeChild(Ss)},zu=function(e){return yo(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(t){return t.style.display=e?"none":"block"})},Ar=function(e,t){if(Cn=ut.documentElement,at=ut.body,Yc=[Qe,ut,Cn,at],Yn&&!e&&!ao){qt(Ge,"scrollEnd",Pd);return}Id(),hn=Ge.isRefreshing=!0,ao||Dd();var n=zr("refreshInit");xd&&Ge.sort(),t||Qc(),et.forEach(function(i){rn(i)&&(i.smooth&&(i.target.style.scrollBehavior="auto"),i(0))}),Je.slice(0).forEach(function(i){return i.refresh()}),ao=!1,Je.forEach(function(i){if(i._subPinOffset&&i.pin){var s=i.vars.horizontal?"offsetWidth":"offsetHeight",o=i.pin[s];i.revert(!0,1),i.adjustPinSpacing(i.pin[s]-o),i.refresh()}}),_c=1,zu(!0),Je.forEach(function(i){var s=li(i.scroller,i._dir),o=i.vars.end==="max"||i._endClamp&&i.end>s,a=i._startClamp&&i.start>=s;(o||a)&&i.setPositions(a?s-1:i.start,o?Math.max(a?s:i.start+1,s):i.end,!0)}),zu(!1),_c=0,n.forEach(function(i){return i&&i.render&&i.render(-1)}),et.forEach(function(i){rn(i)&&(i.smooth&&requestAnimationFrame(function(){return i.target.style.scrollBehavior="smooth"}),i.rec&&i(i.rec))}),Ud(qc,1),Da.pause(),Nr++,hn=2,Ai(2),Je.forEach(function(i){return rn(i.vars.onRefresh)&&i.vars.onRefresh(i)}),hn=Ge.isRefreshing=!1,zr("refresh")},vc=0,Sa=1,fo,Ai=function(e){if(e===2||!hn&&!ao){Ge.isUpdating=!0,fo&&fo.update(0);var t=Je.length,n=tn(),i=n-hl>=50,s=t&&Je[0].scroll();if(Sa=vc>s?-1:1,hn||(vc=s),i&&(Yn&&!Xa&&n-Yn>200&&(Yn=0,zr("scrollEnd")),Ks=hl,hl=n),Sa<0){for(un=t;un-- >0;)Je[un]&&Je[un].update(0,i);Sa=1}else for(un=0;un<t;un++)Je[un]&&Je[un].update(0,i);Ge.isUpdating=!1}Eo=0},xc=[wd,Rd,Zc,Kc,Hn+ho,Hn+lo,Hn+uo,Hn+co,"display","flexShrink","float","zIndex","gridColumnStart","gridColumnEnd","gridRowStart","gridRowEnd","gridArea","justifySelf","alignSelf","placeSelf","order"],Ma=xc.concat([Ur,Ir,"boxSizing","max"+Ps,"max"+jc,"position",Hn,Nt,Nt+uo,Nt+lo,Nt+ho,Nt+co]),i_=function(e,t,n){Ms(n);var i=e._gsap;if(i.spacerIsNative)Ms(i.spacerState);else if(e._gsap.swappedIn){var s=t.parentNode;s&&(s.insertBefore(e,t),s.removeChild(t))}e._gsap.swappedIn=!1},dl=function(e,t,n,i){if(!e._gsap.swappedIn){for(var s=xc.length,o=t.style,a=e.style,l;s--;)l=xc[s],o[l]=n[l];o.position=n.position==="absolute"?"absolute":"relative",n.display==="inline"&&(o.display="inline-block"),a[Zc]=a[Kc]="auto",o.flexBasis=n.flexBasis||"auto",o.overflow="visible",o.boxSizing="border-box",o[Ur]=Ua(e,fn)+Bt,o[Ir]=Ua(e,zt)+Bt,o[Nt]=a[Hn]=a[Rd]=a[wd]="0",Ms(i),a[Ur]=a["max"+Ps]=n[Ur],a[Ir]=a["max"+jc]=n[Ir],a[Nt]=n[Nt],e.parentNode!==t&&(e.parentNode.insertBefore(t,e),t.appendChild(e)),e._gsap.swappedIn=!0}},r_=/([A-Z])/g,Ms=function(e){if(e){var t=e.t.style,n=e.length,i=0,s,o;for((e.t._gsap||ve.core.getCache(e.t)).uncache=1;i<n;i+=2)o=e[i+1],s=e[i],o?t[s]=o:t[s]&&t.removeProperty(s.replace(r_,"-$1").toLowerCase())}},ko=function(e){for(var t=Ma.length,n=e.style,i=[],s=0;s<t;s++)i.push(Ma[s],n[Ma[s]]);return i.t=e,i},s_=function(e,t,n){for(var i=[],s=e.length,o=n?8:0,a;o<s;o+=2)a=e[o],i.push(a,a in t?t[a]:e[o+1]);return i.t=e.t,i},ya={left:0,top:0},ku=function(e,t,n,i,s,o,a,l,c,u,d,h,f,g){rn(e)&&(e=e(l)),wn(e)&&e.substr(0,3)==="max"&&(e=h+(e.charAt(4)==="="?va("0"+e.substr(3),n):0));var _=f?f.time():0,p,m,E;if(f&&f.seek(0),isNaN(e)||(e=+e),Js(e))f&&(e=ve.utils.mapRange(f.scrollTrigger.start,f.scrollTrigger.end,0,h,e)),a&&xa(a,n,i,!0);else{rn(t)&&(t=t(l));var x=(e||"0").split(" "),M,w,A,T;E=pn(t,l)||at,M=Ei(E)||{},(!M||!M.left&&!M.top)&&Vn(E).display==="none"&&(T=E.style.display,E.style.display="block",M=Ei(E),T?E.style.display=T:E.style.removeProperty("display")),w=va(x[0],M[i.d]),A=va(x[1]||"0",n),e=M[i.p]-c[i.p]-u+w+s-A,a&&xa(a,A,i,n-A<20||a._isStart&&A>20),n-=n-A}if(g&&(l[g]=e||-.001,e<0&&(e=0)),o){var C=e+n,S=o._isStart;p="scroll"+i.d2,xa(o,C,i,S&&C>20||!S&&(d?Math.max(at[p],Cn[p]):o.parentNode[p])<=C+1),d&&(c=Ei(a),d&&(o.style[i.op.p]=c[i.op.p]-i.op.m-o._offset+Bt))}return f&&E&&(p=Ei(E),f.seek(h),m=Ei(E),f._caScrollDist=p[i.p]-m[i.p],e=e/f._caScrollDist*h),f&&f.seek(_),f?e:Math.round(e)},o_=/(webkit|moz|length|cssText|inset)/i,Hu=function(e,t,n,i){if(e.parentNode!==t){var s=e.style,o,a;if(t===at){e._stOrig=s.cssText,a=Vn(e);for(o in a)!+o&&!o_.test(o)&&a[o]&&typeof s[o]=="string"&&o!=="0"&&(s[o]=a[o]);s.top=n,s.left=i}else s.cssText=e._stOrig;ve.core.getCache(e).uncache=1,t.appendChild(e)}},Nd=function(e,t,n){var i=t,s=i;return function(o){var a=Math.round(e());return a!==i&&a!==s&&Math.abs(a-i)>3&&Math.abs(a-s)>3&&(o=a,n&&n()),s=i,i=Math.round(o),i}},Ho=function(e,t,n){var i={};i[t.p]="+="+n,ve.set(e,i)},Vu=function(e,t){var n=nr(e,t),i="_scroll"+t.p2,s=function o(a,l,c,u,d){var h=o.tween,f=l.onComplete,g={};c=c||n();var _=Nd(n,c,function(){h.kill(),o.tween=0});return d=u&&d||0,u=u||a-c,h&&h.kill(),l[i]=a,l.inherit=!1,l.modifiers=g,g[i]=function(){return _(c+u*h.ratio+d*h.ratio*h.ratio)},l.onUpdate=function(){et.cache++,o.tween&&Ai()},l.onComplete=function(){o.tween=0,f&&f.call(h)},h=o.tween=ve.to(e,l),h};return e[i]=n,n.wheelHandler=function(){return s.tween&&s.tween.kill()&&(s.tween=0)},qt(e,"wheel",n.wheelHandler),Ge.isTouch&&qt(e,"touchmove",n.wheelHandler),s},Ge=function(){function r(t,n){cs||r.register(ve)||console.warn("Please gsap.registerPlugin(ScrollTrigger)"),mc(this),this.init(t,n)}var e=r.prototype;return e.init=function(n,i){if(this.progress=this.start=0,this.vars&&this.kill(!0,!0),!Zs){this.update=this.refresh=this.kill=ti;return}n=Nu(wn(n)||Js(n)||n.nodeType?{trigger:n}:n,Bo);var s=n,o=s.onUpdate,a=s.toggleClass,l=s.id,c=s.onToggle,u=s.onRefresh,d=s.scrub,h=s.trigger,f=s.pin,g=s.pinSpacing,_=s.invalidateOnRefresh,p=s.anticipatePin,m=s.onScrubComplete,E=s.onSnapComplete,x=s.once,M=s.snap,w=s.pinReparent,A=s.pinSpacer,T=s.containerAnimation,C=s.fastScrollEnd,S=s.preventOverlaps,v=n.horizontal||n.containerAnimation&&n.horizontal!==!1?fn:zt,L=!d&&d!==0,N=pn(n.scroller||Qe),B=ve.core.getCache(N),W=Fr(N),Y=("pinType"in n?n.pinType:Zi(N,"pinType")||W&&"fixed")==="fixed",G=[n.onEnter,n.onLeave,n.onEnterBack,n.onLeaveBack],V=L&&n.toggleActions.split(" "),H="markers"in n?n.markers:Bo.markers,ae=W?0:parseFloat(Vn(N)["border"+v.p2+Ps])||0,P=this,ue=n.onRefreshInit&&function(){return n.onRefreshInit(P)},Ne=Zm(N,W,v),Ye=jm(N,W),$=0,ee=0,fe=0,oe=nr(N,v),De,Ce,We,D,Oe,_e,Ve,Se,ze,F,Le,st,R,y,X,J,te,j,Te,ie,ce,Ie,re,ye,we,Fe,he,ke,Xe,ot,U,Q,K,Z,se,Re,Ze,dt,pt;if(P._startClamp=P._endClamp=!1,P._dir=v,p*=45,P.scroller=N,P.scroll=T?T.time.bind(T):oe,D=oe(),P.vars=n,i=i||n.animation,"refreshPriority"in n&&(xd=1,n.refreshPriority===-9999&&(fo=P)),B.tweenScroll=B.tweenScroll||{top:Vu(N,zt),left:Vu(N,fn)},P.tweenTo=De=B.tweenScroll[v.p],P.scrubDuration=function(de){K=Js(de)&&de,K?Q?Q.duration(de):Q=ve.to(i,{ease:"expo",totalProgress:"+=0",inherit:!1,duration:K,paused:!0,onComplete:function(){return m&&m(P)}}):(Q&&Q.progress(1).kill(),Q=0)},i&&(i.vars.lazy=!1,i._initted&&!P.isReverted||i.vars.immediateRender!==!1&&n.immediateRender!==!1&&i.duration()&&i.render(0,!0,!0),P.animation=i.pause(),i.scrollTrigger=P,P.scrubDuration(d),ot=0,l||(l=i.vars.id)),M&&((!Sr(M)||M.push)&&(M={snapTo:M}),"scrollBehavior"in at.style&&ve.set(W?[at,Cn]:N,{scrollBehavior:"auto"}),et.forEach(function(de){return rn(de)&&de.target===(W?ut.scrollingElement||Cn:N)&&(de.smooth=!1)}),We=rn(M.snapTo)?M.snapTo:M.snapTo==="labels"?Qm(i):M.snapTo==="labelsDirectional"?e_(i):M.directional!==!1?function(de,He){return Jc(M.snapTo)(de,tn()-ee<500?0:He.direction)}:ve.utils.snap(M.snapTo),Z=M.duration||{min:.1,max:2},Z=Sr(Z)?oo(Z.min,Z.max):oo(Z,Z),se=ve.delayedCall(M.delay||K/2||.1,function(){var de=oe(),He=tn()-ee<500,Pe=De.tween;if((He||Math.abs(P.getVelocity())<10)&&!Pe&&!Xa&&$!==de){var Be=(de-_e)/y,Lt=i&&!L?i.totalProgress():Be,qe=He?0:(Lt-U)/(tn()-Ks)*1e3||0,yt=ve.utils.clamp(-Be,1-Be,Wr(qe/2)*qe/.185),Ft=Be+(M.inertia===!1?0:yt),Et,xt,ct=M,b=ct.onStart,I=ct.onInterrupt,z=ct.onComplete;if(Et=We(Ft,P),Js(Et)||(Et=Ft),xt=Math.max(0,Math.round(_e+Et*y)),de<=Ve&&de>=_e&&xt!==de){if(Pe&&!Pe._initted&&Pe.data<=Wr(xt-de))return;M.inertia===!1&&(yt=Et-Be),De(xt,{duration:Z(Wr(Math.max(Wr(Ft-Lt),Wr(Et-Lt))*.185/qe/.05||0)),ease:M.ease||"power3",data:Wr(xt-de),onInterrupt:function(){return se.restart(!0)&&I&&Gr(P,I)},onComplete:function(){P.update(),$=oe(),i&&!L&&(Q?Q.resetTo("totalProgress",Et,i._tTime/i._tDur):i.progress(Et)),ot=U=i&&!L?i.totalProgress():P.progress,E&&E(P),z&&Gr(P,z)}},de,yt*y,xt-de-yt*y),b&&Gr(P,b,De.tween)}}else P.isActive&&$!==de&&se.restart(!0)}).pause()),l&&(gc[l]=P),h=P.trigger=pn(h||f!==!0&&f),pt=h&&h._gsap&&h._gsap.stRevert,pt&&(pt=pt(P)),f=f===!0?h:pn(f),wn(a)&&(a={targets:h,className:a}),f&&(g===!1||g===Hn||(g=!g&&f.parentNode&&f.parentNode.style&&Vn(f.parentNode).display==="flex"?!1:Nt),P.pin=f,Ce=ve.core.getCache(f),Ce.spacer?X=Ce.pinState:(A&&(A=pn(A),A&&!A.nodeType&&(A=A.current||A.nativeElement),Ce.spacerIsNative=!!A,A&&(Ce.spacerState=ko(A))),Ce.spacer=j=A||ut.createElement("div"),j.classList.add("pin-spacer"),l&&j.classList.add("pin-spacer-"+l),Ce.pinState=X=ko(f)),n.force3D!==!1&&ve.set(f,{force3D:!0}),P.spacer=j=Ce.spacer,Xe=Vn(f),ye=Xe[g+v.os2],ie=ve.getProperty(f),ce=ve.quickSetter(f,v.a,Bt),dl(f,j,Xe),te=ko(f)),H){st=Sr(H)?Nu(H,Ou):Ou,F=zo("scroller-start",l,N,v,st,0),Le=zo("scroller-end",l,N,v,st,0,F),Te=F["offset"+v.op.d2];var it=pn(Zi(N,"content")||N);Se=this.markerStart=zo("start",l,it,v,st,Te,0,T),ze=this.markerEnd=zo("end",l,it,v,st,Te,0,T),T&&(dt=ve.quickSetter([Se,ze],v.a,Bt)),!Y&&!(hi.length&&Zi(N,"fixedMarkers")===!0)&&(Jm(W?at:N),ve.set([F,Le],{force3D:!0}),Fe=ve.quickSetter(F,v.a,Bt),ke=ve.quickSetter(Le,v.a,Bt))}if(T){var Ue=T.vars.onUpdate,be=T.vars.onUpdateParams;T.eventCallback("onUpdate",function(){P.update(0,0,1),Ue&&Ue.apply(T,be||[])})}if(P.previous=function(){return Je[Je.indexOf(P)-1]},P.next=function(){return Je[Je.indexOf(P)+1]},P.revert=function(de,He){if(!He)return P.kill(!0);var Pe=de!==!1||!P.enabled,Be=en;Pe!==P.isReverted&&(Pe&&(Re=Math.max(oe(),P.scroll.rec||0),fe=P.progress,Ze=i&&i.progress()),Se&&[Se,ze,F,Le].forEach(function(Lt){return Lt.style.display=Pe?"none":"block"}),Pe&&(en=P,P.update(Pe)),f&&(!w||!P.isActive)&&(Pe?i_(f,j,X):dl(f,j,Vn(f),we)),Pe||P.update(Pe),en=Be,P.isReverted=Pe)},P.refresh=function(de,He,Pe,Be){if(!((en||!P.enabled)&&!He)){if(f&&de&&Yn){qt(r,"scrollEnd",Pd);return}!hn&&ue&&ue(P),en=P,De.tween&&!Pe&&(De.tween.kill(),De.tween=0),Q&&Q.pause(),_&&i&&(i.revert({kill:!1}).invalidate(),i.getChildren?i.getChildren(!0,!0,!1).forEach(function(bt){return bt.vars.immediateRender&&bt.render(0,!0,!0)}):i.vars.immediateRender&&i.render(0,!0,!0)),P.isReverted||P.revert(!0,!0),P._subPinOffset=!1;var Lt=Ne(),qe=Ye(),yt=T?T.duration():li(N,v),Ft=y<=.01||!y,Et=0,xt=Be||0,ct=Sr(Pe)?Pe.end:n.end,b=n.endTrigger||h,I=Sr(Pe)?Pe.start:n.start||(n.start===0||!h?0:f?"0 0":"0 100%"),z=P.pinnedContainer=n.pinnedContainer&&pn(n.pinnedContainer,P),k=h&&Math.max(0,Je.indexOf(P))||0,O=k,ne,le,me,Me,xe,ge,Ee,rt,St,mt,Tt,tt,Ae;for(H&&Sr(Pe)&&(tt=ve.getProperty(F,v.p),Ae=ve.getProperty(Le,v.p));O-- >0;)ge=Je[O],ge.end||ge.refresh(0,1)||(en=P),Ee=ge.pin,Ee&&(Ee===h||Ee===f||Ee===z)&&!ge.isReverted&&(mt||(mt=[]),mt.unshift(ge),ge.revert(!0,!0)),ge!==Je[O]&&(k--,O--);for(rn(I)&&(I=I(P)),I=Lu(I,"start",P),_e=ku(I,h,Lt,v,oe(),Se,F,P,qe,ae,Y,yt,T,P._startClamp&&"_startClamp")||(f?-.001:0),rn(ct)&&(ct=ct(P)),wn(ct)&&!ct.indexOf("+=")&&(~ct.indexOf(" ")?ct=(wn(I)?I.split(" ")[0]:"")+ct:(Et=va(ct.substr(2),Lt),ct=wn(I)?I:(T?ve.utils.mapRange(0,T.duration(),T.scrollTrigger.start,T.scrollTrigger.end,_e):_e)+Et,b=h)),ct=Lu(ct,"end",P),Ve=Math.max(_e,ku(ct||(b?"100% 0":yt),b,Lt,v,oe()+Et,ze,Le,P,qe,ae,Y,yt,T,P._endClamp&&"_endClamp"))||-.001,Et=0,O=k;O--;)ge=Je[O]||{},Ee=ge.pin,Ee&&ge.start-ge._pinPush<=_e&&!T&&ge.end>0&&(ne=ge.end-(P._startClamp?Math.max(0,ge.start):ge.start),(Ee===h&&ge.start-ge._pinPush<_e||Ee===z)&&isNaN(I)&&(Et+=ne*(1-ge.progress)),Ee===f&&(xt+=ne));if(_e+=Et,Ve+=Et,P._startClamp&&(P._startClamp+=Et),P._endClamp&&!hn&&(P._endClamp=Ve||-.001,Ve=Math.min(Ve,li(N,v))),y=Ve-_e||(_e-=.01)&&.001,Ft&&(fe=ve.utils.clamp(0,1,ve.utils.normalize(_e,Ve,Re))),P._pinPush=xt,Se&&Et&&(ne={},ne[v.a]="+="+Et,z&&(ne[v.p]="-="+oe()),ve.set([Se,ze],ne)),f&&!(_c&&P.end>=li(N,v)))ne=Vn(f),Me=v===zt,me=oe(),Ie=parseFloat(ie(v.a))+xt,!yt&&Ve>1&&(Tt=(W?ut.scrollingElement||Cn:N).style,Tt={style:Tt,value:Tt["overflow"+v.a.toUpperCase()]},W&&Vn(at)["overflow"+v.a.toUpperCase()]!=="scroll"&&(Tt.style["overflow"+v.a.toUpperCase()]="scroll")),dl(f,j,ne),te=ko(f),le=Ei(f,!0),rt=Y&&nr(N,Me?fn:zt)(),g?(we=[g+v.os2,y+xt+Bt],we.t=j,O=g===Nt?Ua(f,v)+y+xt:0,O&&(we.push(v.d,O+Bt),j.style.flexBasis!=="auto"&&(j.style.flexBasis=O+Bt)),Ms(we),z&&Je.forEach(function(bt){bt.pin===z&&bt.vars.pinSpacing!==!1&&(bt._subPinOffset=!0)}),Y&&oe(Re)):(O=Ua(f,v),O&&j.style.flexBasis!=="auto"&&(j.style.flexBasis=O+Bt)),Y&&(xe={top:le.top+(Me?me-_e:rt)+Bt,left:le.left+(Me?rt:me-_e)+Bt,boxSizing:"border-box",position:"fixed"},xe[Ur]=xe["max"+Ps]=Math.ceil(le.width)+Bt,xe[Ir]=xe["max"+jc]=Math.ceil(le.height)+Bt,xe[Hn]=xe[Hn+uo]=xe[Hn+lo]=xe[Hn+ho]=xe[Hn+co]="0",xe[Nt]=ne[Nt],xe[Nt+uo]=ne[Nt+uo],xe[Nt+lo]=ne[Nt+lo],xe[Nt+ho]=ne[Nt+ho],xe[Nt+co]=ne[Nt+co],J=s_(X,xe,w),hn&&oe(0)),i?(St=i._initted,cl(1),i.render(i.duration(),!0,!0),re=ie(v.a)-Ie+y+xt,he=Math.abs(y-re)>1,Y&&he&&J.splice(J.length-2,2),i.render(0,!0,!0),St||i.invalidate(!0),i.parent||i.totalTime(i.totalTime()),cl(0)):re=y,Tt&&(Tt.value?Tt.style["overflow"+v.a.toUpperCase()]=Tt.value:Tt.style.removeProperty("overflow-"+v.a));else if(h&&oe()&&!T)for(le=h.parentNode;le&&le!==at;)le._pinOffset&&(_e-=le._pinOffset,Ve-=le._pinOffset),le=le.parentNode;mt&&mt.forEach(function(bt){return bt.revert(!1,!0)}),P.start=_e,P.end=Ve,D=Oe=hn?Re:oe(),!T&&!hn&&(D<Re&&oe(Re),P.scroll.rec=0),P.revert(!1,!0),ee=tn(),se&&($=-1,se.restart(!0)),en=0,i&&L&&(i._initted||Ze)&&i.progress()!==Ze&&i.progress(Ze||0,!0).render(i.time(),!0,!0),(Ft||fe!==P.progress||T||_||i&&!i._initted)&&(i&&!L&&(i._initted||fe||i.vars.immediateRender!==!1)&&i.totalProgress(T&&_e<-.001&&!fe?ve.utils.normalize(_e,Ve,0):fe,!0),P.progress=Ft||(D-_e)/y===fe?0:fe),f&&g&&(j._pinOffset=Math.round(P.progress*re)),Q&&Q.invalidate(),isNaN(tt)||(tt-=ve.getProperty(F,v.p),Ae-=ve.getProperty(Le,v.p),Ho(F,v,tt),Ho(Se,v,tt-(Be||0)),Ho(Le,v,Ae),Ho(ze,v,Ae-(Be||0))),Ft&&!hn&&P.update(),u&&!hn&&!R&&(R=!0,u(P),R=!1)}},P.getVelocity=function(){return(oe()-Oe)/(tn()-Ks)*1e3||0},P.endAnimation=function(){Hs(P.callbackAnimation),i&&(Q?Q.progress(1):i.paused()?L||Hs(i,P.direction<0,1):Hs(i,i.reversed()))},P.labelToScroll=function(de){return i&&i.labels&&(_e||P.refresh()||_e)+i.labels[de]/i.duration()*y||0},P.getTrailing=function(de){var He=Je.indexOf(P),Pe=P.direction>0?Je.slice(0,He).reverse():Je.slice(He+1);return(wn(de)?Pe.filter(function(Be){return Be.vars.preventOverlaps===de}):Pe).filter(function(Be){return P.direction>0?Be.end<=_e:Be.start>=Ve})},P.update=function(de,He,Pe){if(!(T&&!Pe&&!de)){var Be=hn===!0?Re:P.scroll(),Lt=de?0:(Be-_e)/y,qe=Lt<0?0:Lt>1?1:Lt||0,yt=P.progress,Ft,Et,xt,ct,b,I,z,k;if(He&&(Oe=D,D=T?oe():Be,M&&(U=ot,ot=i&&!L?i.totalProgress():qe)),p&&f&&!en&&!Io&&Yn&&(!qe&&_e<Be+(Be-Oe)/(tn()-Ks)*p?qe=1e-4:qe===1&&Ve>Be+(Be-Oe)/(tn()-Ks)*p&&(qe=.9999)),qe!==yt&&P.enabled){if(Ft=P.isActive=!!qe&&qe<1,Et=!!yt&&yt<1,I=Ft!==Et,b=I||!!qe!=!!yt,P.direction=qe>yt?1:-1,P.progress=qe,b&&!en&&(xt=qe&&!yt?0:qe===1?1:yt===1?2:3,L&&(ct=!I&&V[xt+1]!=="none"&&V[xt+1]||V[xt],k=i&&(ct==="complete"||ct==="reset"||ct in i))),S&&(I||k)&&(k||d||!i)&&(rn(S)?S(P):P.getTrailing(S).forEach(function(me){return me.endAnimation()})),L||(Q&&!en&&!Io?(Q._dp._time-Q._start!==Q._time&&Q.render(Q._dp._time-Q._start),Q.resetTo?Q.resetTo("totalProgress",qe,i._tTime/i._tDur):(Q.vars.totalProgress=qe,Q.invalidate().restart())):i&&i.totalProgress(qe,!!(en&&(ee||de)))),f){if(de&&g&&(j.style[g+v.os2]=ye),!Y)ce(js(Ie+re*qe));else if(b){if(z=!de&&qe>yt&&Ve+1>Be&&Be+1>=li(N,v),w)if(!de&&(Ft||z)){var O=Ei(f,!0),ne=Be-_e;Hu(f,at,O.top+(v===zt?ne:0)+Bt,O.left+(v===zt?0:ne)+Bt)}else Hu(f,j);Ms(Ft||z?J:te),he&&qe<1&&Ft||ce(Ie+(qe===1&&!z?re:0))}}M&&!De.tween&&!en&&!Io&&se.restart(!0),a&&(I||x&&qe&&(qe<1||!ul))&&yo(a.targets).forEach(function(me){return me.classList[Ft||x?"add":"remove"](a.className)}),o&&!L&&!de&&o(P),b&&!en?(L&&(k&&(ct==="complete"?i.pause().totalProgress(1):ct==="reset"?i.restart(!0).pause():ct==="restart"?i.restart(!0):i[ct]()),o&&o(P)),(I||!ul)&&(c&&I&&Gr(P,c),G[xt]&&Gr(P,G[xt]),x&&(qe===1?P.kill(!1,1):G[xt]=0),I||(xt=qe===1?1:3,G[xt]&&Gr(P,G[xt]))),C&&!Ft&&Math.abs(P.getVelocity())>(Js(C)?C:2500)&&(Hs(P.callbackAnimation),Q?Q.progress(1):Hs(i,ct==="reverse"?1:!qe,1))):L&&o&&!en&&o(P)}if(ke){var le=T?Be/T.duration()*(T._caScrollDist||0):Be;Fe(le+(F._isFlipped?1:0)),ke(le)}dt&&dt(-Be/T.duration()*(T._caScrollDist||0))}},P.enable=function(de,He){P.enabled||(P.enabled=!0,qt(N,"resize",Qs),W||qt(N,"scroll",Xr),ue&&qt(r,"refreshInit",ue),de!==!1&&(P.progress=fe=0,D=Oe=$=oe()),He!==!1&&P.refresh())},P.getTween=function(de){return de&&De?De.tween:Q},P.setPositions=function(de,He,Pe,Be){if(T){var Lt=T.scrollTrigger,qe=T.duration(),yt=Lt.end-Lt.start;de=Lt.start+yt*de/qe,He=Lt.start+yt*He/qe}P.refresh(!1,!1,{start:Du(de,Pe&&!!P._startClamp),end:Du(He,Pe&&!!P._endClamp)},Be),P.update()},P.adjustPinSpacing=function(de){if(we&&de){var He=we.indexOf(v.d)+1;we[He]=parseFloat(we[He])+de+Bt,we[1]=parseFloat(we[1])+de+Bt,Ms(we)}},P.disable=function(de,He){if(de!==!1&&P.revert(!0,!0),P.enabled&&(P.enabled=P.isActive=!1,He||Q&&Q.pause(),Re=0,Ce&&(Ce.uncache=1),ue&&Yt(r,"refreshInit",ue),se&&(se.pause(),De.tween&&De.tween.kill()&&(De.tween=0)),!W)){for(var Pe=Je.length;Pe--;)if(Je[Pe].scroller===N&&Je[Pe]!==P)return;Yt(N,"resize",Qs),W||Yt(N,"scroll",Xr)}},P.kill=function(de,He){P.disable(de,He),Q&&!He&&Q.kill(),l&&delete gc[l];var Pe=Je.indexOf(P);Pe>=0&&Je.splice(Pe,1),Pe===un&&Sa>0&&un--,Pe=0,Je.forEach(function(Be){return Be.scroller===P.scroller&&(Pe=1)}),Pe||hn||(P.scroll.rec=0),i&&(i.scrollTrigger=null,de&&i.revert({kill:!1}),He||i.kill()),Se&&[Se,ze,F,Le].forEach(function(Be){return Be.parentNode&&Be.parentNode.removeChild(Be)}),fo===P&&(fo=0),f&&(Ce&&(Ce.uncache=1),Pe=0,Je.forEach(function(Be){return Be.pin===f&&Pe++}),Pe||(Ce.spacer=0)),n.onKill&&n.onKill(P)},Je.push(P),P.enable(!1,!1),pt&&pt(P),i&&i.add&&!y){var je=P.update;P.update=function(){P.update=je,et.cache++,_e||Ve||P.refresh()},ve.delayedCall(.01,P.update),y=.01,_e=Ve=0}else P.refresh();f&&n_()},r.register=function(n){return cs||(ve=n||Td(),Ed()&&window.document&&r.enable(),cs=Zs),cs},r.defaults=function(n){if(n)for(var i in n)Bo[i]=n[i];return Bo},r.disable=function(n,i){Zs=0,Je.forEach(function(o){return o[i?"kill":"disable"](n)}),Yt(Qe,"wheel",Xr),Yt(ut,"scroll",Xr),clearInterval(Uo),Yt(ut,"touchcancel",ti),Yt(at,"touchstart",ti),Oo(Yt,ut,"pointerdown,touchstart,mousedown",Uu),Oo(Yt,ut,"pointerup,touchend,mouseup",Iu),Da.kill(),No(Yt);for(var s=0;s<et.length;s+=3)Fo(Yt,et[s],et[s+1]),Fo(Yt,et[s],et[s+2])},r.enable=function(){if(Qe=window,ut=document,Cn=ut.documentElement,at=ut.body,ve){if(yo=ve.utils.toArray,oo=ve.utils.clamp,mc=ve.core.context||ti,cl=ve.core.suppressOverwrites||ti,qc=Qe.history.scrollRestoration||"auto",vc=Qe.pageYOffset||0,ve.core.globals("ScrollTrigger",r),at){Zs=1,Ss=document.createElement("div"),Ss.style.height="100vh",Ss.style.position="absolute",Id(),Km(),Ut.register(ve),r.isTouch=Ut.isTouch,zi=Ut.isTouch&&/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),pc=Ut.isTouch===1,qt(Qe,"wheel",Xr),Yc=[Qe,ut,Cn,at],ve.matchMedia?(r.matchMedia=function(u){var d=ve.matchMedia(),h;for(h in u)d.add(h,u[h]);return d},ve.addEventListener("matchMediaInit",function(){Dd(),Qc()}),ve.addEventListener("matchMediaRevert",function(){return Ld()}),ve.addEventListener("matchMedia",function(){Ar(0,1),zr("matchMedia")}),ve.matchMedia().add("(orientation: portrait)",function(){return fl(),fl})):console.warn("Requires GSAP 3.11.0 or later"),fl(),qt(ut,"scroll",Xr);var n=at.hasAttribute("style"),i=at.style,s=i.borderTopStyle,o=ve.core.Animation.prototype,a,l;for(o.revert||Object.defineProperty(o,"revert",{value:function(){return this.time(-.01,!0)}}),i.borderTopStyle="solid",a=Ei(at),zt.m=Math.round(a.top+zt.sc())||0,fn.m=Math.round(a.left+fn.sc())||0,s?i.borderTopStyle=s:i.removeProperty("border-top-style"),n||(at.setAttribute("style",""),at.removeAttribute("style")),Uo=setInterval(Fu,250),ve.delayedCall(.5,function(){return Io=0}),qt(ut,"touchcancel",ti),qt(at,"touchstart",ti),Oo(qt,ut,"pointerdown,touchstart,mousedown",Uu),Oo(qt,ut,"pointerup,touchend,mouseup",Iu),dc=ve.utils.checkPrefix("transform"),Ma.push(dc),cs=tn(),Da=ve.delayedCall(.2,Ar).pause(),us=[ut,"visibilitychange",function(){var u=Qe.innerWidth,d=Qe.innerHeight;ut.hidden?(Cu=u,Pu=d):(Cu!==u||Pu!==d)&&Qs()},ut,"DOMContentLoaded",Ar,Qe,"load",Ar,Qe,"resize",Qs],No(qt),Je.forEach(function(u){return u.enable(0,1)}),l=0;l<et.length;l+=3)Fo(Yt,et[l],et[l+1]),Fo(Yt,et[l],et[l+2])}else if(ut){var c=function u(){r.enable(),ut.removeEventListener("DOMContentLoaded",u)};ut.addEventListener("DOMContentLoaded",c)}}},r.config=function(n){"limitCallbacks"in n&&(ul=!!n.limitCallbacks);var i=n.syncInterval;i&&clearInterval(Uo)||(Uo=i)&&setInterval(Fu,i),"ignoreMobileResize"in n&&(pc=r.isTouch===1&&n.ignoreMobileResize),"autoRefreshEvents"in n&&(No(Yt)||No(qt,n.autoRefreshEvents||"none"),Sd=(n.autoRefreshEvents+"").indexOf("resize")===-1)},r.scrollerProxy=function(n,i){var s=pn(n),o=et.indexOf(s),a=Fr(s);~o&&et.splice(o,a?6:2),i&&(a?hi.unshift(Qe,i,at,i,Cn,i):hi.unshift(s,i))},r.clearMatchMedia=function(n){Je.forEach(function(i){return i._ctx&&i._ctx.query===n&&i._ctx.kill(!0,!0)})},r.isInViewport=function(n,i,s){var o=(wn(n)?pn(n):n).getBoundingClientRect(),a=o[s?Ur:Ir]*i||0;return s?o.right-a>0&&o.left+a<Qe.innerWidth:o.bottom-a>0&&o.top+a<Qe.innerHeight},r.positionInViewport=function(n,i,s){wn(n)&&(n=pn(n));var o=n.getBoundingClientRect(),a=o[s?Ur:Ir],l=i==null?a/2:i in Ia?Ia[i]*a:~i.indexOf("%")?parseFloat(i)*a/100:parseFloat(i)||0;return s?(o.left+l)/Qe.innerWidth:(o.top+l)/Qe.innerHeight},r.killAll=function(n){if(Je.slice(0).forEach(function(s){return s.vars.id!=="ScrollSmoother"&&s.kill()}),n!==!0){var i=Br.killAll||[];Br={},i.forEach(function(s){return s()})}},r}();Ge.version="3.15.0";Ge.saveStyles=function(r){return r?yo(r).forEach(function(e){if(e&&e.style){var t=An.indexOf(e);t>=0&&An.splice(t,5),An.push(e,e.style.cssText,e.getBBox&&e.getAttribute("transform"),ve.core.getCache(e),mc())}}):An};Ge.revert=function(r,e){return Qc(!r,e)};Ge.create=function(r,e){return new Ge(r,e)};Ge.refresh=function(r){return r?Qs(!0):(cs||Ge.register())&&Ar(!0)};Ge.update=function(r){return++et.cache&&Ai(r===!0?2:0)};Ge.clearScrollMemory=Ud;Ge.maxScroll=function(r,e){return li(r,e?fn:zt)};Ge.getScrollFunc=function(r,e){return nr(pn(r),e?fn:zt)};Ge.getById=function(r){return gc[r]};Ge.getAll=function(){return Je.filter(function(r){return r.vars.id!=="ScrollSmoother"})};Ge.isScrolling=function(){return!!Yn};Ge.snapDirectional=Jc;Ge.addEventListener=function(r,e){var t=Br[r]||(Br[r]=[]);~t.indexOf(e)||t.push(e)};Ge.removeEventListener=function(r,e){var t=Br[r],n=t&&t.indexOf(e);n>=0&&t.splice(n,1)};Ge.batch=function(r,e){var t=[],n={},i=e.interval||.016,s=e.batchMax||1e9,o=function(c,u){var d=[],h=[],f=ve.delayedCall(i,function(){u(d,h),d=[],h=[]}).pause();return function(g){d.length||f.restart(!0),d.push(g.trigger),h.push(g),s<=d.length&&f.progress(1)}},a;for(a in e)n[a]=a.substr(0,2)==="on"&&rn(e[a])&&a!=="onRefreshInit"?o(a,e[a]):e[a];return rn(s)&&(s=s(),qt(Ge,"refresh",function(){return s=e.batchMax()})),yo(r).forEach(function(l){var c={};for(a in n)c[a]=n[a];c.trigger=l,t.push(Ge.create(c))}),t};var Gu=function(e,t,n,i){return t>i?e(i):t<0&&e(0),n>i?(i-t)/(n-t):n<0?t/(t-n):1},pl=function r(e,t){t===!0?e.style.removeProperty("touch-action"):e.style.touchAction=t===!0?"auto":t?"pan-"+t+(Ut.isTouch?" pinch-zoom":""):"none",e===Cn&&r(at,t)},Vo={auto:1,scroll:1},a_=function(e){var t=e.event,n=e.target,i=e.axis,s=(t.changedTouches?t.changedTouches[0]:t).target,o=s._gsap||ve.core.getCache(s),a=tn(),l;if(!o._isScrollT||a-o._isScrollT>2e3){for(;s&&s!==at&&(s.scrollHeight<=s.clientHeight&&s.scrollWidth<=s.clientWidth||!(Vo[(l=Vn(s)).overflowY]||Vo[l.overflowX]));)s=s.parentNode;o._isScroll=s&&s!==n&&!Fr(s)&&(Vo[(l=Vn(s)).overflowY]||Vo[l.overflowX]),o._isScrollT=a}(o._isScroll||i==="x")&&(t.stopPropagation(),t._gsapAllow=!0)},Od=function(e,t,n,i){return Ut.create({target:e,capture:!0,debounce:!1,lockAxis:!0,type:t,onWheel:i=i&&a_,onPress:i,onDrag:i,onScroll:i,onEnable:function(){return n&&qt(ut,Ut.eventTypes[0],Xu,!1,!0)},onDisable:function(){return Yt(ut,Ut.eventTypes[0],Xu,!0)}})},l_=/(input|label|select|textarea)/i,Wu,Xu=function(e){var t=l_.test(e.target.tagName);(t||Wu)&&(e._gsapAllow=!0,Wu=t)},c_=function(e){Sr(e)||(e={}),e.preventDefault=e.isNormalizer=e.allowClicks=!0,e.type||(e.type="wheel,touch"),e.debounce=!!e.debounce,e.id=e.id||"normalizer";var t=e,n=t.normalizeScrollX,i=t.momentum,s=t.allowNestedScroll,o=t.onRelease,a,l,c=pn(e.target)||Cn,u=ve.core.globals().ScrollSmoother,d=u&&u.get(),h=zi&&(e.content&&pn(e.content)||d&&e.content!==!1&&!d.smooth()&&d.content()),f=nr(c,zt),g=nr(c,fn),_=1,p=(Ut.isTouch&&Qe.visualViewport?Qe.visualViewport.scale*Qe.visualViewport.width:Qe.outerWidth)/Qe.innerWidth,m=0,E=rn(i)?function(){return i(a)}:function(){return i||2.8},x,M,w=Od(c,e.type,!0,s),A=function(){return M=!1},T=ti,C=ti,S=function(){l=li(c,zt),C=oo(zi?1:0,l),n&&(T=oo(0,li(c,fn))),x=Nr},v=function(){h._gsap.y=js(parseFloat(h._gsap.y)+f.offset)+"px",h.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+parseFloat(h._gsap.y)+", 0, 1)",f.offset=f.cacheID=0},L=function(){if(M){requestAnimationFrame(A);var H=js(a.deltaY/2),ae=C(f.v-H);if(h&&ae!==f.v+f.offset){f.offset=ae-f.v;var P=js((parseFloat(h&&h._gsap.y)||0)-f.offset);h.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+P+", 0, 1)",h._gsap.y=P+"px",f.cacheID=et.cache,Ai()}return!0}f.offset&&v(),M=!0},N,B,W,Y,G=function(){S(),N.isActive()&&N.vars.scrollY>l&&(f()>l?N.progress(1)&&f(l):N.resetTo("scrollY",l))};return h&&ve.set(h,{y:"+=0"}),e.ignoreCheck=function(V){return zi&&V.type==="touchmove"&&L()||_>1.05&&V.type!=="touchstart"||a.isGesturing||V.touches&&V.touches.length>1},e.onPress=function(){M=!1;var V=_;_=js((Qe.visualViewport&&Qe.visualViewport.scale||1)/p),N.pause(),V!==_&&pl(c,_>1.01?!0:n?!1:"x"),B=g(),W=f(),S(),x=Nr},e.onRelease=e.onGestureStart=function(V,H){if(f.offset&&v(),!H)Y.restart(!0);else{et.cache++;var ae=E(),P,ue;n&&(P=g(),ue=P+ae*.05*-V.velocityX/.227,ae*=Gu(g,P,ue,li(c,fn)),N.vars.scrollX=T(ue)),P=f(),ue=P+ae*.05*-V.velocityY/.227,ae*=Gu(f,P,ue,li(c,zt)),N.vars.scrollY=C(ue),N.invalidate().duration(ae).play(.01),(zi&&N.vars.scrollY>=l||P>=l-1)&&ve.to({},{onUpdate:G,duration:ae})}o&&o(V)},e.onWheel=function(){N._ts&&N.pause(),tn()-m>1e3&&(x=0,m=tn())},e.onChange=function(V,H,ae,P,ue){if(Nr!==x&&S(),H&&n&&g(T(P[2]===H?B+(V.startX-V.x):g()+H-P[1])),ae){f.offset&&v();var Ne=ue[2]===ae,Ye=Ne?W+V.startY-V.y:f()+ae-ue[1],$=C(Ye);Ne&&Ye!==$&&(W+=$-Ye),f($)}(ae||H)&&Ai()},e.onEnable=function(){pl(c,n?!1:"x"),Ge.addEventListener("refresh",G),qt(Qe,"resize",G),f.smooth&&(f.target.style.scrollBehavior="auto",f.smooth=g.smooth=!1),w.enable()},e.onDisable=function(){pl(c,!0),Yt(Qe,"resize",G),Ge.removeEventListener("refresh",G),w.kill()},e.lockAxis=e.lockAxis!==!1,a=new Ut(e),a.iOS=zi,zi&&!f()&&f(1),zi&&ve.ticker.add(ti),Y=a._dc,N=ve.to(a,{ease:"power4",paused:!0,inherit:!1,scrollX:n?"+=0.1":"+=0",scrollY:"+=0.1",modifiers:{scrollY:Nd(f,f(),function(){return N.pause()})},onUpdate:Ai,onComplete:Y.vars.onComplete}),a};Ge.sort=function(r){if(rn(r))return Je.sort(r);var e=Qe.pageYOffset||0;return Ge.getAll().forEach(function(t){return t._sortY=t.trigger?e+t.trigger.getBoundingClientRect().top:t.start+Qe.innerHeight}),Je.sort(r||function(t,n){return(t.vars.refreshPriority||0)*-1e6+(t.vars.containerAnimation?1e6:t._sortY)-((n.vars.containerAnimation?1e6:n._sortY)+(n.vars.refreshPriority||0)*-1e6)})};Ge.observe=function(r){return new Ut(r)};Ge.normalizeScroll=function(r){if(typeof r>"u")return cn;if(r===!0&&cn)return cn.enable();if(r===!1){cn&&cn.kill(),cn=r;return}var e=r instanceof Ut?r:c_(r);return cn&&cn.target===e.target&&cn.kill(),Fr(e.target)&&(cn=e),e};Ge.core={_getVelocityProp:fc,_inputObserver:Od,_scrollers:et,_proxies:hi,bridge:{ss:function(){Yn||zr("scrollStart"),Yn=tn()},ref:function(){return en}}};Td()&&ve.registerPlugin(Ge);kt.registerPlugin(Ge);const Fd=new bp({lerp:.075,smoothWheel:!0,syncTouch:!1});Fd.on("scroll",Ge.update);kt.ticker.add(r=>{Fd.raf(r*1e3)});kt.ticker.lagSmoothing(0);document.querySelectorAll(".section-fade").forEach(r=>{kt.to(r,{opacity:1,y:0,duration:.85,ease:"power3.out",scrollTrigger:{trigger:r,start:"top 88%",toggleActions:"play none none none"}})});const Yu=document.getElementById("navbar"),eu=document.getElementById("menu-btn"),Yi=document.getElementById("mobile-menu");let tu=!1;function u_(){tu=!0,eu.setAttribute("aria-expanded","true"),Yi.setAttribute("aria-hidden","false"),Yi.style.maxHeight=Yi.scrollHeight+"px",Yi.style.opacity="1"}function Bd(){tu=!1,eu.setAttribute("aria-expanded","false"),Yi.setAttribute("aria-hidden","true"),Yi.style.maxHeight="0",Yi.style.opacity="0"}eu.addEventListener("click",()=>tu?Bd():u_());Yi.querySelectorAll("a").forEach(r=>r.addEventListener("click",Bd));window.addEventListener("scroll",()=>{window.scrollY>40?Yu.classList.add("is-scrolled"):Yu.classList.remove("is-scrolled")},{passive:!0});/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const nu="165",h_=0,qu=1,f_=2,zd=1,d_=2,Si=3,ir=0,Mn=1,si=2,ji=0,ys=1,$u=2,Ku=3,Zu=4,p_=5,Er=100,m_=101,__=102,g_=103,v_=104,x_=200,S_=201,M_=202,y_=203,Sc=204,Mc=205,E_=206,T_=207,b_=208,A_=209,w_=210,R_=211,C_=212,P_=213,L_=214,D_=0,U_=1,I_=2,Na=3,N_=4,O_=5,F_=6,B_=7,kd=0,z_=1,k_=2,Ji=0,H_=1,V_=2,G_=3,W_=4,X_=5,Y_=6,q_=7,Hd=300,Ls=301,Ds=302,yc=303,Ec=304,Ya=306,Tc=1e3,wr=1001,bc=1002,Xn=1003,$_=1004,Go=1005,Jn=1006,ml=1007,Rr=1008,rr=1009,K_=1010,Z_=1011,Oa=1012,Vd=1013,Us=1014,qi=1015,qa=1016,Gd=1017,Wd=1018,Is=1020,j_=35902,J_=1021,Q_=1022,ci=1023,eg=1024,tg=1025,Es=1026,Ns=1027,ng=1028,Xd=1029,ig=1030,Yd=1031,qd=1033,_l=33776,gl=33777,vl=33778,xl=33779,ju=35840,Ju=35841,Qu=35842,eh=35843,th=36196,nh=37492,ih=37496,rh=37808,sh=37809,oh=37810,ah=37811,lh=37812,ch=37813,uh=37814,hh=37815,fh=37816,dh=37817,ph=37818,mh=37819,_h=37820,gh=37821,Sl=36492,vh=36494,xh=36495,rg=36283,Sh=36284,Mh=36285,yh=36286,sg=3200,og=3201,ag=0,lg=1,ki="",ni="srgb",or="srgb-linear",iu="display-p3",$a="display-p3-linear",Fa="linear",Mt="srgb",Ba="rec709",za="p3",Yr=7680,Eh=519,cg=512,ug=513,hg=514,$d=515,fg=516,dg=517,pg=518,mg=519,Th=35044,bh="300 es",bi=2e3,ka=2001;class Fs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,e);e.target=null}}}const Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ml=Math.PI/180,Ac=180/Math.PI;function bo(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Jt[r&255]+Jt[r>>8&255]+Jt[r>>16&255]+Jt[r>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[t&63|128]+Jt[t>>8&255]+"-"+Jt[t>>16&255]+Jt[t>>24&255]+Jt[n&255]+Jt[n>>8&255]+Jt[n>>16&255]+Jt[n>>24&255]).toLowerCase()}function mn(r,e,t){return Math.max(e,Math.min(t,r))}function _g(r,e){return(r%e+e)%e}function yl(r,e,t){return(1-t)*r+t*e}function Vs(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function dn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class lt{constructor(e=0,t=0){lt.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(mn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*i+e.x,this.y=s*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ke{constructor(e,t,n,i,s,o,a,l,c){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,a,l,c)}set(e,t,n,i,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=i,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],f=n[5],g=n[8],_=i[0],p=i[3],m=i[6],E=i[1],x=i[4],M=i[7],w=i[2],A=i[5],T=i[8];return s[0]=o*_+a*E+l*w,s[3]=o*p+a*x+l*A,s[6]=o*m+a*M+l*T,s[1]=c*_+u*E+d*w,s[4]=c*p+u*x+d*A,s[7]=c*m+u*M+d*T,s[2]=h*_+f*E+g*w,s[5]=h*p+f*x+g*A,s[8]=h*m+f*M+g*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*s*u+n*a*l+i*s*c-i*o*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,h=a*l-u*s,f=c*s-o*l,g=t*d+n*h+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(i*c-u*n)*_,e[2]=(a*n-i*o)*_,e[3]=h*_,e[4]=(u*t-i*l)*_,e[5]=(i*s-a*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(El.makeScale(e,t)),this}rotate(e){return this.premultiply(El.makeRotation(-e)),this}translate(e,t){return this.premultiply(El.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const El=new Ke;function Kd(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Ha(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function gg(){const r=Ha("canvas");return r.style.display="block",r}const Ah={};function Zd(r){r in Ah||(Ah[r]=!0,console.warn(r))}function vg(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const wh=new Ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Rh=new Ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Wo={[or]:{transfer:Fa,primaries:Ba,toReference:r=>r,fromReference:r=>r},[ni]:{transfer:Mt,primaries:Ba,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[$a]:{transfer:Fa,primaries:za,toReference:r=>r.applyMatrix3(Rh),fromReference:r=>r.applyMatrix3(wh)},[iu]:{transfer:Mt,primaries:za,toReference:r=>r.convertSRGBToLinear().applyMatrix3(Rh),fromReference:r=>r.applyMatrix3(wh).convertLinearToSRGB()}},xg=new Set([or,$a]),ht={enabled:!0,_workingColorSpace:or,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!xg.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;const n=Wo[e].toReference,i=Wo[t].fromReference;return i(n(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return Wo[r].primaries},getTransfer:function(r){return r===ki?Fa:Wo[r].transfer}};function Ts(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Tl(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let qr;class Sg{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{qr===void 0&&(qr=Ha("canvas")),qr.width=e.width,qr.height=e.height;const n=qr.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=qr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ha("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=Ts(s[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ts(t[n]/255)*255):t[n]=Ts(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Mg=0;class jd{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Mg++}),this.uuid=bo(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(bl(i[o].image)):s.push(bl(i[o]))}else s=bl(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function bl(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Sg.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let yg=0;class yn extends Fs{constructor(e=yn.DEFAULT_IMAGE,t=yn.DEFAULT_MAPPING,n=wr,i=wr,s=Jn,o=Rr,a=ci,l=rr,c=yn.DEFAULT_ANISOTROPY,u=ki){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yg++}),this.uuid=bo(),this.name="",this.source=new jd(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new lt(0,0),this.repeat=new lt(1,1),this.center=new lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Hd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Tc:e.x=e.x-Math.floor(e.x);break;case wr:e.x=e.x<0?0:1;break;case bc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Tc:e.y=e.y-Math.floor(e.y);break;case wr:e.y=e.y<0?0:1;break;case bc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}yn.DEFAULT_IMAGE=null;yn.DEFAULT_MAPPING=Hd;yn.DEFAULT_ANISOTROPY=1;class Zt{constructor(e=0,t=0,n=0,i=1){Zt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],g=l[9],_=l[2],p=l[6],m=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(c+1)/2,M=(f+1)/2,w=(m+1)/2,A=(u+h)/4,T=(d+_)/4,C=(g+p)/4;return x>M&&x>w?x<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(x),i=A/n,s=T/n):M>w?M<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(M),n=A/i,s=C/i):w<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(w),n=T/s,i=C/s),this.set(n,i,s,t),this}let E=Math.sqrt((p-g)*(p-g)+(d-_)*(d-_)+(h-u)*(h-u));return Math.abs(E)<.001&&(E=1),this.x=(p-g)/E,this.y=(d-_)/E,this.z=(h-u)/E,this.w=Math.acos((c+f+m-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Eg extends Fs{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Zt(0,0,e,t),this.scissorTest=!1,this.viewport=new Zt(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new yn(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new jd(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class kr extends Eg{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Jd extends yn{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=wr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Tg extends yn{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=wr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ao{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,o,a){let l=n[i+0],c=n[i+1],u=n[i+2],d=n[i+3];const h=s[o+0],f=s[o+1],g=s[o+2],_=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d;return}if(a===1){e[t+0]=h,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==h||c!==f||u!==g){let p=1-a;const m=l*h+c*f+u*g+d*_,E=m>=0?1:-1,x=1-m*m;if(x>Number.EPSILON){const w=Math.sqrt(x),A=Math.atan2(w,m*E);p=Math.sin(p*A)/w,a=Math.sin(a*A)/w}const M=a*E;if(l=l*p+h*M,c=c*p+f*M,u=u*p+g*M,d=d*p+_*M,p===1-a){const w=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=w,c*=w,u*=w,d*=w}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,s,o){const a=n[i],l=n[i+1],c=n[i+2],u=n[i+3],d=s[o],h=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+u*d+l*f-c*h,e[t+1]=l*g+u*h+c*d-a*f,e[t+2]=c*g+u*f+a*h-l*d,e[t+3]=u*g-a*d-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(i/2),d=a(s/2),h=l(n/2),f=l(i/2),g=l(s/2);switch(o){case"XYZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"YZX":this._x=h*u*d+c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d-h*f*g;break;case"XZY":this._x=h*u*d-c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d+h*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=n+a+d;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(o-i)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(u-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(s+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(s-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-i)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(mn(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+i*c-s*l,this._y=i*u+o*l+s*a-n*c,this._z=s*u+o*c+n*l-i*a,this._w=o*u-n*a-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,s=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),d=Math.sin((1-t)*u)/c,h=Math.sin(t*u)/c;return this._w=o*d+this._w*h,this._x=n*d+this._x*h,this._y=i*d+this._y*h,this._z=s*d+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class q{constructor(e=0,t=0,n=0){q.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ch.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ch.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),u=2*(a*t-s*i),d=2*(s*n-o*t);return this.x=t+l*c+o*d-a*u,this.y=n+l*u+a*c-s*d,this.z=i+l*d+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-s*a,this.y=s*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Al.copy(this).projectOnVector(e),this.sub(Al)}reflect(e){return this.sub(Al.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(mn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Al=new q,Ch=new Ao;class wo{constructor(e=new q(1/0,1/0,1/0),t=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(qn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(qn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=qn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,qn):qn.fromBufferAttribute(s,o),qn.applyMatrix4(e.matrixWorld),this.expandByPoint(qn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xo.copy(n.boundingBox)),Xo.applyMatrix4(e.matrixWorld),this.union(Xo)}const i=e.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,qn),qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Gs),Yo.subVectors(this.max,Gs),$r.subVectors(e.a,Gs),Kr.subVectors(e.b,Gs),Zr.subVectors(e.c,Gs),Ui.subVectors(Kr,$r),Ii.subVectors(Zr,Kr),hr.subVectors($r,Zr);let t=[0,-Ui.z,Ui.y,0,-Ii.z,Ii.y,0,-hr.z,hr.y,Ui.z,0,-Ui.x,Ii.z,0,-Ii.x,hr.z,0,-hr.x,-Ui.y,Ui.x,0,-Ii.y,Ii.x,0,-hr.y,hr.x,0];return!wl(t,$r,Kr,Zr,Yo)||(t=[1,0,0,0,1,0,0,0,1],!wl(t,$r,Kr,Zr,Yo))?!1:(qo.crossVectors(Ui,Ii),t=[qo.x,qo.y,qo.z],wl(t,$r,Kr,Zr,Yo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(pi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const pi=[new q,new q,new q,new q,new q,new q,new q,new q],qn=new q,Xo=new wo,$r=new q,Kr=new q,Zr=new q,Ui=new q,Ii=new q,hr=new q,Gs=new q,Yo=new q,qo=new q,fr=new q;function wl(r,e,t,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){fr.fromArray(r,s);const a=i.x*Math.abs(fr.x)+i.y*Math.abs(fr.y)+i.z*Math.abs(fr.z),l=e.dot(fr),c=t.dot(fr),u=n.dot(fr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const bg=new wo,Ws=new q,Rl=new q;class ru{constructor(e=new q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):bg.setFromPoints(e).getCenter(n);let i=0;for(let s=0,o=e.length;s<o;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ws.subVectors(e,this.center);const t=Ws.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ws,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Rl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ws.copy(e.center).add(Rl)),this.expandByPoint(Ws.copy(e.center).sub(Rl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const mi=new q,Cl=new q,$o=new q,Ni=new q,Pl=new q,Ko=new q,Ll=new q;class Ag{constructor(e=new q,t=new q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(mi.copy(this.origin).addScaledVector(this.direction,t),mi.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Cl.copy(e).add(t).multiplyScalar(.5),$o.copy(t).sub(e).normalize(),Ni.copy(this.origin).sub(Cl);const s=e.distanceTo(t)*.5,o=-this.direction.dot($o),a=Ni.dot(this.direction),l=-Ni.dot($o),c=Ni.lengthSq(),u=Math.abs(1-o*o);let d,h,f,g;if(u>0)if(d=o*l-a,h=o*a-l,g=s*u,d>=0)if(h>=-g)if(h<=g){const _=1/u;d*=_,h*=_,f=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=s,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h=-s,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-o*s+a)),h=d>0?-s:Math.min(Math.max(-s,-l),s),f=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-s,-l),s),f=h*(h+2*l)+c):(d=Math.max(0,-(o*s+a)),h=d>0?s:Math.min(Math.max(-s,-l),s),f=-d*d+h*(h+2*l)+c);else h=o>0?-s:s,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Cl).addScaledVector($o,h),f}intersectSphere(e,t){mi.subVectors(e.center,this.origin);const n=mi.dot(this.direction),i=mi.dot(mi)-n*n,s=e.radius*e.radius;if(i>s)return null;const o=Math.sqrt(s-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,i=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,i=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),d>=0?(a=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,mi)!==null}intersectTriangle(e,t,n,i,s){Pl.subVectors(t,e),Ko.subVectors(n,e),Ll.crossVectors(Pl,Ko);let o=this.direction.dot(Ll),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ni.subVectors(this.origin,e);const l=a*this.direction.dot(Ko.crossVectors(Ni,Ko));if(l<0)return null;const c=a*this.direction.dot(Pl.cross(Ni));if(c<0||l+c>o)return null;const u=-a*Ni.dot(Ll);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ht{constructor(e,t,n,i,s,o,a,l,c,u,d,h,f,g,_,p){Ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,o,a,l,c,u,d,h,f,g,_,p)}set(e,t,n,i,s,o,a,l,c,u,d,h,f,g,_,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=s,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=d,m[14]=h,m[3]=f,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ht().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/jr.setFromMatrixColumn(e,0).length(),s=1/jr.setFromMatrixColumn(e,1).length(),o=1/jr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const h=o*u,f=o*d,g=a*u,_=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=h-_*c,t[9]=-a*l,t[2]=_-h*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){const h=l*u,f=l*d,g=c*u,_=c*d;t[0]=h+_*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=_+h*a,t[10]=o*l}else if(e.order==="ZXY"){const h=l*u,f=l*d,g=c*u,_=c*d;t[0]=h-_*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=_-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const h=o*u,f=o*d,g=a*u,_=a*d;t[0]=l*u,t[4]=g*c-f,t[8]=h*c+_,t[1]=l*d,t[5]=_*c+h,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const h=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=_-h*d,t[8]=g*d+f,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*d+g,t[10]=h-_*d}else if(e.order==="XZY"){const h=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+_,t[5]=o*u,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*u,t[10]=_*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(wg,e,Rg)}lookAt(e,t,n){const i=this.elements;return Tn.subVectors(e,t),Tn.lengthSq()===0&&(Tn.z=1),Tn.normalize(),Oi.crossVectors(n,Tn),Oi.lengthSq()===0&&(Math.abs(n.z)===1?Tn.x+=1e-4:Tn.z+=1e-4,Tn.normalize(),Oi.crossVectors(n,Tn)),Oi.normalize(),Zo.crossVectors(Tn,Oi),i[0]=Oi.x,i[4]=Zo.x,i[8]=Tn.x,i[1]=Oi.y,i[5]=Zo.y,i[9]=Tn.y,i[2]=Oi.z,i[6]=Zo.z,i[10]=Tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],f=n[13],g=n[2],_=n[6],p=n[10],m=n[14],E=n[3],x=n[7],M=n[11],w=n[15],A=i[0],T=i[4],C=i[8],S=i[12],v=i[1],L=i[5],N=i[9],B=i[13],W=i[2],Y=i[6],G=i[10],V=i[14],H=i[3],ae=i[7],P=i[11],ue=i[15];return s[0]=o*A+a*v+l*W+c*H,s[4]=o*T+a*L+l*Y+c*ae,s[8]=o*C+a*N+l*G+c*P,s[12]=o*S+a*B+l*V+c*ue,s[1]=u*A+d*v+h*W+f*H,s[5]=u*T+d*L+h*Y+f*ae,s[9]=u*C+d*N+h*G+f*P,s[13]=u*S+d*B+h*V+f*ue,s[2]=g*A+_*v+p*W+m*H,s[6]=g*T+_*L+p*Y+m*ae,s[10]=g*C+_*N+p*G+m*P,s[14]=g*S+_*B+p*V+m*ue,s[3]=E*A+x*v+M*W+w*H,s[7]=E*T+x*L+M*Y+w*ae,s[11]=E*C+x*N+M*G+w*P,s[15]=E*S+x*B+M*V+w*ue,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],f=e[14],g=e[3],_=e[7],p=e[11],m=e[15];return g*(+s*l*d-i*c*d-s*a*h+n*c*h+i*a*f-n*l*f)+_*(+t*l*f-t*c*h+s*o*h-i*o*f+i*c*u-s*l*u)+p*(+t*c*d-t*a*f-s*o*d+n*o*f+s*a*u-n*c*u)+m*(-i*a*u-t*l*d+t*a*h+i*o*d-n*o*h+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],f=e[11],g=e[12],_=e[13],p=e[14],m=e[15],E=d*p*c-_*h*c+_*l*f-a*p*f-d*l*m+a*h*m,x=g*h*c-u*p*c-g*l*f+o*p*f+u*l*m-o*h*m,M=u*_*c-g*d*c+g*a*f-o*_*f-u*a*m+o*d*m,w=g*d*l-u*_*l-g*a*h+o*_*h+u*a*p-o*d*p,A=t*E+n*x+i*M+s*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/A;return e[0]=E*T,e[1]=(_*h*s-d*p*s-_*i*f+n*p*f+d*i*m-n*h*m)*T,e[2]=(a*p*s-_*l*s+_*i*c-n*p*c-a*i*m+n*l*m)*T,e[3]=(d*l*s-a*h*s-d*i*c+n*h*c+a*i*f-n*l*f)*T,e[4]=x*T,e[5]=(u*p*s-g*h*s+g*i*f-t*p*f-u*i*m+t*h*m)*T,e[6]=(g*l*s-o*p*s-g*i*c+t*p*c+o*i*m-t*l*m)*T,e[7]=(o*h*s-u*l*s+u*i*c-t*h*c-o*i*f+t*l*f)*T,e[8]=M*T,e[9]=(g*d*s-u*_*s-g*n*f+t*_*f+u*n*m-t*d*m)*T,e[10]=(o*_*s-g*a*s+g*n*c-t*_*c-o*n*m+t*a*m)*T,e[11]=(u*a*s-o*d*s-u*n*c+t*d*c+o*n*f-t*a*f)*T,e[12]=w*T,e[13]=(u*_*i-g*d*i+g*n*h-t*_*h-u*n*p+t*d*p)*T,e[14]=(g*a*i-o*_*i-g*n*l+t*_*l+o*n*p-t*a*p)*T,e[15]=(o*d*i-u*a*i+u*n*l-t*d*l-o*n*h+t*a*h)*T,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,u*a+n,u*l-i*o,0,c*l-i*a,u*l+i*o,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,o){return this.set(1,n,s,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,d=a+a,h=s*c,f=s*u,g=s*d,_=o*u,p=o*d,m=a*d,E=l*c,x=l*u,M=l*d,w=n.x,A=n.y,T=n.z;return i[0]=(1-(_+m))*w,i[1]=(f+M)*w,i[2]=(g-x)*w,i[3]=0,i[4]=(f-M)*A,i[5]=(1-(h+m))*A,i[6]=(p+E)*A,i[7]=0,i[8]=(g+x)*T,i[9]=(p-E)*T,i[10]=(1-(h+_))*T,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let s=jr.set(i[0],i[1],i[2]).length();const o=jr.set(i[4],i[5],i[6]).length(),a=jr.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],$n.copy(this);const c=1/s,u=1/o,d=1/a;return $n.elements[0]*=c,$n.elements[1]*=c,$n.elements[2]*=c,$n.elements[4]*=u,$n.elements[5]*=u,$n.elements[6]*=u,$n.elements[8]*=d,$n.elements[9]*=d,$n.elements[10]*=d,t.setFromRotationMatrix($n),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,i,s,o,a=bi){const l=this.elements,c=2*s/(t-e),u=2*s/(n-i),d=(t+e)/(t-e),h=(n+i)/(n-i);let f,g;if(a===bi)f=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===ka)f=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,o,a=bi){const l=this.elements,c=1/(t-e),u=1/(n-i),d=1/(o-s),h=(t+e)*c,f=(n+i)*u;let g,_;if(a===bi)g=(o+s)*d,_=-2*d;else if(a===ka)g=s*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const jr=new q,$n=new Ht,wg=new q(0,0,0),Rg=new q(1,1,1),Oi=new q,Zo=new q,Tn=new q,Ph=new Ht,Lh=new Ao;class Ci{constructor(e=0,t=0,n=0,i=Ci.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],o=i[4],a=i[8],l=i[1],c=i[5],u=i[9],d=i[2],h=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(mn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-mn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(mn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-mn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(mn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-mn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ph.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ph,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Lh.setFromEuler(this),this.setFromQuaternion(Lh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ci.DEFAULT_ORDER="XYZ";class Qd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Cg=0;const Dh=new q,Jr=new Ao,_i=new Ht,jo=new q,Xs=new q,Pg=new q,Lg=new Ao,Uh=new q(1,0,0),Ih=new q(0,1,0),Nh=new q(0,0,1),Oh={type:"added"},Dg={type:"removed"},Qr={type:"childadded",child:null},Dl={type:"childremoved",child:null};class Nn extends Fs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Cg++}),this.uuid=bo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Nn.DEFAULT_UP.clone();const e=new q,t=new Ci,n=new Ao,i=new q(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ht},normalMatrix:{value:new Ke}}),this.matrix=new Ht,this.matrixWorld=new Ht,this.matrixAutoUpdate=Nn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Jr.setFromAxisAngle(e,t),this.quaternion.multiply(Jr),this}rotateOnWorldAxis(e,t){return Jr.setFromAxisAngle(e,t),this.quaternion.premultiply(Jr),this}rotateX(e){return this.rotateOnAxis(Uh,e)}rotateY(e){return this.rotateOnAxis(Ih,e)}rotateZ(e){return this.rotateOnAxis(Nh,e)}translateOnAxis(e,t){return Dh.copy(e).applyQuaternion(this.quaternion),this.position.add(Dh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Uh,e)}translateY(e){return this.translateOnAxis(Ih,e)}translateZ(e){return this.translateOnAxis(Nh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_i.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?jo.copy(e):jo.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Xs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_i.lookAt(Xs,jo,this.up):_i.lookAt(jo,Xs,this.up),this.quaternion.setFromRotationMatrix(_i),i&&(_i.extractRotation(i.matrixWorld),Jr.setFromRotationMatrix(_i),this.quaternion.premultiply(Jr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Oh),Qr.child=e,this.dispatchEvent(Qr),Qr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Dg),Dl.child=e,this.dispatchEvent(Dl),Dl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_i.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_i.multiply(e.parent.matrixWorld)),e.applyMatrix4(_i),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Oh),Qr.child=e,this.dispatchEvent(Qr),Qr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,e,Pg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,Lg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const s=t[n];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let s=0,o=i.length;s<o;s++){const a=i[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Nn.DEFAULT_UP=new q(0,1,0);Nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Kn=new q,gi=new q,Ul=new q,vi=new q,es=new q,ts=new q,Fh=new q,Il=new q,Nl=new q,Ol=new q;class oi{constructor(e=new q,t=new q,n=new q){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Kn.subVectors(e,t),i.cross(Kn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){Kn.subVectors(i,t),gi.subVectors(n,t),Ul.subVectors(e,t);const o=Kn.dot(Kn),a=Kn.dot(gi),l=Kn.dot(Ul),c=gi.dot(gi),u=gi.dot(Ul),d=o*c-a*a;if(d===0)return s.set(0,0,0),null;const h=1/d,f=(c*l-a*u)*h,g=(o*u-a*l)*h;return s.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,vi)===null?!1:vi.x>=0&&vi.y>=0&&vi.x+vi.y<=1}static getInterpolation(e,t,n,i,s,o,a,l){return this.getBarycoord(e,t,n,i,vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,vi.x),l.addScaledVector(o,vi.y),l.addScaledVector(a,vi.z),l)}static isFrontFacing(e,t,n,i){return Kn.subVectors(n,t),gi.subVectors(e,t),Kn.cross(gi).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Kn.subVectors(this.c,this.b),gi.subVectors(this.a,this.b),Kn.cross(gi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return oi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return oi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return oi.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return oi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return oi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let o,a;es.subVectors(i,n),ts.subVectors(s,n),Il.subVectors(e,n);const l=es.dot(Il),c=ts.dot(Il);if(l<=0&&c<=0)return t.copy(n);Nl.subVectors(e,i);const u=es.dot(Nl),d=ts.dot(Nl);if(u>=0&&d<=u)return t.copy(i);const h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(es,o);Ol.subVectors(e,s);const f=es.dot(Ol),g=ts.dot(Ol);if(g>=0&&f<=g)return t.copy(s);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(ts,a);const p=u*g-f*d;if(p<=0&&d-u>=0&&f-g>=0)return Fh.subVectors(s,i),a=(d-u)/(d-u+(f-g)),t.copy(i).addScaledVector(Fh,a);const m=1/(p+_+h);return o=_*m,a=h*m,t.copy(n).addScaledVector(es,o).addScaledVector(ts,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const ep={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},Jo={h:0,s:0,l:0};function Fl(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class ft{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ni){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ht.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=ht.workingColorSpace){return this.r=e,this.g=t,this.b=n,ht.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=ht.workingColorSpace){if(e=_g(e,1),t=mn(t,0,1),n=mn(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=Fl(o,s,e+1/3),this.g=Fl(o,s,e),this.b=Fl(o,s,e-1/3)}return ht.toWorkingColorSpace(this,i),this}setStyle(e,t=ni){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ni){const n=ep[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ts(e.r),this.g=Ts(e.g),this.b=Ts(e.b),this}copyLinearToSRGB(e){return this.r=Tl(e.r),this.g=Tl(e.g),this.b=Tl(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ni){return ht.fromWorkingColorSpace(Qt.copy(this),e),Math.round(mn(Qt.r*255,0,255))*65536+Math.round(mn(Qt.g*255,0,255))*256+Math.round(mn(Qt.b*255,0,255))}getHexString(e=ni){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ht.workingColorSpace){ht.fromWorkingColorSpace(Qt.copy(this),t);const n=Qt.r,i=Qt.g,s=Qt.b,o=Math.max(n,i,s),a=Math.min(n,i,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-s)/d+(i<s?6:0);break;case i:l=(s-n)/d+2;break;case s:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ht.workingColorSpace){return ht.fromWorkingColorSpace(Qt.copy(this),t),e.r=Qt.r,e.g=Qt.g,e.b=Qt.b,e}getStyle(e=ni){ht.fromWorkingColorSpace(Qt.copy(this),e);const t=Qt.r,n=Qt.g,i=Qt.b;return e!==ni?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Fi),this.setHSL(Fi.h+e,Fi.s+t,Fi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fi),e.getHSL(Jo);const n=yl(Fi.h,Jo.h,t),i=yl(Fi.s,Jo.s,t),s=yl(Fi.l,Jo.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Qt=new ft;ft.NAMES=ep;let Ug=0;class Ka extends Fs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ug++}),this.uuid=bo(),this.name="",this.type="Material",this.blending=ys,this.side=ir,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sc,this.blendDst=Mc,this.blendEquation=Er,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ft(0,0,0),this.blendAlpha=0,this.depthFunc=Na,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Eh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yr,this.stencilZFail=Yr,this.stencilZPass=Yr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ys&&(n.blending=this.blending),this.side!==ir&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Sc&&(n.blendSrc=this.blendSrc),this.blendDst!==Mc&&(n.blendDst=this.blendDst),this.blendEquation!==Er&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Na&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Eh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Yr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Yr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Yr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=i(e.textures),o=i(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class tp extends Ka{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ft(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ci,this.combine=kd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const It=new q,Qo=new lt;class Qn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Th,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=qi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Zd("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Qo.fromBufferAttribute(this,t),Qo.applyMatrix3(e),this.setXY(t,Qo.x,Qo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix3(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix4(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyNormalMatrix(e),this.setXYZ(t,It.x,It.y,It.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.transformDirection(e),this.setXYZ(t,It.x,It.y,It.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Vs(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=dn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Vs(t,this.array)),t}setX(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Vs(t,this.array)),t}setY(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Vs(t,this.array)),t}setZ(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Vs(t,this.array)),t}setW(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=dn(t,this.array),n=dn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=dn(t,this.array),n=dn(n,this.array),i=dn(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=dn(t,this.array),n=dn(n,this.array),i=dn(i,this.array),s=dn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Th&&(e.usage=this.usage),e}}class np extends Qn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ip extends Qn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Or extends Qn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Ig=0;const zn=new Ht,Bl=new Nn,ns=new q,bn=new wo,Ys=new wo,Xt=new q;class ar extends Fs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ig++}),this.uuid=bo(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Kd(e)?ip:np)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Ke().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return zn.makeRotationFromQuaternion(e),this.applyMatrix4(zn),this}rotateX(e){return zn.makeRotationX(e),this.applyMatrix4(zn),this}rotateY(e){return zn.makeRotationY(e),this.applyMatrix4(zn),this}rotateZ(e){return zn.makeRotationZ(e),this.applyMatrix4(zn),this}translate(e,t,n){return zn.makeTranslation(e,t,n),this.applyMatrix4(zn),this}scale(e,t,n){return zn.makeScale(e,t,n),this.applyMatrix4(zn),this}lookAt(e){return Bl.lookAt(e),Bl.updateMatrix(),this.applyMatrix4(Bl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ns).negate(),this.translate(ns.x,ns.y,ns.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Or(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];bn.setFromBufferAttribute(s),this.morphTargetsRelative?(Xt.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(Xt),Xt.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(Xt)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ru);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new q,1/0);return}if(e){const n=this.boundingSphere.center;if(bn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Ys.setFromBufferAttribute(a),this.morphTargetsRelative?(Xt.addVectors(bn.min,Ys.min),bn.expandByPoint(Xt),Xt.addVectors(bn.max,Ys.max),bn.expandByPoint(Xt)):(bn.expandByPoint(Ys.min),bn.expandByPoint(Ys.max))}bn.getCenter(n);let i=0;for(let s=0,o=e.count;s<o;s++)Xt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Xt));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Xt.fromBufferAttribute(a,c),l&&(ns.fromBufferAttribute(e,c),Xt.add(ns)),i=Math.max(i,n.distanceToSquared(Xt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Qn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new q,l[C]=new q;const c=new q,u=new q,d=new q,h=new lt,f=new lt,g=new lt,_=new q,p=new q;function m(C,S,v){c.fromBufferAttribute(n,C),u.fromBufferAttribute(n,S),d.fromBufferAttribute(n,v),h.fromBufferAttribute(s,C),f.fromBufferAttribute(s,S),g.fromBufferAttribute(s,v),u.sub(c),d.sub(c),f.sub(h),g.sub(h);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(L),p.copy(d).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(L),a[C].add(_),a[S].add(_),a[v].add(_),l[C].add(p),l[S].add(p),l[v].add(p))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let C=0,S=E.length;C<S;++C){const v=E[C],L=v.start,N=v.count;for(let B=L,W=L+N;B<W;B+=3)m(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const x=new q,M=new q,w=new q,A=new q;function T(C){w.fromBufferAttribute(i,C),A.copy(w);const S=a[C];x.copy(S),x.sub(w.multiplyScalar(w.dot(S))).normalize(),M.crossVectors(A,S);const L=M.dot(l[C])<0?-1:1;o.setXYZW(C,x.x,x.y,x.z,L)}for(let C=0,S=E.length;C<S;++C){const v=E[C],L=v.start,N=v.count;for(let B=L,W=L+N;B<W;B+=3)T(e.getX(B+0)),T(e.getX(B+1)),T(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Qn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);const i=new q,s=new q,o=new q,a=new q,l=new q,c=new q,u=new q,d=new q;if(e)for(let h=0,f=e.count;h<f;h+=3){const g=e.getX(h+0),_=e.getX(h+1),p=e.getX(h+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),u.subVectors(o,s),d.subVectors(i,s),u.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)i.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,s),d.subVectors(i,s),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Xt.fromBufferAttribute(e,t),Xt.normalize(),e.setXYZ(t,Xt.x,Xt.y,Xt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u);let f=0,g=0;for(let _=0,p=l.length;_<p;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*u;for(let m=0;m<u;m++)h[g++]=c[f++]}return new Qn(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ar,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,d=c.length;u<d;u++){const h=c[u],f=e(h,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){const f=c[d];u.push(f.toJSON(e.data))}u.length>0&&(i[l]=u,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],d=s[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bh=new Ht,dr=new Ag,ea=new ru,zh=new q,is=new q,rs=new q,ss=new q,zl=new q,ta=new q,na=new lt,ia=new lt,ra=new lt,kh=new q,Hh=new q,Vh=new q,sa=new q,oa=new q;class ui extends Nn{constructor(e=new ar,t=new tp){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(s&&a){ta.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],d=s[l];u!==0&&(zl.fromBufferAttribute(d,e),o?ta.addScaledVector(zl,u):ta.addScaledVector(zl.sub(t),u))}t.add(ta)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ea.copy(n.boundingSphere),ea.applyMatrix4(s),dr.copy(e.ray).recast(e.near),!(ea.containsPoint(dr.origin)===!1&&(dr.intersectSphere(ea,zh)===null||dr.origin.distanceToSquared(zh)>(e.far-e.near)**2))&&(Bh.copy(s).invert(),dr.copy(e.ray).applyMatrix4(Bh),!(n.boundingBox!==null&&dr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,dr)))}_computeIntersections(e,t,n){let i;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,h=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const p=h[g],m=o[p.materialIndex],E=Math.max(p.start,f.start),x=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let M=E,w=x;M<w;M+=3){const A=a.getX(M),T=a.getX(M+1),C=a.getX(M+2);i=aa(this,m,e,n,c,u,d,A,T,C),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){const E=a.getX(p),x=a.getX(p+1),M=a.getX(p+2);i=aa(this,o,e,n,c,u,d,E,x,M),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const p=h[g],m=o[p.materialIndex],E=Math.max(p.start,f.start),x=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let M=E,w=x;M<w;M+=3){const A=M,T=M+1,C=M+2;i=aa(this,m,e,n,c,u,d,A,T,C),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){const E=p,x=p+1,M=p+2;i=aa(this,o,e,n,c,u,d,E,x,M),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function Ng(r,e,t,n,i,s,o,a){let l;if(e.side===Mn?l=n.intersectTriangle(o,s,i,!0,a):l=n.intersectTriangle(i,s,o,e.side===ir,a),l===null)return null;oa.copy(a),oa.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(oa);return c<t.near||c>t.far?null:{distance:c,point:oa.clone(),object:r}}function aa(r,e,t,n,i,s,o,a,l,c){r.getVertexPosition(a,is),r.getVertexPosition(l,rs),r.getVertexPosition(c,ss);const u=Ng(r,e,t,n,is,rs,ss,sa);if(u){i&&(na.fromBufferAttribute(i,a),ia.fromBufferAttribute(i,l),ra.fromBufferAttribute(i,c),u.uv=oi.getInterpolation(sa,is,rs,ss,na,ia,ra,new lt)),s&&(na.fromBufferAttribute(s,a),ia.fromBufferAttribute(s,l),ra.fromBufferAttribute(s,c),u.uv1=oi.getInterpolation(sa,is,rs,ss,na,ia,ra,new lt)),o&&(kh.fromBufferAttribute(o,a),Hh.fromBufferAttribute(o,l),Vh.fromBufferAttribute(o,c),u.normal=oi.getInterpolation(sa,is,rs,ss,kh,Hh,Vh,new q),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new q,materialIndex:0};oi.getNormal(is,rs,ss,d.normal),u.face=d}return u}class Ro extends ar{constructor(e=1,t=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};const a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],d=[];let h=0,f=0;g("z","y","x",-1,-1,n,t,e,o,s,0),g("z","y","x",1,-1,n,t,-e,o,s,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new Or(c,3)),this.setAttribute("normal",new Or(u,3)),this.setAttribute("uv",new Or(d,2));function g(_,p,m,E,x,M,w,A,T,C,S){const v=M/T,L=w/C,N=M/2,B=w/2,W=A/2,Y=T+1,G=C+1;let V=0,H=0;const ae=new q;for(let P=0;P<G;P++){const ue=P*L-B;for(let Ne=0;Ne<Y;Ne++){const Ye=Ne*v-N;ae[_]=Ye*E,ae[p]=ue*x,ae[m]=W,c.push(ae.x,ae.y,ae.z),ae[_]=0,ae[p]=0,ae[m]=A>0?1:-1,u.push(ae.x,ae.y,ae.z),d.push(Ne/T),d.push(1-P/C),V+=1}}for(let P=0;P<C;P++)for(let ue=0;ue<T;ue++){const Ne=h+ue+Y*P,Ye=h+ue+Y*(P+1),$=h+(ue+1)+Y*(P+1),ee=h+(ue+1)+Y*P;l.push(Ne,Ye,ee),l.push(Ye,$,ee),H+=6}a.addGroup(f,H,S),f+=H,h+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ro(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Os(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function ln(r){const e={};for(let t=0;t<r.length;t++){const n=Os(r[t]);for(const i in n)e[i]=n[i]}return e}function Og(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function rp(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ht.workingColorSpace}const Fg={clone:Os,merge:ln};var Bg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Pi extends Ka{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Bg,this.fragmentShader=zg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Os(e.uniforms),this.uniformsGroups=Og(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class sp extends Nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ht,this.projectionMatrix=new Ht,this.projectionMatrixInverse=new Ht,this.coordinateSystem=bi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Bi=new q,Gh=new lt,Wh=new lt;class jn extends sp{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ac*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ml*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ac*2*Math.atan(Math.tan(Ml*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z),Bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z)}getViewSize(e,t){return this.getViewBounds(e,Gh,Wh),t.subVectors(Wh,Gh)}setViewOffset(e,t,n,i,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ml*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const os=-90,as=1;class kg extends Nn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new jn(os,as,e,t);i.layers=this.layers,this.add(i);const s=new jn(os,as,e,t);s.layers=this.layers,this.add(s);const o=new jn(os,as,e,t);o.layers=this.layers,this.add(o);const a=new jn(os,as,e,t);a.layers=this.layers,this.add(a);const l=new jn(os,as,e,t);l.layers=this.layers,this.add(l);const c=new jn(os,as,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===bi)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ka)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class op extends yn{constructor(e,t,n,i,s,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Ls,super(e,t,n,i,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Hg extends kr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new op(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Jn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ro(5,5,5),s=new Pi({name:"CubemapFromEquirect",uniforms:Os(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Mn,blending:ji});s.uniforms.tEquirect.value=t;const o=new ui(i,s),a=t.minFilter;return t.minFilter===Rr&&(t.minFilter=Jn),new kg(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(s)}}const kl=new q,Vg=new q,Gg=new Ke;class Mr{constructor(e=new q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=kl.subVectors(n,t).cross(Vg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(kl),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Gg.getNormalMatrix(e),i=this.coplanarPoint(kl).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const pr=new ru,la=new q;class ap{constructor(e=new Mr,t=new Mr,n=new Mr,i=new Mr,s=new Mr,o=new Mr){this.planes=[e,t,n,i,s,o]}set(e,t,n,i,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=bi){const n=this.planes,i=e.elements,s=i[0],o=i[1],a=i[2],l=i[3],c=i[4],u=i[5],d=i[6],h=i[7],f=i[8],g=i[9],_=i[10],p=i[11],m=i[12],E=i[13],x=i[14],M=i[15];if(n[0].setComponents(l-s,h-c,p-f,M-m).normalize(),n[1].setComponents(l+s,h+c,p+f,M+m).normalize(),n[2].setComponents(l+o,h+u,p+g,M+E).normalize(),n[3].setComponents(l-o,h-u,p-g,M-E).normalize(),n[4].setComponents(l-a,h-d,p-_,M-x).normalize(),t===bi)n[5].setComponents(l+a,h+d,p+_,M+x).normalize();else if(t===ka)n[5].setComponents(a,d,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),pr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),pr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(pr)}intersectsSprite(e){return pr.center.set(0,0,0),pr.radius=.7071067811865476,pr.applyMatrix4(e.matrixWorld),this.intersectsSphere(pr)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(la.x=i.normal.x>0?e.max.x:e.min.x,la.y=i.normal.y>0?e.max.y:e.min.y,la.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(la)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function lp(){let r=null,e=!1,t=null,n=null;function i(s,o){t(s,o),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Wg(r){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,d=c.byteLength,h=r.createBuffer();r.bindBuffer(l,h),r.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=r.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=r.SHORT;else if(c instanceof Uint32Array)f=r.UNSIGNED_INT;else if(c instanceof Int32Array)f=r.INT;else if(c instanceof Int8Array)f=r.BYTE;else if(c instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const u=l.array,d=l._updateRange,h=l.updateRanges;if(r.bindBuffer(c,a),d.count===-1&&h.length===0&&r.bufferSubData(c,0,u),h.length!==0){for(let f=0,g=h.length;f<g;f++){const _=h[f];r.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}d.count!==-1&&(r.bufferSubData(c,d.offset*u.BYTES_PER_ELEMENT,u,d.offset,d.count),d.count=-1),l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(r.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:s,update:o}}class Za extends ar{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,u=l+1,d=e/a,h=t/l,f=[],g=[],_=[],p=[];for(let m=0;m<u;m++){const E=m*h-o;for(let x=0;x<c;x++){const M=x*d-s;g.push(M,-E,0),_.push(0,0,1),p.push(x/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let E=0;E<a;E++){const x=E+c*m,M=E+c*(m+1),w=E+1+c*(m+1),A=E+1+c*m;f.push(x,M,A),f.push(M,w,A)}this.setIndex(f),this.setAttribute("position",new Or(g,3)),this.setAttribute("normal",new Or(_,3)),this.setAttribute("uv",new Or(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Za(e.width,e.height,e.widthSegments,e.heightSegments)}}var Xg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Yg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$g=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Jg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Qg=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,e0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,t0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,n0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,i0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,r0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,s0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,o0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,a0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,l0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,c0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,u0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,h0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,f0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,d0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( batchId );
	vColor.xyz *= batchingColor.xyz;
#endif`,p0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,m0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,_0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,g0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,v0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,x0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,S0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,M0="gl_FragColor = linearToOutputTexel( gl_FragColor );",y0=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,E0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,T0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,b0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,A0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,w0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,R0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,C0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,P0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,L0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,D0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,U0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,I0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,N0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,O0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,F0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,B0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,z0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,k0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,H0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,V0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,G0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,W0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,X0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Y0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,q0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,K0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Z0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,j0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,J0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Q0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ev=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,iv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ov=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,av=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,cv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,uv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,pv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_v=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,gv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Sv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Mv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,yv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ev=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Tv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Av=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`,wv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Rv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Cv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Pv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Lv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Dv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Uv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Iv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Nv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ov=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Fv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,zv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,kv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Gv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Wv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Xv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$v=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,jv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Jv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Qv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ex=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ix=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,sx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ox=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ax=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lx=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,cx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ux=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,hx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,fx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,px=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,mx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_x=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,xx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Mx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,yx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ex=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$e={alphahash_fragment:Xg,alphahash_pars_fragment:Yg,alphamap_fragment:qg,alphamap_pars_fragment:$g,alphatest_fragment:Kg,alphatest_pars_fragment:Zg,aomap_fragment:jg,aomap_pars_fragment:Jg,batching_pars_vertex:Qg,batching_vertex:e0,begin_vertex:t0,beginnormal_vertex:n0,bsdfs:i0,iridescence_fragment:r0,bumpmap_pars_fragment:s0,clipping_planes_fragment:o0,clipping_planes_pars_fragment:a0,clipping_planes_pars_vertex:l0,clipping_planes_vertex:c0,color_fragment:u0,color_pars_fragment:h0,color_pars_vertex:f0,color_vertex:d0,common:p0,cube_uv_reflection_fragment:m0,defaultnormal_vertex:_0,displacementmap_pars_vertex:g0,displacementmap_vertex:v0,emissivemap_fragment:x0,emissivemap_pars_fragment:S0,colorspace_fragment:M0,colorspace_pars_fragment:y0,envmap_fragment:E0,envmap_common_pars_fragment:T0,envmap_pars_fragment:b0,envmap_pars_vertex:A0,envmap_physical_pars_fragment:F0,envmap_vertex:w0,fog_vertex:R0,fog_pars_vertex:C0,fog_fragment:P0,fog_pars_fragment:L0,gradientmap_pars_fragment:D0,lightmap_pars_fragment:U0,lights_lambert_fragment:I0,lights_lambert_pars_fragment:N0,lights_pars_begin:O0,lights_toon_fragment:B0,lights_toon_pars_fragment:z0,lights_phong_fragment:k0,lights_phong_pars_fragment:H0,lights_physical_fragment:V0,lights_physical_pars_fragment:G0,lights_fragment_begin:W0,lights_fragment_maps:X0,lights_fragment_end:Y0,logdepthbuf_fragment:q0,logdepthbuf_pars_fragment:$0,logdepthbuf_pars_vertex:K0,logdepthbuf_vertex:Z0,map_fragment:j0,map_pars_fragment:J0,map_particle_fragment:Q0,map_particle_pars_fragment:ev,metalnessmap_fragment:tv,metalnessmap_pars_fragment:nv,morphinstance_vertex:iv,morphcolor_vertex:rv,morphnormal_vertex:sv,morphtarget_pars_vertex:ov,morphtarget_vertex:av,normal_fragment_begin:lv,normal_fragment_maps:cv,normal_pars_fragment:uv,normal_pars_vertex:hv,normal_vertex:fv,normalmap_pars_fragment:dv,clearcoat_normal_fragment_begin:pv,clearcoat_normal_fragment_maps:mv,clearcoat_pars_fragment:_v,iridescence_pars_fragment:gv,opaque_fragment:vv,packing:xv,premultiplied_alpha_fragment:Sv,project_vertex:Mv,dithering_fragment:yv,dithering_pars_fragment:Ev,roughnessmap_fragment:Tv,roughnessmap_pars_fragment:bv,shadowmap_pars_fragment:Av,shadowmap_pars_vertex:wv,shadowmap_vertex:Rv,shadowmask_pars_fragment:Cv,skinbase_vertex:Pv,skinning_pars_vertex:Lv,skinning_vertex:Dv,skinnormal_vertex:Uv,specularmap_fragment:Iv,specularmap_pars_fragment:Nv,tonemapping_fragment:Ov,tonemapping_pars_fragment:Fv,transmission_fragment:Bv,transmission_pars_fragment:zv,uv_pars_fragment:kv,uv_pars_vertex:Hv,uv_vertex:Vv,worldpos_vertex:Gv,background_vert:Wv,background_frag:Xv,backgroundCube_vert:Yv,backgroundCube_frag:qv,cube_vert:$v,cube_frag:Kv,depth_vert:Zv,depth_frag:jv,distanceRGBA_vert:Jv,distanceRGBA_frag:Qv,equirect_vert:ex,equirect_frag:tx,linedashed_vert:nx,linedashed_frag:ix,meshbasic_vert:rx,meshbasic_frag:sx,meshlambert_vert:ox,meshlambert_frag:ax,meshmatcap_vert:lx,meshmatcap_frag:cx,meshnormal_vert:ux,meshnormal_frag:hx,meshphong_vert:fx,meshphong_frag:dx,meshphysical_vert:px,meshphysical_frag:mx,meshtoon_vert:_x,meshtoon_frag:gx,points_vert:vx,points_frag:xx,shadow_vert:Sx,shadow_frag:Mx,sprite_vert:yx,sprite_frag:Ex},pe={common:{diffuse:{value:new ft(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ft(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ft(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new ft(16777215)},opacity:{value:1},center:{value:new lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},ii={basic:{uniforms:ln([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:ln([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ft(0)}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:ln([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ft(0)},specular:{value:new ft(1118481)},shininess:{value:30}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:ln([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new ft(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:ln([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new ft(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:ln([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:ln([pe.points,pe.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:ln([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:ln([pe.common,pe.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:ln([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:ln([pe.sprite,pe.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distanceRGBA:{uniforms:ln([pe.common,pe.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distanceRGBA_vert,fragmentShader:$e.distanceRGBA_frag},shadow:{uniforms:ln([pe.lights,pe.fog,{color:{value:new ft(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};ii.physical={uniforms:ln([ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new ft(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new ft(0)},specularColor:{value:new ft(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const ca={r:0,b:0,g:0},mr=new Ci,Tx=new Ht;function bx(r,e,t,n,i,s,o){const a=new ft(0);let l=s===!0?0:1,c,u,d=null,h=0,f=null;function g(E){let x=E.isScene===!0?E.background:null;return x&&x.isTexture&&(x=(E.backgroundBlurriness>0?t:e).get(x)),x}function _(E){let x=!1;const M=g(E);M===null?m(a,l):M&&M.isColor&&(m(M,1),x=!0);const w=r.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(r.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function p(E,x){const M=g(x);M&&(M.isCubeTexture||M.mapping===Ya)?(u===void 0&&(u=new ui(new Ro(1,1,1),new Pi({name:"BackgroundCubeMaterial",uniforms:Os(ii.backgroundCube.uniforms),vertexShader:ii.backgroundCube.vertexShader,fragmentShader:ii.backgroundCube.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),mr.copy(x.backgroundRotation),mr.x*=-1,mr.y*=-1,mr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(mr.y*=-1,mr.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Tx.makeRotationFromEuler(mr)),u.material.toneMapped=ht.getTransfer(M.colorSpace)!==Mt,(d!==M||h!==M.version||f!==r.toneMapping)&&(u.material.needsUpdate=!0,d=M,h=M.version,f=r.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new ui(new Za(2,2),new Pi({name:"BackgroundMaterial",uniforms:Os(ii.background.uniforms),vertexShader:ii.background.vertexShader,fragmentShader:ii.background.fragmentShader,side:ir,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=ht.getTransfer(M.colorSpace)!==Mt,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(d!==M||h!==M.version||f!==r.toneMapping)&&(c.material.needsUpdate=!0,d=M,h=M.version,f=r.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function m(E,x){E.getRGB(ca,rp(r)),n.buffers.color.setClear(ca.r,ca.g,ca.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(E,x=1){a.set(E),l=x,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,m(a,l)},render:_,addToRenderList:p}}function Ax(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=h(null);let s=i,o=!1;function a(v,L,N,B,W){let Y=!1;const G=d(B,N,L);s!==G&&(s=G,c(s.object)),Y=f(v,B,N,W),Y&&g(v,B,N,W),W!==null&&e.update(W,r.ELEMENT_ARRAY_BUFFER),(Y||o)&&(o=!1,M(v,L,N,B),W!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return r.createVertexArray()}function c(v){return r.bindVertexArray(v)}function u(v){return r.deleteVertexArray(v)}function d(v,L,N){const B=N.wireframe===!0;let W=n[v.id];W===void 0&&(W={},n[v.id]=W);let Y=W[L.id];Y===void 0&&(Y={},W[L.id]=Y);let G=Y[B];return G===void 0&&(G=h(l()),Y[B]=G),G}function h(v){const L=[],N=[],B=[];for(let W=0;W<t;W++)L[W]=0,N[W]=0,B[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:N,attributeDivisors:B,object:v,attributes:{},index:null}}function f(v,L,N,B){const W=s.attributes,Y=L.attributes;let G=0;const V=N.getAttributes();for(const H in V)if(V[H].location>=0){const P=W[H];let ue=Y[H];if(ue===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&(ue=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&(ue=v.instanceColor)),P===void 0||P.attribute!==ue||ue&&P.data!==ue.data)return!0;G++}return s.attributesNum!==G||s.index!==B}function g(v,L,N,B){const W={},Y=L.attributes;let G=0;const V=N.getAttributes();for(const H in V)if(V[H].location>=0){let P=Y[H];P===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&(P=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&(P=v.instanceColor));const ue={};ue.attribute=P,P&&P.data&&(ue.data=P.data),W[H]=ue,G++}s.attributes=W,s.attributesNum=G,s.index=B}function _(){const v=s.newAttributes;for(let L=0,N=v.length;L<N;L++)v[L]=0}function p(v){m(v,0)}function m(v,L){const N=s.newAttributes,B=s.enabledAttributes,W=s.attributeDivisors;N[v]=1,B[v]===0&&(r.enableVertexAttribArray(v),B[v]=1),W[v]!==L&&(r.vertexAttribDivisor(v,L),W[v]=L)}function E(){const v=s.newAttributes,L=s.enabledAttributes;for(let N=0,B=L.length;N<B;N++)L[N]!==v[N]&&(r.disableVertexAttribArray(N),L[N]=0)}function x(v,L,N,B,W,Y,G){G===!0?r.vertexAttribIPointer(v,L,N,W,Y):r.vertexAttribPointer(v,L,N,B,W,Y)}function M(v,L,N,B){_();const W=B.attributes,Y=N.getAttributes(),G=L.defaultAttributeValues;for(const V in Y){const H=Y[V];if(H.location>=0){let ae=W[V];if(ae===void 0&&(V==="instanceMatrix"&&v.instanceMatrix&&(ae=v.instanceMatrix),V==="instanceColor"&&v.instanceColor&&(ae=v.instanceColor)),ae!==void 0){const P=ae.normalized,ue=ae.itemSize,Ne=e.get(ae);if(Ne===void 0)continue;const Ye=Ne.buffer,$=Ne.type,ee=Ne.bytesPerElement,fe=$===r.INT||$===r.UNSIGNED_INT||ae.gpuType===Vd;if(ae.isInterleavedBufferAttribute){const oe=ae.data,De=oe.stride,Ce=ae.offset;if(oe.isInstancedInterleavedBuffer){for(let We=0;We<H.locationSize;We++)m(H.location+We,oe.meshPerAttribute);v.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let We=0;We<H.locationSize;We++)p(H.location+We);r.bindBuffer(r.ARRAY_BUFFER,Ye);for(let We=0;We<H.locationSize;We++)x(H.location+We,ue/H.locationSize,$,P,De*ee,(Ce+ue/H.locationSize*We)*ee,fe)}else{if(ae.isInstancedBufferAttribute){for(let oe=0;oe<H.locationSize;oe++)m(H.location+oe,ae.meshPerAttribute);v.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let oe=0;oe<H.locationSize;oe++)p(H.location+oe);r.bindBuffer(r.ARRAY_BUFFER,Ye);for(let oe=0;oe<H.locationSize;oe++)x(H.location+oe,ue/H.locationSize,$,P,ue*ee,ue/H.locationSize*oe*ee,fe)}}else if(G!==void 0){const P=G[V];if(P!==void 0)switch(P.length){case 2:r.vertexAttrib2fv(H.location,P);break;case 3:r.vertexAttrib3fv(H.location,P);break;case 4:r.vertexAttrib4fv(H.location,P);break;default:r.vertexAttrib1fv(H.location,P)}}}}E()}function w(){C();for(const v in n){const L=n[v];for(const N in L){const B=L[N];for(const W in B)u(B[W].object),delete B[W];delete L[N]}delete n[v]}}function A(v){if(n[v.id]===void 0)return;const L=n[v.id];for(const N in L){const B=L[N];for(const W in B)u(B[W].object),delete B[W];delete L[N]}delete n[v.id]}function T(v){for(const L in n){const N=n[L];if(N[v.id]===void 0)continue;const B=N[v.id];for(const W in B)u(B[W].object),delete B[W];delete N[v.id]}}function C(){S(),o=!0,s!==i&&(s=i,c(s.object))}function S(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:C,resetDefaultState:S,dispose:w,releaseStatesOfGeometry:A,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:p,disableUnusedAttributes:E}}function wx(r,e,t){let n;function i(c){n=c}function s(c,u){r.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,d){d!==0&&(r.drawArraysInstanced(n,c,u,d),t.update(u,n,d))}function a(c,u,d){if(d===0)return;const h=e.get("WEBGL_multi_draw");if(h===null)for(let f=0;f<d;f++)this.render(c[f],u[f]);else{h.multiDrawArraysWEBGL(n,c,0,u,0,d);let f=0;for(let g=0;g<d;g++)f+=u[g];t.update(f,n,1)}}function l(c,u,d,h){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],u[g],h[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,h,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];for(let _=0;_<h.length;_++)t.update(g,n,h[_])}}this.setMode=i,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Rx(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(A){return!(A!==ci&&n.convert(A)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const T=A===qa&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==rr&&n.convert(A)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==qi&&!T)}function l(A){if(A==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,h=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),f=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_TEXTURE_SIZE),_=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),m=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),E=r.getParameter(r.MAX_VARYING_VECTORS),x=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),M=f>0,w=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,maxTextures:h,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:_,maxAttributes:p,maxVertexUniforms:m,maxVaryings:E,maxFragmentUniforms:x,vertexTextures:M,maxSamples:w}}function Cx(r){const e=this;let t=null,n=0,i=!1,s=!1;const o=new Mr,a=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const f=d.length!==0||h||n!==0||i;return i=h,n=d.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){const g=d.clippingPlanes,_=d.clipIntersection,p=d.clipShadows,m=r.get(d);if(!i||g===null||g.length===0||s&&!p)s?u(null):c();else{const E=s?0:n,x=E*4;let M=m.clippingState||null;l.value=M,M=u(g,h,x,f);for(let w=0;w!==x;++w)M[w]=t[w];m.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,f,g){const _=d!==null?d.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const m=f+_*4,E=h.matrixWorldInverse;a.getNormalMatrix(E),(p===null||p.length<m)&&(p=new Float32Array(m));for(let x=0,M=f;x!==_;++x,M+=4)o.copy(d[x]).applyMatrix4(E,a),o.normal.toArray(p,M),p[M+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function Px(r){let e=new WeakMap;function t(o,a){return a===yc?o.mapping=Ls:a===Ec&&(o.mapping=Ds),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===yc||a===Ec)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Hg(l.height);return c.fromEquirectangularTexture(r,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class cp extends sp{constructor(e=-1,t=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ps=4,Xh=[.125,.215,.35,.446,.526,.582],Tr=20,Hl=new cp,Yh=new ft;let Vl=null,Gl=0,Wl=0,Xl=!1;const yr=(1+Math.sqrt(5))/2,ls=1/yr,qh=[new q(-yr,ls,0),new q(yr,ls,0),new q(-ls,0,yr),new q(ls,0,yr),new q(0,yr,-ls),new q(0,yr,ls),new q(-1,1,-1),new q(1,1,-1),new q(-1,1,1),new q(1,1,1)];class $h{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Vl=this._renderer.getRenderTarget(),Gl=this._renderer.getActiveCubeFace(),Wl=this._renderer.getActiveMipmapLevel(),Xl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,i,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Vl,Gl,Wl),this._renderer.xr.enabled=Xl,e.scissorTest=!1,ua(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ls||e.mapping===Ds?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Vl=this._renderer.getRenderTarget(),Gl=this._renderer.getActiveCubeFace(),Wl=this._renderer.getActiveMipmapLevel(),Xl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Jn,minFilter:Jn,generateMipmaps:!1,type:qa,format:ci,colorSpace:or,depthBuffer:!1},i=Kh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Kh(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Lx(s)),this._blurMaterial=Dx(s,e,t)}return i}_compileMaterial(e){const t=new ui(this._lodPlanes[0],e);this._renderer.compile(t,Hl)}_sceneToCubeUV(e,t,n,i){const a=new jn(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,h=u.toneMapping;u.getClearColor(Yh),u.toneMapping=Ji,u.autoClear=!1;const f=new tp({name:"PMREM.Background",side:Mn,depthWrite:!1,depthTest:!1}),g=new ui(new Ro,f);let _=!1;const p=e.background;p?p.isColor&&(f.color.copy(p),e.background=null,_=!0):(f.color.copy(Yh),_=!0);for(let m=0;m<6;m++){const E=m%3;E===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):E===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));const x=this._cubeSize;ua(i,E*x,m>2?x:0,x,x),u.setRenderTarget(i),_&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=h,u.autoClear=d,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Ls||e.mapping===Ds;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=jh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zh());const s=i?this._cubemapMaterial:this._equirectMaterial,o=new ui(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;ua(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Hl)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=qh[(i-s-1)%qh.length];this._blur(e,s-1,s,o,a)}t.autoClear=n}_blur(e,t,n,i,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",s),this._halfBlur(o,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new ui(this._lodPlanes[i],c),h=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Tr-1),_=s/g,p=isFinite(s)?1+Math.floor(u*_):Tr;p>Tr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Tr}`);const m=[];let E=0;for(let T=0;T<Tr;++T){const C=T/_,S=Math.exp(-C*C/2);m.push(S),T===0?E+=S:T<p&&(E+=2*S)}for(let T=0;T<m.length;T++)m[T]=m[T]/E;h.envMap.value=e.texture,h.samples.value=p,h.weights.value=m,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:x}=this;h.dTheta.value=g,h.mipInt.value=x-n;const M=this._sizeLods[i],w=3*M*(i>x-ps?i-x+ps:0),A=4*(this._cubeSize-M);ua(t,w,A,3*M,2*M),l.setRenderTarget(t),l.render(d,Hl)}}function Lx(r){const e=[],t=[],n=[];let i=r;const s=r-ps+1+Xh.length;for(let o=0;o<s;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>r-ps?l=Xh[o-r+ps-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,d=1+c,h=[u,u,d,u,d,d,u,u,d,d,u,d],f=6,g=6,_=3,p=2,m=1,E=new Float32Array(_*g*f),x=new Float32Array(p*g*f),M=new Float32Array(m*g*f);for(let A=0;A<f;A++){const T=A%3*2/3-1,C=A>2?0:-1,S=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];E.set(S,_*g*A),x.set(h,p*g*A);const v=[A,A,A,A,A,A];M.set(v,m*g*A)}const w=new ar;w.setAttribute("position",new Qn(E,_)),w.setAttribute("uv",new Qn(x,p)),w.setAttribute("faceIndex",new Qn(M,m)),e.push(w),i>ps&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Kh(r,e,t){const n=new kr(r,e,t);return n.texture.mapping=Ya,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ua(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function Dx(r,e,t){const n=new Float32Array(Tr),i=new q(0,1,0);return new Pi({name:"SphericalGaussianBlur",defines:{n:Tr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:su(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ji,depthTest:!1,depthWrite:!1})}function Zh(){return new Pi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:su(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ji,depthTest:!1,depthWrite:!1})}function jh(){return new Pi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:su(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ji,depthTest:!1,depthWrite:!1})}function su(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ux(r){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===yc||l===Ec,u=l===Ls||l===Ds;if(c||u){let d=e.get(a);const h=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return t===null&&(t=new $h(r)),d=c?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const f=a.image;return c&&f&&f.height>0||u&&f&&i(f)?(t===null&&(t=new $h(r)),d=c?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",s),d.texture):null}}}return a}function i(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Ix(r){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Zd("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Nx(r,e,t,n){const i={},s=new WeakMap;function o(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let p=0,m=_.length;p<m;p++)e.remove(_[p])}h.removeEventListener("dispose",o),delete i[h.id];const f=s.get(h);f&&(e.remove(f),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return i[h.id]===!0||(h.addEventListener("dispose",o),i[h.id]=!0,t.memory.geometries++),h}function l(d){const h=d.attributes;for(const g in h)e.update(h[g],r.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const _=f[g];for(let p=0,m=_.length;p<m;p++)e.update(_[p],r.ARRAY_BUFFER)}}function c(d){const h=[],f=d.index,g=d.attributes.position;let _=0;if(f!==null){const E=f.array;_=f.version;for(let x=0,M=E.length;x<M;x+=3){const w=E[x+0],A=E[x+1],T=E[x+2];h.push(w,A,A,T,T,w)}}else if(g!==void 0){const E=g.array;_=g.version;for(let x=0,M=E.length/3-1;x<M;x+=3){const w=x+0,A=x+1,T=x+2;h.push(w,A,A,T,T,w)}}else return;const p=new(Kd(h)?ip:np)(h,1);p.version=_;const m=s.get(d);m&&e.remove(m),s.set(d,p)}function u(d){const h=s.get(d);if(h){const f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return s.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function Ox(r,e,t){let n;function i(h){n=h}let s,o;function a(h){s=h.type,o=h.bytesPerElement}function l(h,f){r.drawElements(n,f,s,h*o),t.update(f,n,1)}function c(h,f,g){g!==0&&(r.drawElementsInstanced(n,f,s,h*o,g),t.update(f,n,g))}function u(h,f,g){if(g===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let p=0;p<g;p++)this.render(h[p]/o,f[p]);else{_.multiDrawElementsWEBGL(n,f,0,s,h,0,g);let p=0;for(let m=0;m<g;m++)p+=f[m];t.update(p,n,1)}}function d(h,f,g,_){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<h.length;m++)c(h[m]/o,f[m],_[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,s,h,0,_,0,g);let m=0;for(let E=0;E<g;E++)m+=f[E];for(let E=0;E<_.length;E++)t.update(m,n,_[E])}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Fx(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(t.calls++,o){case r.TRIANGLES:t.triangles+=a*(s/3);break;case r.LINES:t.lines+=a*(s/2);break;case r.LINE_STRIP:t.lines+=a*(s-1);break;case r.LINE_LOOP:t.lines+=a*s;break;case r.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Bx(r,e,t){const n=new WeakMap,i=new Zt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let h=n.get(a);if(h===void 0||h.count!==d){let v=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",v)};var f=v;h!==void 0&&h.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],E=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),p===!0&&(M=3);let w=a.attributes.position.count*M,A=1;w>e.maxTextureSize&&(A=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const T=new Float32Array(w*A*4*d),C=new Jd(T,w,A,d);C.type=qi,C.needsUpdate=!0;const S=M*4;for(let L=0;L<d;L++){const N=m[L],B=E[L],W=x[L],Y=w*A*4*L;for(let G=0;G<N.count;G++){const V=G*S;g===!0&&(i.fromBufferAttribute(N,G),T[Y+V+0]=i.x,T[Y+V+1]=i.y,T[Y+V+2]=i.z,T[Y+V+3]=0),_===!0&&(i.fromBufferAttribute(B,G),T[Y+V+4]=i.x,T[Y+V+5]=i.y,T[Y+V+6]=i.z,T[Y+V+7]=0),p===!0&&(i.fromBufferAttribute(W,G),T[Y+V+8]=i.x,T[Y+V+9]=i.y,T[Y+V+10]=i.z,T[Y+V+11]=W.itemSize===4?i.w:1)}}h={count:d,texture:C,size:new lt(w,A)},n.set(a,h),a.addEventListener("dispose",v)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",o.morphTexture,t);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const _=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(r,"morphTargetBaseInfluence",_),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",h.size)}return{update:s}}function zx(r,e,t,n){let i=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,d=e.get(l,u);if(i.get(d)!==c&&(e.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,r.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;i.get(h)!==c&&(h.update(),i.set(h,c))}return d}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}class up extends yn{constructor(e,t,n,i,s,o,a,l,c,u=Es){if(u!==Es&&u!==Ns)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Es&&(n=Us),n===void 0&&u===Ns&&(n=Is),super(null,i,s,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Xn,this.minFilter=l!==void 0?l:Xn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const hp=new yn,fp=new up(1,1);fp.compareFunction=$d;const dp=new Jd,pp=new Tg,mp=new op,Jh=[],Qh=[],ef=new Float32Array(16),tf=new Float32Array(9),nf=new Float32Array(4);function Bs(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=Jh[i];if(s===void 0&&(s=new Float32Array(i),Jh[i]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,r[o].toArray(s,a)}return s}function Vt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Gt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function ja(r,e){let t=Qh[e];t===void 0&&(t=new Int32Array(e),Qh[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function kx(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Hx(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;r.uniform2fv(this.addr,e),Gt(t,e)}}function Vx(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Vt(t,e))return;r.uniform3fv(this.addr,e),Gt(t,e)}}function Gx(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;r.uniform4fv(this.addr,e),Gt(t,e)}}function Wx(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Gt(t,e)}else{if(Vt(t,n))return;nf.set(n),r.uniformMatrix2fv(this.addr,!1,nf),Gt(t,n)}}function Xx(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Gt(t,e)}else{if(Vt(t,n))return;tf.set(n),r.uniformMatrix3fv(this.addr,!1,tf),Gt(t,n)}}function Yx(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Gt(t,e)}else{if(Vt(t,n))return;ef.set(n),r.uniformMatrix4fv(this.addr,!1,ef),Gt(t,n)}}function qx(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function $x(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;r.uniform2iv(this.addr,e),Gt(t,e)}}function Kx(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;r.uniform3iv(this.addr,e),Gt(t,e)}}function Zx(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;r.uniform4iv(this.addr,e),Gt(t,e)}}function jx(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Jx(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;r.uniform2uiv(this.addr,e),Gt(t,e)}}function Qx(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;r.uniform3uiv(this.addr,e),Gt(t,e)}}function eS(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;r.uniform4uiv(this.addr,e),Gt(t,e)}}function tS(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);const s=this.type===r.SAMPLER_2D_SHADOW?fp:hp;t.setTexture2D(e||s,i)}function nS(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||pp,i)}function iS(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||mp,i)}function rS(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||dp,i)}function sS(r){switch(r){case 5126:return kx;case 35664:return Hx;case 35665:return Vx;case 35666:return Gx;case 35674:return Wx;case 35675:return Xx;case 35676:return Yx;case 5124:case 35670:return qx;case 35667:case 35671:return $x;case 35668:case 35672:return Kx;case 35669:case 35673:return Zx;case 5125:return jx;case 36294:return Jx;case 36295:return Qx;case 36296:return eS;case 35678:case 36198:case 36298:case 36306:case 35682:return tS;case 35679:case 36299:case 36307:return nS;case 35680:case 36300:case 36308:case 36293:return iS;case 36289:case 36303:case 36311:case 36292:return rS}}function oS(r,e){r.uniform1fv(this.addr,e)}function aS(r,e){const t=Bs(e,this.size,2);r.uniform2fv(this.addr,t)}function lS(r,e){const t=Bs(e,this.size,3);r.uniform3fv(this.addr,t)}function cS(r,e){const t=Bs(e,this.size,4);r.uniform4fv(this.addr,t)}function uS(r,e){const t=Bs(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function hS(r,e){const t=Bs(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function fS(r,e){const t=Bs(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function dS(r,e){r.uniform1iv(this.addr,e)}function pS(r,e){r.uniform2iv(this.addr,e)}function mS(r,e){r.uniform3iv(this.addr,e)}function _S(r,e){r.uniform4iv(this.addr,e)}function gS(r,e){r.uniform1uiv(this.addr,e)}function vS(r,e){r.uniform2uiv(this.addr,e)}function xS(r,e){r.uniform3uiv(this.addr,e)}function SS(r,e){r.uniform4uiv(this.addr,e)}function MS(r,e,t){const n=this.cache,i=e.length,s=ja(t,i);Vt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||hp,s[o])}function yS(r,e,t){const n=this.cache,i=e.length,s=ja(t,i);Vt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||pp,s[o])}function ES(r,e,t){const n=this.cache,i=e.length,s=ja(t,i);Vt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||mp,s[o])}function TS(r,e,t){const n=this.cache,i=e.length,s=ja(t,i);Vt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||dp,s[o])}function bS(r){switch(r){case 5126:return oS;case 35664:return aS;case 35665:return lS;case 35666:return cS;case 35674:return uS;case 35675:return hS;case 35676:return fS;case 5124:case 35670:return dS;case 35667:case 35671:return pS;case 35668:case 35672:return mS;case 35669:case 35673:return _S;case 5125:return gS;case 36294:return vS;case 36295:return xS;case 36296:return SS;case 35678:case 36198:case 36298:case 36306:case 35682:return MS;case 35679:case 36299:case 36307:return yS;case 35680:case 36300:case 36308:case 36293:return ES;case 36289:case 36303:case 36311:case 36292:return TS}}class AS{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=sS(t.type)}}class wS{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=bS(t.type)}}class RS{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,o=i.length;s!==o;++s){const a=i[s];a.setValue(e,t[a.id],n)}}}const Yl=/(\w+)(\])?(\[|\.)?/g;function rf(r,e){r.seq.push(e),r.map[e.id]=e}function CS(r,e,t){const n=r.name,i=n.length;for(Yl.lastIndex=0;;){const s=Yl.exec(n),o=Yl.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){rf(t,c===void 0?new AS(a,r,e):new wS(a,r,e));break}else{let d=t.map[a];d===void 0&&(d=new RS(a),rf(t,d)),t=d}}}class Ea{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=e.getActiveUniform(t,i),o=e.getUniformLocation(t,s.name);CS(s,o,this)}}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function sf(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const PS=37297;let LS=0;function DS(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=i;o<s;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function US(r){const e=ht.getPrimaries(ht.workingColorSpace),t=ht.getPrimaries(r);let n;switch(e===t?n="":e===za&&t===Ba?n="LinearDisplayP3ToLinearSRGB":e===Ba&&t===za&&(n="LinearSRGBToLinearDisplayP3"),r){case or:case $a:return[n,"LinearTransferOETF"];case ni:case iu:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[n,"LinearTransferOETF"]}}function of(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),i=r.getShaderInfoLog(e).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+i+`

`+DS(r.getShaderSource(e),o)}else return i}function IS(r,e){const t=US(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function NS(r,e){let t;switch(e){case H_:t="Linear";break;case V_:t="Reinhard";break;case G_:t="OptimizedCineon";break;case W_:t="ACESFilmic";break;case Y_:t="AgX";break;case q_:t="Neutral";break;case X_:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function OS(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(eo).join(`
`)}function FS(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function BS(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),o=s.name;let a=1;s.type===r.FLOAT_MAT2&&(a=2),s.type===r.FLOAT_MAT3&&(a=3),s.type===r.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:r.getAttribLocation(e,o),locationSize:a}}return t}function eo(r){return r!==""}function af(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function lf(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const zS=/^[ \t]*#include +<([\w\d./]+)>/gm;function wc(r){return r.replace(zS,HS)}const kS=new Map;function HS(r,e){let t=$e[e];if(t===void 0){const n=kS.get(e);if(n!==void 0)t=$e[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return wc(t)}const VS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function cf(r){return r.replace(VS,GS)}function GS(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function uf(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function WS(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===zd?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===d_?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Si&&(e="SHADOWMAP_TYPE_VSM"),e}function XS(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Ls:case Ds:e="ENVMAP_TYPE_CUBE";break;case Ya:e="ENVMAP_TYPE_CUBE_UV";break}return e}function YS(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Ds:e="ENVMAP_MODE_REFRACTION";break}return e}function qS(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case kd:e="ENVMAP_BLENDING_MULTIPLY";break;case z_:e="ENVMAP_BLENDING_MIX";break;case k_:e="ENVMAP_BLENDING_ADD";break}return e}function $S(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function KS(r,e,t,n){const i=r.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=WS(t),c=XS(t),u=YS(t),d=qS(t),h=$S(t),f=OS(t),g=FS(s),_=i.createProgram();let p,m,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(eo).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(eo).join(`
`),m.length>0&&(m+=`
`)):(p=[uf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(eo).join(`
`),m=[uf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ji?"#define TONE_MAPPING":"",t.toneMapping!==Ji?$e.tonemapping_pars_fragment:"",t.toneMapping!==Ji?NS("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,IS("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(eo).join(`
`)),o=wc(o),o=af(o,t),o=lf(o,t),a=wc(a),a=af(a,t),a=lf(a,t),o=cf(o),a=cf(a),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===bh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===bh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const x=E+p+o,M=E+m+a,w=sf(i,i.VERTEX_SHADER,x),A=sf(i,i.FRAGMENT_SHADER,M);i.attachShader(_,w),i.attachShader(_,A),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function T(L){if(r.debug.checkShaderErrors){const N=i.getProgramInfoLog(_).trim(),B=i.getShaderInfoLog(w).trim(),W=i.getShaderInfoLog(A).trim();let Y=!0,G=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(Y=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,w,A);else{const V=of(i,w,"vertex"),H=of(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+N+`
`+V+`
`+H)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(B===""||W==="")&&(G=!1);G&&(L.diagnostics={runnable:Y,programLog:N,vertexShader:{log:B,prefix:p},fragmentShader:{log:W,prefix:m}})}i.deleteShader(w),i.deleteShader(A),C=new Ea(i,_),S=BS(i,_)}let C;this.getUniforms=function(){return C===void 0&&T(this),C};let S;this.getAttributes=function(){return S===void 0&&T(this),S};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=i.getProgramParameter(_,PS)),v},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=LS++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=A,this}let ZS=0;class jS{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new JS(e),t.set(e,n)),n}}class JS{constructor(e){this.id=ZS++,this.code=e,this.usedTimes=0}}function QS(r,e,t,n,i,s,o){const a=new Qd,l=new jS,c=new Set,u=[],d=i.logarithmicDepthBuffer,h=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function p(S,v,L,N,B){const W=N.fog,Y=B.geometry,G=S.isMeshStandardMaterial?N.environment:null,V=(S.isMeshStandardMaterial?t:e).get(S.envMap||G),H=V&&V.mapping===Ya?V.image.height:null,ae=g[S.type];S.precision!==null&&(f=i.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const P=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,ue=P!==void 0?P.length:0;let Ne=0;Y.morphAttributes.position!==void 0&&(Ne=1),Y.morphAttributes.normal!==void 0&&(Ne=2),Y.morphAttributes.color!==void 0&&(Ne=3);let Ye,$,ee,fe;if(ae){const it=ii[ae];Ye=it.vertexShader,$=it.fragmentShader}else Ye=S.vertexShader,$=S.fragmentShader,l.update(S),ee=l.getVertexShaderID(S),fe=l.getFragmentShaderID(S);const oe=r.getRenderTarget(),De=B.isInstancedMesh===!0,Ce=B.isBatchedMesh===!0,We=!!S.map,D=!!S.matcap,Oe=!!V,_e=!!S.aoMap,Ve=!!S.lightMap,Se=!!S.bumpMap,ze=!!S.normalMap,F=!!S.displacementMap,Le=!!S.emissiveMap,st=!!S.metalnessMap,R=!!S.roughnessMap,y=S.anisotropy>0,X=S.clearcoat>0,J=S.dispersion>0,te=S.iridescence>0,j=S.sheen>0,Te=S.transmission>0,ie=y&&!!S.anisotropyMap,ce=X&&!!S.clearcoatMap,Ie=X&&!!S.clearcoatNormalMap,re=X&&!!S.clearcoatRoughnessMap,ye=te&&!!S.iridescenceMap,we=te&&!!S.iridescenceThicknessMap,Fe=j&&!!S.sheenColorMap,he=j&&!!S.sheenRoughnessMap,ke=!!S.specularMap,Xe=!!S.specularColorMap,ot=!!S.specularIntensityMap,U=Te&&!!S.transmissionMap,Q=Te&&!!S.thicknessMap,K=!!S.gradientMap,Z=!!S.alphaMap,se=S.alphaTest>0,Re=!!S.alphaHash,Ze=!!S.extensions;let dt=Ji;S.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(dt=r.toneMapping);const pt={shaderID:ae,shaderType:S.type,shaderName:S.name,vertexShader:Ye,fragmentShader:$,defines:S.defines,customVertexShaderID:ee,customFragmentShaderID:fe,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Ce,batchingColor:Ce&&B._colorsTexture!==null,instancing:De,instancingColor:De&&B.instanceColor!==null,instancingMorph:De&&B.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:oe===null?r.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:or,alphaToCoverage:!!S.alphaToCoverage,map:We,matcap:D,envMap:Oe,envMapMode:Oe&&V.mapping,envMapCubeUVHeight:H,aoMap:_e,lightMap:Ve,bumpMap:Se,normalMap:ze,displacementMap:h&&F,emissiveMap:Le,normalMapObjectSpace:ze&&S.normalMapType===lg,normalMapTangentSpace:ze&&S.normalMapType===ag,metalnessMap:st,roughnessMap:R,anisotropy:y,anisotropyMap:ie,clearcoat:X,clearcoatMap:ce,clearcoatNormalMap:Ie,clearcoatRoughnessMap:re,dispersion:J,iridescence:te,iridescenceMap:ye,iridescenceThicknessMap:we,sheen:j,sheenColorMap:Fe,sheenRoughnessMap:he,specularMap:ke,specularColorMap:Xe,specularIntensityMap:ot,transmission:Te,transmissionMap:U,thicknessMap:Q,gradientMap:K,opaque:S.transparent===!1&&S.blending===ys&&S.alphaToCoverage===!1,alphaMap:Z,alphaTest:se,alphaHash:Re,combine:S.combine,mapUv:We&&_(S.map.channel),aoMapUv:_e&&_(S.aoMap.channel),lightMapUv:Ve&&_(S.lightMap.channel),bumpMapUv:Se&&_(S.bumpMap.channel),normalMapUv:ze&&_(S.normalMap.channel),displacementMapUv:F&&_(S.displacementMap.channel),emissiveMapUv:Le&&_(S.emissiveMap.channel),metalnessMapUv:st&&_(S.metalnessMap.channel),roughnessMapUv:R&&_(S.roughnessMap.channel),anisotropyMapUv:ie&&_(S.anisotropyMap.channel),clearcoatMapUv:ce&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:Ie&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:we&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Fe&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:he&&_(S.sheenRoughnessMap.channel),specularMapUv:ke&&_(S.specularMap.channel),specularColorMapUv:Xe&&_(S.specularColorMap.channel),specularIntensityMapUv:ot&&_(S.specularIntensityMap.channel),transmissionMapUv:U&&_(S.transmissionMap.channel),thicknessMapUv:Q&&_(S.thicknessMap.channel),alphaMapUv:Z&&_(S.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(ze||y),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!Y.attributes.uv&&(We||Z),fog:!!W,useFog:S.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:B.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:ue,morphTextureStride:Ne,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:r.shadowMap.enabled&&L.length>0,shadowMapType:r.shadowMap.type,toneMapping:dt,decodeVideoTexture:We&&S.map.isVideoTexture===!0&&ht.getTransfer(S.map.colorSpace)===Mt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===si,flipSided:S.side===Mn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ze&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:Ze&&S.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return pt.vertexUv1s=c.has(1),pt.vertexUv2s=c.has(2),pt.vertexUv3s=c.has(3),c.clear(),pt}function m(S){const v=[];if(S.shaderID?v.push(S.shaderID):(v.push(S.customVertexShaderID),v.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)v.push(L),v.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(E(v,S),x(v,S),v.push(r.outputColorSpace)),v.push(S.customProgramCacheKey),v.join()}function E(S,v){S.push(v.precision),S.push(v.outputColorSpace),S.push(v.envMapMode),S.push(v.envMapCubeUVHeight),S.push(v.mapUv),S.push(v.alphaMapUv),S.push(v.lightMapUv),S.push(v.aoMapUv),S.push(v.bumpMapUv),S.push(v.normalMapUv),S.push(v.displacementMapUv),S.push(v.emissiveMapUv),S.push(v.metalnessMapUv),S.push(v.roughnessMapUv),S.push(v.anisotropyMapUv),S.push(v.clearcoatMapUv),S.push(v.clearcoatNormalMapUv),S.push(v.clearcoatRoughnessMapUv),S.push(v.iridescenceMapUv),S.push(v.iridescenceThicknessMapUv),S.push(v.sheenColorMapUv),S.push(v.sheenRoughnessMapUv),S.push(v.specularMapUv),S.push(v.specularColorMapUv),S.push(v.specularIntensityMapUv),S.push(v.transmissionMapUv),S.push(v.thicknessMapUv),S.push(v.combine),S.push(v.fogExp2),S.push(v.sizeAttenuation),S.push(v.morphTargetsCount),S.push(v.morphAttributeCount),S.push(v.numDirLights),S.push(v.numPointLights),S.push(v.numSpotLights),S.push(v.numSpotLightMaps),S.push(v.numHemiLights),S.push(v.numRectAreaLights),S.push(v.numDirLightShadows),S.push(v.numPointLightShadows),S.push(v.numSpotLightShadows),S.push(v.numSpotLightShadowsWithMaps),S.push(v.numLightProbes),S.push(v.shadowMapType),S.push(v.toneMapping),S.push(v.numClippingPlanes),S.push(v.numClipIntersection),S.push(v.depthPacking)}function x(S,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.skinning&&a.enable(4),v.morphTargets&&a.enable(5),v.morphNormals&&a.enable(6),v.morphColors&&a.enable(7),v.premultipliedAlpha&&a.enable(8),v.shadowMapEnabled&&a.enable(9),v.doubleSided&&a.enable(10),v.flipSided&&a.enable(11),v.useDepthPacking&&a.enable(12),v.dithering&&a.enable(13),v.transmission&&a.enable(14),v.sheen&&a.enable(15),v.opaque&&a.enable(16),v.pointsUvs&&a.enable(17),v.decodeVideoTexture&&a.enable(18),v.alphaToCoverage&&a.enable(19),S.push(a.mask)}function M(S){const v=g[S.type];let L;if(v){const N=ii[v];L=Fg.clone(N.uniforms)}else L=S.uniforms;return L}function w(S,v){let L;for(let N=0,B=u.length;N<B;N++){const W=u[N];if(W.cacheKey===v){L=W,++L.usedTimes;break}}return L===void 0&&(L=new KS(r,v,S,s),u.push(L)),L}function A(S){if(--S.usedTimes===0){const v=u.indexOf(S);u[v]=u[u.length-1],u.pop(),S.destroy()}}function T(S){l.remove(S)}function C(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:M,acquireProgram:w,releaseProgram:A,releaseShaderCache:T,programs:u,dispose:C}}function eM(){let r=new WeakMap;function e(s){let o=r.get(s);return o===void 0&&(o={},r.set(s,o)),o}function t(s){r.delete(s)}function n(s,o,a){r.get(s)[o]=a}function i(){r=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function tM(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function hf(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function ff(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function o(d,h,f,g,_,p){let m=r[e];return m===void 0?(m={id:d.id,object:d,geometry:h,material:f,groupOrder:g,renderOrder:d.renderOrder,z:_,group:p},r[e]=m):(m.id=d.id,m.object=d,m.geometry=h,m.material=f,m.groupOrder=g,m.renderOrder=d.renderOrder,m.z=_,m.group=p),e++,m}function a(d,h,f,g,_,p){const m=o(d,h,f,g,_,p);f.transmission>0?n.push(m):f.transparent===!0?i.push(m):t.push(m)}function l(d,h,f,g,_,p){const m=o(d,h,f,g,_,p);f.transmission>0?n.unshift(m):f.transparent===!0?i.unshift(m):t.unshift(m)}function c(d,h){t.length>1&&t.sort(d||tM),n.length>1&&n.sort(h||hf),i.length>1&&i.sort(h||hf)}function u(){for(let d=e,h=r.length;d<h;d++){const f=r[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:a,unshift:l,finish:u,sort:c}}function nM(){let r=new WeakMap;function e(n,i){const s=r.get(n);let o;return s===void 0?(o=new ff,r.set(n,[o])):i>=s.length?(o=new ff,s.push(o)):o=s[i],o}function t(){r=new WeakMap}return{get:e,dispose:t}}function iM(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new q,color:new ft};break;case"SpotLight":t={position:new q,direction:new q,color:new ft,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new q,color:new ft,distance:0,decay:0};break;case"HemisphereLight":t={direction:new q,skyColor:new ft,groundColor:new ft};break;case"RectAreaLight":t={color:new ft,position:new q,halfWidth:new q,halfHeight:new q};break}return r[e.id]=t,t}}}function rM(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let sM=0;function oM(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function aM(r){const e=new iM,t=rM(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new q);const i=new q,s=new Ht,o=new Ht;function a(c){let u=0,d=0,h=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,g=0,_=0,p=0,m=0,E=0,x=0,M=0,w=0,A=0,T=0;c.sort(oM);for(let S=0,v=c.length;S<v;S++){const L=c[S],N=L.color,B=L.intensity,W=L.distance,Y=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=N.r*B,d+=N.g*B,h+=N.b*B;else if(L.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(L.sh.coefficients[G],B);T++}else if(L.isDirectionalLight){const G=e.get(L);if(G.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const V=L.shadow,H=t.get(L);H.shadowBias=V.bias,H.shadowNormalBias=V.normalBias,H.shadowRadius=V.radius,H.shadowMapSize=V.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=Y,n.directionalShadowMatrix[f]=L.shadow.matrix,E++}n.directional[f]=G,f++}else if(L.isSpotLight){const G=e.get(L);G.position.setFromMatrixPosition(L.matrixWorld),G.color.copy(N).multiplyScalar(B),G.distance=W,G.coneCos=Math.cos(L.angle),G.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),G.decay=L.decay,n.spot[_]=G;const V=L.shadow;if(L.map&&(n.spotLightMap[w]=L.map,w++,V.updateMatrices(L),L.castShadow&&A++),n.spotLightMatrix[_]=V.matrix,L.castShadow){const H=t.get(L);H.shadowBias=V.bias,H.shadowNormalBias=V.normalBias,H.shadowRadius=V.radius,H.shadowMapSize=V.mapSize,n.spotShadow[_]=H,n.spotShadowMap[_]=Y,M++}_++}else if(L.isRectAreaLight){const G=e.get(L);G.color.copy(N).multiplyScalar(B),G.halfWidth.set(L.width*.5,0,0),G.halfHeight.set(0,L.height*.5,0),n.rectArea[p]=G,p++}else if(L.isPointLight){const G=e.get(L);if(G.color.copy(L.color).multiplyScalar(L.intensity),G.distance=L.distance,G.decay=L.decay,L.castShadow){const V=L.shadow,H=t.get(L);H.shadowBias=V.bias,H.shadowNormalBias=V.normalBias,H.shadowRadius=V.radius,H.shadowMapSize=V.mapSize,H.shadowCameraNear=V.camera.near,H.shadowCameraFar=V.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=Y,n.pointShadowMatrix[g]=L.shadow.matrix,x++}n.point[g]=G,g++}else if(L.isHemisphereLight){const G=e.get(L);G.skyColor.copy(L.color).multiplyScalar(B),G.groundColor.copy(L.groundColor).multiplyScalar(B),n.hemi[m]=G,m++}}p>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pe.LTC_FLOAT_1,n.rectAreaLTC2=pe.LTC_FLOAT_2):(n.rectAreaLTC1=pe.LTC_HALF_1,n.rectAreaLTC2=pe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;const C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==p||C.hemiLength!==m||C.numDirectionalShadows!==E||C.numPointShadows!==x||C.numSpotShadows!==M||C.numSpotMaps!==w||C.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=M+w-A,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=T,C.directionalLength=f,C.pointLength=g,C.spotLength=_,C.rectAreaLength=p,C.hemiLength=m,C.numDirectionalShadows=E,C.numPointShadows=x,C.numSpotShadows=M,C.numSpotMaps=w,C.numLightProbes=T,n.version=sM++)}function l(c,u){let d=0,h=0,f=0,g=0,_=0;const p=u.matrixWorldInverse;for(let m=0,E=c.length;m<E;m++){const x=c[m];if(x.isDirectionalLight){const M=n.directional[d];M.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(p),d++}else if(x.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(p),f++}else if(x.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(p),o.identity(),s.copy(x.matrixWorld),s.premultiply(p),o.extractRotation(s),M.halfWidth.set(x.width*.5,0,0),M.halfHeight.set(0,x.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const M=n.point[h];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(p),h++}else if(x.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(x.matrixWorld),M.direction.transformDirection(p),_++}}}return{setup:a,setupView:l,state:n}}function df(r){const e=new aM(r),t=[],n=[];function i(u){c.camera=u,t.length=0,n.length=0}function s(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function lM(r){let e=new WeakMap;function t(i,s=0){const o=e.get(i);let a;return o===void 0?(a=new df(r),e.set(i,[a])):s>=o.length?(a=new df(r),o.push(a)):a=o[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class cM extends Ka{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=sg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class uM extends Ka{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const hM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function dM(r,e,t){let n=new ap;const i=new lt,s=new lt,o=new Zt,a=new cM({depthPacking:og}),l=new uM,c={},u=t.maxTextureSize,d={[ir]:Mn,[Mn]:ir,[si]:si},h=new Pi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new lt},radius:{value:4}},vertexShader:hM,fragmentShader:fM}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const g=new ar;g.setAttribute("position",new Qn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ui(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zd;let m=this.type;this.render=function(A,T,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||A.length===0)return;const S=r.getRenderTarget(),v=r.getActiveCubeFace(),L=r.getActiveMipmapLevel(),N=r.state;N.setBlending(ji),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const B=m!==Si&&this.type===Si,W=m===Si&&this.type!==Si;for(let Y=0,G=A.length;Y<G;Y++){const V=A[Y],H=V.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",V,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const ae=H.getFrameExtents();if(i.multiply(ae),s.copy(H.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(s.x=Math.floor(u/ae.x),i.x=s.x*ae.x,H.mapSize.x=s.x),i.y>u&&(s.y=Math.floor(u/ae.y),i.y=s.y*ae.y,H.mapSize.y=s.y)),H.map===null||B===!0||W===!0){const ue=this.type!==Si?{minFilter:Xn,magFilter:Xn}:{};H.map!==null&&H.map.dispose(),H.map=new kr(i.x,i.y,ue),H.map.texture.name=V.name+".shadowMap",H.camera.updateProjectionMatrix()}r.setRenderTarget(H.map),r.clear();const P=H.getViewportCount();for(let ue=0;ue<P;ue++){const Ne=H.getViewport(ue);o.set(s.x*Ne.x,s.y*Ne.y,s.x*Ne.z,s.y*Ne.w),N.viewport(o),H.updateMatrices(V,ue),n=H.getFrustum(),M(T,C,H.camera,V,this.type)}H.isPointLightShadow!==!0&&this.type===Si&&E(H,C),H.needsUpdate=!1}m=this.type,p.needsUpdate=!1,r.setRenderTarget(S,v,L)};function E(A,T){const C=e.update(_);h.defines.VSM_SAMPLES!==A.blurSamples&&(h.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new kr(i.x,i.y)),h.uniforms.shadow_pass.value=A.map.texture,h.uniforms.resolution.value=A.mapSize,h.uniforms.radius.value=A.radius,r.setRenderTarget(A.mapPass),r.clear(),r.renderBufferDirect(T,null,C,h,_,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,r.setRenderTarget(A.map),r.clear(),r.renderBufferDirect(T,null,C,f,_,null)}function x(A,T,C,S){let v=null;const L=C.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(L!==void 0)v=L;else if(v=C.isPointLight===!0?l:a,r.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const N=v.uuid,B=T.uuid;let W=c[N];W===void 0&&(W={},c[N]=W);let Y=W[B];Y===void 0&&(Y=v.clone(),W[B]=Y,T.addEventListener("dispose",w)),v=Y}if(v.visible=T.visible,v.wireframe=T.wireframe,S===Si?v.side=T.shadowSide!==null?T.shadowSide:T.side:v.side=T.shadowSide!==null?T.shadowSide:d[T.side],v.alphaMap=T.alphaMap,v.alphaTest=T.alphaTest,v.map=T.map,v.clipShadows=T.clipShadows,v.clippingPlanes=T.clippingPlanes,v.clipIntersection=T.clipIntersection,v.displacementMap=T.displacementMap,v.displacementScale=T.displacementScale,v.displacementBias=T.displacementBias,v.wireframeLinewidth=T.wireframeLinewidth,v.linewidth=T.linewidth,C.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const N=r.properties.get(v);N.light=C}return v}function M(A,T,C,S,v){if(A.visible===!1)return;if(A.layers.test(T.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&v===Si)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,A.matrixWorld);const B=e.update(A),W=A.material;if(Array.isArray(W)){const Y=B.groups;for(let G=0,V=Y.length;G<V;G++){const H=Y[G],ae=W[H.materialIndex];if(ae&&ae.visible){const P=x(A,ae,S,v);A.onBeforeShadow(r,A,T,C,B,P,H),r.renderBufferDirect(C,null,B,P,A,H),A.onAfterShadow(r,A,T,C,B,P,H)}}}else if(W.visible){const Y=x(A,W,S,v);A.onBeforeShadow(r,A,T,C,B,Y,null),r.renderBufferDirect(C,null,B,Y,A,null),A.onAfterShadow(r,A,T,C,B,Y,null)}}const N=A.children;for(let B=0,W=N.length;B<W;B++)M(N[B],T,C,S,v)}function w(A){A.target.removeEventListener("dispose",w);for(const C in c){const S=c[C],v=A.target.uuid;v in S&&(S[v].dispose(),delete S[v])}}}function pM(r){function e(){let U=!1;const Q=new Zt;let K=null;const Z=new Zt(0,0,0,0);return{setMask:function(se){K!==se&&!U&&(r.colorMask(se,se,se,se),K=se)},setLocked:function(se){U=se},setClear:function(se,Re,Ze,dt,pt){pt===!0&&(se*=dt,Re*=dt,Ze*=dt),Q.set(se,Re,Ze,dt),Z.equals(Q)===!1&&(r.clearColor(se,Re,Ze,dt),Z.copy(Q))},reset:function(){U=!1,K=null,Z.set(-1,0,0,0)}}}function t(){let U=!1,Q=null,K=null,Z=null;return{setTest:function(se){se?fe(r.DEPTH_TEST):oe(r.DEPTH_TEST)},setMask:function(se){Q!==se&&!U&&(r.depthMask(se),Q=se)},setFunc:function(se){if(K!==se){switch(se){case D_:r.depthFunc(r.NEVER);break;case U_:r.depthFunc(r.ALWAYS);break;case I_:r.depthFunc(r.LESS);break;case Na:r.depthFunc(r.LEQUAL);break;case N_:r.depthFunc(r.EQUAL);break;case O_:r.depthFunc(r.GEQUAL);break;case F_:r.depthFunc(r.GREATER);break;case B_:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}K=se}},setLocked:function(se){U=se},setClear:function(se){Z!==se&&(r.clearDepth(se),Z=se)},reset:function(){U=!1,Q=null,K=null,Z=null}}}function n(){let U=!1,Q=null,K=null,Z=null,se=null,Re=null,Ze=null,dt=null,pt=null;return{setTest:function(it){U||(it?fe(r.STENCIL_TEST):oe(r.STENCIL_TEST))},setMask:function(it){Q!==it&&!U&&(r.stencilMask(it),Q=it)},setFunc:function(it,Ue,be){(K!==it||Z!==Ue||se!==be)&&(r.stencilFunc(it,Ue,be),K=it,Z=Ue,se=be)},setOp:function(it,Ue,be){(Re!==it||Ze!==Ue||dt!==be)&&(r.stencilOp(it,Ue,be),Re=it,Ze=Ue,dt=be)},setLocked:function(it){U=it},setClear:function(it){pt!==it&&(r.clearStencil(it),pt=it)},reset:function(){U=!1,Q=null,K=null,Z=null,se=null,Re=null,Ze=null,dt=null,pt=null}}}const i=new e,s=new t,o=new n,a=new WeakMap,l=new WeakMap;let c={},u={},d=new WeakMap,h=[],f=null,g=!1,_=null,p=null,m=null,E=null,x=null,M=null,w=null,A=new ft(0,0,0),T=0,C=!1,S=null,v=null,L=null,N=null,B=null;const W=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,G=0;const V=r.getParameter(r.VERSION);V.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(V)[1]),Y=G>=1):V.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),Y=G>=2);let H=null,ae={};const P=r.getParameter(r.SCISSOR_BOX),ue=r.getParameter(r.VIEWPORT),Ne=new Zt().fromArray(P),Ye=new Zt().fromArray(ue);function $(U,Q,K,Z){const se=new Uint8Array(4),Re=r.createTexture();r.bindTexture(U,Re),r.texParameteri(U,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(U,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Ze=0;Ze<K;Ze++)U===r.TEXTURE_3D||U===r.TEXTURE_2D_ARRAY?r.texImage3D(Q,0,r.RGBA,1,1,Z,0,r.RGBA,r.UNSIGNED_BYTE,se):r.texImage2D(Q+Ze,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,se);return Re}const ee={};ee[r.TEXTURE_2D]=$(r.TEXTURE_2D,r.TEXTURE_2D,1),ee[r.TEXTURE_CUBE_MAP]=$(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[r.TEXTURE_2D_ARRAY]=$(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),ee[r.TEXTURE_3D]=$(r.TEXTURE_3D,r.TEXTURE_3D,1,1),i.setClear(0,0,0,1),s.setClear(1),o.setClear(0),fe(r.DEPTH_TEST),s.setFunc(Na),Se(!1),ze(qu),fe(r.CULL_FACE),_e(ji);function fe(U){c[U]!==!0&&(r.enable(U),c[U]=!0)}function oe(U){c[U]!==!1&&(r.disable(U),c[U]=!1)}function De(U,Q){return u[U]!==Q?(r.bindFramebuffer(U,Q),u[U]=Q,U===r.DRAW_FRAMEBUFFER&&(u[r.FRAMEBUFFER]=Q),U===r.FRAMEBUFFER&&(u[r.DRAW_FRAMEBUFFER]=Q),!0):!1}function Ce(U,Q){let K=h,Z=!1;if(U){K=d.get(Q),K===void 0&&(K=[],d.set(Q,K));const se=U.textures;if(K.length!==se.length||K[0]!==r.COLOR_ATTACHMENT0){for(let Re=0,Ze=se.length;Re<Ze;Re++)K[Re]=r.COLOR_ATTACHMENT0+Re;K.length=se.length,Z=!0}}else K[0]!==r.BACK&&(K[0]=r.BACK,Z=!0);Z&&r.drawBuffers(K)}function We(U){return f!==U?(r.useProgram(U),f=U,!0):!1}const D={[Er]:r.FUNC_ADD,[m_]:r.FUNC_SUBTRACT,[__]:r.FUNC_REVERSE_SUBTRACT};D[g_]=r.MIN,D[v_]=r.MAX;const Oe={[x_]:r.ZERO,[S_]:r.ONE,[M_]:r.SRC_COLOR,[Sc]:r.SRC_ALPHA,[w_]:r.SRC_ALPHA_SATURATE,[b_]:r.DST_COLOR,[E_]:r.DST_ALPHA,[y_]:r.ONE_MINUS_SRC_COLOR,[Mc]:r.ONE_MINUS_SRC_ALPHA,[A_]:r.ONE_MINUS_DST_COLOR,[T_]:r.ONE_MINUS_DST_ALPHA,[R_]:r.CONSTANT_COLOR,[C_]:r.ONE_MINUS_CONSTANT_COLOR,[P_]:r.CONSTANT_ALPHA,[L_]:r.ONE_MINUS_CONSTANT_ALPHA};function _e(U,Q,K,Z,se,Re,Ze,dt,pt,it){if(U===ji){g===!0&&(oe(r.BLEND),g=!1);return}if(g===!1&&(fe(r.BLEND),g=!0),U!==p_){if(U!==_||it!==C){if((p!==Er||x!==Er)&&(r.blendEquation(r.FUNC_ADD),p=Er,x=Er),it)switch(U){case ys:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case $u:r.blendFunc(r.ONE,r.ONE);break;case Ku:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Zu:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case ys:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case $u:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case Ku:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Zu:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}m=null,E=null,M=null,w=null,A.set(0,0,0),T=0,_=U,C=it}return}se=se||Q,Re=Re||K,Ze=Ze||Z,(Q!==p||se!==x)&&(r.blendEquationSeparate(D[Q],D[se]),p=Q,x=se),(K!==m||Z!==E||Re!==M||Ze!==w)&&(r.blendFuncSeparate(Oe[K],Oe[Z],Oe[Re],Oe[Ze]),m=K,E=Z,M=Re,w=Ze),(dt.equals(A)===!1||pt!==T)&&(r.blendColor(dt.r,dt.g,dt.b,pt),A.copy(dt),T=pt),_=U,C=!1}function Ve(U,Q){U.side===si?oe(r.CULL_FACE):fe(r.CULL_FACE);let K=U.side===Mn;Q&&(K=!K),Se(K),U.blending===ys&&U.transparent===!1?_e(ji):_e(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),s.setFunc(U.depthFunc),s.setTest(U.depthTest),s.setMask(U.depthWrite),i.setMask(U.colorWrite);const Z=U.stencilWrite;o.setTest(Z),Z&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Le(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?fe(r.SAMPLE_ALPHA_TO_COVERAGE):oe(r.SAMPLE_ALPHA_TO_COVERAGE)}function Se(U){S!==U&&(U?r.frontFace(r.CW):r.frontFace(r.CCW),S=U)}function ze(U){U!==h_?(fe(r.CULL_FACE),U!==v&&(U===qu?r.cullFace(r.BACK):U===f_?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):oe(r.CULL_FACE),v=U}function F(U){U!==L&&(Y&&r.lineWidth(U),L=U)}function Le(U,Q,K){U?(fe(r.POLYGON_OFFSET_FILL),(N!==Q||B!==K)&&(r.polygonOffset(Q,K),N=Q,B=K)):oe(r.POLYGON_OFFSET_FILL)}function st(U){U?fe(r.SCISSOR_TEST):oe(r.SCISSOR_TEST)}function R(U){U===void 0&&(U=r.TEXTURE0+W-1),H!==U&&(r.activeTexture(U),H=U)}function y(U,Q,K){K===void 0&&(H===null?K=r.TEXTURE0+W-1:K=H);let Z=ae[K];Z===void 0&&(Z={type:void 0,texture:void 0},ae[K]=Z),(Z.type!==U||Z.texture!==Q)&&(H!==K&&(r.activeTexture(K),H=K),r.bindTexture(U,Q||ee[U]),Z.type=U,Z.texture=Q)}function X(){const U=ae[H];U!==void 0&&U.type!==void 0&&(r.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function J(){try{r.compressedTexImage2D.apply(r,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function te(){try{r.compressedTexImage3D.apply(r,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(){try{r.texSubImage2D.apply(r,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Te(){try{r.texSubImage3D.apply(r,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ie(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ce(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ie(){try{r.texStorage2D.apply(r,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function re(){try{r.texStorage3D.apply(r,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ye(){try{r.texImage2D.apply(r,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function we(){try{r.texImage3D.apply(r,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Fe(U){Ne.equals(U)===!1&&(r.scissor(U.x,U.y,U.z,U.w),Ne.copy(U))}function he(U){Ye.equals(U)===!1&&(r.viewport(U.x,U.y,U.z,U.w),Ye.copy(U))}function ke(U,Q){let K=l.get(Q);K===void 0&&(K=new WeakMap,l.set(Q,K));let Z=K.get(U);Z===void 0&&(Z=r.getUniformBlockIndex(Q,U.name),K.set(U,Z))}function Xe(U,Q){const Z=l.get(Q).get(U);a.get(Q)!==Z&&(r.uniformBlockBinding(Q,Z,U.__bindingPointIndex),a.set(Q,Z))}function ot(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),c={},H=null,ae={},u={},d=new WeakMap,h=[],f=null,g=!1,_=null,p=null,m=null,E=null,x=null,M=null,w=null,A=new ft(0,0,0),T=0,C=!1,S=null,v=null,L=null,N=null,B=null,Ne.set(0,0,r.canvas.width,r.canvas.height),Ye.set(0,0,r.canvas.width,r.canvas.height),i.reset(),s.reset(),o.reset()}return{buffers:{color:i,depth:s,stencil:o},enable:fe,disable:oe,bindFramebuffer:De,drawBuffers:Ce,useProgram:We,setBlending:_e,setMaterial:Ve,setFlipSided:Se,setCullFace:ze,setLineWidth:F,setPolygonOffset:Le,setScissorTest:st,activeTexture:R,bindTexture:y,unbindTexture:X,compressedTexImage2D:J,compressedTexImage3D:te,texImage2D:ye,texImage3D:we,updateUBOMapping:ke,uniformBlockBinding:Xe,texStorage2D:Ie,texStorage3D:re,texSubImage2D:j,texSubImage3D:Te,compressedTexSubImage2D:ie,compressedTexSubImage3D:ce,scissor:Fe,viewport:he,reset:ot}}function mM(r,e,t,n,i,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new lt,u=new WeakMap;let d;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,y){return f?new OffscreenCanvas(R,y):Ha("canvas")}function _(R,y,X){let J=1;const te=st(R);if((te.width>X||te.height>X)&&(J=X/Math.max(te.width,te.height)),J<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const j=Math.floor(J*te.width),Te=Math.floor(J*te.height);d===void 0&&(d=g(j,Te));const ie=y?g(j,Te):d;return ie.width=j,ie.height=Te,ie.getContext("2d").drawImage(R,0,0,j,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+j+"x"+Te+")."),ie}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),R;return R}function p(R){return R.generateMipmaps&&R.minFilter!==Xn&&R.minFilter!==Jn}function m(R){r.generateMipmap(R)}function E(R,y,X,J,te=!1){if(R!==null){if(r[R]!==void 0)return r[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let j=y;if(y===r.RED&&(X===r.FLOAT&&(j=r.R32F),X===r.HALF_FLOAT&&(j=r.R16F),X===r.UNSIGNED_BYTE&&(j=r.R8)),y===r.RED_INTEGER&&(X===r.UNSIGNED_BYTE&&(j=r.R8UI),X===r.UNSIGNED_SHORT&&(j=r.R16UI),X===r.UNSIGNED_INT&&(j=r.R32UI),X===r.BYTE&&(j=r.R8I),X===r.SHORT&&(j=r.R16I),X===r.INT&&(j=r.R32I)),y===r.RG&&(X===r.FLOAT&&(j=r.RG32F),X===r.HALF_FLOAT&&(j=r.RG16F),X===r.UNSIGNED_BYTE&&(j=r.RG8)),y===r.RG_INTEGER&&(X===r.UNSIGNED_BYTE&&(j=r.RG8UI),X===r.UNSIGNED_SHORT&&(j=r.RG16UI),X===r.UNSIGNED_INT&&(j=r.RG32UI),X===r.BYTE&&(j=r.RG8I),X===r.SHORT&&(j=r.RG16I),X===r.INT&&(j=r.RG32I)),y===r.RGB&&X===r.UNSIGNED_INT_5_9_9_9_REV&&(j=r.RGB9_E5),y===r.RGBA){const Te=te?Fa:ht.getTransfer(J);X===r.FLOAT&&(j=r.RGBA32F),X===r.HALF_FLOAT&&(j=r.RGBA16F),X===r.UNSIGNED_BYTE&&(j=Te===Mt?r.SRGB8_ALPHA8:r.RGBA8),X===r.UNSIGNED_SHORT_4_4_4_4&&(j=r.RGBA4),X===r.UNSIGNED_SHORT_5_5_5_1&&(j=r.RGB5_A1)}return(j===r.R16F||j===r.R32F||j===r.RG16F||j===r.RG32F||j===r.RGBA16F||j===r.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function x(R,y){let X;return R?y===null||y===Us||y===Is?X=r.DEPTH24_STENCIL8:y===qi?X=r.DEPTH32F_STENCIL8:y===Oa&&(X=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Us||y===Is?X=r.DEPTH_COMPONENT24:y===qi?X=r.DEPTH_COMPONENT32F:y===Oa&&(X=r.DEPTH_COMPONENT16),X}function M(R,y){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==Xn&&R.minFilter!==Jn?Math.log2(Math.max(y.width,y.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?y.mipmaps.length:1}function w(R){const y=R.target;y.removeEventListener("dispose",w),T(y),y.isVideoTexture&&u.delete(y)}function A(R){const y=R.target;y.removeEventListener("dispose",A),S(y)}function T(R){const y=n.get(R);if(y.__webglInit===void 0)return;const X=R.source,J=h.get(X);if(J){const te=J[y.__cacheKey];te.usedTimes--,te.usedTimes===0&&C(R),Object.keys(J).length===0&&h.delete(X)}n.remove(R)}function C(R){const y=n.get(R);r.deleteTexture(y.__webglTexture);const X=R.source,J=h.get(X);delete J[y.__cacheKey],o.memory.textures--}function S(R){const y=n.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(y.__webglFramebuffer[J]))for(let te=0;te<y.__webglFramebuffer[J].length;te++)r.deleteFramebuffer(y.__webglFramebuffer[J][te]);else r.deleteFramebuffer(y.__webglFramebuffer[J]);y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer[J])}else{if(Array.isArray(y.__webglFramebuffer))for(let J=0;J<y.__webglFramebuffer.length;J++)r.deleteFramebuffer(y.__webglFramebuffer[J]);else r.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&r.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let J=0;J<y.__webglColorRenderbuffer.length;J++)y.__webglColorRenderbuffer[J]&&r.deleteRenderbuffer(y.__webglColorRenderbuffer[J]);y.__webglDepthRenderbuffer&&r.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const X=R.textures;for(let J=0,te=X.length;J<te;J++){const j=n.get(X[J]);j.__webglTexture&&(r.deleteTexture(j.__webglTexture),o.memory.textures--),n.remove(X[J])}n.remove(R)}let v=0;function L(){v=0}function N(){const R=v;return R>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),v+=1,R}function B(R){const y=[];return y.push(R.wrapS),y.push(R.wrapT),y.push(R.wrapR||0),y.push(R.magFilter),y.push(R.minFilter),y.push(R.anisotropy),y.push(R.internalFormat),y.push(R.format),y.push(R.type),y.push(R.generateMipmaps),y.push(R.premultiplyAlpha),y.push(R.flipY),y.push(R.unpackAlignment),y.push(R.colorSpace),y.join()}function W(R,y){const X=n.get(R);if(R.isVideoTexture&&F(R),R.isRenderTargetTexture===!1&&R.version>0&&X.__version!==R.version){const J=R.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ye(X,R,y);return}}t.bindTexture(r.TEXTURE_2D,X.__webglTexture,r.TEXTURE0+y)}function Y(R,y){const X=n.get(R);if(R.version>0&&X.__version!==R.version){Ye(X,R,y);return}t.bindTexture(r.TEXTURE_2D_ARRAY,X.__webglTexture,r.TEXTURE0+y)}function G(R,y){const X=n.get(R);if(R.version>0&&X.__version!==R.version){Ye(X,R,y);return}t.bindTexture(r.TEXTURE_3D,X.__webglTexture,r.TEXTURE0+y)}function V(R,y){const X=n.get(R);if(R.version>0&&X.__version!==R.version){$(X,R,y);return}t.bindTexture(r.TEXTURE_CUBE_MAP,X.__webglTexture,r.TEXTURE0+y)}const H={[Tc]:r.REPEAT,[wr]:r.CLAMP_TO_EDGE,[bc]:r.MIRRORED_REPEAT},ae={[Xn]:r.NEAREST,[$_]:r.NEAREST_MIPMAP_NEAREST,[Go]:r.NEAREST_MIPMAP_LINEAR,[Jn]:r.LINEAR,[ml]:r.LINEAR_MIPMAP_NEAREST,[Rr]:r.LINEAR_MIPMAP_LINEAR},P={[cg]:r.NEVER,[mg]:r.ALWAYS,[ug]:r.LESS,[$d]:r.LEQUAL,[hg]:r.EQUAL,[pg]:r.GEQUAL,[fg]:r.GREATER,[dg]:r.NOTEQUAL};function ue(R,y){if(y.type===qi&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Jn||y.magFilter===ml||y.magFilter===Go||y.magFilter===Rr||y.minFilter===Jn||y.minFilter===ml||y.minFilter===Go||y.minFilter===Rr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(R,r.TEXTURE_WRAP_S,H[y.wrapS]),r.texParameteri(R,r.TEXTURE_WRAP_T,H[y.wrapT]),(R===r.TEXTURE_3D||R===r.TEXTURE_2D_ARRAY)&&r.texParameteri(R,r.TEXTURE_WRAP_R,H[y.wrapR]),r.texParameteri(R,r.TEXTURE_MAG_FILTER,ae[y.magFilter]),r.texParameteri(R,r.TEXTURE_MIN_FILTER,ae[y.minFilter]),y.compareFunction&&(r.texParameteri(R,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(R,r.TEXTURE_COMPARE_FUNC,P[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Xn||y.minFilter!==Go&&y.minFilter!==Rr||y.type===qi&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const X=e.get("EXT_texture_filter_anisotropic");r.texParameterf(R,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Ne(R,y){let X=!1;R.__webglInit===void 0&&(R.__webglInit=!0,y.addEventListener("dispose",w));const J=y.source;let te=h.get(J);te===void 0&&(te={},h.set(J,te));const j=B(y);if(j!==R.__cacheKey){te[j]===void 0&&(te[j]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,X=!0),te[j].usedTimes++;const Te=te[R.__cacheKey];Te!==void 0&&(te[R.__cacheKey].usedTimes--,Te.usedTimes===0&&C(y)),R.__cacheKey=j,R.__webglTexture=te[j].texture}return X}function Ye(R,y,X){let J=r.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(J=r.TEXTURE_2D_ARRAY),y.isData3DTexture&&(J=r.TEXTURE_3D);const te=Ne(R,y),j=y.source;t.bindTexture(J,R.__webglTexture,r.TEXTURE0+X);const Te=n.get(j);if(j.version!==Te.__version||te===!0){t.activeTexture(r.TEXTURE0+X);const ie=ht.getPrimaries(ht.workingColorSpace),ce=y.colorSpace===ki?null:ht.getPrimaries(y.colorSpace),Ie=y.colorSpace===ki||ie===ce?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie);let re=_(y.image,!1,i.maxTextureSize);re=Le(y,re);const ye=s.convert(y.format,y.colorSpace),we=s.convert(y.type);let Fe=E(y.internalFormat,ye,we,y.colorSpace,y.isVideoTexture);ue(J,y);let he;const ke=y.mipmaps,Xe=y.isVideoTexture!==!0,ot=Te.__version===void 0||te===!0,U=j.dataReady,Q=M(y,re);if(y.isDepthTexture)Fe=x(y.format===Ns,y.type),ot&&(Xe?t.texStorage2D(r.TEXTURE_2D,1,Fe,re.width,re.height):t.texImage2D(r.TEXTURE_2D,0,Fe,re.width,re.height,0,ye,we,null));else if(y.isDataTexture)if(ke.length>0){Xe&&ot&&t.texStorage2D(r.TEXTURE_2D,Q,Fe,ke[0].width,ke[0].height);for(let K=0,Z=ke.length;K<Z;K++)he=ke[K],Xe?U&&t.texSubImage2D(r.TEXTURE_2D,K,0,0,he.width,he.height,ye,we,he.data):t.texImage2D(r.TEXTURE_2D,K,Fe,he.width,he.height,0,ye,we,he.data);y.generateMipmaps=!1}else Xe?(ot&&t.texStorage2D(r.TEXTURE_2D,Q,Fe,re.width,re.height),U&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,re.width,re.height,ye,we,re.data)):t.texImage2D(r.TEXTURE_2D,0,Fe,re.width,re.height,0,ye,we,re.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Xe&&ot&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Q,Fe,ke[0].width,ke[0].height,re.depth);for(let K=0,Z=ke.length;K<Z;K++)if(he=ke[K],y.format!==ci)if(ye!==null)if(Xe){if(U)if(y.layerUpdates.size>0){for(const se of y.layerUpdates){const Re=he.width*he.height;t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,K,0,0,se,he.width,he.height,1,ye,he.data.slice(Re*se,Re*(se+1)),0,0)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,K,0,0,0,he.width,he.height,re.depth,ye,he.data,0,0)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,K,Fe,he.width,he.height,re.depth,0,he.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?U&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,K,0,0,0,he.width,he.height,re.depth,ye,we,he.data):t.texImage3D(r.TEXTURE_2D_ARRAY,K,Fe,he.width,he.height,re.depth,0,ye,we,he.data)}else{Xe&&ot&&t.texStorage2D(r.TEXTURE_2D,Q,Fe,ke[0].width,ke[0].height);for(let K=0,Z=ke.length;K<Z;K++)he=ke[K],y.format!==ci?ye!==null?Xe?U&&t.compressedTexSubImage2D(r.TEXTURE_2D,K,0,0,he.width,he.height,ye,he.data):t.compressedTexImage2D(r.TEXTURE_2D,K,Fe,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?U&&t.texSubImage2D(r.TEXTURE_2D,K,0,0,he.width,he.height,ye,we,he.data):t.texImage2D(r.TEXTURE_2D,K,Fe,he.width,he.height,0,ye,we,he.data)}else if(y.isDataArrayTexture)if(Xe){if(ot&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Q,Fe,re.width,re.height,re.depth),U)if(y.layerUpdates.size>0){let K;switch(we){case r.UNSIGNED_BYTE:switch(ye){case r.ALPHA:K=1;break;case r.LUMINANCE:K=1;break;case r.LUMINANCE_ALPHA:K=2;break;case r.RGB:K=3;break;case r.RGBA:K=4;break;default:throw new Error(`Unknown texel size for format ${ye}.`)}break;case r.UNSIGNED_SHORT_4_4_4_4:case r.UNSIGNED_SHORT_5_5_5_1:case r.UNSIGNED_SHORT_5_6_5:K=1;break;default:throw new Error(`Unknown texel size for type ${we}.`)}const Z=re.width*re.height*K;for(const se of y.layerUpdates)t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,se,re.width,re.height,1,ye,we,re.data.slice(Z*se,Z*(se+1)));y.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,ye,we,re.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,Fe,re.width,re.height,re.depth,0,ye,we,re.data);else if(y.isData3DTexture)Xe?(ot&&t.texStorage3D(r.TEXTURE_3D,Q,Fe,re.width,re.height,re.depth),U&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,ye,we,re.data)):t.texImage3D(r.TEXTURE_3D,0,Fe,re.width,re.height,re.depth,0,ye,we,re.data);else if(y.isFramebufferTexture){if(ot)if(Xe)t.texStorage2D(r.TEXTURE_2D,Q,Fe,re.width,re.height);else{let K=re.width,Z=re.height;for(let se=0;se<Q;se++)t.texImage2D(r.TEXTURE_2D,se,Fe,K,Z,0,ye,we,null),K>>=1,Z>>=1}}else if(ke.length>0){if(Xe&&ot){const K=st(ke[0]);t.texStorage2D(r.TEXTURE_2D,Q,Fe,K.width,K.height)}for(let K=0,Z=ke.length;K<Z;K++)he=ke[K],Xe?U&&t.texSubImage2D(r.TEXTURE_2D,K,0,0,ye,we,he):t.texImage2D(r.TEXTURE_2D,K,Fe,ye,we,he);y.generateMipmaps=!1}else if(Xe){if(ot){const K=st(re);t.texStorage2D(r.TEXTURE_2D,Q,Fe,K.width,K.height)}U&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,ye,we,re)}else t.texImage2D(r.TEXTURE_2D,0,Fe,ye,we,re);p(y)&&m(J),Te.__version=j.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function $(R,y,X){if(y.image.length!==6)return;const J=Ne(R,y),te=y.source;t.bindTexture(r.TEXTURE_CUBE_MAP,R.__webglTexture,r.TEXTURE0+X);const j=n.get(te);if(te.version!==j.__version||J===!0){t.activeTexture(r.TEXTURE0+X);const Te=ht.getPrimaries(ht.workingColorSpace),ie=y.colorSpace===ki?null:ht.getPrimaries(y.colorSpace),ce=y.colorSpace===ki||Te===ie?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const Ie=y.isCompressedTexture||y.image[0].isCompressedTexture,re=y.image[0]&&y.image[0].isDataTexture,ye=[];for(let Z=0;Z<6;Z++)!Ie&&!re?ye[Z]=_(y.image[Z],!0,i.maxCubemapSize):ye[Z]=re?y.image[Z].image:y.image[Z],ye[Z]=Le(y,ye[Z]);const we=ye[0],Fe=s.convert(y.format,y.colorSpace),he=s.convert(y.type),ke=E(y.internalFormat,Fe,he,y.colorSpace),Xe=y.isVideoTexture!==!0,ot=j.__version===void 0||J===!0,U=te.dataReady;let Q=M(y,we);ue(r.TEXTURE_CUBE_MAP,y);let K;if(Ie){Xe&&ot&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Q,ke,we.width,we.height);for(let Z=0;Z<6;Z++){K=ye[Z].mipmaps;for(let se=0;se<K.length;se++){const Re=K[se];y.format!==ci?Fe!==null?Xe?U&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se,0,0,Re.width,Re.height,Fe,Re.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se,ke,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Xe?U&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se,0,0,Re.width,Re.height,Fe,he,Re.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se,ke,Re.width,Re.height,0,Fe,he,Re.data)}}}else{if(K=y.mipmaps,Xe&&ot){K.length>0&&Q++;const Z=st(ye[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Q,ke,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(re){Xe?U&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,ye[Z].width,ye[Z].height,Fe,he,ye[Z].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,ke,ye[Z].width,ye[Z].height,0,Fe,he,ye[Z].data);for(let se=0;se<K.length;se++){const Ze=K[se].image[Z].image;Xe?U&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se+1,0,0,Ze.width,Ze.height,Fe,he,Ze.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se+1,ke,Ze.width,Ze.height,0,Fe,he,Ze.data)}}else{Xe?U&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Fe,he,ye[Z]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,ke,Fe,he,ye[Z]);for(let se=0;se<K.length;se++){const Re=K[se];Xe?U&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se+1,0,0,Fe,he,Re.image[Z]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se+1,ke,Fe,he,Re.image[Z])}}}p(y)&&m(r.TEXTURE_CUBE_MAP),j.__version=te.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function ee(R,y,X,J,te,j){const Te=s.convert(X.format,X.colorSpace),ie=s.convert(X.type),ce=E(X.internalFormat,Te,ie,X.colorSpace);if(!n.get(y).__hasExternalTextures){const re=Math.max(1,y.width>>j),ye=Math.max(1,y.height>>j);te===r.TEXTURE_3D||te===r.TEXTURE_2D_ARRAY?t.texImage3D(te,j,ce,re,ye,y.depth,0,Te,ie,null):t.texImage2D(te,j,ce,re,ye,0,Te,ie,null)}t.bindFramebuffer(r.FRAMEBUFFER,R),ze(y)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,J,te,n.get(X).__webglTexture,0,Se(y)):(te===r.TEXTURE_2D||te>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,J,te,n.get(X).__webglTexture,j),t.bindFramebuffer(r.FRAMEBUFFER,null)}function fe(R,y,X){if(r.bindRenderbuffer(r.RENDERBUFFER,R),y.depthBuffer){const J=y.depthTexture,te=J&&J.isDepthTexture?J.type:null,j=x(y.stencilBuffer,te),Te=y.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ie=Se(y);ze(y)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ie,j,y.width,y.height):X?r.renderbufferStorageMultisample(r.RENDERBUFFER,ie,j,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,j,y.width,y.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Te,r.RENDERBUFFER,R)}else{const J=y.textures;for(let te=0;te<J.length;te++){const j=J[te],Te=s.convert(j.format,j.colorSpace),ie=s.convert(j.type),ce=E(j.internalFormat,Te,ie,j.colorSpace),Ie=Se(y);X&&ze(y)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ie,ce,y.width,y.height):ze(y)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ie,ce,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,ce,y.width,y.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function oe(R,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,R),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(y.depthTexture).__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),W(y.depthTexture,0);const J=n.get(y.depthTexture).__webglTexture,te=Se(y);if(y.depthTexture.format===Es)ze(y)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,J,0,te):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,J,0);else if(y.depthTexture.format===Ns)ze(y)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,J,0,te):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function De(R){const y=n.get(R),X=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!y.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");oe(y.__webglFramebuffer,R)}else if(X){y.__webglDepthbuffer=[];for(let J=0;J<6;J++)t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer[J]),y.__webglDepthbuffer[J]=r.createRenderbuffer(),fe(y.__webglDepthbuffer[J],R,!1)}else t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer=r.createRenderbuffer(),fe(y.__webglDepthbuffer,R,!1);t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ce(R,y,X){const J=n.get(R);y!==void 0&&ee(J.__webglFramebuffer,R,R.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),X!==void 0&&De(R)}function We(R){const y=R.texture,X=n.get(R),J=n.get(y);R.addEventListener("dispose",A);const te=R.textures,j=R.isWebGLCubeRenderTarget===!0,Te=te.length>1;if(Te||(J.__webglTexture===void 0&&(J.__webglTexture=r.createTexture()),J.__version=y.version,o.memory.textures++),j){X.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(y.mipmaps&&y.mipmaps.length>0){X.__webglFramebuffer[ie]=[];for(let ce=0;ce<y.mipmaps.length;ce++)X.__webglFramebuffer[ie][ce]=r.createFramebuffer()}else X.__webglFramebuffer[ie]=r.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){X.__webglFramebuffer=[];for(let ie=0;ie<y.mipmaps.length;ie++)X.__webglFramebuffer[ie]=r.createFramebuffer()}else X.__webglFramebuffer=r.createFramebuffer();if(Te)for(let ie=0,ce=te.length;ie<ce;ie++){const Ie=n.get(te[ie]);Ie.__webglTexture===void 0&&(Ie.__webglTexture=r.createTexture(),o.memory.textures++)}if(R.samples>0&&ze(R)===!1){X.__webglMultisampledFramebuffer=r.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let ie=0;ie<te.length;ie++){const ce=te[ie];X.__webglColorRenderbuffer[ie]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,X.__webglColorRenderbuffer[ie]);const Ie=s.convert(ce.format,ce.colorSpace),re=s.convert(ce.type),ye=E(ce.internalFormat,Ie,re,ce.colorSpace,R.isXRRenderTarget===!0),we=Se(R);r.renderbufferStorageMultisample(r.RENDERBUFFER,we,ye,R.width,R.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ie,r.RENDERBUFFER,X.__webglColorRenderbuffer[ie])}r.bindRenderbuffer(r.RENDERBUFFER,null),R.depthBuffer&&(X.__webglDepthRenderbuffer=r.createRenderbuffer(),fe(X.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(j){t.bindTexture(r.TEXTURE_CUBE_MAP,J.__webglTexture),ue(r.TEXTURE_CUBE_MAP,y);for(let ie=0;ie<6;ie++)if(y.mipmaps&&y.mipmaps.length>0)for(let ce=0;ce<y.mipmaps.length;ce++)ee(X.__webglFramebuffer[ie][ce],R,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ce);else ee(X.__webglFramebuffer[ie],R,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);p(y)&&m(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let ie=0,ce=te.length;ie<ce;ie++){const Ie=te[ie],re=n.get(Ie);t.bindTexture(r.TEXTURE_2D,re.__webglTexture),ue(r.TEXTURE_2D,Ie),ee(X.__webglFramebuffer,R,Ie,r.COLOR_ATTACHMENT0+ie,r.TEXTURE_2D,0),p(Ie)&&m(r.TEXTURE_2D)}t.unbindTexture()}else{let ie=r.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ie=R.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ie,J.__webglTexture),ue(ie,y),y.mipmaps&&y.mipmaps.length>0)for(let ce=0;ce<y.mipmaps.length;ce++)ee(X.__webglFramebuffer[ce],R,y,r.COLOR_ATTACHMENT0,ie,ce);else ee(X.__webglFramebuffer,R,y,r.COLOR_ATTACHMENT0,ie,0);p(y)&&m(ie),t.unbindTexture()}R.depthBuffer&&De(R)}function D(R){const y=R.textures;for(let X=0,J=y.length;X<J;X++){const te=y[X];if(p(te)){const j=R.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,Te=n.get(te).__webglTexture;t.bindTexture(j,Te),m(j),t.unbindTexture()}}}const Oe=[],_e=[];function Ve(R){if(R.samples>0){if(ze(R)===!1){const y=R.textures,X=R.width,J=R.height;let te=r.COLOR_BUFFER_BIT;const j=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Te=n.get(R),ie=y.length>1;if(ie)for(let ce=0;ce<y.length;ce++)t.bindFramebuffer(r.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ce,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,Te.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ce,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let ce=0;ce<y.length;ce++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(te|=r.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(te|=r.STENCIL_BUFFER_BIT)),ie){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Te.__webglColorRenderbuffer[ce]);const Ie=n.get(y[ce]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Ie,0)}r.blitFramebuffer(0,0,X,J,0,0,X,J,te,r.NEAREST),l===!0&&(Oe.length=0,_e.length=0,Oe.push(r.COLOR_ATTACHMENT0+ce),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Oe.push(j),_e.push(j),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,_e)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Oe))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),ie)for(let ce=0;ce<y.length;ce++){t.bindFramebuffer(r.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ce,r.RENDERBUFFER,Te.__webglColorRenderbuffer[ce]);const Ie=n.get(y[ce]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,Te.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ce,r.TEXTURE_2D,Ie,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const y=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[y])}}}function Se(R){return Math.min(i.maxSamples,R.samples)}function ze(R){const y=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function F(R){const y=o.render.frame;u.get(R)!==y&&(u.set(R,y),R.update())}function Le(R,y){const X=R.colorSpace,J=R.format,te=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||X!==or&&X!==ki&&(ht.getTransfer(X)===Mt?(J!==ci||te!==rr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),y}function st(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=L,this.setTexture2D=W,this.setTexture2DArray=Y,this.setTexture3D=G,this.setTextureCube=V,this.rebindTextures=Ce,this.setupRenderTarget=We,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=Ve,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=ze}function _M(r,e){function t(n,i=ki){let s;const o=ht.getTransfer(i);if(n===rr)return r.UNSIGNED_BYTE;if(n===Gd)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Wd)return r.UNSIGNED_SHORT_5_5_5_1;if(n===j_)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===K_)return r.BYTE;if(n===Z_)return r.SHORT;if(n===Oa)return r.UNSIGNED_SHORT;if(n===Vd)return r.INT;if(n===Us)return r.UNSIGNED_INT;if(n===qi)return r.FLOAT;if(n===qa)return r.HALF_FLOAT;if(n===J_)return r.ALPHA;if(n===Q_)return r.RGB;if(n===ci)return r.RGBA;if(n===eg)return r.LUMINANCE;if(n===tg)return r.LUMINANCE_ALPHA;if(n===Es)return r.DEPTH_COMPONENT;if(n===Ns)return r.DEPTH_STENCIL;if(n===ng)return r.RED;if(n===Xd)return r.RED_INTEGER;if(n===ig)return r.RG;if(n===Yd)return r.RG_INTEGER;if(n===qd)return r.RGBA_INTEGER;if(n===_l||n===gl||n===vl||n===xl)if(o===Mt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===_l)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===gl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===vl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===xl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===_l)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===gl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===vl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===xl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ju||n===Ju||n===Qu||n===eh)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===ju)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ju)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Qu)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===eh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===th||n===nh||n===ih)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===th||n===nh)return o===Mt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===ih)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===rh||n===sh||n===oh||n===ah||n===lh||n===ch||n===uh||n===hh||n===fh||n===dh||n===ph||n===mh||n===_h||n===gh)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===rh)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===sh)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===oh)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ah)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===lh)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ch)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===uh)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===hh)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===fh)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===dh)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ph)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===mh)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===_h)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===gh)return o===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Sl||n===vh||n===xh)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Sl)return o===Mt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===vh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===xh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===rg||n===Sh||n===Mh||n===yh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Sl)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Sh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Mh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===yh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Is?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}class gM extends jn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ha extends Nn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const vM={type:"move"};class ql{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ha,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ha,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ha,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),m=this._getHandJoint(c,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&h>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(vM)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ha;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const xM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,SM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class MM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new yn,s=e.properties.get(i);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Pi({vertexShader:xM,fragmentShader:SM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ui(new Za(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class yM extends Fs{constructor(e,t){super();const n=this;let i=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,g=null;const _=new MM,p=t.getContextAttributes();let m=null,E=null;const x=[],M=[],w=new lt;let A=null;const T=new jn;T.layers.enable(1),T.viewport=new Zt;const C=new jn;C.layers.enable(2),C.viewport=new Zt;const S=[T,C],v=new gM;v.layers.enable(1),v.layers.enable(2);let L=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ee=x[$];return ee===void 0&&(ee=new ql,x[$]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function($){let ee=x[$];return ee===void 0&&(ee=new ql,x[$]=ee),ee.getGripSpace()},this.getHand=function($){let ee=x[$];return ee===void 0&&(ee=new ql,x[$]=ee),ee.getHandSpace()};function B($){const ee=M.indexOf($.inputSource);if(ee===-1)return;const fe=x[ee];fe!==void 0&&(fe.update($.inputSource,$.frame,c||o),fe.dispatchEvent({type:$.type,data:$.inputSource}))}function W(){i.removeEventListener("select",B),i.removeEventListener("selectstart",B),i.removeEventListener("selectend",B),i.removeEventListener("squeeze",B),i.removeEventListener("squeezestart",B),i.removeEventListener("squeezeend",B),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",Y);for(let $=0;$<x.length;$++){const ee=M[$];ee!==null&&(M[$]=null,x[$].disconnect(ee))}L=null,N=null,_.reset(),e.setRenderTarget(m),f=null,h=null,d=null,i=null,E=null,Ye.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function($){if(i=$,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",B),i.addEventListener("selectstart",B),i.addEventListener("selectend",B),i.addEventListener("squeeze",B),i.addEventListener("squeezestart",B),i.addEventListener("squeezeend",B),i.addEventListener("end",W),i.addEventListener("inputsourceschange",Y),p.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(w),i.renderState.layers===void 0){const ee={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,t,ee),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),E=new kr(f.framebufferWidth,f.framebufferHeight,{format:ci,type:rr,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let ee=null,fe=null,oe=null;p.depth&&(oe=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=p.stencil?Ns:Es,fe=p.stencil?Is:Us);const De={colorFormat:t.RGBA8,depthFormat:oe,scaleFactor:s};d=new XRWebGLBinding(i,t),h=d.createProjectionLayer(De),i.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),E=new kr(h.textureWidth,h.textureHeight,{format:ci,type:rr,depthTexture:new up(h.textureWidth,h.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),Ye.setContext(i),Ye.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function Y($){for(let ee=0;ee<$.removed.length;ee++){const fe=$.removed[ee],oe=M.indexOf(fe);oe>=0&&(M[oe]=null,x[oe].disconnect(fe))}for(let ee=0;ee<$.added.length;ee++){const fe=$.added[ee];let oe=M.indexOf(fe);if(oe===-1){for(let Ce=0;Ce<x.length;Ce++)if(Ce>=M.length){M.push(fe),oe=Ce;break}else if(M[Ce]===null){M[Ce]=fe,oe=Ce;break}if(oe===-1)break}const De=x[oe];De&&De.connect(fe)}}const G=new q,V=new q;function H($,ee,fe){G.setFromMatrixPosition(ee.matrixWorld),V.setFromMatrixPosition(fe.matrixWorld);const oe=G.distanceTo(V),De=ee.projectionMatrix.elements,Ce=fe.projectionMatrix.elements,We=De[14]/(De[10]-1),D=De[14]/(De[10]+1),Oe=(De[9]+1)/De[5],_e=(De[9]-1)/De[5],Ve=(De[8]-1)/De[0],Se=(Ce[8]+1)/Ce[0],ze=We*Ve,F=We*Se,Le=oe/(-Ve+Se),st=Le*-Ve;ee.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(st),$.translateZ(Le),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert();const R=We+Le,y=D+Le,X=ze-st,J=F+(oe-st),te=Oe*D/y*R,j=_e*D/y*R;$.projectionMatrix.makePerspective(X,J,te,j,R,y),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}function ae($,ee){ee===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ee.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(i===null)return;_.texture!==null&&($.near=_.depthNear,$.far=_.depthFar),v.near=C.near=T.near=$.near,v.far=C.far=T.far=$.far,(L!==v.near||N!==v.far)&&(i.updateRenderState({depthNear:v.near,depthFar:v.far}),L=v.near,N=v.far,T.near=L,T.far=N,C.near=L,C.far=N,T.updateProjectionMatrix(),C.updateProjectionMatrix(),$.updateProjectionMatrix());const ee=$.parent,fe=v.cameras;ae(v,ee);for(let oe=0;oe<fe.length;oe++)ae(fe[oe],ee);fe.length===2?H(v,T,C):v.projectionMatrix.copy(T.projectionMatrix),P($,v,ee)};function P($,ee,fe){fe===null?$.matrix.copy(ee.matrixWorld):($.matrix.copy(fe.matrixWorld),$.matrix.invert(),$.matrix.multiply(ee.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ee.projectionMatrix),$.projectionMatrixInverse.copy(ee.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Ac*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function($){l=$,h!==null&&(h.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(v)};let ue=null;function Ne($,ee){if(u=ee.getViewerPose(c||o),g=ee,u!==null){const fe=u.views;f!==null&&(e.setRenderTargetFramebuffer(E,f.framebuffer),e.setRenderTarget(E));let oe=!1;fe.length!==v.cameras.length&&(v.cameras.length=0,oe=!0);for(let Ce=0;Ce<fe.length;Ce++){const We=fe[Ce];let D=null;if(f!==null)D=f.getViewport(We);else{const _e=d.getViewSubImage(h,We);D=_e.viewport,Ce===0&&(e.setRenderTargetTextures(E,_e.colorTexture,h.ignoreDepthValues?void 0:_e.depthStencilTexture),e.setRenderTarget(E))}let Oe=S[Ce];Oe===void 0&&(Oe=new jn,Oe.layers.enable(Ce),Oe.viewport=new Zt,S[Ce]=Oe),Oe.matrix.fromArray(We.transform.matrix),Oe.matrix.decompose(Oe.position,Oe.quaternion,Oe.scale),Oe.projectionMatrix.fromArray(We.projectionMatrix),Oe.projectionMatrixInverse.copy(Oe.projectionMatrix).invert(),Oe.viewport.set(D.x,D.y,D.width,D.height),Ce===0&&(v.matrix.copy(Oe.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),oe===!0&&v.cameras.push(Oe)}const De=i.enabledFeatures;if(De&&De.includes("depth-sensing")){const Ce=d.getDepthInformation(fe[0]);Ce&&Ce.isValid&&Ce.texture&&_.init(e,Ce,i.renderState)}}for(let fe=0;fe<x.length;fe++){const oe=M[fe],De=x[fe];oe!==null&&De!==void 0&&De.update(oe,ee,c||o)}ue&&ue($,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),g=null}const Ye=new lp;Ye.setAnimationLoop(Ne),this.setAnimationLoop=function($){ue=$},this.dispose=function(){}}}const _r=new Ci,EM=new Ht;function TM(r,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,rp(r)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,E,x,M){m.isMeshBasicMaterial||m.isMeshLambertMaterial?s(p,m):m.isMeshToonMaterial?(s(p,m),d(p,m)):m.isMeshPhongMaterial?(s(p,m),u(p,m)):m.isMeshStandardMaterial?(s(p,m),h(p,m),m.isMeshPhysicalMaterial&&f(p,m,M)):m.isMeshMatcapMaterial?(s(p,m),g(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),_(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,E,x):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Mn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Mn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const E=e.get(m),x=E.envMap,M=E.envMapRotation;x&&(p.envMap.value=x,_r.copy(M),_r.x*=-1,_r.y*=-1,_r.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(_r.y*=-1,_r.z*=-1),p.envMapRotation.value.setFromMatrix4(EM.makeRotationFromEuler(_r)),p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,E,x){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*E,p.scale.value=x*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function h(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,E){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Mn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=E.texture,p.transmissionSamplerSize.value.set(E.width,E.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){const E=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(E.matrixWorld),p.nearDistance.value=E.shadow.camera.near,p.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function bM(r,e,t,n){let i={},s={},o=[];const a=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,x){const M=x.program;n.uniformBlockBinding(E,M)}function c(E,x){let M=i[E.id];M===void 0&&(g(E),M=u(E),i[E.id]=M,E.addEventListener("dispose",p));const w=x.program;n.updateUBOMapping(E,w);const A=e.render.frame;s[E.id]!==A&&(h(E),s[E.id]=A)}function u(E){const x=d();E.__bindingPointIndex=x;const M=r.createBuffer(),w=E.__size,A=E.usage;return r.bindBuffer(r.UNIFORM_BUFFER,M),r.bufferData(r.UNIFORM_BUFFER,w,A),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,x,M),M}function d(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(E){const x=i[E.id],M=E.uniforms,w=E.__cache;r.bindBuffer(r.UNIFORM_BUFFER,x);for(let A=0,T=M.length;A<T;A++){const C=Array.isArray(M[A])?M[A]:[M[A]];for(let S=0,v=C.length;S<v;S++){const L=C[S];if(f(L,A,S,w)===!0){const N=L.__offset,B=Array.isArray(L.value)?L.value:[L.value];let W=0;for(let Y=0;Y<B.length;Y++){const G=B[Y],V=_(G);typeof G=="number"||typeof G=="boolean"?(L.__data[0]=G,r.bufferSubData(r.UNIFORM_BUFFER,N+W,L.__data)):G.isMatrix3?(L.__data[0]=G.elements[0],L.__data[1]=G.elements[1],L.__data[2]=G.elements[2],L.__data[3]=0,L.__data[4]=G.elements[3],L.__data[5]=G.elements[4],L.__data[6]=G.elements[5],L.__data[7]=0,L.__data[8]=G.elements[6],L.__data[9]=G.elements[7],L.__data[10]=G.elements[8],L.__data[11]=0):(G.toArray(L.__data,W),W+=V.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,N,L.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(E,x,M,w){const A=E.value,T=x+"_"+M;if(w[T]===void 0)return typeof A=="number"||typeof A=="boolean"?w[T]=A:w[T]=A.clone(),!0;{const C=w[T];if(typeof A=="number"||typeof A=="boolean"){if(C!==A)return w[T]=A,!0}else if(C.equals(A)===!1)return C.copy(A),!0}return!1}function g(E){const x=E.uniforms;let M=0;const w=16;for(let T=0,C=x.length;T<C;T++){const S=Array.isArray(x[T])?x[T]:[x[T]];for(let v=0,L=S.length;v<L;v++){const N=S[v],B=Array.isArray(N.value)?N.value:[N.value];for(let W=0,Y=B.length;W<Y;W++){const G=B[W],V=_(G),H=M%w;H!==0&&w-H<V.boundary&&(M+=w-H),N.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=M,M+=V.storage}}}const A=M%w;return A>0&&(M+=w-A),E.__size=M,E.__cache={},this}function _(E){const x={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(x.boundary=4,x.storage=4):E.isVector2?(x.boundary=8,x.storage=8):E.isVector3||E.isColor?(x.boundary=16,x.storage=12):E.isVector4?(x.boundary=16,x.storage=16):E.isMatrix3?(x.boundary=48,x.storage=48):E.isMatrix4?(x.boundary=64,x.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),x}function p(E){const x=E.target;x.removeEventListener("dispose",p);const M=o.indexOf(x.__bindingPointIndex);o.splice(M,1),r.deleteBuffer(i[x.id]),delete i[x.id],delete s[x.id]}function m(){for(const E in i)r.deleteBuffer(i[E]);o=[],i={},s={}}return{bind:l,update:c,dispose:m}}class AM{constructor(e={}){const{canvas:t=gg(),context:n=null,depth:i=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=n.getContextAttributes().alpha}else h=o;const f=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const m=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ni,this.toneMapping=Ji,this.toneMappingExposure=1;const x=this;let M=!1,w=0,A=0,T=null,C=-1,S=null;const v=new Zt,L=new Zt;let N=null;const B=new ft(0);let W=0,Y=t.width,G=t.height,V=1,H=null,ae=null;const P=new Zt(0,0,Y,G),ue=new Zt(0,0,Y,G);let Ne=!1;const Ye=new ap;let $=!1,ee=!1;const fe=new Ht,oe=new q,De={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ce=!1;function We(){return T===null?V:1}let D=n;function Oe(b,I){return t.getContext(b,I)}try{const b={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${nu}`),t.addEventListener("webglcontextlost",Q,!1),t.addEventListener("webglcontextrestored",K,!1),t.addEventListener("webglcontextcreationerror",Z,!1),D===null){const I="webgl2";if(D=Oe(I,b),D===null)throw Oe(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let _e,Ve,Se,ze,F,Le,st,R,y,X,J,te,j,Te,ie,ce,Ie,re,ye,we,Fe,he,ke,Xe;function ot(){_e=new Ix(D),_e.init(),he=new _M(D,_e),Ve=new Rx(D,_e,e,he),Se=new pM(D),ze=new Fx(D),F=new eM,Le=new mM(D,_e,Se,F,Ve,he,ze),st=new Px(x),R=new Ux(x),y=new Wg(D),ke=new Ax(D,y),X=new Nx(D,y,ze,ke),J=new zx(D,X,y,ze),ye=new Bx(D,Ve,Le),ce=new Cx(F),te=new QS(x,st,R,_e,Ve,ke,ce),j=new TM(x,F),Te=new nM,ie=new lM(_e),re=new bx(x,st,R,Se,J,h,l),Ie=new dM(x,J,Ve),Xe=new bM(D,ze,Ve,Se),we=new wx(D,_e,ze),Fe=new Ox(D,_e,ze),ze.programs=te.programs,x.capabilities=Ve,x.extensions=_e,x.properties=F,x.renderLists=Te,x.shadowMap=Ie,x.state=Se,x.info=ze}ot();const U=new yM(x,D);this.xr=U,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const b=_e.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=_e.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(b){b!==void 0&&(V=b,this.setSize(Y,G,!1))},this.getSize=function(b){return b.set(Y,G)},this.setSize=function(b,I,z=!0){if(U.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=b,G=I,t.width=Math.floor(b*V),t.height=Math.floor(I*V),z===!0&&(t.style.width=b+"px",t.style.height=I+"px"),this.setViewport(0,0,b,I)},this.getDrawingBufferSize=function(b){return b.set(Y*V,G*V).floor()},this.setDrawingBufferSize=function(b,I,z){Y=b,G=I,V=z,t.width=Math.floor(b*z),t.height=Math.floor(I*z),this.setViewport(0,0,b,I)},this.getCurrentViewport=function(b){return b.copy(v)},this.getViewport=function(b){return b.copy(P)},this.setViewport=function(b,I,z,k){b.isVector4?P.set(b.x,b.y,b.z,b.w):P.set(b,I,z,k),Se.viewport(v.copy(P).multiplyScalar(V).round())},this.getScissor=function(b){return b.copy(ue)},this.setScissor=function(b,I,z,k){b.isVector4?ue.set(b.x,b.y,b.z,b.w):ue.set(b,I,z,k),Se.scissor(L.copy(ue).multiplyScalar(V).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(b){Se.setScissorTest(Ne=b)},this.setOpaqueSort=function(b){H=b},this.setTransparentSort=function(b){ae=b},this.getClearColor=function(b){return b.copy(re.getClearColor())},this.setClearColor=function(){re.setClearColor.apply(re,arguments)},this.getClearAlpha=function(){return re.getClearAlpha()},this.setClearAlpha=function(){re.setClearAlpha.apply(re,arguments)},this.clear=function(b=!0,I=!0,z=!0){let k=0;if(b){let O=!1;if(T!==null){const ne=T.texture.format;O=ne===qd||ne===Yd||ne===Xd}if(O){const ne=T.texture.type,le=ne===rr||ne===Us||ne===Oa||ne===Is||ne===Gd||ne===Wd,me=re.getClearColor(),Me=re.getClearAlpha(),xe=me.r,ge=me.g,Ee=me.b;le?(f[0]=xe,f[1]=ge,f[2]=Ee,f[3]=Me,D.clearBufferuiv(D.COLOR,0,f)):(g[0]=xe,g[1]=ge,g[2]=Ee,g[3]=Me,D.clearBufferiv(D.COLOR,0,g))}else k|=D.COLOR_BUFFER_BIT}I&&(k|=D.DEPTH_BUFFER_BIT),z&&(k|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Q,!1),t.removeEventListener("webglcontextrestored",K,!1),t.removeEventListener("webglcontextcreationerror",Z,!1),Te.dispose(),ie.dispose(),F.dispose(),st.dispose(),R.dispose(),J.dispose(),ke.dispose(),Xe.dispose(),te.dispose(),U.dispose(),U.removeEventListener("sessionstart",Ue),U.removeEventListener("sessionend",be),je.stop()};function Q(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function K(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const b=ze.autoReset,I=Ie.enabled,z=Ie.autoUpdate,k=Ie.needsUpdate,O=Ie.type;ot(),ze.autoReset=b,Ie.enabled=I,Ie.autoUpdate=z,Ie.needsUpdate=k,Ie.type=O}function Z(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function se(b){const I=b.target;I.removeEventListener("dispose",se),Re(I)}function Re(b){Ze(b),F.remove(b)}function Ze(b){const I=F.get(b).programs;I!==void 0&&(I.forEach(function(z){te.releaseProgram(z)}),b.isShaderMaterial&&te.releaseShaderCache(b))}this.renderBufferDirect=function(b,I,z,k,O,ne){I===null&&(I=De);const le=O.isMesh&&O.matrixWorld.determinant()<0,me=Et(b,I,z,k,O);Se.setMaterial(k,le);let Me=z.index,xe=1;if(k.wireframe===!0){if(Me=X.getWireframeAttribute(z),Me===void 0)return;xe=2}const ge=z.drawRange,Ee=z.attributes.position;let rt=ge.start*xe,St=(ge.start+ge.count)*xe;ne!==null&&(rt=Math.max(rt,ne.start*xe),St=Math.min(St,(ne.start+ne.count)*xe)),Me!==null?(rt=Math.max(rt,0),St=Math.min(St,Me.count)):Ee!=null&&(rt=Math.max(rt,0),St=Math.min(St,Ee.count));const mt=St-rt;if(mt<0||mt===1/0)return;ke.setup(O,k,me,z,Me);let Tt,tt=we;if(Me!==null&&(Tt=y.get(Me),tt=Fe,tt.setIndex(Tt)),O.isMesh)k.wireframe===!0?(Se.setLineWidth(k.wireframeLinewidth*We()),tt.setMode(D.LINES)):tt.setMode(D.TRIANGLES);else if(O.isLine){let Ae=k.linewidth;Ae===void 0&&(Ae=1),Se.setLineWidth(Ae*We()),O.isLineSegments?tt.setMode(D.LINES):O.isLineLoop?tt.setMode(D.LINE_LOOP):tt.setMode(D.LINE_STRIP)}else O.isPoints?tt.setMode(D.POINTS):O.isSprite&&tt.setMode(D.TRIANGLES);if(O.isBatchedMesh)O._multiDrawInstances!==null?tt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances):tt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else if(O.isInstancedMesh)tt.renderInstances(rt,mt,O.count);else if(z.isInstancedBufferGeometry){const Ae=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,bt=Math.min(z.instanceCount,Ae);tt.renderInstances(rt,mt,bt)}else tt.render(rt,mt)};function dt(b,I,z){b.transparent===!0&&b.side===si&&b.forceSinglePass===!1?(b.side=Mn,b.needsUpdate=!0,qe(b,I,z),b.side=ir,b.needsUpdate=!0,qe(b,I,z),b.side=si):qe(b,I,z)}this.compile=function(b,I,z=null){z===null&&(z=b),p=ie.get(z),p.init(I),E.push(p),z.traverseVisible(function(O){O.isLight&&O.layers.test(I.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),b!==z&&b.traverseVisible(function(O){O.isLight&&O.layers.test(I.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();const k=new Set;return b.traverse(function(O){const ne=O.material;if(ne)if(Array.isArray(ne))for(let le=0;le<ne.length;le++){const me=ne[le];dt(me,z,O),k.add(me)}else dt(ne,z,O),k.add(ne)}),E.pop(),p=null,k},this.compileAsync=function(b,I,z=null){const k=this.compile(b,I,z);return new Promise(O=>{function ne(){if(k.forEach(function(le){F.get(le).currentProgram.isReady()&&k.delete(le)}),k.size===0){O(b);return}setTimeout(ne,10)}_e.get("KHR_parallel_shader_compile")!==null?ne():setTimeout(ne,10)})};let pt=null;function it(b){pt&&pt(b)}function Ue(){je.stop()}function be(){je.start()}const je=new lp;je.setAnimationLoop(it),typeof self<"u"&&je.setContext(self),this.setAnimationLoop=function(b){pt=b,U.setAnimationLoop(b),b===null?je.stop():je.start()},U.addEventListener("sessionstart",Ue),U.addEventListener("sessionend",be),this.render=function(b,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),U.enabled===!0&&U.isPresenting===!0&&(U.cameraAutoUpdate===!0&&U.updateCamera(I),I=U.getCamera()),b.isScene===!0&&b.onBeforeRender(x,b,I,T),p=ie.get(b,E.length),p.init(I),E.push(p),fe.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Ye.setFromProjectionMatrix(fe),ee=this.localClippingEnabled,$=ce.init(this.clippingPlanes,ee),_=Te.get(b,m.length),_.init(),m.push(_),U.enabled===!0&&U.isPresenting===!0){const ne=x.xr.getDepthSensingMesh();ne!==null&&de(ne,I,-1/0,x.sortObjects)}de(b,I,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(H,ae),Ce=U.enabled===!1||U.isPresenting===!1||U.hasDepthSensing()===!1,Ce&&re.addToRenderList(_,b),this.info.render.frame++,$===!0&&ce.beginShadows();const z=p.state.shadowsArray;Ie.render(z,b,I),$===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=_.opaque,O=_.transmissive;if(p.setupLights(),I.isArrayCamera){const ne=I.cameras;if(O.length>0)for(let le=0,me=ne.length;le<me;le++){const Me=ne[le];Pe(k,O,b,Me)}Ce&&re.render(b);for(let le=0,me=ne.length;le<me;le++){const Me=ne[le];He(_,b,Me,Me.viewport)}}else O.length>0&&Pe(k,O,b,I),Ce&&re.render(b),He(_,b,I);T!==null&&(Le.updateMultisampleRenderTarget(T),Le.updateRenderTargetMipmap(T)),b.isScene===!0&&b.onAfterRender(x,b,I),ke.resetDefaultState(),C=-1,S=null,E.pop(),E.length>0?(p=E[E.length-1],$===!0&&ce.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,m.pop(),m.length>0?_=m[m.length-1]:_=null};function de(b,I,z,k){if(b.visible===!1)return;if(b.layers.test(I.layers)){if(b.isGroup)z=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(I);else if(b.isLight)p.pushLight(b),b.castShadow&&p.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Ye.intersectsSprite(b)){k&&oe.setFromMatrixPosition(b.matrixWorld).applyMatrix4(fe);const le=J.update(b),me=b.material;me.visible&&_.push(b,le,me,z,oe.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Ye.intersectsObject(b))){const le=J.update(b),me=b.material;if(k&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),oe.copy(b.boundingSphere.center)):(le.boundingSphere===null&&le.computeBoundingSphere(),oe.copy(le.boundingSphere.center)),oe.applyMatrix4(b.matrixWorld).applyMatrix4(fe)),Array.isArray(me)){const Me=le.groups;for(let xe=0,ge=Me.length;xe<ge;xe++){const Ee=Me[xe],rt=me[Ee.materialIndex];rt&&rt.visible&&_.push(b,le,rt,z,oe.z,Ee)}}else me.visible&&_.push(b,le,me,z,oe.z,null)}}const ne=b.children;for(let le=0,me=ne.length;le<me;le++)de(ne[le],I,z,k)}function He(b,I,z,k){const O=b.opaque,ne=b.transmissive,le=b.transparent;p.setupLightsView(z),$===!0&&ce.setGlobalState(x.clippingPlanes,z),k&&Se.viewport(v.copy(k)),O.length>0&&Be(O,I,z),ne.length>0&&Be(ne,I,z),le.length>0&&Be(le,I,z),Se.buffers.depth.setTest(!0),Se.buffers.depth.setMask(!0),Se.buffers.color.setMask(!0),Se.setPolygonOffset(!1)}function Pe(b,I,z,k){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[k.id]===void 0&&(p.state.transmissionRenderTarget[k.id]=new kr(1,1,{generateMipmaps:!0,type:_e.has("EXT_color_buffer_half_float")||_e.has("EXT_color_buffer_float")?qa:rr,minFilter:Rr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ht.workingColorSpace}));const ne=p.state.transmissionRenderTarget[k.id],le=k.viewport||v;ne.setSize(le.z,le.w);const me=x.getRenderTarget();x.setRenderTarget(ne),x.getClearColor(B),W=x.getClearAlpha(),W<1&&x.setClearColor(16777215,.5),Ce?re.render(z):x.clear();const Me=x.toneMapping;x.toneMapping=Ji;const xe=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),p.setupLightsView(k),$===!0&&ce.setGlobalState(x.clippingPlanes,k),Be(b,z,k),Le.updateMultisampleRenderTarget(ne),Le.updateRenderTargetMipmap(ne),_e.has("WEBGL_multisampled_render_to_texture")===!1){let ge=!1;for(let Ee=0,rt=I.length;Ee<rt;Ee++){const St=I[Ee],mt=St.object,Tt=St.geometry,tt=St.material,Ae=St.group;if(tt.side===si&&mt.layers.test(k.layers)){const bt=tt.side;tt.side=Mn,tt.needsUpdate=!0,Lt(mt,z,k,Tt,tt,Ae),tt.side=bt,tt.needsUpdate=!0,ge=!0}}ge===!0&&(Le.updateMultisampleRenderTarget(ne),Le.updateRenderTargetMipmap(ne))}x.setRenderTarget(me),x.setClearColor(B,W),xe!==void 0&&(k.viewport=xe),x.toneMapping=Me}function Be(b,I,z){const k=I.isScene===!0?I.overrideMaterial:null;for(let O=0,ne=b.length;O<ne;O++){const le=b[O],me=le.object,Me=le.geometry,xe=k===null?le.material:k,ge=le.group;me.layers.test(z.layers)&&Lt(me,I,z,Me,xe,ge)}}function Lt(b,I,z,k,O,ne){b.onBeforeRender(x,I,z,k,O,ne),b.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),O.onBeforeRender(x,I,z,k,b,ne),O.transparent===!0&&O.side===si&&O.forceSinglePass===!1?(O.side=Mn,O.needsUpdate=!0,x.renderBufferDirect(z,I,k,O,b,ne),O.side=ir,O.needsUpdate=!0,x.renderBufferDirect(z,I,k,O,b,ne),O.side=si):x.renderBufferDirect(z,I,k,O,b,ne),b.onAfterRender(x,I,z,k,O,ne)}function qe(b,I,z){I.isScene!==!0&&(I=De);const k=F.get(b),O=p.state.lights,ne=p.state.shadowsArray,le=O.state.version,me=te.getParameters(b,O.state,ne,I,z),Me=te.getProgramCacheKey(me);let xe=k.programs;k.environment=b.isMeshStandardMaterial?I.environment:null,k.fog=I.fog,k.envMap=(b.isMeshStandardMaterial?R:st).get(b.envMap||k.environment),k.envMapRotation=k.environment!==null&&b.envMap===null?I.environmentRotation:b.envMapRotation,xe===void 0&&(b.addEventListener("dispose",se),xe=new Map,k.programs=xe);let ge=xe.get(Me);if(ge!==void 0){if(k.currentProgram===ge&&k.lightsStateVersion===le)return Ft(b,me),ge}else me.uniforms=te.getUniforms(b),b.onBuild(z,me,x),b.onBeforeCompile(me,x),ge=te.acquireProgram(me,Me),xe.set(Me,ge),k.uniforms=me.uniforms;const Ee=k.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ee.clippingPlanes=ce.uniform),Ft(b,me),k.needsLights=ct(b),k.lightsStateVersion=le,k.needsLights&&(Ee.ambientLightColor.value=O.state.ambient,Ee.lightProbe.value=O.state.probe,Ee.directionalLights.value=O.state.directional,Ee.directionalLightShadows.value=O.state.directionalShadow,Ee.spotLights.value=O.state.spot,Ee.spotLightShadows.value=O.state.spotShadow,Ee.rectAreaLights.value=O.state.rectArea,Ee.ltc_1.value=O.state.rectAreaLTC1,Ee.ltc_2.value=O.state.rectAreaLTC2,Ee.pointLights.value=O.state.point,Ee.pointLightShadows.value=O.state.pointShadow,Ee.hemisphereLights.value=O.state.hemi,Ee.directionalShadowMap.value=O.state.directionalShadowMap,Ee.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ee.spotShadowMap.value=O.state.spotShadowMap,Ee.spotLightMatrix.value=O.state.spotLightMatrix,Ee.spotLightMap.value=O.state.spotLightMap,Ee.pointShadowMap.value=O.state.pointShadowMap,Ee.pointShadowMatrix.value=O.state.pointShadowMatrix),k.currentProgram=ge,k.uniformsList=null,ge}function yt(b){if(b.uniformsList===null){const I=b.currentProgram.getUniforms();b.uniformsList=Ea.seqWithValue(I.seq,b.uniforms)}return b.uniformsList}function Ft(b,I){const z=F.get(b);z.outputColorSpace=I.outputColorSpace,z.batching=I.batching,z.batchingColor=I.batchingColor,z.instancing=I.instancing,z.instancingColor=I.instancingColor,z.instancingMorph=I.instancingMorph,z.skinning=I.skinning,z.morphTargets=I.morphTargets,z.morphNormals=I.morphNormals,z.morphColors=I.morphColors,z.morphTargetsCount=I.morphTargetsCount,z.numClippingPlanes=I.numClippingPlanes,z.numIntersection=I.numClipIntersection,z.vertexAlphas=I.vertexAlphas,z.vertexTangents=I.vertexTangents,z.toneMapping=I.toneMapping}function Et(b,I,z,k,O){I.isScene!==!0&&(I=De),Le.resetTextureUnits();const ne=I.fog,le=k.isMeshStandardMaterial?I.environment:null,me=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:or,Me=(k.isMeshStandardMaterial?R:st).get(k.envMap||le),xe=k.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,ge=!!z.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Ee=!!z.morphAttributes.position,rt=!!z.morphAttributes.normal,St=!!z.morphAttributes.color;let mt=Ji;k.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(mt=x.toneMapping);const Tt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,tt=Tt!==void 0?Tt.length:0,Ae=F.get(k),bt=p.state.lights;if($===!0&&(ee===!0||b!==S)){const Bn=b===S&&k.id===C;ce.setState(k,b,Bn)}let _t=!1;k.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==bt.state.version||Ae.outputColorSpace!==me||O.isBatchedMesh&&Ae.batching===!1||!O.isBatchedMesh&&Ae.batching===!0||O.isBatchedMesh&&Ae.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ae.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ae.instancing===!1||!O.isInstancedMesh&&Ae.instancing===!0||O.isSkinnedMesh&&Ae.skinning===!1||!O.isSkinnedMesh&&Ae.skinning===!0||O.isInstancedMesh&&Ae.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ae.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ae.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ae.instancingMorph===!1&&O.morphTexture!==null||Ae.envMap!==Me||k.fog===!0&&Ae.fog!==ne||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==ce.numPlanes||Ae.numIntersection!==ce.numIntersection)||Ae.vertexAlphas!==xe||Ae.vertexTangents!==ge||Ae.morphTargets!==Ee||Ae.morphNormals!==rt||Ae.morphColors!==St||Ae.toneMapping!==mt||Ae.morphTargetsCount!==tt)&&(_t=!0):(_t=!0,Ae.__version=k.version);let di=Ae.currentProgram;_t===!0&&(di=qe(k,I,O));let Co=!1,lr=!1,Ja=!1;const Wt=di.getUniforms(),Li=Ae.uniforms;if(Se.useProgram(di.program)&&(Co=!0,lr=!0,Ja=!0),k.id!==C&&(C=k.id,lr=!0),Co||S!==b){Wt.setValue(D,"projectionMatrix",b.projectionMatrix),Wt.setValue(D,"viewMatrix",b.matrixWorldInverse);const Bn=Wt.map.cameraPosition;Bn!==void 0&&Bn.setValue(D,oe.setFromMatrixPosition(b.matrixWorld)),Ve.logarithmicDepthBuffer&&Wt.setValue(D,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&Wt.setValue(D,"isOrthographic",b.isOrthographicCamera===!0),S!==b&&(S=b,lr=!0,Ja=!0)}if(O.isSkinnedMesh){Wt.setOptional(D,O,"bindMatrix"),Wt.setOptional(D,O,"bindMatrixInverse");const Bn=O.skeleton;Bn&&(Bn.boneTexture===null&&Bn.computeBoneTexture(),Wt.setValue(D,"boneTexture",Bn.boneTexture,Le))}O.isBatchedMesh&&(Wt.setOptional(D,O,"batchingTexture"),Wt.setValue(D,"batchingTexture",O._matricesTexture,Le),Wt.setOptional(D,O,"batchingColorTexture"),O._colorsTexture!==null&&Wt.setValue(D,"batchingColorTexture",O._colorsTexture,Le));const Qa=z.morphAttributes;if((Qa.position!==void 0||Qa.normal!==void 0||Qa.color!==void 0)&&ye.update(O,z,di),(lr||Ae.receiveShadow!==O.receiveShadow)&&(Ae.receiveShadow=O.receiveShadow,Wt.setValue(D,"receiveShadow",O.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(Li.envMap.value=Me,Li.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&I.environment!==null&&(Li.envMapIntensity.value=I.environmentIntensity),lr&&(Wt.setValue(D,"toneMappingExposure",x.toneMappingExposure),Ae.needsLights&&xt(Li,Ja),ne&&k.fog===!0&&j.refreshFogUniforms(Li,ne),j.refreshMaterialUniforms(Li,k,V,G,p.state.transmissionRenderTarget[b.id]),Ea.upload(D,yt(Ae),Li,Le)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Ea.upload(D,yt(Ae),Li,Le),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&Wt.setValue(D,"center",O.center),Wt.setValue(D,"modelViewMatrix",O.modelViewMatrix),Wt.setValue(D,"normalMatrix",O.normalMatrix),Wt.setValue(D,"modelMatrix",O.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Bn=k.uniformsGroups;for(let el=0,_p=Bn.length;el<_p;el++){const ou=Bn[el];Xe.update(ou,di),Xe.bind(ou,di)}}return di}function xt(b,I){b.ambientLightColor.needsUpdate=I,b.lightProbe.needsUpdate=I,b.directionalLights.needsUpdate=I,b.directionalLightShadows.needsUpdate=I,b.pointLights.needsUpdate=I,b.pointLightShadows.needsUpdate=I,b.spotLights.needsUpdate=I,b.spotLightShadows.needsUpdate=I,b.rectAreaLights.needsUpdate=I,b.hemisphereLights.needsUpdate=I}function ct(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(b,I,z){F.get(b.texture).__webglTexture=I,F.get(b.depthTexture).__webglTexture=z;const k=F.get(b);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=z===void 0,k.__autoAllocateDepthBuffer||_e.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,I){const z=F.get(b);z.__webglFramebuffer=I,z.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(b,I=0,z=0){T=b,w=I,A=z;let k=!0,O=null,ne=!1,le=!1;if(b){const Me=F.get(b);Me.__useDefaultFramebuffer!==void 0?(Se.bindFramebuffer(D.FRAMEBUFFER,null),k=!1):Me.__webglFramebuffer===void 0?Le.setupRenderTarget(b):Me.__hasExternalTextures&&Le.rebindTextures(b,F.get(b.texture).__webglTexture,F.get(b.depthTexture).__webglTexture);const xe=b.texture;(xe.isData3DTexture||xe.isDataArrayTexture||xe.isCompressedArrayTexture)&&(le=!0);const ge=F.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ge[I])?O=ge[I][z]:O=ge[I],ne=!0):b.samples>0&&Le.useMultisampledRTT(b)===!1?O=F.get(b).__webglMultisampledFramebuffer:Array.isArray(ge)?O=ge[z]:O=ge,v.copy(b.viewport),L.copy(b.scissor),N=b.scissorTest}else v.copy(P).multiplyScalar(V).floor(),L.copy(ue).multiplyScalar(V).floor(),N=Ne;if(Se.bindFramebuffer(D.FRAMEBUFFER,O)&&k&&Se.drawBuffers(b,O),Se.viewport(v),Se.scissor(L),Se.setScissorTest(N),ne){const Me=F.get(b.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+I,Me.__webglTexture,z)}else if(le){const Me=F.get(b.texture),xe=I||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Me.__webglTexture,z||0,xe)}C=-1},this.readRenderTargetPixels=function(b,I,z,k,O,ne,le){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let me=F.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&le!==void 0&&(me=me[le]),me){Se.bindFramebuffer(D.FRAMEBUFFER,me);try{const Me=b.texture,xe=Me.format,ge=Me.type;if(!Ve.textureFormatReadable(xe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ve.textureTypeReadable(ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=b.width-k&&z>=0&&z<=b.height-O&&D.readPixels(I,z,k,O,he.convert(xe),he.convert(ge),ne)}finally{const Me=T!==null?F.get(T).__webglFramebuffer:null;Se.bindFramebuffer(D.FRAMEBUFFER,Me)}}},this.readRenderTargetPixelsAsync=async function(b,I,z,k,O,ne,le){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let me=F.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&le!==void 0&&(me=me[le]),me){Se.bindFramebuffer(D.FRAMEBUFFER,me);try{const Me=b.texture,xe=Me.format,ge=Me.type;if(!Ve.textureFormatReadable(xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ve.textureTypeReadable(ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=b.width-k&&z>=0&&z<=b.height-O){const Ee=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ee),D.bufferData(D.PIXEL_PACK_BUFFER,ne.byteLength,D.STREAM_READ),D.readPixels(I,z,k,O,he.convert(xe),he.convert(ge),0),D.flush();const rt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);await vg(D,rt,4);try{D.bindBuffer(D.PIXEL_PACK_BUFFER,Ee),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,ne)}finally{D.deleteBuffer(Ee),D.deleteSync(rt)}return ne}}finally{const Me=T!==null?F.get(T).__webglFramebuffer:null;Se.bindFramebuffer(D.FRAMEBUFFER,Me)}}},this.copyFramebufferToTexture=function(b,I=null,z=0){b.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,b=arguments[1]);const k=Math.pow(2,-z),O=Math.floor(b.image.width*k),ne=Math.floor(b.image.height*k),le=I!==null?I.x:0,me=I!==null?I.y:0;Le.setTexture2D(b,0),D.copyTexSubImage2D(D.TEXTURE_2D,z,0,0,le,me,O,ne),Se.unbindTexture()},this.copyTextureToTexture=function(b,I,z=null,k=null,O=0){b.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,b=arguments[1],I=arguments[2],O=arguments[3]||0,z=null);let ne,le,me,Me,xe,ge;z!==null?(ne=z.max.x-z.min.x,le=z.max.y-z.min.y,me=z.min.x,Me=z.min.y):(ne=b.image.width,le=b.image.height,me=0,Me=0),k!==null?(xe=k.x,ge=k.y):(xe=0,ge=0);const Ee=he.convert(I.format),rt=he.convert(I.type);Le.setTexture2D(I,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,I.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,I.unpackAlignment);const St=D.getParameter(D.UNPACK_ROW_LENGTH),mt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Tt=D.getParameter(D.UNPACK_SKIP_PIXELS),tt=D.getParameter(D.UNPACK_SKIP_ROWS),Ae=D.getParameter(D.UNPACK_SKIP_IMAGES),bt=b.isCompressedTexture?b.mipmaps[O]:b.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,bt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,bt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,me),D.pixelStorei(D.UNPACK_SKIP_ROWS,Me),b.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,O,xe,ge,ne,le,Ee,rt,bt.data):b.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,O,xe,ge,bt.width,bt.height,Ee,bt.data):D.texSubImage2D(D.TEXTURE_2D,O,xe,ge,Ee,rt,bt),D.pixelStorei(D.UNPACK_ROW_LENGTH,St),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,mt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Tt),D.pixelStorei(D.UNPACK_SKIP_ROWS,tt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ae),O===0&&I.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),Se.unbindTexture()},this.copyTextureToTexture3D=function(b,I,z=null,k=null,O=0){b.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,k=arguments[1]||null,b=arguments[2],I=arguments[3],O=arguments[4]||0);let ne,le,me,Me,xe,ge,Ee,rt,St;const mt=b.isCompressedTexture?b.mipmaps[O]:b.image;z!==null?(ne=z.max.x-z.min.x,le=z.max.y-z.min.y,me=z.max.z-z.min.z,Me=z.min.x,xe=z.min.y,ge=z.min.z):(ne=mt.width,le=mt.height,me=mt.depth,Me=0,xe=0,ge=0),k!==null?(Ee=k.x,rt=k.y,St=k.z):(Ee=0,rt=0,St=0);const Tt=he.convert(I.format),tt=he.convert(I.type);let Ae;if(I.isData3DTexture)Le.setTexture3D(I,0),Ae=D.TEXTURE_3D;else if(I.isDataArrayTexture||I.isCompressedArrayTexture)Le.setTexture2DArray(I,0),Ae=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,I.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,I.unpackAlignment);const bt=D.getParameter(D.UNPACK_ROW_LENGTH),_t=D.getParameter(D.UNPACK_IMAGE_HEIGHT),di=D.getParameter(D.UNPACK_SKIP_PIXELS),Co=D.getParameter(D.UNPACK_SKIP_ROWS),lr=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,mt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,mt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Me),D.pixelStorei(D.UNPACK_SKIP_ROWS,xe),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ge),b.isDataTexture||b.isData3DTexture?D.texSubImage3D(Ae,O,Ee,rt,St,ne,le,me,Tt,tt,mt.data):I.isCompressedArrayTexture?D.compressedTexSubImage3D(Ae,O,Ee,rt,St,ne,le,me,Tt,mt.data):D.texSubImage3D(Ae,O,Ee,rt,St,ne,le,me,Tt,tt,mt),D.pixelStorei(D.UNPACK_ROW_LENGTH,bt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,_t),D.pixelStorei(D.UNPACK_SKIP_PIXELS,di),D.pixelStorei(D.UNPACK_SKIP_ROWS,Co),D.pixelStorei(D.UNPACK_SKIP_IMAGES,lr),O===0&&I.generateMipmaps&&D.generateMipmap(Ae),Se.unbindTexture()},this.initRenderTarget=function(b){F.get(b).__webglFramebuffer===void 0&&Le.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Le.setTextureCube(b,0):b.isData3DTexture?Le.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Le.setTexture2DArray(b,0):Le.setTexture2D(b,0),Se.unbindTexture()},this.resetState=function(){w=0,A=0,T=null,Se.reset(),ke.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===iu?"display-p3":"srgb",t.unpackColorSpace=ht.workingColorSpace===$a?"display-p3":"srgb"}}class wM extends Nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ci,this.environmentIntensity=1,this.environmentRotation=new Ci,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class RM extends Pi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:nu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=nu);const gr=document.getElementById("shader-canvas");if(gr){const r=new AM({canvas:gr,alpha:!1,antialias:!1});r.setPixelRatio(Math.min(window.devicePixelRatio,2)),r.setClearColor(new ft(0));const e=new wM,t=new cp(-1,1,1,-1,0,-1),n={resolution:{value:[gr.clientWidth,gr.clientHeight]},time:{value:0},xScale:{value:1},yScale:{value:.36},distortion:{value:.06}},i=`
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,s=`
      precision highp float;
      uniform vec2  resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        float d  = length(p) * distortion;
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);
        float r  = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g  = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b  = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `,o=new Qn(new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,-1,0,-1,1,0,1,1,0]),3),a=new ar;a.setAttribute("position",o);const l=new RM({vertexShader:i,fragmentShader:s,uniforms:n,side:si});e.add(new ui(a,l));const c=()=>{const f=gr.parentElement?.clientWidth??window.innerWidth,g=gr.parentElement?.clientHeight??window.innerHeight;r.setSize(f,g,!1),n.resolution.value=[f,g]};c();let u=0;const d=()=>{n.time.value+=.008,r.render(e,t),u=requestAnimationFrame(d)};d(),window.addEventListener("resize",c),new IntersectionObserver(([f])=>{f.isIntersecting?d():cancelAnimationFrame(u)},{threshold:0}).observe(gr.parentElement)}kt.set(["#h-card","#h-badge","#h-title","#h-sub","#h-ctas","#h-screenshot","#h-trust"],{opacity:0});const CM=kt.timeline({delay:.1});CM.fromTo("#h-card",{opacity:0,y:32},{opacity:1,y:0,duration:.7,ease:"power3.out"}).fromTo("#h-badge",{opacity:0,y:14},{opacity:1,y:0,duration:.5,ease:"power2.out"},"-=0.5").fromTo("#h-title",{opacity:0,y:36},{opacity:1,y:0,duration:.75,ease:"power3.out"},"-=0.35").fromTo("#h-sub",{opacity:0,y:24},{opacity:1,y:0,duration:.65,ease:"power3.out"},"-=0.45").fromTo("#h-ctas",{opacity:0,y:18},{opacity:1,y:0,duration:.55,ease:"power3.out"},"-=0.35").fromTo("#h-screenshot",{opacity:0,y:40,scale:.975},{opacity:1,y:0,scale:1,duration:.85,ease:"power3.out"},"-=0.2").fromTo("#h-trust",{opacity:0},{opacity:1,duration:.5,ease:"power2.out"},"-=0.3");kt.registerPlugin(Ge);kt.from(".feature-card",{opacity:0,y:36,duration:.7,stagger:.09,ease:"power3.out",scrollTrigger:{trigger:"#features",start:"top 75%",toggleActions:"play none none none"}});const $l=document.getElementById("live-log"),xi=document.getElementById("log-container");if($l&&xi){let r=function(){if(xi.innerHTML="",e.forEach((n,i)=>{const s=n.cloneNode(!0);s.style.opacity="0",s.style.transform="translateY(4px)",xi.appendChild(s);const o=Array.from(s.children)[1];o&&(o.style.clipPath="inset(0 100% 0 0)"),kt.to(s,{opacity:1,y:0,duration:.2,delay:i*.6,ease:"power2.out",onComplete:()=>{o&&kt.to(o,{clipPath:"inset(0 0% 0 0)",duration:.45,ease:"none"}),xi.scrollTop=xi.scrollHeight}})}),t){const n=t.cloneNode(!0);n.style.opacity="0",xi.appendChild(n),kt.to(n,{opacity:1,duration:.5,delay:e.length*.6+.3,ease:"power2.out",onComplete:()=>{xi.scrollTop=xi.scrollHeight}})}};const e=Array.from($l.querySelectorAll(".log-line")),t=$l.querySelector(".log-disclaimer");Ge.create({trigger:"#feature-terminal-card",start:"top 72%",onEnter:r,onLeaveBack:()=>{xi.innerHTML=""}})}kt.registerPlugin(Ge);kt.from(".hiw-step",{opacity:0,y:40,duration:.7,stagger:.13,ease:"power3.out",scrollTrigger:{trigger:"#how-it-works",start:"top 72%",toggleActions:"play none none none"}});kt.from(".hiw-flow-arrow",{opacity:0,x:-8,duration:.4,stagger:.15,ease:"power2.out",scrollTrigger:{trigger:".hiw-flow-arrow",start:"top 88%",toggleActions:"play none none none"}});kt.registerPlugin(Ge);kt.from(".screen-card",{opacity:0,y:32,duration:.65,stagger:.1,ease:"power3.out",scrollTrigger:{trigger:"#screenshots",start:"top 72%",toggleActions:"play none none none"}});const Kl=document.getElementById("copy-btn"),fa=document.getElementById("copy-label"),da=document.getElementById("copy-icon"),PM=["curl -fsSL https://deploymanager.parthrb.dev/install.sh -o install.sh",'echo "b4fd20fe738b0200956bf0710606affd7f1d56514b55c203056f2e5fb6353791  install.sh" | sha256sum -c',"sudo bash install.sh"].join(`
`);Kl?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(PM),fa&&(fa.textContent="Copied!"),da&&(da.innerHTML='<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>'),Kl?.classList.add("text-emerald-400","border-emerald-500/30"),setTimeout(()=>{fa&&(fa.textContent="Copy"),da&&(da.innerHTML='<path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>'),Kl?.classList.remove("text-emerald-400","border-emerald-500/30")},2e3)}catch{}});kt.registerPlugin(Ge);kt.from(".tech-card",{opacity:0,y:24,scale:.95,duration:.5,stagger:.045,ease:"power2.out",scrollTrigger:{trigger:"#tech",start:"top 75%",toggleActions:"play none none none"}});document.getElementById("back-to-top")?.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})});
