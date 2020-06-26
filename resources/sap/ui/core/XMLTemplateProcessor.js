/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/ui/base/DataType','sap/ui/base/ManagedObject','sap/ui/core/CustomData','./mvc/View','./mvc/EventHandlerResolver','./ExtensionPoint','./StashedControlSupport','sap/ui/base/SyncPromise','sap/base/Log','sap/base/util/ObjectPath','sap/base/util/values','sap/base/assert','sap/base/security/encodeXML','sap/base/util/LoaderExtensions','sap/base/util/JSTokenizer','sap/base/util/isEmptyObject'],function(q,D,M,C,V,E,a,S,b,L,O,v,c,d,f,J,g){"use strict";function h(T,s,N,e,r){var B=M.bindingParser(s,e,true,false,false,false,r);if(B&&typeof B==="object"){return B;}var i=s=B||s;var j=D.getType(T);if(j){if(j instanceof D){i=j.parseValue(s,{context:e,locals:r});if(!j.isValid(i)){L.error("Value '"+s+"' is not valid for type '"+j.getName()+"'.");}}}else{throw new Error("Property "+N+" has unknown type "+T);}return typeof i==="string"?M.bindingParser.escape(i):i;}function l(x){return x.localName||x.baseName||x.nodeName;}function u(p){if(p.isRejected()){throw p.getResult();}return p.getResult();}function k(A,e){function s(j,p,r,w){var x,y,z=[];for(x=j.firstChild;x;x=x.nextSibling){y=e(j,p,r,x,false,w);if(y){z.push(u(y));}}return b.resolve(z);}function i(j,p,r,w){var x,y=Promise.resolve(),z=[w];for(x=j.firstChild;x;x=x.nextSibling){y=y.then(e.bind(null,j,p,r,x,false,w));z.push(y);}return Promise.all(z);}return A?i:s;}var X={};X.loadTemplate=function(T,e){var r=T.replace(/\./g,"/")+("."+(e||"view")+".xml");return f.loadResource(r).documentElement;};X.loadTemplatePromise=function(T,e){var r=T.replace(/\./g,"/")+("."+(e||"view")+".xml");return f.loadResource(r,{async:true}).then(function(R){return R.documentElement;});};X.parseViewAttributes=function(x,e,s){var A=e.getMetadata().getAllProperties();for(var i=0;i<x.attributes.length;i++){var j=x.attributes[i];if(j.name==='controllerName'){e._controllerName=j.value;}else if(j.name==='resourceBundleName'){e._resourceBundleName=j.value;}else if(j.name==='resourceBundleUrl'){e._resourceBundleUrl=j.value;}else if(j.name==='resourceBundleLocale'){e._resourceBundleLocale=j.value;}else if(j.name==='resourceBundleAlias'){e._resourceBundleAlias=j.value;}else if(j.name==='class'){e.addStyleClass(j.value);}else if(!s[j.name]&&A[j.name]){s[j.name]=h(A[j.name].type,j.value,j.name,e._oContainingView.oController);}}};X.enrichTemplateIds=function(x,e){X.enrichTemplateIdsPromise(x,e,false);return x;};X.enrichTemplateIdsPromise=function(x,e,A){return o(x,e,true,A).then(function(){return x;});};X.parseTemplate=function(x,e){return u(X.parseTemplatePromise(x,e,false));};X.parseTemplatePromise=function(x,i,A,P){return o(x,i,false,A,P).then(function(){var p=b.resolve();var j=arguments;if(i.isA("sap.ui.core.mvc.View")&&i._epInfo&&i._epInfo.all.length>0){p=t(A,i,{"content":i._epInfo.all});}return p.then(function(){if(Array.isArray(j[0])){j[0]=j[0].filter(function(e){return!e._isExtensionPoint;});}return j[0];});});};function m(r){var e,i=/^[a-zA-Z_$][a-zA-Z0-9_$]*$/;if(!r||typeof r!=="object"){e="core:require in XMLView can't be parsed to a valid object";}else{Object.keys(r).some(function(K){if(!i.test(K)){e="core:require in XMLView contains invalid identifier: '"+K+"'";return true;}if(!r[K]||typeof r[K]!=="string"){e="core:require in XMLView contains invalide value '"+r[K]+"'under key '"+K+"'";return true;}});}return e;}function n(x,A){var s=x.getAttributeNS("sap.ui.core","require"),r,j,p;if(s){try{r=J.parseJS(s);}catch(e){L.error("Require attribute can't be parsed on Node: ",x.nodeName);throw e;}p=m(r);if(p){throw new Error(p+" on Node: "+x.nodeName);}if(!g(r)){j={};if(A){return new Promise(function(w,y){var z=Object.keys(r).reduce(function(i,K){j[K]=sap.ui.require(r[K]);return i&&j[K]!==undefined;},true);if(z){w(j);return;}sap.ui.require(v(r),function(){var B=arguments;Object.keys(r).forEach(function(K,i){j[K]=B[i];});w(j);},y);});}else{Object.keys(r).forEach(function(K){j[K]=sap.ui.requireSync(r[K]);});return b.resolve(j);}}}}function t(A,T,e){var i=b.resolve();if(!g(e)){var j=[];var r;if(A){i=new Promise(function(p){r=p;});}Object.keys(e).forEach(function(s){var w=e[s];w.forEach(function(x){x.targetControl=T;var y=sap.ui.require(x.providerClass);if(y){j.push(y.applyExtensionPoint(x));}else{var p=new Promise(function(z,B){sap.ui.require([x.providerClass],function(F){z(F);},B);}).then(function(z){return z.applyExtensionPoint(x);});j.push(p);}});});if(A){Promise.all(j).then(r);}}return i;}function o(x,p,r,A,P){var R=[],s=n(x,A)||b.resolve();A=A&&p._sProcessingMode==="sequential";L.debug("XML processing mode is "+(A?"sequential":"default"),"","XMLTemplateProcessor");var w=sap.ui.getCore().getConfiguration().getDesignMode();if(w){p._sapui_declarativeSourceInfo={xmlNode:x,xmlRootNode:p._oContainingView===p?x:p._oContainingView._sapui_declarativeSourceInfo.xmlRootNode};}var y=p.sViewName||p._sFragmentName;if(!y){var T=p;var z=0;while(++z<1000&&T&&T!==T._oContainingView){T=T._oContainingView;}y=T.sViewName;}if(p.isSubView()){I(x,true,false,s);}else{if(x.localName==="View"&&x.namespaceURI!=="sap.ui.core.mvc"){L.warning("XMLView root node must have the 'sap.ui.core.mvc' namespace, not '"+x.namespaceURI+"'"+(y?" (View name: "+y+")":""));}K(x,false,false,s);}var i=0;function B(){for(;i<R.length;i++){var e=R[i];if(e&&typeof e.then==='function'){return e.then(F).then(B);}}return R;}function F(e){var j=[i,1].concat(e);Array.prototype.splice.apply(R,j);}return s.then(B);function G(e){return e;}function H(e){return p._oContainingView.createId(e);}function I(x,e,j,$){if(x.nodeType===1){var _=l(x);if(x.namespaceURI==="http://www.w3.org/1999/xhtml"||x.namespaceURI==="http://www.w3.org/2000/svg"){R.push("<"+_+" ");var a1=false;for(var i=0;i<x.attributes.length;i++){var b1=x.attributes[i];var c1=b1.value;if(b1.name==="id"){a1=true;c1=Y(p,x);}R.push(b1.name+"=\""+d(c1)+"\" ");}if(e===true){R.push("data-sap-ui-preserve"+"=\""+p.getId()+"\" ");if(!a1){R.push("id"+"=\""+p.getId()+"\" ");}}R.push(">");var d1=x;if(window.HTMLTemplateElement&&x instanceof HTMLTemplateElement&&x.content instanceof DocumentFragment){d1=x.content;}K(d1,false,false,$);R.push("</"+_+">");}else if(_==="FragmentDefinition"&&x.namespaceURI==="sap.ui.core"){K(x,false,true,$);}else{s=s.then(function(){return U(x,$).then(function(g1){for(var i=0;i<g1.length;i++){var h1=g1[i];if(p.getMetadata().hasAggregation("content")){p._epInfo=p._epInfo||{contentControlsCount:0,last:null,all:[]};if(h1._isExtensionPoint){h1.index=p._epInfo.contentControlsCount;h1.targetControl=p;h1.aggregationName="content";if(p._epInfo.last){p._epInfo.last._nextSibling=h1;}p._epInfo.last=h1;p._epInfo.all.push(h1);}else{p._epInfo.contentControlsCount++;p.addAggregation("content",h1);}}else if(p.getMetadata().hasAssociation(("content"))){p.addAssociation("content",h1);}}return g1;});});R.push(s);}}else if(x.nodeType===3&&!j){var e1=x.textContent||x.text,f1=l(x.parentNode);if(e1){if(f1!="style"){e1=d(e1);}R.push(e1);}}}function K(x,e,j,$){var _=x.childNodes;for(var i=0;i<_.length;i++){I(_[i],e,j,$);}}function N(e,j){var $;var _=sap.ui.getCore().getLoadedLibraries();q.each(_,function(d1,e1){if(e===e1.namespace||e===e1.name){$=e1.name+"."+((e1.tagNames&&e1.tagNames[j])||j);}});$=$||e+"."+j;function a1(c1){if(!c1){L.error("Control '"+$+"' did not return a class definition from sap.ui.define.","","XMLTemplateProcessor");c1=O.get($);}if(!c1){L.error("Can't find object class '"+$+"' for XML-view","","XMLTemplateProcessor");}return c1;}var b1=$.replace(/\./g,"/");var c1=sap.ui.require(b1);if(!c1){if(A){return new Promise(function(d1,e1){sap.ui.require([b1],function(c1){c1=a1(c1);d1(c1);},e1);});}else{c1=sap.ui.requireSync(b1);c1=a1(c1);}}return c1;}function Q(e,j){if(e.namespaceURI==="http://www.w3.org/1999/xhtml"||e.namespaceURI==="http://www.w3.org/2000/svg"){var $=e.attributes['id']?e.attributes['id'].textContent||e.attributes['id'].text:null;if(r){return X.enrichTemplateIdsPromise(e,p,A).then(function(){return[];});}else{var _=function(b1){var c1={id:$?Y(p,e,$):undefined,xmlNode:e,containingView:p._oContainingView,processingMode:p._sProcessingMode};if(p.fnScopedRunWithOwner){return p.fnScopedRunWithOwner(function(){return new b1(c1);});}return new b1(c1);};if(A){return new Promise(function(b1,c1){sap.ui.require(["sap/ui/core/mvc/XMLView"],function(a1){b1([_(a1)]);},c1);});}else{var a1=sap.ui.requireSync("sap/ui/core/mvc/XMLView");return b.resolve([_(a1)]);}}}else{return U(e,j);}}function U(e,j){if(l(e)==="ExtensionPoint"&&e.namespaceURI==="sap.ui.core"){if(r){return b.resolve([]);}else{var $=p instanceof V?p._oContainingView:p;var _=a._factory.bind(null,$,e.getAttribute("name"),function(){var b1=b.resolve();var c1=[];var d1=e.childNodes;for(var i=0;i<d1.length;i++){var e1=d1[i];if(e1.nodeType===1){b1=b1.then(Q.bind(null,e1,j));c1.push(b1);}}return b.all(c1).then(function(f1){var g1=[];f1.forEach(function(h1){g1=g1.concat(h1);});return g1;});});return b.resolve(p.fnScopedRunWithOwner?p.fnScopedRunWithOwner(_):_());}}else{var a1=N(e.namespaceURI,l(e));if(a1&&typeof a1.then==='function'){return a1.then(function(b1){return W(e,b1,j);});}else{return W(e,a1,j);}}}function W($,_,a1){var ns=$.namespaceURI,c1={},d1={},e1="",f1=[],g1=null,h1=null;if(!_){return b.resolve([]);}var i1=_.getMetadata();var j1=i1.getAllSettings();var k1=n($,A);if(k1){a1=b.all([a1,k1]).then(function(e){return Object.assign({},e[0],e[1]);});}a1=a1.then(function(j){if(g(j)){j=null;}if(!r){for(var i=0;i<$.attributes.length;i++){var b1=$.attributes[i],p1=b1.name,q1=j1[p1],r1=b1.value;if(p1==="id"){c1[p1]=Y(p,$,r1);}else if(p1==="class"){e1+=r1;}else if(p1==="viewName"){c1[p1]=r1;}else if(p1==="fragmentName"){c1[p1]=r1;c1['containingView']=p._oContainingView;}else if((p1==="binding"&&!q1)||p1==='objectBindings'){var s1=M.bindingParser(r1,p._oContainingView.oController);if(s1){c1.objectBindings=c1.objectBindings||{};c1.objectBindings[s1.model||undefined]=s1;}}else if(p1==='metadataContexts'){var t1=null;try{t1=X._calculatedModelMapping(r1,p._oContainingView.oController,true);}catch(e){L.error(p+":"+e.message);}if(t1){c1.metadataContexts=t1;if(X._preprocessMetadataContexts){X._preprocessMetadataContexts(_.getMetadata().getName(),c1,p._oContainingView.oController);}}}else if(p1.indexOf(":")>-1){if(b1.namespaceURI==="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"){var u1=l(b1);f1.push(new C({key:u1,value:h("any",r1,u1,p._oContainingView.oController)}));}else if(b1.namespaceURI==="http://schemas.sap.com/sapui5/extension/sap.ui.core.support.Support.info/1"){h1=r1;}else if(b1.namespaceURI&&b1.namespaceURI.indexOf("http://schemas.sap.com/sapui5/preprocessorextension/")===0){L.debug(p+": XMLView parser ignored preprocessor attribute '"+p1+"' (value: '"+r1+"')");}else if(p1.indexOf("xmlns:")!==0){if(!g1){g1={};}if(!g1.hasOwnProperty(b1.namespaceURI)){g1[b1.namespaceURI]={};}g1[b1.namespaceURI][l(b1)]=b1.nodeValue;L.debug(p+": XMLView parser encountered unknown attribute '"+p1+"' (value: '"+r1+"') with unknown namespace, stored as sap-ui-custom-settings of customData");}}else if(q1&&q1._iKind===0){c1[p1]=h(q1.type,r1,p1,p._oContainingView.oController,j);}else if(q1&&q1._iKind===1&&q1.altTypes){c1[p1]=h(q1.altTypes[0],r1,p1,p._oContainingView.oController,j);}else if(q1&&q1._iKind===2){var s1=M.bindingParser(r1,p._oContainingView.oController,false,false,false,false,j);if(s1){c1[p1]=s1;}else{L.error(p+": aggregations with cardinality 0..n only allow binding paths as attribute value (wrong value: "+p1+"='"+r1+"')");}}else if(q1&&q1._iKind===3){c1[p1]=H(r1);}else if(q1&&q1._iKind===4){c1[p1]=r1.split(/[\s,]+/g).filter(G).map(H);}else if(q1&&q1._iKind===5){var v1=[];E.parse(r1).forEach(function(w1){var x1=E.resolveEventHandler(w1,p._oContainingView.oController,j);if(x1){v1.push(x1);}else{L.warning(p+": event handler function \""+w1+"\" is not a function or does not exist in the controller.");}});if(v1.length){c1[p1]=v1;}}else if(q1&&q1._iKind===-1){if(V.prototype.isPrototypeOf(_.prototype)&&p1=="async"){c1[p1]=h(q1.type,r1,p1,p._oContainingView.oController,j);}else{L.warning(p+": setting '"+p1+"' for class "+i1.getName()+" (value:'"+r1+"') is not supported");}}else{c(p1==='xmlns',p+": encountered unknown setting '"+p1+"' for class "+i1.getName()+" (value:'"+r1+"')");if(X._supportInfo){X._supportInfo({context:$,env:{caller:"createRegularControls",error:true,info:"unknown setting '"+p1+"' for class "+i1.getName()}});}}}if(g1){f1.push(new C({key:"sap-ui-custom-settings",value:g1}));}if(f1.length>0){c1.customData=f1;}}return j;});var l1=k(A,m1);function m1($,n1,o1,e,b1,a1){var p1,q1;if(e.nodeType===1){if(e.namespaceURI==="http://schemas.sap.com/sapui5/extension/sap.ui.core.xmlcomposite/1"){c1[l(e)]=e.querySelector("*");return;}p1=e.namespaceURI===ns&&o1&&o1[l(e)];if(p1){return l1(e,p1,false,a1);}else if(n1){if(!b1&&e.getAttribute("stashed")==="true"&&!r){q1=function(){S.createStashedControl(Y(p,e),{sParentId:c1["id"],sParentAggregationName:n1.name,fnCreate:function(){var j=A;A=false;try{return u(m1($,n1,o1,e,true,a1));}finally{A=j;}}});};if(p.fnScopedRunWithOwner){p.fnScopedRunWithOwner(q1);}else{q1();}return;}return Q(e,a1).then(function(r1){for(var j=0;j<r1.length;j++){var s1=r1[j];var t1=n1.name;if(s1._isExtensionPoint){if(!c1[t1]){c1[t1]=[];}var u1=d1[t1];if(!u1){u1=d1[t1]=[];}s1.index=c1[t1].length;s1.aggregationName=t1;var v1=u1[u1.length-1];if(v1){v1._nextSibling=s1;}u1.push(s1);}else if(n1.multiple){if(!c1[t1]){c1[t1]=[];}if(typeof c1[t1].path==="string"){c(!c1[t1].template,"list bindings support only a single template object");c1[t1].template=s1;}else{c1[t1].push(s1);}}else{c(!c1[t1],"multiple aggregates defined for aggregation with cardinality 0..1");c1[t1]=s1;}}return r1;});}else if(l($)!=="FragmentDefinition"||$.namespaceURI!=="sap.ui.core"){throw new Error("Cannot add direct child without default aggregation defined for control "+i1.getElementName());}}else if(e.nodeType===3){if(q.trim(e.textContent||e.text)){throw new Error("Cannot add text nodes as direct child of an aggregation. For adding text to an aggregation, a surrounding html tag is needed: "+q.trim(e.textContent||e.text));}}}var n1=i1.getDefaultAggregation();var o1=i1.getAllAggregations();return l1($,n1,o1,a1).then(function(){var e;var j=b.resolve();if(r&&$.hasAttribute("id")){Z(p,$);}else if(!r){if(V.prototype.isPrototypeOf(_.prototype)&&typeof _._sType==="string"){var b1=function(){if(_.getMetadata().isA("sap.ui.core.mvc.XMLView")&&p._sProcessingMode==="sequential"){c1.processingMode="sequential";}return V._legacyCreate(c1,undefined,_._sType);};if(p.fnScopedRunWithOwner){e=p.fnScopedRunWithOwner(b1);}else{e=b1();}}else{var p1=function(){var r1;if(_.getMetadata().isA("sap.ui.core.Fragment")&&$.getAttribute("type")!=="JS"&&p._sProcessingMode==="sequential"){c1.processingMode="sequential";}if(p.fnScopedRunWithOwner){r1=p.fnScopedRunWithOwner(function(){var r1=new _(c1);return r1;});}else{r1=new _(c1);}j=t(A,r1,d1);return r1;};if(P&&P.fnRunWithPreprocessor){e=P.fnRunWithPreprocessor(p1);}else{e=p1();}}if(e1&&e.addStyleClass){e.addStyleClass(e1);}}if(!e){e=[];}else if(!Array.isArray(e)){e=[e];}if(X._supportInfo&&e){for(var i=0,q1=e.length;i<q1;i++){var r1=e[i];if(r1&&r1.getId()){var s1=X._supportInfo({context:$,env:{caller:"createRegularControls",nodeid:$.getAttribute("id"),controlid:r1.getId()}}),t1=h1?h1+",":"";t1+=s1;X._supportInfo.addSupportInfo(r1.getId(),t1);}}}if(w){e.forEach(function(r1){if(i1.getCompositeAggregationName){var u1=$.getElementsByTagName(r1.getMetadata().getCompositeAggregationName());for(var i=0;i<u1.length;i++){$.removeChild(u1[0]);}}r1._sapui_declarativeSourceInfo={xmlNode:$,xmlRootNode:p._sapui_declarativeSourceInfo.xmlRootNode,fragmentName:i1.getName()==='sap.ui.core.Fragment'?c1['fragmentName']:null};});}return j.then(function(){return e;});});}function Y(p,x,e){if(x.getAttributeNS("http://schemas.sap.com/sapui5/extension/sap.ui.core.Internal/1","id")){return x.getAttribute("id");}else{return H(e?e:x.getAttribute("id"));}}function Z(p,x){x.setAttribute("id",H(x.getAttribute("id")));x.setAttributeNS("http://schemas.sap.com/sapui5/extension/sap.ui.core.Internal/1","id",true);}}X._preprocessMetadataContexts=null;X._calculatedModelMapping=function(B,e,A){var j,p={},r=M.bindingParser(B,e);function s(F){if(F.length%2===0){throw new Error("The last entry is no binding");}for(var i=1;i<=F.length;i=i+2){if(typeof F[i-1]=='string'){throw new Error("Binding expected not a string");}if(F[i]){if((typeof F[i]!='string')||(F[i]!=",")){throw new Error("Missing delimiter ','");}}}}if(r){if(!r.formatter){j=r;r={parts:[j]};}else{s(r.formatter.textFragments);}for(var i=0;i<r.parts.length;i++){j=r.parts[i];p[j.model]=p[j.model]||(A?[]:null);if(Array.isArray(p[j.model])){p[j.model].push(j);}else{p[j.model]=j;}}}return p;};return X;},true);
