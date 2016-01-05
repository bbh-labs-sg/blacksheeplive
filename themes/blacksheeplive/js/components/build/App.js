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

function pageCount() {
	if (isMobile()) {
		return projects.length;
	}
	return parseInt((projects.length / 9).toFixed(0)) + 1;
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
				React.createElement(App.MainContent, contentAttrs),
				React.createElement(App.Footer, null)
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			this.listenerID = dispatcher.register(function (payload) {
				switch (payload.type) {
					case 'selectProject':
						_this2.setState({ selectedProject: payload.projectID });
						break;
					case 'deselectProject':
						_this2.setState({ selectedProject: -1 });
						break;
				}
			});
		}
	}]);

	return App;
})(React.Component);

App.Header = (function (_React$Component2) {
	_inherits(Header, _React$Component2);

	function Header() {
		var _Object$getPrototypeO2;

		var _temp2, _this3, _ret2;

		_classCallCheck(this, Header);

		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		return _ret2 = (_temp2 = (_this3 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(Header)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this3), _this3.toggleMenu = function () {
			_this3.props.togglePage('menu');
		}, _temp2), _possibleConstructorReturn(_this3, _ret2);
	}

	_createClass(Header, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: 'header flex' },
				React.createElement(
					'div',
					{ className: 'flex one justify-start' },
					React.createElement(
						'a',
						{ href: '/' },
						React.createElement('img', { className: 'header-logo flex align-center', src: 'wp-content/themes/blacksheeplive/images/bsl_logo.png' })
					)
				),
				React.createElement(
					'div',
					{ className: 'flex one justify-end' },
					React.createElement(
						'a',
						{ className: 'header-menu flex align-center', href: '#', onClick: this.toggleMenu },
						'MENU'
					)
				)
			);
		}
	}]);

	return Header;
})(React.Component);

App.MainContent = (function (_React$Component3) {
	_inherits(MainContent, _React$Component3);

	function MainContent() {
		var _Object$getPrototypeO3;

		var _temp3, _this4, _ret3;

		_classCallCheck(this, MainContent);

		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		return _ret3 = (_temp3 = (_this4 = _possibleConstructorReturn(this, (_Object$getPrototypeO3 = Object.getPrototypeOf(MainContent)).call.apply(_Object$getPrototypeO3, [this].concat(args))), _this4), _this4.state = {
			project: null
		}, _this4.toggleMenu = function () {
			_this4.props.togglePage('menu');
		}, _this4.closePage = function (event) {
			_this4.props.togglePage(null);
		}, _temp3), _possibleConstructorReturn(_this4, _ret3);
	}

	_createClass(MainContent, [{
		key: 'render',
		value: function render() {
			var page = undefined;

			switch (this.props.page) {
				case 'menu':
					page = React.createElement(App.MainContent.Menu, { togglePage: this.props.togglePage });break;
				case 'showreel':
					page = React.createElement(App.MainContent.Showreel, null);break;
				case null:
					break;
				default:
					page = React.createElement(App.MainContent.Menu.Content, { menu: menus[this.props.page] });break;
			}

			return React.createElement(
				'div',
				{ className: 'main-content flex one column' },
				React.createElement(App.MainContent.Front, { projects: this.props.projects, selectedProject: this.props.selectedProject }),
				page,
				React.createElement(
					'div',
					{ className: cx('main-content__close flex justify-end', this.props.page ? '' : 'main-content__close--hide') },
					React.createElement(
						'span',
						{ className: 'main-content__close-symbol', onClick: this.closePage },
						React.createElement('img', { className: 'main-content__close-symbol-img', src: 'wp-content/themes/blacksheeplive/images/icons/close_w.png' })
					)
				)
			);
		}
	}]);

	return MainContent;
})(React.Component);

App.MainContent.Menu = (function (_React$Component4) {
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
				{ className: 'main-content__menu main-content__child flex one column align-center justify-center' },
				React.createElement(
					'div',
					{ className: 'main-content__menu-inner flex column' },
					menus ? menus.map(function (menu, i) {
						var menuAttrs = {
							key: 'menu-' + i,
							className: 'main-content__menu-inner-item flex one justify-center',
							onClick: function onClick() {
								togglePage(i);
							}
						};
						return React.createElement(
							'a',
							menuAttrs,
							menu.name
						);
					}) : null
				)
			);
		}
	}]);

	return Menu;
})(React.Component);

