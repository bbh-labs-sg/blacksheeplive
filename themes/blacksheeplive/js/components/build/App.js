'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var Flux = require('flux');
var dispatcher = new Flux.Dispatcher();
var $ = require('jquery');
var cx = require('classnames');
var Carousel = require('nuka-carousel');

function isMobile() {
	return window.innerWidth < 720;
}

function isDesktop() {
	return window.innerWidth >= 720;
}

function pageCount() {
	return isMobile() ? projects.length : parseInt((projects.length / 9).toFixed(0)) + 1;
}

function htmlEscape(str) {
	return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function htmlUnescape(value) {
	return String(value).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

var App = (function (_React$Component) {
	_inherits(App, _React$Component);

	function App() {
		var _Object$getPrototypeO;

		var _temp, _this, _ret;

		_classCallCheck(this, App);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(App)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
			projects: projects,
			selectedProject: -1,
			page: null
		}, _this.togglePage = function (newPage) {
			var page = _this.state.page;
			_this.setState({ page: page == newPage ? null : newPage });
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(App, [{
		key: 'render',
		value: function render() {
			var headerAttrs = {
				togglePage: this.togglePage
			};
			var contentAttrs = {
				projects: this.state.projects,
				page: this.state.page,
				selectedProject: this.state.selectedProject,
				togglePage: this.togglePage
			};
			return React.createElement(
				'div',
				{ id: 'app', className: 'flex column' },
				React.createElement(App.Header, headerAttrs),
				React.createElement(App.Content, contentAttrs),
				React.createElement(App.Footer, null)
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.listenerID = dispatcher.register((function (payload) {
				switch (payload.type) {
					case 'selectProject':
						this.setState({ selectedProject: payload.projectID });
						break;
					case 'deselectProject':
						this.setState({ selectedProject: -1 });
						break;
				}
			}).bind(this));
		}
	}]);

	return App;
})(React.Component);

App.Header = (function (_React$Component2) {
	_inherits(Header, _React$Component2);

	function Header() {
		var _Object$getPrototypeO2;

		var _temp2, _this2, _ret2;

		_classCallCheck(this, Header);

		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(Header)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this2), _this2.toggleMenu = function () {
			_this2.props.togglePage('menu');
		}, _temp2), _possibleConstructorReturn(_this2, _ret2);
	}

	_createClass(Header, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ id: 'header', className: 'flex' },
				React.createElement(
					'div',
					{ className: 'flex one justify-start' },
					React.createElement(
						'a',
						{ href: '/' },
						React.createElement('img', { className: 'logo flex align-center', src: 'wp-content/themes/blacksheeplive/images/bsl_logo.png' })
					)
				),
				React.createElement(
					'div',
					{ className: 'flex one justify-end' },
					React.createElement(
						'a',
						{ className: 'menu flex align-center', href: '#', onClick: this.toggleMenu },
						'MENU'
					)
				)
			);
		}
	}]);

	return Header;
})(React.Component);

App.Content = (function (_React$Component3) {
	_inherits(Content, _React$Component3);

	function Content() {
		var _Object$getPrototypeO3;

		var _temp3, _this3, _ret3;

		_classCallCheck(this, Content);

		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		return _ret3 = (_temp3 = (_this3 = _possibleConstructorReturn(this, (_Object$getPrototypeO3 = Object.getPrototypeOf(Content)).call.apply(_Object$getPrototypeO3, [this].concat(args))), _this3), _this3.state = {
			project: null
		}, _this3.toggleMenu = function () {
			_this3.props.togglePage('menu');
		}, _this3.closePage = function (event) {
			_this3.props.togglePage(null);
		}, _temp3), _possibleConstructorReturn(_this3, _ret3);
	}

	_createClass(Content, [{
		key: 'render',
		value: function render() {
			var page = undefined;

			switch (this.props.page) {
				case 'menu':
					page = React.createElement(App.Content.Menu, { togglePage: this.props.togglePage });break;
				case 'showreel':
					page = React.createElement(App.Content.Showreel, null);break;
				case null:
					break;
				default:
					page = React.createElement(App.Content.Menu.Page, { menu: menus[this.props.page] });break;
			}

			return React.createElement(
				'div',
				{ id: 'content', className: 'flex one column' },
				React.createElement(App.Content.Home, { projects: this.props.projects, selectedProject: this.props.selectedProject }),
				page,
				React.createElement(
					'div',
					{ className: cx('flex close justify-end', this.props.page ? '' : 'hide') },
					React.createElement(
						'span',
						{ className: 'symbol', onClick: this.closePage },
						React.createElement('img', { src: 'wp-content/themes/blacksheeplive/images/icons/close_w.png' })
					)
				)
			);
		}
	}]);

	return Content;
})(React.Component);

