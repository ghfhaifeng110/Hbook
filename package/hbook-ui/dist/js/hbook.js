/**
 * @authors H君
 * @date    2017-02-06 11:37:29
 * @version 0.0.6
 */

! function(window, $) {

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

		var options = $.extend(defaults, options);

		this.options = options;
		this.confirm = options.confirm;
		this.cancel = options.cancel;
		this.$element = $('#' + options.id);
		this.init(this.options, this.$element);

	}

	// 初始化
	Dialog.prototype.init = function(options, $element) {

		var _self = this;

		if ($element.length <= 0) {
			dialogIndex++;
			_self.show(options, $element);
		}

	}

	// 显示弹出框
	Dialog.prototype.show = function() {

		var _self = this,
			options = _self.options;

		var typeClass = '';
		options.type == 1 ? typeClass = 'dialog-tip' : '';
		typeof options.addClass == 'string' ? options.addClass = options.addClass : options.addClass = '';

		var _html = '<div class="dialog ' + options.addClass + typeClass + '" id="' + options.id + '" style="z-index:' + (dialogIndex - 1) + '">';

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
			_html += '</div>' +
				'</div>' +
				'</div>';
		}

		$(_html).appendTo(document.body).addClass('in');
		_self.$element = $(_html);

		options.backdrop  ? _self.backdrop(options) : '';
		_self.bindEvent(options);

	}

	// 隐藏弹出框
	Dialog.prototype.hide = function(id) {

		var elememtId = id || this.options.id;
		$('#' + elememtId).removeClass('in').remove();
		$('.dialog-backdrop-' + elememtId).length > 0 ? this.hideBackDrop(elememtId) : '';

	}

	// 显示遮罩
	Dialog.prototype.backdrop = function(options) {

		var elememtId = options.id;

		if ($('.dialog-backdrop-' + elememtId).length <= 0) {
			$('<div class="dialog-backdrop dialog-backdrop-' + elememtId + '" style="z-index:' + (dialogIndex - 2) + '"></div>')
				.appendTo(document.body)
				.addClass('in');

			$(document.body).addClass('dialog-open');
		}

	}

	// 隐藏遮罩
	Dialog.prototype.hideBackDrop = function(elememtId) {

		var _self = this;
		$('.dialog-backdrop-' + elememtId).remove();
		if ($('.dialog-backdrop').length < 1) {
			$(document.body).removeClass('dialog-open');
		}

	}


	// 绑定事件
	Dialog.prototype.bindEvent = function(options) {

		var _self = this,
			elememtId = options.id;

		// 点击确认按钮
		$('.dialog-confirm-' + elememtId + '').click(function() {
			if (typeof _self.confirm == 'function') {
				_self.confirm();
			}
		})

		// 点击取消按钮
		$('.dialog-cancel-' + elememtId + '').click(function() {

			if (typeof _self.cancel == 'function') {
				_self.cancel();
				_self.hide(elememtId);
			}
		})

		// 关闭操作
		$('.dialog-backdrop-' + elememtId + ',.dialog-close-' + elememtId + '').click(function() {
			_self.hide(elememtId);
		})

	}

	function stopEvent(e) {
		_

		if (!e) var e = window.event;
		if (e.stopPropagation) {
			// 兼容火狐
			e.stopPropagation();
		} else if (e) {
			// 兼容IE
			window.event.cancelBubble = true;
		}

	}

	window.Dialog = Dialog;

}(window, window.jQuery);

/**
 * @authors H君
 * @date    2016-04-27 18:35:42
 * @version 0.0.6
 * 
 */

!function($) {

	"use strict";

	var $formControl=$('.form-line-input .form-control');
	var $checkControl=$('.checkbox,.radio');

	// 文本框
	$formControl.on('focus',function(){
		var $self = $(this);
		$self.addClass('edited');
	})
	.on('blur',function(){
		var $self = $(this),
			val   = $.trim($self.val());

		val ? '' : $self.removeClass('edited');
	})
	
	// 复选框
	$checkControl.on('change', 'input[type=checkbox],input[type=radio]', function(event) {
		var $self = $(this);

		$self.parent().hasClass('radio') ? $(this).parent().siblings('.radio').removeClass('active') : '';
		$(this).parent().toggleClass('active');
	});

}(window.jQuery);

/**
 * @authors H君
 * @date    2016-04-21 11:22:04
 * @version 0.0.6
 * 
 * 分页功能
 * @param  {[type]} current   [当前页]
 * @return {[type]} showNum   [显示条数 ]
 * @return {[type]} pageCount [总页数]
 * @return {[type]} callback  [单击回调方法，返回当前页]
 */