App.MainContent.Front = (function (_React$Component5) {
	_inherits(Front, _React$Component5);

	function Front() {
		var _Object$getPrototypeO4;

		var _temp4, _this6, _ret4;

		_classCallCheck(this, Front);

		for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			args[_key4] = arguments[_key4];
		}

		return _ret4 = (_temp4 = (_this6 = _possibleConstructorReturn(this, (_Object$getPrototypeO4 = Object.getPrototypeOf(Front)).call.apply(_Object$getPrototypeO4, [this].concat(args))), _this6), _this6.state = {
			minWidth: 0,
			currentPage: 0
		}, _this6.projectElements = function (offset) {
			var projects = _this6.props.projects;
			if (!projects) {
				return null;
			}

			var start = typeof offset !== 'undefined' ? offset : 0;
			var end = typeof offset !== 'undefined' ? Math.min(projects.length, offset + 9) : projects.length;

			var selectedProject = _this6.props.selectedProject;
			var elems = [];
			for (var i = start; i < end; i++) {
				var attrs = {
					key: i,
					project: projects[i],
					projectID: i,
					selected: i == selectedProject,
					onClick: _this6.selectProject.bind(_this6, i),
					minWidth: _this6.state.minWidth
				};
				elems.push(React.createElement(App.MainContent.Front.Project, attrs));
			}
			return elems;
		}, _this6.onWindowResize = function (event) {
			var front = _this6.refs.front;

			_this6.setState({
				minWidth: Math.min(front.offsetWidth, front.offsetHeight)
			});

			if (!_this6.hammertime) {
				_this6.hammertime = new Hammer(_this6.refs.front);
				_this6.handleGesture();
			}

			if (window.innerWidth >= 720) {
				_this6.handleGestureDesktop();
			}
		}, _this6.selectProject = function (i) {
			dispatcher.dispatch({
				type: 'selectProject',
				projectID: i
			});
		}, _this6.down = function () {
			var currentPage = _this6.state.currentPage;
			if (projects.length == 0 || currentPage >= pageCount() - 1) {
				return;
			}
			currentPage++;
			_this6.setState({ currentPage: currentPage });

			if (isMobile()) {
				_this6.refs.projectContainer.style.transform = 'translate(0, ' + currentPage * -100 + '%)';
			}
		}, _this6.up = function () {
			var currentPage = _this6.state.currentPage;
			if (currentPage <= 0) {
				return;
			}
			currentPage--;
			_this6.setState({ currentPage: currentPage });

			if (isMobile()) {
				_this6.refs.projectContainer.style.transform = 'translate(0, ' + currentPage * -100 + '%)';
			}
		}, _this6.handleGesture = function () {
			// Handle Mouse Wheel / Touchpad
			_this6.wheelY = 0;
			$(window).on('wheel', function (event) {
				if (_this6.props.selectedProject >= 0) {
					return;
				}

				_this6.wheelY += event.originalEvent.deltaY;
				if (Math.abs(_this6.wheelY) > 150) {
					if (_this6.wheelY < 0) {
						_this6.up();
					} else if (_this6.wheelY > 0) {
						_this6.down();
					}
					_this6.wheelY = 0;
				}
			});

			// Handle Drag
			_this6.hammertime.get('pan').set({
				direction: Hammer.DIRECTION_VERTICAL
			});
			_this6.hammertime.on('pan', function (event) {
				if (!event.isFinal || _this6.props.selectedProject >= 0) {
					return;
				}
				if (event.deltaY > 100) {
					_this6.up();
				} else if (event.deltaY < -100) {
					_this6.down();
				}
			});
		}, _this6.handleGestureDesktop = function () {
			_this6.setState({ currentPage: 0 });
			_this6.refs.front.style.transform = 'translate(0, 0%)';
		}, _temp4), _possibleConstructorReturn(_this6, _ret4);
	}

	_createClass(Front, [{
		key: 'render',
		value: function render() {
			var _this7 = this;

			var currentPage = this.state.currentPage;
			var selectedProject = this.props.selectedProject;
			var projectContainers = [];
			for (var i = 0; i < pageCount(); i++) {
				projectContainers.push(i);
			}
			return React.createElement(
				'div',
				{ ref: 'front', className: 'front main-content__child flex column one' },
				React.createElement(
					'div',
					{ className: cx('welcome flex one justify-start', selectedProject >= 0 && 'welcome--hide') },
					React.createElement(
						'p',
						null,
						'Welcome to'
					),
					React.createElement('img', { className: 'welcome__img flex align-center', src: 'wp-content/themes/blacksheeplive/images/bsl_logo_text_w.png' })
				),
				React.createElement(
					'div',
					{ className: 'scroll-container flex one column align-center justify-end' },
					projects && currentPage < pageCount() - 1 ? React.createElement('img', { className: 'arrow', src: 'wp-content/themes/blacksheeplive/images/icons/arrow_down.png', onClick: this.down }) : React.createElement('img', { className: 'arrow', src: 'wp-content/themes/blacksheeplive/images/icons/arrow_up.png', onClick: this.up })
				),
				window.innerWidth >= 720 ? projectContainers.map(function (i) {
					var styles = { transform: 'translate(0, ' + (i - currentPage) * 100 + '%)' };
					return React.createElement(
						'div',
						{ key: i, ref: 'projectContainer', className: 'project-container', style: styles },
						_this7.projectElements(i * 9)
					);
				}) : React.createElement(
					'div',
					{ ref: 'projectContainer', className: 'project-container' },
					this.projectElements()
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

	return Front;
})(React.Component);

App.MainContent.Menu.Content = (function (_React$Component6) {
	_inherits(Content, _React$Component6);

	function Content() {
		var _Object$getPrototypeO5;

		var _temp5, _this8, _ret5;

		_classCallCheck(this, Content);

		for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
			args[_key5] = arguments[_key5];
		}

		return _ret5 = (_temp5 = (_this8 = _possibleConstructorReturn(this, (_Object$getPrototypeO5 = Object.getPrototypeOf(Content)).call.apply(_Object$getPrototypeO5, [this].concat(args))), _this8), _this8.state = {
			expanded: false
		}, _this8.onPlayerReady = function () {
			if (_this8.player) {
				_this8.player.playVideo();
				_this8.resize();
			}
		}, _this8.onPlayerStateChange = function (event) {
			switch (event.data) {
				case YT.PlayerState.ENDED:
					if (_this8.player) {
						_this8.player.stopVideo();
					}
					break;
			}
		}, _this8.expand = function (event) {
			_this8.setState({ expanded: true });
		}, _this8.resize = function () {
			var player = $('#showreel-video')[0];
			var content = $('.main-content')[0];
			var adminbar = $('#wpadminbar')[0];

			var container = undefined;
			if (_this8.state.expanded) {
				container = content;
			} else {
				container = $(player).parent()[0];
			}

			var newPlayerHeight = container.offsetHeight;
			var newPlayerWidth = 16 / 9 * newPlayerHeight;
			var newPlayerX = -(newPlayerWidth - container.offsetWidth) * 0.5;
			var newPlayerY = _this8.props.expanded ? content.offsetTop + adminbar.offsetHeight - window.pageYOffset : 0;
			if (isFinite(newPlayerX) || newPlayerX != 0) {
				$(player).width(newPlayerWidth).height(newPlayerHeight);
				$(player).css({ left: newPlayerX, top: newPlayerY });
			}
		}, _this8.menuPageContent = function () {
			var description = _this8.props.menu.description;
			var carouselAttrs = { decorators: [] };
			if (description) {
				if (description.split('\n').length > 1) {
					carouselAttrs = {};
				}
			}

			var menu = _this8.props.menu;
			var elems = [];
			if (_this8.isShowreel()) {
				if (iOS) {
					var iframeAttrs = {
						id: 'showreel-video',
						className: 'showreel-video ios',
						width: '560',
						height: '315',
						src: 'https://www.youtube.com/embed/EYkz_2HchLg?controls=0&modestbranding=1',
						frameBorder: '0',
						allowFullScreen: 'true',
						onClick: _this8.expand
					};
					elems.push(React.createElement('iframe', _extends({ key: 'showreel-video' }, iframeAttrs)));
				} else {
					elems.push(React.createElement('div', { key: 'showreel-video', id: 'showreel-video', className: 'showreel-video' }));
					elems.push(React.createElement(
						'div',
						{ key: 'showreel-info', className: 'menu-content__info' },
						React.createElement(
							'h1',
							null,
							'Showreel'
						),
						React.createElement('img', { onClick: _this8.expand, className: 'play flex align-center', src: 'wp-content/themes/blacksheeplive/images/icons/play_icon_w.png' })
					));
				}
			} else {
				elems.push(React.createElement(
					'h1',
					{ key: 'menu-name', className: 'menu-content__inner-content-title' },
					menu.name
				));
				elems.push(React.createElement(
					Carousel,
					_extends({ key: 'carousel', ref: 'carousel', className: 'carousel' }, carouselAttrs),
					description ? description.split('\n').map(function (item, i) {
						var descriptionAttrs = {
							key: 'description-' + i,
							className: 'menu-content__inner-content-description',
							dangerouslySetInnerHTML: { __html: htmlUnescape(item) }
						};
						return React.createElement('div', descriptionAttrs);
					}) : null
				));
			}
			return elems;
		}, _this8.isShowreel = function () {
			var menu = _this8.props.menu;
			if (!menu) {
				return false;
			}
			return menu.name.toLowerCase() == 'showreel';
		}, _temp5), _possibleConstructorReturn(_this8, _ret5);
	}

	_createClass(Content, [{
		key: 'render',
		value: function render() {
			var isShowreel = this.isShowreel();
			var classnames = cx('menu-content main-content__child flex align-center justify-center', !isShowreel && 'column', isShowreel && 'row showreel', this.state.expanded && isShowreel && 'menu-content--expanded');
			return React.createElement(
				'div',
				{ className: classnames },
				React.createElement(
					'div',
					{ className: 'menu-content__inner' },
					React.createElement(
						'div',
						{ className: 'menu-content__inner-content flex column align-center justify-center' },
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
				this.player = new YT.Player('showreel-video', {
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

	return Content;
})(React.Component);

var Poster = (function (_React$Component7) {
	_inherits(Poster, _React$Component7);

	function Poster() {
		var _Object$getPrototypeO6;

		var _temp6, _this9, _ret6;

		_classCallCheck(this, Poster);

		for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
			args[_key6] = arguments[_key6];
		}

		return _ret6 = (_temp6 = (_this9 = _possibleConstructorReturn(this, (_Object$getPrototypeO6 = Object.getPrototypeOf(Poster)).call.apply(_Object$getPrototypeO6, [this].concat(args))), _this9), _this9.state = {
			hovering: false,
			expanded: false
		}, _this9.onPlayerReady = function () {
			_this9.resize();
			if (!iOS && _this9.player) {
				if (_this9.state.hovering) {
					_this9.player.playVideo();
				} else {
					_this9.player.seekTo(0);
					_this9.player.stopVideo();
				}
			}
		}, _this9.onPlayerStateChange = function (event) {
			switch (event.data) {
				case YT.PlayerState.ENDED:
					if (_this9.player) {
						_this9.player.stopVideo();
					}
					break;
			}
		}, _this9.setHovering = function (state) {
			_this9.setState({ hovering: state });
			_this9.resize();
		}, _this9.resize = function () {
			var id = '#video-' + _this9.props.projectID;
			var player = $(id)[0];
			var content = $('.main-content')[0];
			var adminbar = $('#wpadminbar')[0];
			var poster = $('.project__poster--playing')[0];
			if (!poster) {
				poster = $('.project__poster--selected')[0];
			}

			var container = undefined;
			if (_this9.props.selected) {
				container = content;
			} else {
				container = $(player).parent()[0];
			}

			if (!container) {
				return;
			}

			var newPlayerHeight = container.offsetHeight;
			var newPlayerWidth = 16 / 9 * newPlayerHeight;
			var maxWidth = newPlayerWidth > container.offsetWidth ? newPlayerWidth : container.offsetWidth;
			var minWidth = newPlayerWidth < container.offsetWidth ? newPlayerWidth : container.offsetWidth;
			var newPlayerX = (content.offsetWidth - player.offsetWidth) * 0.5 - (poster ? poster.offsetLeft : 0);
			var newPlayerY = 0;
			if (isFinite(newPlayerX) || newPlayerX != 0) {
				$(player).width(newPlayerWidth).height(newPlayerHeight).css({
					left: newPlayerX,
					top: newPlayerY
				});
			}
		}, _this9.expand = function () {
			var expanded = !_this9.state.expanded;
			_this9.setState({ expanded: expanded });
		}, _temp6), _possibleConstructorReturn(_this9, _ret6);
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
			var classnames = cx('project__poster flex column one align-center justify-center', hovering && 'project__poster--playing', selected && 'project__poster--selected', expanded && 'project__poster--expanded');
			var onClick = undefined,
			    onMouseOver = undefined,
			    onMouseOut = undefined;
			if (!selected) {
				if (!hovering) {
					style.background = 'url(' + project.posterURL + ') center / cover';
				}
				onClick = this.props.onClick;
				if (!iOS) {
					onMouseOver = this.setHovering.bind(this, true);
					onMouseOut = this.setHovering.bind(this, false);
				}
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
				className: 'ios-player',
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
				iOS && selected && React.createElement('iframe', iframeAttrs),
				!iOS && React.createElement('div', { id: key, className: 'project__poster-iframe' }),
				this.props.selected ? React.createElement(Poster.Info, { project: project, expand: this.expand }) : null
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this10 = this;

			var posterHeight = this.refs.poster.offsetHeight;
			this.refs.poster.style.width = posterHeight + 'px';

			window.addEventListener('resize', this.resize);

			this.listenerID = dispatcher.register(function (payload) {
				switch (payload.type) {
					case 'deselectProject':
						if (!iOS && _this10.player) {
							_this10.player.stopVideo();
						}
						_this10.setState({
							hovering: false,
							expanded: false
						});
						break;
				}
			});
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
				_extends({ className: cx('project__poster-info', iOS && 'project__poster-info--ios') }, infoAttrs),
				React.createElement(
					'h1',
					{ className: 'project__poster-info-name' },
					project.name
				),
				React.createElement(
					'p',
					{ className: 'project__poster-info-description' },
					project.description
				),
				React.createElement('img', { onClick: this.props.expand, className: cx('play flex align-center', iOS && 'play--ios'), src: 'wp-content/themes/blacksheeplive/images/icons/play_icon_w.png' })
			);
		}
	}]);

	return Info;
})(React.Component);

App.MainContent.Front.Project = (function (_React$Component9) {
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
			var projectAttrs = {};
			if (isMobile()) {
				projectAttrs = {
					style: {
						transform: 'translate(0, ' + this.props.projectID * 100 + '%)'
					}
				};
			}
			return React.createElement(
				'div',
				_extends({ className: cx('project flex column align-center', this.props.selected && 'project--selected') }, projectAttrs),
				React.createElement(
					'div',
					{ className: 'project__close' },
					React.createElement(
						'span',
						{ className: 'project__close-symbol', onClick: this.deselectProject },
						React.createElement('img', { className: 'project__close-symbol-img', src: 'wp-content/themes/blacksheeplive/images/icons/close_w.png' })
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
				{ className: 'footer flex' },
				React.createElement(
					'p',
					{ className: 'footer__copyright flex one align-center justify-start wrap' },
					'COPYRIGHT (C) 2015',
					React.createElement('img', { className: 'footer__copyright-logo flex align-center ', src: 'wp-content/themes/blacksheeplive/images/bsl_logo_text_b.png' })
				),
				React.createElement(
					'span',
					{ className: 'footer__social flex one align-center justify-end' },
					React.createElement(
						'a',
						{ className: 'footer__social-link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
						React.createElement('img', { className: 'footer__social-img', src: 'wp-content/themes/blacksheeplive/images/icons/facebook.png' })
					),
					React.createElement(
						'a',
						{ className: 'footer__social-link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
						React.createElement('img', { className: 'footer__social-img', src: 'wp-content/themes/blacksheeplive/images/icons/instagram.png' })
					),
					React.createElement(
						'a',
						{ className: 'footer__social-link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
						React.createElement('img', { className: 'footer__social-img', src: 'wp-content/themes/blacksheeplive/images/icons/linkedin.png' })
					),
					React.createElement(
						'a',
						{ className: 'footer__social-link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
						React.createElement('img', { className: 'footer__social-img', src: 'wp-content/themes/blacksheeplive/images/icons/twitter.png' })
					),
					React.createElement(
						'a',
						{ className: 'footer__social-link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
						React.createElement('img', { className: 'footer__social-img', src: 'wp-content/themes/blacksheeplive/images/icons/youtube.png' })
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