App.Content.Menu = (function (_React$Component4) {
	_inherits(Menu, _React$Component4);

	function Menu() {
		_classCallCheck(this, Menu);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Menu).apply(this, arguments));
	}

	_createClass(Menu, [{
		key: 'render',
		value: function render() {
			var togglePage = this.props.togglePage;
			return React.createElement(
				'div',
				{ className: 'flex one column menu align-center justify-center' },
				React.createElement(
					'div',
					{ className: 'flex column inner' },
					menus ? menus.map(function (menu, i) {
						return React.createElement(
							'a',
							{ key: i, href: '#', className: 'flex one item justify-center', onClick: function onClick() {
									togglePage(i);
								} },
							menu.name
						);
					}) : null
				)
			);
		}
	}]);

	return Menu;
})(React.Component);

App.Content.Home = (function (_React$Component5) {
	_inherits(Home, _React$Component5);

	function Home() {
		var _Object$getPrototypeO4;

		var _temp4, _this5, _ret4;

		_classCallCheck(this, Home);

		for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			args[_key4] = arguments[_key4];
		}

		return _ret4 = (_temp4 = (_this5 = _possibleConstructorReturn(this, (_Object$getPrototypeO4 = Object.getPrototypeOf(Home)).call.apply(_Object$getPrototypeO4, [this].concat(args))), _this5), _this5.state = {
			minWidth: 0,
			currentPage: 0
		}, _this5.projectElements = function (offset) {
			var projects = _this5.props.projects;
			if (!projects) {
				return null;
			}

			var start = typeof offset !== 'undefined' ? offset : 0;
			var end = typeof offset !== 'undefined' ? Math.min(projects.length, offset + 9) : projects.length;

			var selectedProject = _this5.props.selectedProject;
			var elems = [];
			for (var i = start; i < end; i++) {
				var attrs = {
					key: i,
					project: projects[i],
					projectID: i,
					selected: i == selectedProject,
					onClick: _this5.selectProject.bind(_this5, i),
					minWidth: _this5.state.minWidth
				};
				elems.push(React.createElement(App.Content.Home.Project, attrs));
			}
			return elems;
		}, _this5.onWindowResize = function (event) {
			var home = _this5.refs.home;

			_this5.setState({
				minWidth: Math.min(home.offsetWidth, home.offsetHeight)
			});

			if (!_this5.hammertime) {
				_this5.hammertime = new Hammer(_this5.refs.home);
				_this5.handleGesture();
			}

			if (window.innerWidth >= 720) {
				_this5.handleGestureDesktop();
			}
		}, _this5.selectProject = function (i) {
			dispatcher.dispatch({
				type: 'selectProject',
				projectID: i
			});
		}, _this5.down = function () {
			var currentPage = _this5.state.currentPage;
			if (projects.length == 0 || currentPage >= pageCount() - 1) {
				return;
			}
			currentPage++;
			_this5.setState({ currentPage: currentPage });

			if (isMobile()) {
				_this5.refs.bubbleContainer.style.transform = 'translate(0, ' + currentPage * -100 + '%)';
			}
		}, _this5.up = function () {
			var currentPage = _this5.state.currentPage;
			if (currentPage <= 0) {
				return;
			}
			currentPage--;
			_this5.setState({ currentPage: currentPage });

			if (isMobile()) {
				_this5.refs.bubbleContainer.style.transform = 'translate(0, ' + currentPage * -100 + '%)';
			}
		}, _this5.handleGesture = function () {
			// Handle Mouse Wheel / Touchpad
			_this5.wheelY = 0;
			$(window).on('wheel', function (event) {
				_this5.wheelY += event.originalEvent.deltaY;
				if (Math.abs(_this5.wheelY) > 150) {
					if (_this5.wheelY < 0) {
						_this5.down();
					} else if (_this5.wheelY > 0) {
						_this5.up();
					}
					_this5.wheelY = 0;
				}
			});

			// Handle Drag
			_this5.hammertime.get('pan').set({
				direction: Hammer.DIRECTION_VERTICAL
			});
			_this5.hammertime.on('pan', function (event) {
				if (!event.isFinal) {
					return;
				}
				if (event.deltaY > 100) {
					_this5.up();
				} else if (event.deltaY < -100) {
					_this5.down();
				}
			});
		}, _this5.handleGestureDesktop = function () {
			//$(window).off('wheel');
			//this.hammertime.off('pan');
			_this5.setState({ currentPage: 0 });
			_this5.refs.home.style.transform = 'translate(0, 0%)';
		}, _temp4), _possibleConstructorReturn(_this5, _ret4);
	}

	_createClass(Home, [{
		key: 'render',
		value: function render() {
			var currentPage = this.state.currentPage;
			var bubbleContainers = [];
			for (var i = 0; i < pageCount(); i++) {
				bubbleContainers.push(i);
			}
			return React.createElement(
				'div',
				{ ref: 'home', id: 'home', className: 'flex column one' },
				React.createElement(
					'div',
					{ className: cx('welcome flex one justify-start', this.props.selectedProject >= 0 && 'hide') },
					React.createElement(
						'p',
						null,
						'Welcome to'
					),
					React.createElement('img', { className: 'logo flex align-center', src: 'wp-content/themes/blacksheeplive/images/bsl_logo_text_w.png' })
				),
				window.innerWidth >= 720 ? bubbleContainers.map((function (i) {
					var styles = { transform: 'translate(0, ' + (i - currentPage) * 100 + '%)' };
					return React.createElement(
						'div',
						{ key: i, ref: 'bubbleContainer', className: 'bubble-container', style: styles },
						this.projectElements(i * 9)
					);
				}).bind(this)) : React.createElement(
					'div',
					{ ref: 'bubbleContainer', className: 'bubble-container' },
					this.projectElements()
				),
				React.createElement(
					'div',
					{ className: 'scroll-container flex one column align-center justify-end' },
					projects && currentPage < pageCount() - 1 ? React.createElement('img', { className: 'arrow', src: 'wp-content/themes/blacksheeplive/images/icons/arrow_down.png', onClick: this.down }) : React.createElement('img', { className: 'arrow', src: 'wp-content/themes/blacksheeplive/images/icons/arrow_up.png', onClick: this.up })
				)
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.onWindowResize();
			window.addEventListener('resize', this.onWindowResize, false);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			window.removeEventListener('resize', this.onWindowResize, false);
		}
	}]);

	return Home;
})(React.Component);

