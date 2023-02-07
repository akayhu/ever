function TagEditor(elem) {
	this.$elem = null;
	this.$input = null;
	this.$tagList = null;
	this.$value = null;
	this.separator = null;
	this.trimTags = null;
	this.init(elem);
}

TagEditor.prototype.init = function (elem) {
	this.$elem = $(elem);
	this.$value = this.$elem.find('input.tag-editor-value');
	this.$input = this.$elem.find('input.tag-editor-input');
	this.$tagList = this.$elem.find('.tag-editor-list');
	this.separator = ',';
	this.trimTags = true;

	var editor = this;

	this.$input.blur(function () {
		var tag = $(this).val();
		editor.handleInput(tag);
	});

	this.$input.keyup(function (e) {
		var keyCode = (e.keyCode ? e.keyCode : e.which);
		if (keyCode == 13) { // enter
			var tag = $(this).val();
			editor.handleInput(tag);
		}
	});

	this.$tagList.click(function (e) {
		var $target = $(e.target);
		if ($target.hasClass('tag-editor-tag')) {
			$target.remove();
		}
		editor.handleDelete();
	});

	this.updateValue();
	this._checkInit();
}

TagEditor.prototype.getValue = function () {
	return this.$value.val();
}

TagEditor.prototype.updateValue = function () {
	var tags = [];
	var editor = this;

	this.$tagList.find('.tag-editor-tag').each(function() {
		var tagValue = $(this).text();
		if (editor.trimTags) {
			tagValue = tagValue.trim();
		}
		tags.push(tagValue);
	})

	this.$value.val(tags.join(this.separator));
}

TagEditor.prototype.containsTag = function (tag) {
	return this.$value.val().split(',').indexOf(tag) >= 0;
}

TagEditor.prototype.addTag = function (tag) {  
	if (tag == null || typeof(tag) !== "string" || tag.trim().length == 0 || this.containsTag(tag)) {
		return;
	}
	var $newTag = $('<li class="tag-editor-tag">' + tag + '</li>');
	this.$tagList.append($newTag);
	this.updateValue();
}

TagEditor.prototype.handleInput = function (tag) {
	this.addTag(tag);
	this.$input.val('');
}

TagEditor.prototype.handleDelete = function () {
	this.updateValue(); 
}

TagEditor.prototype._checkInit = function() {
	var errors = [];
	if (this.$elem == null || this.$elem.length != 1) {
		errors.push("$elem is not set");
	}
	if (this.$value == null || this.$value.length != 1) {
		errors.push("$value is not set");
	}
	if (this.$input == null || this.$input.length != 1) {
		errors.push("$input is not set");
	}
	if (this.$tagList == null || this.$tagList.length != 1) {
		errors.push("$tagList is not set");
	}
	if (errors.length > 0) {
		console.warn("TagEditor failed init check");
		console.warn(errors);
	}
}

$('.tag-editor').each(function () {
	new TagEditor(this);
});