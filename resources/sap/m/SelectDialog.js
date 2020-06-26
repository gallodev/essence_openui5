/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Button','./Dialog','./List','./SearchField','./library','./TitleAlignmentMixin','sap/ui/core/Control','sap/ui/Device','sap/ui/base/ManagedObject','sap/m/Toolbar','sap/m/Label','sap/m/BusyIndicator','sap/m/Bar','sap/m/Title','sap/ui/core/theming/Parameters','./SelectDialogRenderer',"sap/base/Log"],function(B,D,L,S,l,T,C,a,M,b,c,d,e,f,P,g,h){"use strict";var i=l.ListMode;var j=l.ButtonType;var k=l.TitleAlignment;var m=C.extend("sap.m.SelectDialog",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Appearance",defaultValue:null},noDataText:{type:"string",group:"Appearance",defaultValue:null},multiSelect:{type:"boolean",group:"Dimension",defaultValue:false},growingThreshold:{type:"int",group:"Misc",defaultValue:null},growing:{type:"boolean",group:"Behavior",defaultValue:true},contentWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},rememberSelections:{type:"boolean",group:"Behavior",defaultValue:false},contentHeight:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},showClearButton:{type:"boolean",group:"Behavior",defaultValue:false},confirmButtonText:{type:"string",group:"Appearance"},draggable:{type:"boolean",group:"Behavior",defaultValue:false},resizable:{type:"boolean",group:"Behavior",defaultValue:false},titleAlignment:{type:"sap.m.TitleAlignment",group:"Misc",defaultValue:k.Auto}},defaultAggregation:"items",aggregations:{items:{type:"sap.m.ListItemBase",multiple:true,singularName:"item",forwarding:{idSuffix:"-list",aggregation:"items",forwardBinding:true}},_dialog:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},events:{confirm:{parameters:{selectedItem:{type:"sap.m.StandardListItem"},selectedItems:{type:"sap.m.StandardListItem[]"},selectedContexts:{type:"object[]"}}},search:{parameters:{value:{type:"string"},itemsBinding:{type:"any"},clearButtonPressed:{type:"boolean"}}},liveChange:{parameters:{value:{type:"string"},itemsBinding:{type:"any"}}},cancel:{}}}});m.prototype.init=function(){var t=this,n=0;this._bAppendedToUIArea=false;this._bInitBusy=false;this._bFirstRender=true;this._bAfterCloseAttached=false;this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._oList=new L(this.getId()+"-list",{growing:t.getGrowing(),growingScrollToLoad:t.getGrowing(),mode:i.SingleSelectMaster,sticky:[l.Sticky.InfoToolbar],infoToolbar:new b({visible:false,active:false,content:[new c({text:this._oRb.getText("TABLESELECTDIALOG_SELECTEDITEMS",[0])})]}),selectionChange:this._selectionChange.bind(this)});this._oList.getInfoToolbar().addEventDelegate({onAfterRendering:function(){t._oList.getInfoToolbar().$().attr('aria-live','polite');}});this._list=this._oList;this._oList.attachUpdateStarted(this._updateStarted,this);this._oList.attachUpdateFinished(this._updateFinished,this);this._oBusyIndicator=new d(this.getId()+"-busyIndicator").addStyleClass("sapMSelectDialogBusyIndicator",true);this._oSearchField=new S(this.getId()+"-searchField",{width:"100%",liveChange:function(E){var v=E.getSource().getValue(),p=(v?300:0);clearTimeout(n);if(p){n=setTimeout(function(){t._executeSearch(v,false,"liveChange");},p);}else{t._executeSearch(v,false,"liveChange");}},search:function(E){var v=E.getSource().getValue(),p=E.getParameters().clearButtonPressed;t._executeSearch(v,p,"search");}});this._searchField=this._oSearchField;this._oSubHeader=new e(this.getId()+"-subHeader",{contentMiddle:[this._oSearchField]});var o=new e(this.getId()+"-dialog-header",{contentMiddle:[new f(this.getId()+"-dialog-title",{level:"H2"})]});this._setupBarTitleAlignment(o,this.getId()+"_customHeader");this._oDialog=new D(this.getId()+"-dialog",{customHeader:o,stretch:a.system.phone,contentHeight:"2000px",subHeader:this._oSubHeader,content:[this._oBusyIndicator,this._oList],leftButton:this._getCancelButton(),initialFocus:(a.system.desktop?this._oSearchField:null),draggable:this.getDraggable()&&a.system.desktop,resizable:this.getResizable()&&a.system.desktop,escapeHandler:function(p){t._onCancel();p.resolve();}}).addStyleClass("sapMSelectDialog");this._oDialog.addAriaLabelledBy(this._oList.getInfoToolbar());this._dialog=this._oDialog;this.setAggregation("_dialog",this._oDialog);this._oDialog._iVMargin=8*(parseInt(P.get("sapUiFontSize"))||16);this._sSearchFieldValue="";this._bFirstRequest=true;this._bLiveChange=false;this._iListUpdateRequested=0;};m.prototype.setGrowing=function(v){this._oList.setGrowing(v);this._oList.setGrowingScrollToLoad(v);this.setProperty("growing",v,true);return this;};m.prototype.setDraggable=function(v){this._setInteractionProperty(v,"draggable",this._oDialog.setDraggable);return this;};m.prototype.setResizable=function(v){this._setInteractionProperty(v,"resizable",this._oDialog.setResizable);return this;};m.prototype._setInteractionProperty=function(v,p,n){this.setProperty(p,v,true);if(!a.system.desktop&&v){h.warning(p+" property works only on desktop devices!");return;}if(a.system.desktop&&this._oDialog){n.call(this._oDialog,v);}};m.prototype.setBusy=function(){this._oDialog.setBusy.apply(this._oDialog,arguments);return this;};m.prototype.getBusy=function(){return this._oDialog.getBusy.apply(this._oDialog,arguments);};m.prototype.setBusyIndicatorDelay=function(v){this._oList.setBusyIndicatorDelay(v);this._oDialog.setBusyIndicatorDelay(v);this.setProperty("busyIndicatorDelay",v,true);return this;};m.prototype.exit=function(){this._oList=null;this._oSearchField=null;this._oSubHeader=null;this._oClearButton=null;this._oBusyIndicator=null;this._sSearchFieldValue=null;this._iListUpdateRequested=0;this._bFirstRequest=false;this._bInitBusy=false;this._bFirstRender=false;this._bFirstRequest=false;if(this._bAppendedToUIArea){var s=sap.ui.getCore().getStaticAreaRef();s=sap.ui.getCore().getUIArea(s);s.removeContent(this,true);}if(this._oDialog){this._oDialog.destroy();this._oDialog=null;}if(this._oOkButton){this._oOkButton.destroy();this._oOkButton=null;}this._oSelectedItem=null;this._aSelectedItems=null;this._list=null;this._searchField=null;this._dialog=null;};m.prototype.onAfterRendering=function(){if(this._bInitBusy&&this._bFirstRender){this._setBusy(true);this._bInitBusy=false;}return this;};m.prototype.invalidate=function(){if(this._oDialog&&(!arguments[0]||arguments[0]&&arguments[0].getId()!==this.getId()+"-dialog")){this._oDialog.invalidate(arguments);}else{C.prototype.invalidate.apply(this,arguments);}return this;};m.prototype.open=function(s){if((!this.getParent()||!this.getUIArea())&&!this._bAppendedToUIArea){var o=sap.ui.getCore().getStaticAreaRef();o=sap.ui.getCore().getUIArea(o);o.addContent(this,true);this._bAppendedToUIArea=true;}this._bFirstRequest=true;this._oSearchField.setValue(s);this._oDialog.open();if(this._bInitBusy){this._setBusy(true);}this._updateSelectionIndicator();this._aInitiallySelectedContextPaths=this._oList.getSelectedContextPaths();return this;};m.prototype.setGrowingThreshold=function(v){this._oList.setGrowingThreshold(v);this.setProperty("growingThreshold",v,true);return this;};m.prototype.setMultiSelect=function(n){this.setProperty("multiSelect",n,true);if(n){this._oList.setMode(i.MultiSelect);this._oList.setIncludeItemInSelection(true);this._oDialog.setEndButton(this._getCancelButton());this._oDialog.setBeginButton(this._getOkButton());}else{this._oList.setMode(i.SingleSelectMaster);this._oDialog.setEndButton(this._getCancelButton());this._oDialog.destroyBeginButton();delete this._oOkButton;}return this;};m.prototype.setTitle=function(t){this.setProperty("title",t,true);this._oDialog.getCustomHeader().getAggregation("contentMiddle")[0].setText(t);return this;};m.prototype.setConfirmButtonText=function(t){this.setProperty("confirmButtonText",t,true);this._oOkButton&&this._oOkButton.setText(t||this._oRb.getText("SELECT_CONFIRM_BUTTON"));return this;};m.prototype.setNoDataText=function(n){this._oList.setNoDataText(n);return this;};m.prototype.getNoDataText=function(){return this._oList.getNoDataText();};m.prototype.getContentWidth=function(){return this._oDialog.getContentWidth();};m.prototype.setContentWidth=function(w){this._oDialog.setContentWidth(w);return this;};m.prototype.getContentHeight=function(){return this._oDialog.getContentHeight();};m.prototype.setShowClearButton=function(v){this.setProperty("showClearButton",v,true);if(v){var o=this._oDialog.getCustomHeader();o.addContentRight(this._getClearButton());}if(this._oClearButton){this._oClearButton.setVisible(v);}return this;};m.prototype.setContentHeight=function(H){this._oDialog.setContentHeight(H);return this;};m.prototype.addStyleClass=function(){this._oDialog.addStyleClass.apply(this._oDialog,arguments);return this;};m.prototype.removeStyleClass=function(){this._oDialog.removeStyleClass.apply(this._oDialog,arguments);return this;};m.prototype.toggleStyleClass=function(){this._oDialog.toggleStyleClass.apply(this._oDialog,arguments);return this;};m.prototype.hasStyleClass=function(){return this._oDialog.hasStyleClass.apply(this._oDialog,arguments);};m.prototype.getDomRef=function(){if(this._oDialog){return this._oDialog.getDomRef.apply(this._oDialog,arguments);}else{return null;}};m.prototype.clearSelection=function(){this._removeSelection();this._updateSelectionIndicator();this._oDialog.focus();return this;};m.prototype._setModel=m.prototype.setModel;m.prototype.setModel=function(o,s){var A=Array.prototype.slice.call(arguments);this._setBusy(false);this._bInitBusy=false;this._iListUpdateRequested+=1;this._oList.setModel(o,s);m.prototype._setModel.apply(this,A);this._updateSelectionIndicator();return this;};m.prototype._setBindingContext=m.prototype.setBindingContext;m.prototype.setBindingContext=function(o,s){var n=Array.prototype.slice.call(arguments);this._oList.setBindingContext(o,s);m.prototype._setBindingContext.apply(this,n);return this;};m.prototype._executeSearch=function(v,n,E){var o=this._oList,p=(o?o.getBinding("items"):undefined),s=(this._sSearchFieldValue!==v);if(E==="liveChange"){this._bLiveChange=true;}if(this._oDialog.isOpen()&&((s&&E==="liveChange")||E==="search")){this._sSearchFieldValue=v;if(p){this._iListUpdateRequested+=1;if(E==="search"){this.fireSearch({value:v,itemsBinding:p,clearButtonPressed:n});}else if(E==="liveChange"){this.fireLiveChange({value:v,itemsBinding:p});}}else{if(E==="search"){this.fireSearch({value:v,clearButtonPressed:n});}else if(E==="liveChange"){this.fireLiveChange({value:v});}}}return this;};m.prototype._setBusy=function(n){if(this._iListUpdateRequested){if(n){this._oList.addStyleClass('sapMSelectDialogListHide');this._oBusyIndicator.$().css('display','inline-block');}else{this._oList.removeStyleClass('sapMSelectDialogListHide');this._oBusyIndicator.$().css('display','none');}}};m.prototype._updateStarted=function(E){if(this.getModel()&&this.getModel()instanceof sap.ui.model.odata.ODataModel){if(this._oDialog.isOpen()&&this._iListUpdateRequested){this._setBusy(true);}else{this._bInitBusy=true;}}};m.prototype._updateFinished=function(E){this._updateSelectionIndicator();if(this.getModel()&&this.getModel()instanceof sap.ui.model.odata.ODataModel){this._setBusy(false);this._bInitBusy=false;}if(a.system.desktop){if(this._oList.getItems()[0]){this._oDialog.setInitialFocus(this._oList.getItems()[0]);}else{this._oDialog.setInitialFocus(this._oSearchField);}if(this._bFirstRequest&&!this._bLiveChange){var F=this._oList.getItems()[0];if(!F){F=this._oSearchField;}if(F.getFocusDomRef()){F.getFocusDomRef().focus();}}}this._bFirstRequest=false;this._iListUpdateRequested=0;this._oList.getItems().forEach(function(I){I.addEventDelegate(this._getListItemsEventDelegates());},this);};m.prototype._getOkButton=function(){var t=this,o=null;o=function(){var n=t._oList.getBinding("items");if(n&&n.aFilters&&n.aFilters.length){t._oList.setGrowing(false);n.filter([]);t._oList.setGrowing(t.getGrowing());}t._oSelectedItem=t._oList.getSelectedItem();t._aSelectedItems=t._oList.getSelectedItems();t._oDialog.detachAfterClose(o);t._fireConfirmAndUpdateSelection();};if(!this._oOkButton){this._oOkButton=new B(this.getId()+"-ok",{type:j.Emphasized,text:this.getConfirmButtonText()||this._oRb.getText("SELECT_CONFIRM_BUTTON"),press:function(){t._oDialog.attachAfterClose(o);t._oDialog.close();}});}return this._oOkButton;};m.prototype._getCancelButton=function(){var t=this;if(!this._oCancelButton){this._oCancelButton=new B(this.getId()+"-cancel",{text:this._oRb.getText("MSGBOX_CANCEL"),press:function(E){t._onCancel();}});}return this._oCancelButton;};m.prototype._getClearButton=function(){if(!this._oClearButton){this._oClearButton=new B(this.getId()+"-clear",{text:this._oRb.getText("SELECTDIALOG_CLEARBUTTON"),press:this.clearSelection.bind(this)});}return this._oClearButton;};m.prototype._onCancel=function(E){var t=this,A=null;A=function(){t._oSelectedItem=null;t._aSelectedItems=[];t._sSearchFieldValue=null;t._oDialog.detachAfterClose(A);t._resetSelection();t.fireCancel();};this._oDialog.attachAfterClose(A);this._oDialog.close();};m.prototype._updateSelectionIndicator=function(){var s=this._oList.getSelectedContextPaths(true).length,I=this._oList.getInfoToolbar(),v=!!s&&this.getMultiSelect();if(this.getShowClearButton()&&this._oClearButton){this._oClearButton.setEnabled(s>0);}if(I.getVisible()!==v){I.setVisible(v);if(v){I.rerender();}}I.getContent()[0].setText(this._oRb.getText("TABLESELECTDIALOG_SELECTEDITEMS",[s]));};m.prototype._fireConfirmAndUpdateSelection=function(){var p={selectedItem:this._oSelectedItem,selectedItems:this._aSelectedItems};Object.defineProperty(p,"selectedContexts",{get:this._oList.getSelectedContexts.bind(this._oList,true)});this.fireConfirm(p);this._updateSelection();};m.prototype._selectionChange=function(){if(!this._oDialog){return;}if(this.getMultiSelect()){this._updateSelectionIndicator();return;}if(!this._bAfterCloseAttached){this._oDialog.attachEventOnce("afterClose",this._resetAfterClose,this);this._bAfterCloseAttached=true;}this._oDialog.close();};m.prototype._resetAfterClose=function(){this._oSelectedItem=this._oList.getSelectedItem();this._aSelectedItems=this._oList.getSelectedItems();this._bAfterCloseAttached=false;this._fireConfirmAndUpdateSelection();};m.prototype._updateSelection=function(){if(!this.getRememberSelections()&&!this.bIsDestroyed){this._removeSelection();}};m.prototype._removeSelection=function(){this._oList.removeSelections(true);delete this._oSelectedItem;delete this._aSelectedItems;};m.prototype._resetSelection=function(){if(!this.bIsDestroyed){this._oList.removeSelections(true);this._oList.setSelectedContextPaths(this._aInitiallySelectedContextPaths);this._oList.getItems().forEach(function(I){var p=I.getBindingContextPath();if(p&&this._aInitiallySelectedContextPaths.indexOf(p)>-1){I.setSelected(true);}},this);}};m.prototype._getListItemsEventDelegates=function(){var E=function(o){if(o&&o.isDefaultPrevented&&o.isMarked&&(o.isDefaultPrevented()||o.isMarked("preventSelectionChange"))){return;}this._selectionChange(o);}.bind(this);return{ontap:E,onsapselect:E};};T.mixInto(m.prototype);return m;});
