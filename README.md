#Some context

Did you ever feel the need to have that smooth, simple and effective OS-X-like listboxes, in which you can simply add, edit or remove items, on your webapp?

I felt this need when creating an administration interface for a website. After several searches, I didn't find any jquery plugin that did it the way I wanted. Let's suppose you want a page to manage users and groups. You could do it the usual way: create your groups, then create your users and assign them to groups. And if you miss one group, go back to the groups page, add a new group, then return to the users page, and assign your users to that group. Or you can do it another way: have one single page for users and groups, and lighten all this a little bit. You can create groups, users, with these nice looking OS-X-like listboxes. Your users page is basically the same, except there are two litlle "+" and "-" buttons below your groups combobox. So if you miss a group, just click "+", and create your group, then assign your users to that group. No more need to navigate between pages. So much easier, so much faster, so much more intuitive.

#Usage

##JS

To init Editable Combo, just do the following:

    $('my_select_box').editableCombo(options);

##HTML

Any plain old HTML &lt;select&gt; element. Buttons and others are added automatically by the plugin.

##CSS

Feel free to customize it to make it look better. In all cases, the default look is OK, but you might want to adapt it a little.

##Options

The plugin provides several options so that you can make it work the way you want. Here there are:

* __comboBox__: 'select:first'
    * Selector for the &lt;select&gt; element
* __add__: ':button:first'
    * Selector for the "+" button
* __del__: ':button:last'
    * Selector for the "-" button
* __editableClass__: 'editableOption'
    * The class which will be applied to options that are editable
* __maxlength__: 35
    * The maximum length for options
* __multiple__: [_true_, false]
    * Whether to allow multiple selection or not
* __onAddOption__: function(newVal, newLabel) {}
    * Callback on adding action. First parameter is the value of the added option, second one is the label.
* __onRemoveOption__: function(oldVal) {}
    * Callback on removing action. The value of the removed option is passed as a parameter.
* __onEditOption__: function(val, oldLabel, newLabel) {}
    * Callback on editing action. First parameter is the value of the edited option, second one is the old label, last one is the new label.