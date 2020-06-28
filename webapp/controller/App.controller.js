sap.ui.define([
	"sap/ui/core/mvc/Controller",	
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment"
], function (Controller , JSONModel , Filter, FilterOperator , Fragment) {
	"use strict";
	
	return Controller.extend("Essenceit.App", {

		onInit : function () {			

			let oModel = new JSONModel();

			const INIT_DATA = {	
				"users": [
					/*{
						"id" : 1,
						"name": "Christian",
						"lastName": "Gallo"
					},
					{
						"id" : 2,
						"name": "Marcio",
						"lastName": "Gallo"
					}*/		
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
		
		onDelete : function (oEvent) {

			var r = confirm("Deseja deletar o registro ?");
			if (r == true) {
				console.log(oEvent);
				var path = oEvent.getParameter('listItem').getBindingContext().getPath();
				var idx = parseInt(path.substring(path.lastIndexOf('/') +1));
				console.log(idx);

				let oView = this.getView();
				let oModel = oView.getModel();			
				var data = oModel.oData;				
				data.users.splice(idx, 1);
				oModel.setData(data);														
			} 			

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

		validateData : function(name,lastName){
			if(name === ""){
				alert(" Nome não pode ser vazio")
				return false;
			}
			if(lastName === ""){
				alert(" Sobrenome não pode ser vazio ");
				return false;
			}
			return true;
		},
		
		onRegisterSubmit : function (oEvent) {			
			let oView = this.getView();
			let oModel = oView.getModel();
			let name = oView.byId('inputName').getValue();
			let lastName = oView.byId('inputLastName').getValue();
			
			if(this.validateData(name,lastName) === false){
				oEvent.preventDefault();
				return;
			}
						
			let oData = oModel.oData;
			let last_id = 0;

			if(oData.users.length > 0){
				last_id = oData.users[oData.users.length - 1].id + 1;
			}

			let format_data = {
				id : last_id,
				name : name,
				lastName : lastName
			};

			oData.users.push(format_data)			
							
			let oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);			
			oModel.refresh(true);			
			oStorage.put("localData", oData);
														
			// Tentei atualizar a lista mas não tive sucesso
			/*let oList = sap.ui.getCore().byId("__xmlview1--userList")
			oList.getBinding('items').bDetectUpdates = true
			oList.getBinding("items").refresh(true);
			*/
								
			alert("Cadastrado com sucesso !");			
			this.onCloseRegisterDialog();
						
			window.location.reload();
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