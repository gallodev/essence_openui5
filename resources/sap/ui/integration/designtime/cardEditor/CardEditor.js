/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/deepEqual","sap/base/util/each","sap/base/util/merge","sap/base/util/ObjectPath","sap/ui/integration/designtime/baseEditor/BaseEditor","./config/index"],function(d,e,m,O,B,D){"use strict";var C=B.extend("sap.ui.integration.designtime.cardEditor.CardEditor",{metadata:{properties:{"layout":{type:"string",defaultValue:"form"}}},constructor:function(){B.prototype.constructor.apply(this,arguments);this.addConfig(D);},renderer:B.getMetadata().getRenderer()});function a(o,s,n,k,v){if(!o[s]){o[s]={};}if(!o[s][n]){o[s][n]={};}o[s][n][k]=v;}function g(j,i){var n=j.hasOwnProperty("sap.card")?"sap.card":"sap.widget";var c=O.get([n,"configuration"],j);var I=O.get([n,"configuration"],i);if(d(c,I)){return undefined;}var o={};e(c,function(s,b){e(b,function(N,S){if(!I[s][N]){o[s]=o[s]||{};o[s][N]=S;}else{e(S,function(k,v){if(I[s][N][k]!==v){a(o,s,N,k,v);}});}});});return{configuration:o};}C.prototype.init=function(){B.prototype.init.apply(this,arguments);this.attachJsonChange(function(E){if(!this._oInitialJson){this._oInitialJson=E.getParameter("json");}},this);};C.prototype.getDeltaChangeDefinition=function(p){return new Promise(function(r,b){sap.ui.require(["sap/ui/fl/Change"],function(c){var o=this.getJson();var P=m({},p);P.content=g(o,this._oInitialJson);if(!P.content){b("No Change");}P.changeType=o.hasOwnProperty("sap.card")?"appdescr_card":"appdescr_widget";P.creation=new Date().toISOString();P.generator="CardEditor";P.selector={};P.reference=O.get(["sap.app","id"],o);var f=c.createInitialFileContent(P);f.creation=new Date().toISOString();this._oInitialJson=o;r(f);}.bind(this));}.bind(this));};return C;});