App.Content.Menu.Page = (function (_React$Component6) {
	_inherits(Page, _React$Component6);

	function Page() {
		var _Object$getPrototypeO5;

		var _temp5, _this6, _ret5;

		_classCallCheck(this, Page);

		for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
			args[_key5] = arguments[_key5];
		}

		return _ret5 = (_temp5 = (_this6 = _possibleConstructorReturn(this, (_Object$getPrototypeO5 = Object.getPrototypeOf(Page)).call.apply(_Object$getPrototypeO5, [this].concat(args))), _this6), _this6.state = {
			expanded: false
		}, _this6.onPlayerReady = function () {
			if (_this6.player) {
				_this6.player.playVideo();
				_this6.resize();
			}
		}, _this6.onPlayerStateChange = function (event) {
			switch (event.data) {
				case YT.PlayerState.ENDED:
					if (_this6.player) {
						_this6.player.stopVideo();
					}
					break;
			}
		}, _this6.expand = function (event) {
			_this6.setState({ expanded: true });
		}, _this6.resize = function () {
			var player = document.getElementById('video-showreel');
			var content = document.getElementById('content');
			var adminbar = document.getElementById('wpadminbar');

			var container = undefined;
			if (_this6.state.expanded) {
				container = content;
			} else {
				container = $(player).parent()[0];
			}

			var newPlayerHeight = container.offsetHeight;
			var newPlayerWidth = 16 / 9 * newPlayerHeight;
			var newPlayerX = -(newPlayerWidth - container.offsetWidth) * 0.5;
			var newPlayerY = _this6.props.expanded ? content.offsetTop + adminbar.offsetHeight - window.pageYOffset : 0;
			if (isFinite(newPlayerX) || newPlayerX != 0) {
				$(player).width(newPlayerWidth).height(newPlayerHeight);
				$(player).css({ left: newPlayerX, top: newPlayerY });
			}
		}, _this6.menuPageContent = function () {
			var description = _this6.props.menu.description;
			var carouselAttrs = { decorators: [] };
			if (description) {
				if (description.split('\n').length > 1) {
					carouselAttrs = {};
				}
			}

			var menu = _this6.props.menu;
			var elems = [];
			if (_this6.isShowreel()) {
				if (iOS) {
					var iframeAttrs = {
						id: 'video-showreel',
						className: 'ios',
						width: '560',
						height: '315',
						src: 'https://www.youtube.com/embed/EYkz_2HchLg?controls=0&modestbranding=1',
						frameBorder: '0',
						allowFullScreen: 'true',
						onClick: _this6.expand
					};
					elems.push(React.createElement('iframe', _extends({ key: 'video-showreel' }, iframeAttrs)));
				} else {
					elems.push(React.createElement('div', { key: 'video-showreel', id: 'video-showreel' }));
					elems.push(React.createElement(
						'div',
						{ key: 'showreel-info', className: 'info' },
						React.createElement(
							'h1',
							null,
							'Showreel'
						),
						React.createElement('img', { onClick: _this6.expand, className: 'play flex align-center', src: 'wp-content/themes/blacksheeplive/images/icons/play_icon_w.png' })
					));
				}
			} else {
				elems.push(React.createElement(
					'h1',
					{ key: 'menu-name' },
					menu.name
				));
				elems.push(React.createElement(
					Carousel,
					_extends({ key: 'carousel', ref: 'carousel', className: 'carousel' }, carouselAttrs),
					description ? description.split('\n').map(function (item, i) {
						return React.createElement('div', { key: i, dangerouslySetInnerHTML: { __html: htmlUnescape(item) } });
					}) : null
				));
			}
			return elems;
		}, _this6.isShowreel = function () {
			var menu = _this6.props.menu;
			if (!menu) {
				return false;
			}
			return menu.name.toLowerCase() == 'showreel';
		}, _temp5), _possibleConstructorReturn(_this6, _ret5);
	}

	_createClass(Page, [{
		key: 'render',
		value: function render() {
			var isShowreel = this.isShowreel();
			var classnames = cx('page flex align-center justify-center', !isShowreel && 'column', isShowreel && 'row showreel', this.state.expanded && isShowreel && 'expanded');
			return React.createElement(
				'div',
				{ className: classnames },
				React.createElement(
					'div',
					{ className: 'inner' },
					React.createElement(
						'div',
						{ className: 'content flex column align-center justify-center' },
						this.menuPageContent()
					)
				)
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (!this.isShowreel()) {
				return;
			}

			if (!iOS) {
				this.player = new YT.Player('video-showreel', {
					width: '1280',
					height: '720',
					videoId: 'EYkz_2HchLg',
					playerVars: {
						controls: 0,
						showinfo: 0,
						modestbranding: 1,
						wmode: 'transparent'
					},
					events: {
						'onReady': this.onPlayerReady,
						'onStateChange': this.onPlayerStateChange
					}
				});
			}

			window.addEventListener('resize', this.resize);
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			if (!this.isShowreel()) {
				return;
			}

			this.resize();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (!this.isShowreel()) {
				return;
			}

			if (this.player) {
				this.player.destroy();
				this.player = null;
			}

			window.removeEventListener('resize', this.resize);
		}
	}]);

	return Page;
})(React.Component);

