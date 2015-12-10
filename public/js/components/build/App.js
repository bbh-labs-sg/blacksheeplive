var React = require('react');
var ReactDOM = require('react-dom');
var Flux = require('flux');
var dispatcher = new Flux.Dispatcher();
var $ = require('jquery');
var cx = require('classnames');

var POSITIONS = [{ x: -0.12, y: 0.13 }, { x: -0.27, y: -0.20 }, { x: -0.32, y: 0.10 }, { x: 0.03, y: -0.20 }, { x: 0.08, y: 0.10 }, { x: 0.20, y: 0.00 }, { x: 0.20, y: 0.25 }, { x: 0.31, y: -0.20 }, { x: 0.31, y: 0.12 }];

var SCALES = [0.4, 0.3, 0.2, 0.3, 0.2, 0.2, 0.2, 0.2, 0.15];
var SCALE_BASELINE_PIXELS = 1000;

var App = React.createClass({
	displayName: 'App',

	render: function () {
		return React.createElement(
			'div',
			{ id: 'app', className: 'flex column' },
			React.createElement(App.Header, { togglePage: this.togglePage }),
			React.createElement(App.Content, { projects: this.state.projects, page: this.state.page, selectedProject: this.state.selectedProject, togglePage: this.togglePage }),
			React.createElement(App.Footer, null)
		);
	},
	getInitialState: function () {
		return { projects: [], selectedProject: -1, page: null };
	},
	componentDidMount: function () {
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

		this.fetchProjects();
	},
	togglePage: function (newPage) {
		var page = this.state.page;
		this.setState({ page: page == newPage ? null : newPage });
	},
	fetchProjects: function () {
		$.ajax({
			url: '/projects',
			method: 'GET',
			dataType: 'json'
		}).done((function (projects) {
			this.setState({ projects: projects });
		}).bind(this)).fail((function (resp) {
			console.log('Failed to fetch projects');
		}).bind(this));
	}
});

App.Header = React.createClass({
	displayName: 'Header',

	render: function () {
		return React.createElement(
			'div',
			{ id: 'header', className: 'flex' },
			React.createElement(
				'div',
				{ className: 'flex one justify-start' },
				React.createElement('img', { className: 'logo flex align-center', src: 'images/bsl_logo.png' })
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
	},
	toggleMenu: function () {
		this.props.togglePage('menu');
	}
});

App.Content = React.createClass({
	displayName: 'Content',

	render: function () {
		var page;

		switch (this.props.page) {
			case 'menu':
				page = React.createElement(App.Content.Menu, { togglePage: this.props.togglePage });
				break;
			case 'about':
				page = React.createElement(App.Content.About, null);
				break;
			case 'services':
				page = React.createElement(App.Content.Services, null);
				break;
			case 'contact':
				page = React.createElement(App.Content.Contact, null);
				break;
			case 'showreel':
				page = React.createElement(App.Content.Showreel, null);
				break;
			default:
				page = null;
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
					React.createElement('img', { src: 'images/icons/close_w.png' })
				)
			)
		);
	},
	getInitialState: function () {
		return { project: null };
	},
	toggleMenu: function () {
		this.props.togglePage('menu');
	},
	closePage: function (event) {
		this.props.togglePage(null);
	}
});

App.Content.Menu = React.createClass({
	displayName: 'Menu',

	render: function () {
		var togglePage = this.props.togglePage;
		return React.createElement(
			'div',
			{ className: 'flex one column menu align-center justify-center' },
			React.createElement(
				'div',
				{ className: 'flex column inner' },
				React.createElement(
					'a',
					{ href: '#', className: 'flex one item justify-center', onClick: function () {
							togglePage('about');
						} },
					'ABOUT US'
				),
				React.createElement(
					'a',
					{ href: '#', className: 'flex one item justify-center', onClick: function () {
							togglePage('services');
						} },
					'SERVICES'
				),
				React.createElement(
					'a',
					{ href: '#', className: 'flex one item justify-center', onClick: function () {
							togglePage('contact');
						} },
					'CONTACT'
				),
				React.createElement(
					'a',
					{ href: '#', className: 'flex one item justify-center', onClick: function () {
							togglePage('showreel');
						} },
					'SHOWREEL'
				)
			)
		);
	}
});

