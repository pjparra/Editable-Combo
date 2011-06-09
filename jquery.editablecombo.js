/*
 * jQuery Editable Combo
 * version: 1.0.0 (2010-05-10)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://site.pierrejeanparra.com/jquery-plugins/editable-combo/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function($) {

	$.fn.editableCombo = function(options) {
		
		var params, nbNew = 0;
		
		if (!this.length) {
			return this;
		}
		
		// Valeurs par défaut du plugin
		$.editableCombo = {
			defaults: {
				comboBox: 'select:first',
				add: ':button:first',
				del: ':button:last',
				editableClass: 'editableOption',
				maxlength: 35,
				multiple: true,
				onAddOption: function(newVal, newLabel) {},
				onRemoveOption: function(oldVal) {},
				onEditOption: function(val, oldLabel, newLabel) {}
			},
			createTextBox: function(strBoxId, $objSel) {
				if (document.getElementById(strBoxId) == null) {
					var objBox = document.createElement('input');
					$(objBox).width($objSel.width()).attr('type', 'text').attr('id', strBoxId).attr('autocomplete', 'off').attr('maxlength', params.maxlength).addClass($objSel.attr('class'));
					
					// display text box
					$objSel.after(objBox);
					
					// set focus
					objBox.focus();
					
					// bind event to this text box
					// trigger blur event when 'return' key is pressed
					$(objBox).bind('keypress', function(elt) {
						var txtKey = $.editableCombo.event(elt);
						if (txtKey == 13)
							$(objBox).trigger('blur');
					});
					
					// autocomplete (with highlighting)
					$.editableCombo.autofill(strBoxId, $objSel);
				}
			},
			/**
			 * helper plugins for combobox
			 */
			event: function(e) {
				var intKey = 0;				
				if (!e) {
					var e = window.event;
				}
				if (e.keyCode) {
					intKey = e.keyCode;
				}
				else {
					if (e.which) {
						intKey = e.which;
					}
				}
				return intKey;
			},
			autofill: function(strBoxId, $objSel) {
				var objTextBox = $('#' + strBoxId);
				objTextBox.bind('keyup', function(e) {
					var strKeyword = objTextBox.val().toLowerCase();
					var intKey = $.editableCombo.event(e);
					switch (intKey) {
						case 8: // BACKSPACE
						case 9: // TAB (?)
						case 33: // PAGE UP
						case 34: // PAGE DOWN
						case 35: // END
						case 36: // HOME
						case 37: // CURSOR LEFT
						case 38: // CURSOR UP
						case 39: // CURSOR RIGHT
						case 40: // CURSOR DOWN
						case 45: // INSERT
						case 46: // DELETE
						case 27: // ESCAPE
						case 13: // RETURN
							break;
						default:
							// search for a match in the option text
							$objSel.children().each(function() {
								var strOption = $(this).text(),
									intPos = strOption.toLowerCase().indexOf(strKeyword);
								
								if (intPos == 0) {
									var intStart = strKeyword.length,
										intEnd = strOption.length;
									
									objTextBox.val(strOption);
									
									// for IE
									if ($.browser.msie) {
										var range = document.getElementById(strBoxId).createTextRange();
										range.moveStart('character', intStart);
										range.select();
									}
									else {
										// for others
										if (intStart == 0) {
											intStart = intStart + 1;
										}
										document.getElementById(strBoxId).setSelectionRange(intStart, intEnd);
									}								
									return false; //exit from loop
								}
							});
							break;
					}
				});
			}
		};
		
		params = $.extend($.editableCombo.defaults, options || {});
		
		return this.filter('select').each(function() {
			var add, del, combo = this, strSelId, strBoxId, $objSel;
			
			if (params.multiple) {
				$(combo).attr('multiple', 'multiple');
			}
				
			// Create a wrapper div element
			div = document.createElement('div');
			$(combo).wrapAll($(div).css('margin', '15px'));
			
			// Create the buttons
			add = document.createElement('input');
			del = document.createElement('input');
			$(add).attr('type', 'button').val('+');
			$(del).attr('type', 'button').val('-');
			
			// Add the buttons
			$(combo).after($(del)).after($(add)).after($(document.createElement('br')));
			
			// select box attributes
			strSelId = $(combo).attr('id');
			strBoxId = 'txt_' + strSelId;
			$objSel = $(combo);
			
			// Binds the add button
			$(add).click(function() {
				++nbNew;
				
				// remove selection from all options
				$objSel.children(':selected').removeAttr('selected');
				
				// hide select box
				$objSel.hide();
				
				// create text box if not created already
				$.editableCombo.createTextBox(strBoxId, $objSel);
					
				// bind on blur event
				$('#' + strBoxId).bind('blur', function(evt) {
					//create new option?
					var bolCreateOption = true;
					
					// search option with same value as in text box
					$objSel.children().each(function() {
						if ($(this).text().toLowerCase() == $('#' + strBoxId).text().toLowerCase()) {
							$(this).attr('selected', 'selected');
							bolCreateOption = false;
						}
					});
					
					// create new option in select box (if it has not been created before) and if needed
					if (!$objSel.children().hasClass(params.editableClass) && bolCreateOption) {
						$objSel.append("<option class=\""+params.editableClass+"\" selected></option>");
					}
					
					// if no option found with text that matches the value in text box
					if (bolCreateOption) {
						// if it has some text then update option else remove this created option
						if ($(this).val() != '') {
							// update key/value in option
							$objSel.children('option.' + params.editableClass).text($(this).val()).val('new'+nbNew.toString()).attr('selected', 'selected');
						}
						else {
							// if no value entered in text box, remove this option
							$objSel.children('option.' + params.editableClass).remove();
						}
					}
					else {
						// if a match found, then remove this option
						$objSel.children('option.' + params.editableClass).remove();
					}
					
					// display select box
					$objSel.show();
					
					// destroy text box
					var objNode = document.getElementById(strBoxId);
					objNode.parentNode.removeChild(objNode);
					
					// Call the callback function for user-defined behaviour
					params.onAddOption.call(this, $objSel.children('option.' + params.editableClass).val(), $objSel.children('option.' + params.editableClass).text());
					
					// Make the editable option a normal option
					$objSel.children('option.' + params.editableClass).removeClass(params.editableClass);
				});
			});
			
			// Binds the remove button
			$(del).click(function() {
				$objSel.children(':selected').each(function() {
					params.onRemoveOption.call(this, $(this).val());
				}).remove();
			});
			
			// Switch to edit mode on double click
			$(combo).dblclick(function() {
				// hide select box
				$objSel.hide();
				
				$.editableCombo.createTextBox(strBoxId, $objSel);
				
				// bind on blur event
				$('#' + strBoxId).bind('blur', function(evt) {
					//create new option?
					var bolCreateOption = true;
					
					// search option with same value as in text box
					$objSel.children().each(function() {
						if ($(this).text().toLowerCase() == $('#' + strBoxId).text().toLowerCase()) {
							$(this).attr('selected', 'selected');
							bolCreateOption = false;
						}
					});
					
					// make the selected option editable
					$objSel.children(':selected').addClass(params.editableClass);
					
					// if no option found with text that matches the value in text box
					if (bolCreateOption) {
						// if it has some text then update option else remove this created option
						if ($(this).val() != '') {
							// update key/value in option
							$objSel.children('option.' + params.editableClass).text($(this).val()).val('new'+nbNew.toString()).attr('selected', 'selected');
						}
						else {
							// if no value entered in text box, remove this option
							$objSel.children('option.' + params.editableClass).remove();
						}
					}
					else {
						// if a match found, then remove this option
						$objSel.children('option.' + params.editableClass).remove();
					}
					
					// display select box
					$objSel.show();
					
					// destroy text box
					var objNode = document.getElementById(strBoxId);
					objNode.parentNode.removeChild(objNode);
					
					// Call the callback function for user-defined behaviour
					params.onEditOption.call(this, $objSel.children('option.' + params.editableClass).val(), $objSel.children('option.' + params.editableClass).text());
					
					// Make the editable option a normal option
					$objSel.children('option.' + params.editableClass).removeClass(params.editableClass);
				});
			});
		});
	};
	
})(jQuery);