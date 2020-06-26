/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object"],function(B){"use strict";var r=/\{\{destinations.([^\}]+)/;var D=B.extend("sap.ui.integration.util.Destinations",{metadata:{library:"sap.ui.integration"},constructor:function(h,c){B.call(this);this._oHost=h;this._oConfiguration=c;this._mResolved=new Map();}});D.prototype.setHost=function(h){this._oHost=h;this._mResolved.clear();};D.prototype.process=function(c){var u=c.url,C;if(!u||typeof u!=="string"){return Promise.resolve(c);}if(!this.hasDestination(u)){return Promise.resolve(c);}C=jQuery.extend(true,{},c);return this.processString(u).then(function(p){C.url=p;return C;});};D.prototype.getUrl=function(k){var R;if(this._mResolved.has(k)){return this._mResolved.get(k);}R=this._resolveUrl(k);this._mResolved.set(k,R);return R;};D.prototype._resolveUrl=function(k){var c=this._oConfiguration?this._oConfiguration[k]:null,n,d;if(!c){return Promise.reject("Configuration for destination '"+k+"' was not found in the manifest.");}n=c.name;d=c.defaultUrl;if(!n){return Promise.reject("Can not resolve destination '"+k+"'. There is no 'name' property.");}if(!this._oHost&&!d){return Promise.reject("Can not resolve destination '"+k+"'. There is no 'host' and no defaultUrl specified.");}if(!this._oHost&&d){return Promise.resolve(d);}return this._oHost.getDestination(n);};D.prototype.hasDestination=function(s){return!!s.match(r);};D.prototype.processString=function(s){var m=s.match(r),k;if(!m){return Promise.resolve(s);}k=m[1];return this.getUrl(k).then(function(u){return this._replaceUrl(s,k,u);}.bind(this));};D.prototype._replaceUrl=function(s,k,u){var S=u.trim().replace(/\/$/,"");return s.replace("{{destinations."+k+"}}",S);};return D;});