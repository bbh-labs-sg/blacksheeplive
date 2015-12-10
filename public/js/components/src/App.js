var React = require('react');
var ReactDOM = require('react-dom');
var Flux = require('flux');
var dispatcher = new Flux.Dispatcher();
var $ = require('jquery');
var cx = require('classnames');

var POSITIONS = [
	{ x: -0.15, y: 0.10 },
	{ x: -0.20, y: -0.23 },
	{ x: -0.30, y: -0.05 },
	{ x: 0.05, y: -0.20 },
	{ x: 0.10, y: 0.15 },
	{ x: 0.20, y: 0.05 },
	{ x: 0.20, y: 0.27 },
	{ x: 0.28, y: -0.15 },
	{ x: 0.30, y: 0.17 },
];

var SCALES = [ 0.3, 0.2, 0.2, 0.2, 0.15, 0.15, 0.15, 0.15, 0.12 ];
var SCALE_BASELINE_PIXELS = 1000;

var App = React.createClass({
	render: function() {
		return (
			<div id='app' className='flex column'>
				<App.Header toggleMenu={this.toggleMenu} />
				<App.Content projects={this.state.projects} selectedProject={this.state.selectedProject} toggleMenu={this.toggleMenu} showMenu={this.state.showMenu} />
				<App.Footer />
			</div>
		)
	},
	getInitialState: function() {
		return { projects: [], showMenu: false, selectedProject: -1 };
	},
	componentDidMount: function() {
		this.listenerID = dispatcher.register(function(payload) {
			switch (payload.type) {
			case 'selectProject':
				this.setState({ selectedProject: payload.projectID });
				break;
			case 'deselectProject':
				this.setState({ selectedProject: -1 });
				break;
			}
		}.bind(this));

		this.fetchProjects();
	},
	toggleMenu: function(event) {
		var showMenu = this.state.showMenu;
		this.setState({ showMenu: !showMenu });
	},
	fetchProjects: function() {
		$.ajax({
			url: '/projects',
			method: 'GET',
			dataType: 'json',
		}).done(function(projects) {
			this.setState({ projects: projects });
		}.bind(this)).fail(function(resp) {
			console.log('Failed to fetch projects');
		}.bind(this));
	},
});

App.Header = React.createClass({
	render: function() {
		return (
			<div id='header' className='flex'>
				<div className='flex one justify-start'>
					<img className='logo flex align-center' src='images/icons/dummy.png' />
				</div>
				<div className='flex one justify-end'>
					<a className='menu flex align-center' href='#' onClick={this.props.toggleMenu}>MENU</a>
				</div>
			</div>
		)
	},
});

App.Content = React.createClass({
	render: function() {
		return (
			<div id='content' className='flex one column'>
				<App.Content.Home projects={this.props.projects} selectedProject={this.props.selectedProject} />
				<App.Content.Menu toggleMenu={this.props.toggleMenu} showMenu={this.props.showMenu} />
			</div>
		)
	},
	getInitialState: function() {
		return { project: null };
	},
});

App.Content.Menu = React.createClass({
	render: function() {
		return (
			<div className={cx('flex one column menu align-center justify-center', this.props.showMenu && 'displayed')}>
				<div className='flex close justify-end'>
					<span className='symbol' onClick={this.closeMenu}>X</span>
				</div>
				<div className='flex column inner'>
					<a href='#' className='flex one item justify-center'>ABOUT US</a>
					<a href='#' className='flex one item justify-center'>SERVICES</a>
					<a href='#' className='flex one item justify-center'>CONTACT</a>
					<a href='#' className='flex one item justify-center'>SHOWREEL</a>
				</div>
			</div>
		)
	},
	closeMenu: function(event) {
		if (this.props.showMenu) {
			this.props.toggleMenu();
		}
	},
});

App.Content.Home = React.createClass({
	render: function() {
		return (
			<div ref='home' className='home'>
				{ this.projectElements() }
			</div>
		)
	},
	getInitialState: function() {
		return { minWidth: 0 };
	},
	componentDidMount: function() {
		this.onWindowResize();
		window.addEventListener('resize', this.onWindowResize, false);
	},
	componentDidUpdate: function() {
	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.onWindowResize, false);
	},
	projectElements: function() {
		var projects = this.props.projects;
		if (!projects) {
			return null;
		}

		var selectedProject = this.props.selectedProject;
		var elems = [];
		var index = 0;
		for (var i in projects) {
			var p = projects[i];
			elems.push(<App.Content.Home.Project key={i} project={p} projectID={i} index={index++} selected={i == selectedProject} onClick={this.selectProject.bind(this, i)} minWidth={this.state.minWidth} />);
		}
		return elems;
	},
	onWindowResize: function(event) {
		var home = this.refs.home;
		var minWidth = Math.max(home.offsetWidth, home.offsetHeight);
		this.setState({ minWidth: minWidth });
	},
	selectProject: function(i) {
		dispatcher.dispatch({
			type: 'selectProject',
			projectID: i,
		});
	},
});

