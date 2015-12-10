var React = require('react');
var ReactDOM = require('react-dom');
var Flux = require('flux');
var dispatcher = new Flux.Dispatcher();
var $ = require('jquery');
var cx = require('classnames');

var POSITIONS = [{ x: -0.15, y: 0.10 }, { x: -0.20, y: -0.23 }, { x: -0.30, y: -0.05 }, { x: 0.05, y: -0.20 }, { x: 0.10, y: 0.15 }, { x: 0.20, y: 0.05 }, { x: 0.20, y: 0.27 }, { x: 0.28, y: -0.15 }, { x: 0.30, y: 0.17 }];

var SCALES = [0.3, 0.2, 0.2, 0.2, 0.15, 0.15, 0.15, 0.15, 0.12];

var App = React.createClass({
	displayName: 'App',

	render: function () {
		return React.createElement(
			'div',
			{ id: 'app', className: 'flex column' },
			React.createElement(App.Header, { toggleMenu: this.toggleMenu }),
			React.createElement(App.Content, { projects: this.state.projects, selectedProject: this.state.selectedProject, toggleMenu: this.toggleMenu, showMenu: this.state.showMenu }),
			React.createElement(App.Footer, null)
		);
	},
	getInitialState: function () {
		return { projects: [], showMenu: false, selectedProject: -1 };
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
	toggleMenu: function (event) {
		var showMenu = this.state.showMenu;
		this.setState({ showMenu: !showMenu });
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
				React.createElement('img', { className: 'logo flex align-center', src: 'images/icons/dummy.png' })
			),
			React.createElement(
				'div',
				{ className: 'flex one justify-end' },
				React.createElement(
					'a',
					{ className: 'menu flex align-center', href: '#', onClick: this.props.toggleMenu },
					'MENU'
				)
			)
		);
	}
});

App.Content = React.createClass({
	displayName: 'Content',

	render: function () {
		return React.createElement(
			'div',
			{ id: 'content', className: 'flex one column' },
			this.props.showMenu ? React.createElement(App.Content.Menu, { toggleMenu: this.props.toggleMenu, showMenu: this.props.showMenu }) : React.createElement(App.Content.Home, { projects: this.props.projects, selectedProject: this.props.selectedProject })
		);
	},
	getInitialState: function () {
		return { project: null };
	}
});

App.Content.Menu = React.createClass({
	displayName: 'Menu',

	render: function () {
		return React.createElement(
			'div',
			{ className: 'flex one column menu align-center justify-center' },
			React.createElement(
				'div',
				{ className: 'flex close justify-end' },
				React.createElement(
					'span',
					{ className: 'symbol', onClick: this.closeMenu },
					'X'
				)
			),
			React.createElement(
				'div',
				{ className: 'flex column inner' },
				React.createElement(
					'a',
					{ href: '#', className: 'flex one item justify-center' },
					'ABOUT US'
				),
				React.createElement(
					'a',
					{ href: '#', className: 'flex one item justify-center' },
					'SERVICES'
				),
				React.createElement(
					'a',
					{ href: '#', className: 'flex one item justify-center' },
					'CONTACT'
				),
				React.createElement(
					'a',
					{ href: '#', className: 'flex one item justify-center' },
					'SHOWREEL'
				)
			)
		);
	},
	closeMenu: function (event) {
		if (this.props.showMenu) {
			this.props.toggleMenu();
		}
	}
});