!function($) {
	"use strict";

	var Page=function(element, options){
		this.options=options;
		this.$element=$(element);
		this.init();

	}

	Page.prototype = {

		init:function(){
			this.getDom(this.$element, this.options);
			this.bindEvent(this.$element, this.options);
		},

		getDom:function(element,options){
			
			element.empty();
			
			//上一页
			if (options.current > 1) {
				element.append('<a href="javascript:;" class="prevPage">&laquo;</a>');
			} else {
				element.remove('.prevPage');
				element.append('<span class="disabled">&laquo;</span>');
			}
			
			//中间页码
			if (options.current != 1 && options.current >= 4 && options.pageCount != 4) {
				element.append('<a href="javascript:;" class="number">' + 1 + '</a>');
			}
			if (options.current - 2 > 2 && options.current <= options.pageCount && options.pageCount > 5) {
				
				element.append('<span class="more">...</span>');
			}

			var start = options.current - 2,
				end   = options.current + 2;
			if ((start > 1 && options.current < 4) || options.current == 1) {
				end++;
			}
			if (options.current > options.pageCount - 4 && options.current >= options.pageCount) {
				start--;
			}
			for (; start <= end; start++) {
				if (start <= options.pageCount && start >= 1) {
					if (start != options.current) {
						element.append('<a href="javascript:;" class="number">' + start + '</a>');
					} else {
						element.append('<span class="current">' + start + '</span>');
					}
				}
			}
			if (options.current + 2 < options.pageCount - 1 && options.current >= 1 && options.pageCount > 5 ) {
				element.append('<span class="more">...</span>');
			}
			if (options.current != options.pageCount && options.current < options.pageCount - 2 && options.pageCount != 4) {
				element.append('<a href="javascript:;" class="number">' + options.pageCount + '</a>');
			}

			//下一页
			if (options.current < options.pageCount) {
				element.append('<a href="javascript:;" class="nextPage">&raquo;</a>');
				// element.append('<input type="text"  class="gotoInput"/>');
				// element.append('<a href="javascript:;" class="gotoPage">跳转</a>');
			} else {
				element.remove('.nextPage');
				element.append('<span class="disabled">&raquo;</span>');
				// element.append('<input type="text"  class="gotoInput"/>');
				// element.append('<a href="javascript:;" class="gotoPage">跳转</a>');
			}
		
		},

		bindEvent:function(){
			var _self=this;

			_self.$element.off('click');			
			_self.$element.on("click", "a.number", function() {
				var current = parseInt($(this).text());
				_self.getDom(_self.$element, {
					"current": current,
					"pageCount": _self.options.pageCount
				});
				if (typeof(_self.options.callback) == "function") {
					_self.options.callback(current);
				}
			});

			//上一页
			_self.$element.on("click", "a.prevPage", function() {
				var current = parseInt(_self.$element.children("span.current").text());
				_self.getDom(_self.$element, {
					"current": current - 1,
					"pageCount": _self.options.pageCount
				});
				if (typeof(_self.options.callback) == "function") {
					_self.options.callback(current - 1);
				}
			});

			//下一页
			_self.$element.on("click", "a.nextPage", function() {

				var current = parseInt(_self.$element.children("span.current").text());
				_self.getDom(_self.$element, {
					"current": current + 1,
					"pageCount": _self.options.pageCount
				});
				if (typeof(_self.options.callback) == "function") {
					_self.options.callback(current + 1);
				}
			});

			//跳转到某页
			_self.$element.on("click", "a.gotoPage", function() {
				var gotoPage=_self.$element.children("input.gotoInput").val();
				if (gotoPage != '') {
					var current = parseInt(gotoPage);
					if (current) {
						if (current <= _self.options.pageCount) {
							_self.getDom(_self.$element, {
								"current": current,
								"pageCount": _self.options.pageCount
							});
							if (typeof(_self.options.callback) == "function") {
								_self.options.callback(current);
							}
						};
					};
					
				};
			});
		}

	}

	$.fn.page = function(option) {
		//默认参数
		var element=this;
		var options = $.extend($.fn.page.defaults, option);

		return this.each(function () {
           new Page(this, options);
		})
		
	}

	$.fn.page.defaults={
		current   : 1,
		pageCount : 10,
		callback  : function() {}
	}


	
}(window.jQuery);