var Poster = React.createClass({
	render: function() {
		var project = this.props.project;
		var style = { background: 'url(' + project.posterURL + ') center / cover' };
		var key = 'video-' + this.props.projectID;
		var hovering = this.state.hovering;
		var expanded = this.state.expanded;
		var classnames = cx('flex column one poster align-center justify-center', hovering && 'playing', expanded && 'expanded' );
		var onClick, onMouseOver, onMouseOut;
		if (!this.props.selected) {
			var index = this.props.index;
			var scale = SCALES[index] * this.props.minWidth / SCALE_BASELINE_PIXELS;
			var posX = POSITIONS[index].x * 100 + 'vw';
			var posY = POSITIONS[index].y * 100 + 'vh';
			style.transform = 'translate(' + posX + ',' + posY + ') scale(' + scale + ')';
			onClick = this.props.onClick;
			onMouseOver = this.setHovering.bind(this, true);
			onMouseOut = this.setHovering.bind(this, false);
		}
		return (
			<div ref='poster' key={key} className={classnames} style={style} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
				<div id={key}></div>
			</div>
		);
	},
	getInitialState: function() {
		return { hovering: false, expanded: false };
	},
	componentDidMount: function() {
		var project = this.props.project;
		var posterHeight = this.refs.poster.offsetHeight;
		this.refs.poster.style.width = posterHeight + 'px';
		window.addEventListener('resize', this.resize);

		this.player = new YT.Player( 'video-' + this.props.projectID, {
			width: '1280',
			height: '720',
			videoId: project.url.substring( project.url.length - 11, project.url.length ),
			playerVars: {
				controls: 0,
				showinfo: 0,
				modestbranding: 1,
				wmode: 'transparent',
			},
			events: {
				'onReady': this.onPlayerReady,
				'onStateChange': this.onPlayerStateChange,
			},
		});

		this.listenerID = dispatcher.register(function(payload) {
			switch (payload.type) {
			case 'deselectProject':
				this.player.stopVideo();
				this.setState({ hovering: false, expanded: false });
				break;
			}
		}.bind(this));
	},
	componentDidUpdate: function() {
		var posterHeight = this.refs.poster.offsetHeight;
		this.refs.poster.style.width = posterHeight + 'px';

		if (this.state.hovering) {
			if (this.player) {
				if (this.player.getPlayerState() != YT.PlayerState.PLAYING) {
					this.player.seekTo(0);
					this.player.playVideo();
				}
			}
		} else {
			if (this.player) {
				this.player.stopVideo();
			}
		}
	},
	componentWillUnmount: function() {
		if (this.player) {
			this.player.destroy();
		}
		dispatcher.unregister(this.listenerID);
	},
	onPlayerReady: function() {
		if (this.player) {
			if (this.state.hovering) {
				this.player.playVideo();
			} else {
				this.player.seekTo(0);
			}
		}
	},
	onPlayerStateChange: function(event) {
		switch (event.data) {
		case YT.PlayerState.ENDED:
			this.player.stopVideo();
			break;
		}
	},
	setHovering: function(state) {
		this.setState({ hovering: state });
		this.resize();
	},
	resize: function() {
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
			$(player).width(maxWidth)
				.height(newPlayerHeight)
				.css({
					left: newPlayerX,
					top: newPlayerY,
				});
		}
	},
	expand: function() {
		var expanded = !this.state.expanded;
		this.setState({ expanded: expanded });
	},
});

Poster.Info = React.createClass({
	render: function() {
		var project = this.props.project;
		return (
			<div className='info'>
				<h1>{ project.name }</h1>
				<p>{ project.description }</p>
				<button onClick={this.props.expand}>PLAY</button>
			</div>
		)
	},
});

App.Content.Home.Project = React.createClass({
	render: function() {
		return (
			<div className={cx('flex column bubble align-center', this.props.selected && 'selected')}>
				<div className='close'>
					<span className='symbol' onClick={ this.deselectProject }>X</span>
				</div>
				<Poster index={ this.props.index } project={ this.props.project } projectID={ this.props.projectID } selected={ this.props.selected } minWidth={ this.props.minWidth } onClick={ this.props.onClick } />
			</div>
		)
	},
	deselectProject: function() {
		dispatcher.dispatch({ type: 'deselectProject' });
	},
});

App.Footer = React.createClass({
	render: function() {
		return (
			<div id='footer' className='flex'>
				<p className='flex one align-center justify-start copyright'>COPYRIGHT (C) 2015 BLACKSHEEPLIVE</p>
				<span className='flex one align-center justify-end social'>
					<a className='link' href='#'><img src='images/icons/dummy.png' /></a>
					<a className='link' href='#'><img src='images/icons/dummy.png' /></a>
					<a className='link' href='#'><img src='images/icons/dummy.png' /></a>
					<a className='link' href='#'><img src='images/icons/dummy.png' /></a>
					<a className='link' href='#'><img src='images/icons/dummy.png' /></a>
				</span>
			</div>
		)
	},
});

render = function() {
	ReactDOM.render(<App />, document.getElementById('root'));
}