var Poster = (function (_React$Component7) {
	_inherits(Poster, _React$Component7);

	function Poster() {
		var _Object$getPrototypeO6;

		var _temp6, _this7, _ret6;

		_classCallCheck(this, Poster);

		for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
			args[_key6] = arguments[_key6];
		}

		return _ret6 = (_temp6 = (_this7 = _possibleConstructorReturn(this, (_Object$getPrototypeO6 = Object.getPrototypeOf(Poster)).call.apply(_Object$getPrototypeO6, [this].concat(args))), _this7), _this7.state = {
			hovering: false,
			expanded: false
		}, _this7.onPlayerReady = function () {
			_this7.resize();
			if (!iOS && _this7.player) {
				if (_this7.state.hovering) {
					_this7.player.playVideo();
				} else {
					_this7.player.seekTo(0);
					_this7.player.stopVideo();
				}
			}
		}, _this7.onPlayerStateChange = function (event) {
			switch (event.data) {
				case YT.PlayerState.ENDED:
					if (_this7.player) {
						_this7.player.stopVideo();
					}
					break;
			}
		}, _this7.setHovering = function (state) {
			_this7.setState({ hovering: state });
			_this7.resize();
		}, _this7.resize = function () {
			var id = 'video-' + _this7.props.projectID;
			var player = document.getElementById(id);
			var content = document.getElementById('content');
			var adminbar = document.getElementById('wpadminbar');
			var poster = $('.poster.playing')[0];
			if (!poster) {
				poster = $('.poster.selected')[0];
			}

			var container = undefined;
			if (_this7.props.selected) {
				container = content;
			} else {
				container = $(player).parent()[0];
			}

			var newPlayerHeight = container.offsetHeight;
			var newPlayerWidth = 16 / 9 * newPlayerHeight;
			var maxWidth = newPlayerWidth > container.offsetWidth ? newPlayerWidth : container.offsetWidth;
			var minWidth = newPlayerWidth < container.offsetWidth ? newPlayerWidth : container.offsetWidth;
			var newPlayerX = (content.offsetWidth - player.offsetWidth) * 0.5 - (poster ? poster.offsetLeft : 0);
			var newPlayerY = 0;
			//var newPlayerY = this.props.selected ? (content.offsetTop + adminbar.offsetHeight - window.pageYOffset) : 0;
			if (isFinite(newPlayerX) || newPlayerX != 0) {
				$(player).width(newPlayerWidth).height(newPlayerHeight).css({
					left: newPlayerX,
					top: newPlayerY
				});
			}
		}, _this7.expand = function () {
			var expanded = !_this7.state.expanded;
			_this7.setState({ expanded: expanded });
		}, _temp6), _possibleConstructorReturn(_this7, _ret6);
	}

	_createClass(Poster, [{
		key: 'render',
		value: function render() {
			var project = this.props.project;
			var style = {};
			var key = 'video-' + this.props.projectID;
			var hovering = this.state.hovering;
			var expanded = this.state.expanded;
			var selected = this.props.selected;
			var classnames = cx('flex column one poster align-center justify-center', hovering && 'playing', selected && 'selected', expanded && 'expanded');
			var onClick = undefined,
			    onMouseOver = undefined,
			    onMouseOut = undefined;
			if (!selected) {
				if (!hovering) {
					style.background = 'url(' + project.posterURL + ') center / cover';
				}
				onClick = this.props.onClick;
				onMouseOver = this.setHovering.bind(this, true);
				onMouseOut = this.setHovering.bind(this, false);
			}

			var posterAttrs = {
				key: key,
				className: classnames,
				style: style,
				onClick: onClick,
				onMouseOver: onMouseOver,
				onMouseOut: onMouseOut
			};

			var youtubeID = project.videoURL.substring(project.videoURL.length - 11, project.videoURL.length);
			var iframeAttrs = {
				id: key,
				className: 'ios',
				width: '560',
				height: '315',
				src: 'https://www.youtube.com/embed/' + youtubeID,
				controls: '0',
				frameBorder: '0',
				allowFullScreen: 'true',
				modestbranding: '1'
			};
			return React.createElement(
				'div',
				_extends({ ref: 'poster' }, posterAttrs),
				iOS && !selected && React.createElement('iframe', _extends({ key: 'ios-player-unselected' }, iframeAttrs)),
				iOS && selected && React.createElement('iframe', _extends({ key: 'ios-player-selected' }, iframeAttrs)),
				!iOS && React.createElement('div', { id: key }),
				this.props.selected ? React.createElement(Poster.Info, { project: project, expand: this.expand }) : null
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var posterHeight = this.refs.poster.offsetHeight;
			this.refs.poster.style.width = posterHeight + 'px';

			window.addEventListener('resize', this.resize);

			this.listenerID = dispatcher.register((function (payload) {
				switch (payload.type) {
					case 'deselectProject':
						if (!iOS && this.player) {
							this.player.stopVideo();
						}
						this.setState({
							hovering: false,
							expanded: false
						});
						break;
				}
			}).bind(this));
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var posterHeight = this.refs.poster.offsetHeight;
			this.refs.poster.style.width = posterHeight + 'px';

			this.resize();

			if (!iOS) {
				if (this.state.hovering) {
					if (this.player) {
						if (this.player.getPlayerState() != YT.PlayerState.PLAYING) {
							this.player.seekTo(0);
							this.player.playVideo();
						}
					} else {
						var project = this.props.project;
						this.player = new YT.Player('video-' + this.props.projectID, {
							width: '1280',
							height: '720',
							videoId: project.videoURL.substring(project.videoURL.length - 11, project.videoURL.length),
							playerVars: {
								controls: 0,
								showinfo: 0,
								modestbranding: 1,
								wmode: 'transparent'
							},
							events: {
								'onReady': this.onPlayerReady,
								'onStateChange': this.onPlayerStateChange
							}
						});
					}
				} else {
					if (this.player) {
						this.player.stopVideo();
					}
				}
			}

			if (this.props.selected) {
				this.resize();
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.player) {
				this.player.destroy();
				this.player = null;
			}
			dispatcher.unregister(this.listenerID);
		}
	}]);

	return Poster;
})(React.Component);