App.Content.Home = React.createClass({
	displayName: 'Home',

	render: function () {
		return React.createElement(
			'div',
			{ ref: 'home', className: 'home' },
			React.createElement(
				'div',
				{ className: 'welcome flex one justify-start' },
				React.createElement(
					'p',
					null,
					'Welcome to'
				),
				React.createElement('img', { className: 'logo flex align-center', src: 'images/bsl_logo_text_w.png' })
			),
			this.projectElements()
		);
	},
	getInitialState: function () {
		return { minWidth: 0 };
	},
	componentDidMount: function () {
		this.onWindowResize();
		window.addEventListener('resize', this.onWindowResize, false);
	},
	componentWillUnmount: function () {
		window.removeEventListener('resize', this.onWindowResize, false);
	},
	projectElements: function () {
		var projects = this.props.projects;
		if (!projects) {
			return null;
		}

		var selectedProject = this.props.selectedProject;
		var elems = [];
		var index = 0;
		for (var i in projects) {
			var p = projects[i];
			elems.push(React.createElement(App.Content.Home.Project, { key: i, project: p, projectID: i, index: index++, selected: i == selectedProject, onClick: this.selectProject.bind(this, i), minWidth: this.state.minWidth }));
		}
		return elems;
	},
	onWindowResize: function (event) {
		var home = this.refs.home;
		var minWidth = Math.min(home.offsetWidth, home.offsetHeight);
		this.setState({ minWidth: minWidth });
	},
	selectProject: function (i) {
		dispatcher.dispatch({
			type: 'selectProject',
			projectID: i
		});
	}
});

App.Content.About = React.createClass({
	displayName: 'About',

	render: function () {
		return React.createElement(
			'div',
			{ ref: 'about', className: 'page about' },
			React.createElement(
				'div',
				{ className: 'inner' },
				React.createElement(
					'div',
					{ className: 'content flex column align-center justify-center' },
					React.createElement(
						'h1',
						null,
						'About'
					)
				)
			)
		);
	}
});

App.Content.Services = React.createClass({
	displayName: 'Services',

	render: function () {
		return React.createElement(
			'div',
			{ ref: 'about', className: 'page services' },
			React.createElement(
				'div',
				{ className: 'inner' },
				React.createElement(
					'div',
					{ className: 'content flex column align-center justify-center' },
					React.createElement(
						'h1',
						null,
						'Services'
					)
				)
			)
		);
	}
});

App.Content.Contact = React.createClass({
	displayName: 'Contact',

	render: function () {
		return React.createElement(
			'div',
			{ ref: 'contact', className: 'page contact' },
			React.createElement(
				'div',
				{ className: 'inner' },
				React.createElement(
					'div',
					{ className: 'content flex column align-center justify-center' },
					React.createElement(
						'h1',
						null,
						'Contact'
					)
				)
			)
		);
	}
});

App.Content.Showreel = React.createClass({
	displayName: 'Showreel',

	render: function () {
		return React.createElement(
			'div',
			{ ref: 'showreel', className: 'page showreel' },
			React.createElement(
				'div',
				{ className: 'inner' },
				React.createElement(
					'div',
					{ className: 'content flex column align-center justify-center' },
					React.createElement(
						'h1',
						null,
						'Showreel'
					)
				)
			)
		);
	}
});

