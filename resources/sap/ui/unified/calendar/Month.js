/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/Device','sap/ui/core/LocaleData','sap/ui/core/delegate/ItemNavigation','sap/ui/unified/calendar/CalendarUtils','sap/ui/unified/calendar/CalendarDate','sap/ui/unified/DateRange','sap/ui/unified/library','sap/ui/core/format/DateFormat','sap/ui/core/library','sap/ui/core/Locale',"./MonthRenderer","sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery"],function(C,D,L,I,a,b,c,l,d,e,f,M,g,K,q){"use strict";var h=e.CalendarType;var j=l.CalendarDayType;var k=C.extend("sap.ui.unified.calendar.Month",{metadata:{library:"sap.ui.unified",properties:{date:{type:"object",group:"Data"},intervalSelection:{type:"boolean",group:"Behavior",defaultValue:false},singleSelection:{type:"boolean",group:"Behavior",defaultValue:true},showHeader:{type:"boolean",group:"Appearance",defaultValue:false},firstDayOfWeek:{type:"int",group:"Appearance",defaultValue:-1},nonWorkingDays:{type:"int[]",group:"Appearance",defaultValue:null},primaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"},secondaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},showWeekNumbers:{type:"boolean",group:"Appearance",defaultValue:true}},aggregations:{selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"},disabledDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"disabledDate"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{select:{},focus:{parameters:{date:{type:"object"},otherMonth:{type:"boolean"},restoreOldDate:{type:"boolean"}}},weekNumberSelect:{allowPreventDefault:true,parameters:{weekNumber:{type:"int"},weekDays:{type:"sap.ui.unified.DateRange"}}}}}});k.prototype.init=function(){var i=sap.ui.getCore().getConfiguration().getCalendarType();this.setProperty("primaryCalendarType",i);this.setProperty("secondaryCalendarType",i);this._oFormatYyyymmdd=d.getInstance({pattern:"yyyyMMdd",calendarType:h.Gregorian});this._oFormatLong=d.getInstance({style:"long",calendarType:i});this._mouseMoveProxy=q.proxy(this._handleMouseMove,this);this._iColumns=7;this._aVisibleDays=[];};k.prototype._getAriaRole=function(){return"gridcell";};k.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;}if(this._sInvalidateMonth){clearTimeout(this._sInvalidateMonth);}this._aVisibleDays=null;};k.prototype.getFocusDomRef=function(){return this._oItemNavigation.getItemDomRefs()[this._oItemNavigation.getFocusedIndex()];};k.prototype.onAfterRendering=function(){_.call(this);u.call(this);};k.prototype.onmouseover=function(E){var T=q(E.target),S=this.getSelectedDates()[0],i,v;if(!this._isMarkingUnfinishedRangeAllowed()){return;}if(!T.hasClass('sapUiCalItemText')&&!T.hasClass('sapUiCalItem')){return;}if(T.hasClass('sapUiCalItemText')){T=T.parent();}i=parseInt(this._oFormatYyyymmdd.format(S.getStartDate()));v=T.data("sapDay");if(this.hasListeners("datehovered")){this.fireEvent("datehovered",{date1:i,date2:v});}else{this._markDatesBetweenStartAndHoveredDate(i,v);}};k.prototype._markDatesBetweenStartAndHoveredDate=function(v,w){var x,$,y,i;x=this.$().find(".sapUiCalItem");if(v>w){v=v+w;w=v-w;v=v-w;}for(i=0;i<x.length;i++){$=q(x[i]);y=$.data('sapDay');if(y>v&&y<w){$.addClass('sapUiCalItemSelBetween');}else{$.removeClass('sapUiCalItemSelBetween');}}};k.prototype.onsapfocusleave=function(E){if(!E.relatedControlId||!g(this.getDomRef(),sap.ui.getCore().byId(E.relatedControlId).getFocusDomRef())){if(this._bMouseMove){this._unbindMousemove(true);var S=this._selectDay(this._getDate());if(!S&&this._oMoveSelectedDate){this._selectDay(this._oMoveSelectedDate);}this._bMoveChange=false;this._bMousedownChange=false;this._oMoveSelectedDate=undefined;t.call(this);}if(this._bMousedownChange){this._bMousedownChange=false;t.call(this);}}};k.prototype.removeAllSelectedDates=function(){this._bDateRangeChanged=true;var R=this.removeAllAggregation("selectedDates");return R;};k.prototype.destroySelectedDates=function(){this._bDateRangeChanged=true;var i=this.destroyAggregation("selectedDates");return i;};k.prototype.removeAllSpecialDates=function(){this._bDateRangeChanged=true;var R=this.removeAllAggregation("specialDates");return R;};k.prototype.destroySpecialDates=function(){this._bDateRangeChanged=true;var i=this.destroyAggregation("specialDates");return i;};k.prototype.removeAllDisabledDates=function(){this._bDateRangeChanged=true;var R=this.removeAllAggregation("disabledDates");return R;};k.prototype.destroyDisabledDates=function(){this._bDateRangeChanged=true;var i=this.destroyAggregation("disabledDates");return i;};k.prototype.setDate=function(i){var v=b.fromLocalJSDate(i,this.getPrimaryCalendarType());o.call(this,v,false);return this;};k.prototype._setDate=function(i){var v=i.toLocalJSDate();this.setProperty("date",v,true);this._oDate=i;};k.prototype._getDate=function(){if(!this._oDate){this._oDate=b.fromLocalJSDate(new Date(),this.getPrimaryCalendarType());}return this._oDate;};k.prototype.displayDate=function(i){var v=b.fromLocalJSDate(i,this.getPrimaryCalendarType());o.call(this,v,true);return this;};k.prototype.setPrimaryCalendarType=function(i){this.setProperty("primaryCalendarType",i);this._oFormatLong=d.getInstance({style:"long",calendarType:i});if(this._oDate){this._oDate=new b(this._oDate,i);}return this;};k.prototype.setSecondaryCalendarType=function(i){this._bSecondaryCalendarTypeSet=true;this.setProperty("secondaryCalendarType",i);this.invalidate();this._oFormatSecondaryLong=d.getInstance({style:"long",calendarType:i});return this;};k.prototype._getSecondaryCalendarType=function(){var S;if(this._bSecondaryCalendarTypeSet){S=this.getSecondaryCalendarType();var P=this.getPrimaryCalendarType();if(S===P){S=undefined;}}return S;};k.prototype._getLocale=function(){var P=this.getParent();if(P&&P.getLocale){return P.getLocale();}else if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();}return this._sLocale;};k.prototype._getLocaleData=function(){var P=this.getParent();if(P&&P._getLocaleData){return P._getLocaleData();}else if(!this._oLocaleData){var i=this._getLocale();var v=new f(i);this._oLocaleData=L.getInstance(v);}return this._oLocaleData;};k.prototype._getFormatLong=function(){var i=this._getLocale();if(this._oFormatLong.oLocale.toString()!==i){var v=new f(i);this._oFormatLong=d.getInstance({style:"long",calendarType:this.getPrimaryCalendarType()},v);if(this._oFormatSecondaryLong){this._oFormatSecondaryLong=d.getInstance({style:"long",calendarType:this._getSecondaryCalendarType()},v);}}return this._oFormatLong;};k.prototype.getIntervalSelection=function(){var P=this.getParent();if(P&&P.getIntervalSelection){return P.getIntervalSelection();}else{return this.getProperty("intervalSelection");}};k.prototype.getSingleSelection=function(){var P=this.getParent();if(P&&P.getSingleSelection){return P.getSingleSelection();}else{return this.getProperty("singleSelection");}};k.prototype.getSelectedDates=function(){var P=this.getParent();if(P&&P.getSelectedDates){return P.getSelectedDates();}else{return this.getAggregation("selectedDates",[]);}};k.prototype.getSpecialDates=function(){var P=this.getParent();if(P&&P.getSpecialDates){return P.getSpecialDates();}else{return this.getAggregation("specialDates",[]);}};k.prototype.getDisabledDates=function(){var P=this.getParent();if(P&&P.getDisabledDates){return P.getDisabledDates();}else{return this.getAggregation("disabledDates",[]);}};k.prototype.getPrimaryCalendarType=function(){var P=this.getParent();if(P&&P.getPrimaryCalendarType){return P.getPrimaryCalendarType();}return this.getProperty("primaryCalendarType");};k.prototype._getShowHeader=function(){var P=this.getParent();if(P&&P._getShowMonthHeader){return P._getShowMonthHeader();}else{return this.getProperty("showHeader");}};k.prototype.getAriaLabelledBy=function(){var P=this.getParent();if(P&&P.getAriaLabelledBy){return P.getAriaLabelledBy();}else{return this.getAssociation("ariaLabelledBy",[]);}};k.prototype.getLegend=function(){var P=this.getParent();if(P&&P.getLegend){return P.getLegend();}else{return this.getAssociation("legend",[]);}};k.prototype._getFirstDayOfWeek=function(){var P=this.getParent();var F=0;if(P&&P.getFirstDayOfWeek){F=P.getFirstDayOfWeek();}else{F=this.getProperty("firstDayOfWeek");}if(F<0||F>6){var i=this._getLocaleData();F=i.getFirstDayOfWeek();}return F;};k.prototype._getNonWorkingDays=function(){var P=this.getParent();var N;if(P&&P.getNonWorkingDays){N=P.getNonWorkingDays();}else{N=this.getProperty("nonWorkingDays");}if(N&&!Array.isArray(N)){N=[];}return N;};k.prototype._checkDateSelected=function(v){a._checkCalendarDate(v);var S=0;var w=this.getSelectedDates();var T=v.toUTCJSDate().getTime();var x=this.getPrimaryCalendarType();for(var i=0;i<w.length;i++){var R=w[i];var y=R.getStartDate();var z=0;if(y){y=b.fromLocalJSDate(y,x);z=y.toUTCJSDate().getTime();}var E=R.getEndDate();var A=0;if(E){E=b.fromLocalJSDate(E,x);A=E.toUTCJSDate().getTime();}if(T===z&&!E){S=1;break;}else if(T===z&&E){S=2;if(E&&T===A){S=5;}break;}else if(E&&T===A){S=3;break;}else if(E&&T>z&&T<A){S=4;break;}if(this.getSingleSelection()){break;}}return S;};k.prototype._getDateTypes=function(v){a._checkCalendarDate(v);var T,w,N,x=[];var S=this.getSpecialDates();var y=v.toUTCJSDate().getTime();var U=new Date(Date.UTC(0,0,1));for(var i=0;i<S.length;i++){var R=S[i];var z=R.getStartDate();var A=a.MAX_MILLISECONDS;if(z){U.setUTCFullYear(z.getFullYear(),z.getMonth(),z.getDate());A=U.getTime();}var E=R.getEndDate();var B=-a.MAX_MILLISECONDS;if(E){U.setUTCFullYear(E.getFullYear(),E.getMonth(),E.getDate());B=U.getTime();}N=R.getType()===j.NonWorking;if((y===A&&!E)||(y>=A&&y<=B)){if(!N&&!T){T={type:R.getType(),tooltip:R.getTooltip_AsString(),color:R.getColor()};x.push(T);}else if(N&&!w){w={type:R.getType(),tooltip:R.getTooltip_AsString()};x.push(w);}if(T&&w){break;}}}return x;};k.prototype._checkDateEnabled=function(v){a._checkCalendarDate(v);var E=true;var w=this.getDisabledDates();var T=v.toUTCJSDate().getTime();var x=this.getPrimaryCalendarType();var P=this.getParent();if(P&&P._oMinDate&&P._oMaxDate){if(T<P._oMinDate.valueOf()||T>P._oMaxDate.valueOf()){return false;}}for(var i=0;i<w.length;i++){var R=w[i];var S=R.getStartDate();var y=0;if(S){S=b.fromLocalJSDate(S,x);y=S.toUTCJSDate().getTime();}var z=R.getEndDate();var A=0;if(z){z=b.fromLocalJSDate(z,x);A=z.toUTCJSDate().getTime();}if(z){if(T>y&&T<A){E=false;break;}}else if(T===y){E=false;break;}}return E;};k.prototype._handleMouseMove=function(E){if(!this.$().is(":visible")){this._unbindMousemove(true);}var T=q(E.target);if(T.hasClass("sapUiCalItemText")){T=T.parent();}if(this._sLastTargetId&&this._sLastTargetId===T.attr("id")){return;}this._sLastTargetId=T.attr("id");if(T.hasClass("sapUiCalItem")){var O=this._getDate();if(!g(this.getDomRef(),E.target)){var S=this.getSelectedDates();if(S.length>0&&this.getSingleSelection()){var i=S[0].getStartDate();if(i){i=b.fromLocalJSDate(i,this.getPrimaryCalendarType());}var v=b.fromLocalJSDate(this._oFormatYyyymmdd.parse(T.attr("data-sap-day")));if(v.isSameOrAfter(i)){r.call(this,i,v);}else{r.call(this,v,i);}}}else{var F=b.fromLocalJSDate(this._oFormatYyyymmdd.parse(T.attr("data-sap-day")),this.getPrimaryCalendarType());if(!F.isSame(O)){if(T.hasClass("sapUiCalItemOtherMonth")){this.fireFocus({date:F.toLocalJSDate(),otherMonth:true});}else{this._setDate(F);var w=this._selectDay(F,true);if(w){this._oMoveSelectedDate=new b(F,this.getPrimaryCalendarType());}this._bMoveChange=true;}}}}};k.prototype.onmousedown=function(E){this._oMousedownPosition={clientX:E.clientX,clientY:E.clientY};if(!!E.button||D.support.touch||!this._isWeekSelectionAllowed()||!E.target.classList.contains("sapUiCalWeekNum")){return;}var $=q(E.target),i=$.siblings().eq(0).attr("data-sap-day"),P=this._oFormatYyyymmdd.parse(i),F=b.fromLocalJSDate(P,this.getPrimaryCalendarType());this._handleWeekSelection(F,true);};k.prototype.onmouseup=function(E){var N=E.button!==2;if(this._bMouseMove){this._unbindMousemove(true);var F=this._getDate();var v=this._oItemNavigation.getItemDomRefs();for(var i=0;i<v.length;i++){var $=q(v[i]);if(!$.hasClass("sapUiCalItemOtherMonth")){if($.attr("data-sap-day")===this._oFormatYyyymmdd.format(F.toUTCJSDate(),true)){$.trigger("focus");break;}}}if(this._bMoveChange){var S=this._selectDay(F);if(!S&&this._oMoveSelectedDate){this._selectDay(this._oMoveSelectedDate);}this._bMoveChange=false;this._bMousedownChange=false;this._oMoveSelectedDate=undefined;t.call(this);}}if(this._bMousedownChange){this._bMousedownChange=false;t.call(this);}else if(D.support.touch&&N&&this._areMouseEventCoordinatesInThreshold(E.clientX,E.clientY,10)){var w=E.target.classList,x=(w.contains("sapUiCalItemText")||w.contains("sapUiCalDayName")),y=w.contains("sapUiCalWeekNum"),z=this._getSelectedDateFromEvent(E);if(y&&this._isWeekSelectionAllowed()){this._handleWeekSelection(z,true);}else if(x&&E.shiftKey&&this._isConsecutiveDaysSelectionAllowed()){this._handleConsecutiveDaysSelection(z);}else if(x){this._selectDay(z,false,false);t.call(this);}}};k.prototype.onsapselect=function(E){if(this.bSpaceButtonPressed){return;}var S=this._selectDay(this._getSelectedDateFromEvent(E));if(S){t.call(this);}E.stopPropagation();E.preventDefault();};k.prototype.onkeydown=function(E){if(E.which===K.SPACE){this.bSpaceButtonPressed=true;}};k.prototype.onkeyup=function(E){if(E.which===K.SPACE){this.bSpaceButtonPressed=false;}};k.prototype.onsapselectmodifiers=function(E){var S=this._getSelectedDateFromEvent(E),F;if(this._isWeekSelectionAllowed()&&E.shiftKey&&E.keyCode===K.SPACE){F=a._getFirstDateOfWeek(S);this._handleWeekSelection(F,false);}else if(this._isConsecutiveDaysSelectionAllowed()&&E.shiftKey&&E.keyCode===K.ENTER){this._handleConsecutiveDaysSelection(S);}E.preventDefault();};k.prototype.onsappageupmodifiers=function(E){var F=new b(this._getDate(),this.getPrimaryCalendarType());var y=F.getYear();if(E.metaKey||E.ctrlKey){F.setYear(y-10);}else{F.setYear(y-1);}this.fireFocus({date:F.toLocalJSDate(),otherMonth:true});E.preventDefault();};k.prototype.onsappagedownmodifiers=function(E){var F=new b(this._getDate(),this.getPrimaryCalendarType());var y=F.getYear();if(E.metaKey||E.ctrlKey){F.setYear(y+10);}else{F.setYear(y+1);}this.fireFocus({date:F.toLocalJSDate(),otherMonth:true});E.preventDefault();};k.prototype._updateSelection=function(){var S=this.getSelectedDates();if(S.length>0){var i=this.getPrimaryCalendarType();var v=S.map(function(w){var x=w.getStartDate();if(x){return b.fromLocalJSDate(x,i);}});var E=S[0].getEndDate();if(E){E=b.fromLocalJSDate(E,i);}r.call(this,v,E);}};k.prototype._isValueInThreshold=function(R,v,T){var i=R-T,U=R+T;return v>=i&&v<=U;};k.prototype._areMouseEventCoordinatesInThreshold=function(i,v,T){return this._isValueInThreshold(this._oMousedownPosition.clientX,i,T)&&this._isValueInThreshold(this._oMousedownPosition.clientY,v,T);};k.prototype._bindMousemove=function(F){q(window.document).on('mousemove',this._mouseMoveProxy);this._bMouseMove=true;if(F){this.fireEvent("_bindMousemove");}};k.prototype._unbindMousemove=function(F){q(window.document).off('mousemove',this._mouseMoveProxy);this._bMouseMove=undefined;this._sLastTargetId=undefined;if(F){this.fireEvent("_unbindMousemove");}};k.prototype.onThemeChanged=function(){if(this._bNoThemeChange||!this.getDomRef()){return;}var w=this.getDomRef().querySelectorAll(".sapUiCalWH:not([style='visibility: hidden;'])"),v=this._getLocaleData(),S=this._getFirstWeekDay(),x=v.getDaysStandAlone("abbreviated",this.getPrimaryCalendarType()),W,i;this._bNamesLengthChecked=undefined;this._bLongWeekDays=undefined;for(i=0;i<w.length;i++){W=w[i];W.textContent=x[(i+S)%7];}u.call(this);};k.prototype._handleBorderReached=function(i){var E=i.getParameter("event");var v=0;var O=this._getDate();var F=new b(O,this.getPrimaryCalendarType());if(E.type){switch(E.type){case"sapnext":case"sapnextmodifiers":if(E.keyCode===K.ARROW_DOWN){F.setDate(F.getDate()+7);}else{F.setDate(F.getDate()+1);}break;case"sapprevious":case"sappreviousmodifiers":if(E.keyCode===K.ARROW_UP){F.setDate(F.getDate()-7);}else{F.setDate(F.getDate()-1);}break;case"sappagedown":v=F.getMonth()+1;F.setMonth(v);if(v%12!==F.getMonth()){while(v!==F.getMonth()){F.setDate(F.getDate()-1);}}break;case"sappageup":v=F.getMonth()-1;F.setMonth(v);if(v<0){v=11;}if(v!==F.getMonth()){while(v!==F.getMonth()){F.setDate(F.getDate()-1);}}break;default:break;}this.fireFocus({date:F.toLocalJSDate(),otherMonth:true});if(this._isMarkingUnfinishedRangeAllowed()){var w=this.getSelectedDates()[0],P=parseInt(this._oFormatYyyymmdd.format(w.getStartDate())),x=parseInt(this._oFormatYyyymmdd.format(F.toLocalJSDate()));this._markDatesBetweenStartAndHoveredDate(P,x);}}};k.prototype.checkDateFocusable=function(i){a._checkJSDateObject(i);var v=this._getDate();var w=b.fromLocalJSDate(i,this.getPrimaryCalendarType());return a._isSameMonthAndYear(w,v);};k.prototype.applyFocusInfo=function(i){this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex());return this;};k.prototype._renderHeader=function(){if(this._getShowHeader()){var i=this._getDate();var v=this._getLocaleData();var w=v.getMonthsStandAlone("wide",this.getPrimaryCalendarType());this.$("Head").text(w[i.getMonth()]);}};k.prototype._getFirstWeekDay=function(){return this._getFirstDayOfWeek();};k.prototype._isMonthNameLong=function(w){var i;var W;for(i=0;i<w.length;i++){W=w[i];if(Math.abs(W.clientWidth-W.scrollWidth)>1){return true;}}return false;};k.prototype._getVisibleDays=function(S,i){var N,v,w,x,F,y,Y;if(!S){return this._aVisibleDays;}this._aVisibleDays=[];y=this._getFirstDayOfWeek();F=new b(S,this.getPrimaryCalendarType());F.setDate(1);x=F.getDay()-y;if(x<0){x=7+x;}if(x>0){F.setDate(1-x);}v=new b(F);N=(S.getMonth()+1)%12;do{Y=v.getYear();w=new b(v,this.getPrimaryCalendarType());if(i&&Y<1){w._bBeforeFirstYear=true;this._aVisibleDays.push(w);}else if(Y>0&&Y<10000){this._aVisibleDays.push(w);}v.setDate(v.getDate()+1);}while(v.getMonth()!==N||v.getDay()!==y);return this._aVisibleDays;};k.prototype._handleMousedown=function(E,F){var w=E.target.classList.contains("sapUiCalWeekNum"),i=!E.button,S=this._getSelectedDateFromEvent(E);if(!i||D.support.touch){return this;}if(w){this._isWeekSelectionAllowed()&&this._handleWeekSelection(S,true);return this;}else if(E.shiftKey&&this._isConsecutiveDaysSelectionAllowed()){this._handleConsecutiveDaysSelection(S);return this;}var v=this._selectDay(F);if(v){this._bMousedownChange=true;}if(this._bMouseMove){this._unbindMousemove(true);this._bMoveChange=false;this._oMoveSelectedDate=undefined;}else if(v&&this.getIntervalSelection()&&this.$().is(":visible")){this._bindMousemove(true);this._oMoveSelectedDate=new b(F,this.getPrimaryCalendarType());}E.preventDefault();E.setMark("cancelAutoClose");};k.prototype._getSelectedDateFromEvent=function(E){var T=E.target,i,P;if(T.classList.contains("sapUiCalWeekNum")){i=T.nextSibling.getAttribute("data-sap-day");}else{i=T.getAttribute("data-sap-day")||T.parentNode.getAttribute("data-sap-day");}P=this._oFormatYyyymmdd.parse(i);return P?b.fromLocalJSDate(P,this.getPrimaryCalendarType()):null;};k.prototype._handleWeekSelection=function(S,F){var i=a.calculateWeekNumber(S.toUTCJSDate(),S.getYear(),this._getLocale(),this._getLocaleData()),E=this._getLastWeekDate(S),v=this.getSingleSelection(),w=this.getIntervalSelection();if(!v&&!w){this._handleWeekSelectionByMultipleDays(i,S,E);}else if(v&&w){this._handleWeekSelectionBySingleInterval(i,S,E);}F&&this._focusDate(S);return this;};k.prototype._handleConsecutiveDaysSelection=function(E){var S=this.getSelectedDates(),i=S.length&&S[S.length-1].getStartDate(),v=i?b.fromLocalJSDate(i):E,w;w=this._areAllDaysBetweenSelected(v,E);this._toggleDaysBetween(v,E,!w);return this;};k.prototype._isWeekSelectionAllowed=function(){var S=this.getSingleSelection(),i=this.getIntervalSelection(),v=this.getPrimaryCalendarType(),w=this.getFirstDayOfWeek()!==-1,x=!S&&!i,y=S&&i,A=y||x;return v===h.Gregorian&&!w&&A;};k.prototype._isConsecutiveDaysSelectionAllowed=function(){var S=this.getSingleSelection(),i=this.getIntervalSelection();return!S&&!i;};k.prototype._isMarkingUnfinishedRangeAllowed=function(){var S=this.getSelectedDates()[0],v=!!(S&&S.getStartDate()&&!S.getEndDate());return(this.getIntervalSelection()&&v);};k.prototype._handleWeekSelectionByMultipleDays=function(w,S,E){var i,v;if(this._areAllDaysBetweenSelected(S,E)){i=null;}else{i=new c({startDate:S.toLocalJSDate(),endDate:E.toLocalJSDate()});}v=this.fireWeekNumberSelect({weekNumber:w,weekDays:i});if(v){this._toggleDaysBetween(S,E,!!i);}return this;};k.prototype._handleWeekSelectionBySingleInterval=function(w,S,E){var i=new c({startDate:S.toLocalJSDate(),endDate:E.toLocalJSDate()}),v=this.getParent(),A=this,x;if(v&&v.getSelectedDates){A=v;}if(this._isIntervalSelected(i)){i=null;}x=this.fireWeekNumberSelect({weekNumber:w,weekDays:i});if(x){A.removeAllSelectedDates();A.addSelectedDate(i);}return this;};k.prototype._isIntervalSelected=function(i){var S=this.getSelectedDates(),v=S.length&&S[0],w=v&&v.getEndDate();return v&&v.getStartDate().getTime()===i.getStartDate().getTime()&&w&&v.getEndDate().getTime()===i.getEndDate().getTime();};k.prototype._getLastWeekDate=function(w){return new b(w).setDate(w.getDate()+6);};k.prototype._toggleDaysBetween=function(S,E,i){var A=this._arrangeStartAndEndDates(S,E),v=new b(A.startDate),w;do{w=this._checkDateSelected(v);if((!w&&i)||(w&&!i)){this._selectDay(v);t.call(this);}v.setDate(v.getDate()+1);}while(v.isSameOrBefore(A.endDate));return this;};k.prototype._areAllDaysBetweenSelected=function(S,E){var A=this._arrangeStartAndEndDates(S,E),i=new b(A.startDate),v=true;do{if(!this._checkDateSelected(i)){v=false;break;}i.setDate(i.getDate()+1);}while(i.isSameOrBefore(A.endDate));return v;};k.prototype._arrangeStartAndEndDates=function(S,E){var A=S.isSameOrBefore(E);return{startDate:A?S:E,endDate:A?E:S};};k.prototype._selectDay=function(v,w){if(!this._checkDateEnabled(v)){return false;}var S=this.getSelectedDates();var x;var y=this._oItemNavigation.getItemDomRefs();var $;var Y;var i=0;var P=this.getParent();var A=this;var z;var B=this.getPrimaryCalendarType();if(P&&P.getSelectedDates){A=P;}if(this.getSingleSelection()){if(S.length>0){x=S[0];z=x.getStartDate();if(z){z=b.fromLocalJSDate(z,B);}}else{x=new c();A.addAggregation("selectedDates",x,true);}if(this.getIntervalSelection()&&(!x.getEndDate()||w)&&z){var E;if(v.isBefore(z)){E=z;z=v;if(!w){x.setProperty("startDate",z.toLocalJSDate(),true);x.setProperty("endDate",E.toLocalJSDate(),true);}}else if(v.isSameOrAfter(z)){E=v;if(!w){x.setProperty("endDate",E.toLocalJSDate(),true);}}r.call(this,z,E);}else{r.call(this,v);x.setProperty("startDate",v.toLocalJSDate(),true);x.setProperty("endDate",undefined,true);}}else{if(this.getIntervalSelection()){throw new Error("Calender don't support multiple interval selection");}else{var F=this._checkDateSelected(v);if(F>0){for(i=0;i<S.length;i++){z=S[i].getStartDate();if(z&&v.isSame(b.fromLocalJSDate(z,B))){A.removeAggregation("selectedDates",i,true);break;}}}else{x=new c({startDate:v.toLocalJSDate()});A.addAggregation("selectedDates",x,true);}Y=this._oFormatYyyymmdd.format(v.toUTCJSDate(),true);for(i=0;i<y.length;i++){$=q(y[i]);if($.attr("data-sap-day")===Y){if(F>0){$.removeClass("sapUiCalItemSel");$.attr("aria-selected","false");}else{$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");}}}}}return true;};function _(){var y=this._oFormatYyyymmdd.format(this._getDate().toUTCJSDate(),true),v=0,R=this.getDomRef(),w=R.querySelectorAll(".sapUiCalItem");for(var i=0;i<w.length;i++){if(w[i].getAttribute("data-sap-day")===y){v=i;break;}}if(!this._oItemNavigation){this._oItemNavigation=new I();this._oItemNavigation.attachEvent(I.Events.AfterFocus,m,this);this._oItemNavigation.attachEvent(I.Events.FocusAgain,n,this);this._oItemNavigation.attachEvent(I.Events.BorderReached,this._handleBorderReached,this);this.addDelegate(this._oItemNavigation);if(this._iColumns>1){this._oItemNavigation.setHomeEndColumnMode(true,true);}this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"],saphome:["alt"],sapend:["alt"]});this._oItemNavigation.setCycling(false);this._oItemNavigation.setColumns(this._iColumns,true);}this._oItemNavigation.setRootDomRef(R);this._oItemNavigation.setItemDomRefs(w);this._oItemNavigation.setFocusedIndex(v);this._oItemNavigation.setPageSize(w.length);}function m(v){var w=v.getParameter("index");var E=v.getParameter("event");if(!E){return;}var O=this._getDate();var F=new b(O,this.getPrimaryCalendarType());var x=false;var y=true;var z=this._oItemNavigation.getItemDomRefs();var i=0;var $=q(z[w]);var A;if($.hasClass("sapUiCalItemOtherMonth")){if(E.type==="saphomemodifiers"&&(E.metaKey||E.ctrlKey)){F.setDate(1);this._focusDate(F);}else if(E.type==="sapendmodifiers"&&(E.metaKey||E.ctrlKey)){for(i=z.length-1;i>0;i--){A=q(z[i]);if(!A.hasClass("sapUiCalItemOtherMonth")){F=b.fromLocalJSDate(this._oFormatYyyymmdd.parse(A.attr("data-sap-day")),this.getPrimaryCalendarType());break;}}this._focusDate(F);}else{x=true;F=b.fromLocalJSDate(this._oFormatYyyymmdd.parse($.attr("data-sap-day")),this.getPrimaryCalendarType());if(!F){F=new b(O);}this._focusDate(O);if(E.type==="mousedown"||(this._sTouchstartYyyyMMdd&&E.type==="focusin"&&this._sTouchstartYyyyMMdd===$.attr("data-sap-day"))){y=false;this.fireFocus({date:O.toLocalJSDate(),otherMonth:false,restoreOldDate:true});}if(E.originalEvent&&E.originalEvent.type==="touchstart"){this._sTouchstartYyyyMMdd=$.attr("data-sap-day");}else{this._sTouchstartYyyyMMdd=undefined;}}}else{if(q(E.target).hasClass("sapUiCalWeekNum")){this._focusDate(F);}else{F=b.fromLocalJSDate(this._oFormatYyyymmdd.parse($.attr("data-sap-day")),this.getPrimaryCalendarType());this._setDate(F);}this._sTouchstartYyyyMMdd=undefined;}if(E.type==="mousedown"&&this.getIntervalSelection()){this._sLastTargetId=$.attr("id");}if(y){this.fireFocus({date:F.toLocalJSDate(),otherMonth:x});}if(E.type==="mousedown"){this._handleMousedown(E,F,w);}if(E.type==="sapnext"||E.type==="sapprevious"){var S=this.getSelectedDates()[0],B,G;if(!this._isMarkingUnfinishedRangeAllowed()){return;}B=parseInt(this._oFormatYyyymmdd.format(S.getStartDate()));G=$.data("sapDay");this._markDatesBetweenStartAndHoveredDate(B,G);}}function n(i){var v=i.getParameter("index");var E=i.getParameter("event");if(!E){return;}if(E.type==="mousedown"){var F=this._getDate();if(this.getIntervalSelection()){var w=this._oItemNavigation.getItemDomRefs();this._sLastTargetId=w[v].id;}this._handleMousedown(E,F,v);}}function o(i,N){a._checkCalendarDate(i);var y=i.getYear();a._checkYearInValidRange(y);var F=true;if(!this.getDate()||!i.isSame(b.fromLocalJSDate(this.getDate(),i.getCalendarType()))){var v=new b(i);F=this.checkDateFocusable(i.toLocalJSDate());this.setProperty("date",i.toLocalJSDate(),true);this._oDate=v;}if(this.getDomRef()){if(F){this._focusDate(this._oDate,true,N);}else{p.call(this,N);}}}k.prototype._focusDate=function(v,S,w){if(!S){this.setDate(v.toLocalJSDate());}var y=this._oFormatYyyymmdd.format(v.toUTCJSDate(),true);var x=this._oItemNavigation.getItemDomRefs();var $;for(var i=0;i<x.length;i++){$=q(x[i]);if($.attr("data-sap-day")===y){if(document.activeElement!==x[i]){if(w){this._oItemNavigation.setFocusedIndex(i);}else{this._oItemNavigation.focusItem(i);}}break;}}};function p(N){var v=this.getRenderer().getStartDate(this),w=this.getDomRef(),W=this.getDomRef().querySelector(".sapUiCalRowWeekNumbers"),x,i=0,y=0;if(this._sLastTargetId){x=this._oItemNavigation.getItemDomRefs();for(i=0;i<x.length;i++){if(x[i].id===this._sLastTargetId){y=i;break;}}}if(w){var R=sap.ui.getCore().createRenderManager();this.getRenderer().renderMonth(R,this,v);R.flush(w);if(W){this.getRenderer().renderWeekNumbers(R,this);R.flush(W);}R.destroy();}this._renderHeader();this.fireEvent("_renderMonth",{days:w.querySelectorAll(".sapUiCalItem").length});_.call(this);if(!N){this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex());}if(this._sLastTargetId){x=this._oItemNavigation.getItemDomRefs();if(y<=x.length-1){this._sLastTargetId=x[y].id;}}}function r(S,E){if(!Array.isArray(S)){S=[S];}var v=this._oItemNavigation.getItemDomRefs();var $;var i=0;var w=false;var x=false;if(!E){var y=S.map(function(A){return this._oFormatYyyymmdd.format(A.toUTCJSDate(),true);},this);for(i=0;i<v.length;i++){$=q(v[i]);w=false;x=false;if(y.indexOf($.attr("data-sap-day"))>-1){$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");w=true;}else if($.hasClass("sapUiCalItemSel")){$.removeClass("sapUiCalItemSel");$.attr("aria-selected","false");}if($.hasClass("sapUiCalItemSelStart")){$.removeClass("sapUiCalItemSelStart");}else if($.hasClass("sapUiCalItemSelBetween")){$.removeClass("sapUiCalItemSelBetween");}else if($.hasClass("sapUiCalItemSelEnd")){$.removeClass("sapUiCalItemSelEnd");}s.call(this,$,w,x);}}else{var z;for(i=0;i<v.length;i++){$=q(v[i]);w=false;x=false;z=b.fromLocalJSDate(this._oFormatYyyymmdd.parse($.attr("data-sap-day")),h.Gregorian);if(z.isSame(S[0])){$.addClass("sapUiCalItemSelStart");w=true;$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");if(E&&z.isSame(E)){$.addClass("sapUiCalItemSelEnd");x=true;}$.removeClass("sapUiCalItemSelBetween");}else if(E&&a._isBetween(z,S[0],E)){$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");$.addClass("sapUiCalItemSelBetween");$.removeClass("sapUiCalItemSelStart");$.removeClass("sapUiCalItemSelEnd");}else if(E&&z.isSame(E)){$.addClass("sapUiCalItemSelEnd");x=true;$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");$.removeClass("sapUiCalItemSelStart");$.removeClass("sapUiCalItemSelBetween");}else{if($.hasClass("sapUiCalItemSel")){$.removeClass("sapUiCalItemSel");$.attr("aria-selected","false");}if($.hasClass("sapUiCalItemSelStart")){$.removeClass("sapUiCalItemSelStart");}else if($.hasClass("sapUiCalItemSelBetween")){$.removeClass("sapUiCalItemSelBetween");}else if($.hasClass("sapUiCalItemSelEnd")){$.removeClass("sapUiCalItemSelEnd");}}s.call(this,$,w,x);}}}function s($,S,E){if(!this.getIntervalSelection()){return;}var v="";var w=[];var x=this.getId();var y=false;v=$.attr("aria-describedby");if(v){w=v.split(" ");}var z=-1;var A=-1;for(var i=0;i<w.length;i++){var B=w[i];if(B===(x+"-Start")){z=i;}if(B===(x+"-End")){A=i;}}if(z>=0&&!S){w.splice(z,1);y=true;if(A>z){A--;}}if(A>=0&&!E){w.splice(A,1);y=true;}if(z<0&&S){w.push(x+"-Start");y=true;}if(A<0&&E){w.push(x+"-End");y=true;}if(y){v=w.join(" ");$.attr("aria-describedby",v);}}function t(){if(this._bMouseMove){this._unbindMousemove(true);}this.fireSelect();}function u(){if(!this._bNamesLengthChecked){var w,W=this.getDomRef().querySelectorAll(".sapUiCalWH:not([style='visibility: hidden;'])"),T=this._isMonthNameLong(W),v,S,x,i;if(T){this._bLongWeekDays=false;v=this._getLocaleData();S=this._getFirstWeekDay();x=v.getDaysStandAlone("narrow",this.getPrimaryCalendarType());for(i=0;i<W.length;i++){w=W[i];w.textContent=x[(i+S)%7];}}else{this._bLongWeekDays=true;}this._bNamesLengthChecked=true;}}return k;});