Poster.Info = (function (_React$Component8) {
	_inherits(Info, _React$Component8);

	function Info() {
		_classCallCheck(this, Info);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Info).apply(this, arguments));
	}

	_createClass(Info, [{
		key: 'render',
		value: function render() {
			var project = this.props.project;
			var infoAttrs = {};
			if (iOS) {
				infoAttrs = { onClick: this.props.expand };
			}
			return React.createElement(
				'div',
				_extends({ className: cx('info', iOS && 'ios') }, infoAttrs),
				React.createElement(
					'h1',
					null,
					project.name
				),
				React.createElement(
					'p',
					null,
					project.description
				),
				React.createElement('img', { onClick: this.props.expand, className: cx('play flex align-center', iOS && 'ios'), src: 'wp-content/themes/blacksheeplive/images/icons/play_icon_w.png' })
			);
		}
	}]);

	return Info;
})(React.Component);

App.Content.Home.Project = (function (_React$Component9) {
	_inherits(Project, _React$Component9);

	function Project() {
		_classCallCheck(this, Project);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Project).apply(this, arguments));
	}

	_createClass(Project, [{
		key: 'render',
		value: function render() {
			var posterAttrs = {
				project: this.props.project,
				projectID: this.props.projectID,
				selected: this.props.selected,
				minWidth: this.props.minWidth,
				onClick: this.props.onClick
			};
			var bubbleAttrs = {};
			if (window.innerWidth < 720) {
				bubbleAttrs = {
					style: {
						transform: 'translate(0, ' + this.props.projectID * 100 + '%)'
					}
				};
			}
			return React.createElement(
				'div',
				_extends({ className: cx('flex column bubble align-center', this.props.selected && 'selected') }, bubbleAttrs),
				React.createElement(
					'div',
					{ className: 'close' },
					React.createElement(
						'span',
						{ className: 'symbol', onClick: this.deselectProject },
						React.createElement('img', { src: 'wp-content/themes/blacksheeplive/images/icons/close_w.png' })
					)
				),
				React.createElement(Poster, posterAttrs)
			);
		}
	}, {
		key: 'deselectProject',
		value: function deselectProject() {
			dispatcher.dispatch({ type: 'deselectProject' });
		}
	}]);

	return Project;
})(React.Component);

