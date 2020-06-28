sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",	
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment"
], function (Controller, MessageToast , JSONModel , Filter, FilterOperator , Fragment) {
	"use strict";
	
	return Controller.extend("Essenceit.App", {

		onInit : function () {			

			let oModel = new JSONModel();

			const INIT_DATA = {	
				"users": [
					{
						"id" : 1,
						"name": "Christian",
						"lastName": "Gallo"
					},
					{
						"id" : 2,
						"name": "Marcio",
						"lastName": "Gallo"
					}		
				]		
			};

			let oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);

			if (!oStorage.get("localData")) {			
				oStorage.put("localData", INIT_DATA);										
			}

			let oData = oStorage.get("localData");
			oModel.setData(oData);
			
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
		
		onDelete : function () {
			alert("delete")
		},

        onRegister : function () {
            let oView = this.getView();
			
			if (!this.byId("registerDialog")) {				
				Fragment.load({
					id: oView.getId(),
					name: "Essenceit.view.Register",															
					type : "XML",
					controller: this
				}).then(function (oDialog) {						
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("registerDialog").open();
			}   
		},
		
		onRegisterSubmit : function () {			
			let oView = this.getView();
			let oModel = oView.getModel();
			let name = oView.byId('inputName').getValue();
			let lastName = oView.byId('inputLastName').getValue();
			
			let format_data = {
				id : $.now(),
				name : name,
				lastName : lastName
			};
			
			let oData = oModel.oData;
			oData.users.push(format_data)			

			let oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);			
			oStorage.put("localData", oData);
												
			let oList = sap.ui.getCore().byId("__xmlview1--userList")
			oList.getBinding("items").refresh(true);
			oModel.refresh(true);
			
			alert("Cadastrado com sucesso !");
			this.onCloseRegisterDialog();
		},

		onCloseRegisterDialog : function () {
			this.byId("registerDialog").close();
		},

		onUpdate : function () {
			var oView = this.getView();
			
			if (!this.byId("updateDialog")) {				
				Fragment.load({
					id: oView.getId(),
					name: "Essenceit.view.Update",															
					type : "XML",
					controller: this
				}).then(function (oDialog) {						
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("updateDialog").open();
			}  
		},

		onCloseUpdateDialog : function () {
			this.byId("updateDialog").close();
		}

	});

});