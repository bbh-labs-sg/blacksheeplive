var React = require('react');
var ReactDOM = require('react-dom');
var Flux = require('flux');
var dispatcher = new Flux.Dispatcher();
var $ = require('jquery');
var cx = require('classnames');
var Carousel = require('nuka-carousel');

var cumulativeOffset = function(element) {
	var top = 0, left = 0;
	do {
		top += element.offsetTop  || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while(element);

	return {
		top: top,
		left: left
	};
};

var App = React.createClass({
	render: function() {
		return (
			<div id='app' className='flex column'>
				<App.Header togglePage={this.togglePage} />
				<App.Content projects={this.state.projects} page={this.state.page} selectedProject={this.state.selectedProject} togglePage={this.togglePage} />
				<App.Footer />
			</div>
		)
	},
	getInitialState: function() {
		return { projects: [], selectedProject: -1, page: null };
	},
	componentWillMount: function() {
		document.body.removeChild(document.getElementById('fallback'));
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
	togglePage: function(newPage) {
		var page = this.state.page;
		this.setState({ page: page == newPage ? null : newPage });
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
					<a href='/'><img className='logo flex align-center' src='images/bsl_logo.png' /></a>
				</div>
				<div className='flex one justify-end'>
					<a className='menu flex align-center' href='#' onClick={this.toggleMenu}>MENU</a>
				</div>
			</div>
		)
	},
	toggleMenu: function() {
		this.props.togglePage('menu');
	},
});

App.Content = React.createClass({
	render: function() {
		var page;

		switch (this.props.page) {
		case 'menu':
			page = <App.Content.Menu togglePage={this.props.togglePage} />;
			break;
		case 'about':
			page = <App.Content.About />
			break;
		case 'services':
			page = <App.Content.Services />
			break;
		case 'contact':
			page = <App.Content.Contact />
			break;
		case 'showreel':
			page = <App.Content.Showreel />
			break;
		default:
			page = null;
		}

		return (
			<div id='content' className='flex one column'>
				<App.Content.Home projects={this.props.projects} selectedProject={this.props.selectedProject} />
				{ page }
				<div className={cx('flex close justify-end', this.props.page ? '' : 'hide')}>
					<span className='symbol' onClick={this.closePage}><img src='images/icons/close_w.png' /></span>
				</div>
			</div>
		)
	},
	getInitialState: function() {
		return { project: null };
	},
	toggleMenu: function() {
		this.props.togglePage('menu');
	},
	closePage: function(event) {
		this.props.togglePage(null);
	},
});

App.Content.Menu = React.createClass({
	render: function() {
		var togglePage = this.props.togglePage;
		return (
			<div className='flex one column menu align-center justify-center'>
				<div className='flex column inner'>
					<a href='#' className='flex one item justify-center' onClick={function() { togglePage('about'); }}>ABOUT US</a>
					<a href='#' className='flex one item justify-center' onClick={function() { togglePage('services'); }}>SERVICES</a>
					<a href='#' className='flex one item justify-center' onClick={function() { togglePage('contact'); }}>CONTACT</a>
					<a href='#' className='flex one item justify-center' onClick={function() { togglePage('showreel'); }}>SHOWREEL</a>
				</div>
			</div>
		)
	},
});

App.Content.Home = React.createClass({
	render: function() {
		return (
			<div ref='home' className='home'>
				<div className='welcome flex one justify-start'>
					<p>Welcome to</p>
					<img className='logo flex align-center' src='images/bsl_logo_text_w.png' />
				</div>
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
		var minWidth = Math.min(home.offsetWidth, home.offsetHeight);
		this.setState({ minWidth: minWidth });
	},
	selectProject: function(i) {
		dispatcher.dispatch({
			type: 'selectProject',
			projectID: i,
		});
	},
});

App.Content.About = React.createClass({
	render: function() {
		return (
			<div ref='about' className='page about flex column align-center justify-center'>
				<div className='inner'>
					<div className='content flex column align-center justify-center'>
						<h1>About us</h1>
						<Carousel className='carousel'>
							<p>We’re an agile production company; creating engaging content for brands and their audiences across all digital and social channels. We work directly with client organisations and also in support of their agency partners.</p>
							<p>We have teams in Singapore, Shanghai and Mumbai, creating content for clients such as Nike, IKEA, Google, British Airways, Skoda and Coca-Cola. We’re flexible in our approach, maximizing budgets and delivering effective solutions at pace.</p>
						</Carousel>
					</div>
				</div>
			</div>
		)
	},
});

App.Content.Services = React.createClass({
	render: function() {
		return (
			<div ref='services' className='page services flex row align-center justify-center'>
				<div className='inner'>
					<div className='content flex column align-center justify-center'>
						<h1>Services</h1>
						<h3>Production</h3>
						<p>We have an experienced and dedicated core team of film-makers, photographers, editors, developers and content writers in addition to links with like-minded specialists around the region.</p>
					</div>
				</div>
			</div>
		)
	},
});

App.Content.Contact = React.createClass({
	render: function() {
		return (
			<div ref='contact' className='page contact flex row align-center justify-center'>
				<div className='inner'>
					<div className='content flex column align-center justify-center'>
						<h1>Contact</h1>
						<Carousel className='carousel'>
							<div>
								<h3>Singapore</h3>
								<p>Blacksheep Live </p>
								<p>5 Magazine Road, #03-03 Central Mall,</p>
								<p>Singapore 059571</p>
							</div>
						</Carousel>
					</div>
				</div>
			</div>
		)
	},
});

App.Content.Showreel = React.createClass({
	render: function() {
		return (
			<div className={cx('page showreel flex row align-center justify-center', this.state.expanded && 'expanded')}>
				<div className='inner'>
					<div className='content flex column align-center justify-center'>
						<div id='video-showreel'></div>
						<div className='info'>
							<h1>Showreel</h1>
							<button onClick={this.expand}>PLAY</button>
						</div>
					</div>
				</div>
			</div>
		)
	},
	getInitialState: function() {
		return { expanded: false };
	},
	componentDidMount: function() {
		this.player = new YT.Player( 'video-showreel', {
			width: '1280',
			height: '720',
			videoId: 'EYkz_2HchLg',
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

		window.addEventListener('resize', this.resize);
	},
	componentDidUpdate: function() {
		this.resize();
	},
	componentWillUnmount: function() {
		if (this.player) {
			this.player.destroy();
			this.player = null;
		}

		window.removeEventListener('resize', this.resize);
	},
	onPlayerReady: function() {
		if (this.player) {
			this.player.playVideo();
			this.resize();
		}
	},
	onPlayerStateChange: function(event) {
		switch (event.data) {
		case YT.PlayerState.ENDED:
			if (this.player) {
				this.player.stopVideo();
			}
			break;
		}
	},
	expand: function() {
		this.setState({ expanded: true });
	},
	resize: function() {
		var player = document.getElementById('video-showreel');
		var header = document.getElementById('header');
		var container;
		if (this.state.expanded) {
			container = $('.page.showreel')[0];
		} else {
			container = $(player).parent()[0];
		}

		var newPlayerHeight = container.offsetHeight;
		var newPlayerWidth = 16 / 9 * newPlayerHeight;
		var newPlayerX = -(newPlayerWidth - container.offsetWidth) * 0.5;
		var newPlayerY = this.state.expanded ? header.offsetHeight : 0;
		if (isFinite(newPlayerX) || newPlayerX != 0) {
			console.log(newPlayerY);
			$(player).width(newPlayerWidth).height(newPlayerHeight)
			$(player).css({ left: newPlayerX, top: newPlayerY });
		}
	},
});

var Poster = React.createClass({
	render: function() {
		var project = this.props.project;
		var style = {};
		var key = 'video-' + this.props.projectID;
		var hovering = this.state.hovering;
		var expanded = this.state.expanded;
		var classnames = cx('flex column one poster align-center justify-center', hovering && 'playing', expanded && 'expanded' );
		var onClick, onMouseOver, onMouseOut;
		if (!this.props.selected) {
			var index = this.props.index;
			if (!hovering) {
				style.background = 'url(' + project.posterURL + ') center / cover';
			}
			onClick = this.props.onClick;
			onMouseOver = this.setHovering.bind(this, true);
			onMouseOut = this.setHovering.bind(this, false);
		}
		return (
			<div ref='poster' key={key} className={classnames} style={style} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
				<div id={key}></div>
				{ this.props.selected ? <Poster.Info project={project} expand={this.expand} /> : null }
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
		this.listenerID = dispatcher.register(function(payload) {
			switch (payload.type) {
			case 'deselectProject':
				if (this.player) {
					this.player.stopVideo();
				}
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
			} else {
				var project = this.props.project;
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
			}

		} else {
			if (this.player) {
				this.player.stopVideo();
			}
		}

		if (this.props.selected) {
			this.resize();
		}
	},
	componentWillUnmount: function() {
		if (this.player) {
			this.player.destroy();
			this.player = null;
		}
		dispatcher.unregister(this.listenerID);
	},
	onPlayerReady: function() {
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
	onPlayerStateChange: function(event) {
		switch (event.data) {
		case YT.PlayerState.ENDED:
			if (this.player) {
				this.player.stopVideo();
			}
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

		var header = document.getElementById('header');
		var newPlayerHeight = container.offsetHeight;
		var newPlayerWidth = 16 / 9 * newPlayerHeight;
		var newPlayerX = -(newPlayerWidth - container.offsetWidth) * 0.5;
		var newPlayerY = this.props.selected ? header.offsetHeight : 0;
		if (isFinite(newPlayerX) || newPlayerX != 0) {
			$(player).width(newPlayerWidth).height(newPlayerHeight)
			$(player).css({ left: newPlayerX, top: newPlayerY });
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
				<img onClick={this.props.expand} className='logo flex align-center' src='images/icons/play_icon_w.png' />
			</div>
		)
	},
});

App.Content.Home.Project = React.createClass({
	render: function() {
		return (
			<div className={cx('flex column bubble align-center', this.props.selected && 'selected')}>
				<div className='close'>
					<span className='symbol' onClick={ this.deselectProject }><img src='images/icons/close_w.png' /></span>
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
				<p className='copyright flex one align-center justify-start wrap'>
					COPYRIGHT (C) 2015
					<img className='logo flex align-center ' src='images/bsl_logo_text_b.png' />
				</p>
				<span className='flex one align-center justify-end social'>
					<a className='link' href='https://www.facebook.com/BBHAsiaPac/' target="_blank">
						<img src='images/icons/facebook.png' />
					</a>
					<a className='link' href='https://www.facebook.com/BBHAsiaPac/' target="_blank">
						<img src='images/icons/instagram.png' />
					</a>
					<a className='link' href='https://www.facebook.com/BBHAsiaPac/' target="_blank">
						<img src='images/icons/linkedin.png' />
					</a>
					<a className='link' href='https://www.facebook.com/BBHAsiaPac/' target="_blank">
						<img src='images/icons/twitter.png' />
					</a>
					<a className='link' href='https://www.facebook.com/BBHAsiaPac/' target="_blank">
						<img src='images/icons/youtube.png' />
					</a>
				</span>
			</div>
		)
	},
});

render = function() {
	ReactDOM.render(<App />, document.getElementById('root'));
}