App.Footer = (function (_React$Component10) {
	_inherits(Footer, _React$Component10);

	function Footer() {
		_classCallCheck(this, Footer);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Footer).apply(this, arguments));
	}

	_createClass(Footer, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ id: 'footer', className: 'flex' },
				React.createElement(
					'p',
					{ className: 'copyright flex one align-center justify-start wrap' },
					'COPYRIGHT (C) 2015',
					React.createElement('img', { className: 'logo flex align-center ', src: 'wp-content/themes/blacksheeplive/images/bsl_logo_text_b.png' })
				),
				React.createElement(
					'span',
					{ className: 'flex one align-center justify-end social' },
					React.createElement(
						'a',
						{ className: 'link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
						React.createElement('img', { src: 'wp-content/themes/blacksheeplive/images/icons/facebook.png' })
					),
					React.createElement(
						'a',
						{ className: 'link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
						React.createElement('img', { src: 'wp-content/themes/blacksheeplive/images/icons/instagram.png' })
					),
					React.createElement(
						'a',
						{ className: 'link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
						React.createElement('img', { src: 'wp-content/themes/blacksheeplive/images/icons/linkedin.png' })
					),
					React.createElement(
						'a',
						{ className: 'link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
						React.createElement('img', { src: 'wp-content/themes/blacksheeplive/images/icons/twitter.png' })
					),
					React.createElement(
						'a',
						{ className: 'link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
						React.createElement('img', { src: 'wp-content/themes/blacksheeplive/images/icons/youtube.png' })
					)
				)
			);
		}
	}]);

	return Footer;
})(React.Component);

if (iOS) {
	ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
} else {
	render = function () {
		ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
	};
}