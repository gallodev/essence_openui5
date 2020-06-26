/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/InvisibleText","sap/base/Log","./Slider","./SliderTooltip","./SliderUtilities","./RangeSliderRenderer","sap/ui/thirdparty/jquery","sap/ui/events/KeyCodes"],function(I,l,S,a,b,R,q,K){"use strict";var c=S.extend("sap.m.RangeSlider",{metadata:{library:"sap.m",properties:{value2:{type:"float",group:"Data",defaultValue:100},range:{type:"float[]",group:"Data",defaultValue:[0,100]}},designtime:"sap/m/designtime/RangeSlider.designtime"}});c.prototype.init=function(){var s,e,r;S.prototype.init.call(this,arguments);this._bInitialRangeChecks=true;this._aInitialFocusRange=this.getRange();this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle('sap.m');this._ariaUpdateDelay=[];s=new I({text:this._oResourceBundle.getText("RANGE_SLIDER_LEFT_HANDLE")});e=new I({text:this._oResourceBundle.getText("RANGE_SLIDER_RIGHT_HANDLE")});r=new I({text:this._oResourceBundle.getText("RANGE_SLIDER_RANGE_HANDLE")});this.destroyAggregation("_handlesLabels",true);this.addAggregation("_handlesLabels",s);this.addAggregation("_handlesLabels",e);this.addAggregation("_handlesLabels",r);this._mHandleTooltip={start:{handle:null,tooltip:null,label:s},end:{handle:null,tooltip:null,label:e}};};c.prototype.exit=function(){this._oResourceBundle=null;this._aInitialFocusRange=null;this._liveChangeLastValue=null;this._mHandleTooltip.start.handle=null;this._mHandleTooltip.start.tooltip=null;this._mHandleTooltip.start.label=null;this._mHandleTooltip.end.handle=null;this._mHandleTooltip.end.tooltip=null;this._mHandleTooltip.end.label=null;this._ariaUpdateDelay=null;};c.prototype.onBeforeRendering=function(){this._bRTL=sap.ui.getCore().getConfiguration().getRTL();var r=this.getRange();if(this.getShowAdvancedTooltip()){this.initAndSyncTooltips(["leftTooltip","rightTooltip"]);this._storeTooltipsMetadata();}this._bInitialRangeChecks=false;this._iDecimalPrecision=this.getDecimalPrecisionOfNumber(this.getStep());this.setRange(r);this._validateProperties();this._syncScaleUsage();};c.prototype.onAfterRendering=function(){S.prototype.onAfterRendering.apply(this,arguments);var r=this.getRange();this._mHandleTooltip.start.handle=this.getDomRef("handle1");this._mHandleTooltip.end.handle=this.getDomRef("handle2");this._recalculateStyles();this._updateHandle(this._mHandleTooltip.start.handle,r[0]);this._updateHandle(this._mHandleTooltip.end.handle,r[1]);if(this.getShowAdvancedTooltip()&&(r[0]>r[1])){this._swapTooltips(r);}};c.prototype._storeTooltipsMetadata=function(){var t=this.getUsedTooltips();if(!this._mHandleTooltip.start.tooltip){this._mHandleTooltip.start.tooltip=t[0];}if(!this._mHandleTooltip.end.tooltip){this._mHandleTooltip.end.tooltip=t[1];}this._mHandleTooltip.bTooltipsSwapped=false;};c.prototype._recalculateRange=function(){var h,s,e,p,d=this._bRTL?"right":"left";h=[parseFloat(this._mHandleTooltip.start.handle.style[d]),parseFloat(this._mHandleTooltip.end.handle.style[d])];s=Math.min.apply(Math,h)+"%";e=(100-Math.max.apply(Math,h))+"%";p=this.getDomRef("progress");if(this._bRTL){p.style.left=e;p.style.right=s;}else{p.style.left=s;p.style.right=e;}};c.prototype.getClosestHandleDomRef=function(e){var h=this._mHandleTooltip.start.handle,H=this._mHandleTooltip.end.handle,p=Math.abs(e.pageX-h.offsetLeft-this._fSliderPaddingLeft-this._fSliderOffsetLeft),C=Math.abs(e.clientX-H.offsetLeft-this._fSliderPaddingLeft-this._fSliderOffsetLeft);return p>C?H:h;};c.prototype._getIndexOfHandle=function(h){if(h&&h.getAttribute&&h.getAttribute("data-range-val")==="start"){return 0;}else if(h&&h.getAttribute&&h.getAttribute("data-range-val")==="end"){return 1;}else{return-1;}};c.prototype._getHandleForTooltip=function(t){var h=t===this._mHandleTooltip.start.tooltip?this._mHandleTooltip.start.handle:this._mHandleTooltip.end.handle;return h;};c.prototype._updateHandle=function(h,v){var t=(this._mHandleTooltip.start.handle===h)?this._mHandleTooltip.start.tooltip:this._mHandleTooltip.end.tooltip,r=this.getRange(),i=this._getIndexOfHandle(h),p=this._getPercentOfValue(v);r[i]=v;this._updateRangePropertyDependencies(r);this._updateHandleDom(h,r,i,v,p);if(this.getShowAdvancedTooltip()){this._updateTooltipContent(t,v);this._adjustTooltipsContainer();}this._recalculateRange();};c.prototype._updateHandleDom=function(h,r,i,v,p){var m,C=this.getRenderer().CSS_CLASS,f=this.getDomRef("input");if(!!this.getName()){f.setAttribute(h.getAttribute("data-range-val"),this.toFixed(r[i],this._iDecimalPrecision));f.setAttribute("value",this.getValue());}if(this._bRTL){h.style.right=p+"%";}else{h.style.left=p+"%";}if(this.getShowHandleTooltip()&&!this.getShowAdvancedTooltip()){h.title=this._formatValueByCustomElement(v);}m=r[0]===r[1];this.$("handle1").toggleClass(C+"HandleOverlap",m);this.$("handle2").toggleClass(C+"HandleOverlap",m);clearTimeout(this._ariaUpdateDelay[i]);this._ariaUpdateDelay[i]=setTimeout(this["_updateHandleAria"].bind(this,h,v),100);};c.prototype._updateHandleAria=function(h,v){var r=this.getRange(),p=this.getDomRef("progress"),n=this.toFixed(v,this._iDecimalPrecision),s=this._formatValueByCustomElement(n);r[0]=this.toFixed(r[0],this._iDecimalPrecision);r[1]=this.toFixed(r[1],this._iDecimalPrecision);this._updateHandlesAriaLabels();this._updateHandleAriaAttributeValues(h,v,s);if(p){p.setAttribute("aria-valuetext",this._oResourceBundle.getText('RANGE_SLIDER_RANGE_ANNOUNCEMENT',r.map(this._formatValueByCustomElement,this)));}};c.prototype._updateHandlesAriaLabels=function(){var r=this.getRange(),t=this._mHandleTooltip.start.label;if((r[0]>r[1]&&!this._mHandleTooltip.bAriaHandlesSwapped)||(r[0]<r[1]&&this._mHandleTooltip.bAriaHandlesSwapped)){this._mHandleTooltip.start.label=this._mHandleTooltip.end.label;this._mHandleTooltip.end.label=t;if(this._mHandleTooltip.start.handle){this._mHandleTooltip.start.handle.setAttribute("aria-labelledby",this._mHandleTooltip.start.label.getId());}if(this._mHandleTooltip.end.handle){this._mHandleTooltip.end.handle.setAttribute("aria-labelledby",this._mHandleTooltip.end.label.getId());}this._mHandleTooltip.bAriaHandlesSwapped=!this._mHandleTooltip.bAriaHandlesSwapped;}};c.prototype._setAriaControls=function(){if(!this.getShowAdvancedTooltip()){return;}if(!this._mHandleTooltip.start.handle.getAttribute('aria-controls')&&this._mHandleTooltip.start.tooltip){this._mHandleTooltip.start.handle.setAttribute('aria-controls',this._mHandleTooltip.start.tooltip.getId());}if(!this._mHandleTooltip.end.handle.getAttribute('aria-controls')&&this._mHandleTooltip.end.tooltip){this._mHandleTooltip.end.handle.setAttribute('aria-controls',this._mHandleTooltip.end.tooltip.getId());}};c.prototype._updateTooltipContent=function(t,n){var N=this.toFixed(n,this._iDecimalPrecision);t.setValue(parseFloat(N));};c.prototype._swapTooltips=function(r){var t=this._mHandleTooltip.start.tooltip;if((r[0]>=r[1]&&!this._mHandleTooltip.bTooltipsSwapped)||(r[0]<=r[1]&&this._mHandleTooltip.bTooltipsSwapped)){this._mHandleTooltip.start.tooltip=this._mHandleTooltip.end.tooltip;this._mHandleTooltip.end.tooltip=t;this._updateTooltipContent(this._mHandleTooltip.start.tooltip,r[0]);this._updateTooltipContent(this._mHandleTooltip.end.tooltip,r[1]);if(this.getInputsAsTooltips()){this._mHandleTooltip.start.handle.setAttribute("aria-controls",this._mHandleTooltip.start.tooltip.getId());this._mHandleTooltip.end.handle.setAttribute("aria-controls",this._mHandleTooltip.end.tooltip.getId());}this._mHandleTooltip.bTooltipsSwapped=!this._mHandleTooltip.bTooltipsSwapped;}};c.prototype._adjustTooltipsContainer=function(){var t=this.getAggregation("_tooltipContainer");if(!t.getDomRef()){return;}t.repositionTooltips(this.getMin(),this.getMax());this._swapTooltips(this.getRange());};c.prototype.getUsedTooltips=function(){var C=this.getCustomTooltips(),d=this.getAggregation("_defaultTooltips")||[];return C.length>1?C:d;};c.prototype.handleTooltipChange=function(e){this.updateTooltipsPositionAndState(e.getSource(),Number(e.getParameter("value")));};c.prototype.updateTooltipsPositionAndState=function(t,v){var h,A,T=this._mHandleTooltip.bTooltipsSwapped;v=this._adjustRangeValue(v);h=this._mHandleTooltip.start.tooltip===t?this._mHandleTooltip.start.handle:this._mHandleTooltip.end.handle;this._updateHandle(h,v);if(T!==this._mHandleTooltip.bTooltipsSwapped){A=this._mHandleTooltip.start.tooltip!==t?this._mHandleTooltip.start.tooltip:this._mHandleTooltip.end.tooltip;A.focus();}this._fireChangeAndLiveChange({range:this.getRange()});this.updateAdvancedTooltipDom();};c.prototype._updateDOMAfterSetters=function(v,r,h){var p,H;if(this.getDomRef()){p=this._getPercentOfValue(v);H=h===1?this._mHandleTooltip.end:this._mHandleTooltip.start;this._updateHandleDom(H.handle,r,h,v,p);if(this.getShowAdvancedTooltip()){this._updateTooltipContent(H.tooltip,v);}return true;}return false;};c.prototype.setRange=function(r){r=r.map(this._adjustRangeValue,this);this._updateRangePropertyDependencies(r);if(this._updateDOMAfterSetters(r[0],r,0)&&this._updateDOMAfterSetters(r[1],r,1)){this._recalculateRange();}return this;};c.prototype.setStep=function(s){this._validateProperties();this._iDecimalPrecision=this.getDecimalPrecisionOfNumber(s);return this.setProperty("step",s);};c.prototype.setValue=function(v){var r=this.getRange();if(typeof v!=="number"||!isFinite(v)){return this;}v=this._adjustRangeValue(v);r[0]=v;this._updateRangePropertyDependencies(r);if(this._updateDOMAfterSetters(r[0],r,0)){this._recalculateRange();}return this;};c.prototype.setValue2=function(v){var r=this.getRange();v=this._adjustRangeValue(v);r[1]=v;this._updateRangePropertyDependencies(r);if(this._updateDOMAfterSetters(r[1],r,1)){this._recalculateRange();}return this;};c.prototype._updateRangePropertyDependencies=function(r){var d=Array.isArray(r)?r.slice():[],D=this._iDecimalPrecision?this._iDecimalPrecision:0,n=Number(d[0].toFixed(D)),N=Number(d[1].toFixed(D));if(this.getProperty("value")!==n){this.setProperty("value",n,true);d[0]=n;}if(this.getProperty("value2")!==N){this.setProperty("value2",N,true);d[1]=N;}this.setProperty("range",d,true);};c.prototype._calculateHandlePosition=function(v){var m=this.getMax(),M=this.getMin(),n;n=((v-this._fSliderPaddingLeft-this._fSliderOffsetLeft)/this._fSliderWidth)*(m-M)+M;if(this._bRTL){n=this._convertValueToRtlMode(n);}return this._adjustRangeValue(n);};c.prototype._adjustRangeValue=function(v){var m=this.getMax(),M=this.getMin(),s=this.getStep(),f;if(this._bInitialRangeChecks){return v;}f=Math.abs((v-M)%s);if(f!==0){v=f*2>=s?v+s-f:v-f;}if(v<M){l.warning("Warning: "+"Min value ("+v+") not in the range: ["+M+","+m+"]",this);v=M;}else if(v>m){l.warning("Warning: "+"Max value ("+v+") not in the range: ["+M+","+m+"]",this);v=m;}return v;};c.prototype.ontouchstart=function(e){var t=e.targetTouches[0],C=this.getRenderer().CSS_CLASS,E="."+C,m,M,v,h,r,H,f,F,T,p,d,g;if(!this.getEnabled()){return;}e.setMarked();if(e.target.className.indexOf("sapMInput")===-1){e.preventDefault();}this._recalculateStyles();if(["number","text"].indexOf(e.target.type)>-1){return;}v=this._calculateHandlePosition(t.pageX);r=this.getRange();h=[this._mHandleTooltip.start.handle,this._mHandleTooltip.end.handle];H=this._getIndexOfHandle(e.target);f=h.reduce(function(A,o){return Math.abs(A-o.offsetLeft);},0);m=Math.min.apply(Math,r);M=Math.max.apply(Math,r);g=this.$("handle1").outerWidth()/2;T=Math.abs(this.getMin())+Math.abs(this.getMax());p=((g*100)/this.$("inner").outerWidth());d=(p/100)*T;if(v<m||v<m+d||v>M||v>(M-d)||f<=b.CONSTANTS.RANGE_MOVEMENT_THRESHOLD){h=[this.getClosestHandleDomRef(t)];this._updateHandle(h[0],v);this.fireLiveChange({range:r});}else if(H!==-1){h=[this.getDomRef(H===0?"handle1":"handle2")];}q(document).on("touchend"+E+" touchcancel"+E+" mouseup"+E,this._ontouchend.bind(this,h)).on("touchmove"+E+(e.originalEvent.type!=="touchstart"?" mousemove"+E:""),this._ontouchmove.bind(this,v,this.getRange(),h));h.map(function(o){if(o.className.indexOf(C+"HandlePressed")===-1){o.className+=" "+C+"HandlePressed";}});F=h.length===1?h[0]:this.getDomRef("progress");setTimeout(F["focus"].bind(F),0);};c.prototype._ontouchmove=function(f,d,h,e){var o,r,g,j,p=e.targetTouches?e.targetTouches[0].pageX:e.pageX,m=this.getMax(),M=this.getMin(),k=[],n=[];e.preventDefault();e.setMarked();if(e.isMarked("delayedMouseEvent")||!this.getEnabled()||e.button){return;}o=this._calculateHandlePosition(p)-f;for(var i=0;i<d.length;i++){k[i]=d[i]+o;}n=this._getNormalizedRange(this.getRange(),d,h);r=k.every(function(v,s){return v===n[s];});g=k.every(function(v){return(v>=M&&v<=m);});j=n.indexOf(M)>-1||n.indexOf(m)>-1;if(!r){if((h.length===1)||g||!j){h.map(function(H){this._updateHandle(H,d[this._getIndexOfHandle(H)]+o);},this);}this.getShowAdvancedTooltip()&&this._adjustTooltipsContainer();n=this._getNormalizedRange(this.getRange(),d,h);}this._triggerLiveChange();this.setRange(n);};c.prototype.updateAdvancedTooltipDom=function(){this.getAggregation("_tooltipContainer").repositionTooltips(this.getMin(),this.getMax());};c.prototype._triggerLiveChange=function(){var f,r=this.getRange();this._liveChangeLastValue=this._liveChangeLastValue||[];f=r.some(function(v,i){return v!==this._liveChangeLastValue[i];},this);if(f){this._liveChangeLastValue=r.slice();this.fireLiveChange({range:r});}};c.prototype._getNormalizedRange=function(r,d,h){var m=this.getMax(),M=this.getMin(),s=Math.abs(d[0]-d[1]),e=[],i,o;for(i=0;i<r.length;i++){e[i]=(r[i]<M?M:r[i]);e[i]=(r[i]>m?m:e[i]);if(h.length===2){if(e[0]==M){e[1]=e[0]+s;}else{o=Math.abs(i-1);e[o]=(e[i]<=M?e[i]+s:e[o]);e[o]=(e[i]>=m?e[i]-s:e[o]);}}}return e;};c.prototype._ontouchend=function(h,e){var n=this.getRange(),C=this.getRenderer().CSS_CLASS;e.setMarked();h&&h.map(function(H){H.className=H.className.replace(new RegExp(" ?"+C+"HandlePressed","gi"),"");});q(document).off("."+C);this._recalculateRange();if(this._aInitialFocusRange[0]!==n[0]||this._aInitialFocusRange[1]!==n[1]){this._aInitialFocusRange=Array.prototype.slice.call(n);this.fireChange({range:n});}if(this.getShowAdvancedTooltip()){this._updateTooltipContent(this._mHandleTooltip.start.tooltip,n[0]);this._updateTooltipContent(this._mHandleTooltip.end.tooltip,n[1]);}};c.prototype.onfocusin=function(e){var t=this.getAggregation("_tooltipContainer");if(this.getShowAdvancedTooltip()){t.show(this);this._adjustTooltipsContainer();this._setAriaControls();}if(document.activeElement!==this.getFocusDomRef()){this._aInitialFocusRange=this.getRange();}};c.prototype.getFocusDomRef=function(){return this.getDomRef("progress");};c.prototype._updateSliderValues=function(o,h){var r=this.getRange(),m=this.getMax(),M=this.getMin(),f=Math.max.apply(null,r),d=Math.min.apply(null,r),i=this._getIndexOfHandle(h),O=o<0?-1:1,H=i>-1?[h]:[this._mHandleTooltip.start.handle,this._mHandleTooltip.end.handle];if(H.length===1){d=f=r[i];}if(f+o>m){o=O*(Math.abs(m)-Math.abs(f));}else if(d+o<M){o=O*(Math.abs(d)-Math.abs(M));}H.map(function(C){this._updateHandle(C,r[this._getIndexOfHandle(C)]+o);},this);};c.prototype.onkeydown=function(e){var f=this.getInputsAsTooltips(),s=this.getShowAdvancedTooltip(),F=e.keyCode===b.CONSTANTS.F2_KEYCODE,d=(e.target===this._mHandleTooltip.start.handle),t=q(e.target).hasClass(b.CONSTANTS.HANDLE_CLASS);if(F&&s&&f&&t){this._mHandleTooltip[d?"start":"end"].tooltip.focus();}if(e.keyCode===K.SPACE){e.preventDefault();}};c.prototype.onsapincrease=function(e){e.preventDefault();e.setMarked();if(this.getEnabled()){this._updateSliderValues(this.getStep(),e.target);this._fireChangeAndLiveChange({range:this.getRange()});}};c.prototype.onsapplus=c.prototype.onsapincrease;c.prototype.onsapincreasemodifiers=function(e){if(e.altKey){return;}e.preventDefault();e.stopPropagation();e.setMarked();if(this.getEnabled()){this._updateSliderValues(this._getLongStep(),e.target);this._fireChangeAndLiveChange({range:this.getRange()});}};c.prototype.onsappageup=c.prototype.onsapincreasemodifiers;c.prototype.onsapdecrease=function(e){e.preventDefault();e.setMarked();if(this.getEnabled()){this._updateSliderValues(-1*this.getStep(),e.target);this._fireChangeAndLiveChange({range:this.getRange()});}};c.prototype.onsapminus=c.prototype.onsapdecrease;c.prototype.onsapdecreasemodifiers=function(e){if(e.altKey){return;}e.preventDefault();e.stopPropagation();e.setMarked();if(this.getEnabled()){this._updateSliderValues(-1*this._getLongStep(),e.target);this._fireChangeAndLiveChange({range:this.getRange()});}};c.prototype.onsappagedown=c.prototype.onsapdecreasemodifiers;c.prototype.onsaphome=function(e){var h=0,r,H,m;e.setMarked();e.preventDefault();h=this._getIndexOfHandle(e.target);r=this.getRange()[h];m=this.getMin();if(this.getEnabled()&&(r!==m)){H=(h===1?this._mHandleTooltip.end:this._mHandleTooltip.start);this._updateHandle(H.handle,m);this._fireChangeAndLiveChange({range:this.getRange()});}};c.prototype.onsapend=function(e){e.setMarked();e.preventDefault();if(this.getEnabled()){this._updateSliderValues(this.getMax(),e.target);this._fireChangeAndLiveChange({range:this.getRange()});}};c.prototype.onsapescape=function(){this.setRange(this._aInitialFocusRange);this._fireChangeAndLiveChange({range:this.getRange()});};return c;});
