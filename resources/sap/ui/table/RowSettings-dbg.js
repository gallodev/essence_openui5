/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.table.RowSettings
sap.ui.define([
	'sap/ui/core/Element', './utils/TableUtils', 'sap/ui/base/DataType', './library', 'sap/ui/core/library'
], function(Element, TableUtils, DataType, library, coreLibrary) {
	"use strict";

	// shortcuts
	var MessageType = coreLibrary.MessageType;
	var IndicationColor = coreLibrary.IndicationColor;

	/**
	 * Constructor for new RowSettings.
	 *
	 * @param {string} [sId] ID for the new element, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The <code>RowSettings</code> control allows you to configure a row.
	 * You can only use this control in the context of the <code>sap.ui.table.Table</code> control to define row settings.
	 * @extends sap.ui.core.Element
	 * @version 1.78.1
	 *
	 * @constructor
	 * @public
	 * @since 1.48.0
	 * @alias sap.ui.table.RowSettings
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var RowSettings = Element.extend("sap.ui.table.RowSettings", /** @lends sap.ui.table.RowSettings.prototype */ {
		metadata: {
			library: "sap.ui.table",
			properties: {

				/**
				 * The highlight state of the rows.
				 *
				 * If the highlight is set to {@link sap.ui.core.MessageType sap.ui.core.MessageType.None} (default), no highlights are visible.
				 * Valid values for the <code>highlight</code> property are values of the enumerations {@link sap.ui.core.MessageType} or
				 * {@link sap.ui.core.IndicationColor}.
				 *
				 * Accessibility support is provided through the associated {@link sap.ui.table.RowSettings#setHighlightText highlightText} property.
				 * If the <code>highlight</code> property is set to a value of {@link sap.ui.core.MessageType}, the <code>highlightText</code>
				 * property does not need to be set because a default text is used. However, the default text can be overridden by setting the
				 * <code>highlightText</code> property.
				 * In all other cases the <code>highlightText</code> property must be set.
				 *
				 * @since 1.48.0
				 */
				highlight : {type : "string", group : "Appearance", defaultValue : "None"},

				/**
				 * Defines the semantics of the {@link sap.ui.table.RowSettings#setHighlight highlight} property for accessibility purposes.
				 *
				 * @since 1.62
				 */
				highlightText : {type : "string", group : "Misc", defaultValue : ""},

				/**
				 * The navigated state of a row.
				 *
				 * If set to <code>true</code>, a navigation indicator is displayed at the end of the row.
				 * <b>Note:</b> The navigation indicator is only visible if row actions are available.
				 */
				navigated : {type : "boolean", group : "Appearance", defaultValue : false}
			}
		}
	});

	RowSettings.prototype.validateProperty = function(sPropertyName, oValue) {
		if (sPropertyName != "highlight" || oValue == null /* null or undefined */) {
			return Element.prototype.validateProperty.apply(this, arguments);
		}

		if (!DataType.getType("sap.ui.core.MessageType").isValid(oValue) && !DataType.getType("sap.ui.core.IndicationColor").isValid(oValue)) {
			throw new Error("\"" + oValue + "\" is of type " + typeof oValue + ", expected is a value of the enums sap.ui.core.MessageType or sap.ui.core.IndicationColor"
				+ " for property \"" + sPropertyName + "\" of " + this);
		}
		return oValue;
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	RowSettings.prototype.setHighlight = function(sHighlight) {
		var oRow;
		var oHighlightElement;

		this.setProperty("highlight", sHighlight, true);

		oRow = this._getRow();
		if (!oRow) {
			return this;
		}

		oHighlightElement = oRow.getDomRef("highlight");
		if (!oHighlightElement) {
			return this;
		}

		// Remove the currently set highlight class.
		for (var sMessageType in MessageType) {
			oHighlightElement.classList.remove("sapUiTableRowHighlight" + sMessageType);
		}
		for (var sIndicationColor in IndicationColor) {
			oHighlightElement.classList.remove("sapUiTableRowHighlight" + sIndicationColor);
		}

		// Set the new highlight class.
		oHighlightElement.classList.add(this._getHighlightCSSClassName());

		// Update the accessibility information.
		var oTable = oRow.getParent();
		var oAccessibilityExtension = oTable ? oTable._getAccExtension() : null;

		if (oAccessibilityExtension) {
			oAccessibilityExtension.updateAriaStateOfRowHighlight(this);
		}

		return this;
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	RowSettings.prototype.setNavigated = function(bNavigated) {
		var oRow;
		var oNavigatedElement;

		this.setProperty("navigated", bNavigated, true);

		oRow = this._getRow();
		if (!oRow) {
			return this;
		}

		oNavigatedElement = oRow.getDomRef("navIndicator");
		if (!oNavigatedElement) {
			return this;
		}

		if (bNavigated) {
			oNavigatedElement.classList.add("sapUiTableRowNavigated");
		} else {
			oNavigatedElement.classList.remove("sapUiTableRowNavigated");
		}

		return this;
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	RowSettings.prototype.setHighlightText = function(sHighlightText) {
		var oRow = this._getRow();
		var oTable = oRow ? oRow.getParent() : null;
		var oAccessibilityExtension = oTable ? oTable._getAccExtension() : null;

		this.setProperty("highlightText", sHighlightText, true);

		if (oAccessibilityExtension) {
			oAccessibilityExtension.updateAriaStateOfRowHighlight(this);
		}

		return this;
	};

	/**
	 * Gets the css class name representation for the current highlight state.
	 *
	 * @returns {string} CSS class name representation of the highlight.
	 * @private
	 */
	RowSettings.prototype._getHighlightCSSClassName = function() {
		var sHighlight = this.getHighlight();

		if (sHighlight == null) {
			sHighlight = MessageType.None;
		}

		return "sapUiTableRowHighlight" + sHighlight;
	};

	/**
	 * Gets the text representation of the current highlight state.
	 *
	 * @returns {string} Text representation of the highlight.
	 * @private
	 */
	RowSettings.prototype._getHighlightText = function() {
		var sHighlight = this.getHighlight();

		if (sHighlight === MessageType.None) {
			return "";
		}

		var sHighlightText = this.getHighlightText();

		if (sHighlight in MessageType && sHighlightText === "") {
			// TBL_ROW_STATE_INFORMATION, TBL_ROW_STATE_ERROR, TBL_ROW_STATE_WARNING, TBL_ROW_STATE_SUCCESS
			sHighlightText = TableUtils.getResourceText("TBL_ROW_STATE_" + sHighlight.toUpperCase());
		}

		return sHighlightText;
	};

	/**
	 * Gets the instance of the row these settings belong to.
	 *
	 * @returns {sap.ui.table.Row|null} Row instance these settings belong to, or <code>null</code> if they are not associated with a row.
	 * @private
	 */
	RowSettings.prototype._getRow = function() {
		var oRow = this.getParent();

		if (TableUtils.isA(oRow, "sap.ui.table.Row")) {
			return oRow;
		} else {
			return null;
		}
	};

	return RowSettings;
});
