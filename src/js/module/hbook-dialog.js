/**
 * @authors H君
 * @date    2017-02-06 11:37:29
 * @version 0.0.6
 */

! function(window) {

	"use strict";

	//弹框层级
	var dialogIndex = 1050;

	var Dialog = function(options) {

		// 默认配置
		var defaults = {
			id: 'dialog' + new Date().getTime(),
			type: 0, // 0:有头部和尾部 1:没有头部 2:没有尾部 3：没有头尾 
			addClass: '',
			title: '提示',
			backdrop: true, // 是否出现遮罩
			confirmButton: true, //确认按钮
			cancelButton: true, //取消按钮
			confirm: function() {},
			cancel: function() {}
		}

		var options = extend(defaults, options);

		this.options = options;
		this.confirm = options.confirm;
		this.cancel = options.cancel;
		this.element =document.querySelectorAll('#'+options.id);
		this.init(this.options, this.element);

	}

	// 初始化
	Dialog.prototype.init = function(options, element) {

		var _self = this;

		if (element.length <= 0) {
			dialogIndex++;
			_self.show(options, element);
		}

	}

	// 显示弹出框
	Dialog.prototype.show = function() {

		var _self = this,
			options = _self.options;

		var typeClass = '';

		// 提示类型
		options.type == 1 ? typeClass = 'dialog-tip' : '';

		typeof options.addClass == 'string' ? options.addClass = options.addClass : options.addClass = '';

		var _html = '' ;
		var dialogHtml = document.createElement("div");
		dialogHtml.id = options.id;
		dialogHtml.className ='dialog ' + options.addClass + typeClass;
		dialogHtml.setAttribute('style','z-index:' + (dialogIndex - 1));
		// dialogHtml.style ='z-index:' + (dialogIndex - 1);

		// 头部
		if ((options.type == 0 || options.type == 2) && options.type != 3) {
			_html += '<div class="dialog-header">' + options.title + '<a href="javascript:;" class="dialog-close dialog-close-' + options.id + '" ><i class="fa fa-close font-16"></i></a></div>';
		}
		_html += '<div class="dialog-body">' + options.content + '</div>';

		// 尾部
		if (options.type != 2 && options.type != 3) {
			_html += '<div class="dialog-footer dialog-footer-right">' +
				'<div class="btn-group">';

			// 确认按钮				
			if (options.confirmButton) {
				_html += '<a href="javascript:;" class="btn btn-primary dialog-confirm-' + options.id + '" >确认</a>';
			}

			// 取消按钮
			if (options.cancelButton) {
				_html += '<a href="javascript:;" class="btn dialog-cancel-' + options.id + '">取消</a>';
			}
			_html += '</div></div>';
		}

		dialogHtml.innerHTML = _html;

		var body = document.querySelector('body');
		body.appendChild(dialogHtml);

		var dialogClass = dialogHtml.getAttribute("class"); 
		dialogHtml.className = dialogClass + ' in';

		options.backdrop  ? _self.backdrop(options) : '';
		_self.bindEvent(options);

	}

	// 隐藏弹出框
	Dialog.prototype.hide = function(id) {

		var elememtId = id || this.options.id;
		var body = document.querySelector('body');
		var dialogElement = document.querySelector('#'+elememtId);

		var dialogClass = dialogElement.getAttribute("class"); 
		dialogElement.className = elememtId;
		body.removeChild(dialogElement);

		document.querySelectorAll('.dialog-backdrop-' + elememtId).length > 0 ? this.hideBackDrop(elememtId) : '';

	}

	// 显示遮罩
	Dialog.prototype.backdrop = function(options) {

		var elememtId = options.id;

		if (document.querySelectorAll('.dialog-backdrop-' + elememtId).length <= 0) {

			var dialogBackdrop = document.createElement("div");
			dialogBackdrop.className = 'dialog-backdrop dialog-backdrop-' + elememtId;
			dialogBackdrop.setAttribute('style','z-index:' + (dialogIndex - 2));
			// dialogBackdrop.style = 'z-index:' + (dialogIndex - 2);
		
			var body = document.querySelector('body');
			body.appendChild(dialogBackdrop);
			body.className = 'dialog-open';

			var backdropClass = dialogBackdrop.getAttribute("class"); 
			dialogBackdrop.className = backdropClass + ' in';

		}

	}

	// 隐藏遮罩
	Dialog.prototype.hideBackDrop = function(elememtId) {

		var _self = this;

		var body = document.querySelector('body');
		var backdropElement = document.querySelector('.dialog-backdrop-' + elememtId);

		body.removeChild(backdropElement);
		if (document.querySelectorAll('.dialog-backdrop').length < 1) {
			body.className = '';
		}

	}


	// 绑定事件
	Dialog.prototype.bindEvent = function(options) {

		var _self = this,
			elememtId = options.id;

		// 点击确认按钮
		var confirmElement = document.querySelectorAll('.dialog-confirm-' + elememtId);
		confirmElement[0].onclick = function() {
			if (typeof _self.confirm == 'function') {
				_self.confirm();
			}
		}

		// 点击取消按钮
		var cancelElement = document.querySelectorAll('.dialog-cancel-' + elememtId);

		if(cancelElement.length  > 0 ){
			cancelElement[0].onclick = function() {
				if (typeof _self.cancel == 'function') {
					_self.cancel();
					_self.hide(elememtId);
				}
			}
		} 
		

		// 关闭操作
		var closeElement = document.querySelectorAll('.dialog-close-' + elememtId);
		var backdropElement = document.querySelectorAll('.dialog-backdrop-' + elememtId);

		if(closeElement.length  > 0 ){
			closeElement[0].onclick = function() {
				_self.hide(elememtId);
			}
		}
		if (backdropElement.length  > 0 ){
			backdropElement[0].onclick = function() {
				_self.hide(elememtId);
			}
		}

	}

	// 防止冒泡
	function stopEvent(e) {

		if (!e) var e = window.event;
		if (e.stopPropagation) {
			// 兼容火狐
			e.stopPropagation();
		} else if (e) {
			// 兼容IE
			window.event.cancelBubble = true;
		}

	}

	// 对象合并
	function extend(to, from) {
	    for (var key in from) {
	    	to[key] = from[key];
	    }
	  	return to;
	}

	window.Dialog = Dialog;

}(window);