var Poster = React.createClass({
	displayName: 'Poster',

	render: function () {
		var project = this.props.project;
		var style;
		var key = 'video-' + this.props.projectID;
		var hovering = this.state.hovering;
		var expanded = this.state.expanded;
		var classnames = cx('flex column one poster align-center justify-center', hovering && 'playing', expanded && 'expanded');
		var onClick, onMouseOver, onMouseOut;
		if (!this.props.selected) {
			var index = this.props.index;
			var scale = SCALES[index] * this.props.minWidth / SCALE_BASELINE_PIXELS;
			var posX = POSITIONS[index].x * 100 + 'vw';
			var posY = POSITIONS[index].y * 100 + 'vh';
			style = { transform: 'translate(' + posX + ',' + posY + ') scale(' + scale + ')' };
			if (!hovering) {
				style.background = 'url(' + project.posterURL + ') center / cover';
			}
			onClick = this.props.onClick;
			onMouseOver = this.setHovering.bind(this, true);
			onMouseOut = this.setHovering.bind(this, false);
		}
		return React.createElement(
			'div',
			{ ref: 'poster', key: key, className: classnames, style: style, onClick: onClick, onMouseOver: onMouseOver, onMouseOut: onMouseOut },
			React.createElement('div', { id: key }),
			this.props.selected ? React.createElement(Poster.Info, { project: project, expand: this.expand }) : null
		);
	},
	getInitialState: function () {
		return { hovering: false, expanded: false };
	},
	componentDidMount: function () {
		var project = this.props.project;
		var posterHeight = this.refs.poster.offsetHeight;
		this.refs.poster.style.width = posterHeight + 'px';

		window.addEventListener('resize', this.resize);
		this.listenerID = dispatcher.register((function (payload) {
			switch (payload.type) {
				case 'deselectProject':
					if (this.player) {
						this.player.stopVideo();
					}
					this.setState({ hovering: false, expanded: false });
					break;
			}
		}).bind(this));
	},
	componentDidUpdate: function () {
		var posterHeight = this.refs.poster.offsetHeight;
		this.refs.poster.style.width = posterHeight + 'px';

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
					videoId: project.url.substring(project.url.length - 11, project.url.length),
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
	},
	componentWillUnmount: function () {
		if (this.player) {
			this.player.destroy();
		}
		dispatcher.unregister(this.listenerID);
	},
	onPlayerReady: function () {
		if (this.player) {
			this.resize();
			if (this.state.hovering) {
				this.player.playVideo();
			} else {
				this.player.seekTo(0);
				this.player.stopVideo();
			}
		}
	},
	onPlayerStateChange: function (event) {
		switch (event.data) {
			case YT.PlayerState.ENDED:
				if (this.player) {
					this.player.stopVideo();
				}
				break;
		}
	},
	setHovering: function (state) {
		this.setState({ hovering: state });
		this.resize();
	},
	resize: function () {
		var player = document.getElementById('video-' + this.props.projectID);
		var container;
		if (this.props.selected) {
			container = $('.home')[0];
		} else {
			container = $(player).parent()[0];
		}

		var newPlayerWidth, newPlayerHeight, newPlayerX, newPlayerY;
		var maxWidth, minWidth;

		var multiplier = container.offsetHeight / (player.offsetWidth * 9 / 16);
		newPlayerWidth = container.offsetWidth * multiplier;
		newPlayerHeight = container.offsetHeight;
		maxWidth = Math.max(newPlayerWidth, player.offsetWidth);
		minWidth = Math.min(newPlayerWidth, player.offsetWidth);
		newPlayerX = -(maxWidth - minWidth) * 0.5;
		newPlayerY = -(newPlayerHeight - player.offsetHeight) * 0.5;
		if (newPlayerX != 0) {
			$(player).width(maxWidth).height(newPlayerHeight).css({
				left: newPlayerX,
				top: newPlayerY
			});
		}
	},
	expand: function () {
		var expanded = !this.state.expanded;
		this.setState({ expanded: expanded });
	}
});

Poster.Info = React.createClass({
	displayName: 'Info',

	render: function () {
		var project = this.props.project;
		return React.createElement(
			'div',
			{ className: 'info' },
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
			React.createElement('img', { onClick: this.props.expand, className: 'logo flex align-center', src: 'images/icons/play_icon_w.png' })
		);
	}
});

App.Content.Home.Project = React.createClass({
	displayName: 'Project',

	render: function () {
		return React.createElement(
			'div',
			{ className: cx('flex column bubble align-center', this.props.selected && 'selected') },
			React.createElement(
				'div',
				{ className: 'close' },
				React.createElement(
					'span',
					{ className: 'symbol', onClick: this.deselectProject },
					React.createElement('img', { src: 'images/icons/close_w.png' })
				)
			),
			React.createElement(Poster, { index: this.props.index, project: this.props.project, projectID: this.props.projectID, selected: this.props.selected, minWidth: this.props.minWidth, onClick: this.props.onClick })
		);
	},
	deselectProject: function () {
		dispatcher.dispatch({ type: 'deselectProject' });
	}
});

App.Footer = React.createClass({
	displayName: 'Footer',

	render: function () {
		return React.createElement(
			'div',
			{ id: 'footer', className: 'flex' },
			React.createElement(
				'p',
				{ className: 'flex one align-center justify-start copyright' },
				'COPYRIGHT (C) 2015 ',
				React.createElement('img', { className: 'logo flex align-center ', src: 'images/bsl_logo_text_b.png' })
			),
			React.createElement(
				'span',
				{ className: 'flex one align-center justify-end social' },
				React.createElement(
					'a',
					{ className: 'link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
					React.createElement('img', { src: 'images/icons/facebook.png' })
				),
				React.createElement(
					'a',
					{ className: 'link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
					React.createElement('img', { src: 'images/icons/instagram.png' })
				),
				React.createElement(
					'a',
					{ className: 'link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
					React.createElement('img', { src: 'images/icons/linkedin.png' })
				),
				React.createElement(
					'a',
					{ className: 'link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
					React.createElement('img', { src: 'images/icons/twitter.png' })
				),
				React.createElement(
					'a',
					{ className: 'link', href: 'https://www.facebook.com/BBHAsiaPac/', target: '_blank' },
					React.createElement('img', { src: 'images/icons/youtube.png' })
				)
			)
		);
	}
});

render = function () {
	ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
};