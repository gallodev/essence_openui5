sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",	
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"	
], function (Controller, MessageToast , JSONModel , Filter, FilterOperator) {
	"use strict";
	
	return Controller.extend("Essenceit.App", {
		onInit : function () {			
			var oModel = new JSONModel();
			 oModel.loadData("../model/users.json");			 
			 this.getView().setModel(oModel);
		 },

		onFilter: function (oEvent) {			
			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("name", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.byId("userList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},		
		onUpdateItem : function () {
			alert("opa");
		},
        onRegister : function () {
            alert("testeee");
        }
	});

});