App.Content.Home = React.createClass({
	displayName: 'Home',

	render: function () {
		return React.createElement(
			'div',
			{ ref: 'home', className: 'home' },
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
	componentDidUpdate: function () {},
	componentWillUnmount: function () {
		window.removeEventListener('resize', this.onWindowResize, false);
	},
	projectElements: function () {
		var projects = this.props.projects;
		if (!projects) {
			return null;
		}

		var selectedProject = this.props.selectedProject;
		if (selectedProject >= 0) {
			var p = projects[selectedProject];
			return React.createElement(App.Content.Home.Project, { key: selectedProject, project: p, projectID: selectedProject, selected: true });
		}

		var elems = [];
		var index = 0;
		for (var i in projects) {
			var p = projects[i];
			elems.push(React.createElement(App.Content.Home.Project, { key: i, project: p, projectID: i, index: index++, selected: false, onClick: this.selectProject.bind(this, i), minWidth: this.state.minWidth }));
		}
		return elems;
	},
	onWindowResize: function (event) {
		var home = this.refs.home;
		var minWidth = Math.max(home.offsetWidth, home.offsetHeight);
		this.setState({ minWidth: minWidth });
	},
	selectProject: function (i) {
		dispatcher.dispatch({
			type: 'selectProject',
			projectID: i
		});
	}
});

var Poster = React.createClass({
	displayName: 'Poster',

	render: function () {
		var project = this.props.project;
		var selected = this.props.selected;
		var style = { background: 'url(' + project.posterURL + ') center / cover' };
		var key = 'video-' + this.props.projectID;
		var classnames = cx('flex column one poster align-center justify-center', selected && 'selected', this.state.hovering && 'playing', this.state.expanded && 'expanded');
		if (selected) {
			return React.createElement(
				'div',
				{ ref: 'poster', key: key, className: classnames, style: style, onClick: this.props.onClick },
				React.createElement('div', { id: key }),
				React.createElement(Poster.Info, { project: project, expand: this.expand })
			);
		}
		var index = this.props.index;
		var scale = SCALES[index] * this.props.minWidth / 1000;
		var posX = POSITIONS[index].x * 100 + 'vw';
		var posY = POSITIONS[index].y * 100 + 'vh';
		style.transform = 'translate(' + posX + ',' + posY + ') scale(' + scale + ')';
		return React.createElement(
			'div',
			{ ref: 'poster', key: key, className: classnames, style: style, onClick: this.props.onClick, onMouseOver: this.setHovering.bind(this, true), onMouseOut: this.setHovering.bind(this, false) },
			React.createElement('div', { id: key })
		);
	},
	getInitialState: function () {
		return { hovering: false, expanded: false };
	},
	componentDidMount: function () {
		var project = this.props.project;
		var posterHeight = this.refs.poster.offsetHeight;
		this.refs.poster.style.width = posterHeight + 'px';

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

		this.listenerID = dispatcher.register((function (payload) {
			switch (payload.type) {
				case 'deselectProject':
					this.player.stopVideo();
					this.setState({ hovering: false, expanded: false });
					break;
			}
		}).bind(this));
	},
	componentDidUpdate: function () {
		var posterHeight = this.refs.poster.offsetHeight;
		this.refs.poster.style.width = posterHeight + 'px';

		if (this.state.hovering) {
			if (this.player && this.player.getPlayerState() != 1) {
				this.player.seekTo(0);
				this.player.playVideo();
			}
		} else {
			if (this.player) {
				this.player.stopVideo();
			}
		}
	},
	componentWillUnmount: function () {
		dispatcher.unregister(this.listenerID);
	},
	onPlayerReady: function () {
		if (this.state.hovering) {
			this.player.playVideo();
		}
	},
	onPlayerStateChange: function (event) {
		//console.log('onPlayerStateChange');
	},
	setHovering: function (state) {
		this.setState({ hovering: state });
		this.resize();
	},
	resize: function () {
		var player = document.getElementById('video-' + this.props.projectID);
		var playerWidth, playerHeight, playerX, playerY, maxWidth, minWidth;
		if (this.props.selected) {
			var content = document.getElementById('content');
			var multiplier = content.offsetHeight / (player.offsetWidth * 9 / 16);
			playerWidth = content.offsetWidth * multiplier;
			playerHeight = content.offsetHeight;
			console.log(playerWidth, player.offsetWidth);
			maxWidth = Math.max(playerWidth, player.offsetWidth);
			minWidth = Math.min(playerWidth, player.offsetWidth);
			playerX = -(maxWidth - minWidth) * 0.5;
			playerY = -(playerHeight - player.offsetHeight) * 0.5;
		} else {
			var parent = $(player).parent().get(0);
			var multiplier = parent.offsetHeight / (player.offsetWidth * 9 / 16);
			playerWidth = parent.offsetWidth * multiplier;
			playerHeight = parent.offsetHeight;
			maxWidth = Math.max(playerWidth, player.offsetWidth);
			minWidth = Math.min(playerWidth, player.offsetWidth);
			playerX = -(maxWidth - minWidth) * 0.5;
			playerY = -(playerHeight - player.offsetHeight) * 0.5;
		}
		console.log(playerX);
		if (playerX != 0) {
			$(player).width(maxWidth).height(playerHeight).css({
				left: playerX,
				top: playerY
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
			React.createElement(
				'button',
				{ onClick: this.props.expand },
				'PLAY'
			)
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
					'X'
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
				'COPYRIGHT (C) 2015 BLACKSHEEPLIVE'
			),
			React.createElement(
				'span',
				{ className: 'flex one align-center justify-end social' },
				React.createElement(
					'a',
					{ className: 'link', href: '#' },
					React.createElement('img', { src: 'images/icons/dummy.png' })
				),
				React.createElement(
					'a',
					{ className: 'link', href: '#' },
					React.createElement('img', { src: 'images/icons/dummy.png' })
				),
				React.createElement(
					'a',
					{ className: 'link', href: '#' },
					React.createElement('img', { src: 'images/icons/dummy.png' })
				),
				React.createElement(
					'a',
					{ className: 'link', href: '#' },
					React.createElement('img', { src: 'images/icons/dummy.png' })
				),
				React.createElement(
					'a',
					{ className: 'link', href: '#' },
					React.createElement('img', { src: 'images/icons/dummy.png' })
				)
			)
		);
	}
});

render = function () {
	ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
};