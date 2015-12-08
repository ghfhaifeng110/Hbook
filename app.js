/**
 * 
 * @authors H君 (262281610@qq.com)
 * @date    2015-12-07 11:03:23
 * @version 1.0
 */

require.config({
	baseUrl: 'html/scripts',
	paths: {
		'jquery': 'lib/jquery',
		'ejs': 'lib/ejs.min',
		'text': 'lib/text',
		'prettify': 'component/prettify',
		'transition': 'component/bootstrap-transition',
		'scroll': 'component/jquery.scrollTo',
		'carousel': 'component/owl-carousel/owl.carousel',
		'jpage': 'component/jquery.page',
		'modal': 'component/modal',
		'tooltip': 'component/tooltip',
		'popover': 'component/bootstrap-popover'
	},
	shim: {
		jquery: {
			exports: '$'
		},
		tooltip: {
			deps: ['jquery'],
			exports: 'tooltip'
		},
		modal: {
			deps: ['jquery'],
			exports: 'modal'
		},
		transition: {
			deps: ['jquery', 'modal'],
			exports: 'transition'
		},
		carousel: {
			deps: ['jquery', 'css!component/owl-carousel/owl.carousel'],
			exports: 'carousel'
		},
		jpage: {
			deps: ['jquery'],
			exports: 'jpage'
		},
		scroll: {
			deps: ['jquery'],
			exports: 'scroll'
		}
	},
	map: {
		'*': {
			'css': 'lib/css'
		}
	}

});
require(['main'], function(index) {
	index.initlalize();
})