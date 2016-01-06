'use strict';

let React = require('react');
let ReactDOM = require('react-dom');
let Flux = require('flux');
let dispatcher = new Flux.Dispatcher();
let $ = require('jquery');
let cx = require('classnames');
let Carousel = require('nuka-carousel');

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
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function htmlUnescape(value){
	return String(value)
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
}

class App extends React.Component {
	state = {
		projects: projects,
		selectedProject: -1,
		page: null,
	}
	render() {
		let headerAttrs = {
			togglePage: this.togglePage,
		};
		let contentAttrs = {
			projects: this.state.projects,
			page: this.state.page,
			selectedProject: this.state.selectedProject,
			togglePage: this.togglePage,
		};
		return (
			<div id='app' className='flex column'>
				<App.Header {...headerAttrs} />
				<App.MainContent {...contentAttrs} />
				<App.Footer />
			</div>
		)
	}
	componentDidMount() {
		this.listenerID = dispatcher.register((payload) => {
			switch (payload.type) {
			case 'selectProject':
				this.setState({ selectedProject: payload.projectID });
				break;
			case 'deselectProject':
				this.setState({ selectedProject: -1 });
				break;
			}
		});
	}
	togglePage = (newPage) => {
		let page = this.state.page;
		this.setState({ page: page == newPage ? null : newPage });
	}
}

App.Header = class Header extends React.Component {
	render() {
		return (
			<div className='header flex'>
				<div className='flex one justify-start'>
					<a href='/'><img className='header-logo flex align-center' src='wp-content/themes/blacksheeplive/images/bsl_logo.png' /></a>
				</div>
				<div className='flex one justify-end'>
					<a className='header-menu flex align-center' href='#' onClick={this.toggleMenu}>MENU</a>
				</div>
			</div>
		)
	}
	toggleMenu = () => {
		this.props.togglePage('menu');
	}
}

App.MainContent = class MainContent extends React.Component {
	render() {
		let page;

		switch (this.props.page) {
		case 'menu':
			page = <App.MainContent.Menu togglePage={this.props.togglePage} />; break;
		case 'showreel':
			page = <App.MainContent.Showreel />; break;
		case null:
			break;
		default:
			page = <App.MainContent.Menu.Content menu={menus[this.props.page]} />; break;
		}

		return (
			<div className='main-content flex one column'>
				<App.MainContent.Front projects={this.props.projects} selectedProject={this.props.selectedProject} />
				{ page }
				<div className={cx('main-content__close flex justify-end', this.props.page ? '' : 'main-content__close--hide')}>
					<span className='main-content__close-symbol' onClick={this.closePage}>
						<img className='main-content__close-symbol-img' src='wp-content/themes/blacksheeplive/images/icons/close_w.png' />
					</span>
				</div>
			</div>
		)
	}
	state = {
		project: null,
	}
	toggleMenu = () => {
		this.props.togglePage('menu');
	}
	closePage = (event) => {
		this.props.togglePage(null);
	}
}

App.MainContent.Menu = class Menu extends React.Component {
	render() {
		let togglePage = this.props.togglePage;
		return (
			<div className='main-content__menu main-content__child flex one column align-center justify-center'>
				<div className='main-content__menu-inner flex column'>{
					menus ? menus.map((menu, i) => {
						let menuAttrs = {
							key: 'menu-' + i,
							className: 'main-content__menu-inner-item flex one justify-center',
							onClick: () => {
								togglePage(i);
							},
						};
						return <a {...menuAttrs}>{menu.name}</a>;
					}) : null
				}</div>
			</div>
		)
	}
}

App.MainContent.Front = class Front extends React.Component {
	render() {
		let currentPage = this.state.currentPage;
		let selectedProject = this.props.selectedProject;
		let projectContainers = [];
		for (let i = 0; i < pageCount(); i++) {
			projectContainers.push(i);
		}
		return (
			<div ref='front' className='front main-content__child flex column one'>
				<div className={cx('welcome flex one justify-start', selectedProject >= 0 && 'welcome--hide')}>
					<p>Welcome to</p>
					<img className='welcome__img flex align-center' src='wp-content/themes/blacksheeplive/images/bsl_logo_text_w.png' />
				</div>
				<div className='scroll-container flex one column align-center justify-end'>
				{
					projects && currentPage < pageCount() - 1 ?
					<img className='arrow' src='wp-content/themes/blacksheeplive/images/icons/arrow_down.png' onClick={this.down} /> :
					<img className='arrow' src='wp-content/themes/blacksheeplive/images/icons/arrow_up.png' onClick={this.up} />
				}
				</div>
				{
					window.innerWidth >= 720 ?
					projectContainers.map((i) => {
						let styles = { transform: 'translate(0, ' + (i - currentPage) * 100 + '%)' };
						return (
							<div key={i} ref='projectContainer' className='project-container' style={styles}>
								{ this.projectElements(i * 9) }
							</div>
						)
					}) :
					<div ref='projectContainer' className='project-container'>
						{ this.projectElements() }
					</div>
				}
			</div>
		)
	}
	state = {
		minWidth: 0,
		currentPage: 0,
	}
	componentDidMount() {
		this.onWindowResize();
		window.addEventListener('resize', this.onWindowResize, false);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize, false);
	}
	projectElements = (offset) => {
		let projects = this.props.projects;
		if (!projects) {
			return null;
		}

		let start = typeof(offset) !== 'undefined' ? offset : 0;
		let end = typeof(offset) !== 'undefined' ? Math.min(projects.length, offset + 9) : projects.length;

		let selectedProject = this.props.selectedProject;
		let elems = [];
		for (let i = start; i < end; i++) {
			let attrs = {
				key: i,
				project: projects[i],
				projectID: i,
				selected: i == selectedProject,
				onClick: this.selectProject.bind(this, i),
				minWidth: this.state.minWidth,
			};
			elems.push(<App.MainContent.Front.Project {...attrs} />);
		}
		return elems;
	}
	onWindowResize = (event) => {
		let front = this.refs.front;

		this.setState({
			minWidth: Math.min(front.offsetWidth, front.offsetHeight),
		});

		if (!this.hammertime) {
			this.hammertime = new Hammer(this.refs.front);
			this.handleGesture();
		}

		if (window.innerWidth >= 720) {
			this.handleGestureDesktop();
		}
	}
	selectProject = (i) => {
		dispatcher.dispatch({
			type: 'selectProject',
			projectID: i,
		});
	}
	down = () => {
		let currentPage = this.state.currentPage;
		if (projects.length == 0 || currentPage >= pageCount() - 1) {
			return;
		}
		currentPage++;
		this.setState({ currentPage: currentPage });

		if (isMobile()) {
			this.refs.projectContainer.style.transform = 'translate(0, ' + currentPage * -100 + '%)';
		}
	}
	up = () => {
		let currentPage = this.state.currentPage;
		if (currentPage <= 0) {
			return;
		}
		currentPage--;
		this.setState({ currentPage: currentPage });

		if (isMobile()) {
			this.refs.projectContainer.style.transform = 'translate(0, ' + currentPage * -100 + '%)';
		}
	}
	handleGesture = () => {
		// Handle Mouse Wheel / Touchpad
		this.wheelY = 0;
		$(window).on('wheel', (event) => {
			if (this.props.selectedProject >= 0) {
				return;
			}

			this.wheelY += event.originalEvent.deltaY;
			if (Math.abs(this.wheelY) > 150) {
				if (this.wheelY < 0) {
					this.up();
				} else if (this.wheelY > 0) {
					this.down();
				}
				this.wheelY = 0;
			}
		});

		// Handle Drag
		this.hammertime.get('pan').set({
			direction: Hammer.DIRECTION_VERTICAL,
		});
		this.hammertime.on('pan', (event) => {
			if (!event.isFinal || this.props.selectedProject >= 0) {
				return;
			}
			if (event.deltaY > 100) {
				this.up();
			} else if (event.deltaY < -100) {
				this.down();
			}
		});
	}
	handleGestureDesktop = () => {
		this.setState({ currentPage: 0 });
		this.refs.front.style.transform = 'translate(0, 0%)';
	}
}

App.MainContent.Menu.Content = class Content extends React.Component {
	render() {
		let isShowreel = this.isShowreel();
		let classnames = cx(
			'menu-content main-content__child flex align-center justify-center',
			!isShowreel && 'column',
			isShowreel && 'row showreel',
			this.state.expanded && isShowreel && 'menu-content--expanded'
		);
		return (
			<div className={classnames}>
				<div className='menu-content__inner'>
					<div className='menu-content__inner-content flex column align-center justify-center'>
						{ this.menuPageContent() }
					</div>
				</div>
			</div>
		);
	}
	state = {
		expanded: false,
	}
	componentDidMount() {
		if (!this.isShowreel()) {
			return;
		}

		if (!iOS) {
			this.player = new YT.Player( 'showreel-video', {
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
		}

		window.addEventListener('resize', this.resize);
	}
	componentDidUpdate() {
		if (!this.isShowreel()) {
			return;
		}

		this.resize();
	}
	componentWillUnmount() {
		if (!this.isShowreel()) {
			return;
		}

		if (this.player) {
			this.player.destroy();
			this.player = null;
		}

		window.removeEventListener('resize', this.resize);
	}
	onPlayerReady = () => {
		if (this.player) {
			this.player.playVideo();
			this.resize();
		}
	}
	onPlayerStateChange = (event) => {
		switch (event.data) {
		case YT.PlayerState.ENDED:
			if (this.player) {
				this.player.stopVideo();
			}
			break;
		}
	}
	expand = (event) => {
		this.setState({ expanded: true });
	}
	resize = () => {
		let player = $('#showreel-video')[0];
		let content = $('.main-content')[0];
		let adminbar = $('#wpadminbar')[0];

		let container;
		if (this.state.expanded) {
			container = content;
		} else {
			container = $(player).parent()[0];
		}

		let newPlayerHeight = container.offsetHeight;
		let newPlayerWidth = 16 / 9 * newPlayerHeight;
		let newPlayerX = -(newPlayerWidth - container.offsetWidth) * 0.5;
		let newPlayerY = this.props.expanded ? (content.offsetTop + adminbar.offsetHeight - window.pageYOffset) : 0;
		if (isFinite(newPlayerX) || newPlayerX != 0) {
			$(player).width(newPlayerWidth).height(newPlayerHeight)
			$(player).css({ left: newPlayerX, top: newPlayerY });
		}
	}
	menuPageContent = () => {
		let description = this.props.menu.description;
		let carouselAttrs = { decorators: [] };
		if (description) {
			if (description.split('\n').length > 1) {
				carouselAttrs = {};
			}
		}

		let menu = this.props.menu;
		let elems = [];
		if (this.isShowreel()) {
			if (iOS) {
				let iframeAttrs = {
					id: 'showreel-video',
					className: 'showreel-video ios',
					width: '560',
					height: '315',
					src: 'https://www.youtube.com/embed/EYkz_2HchLg?controls=0&modestbranding=1',
					frameBorder: '0',
					allowFullScreen: 'true',
					onClick: this.expand,
				};
				elems.push( <iframe key='showreel-video' {...iframeAttrs}></iframe> );
			} else {
				elems.push( <div key='showreel-video' id='showreel-video' className='showreel-video'></div> );
				elems.push(
					<div key='showreel-info' className='menu-content__info'>
						<h1>Showreel</h1>
						<img onClick={this.expand} className='play flex align-center' src='wp-content/themes/blacksheeplive/images/icons/play_icon_w.png' />
					</div>
				);
			}
		} else {
			elems.push( <h1 key='menu-name' className='menu-content__inner-content-title'>{ menu.name }</h1> )
			elems.push( <Carousel key='carousel' ref='carousel' className='carousel' { ...carouselAttrs }>{
				description ? description.split('\n').map((item, i) => {
					let descriptionAttrs = {
						key: 'description-' + i,
						className: 'menu-content__inner-content-description',
						dangerouslySetInnerHTML: { __html: htmlUnescape(item) }, 
					};
					return <div {...descriptionAttrs} />
				}) : null
			}</Carousel> );
		}
		return elems;
	}
	isShowreel = () => {
		let menu = this.props.menu;
		if (!menu) {
			return false;
		}
		return menu.name.toLowerCase() == 'showreel';
	}
}

class Poster extends React.Component {
	render() {
		let project = this.props.project;
		let style = {};
		let key = 'video-' + this.props.projectID;
		let hovering = this.state.hovering;
		let expanded = this.state.expanded;
		let selected = this.props.selected;
		let classnames = cx('project__poster flex column one align-center justify-center', hovering && 'project__poster--playing', selected && 'project__poster--selected', expanded && 'project__poster--expanded' );
		let onClick, onMouseOver, onMouseOut;
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

		let posterAttrs = {
			key: key,
			className: classnames,
			style: style,
			onClick: onClick,
			onMouseOver: onMouseOver,
			onMouseOut: onMouseOut,
		};

		let youtubeID = project.videoURL.substring(project.videoURL.length - 11, project.videoURL.length);
		let iframeAttrs = {
			id: key,
			className: 'ios-player',
			width: '560',
			height: '315',
			src: 'https://www.youtube.com/embed/' + youtubeID,
			controls: '0',
			frameBorder: '0',
			allowFullScreen: 'true',
			modestbranding: '1',
		};
		return (
			<div ref='poster' {...posterAttrs}>
				{ iOS && selected && <iframe {...iframeAttrs}></iframe> }
				{ !iOS && <div id={key} className='project__poster-iframe' /> }
				{ this.props.selected ? <Poster.Info project={project} expand={this.expand} /> : null }
			</div>
		);
	}
	state = {
		hovering: false,
		expanded: false,
	}
	componentDidMount() {
		let posterHeight = this.refs.poster.offsetHeight;
		this.refs.poster.style.width = posterHeight + 'px';

		window.addEventListener('resize', this.resize);

		this.listenerID = dispatcher.register((payload) => {
			switch (payload.type) {
			case 'deselectProject':
				if (!iOS && this.player) {
					this.player.stopVideo();
				}
				this.setState({
					hovering: false,
					expanded: false,
				});
				break;
			}
		});
	}
	componentDidUpdate() {
		let posterHeight = this.refs.poster.offsetHeight;
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
					let project = this.props.project;
					this.player = new YT.Player( 'video-' + this.props.projectID, {
						width: '1280',
						height: '720',
						videoId: project.videoURL.substring(project.videoURL.length - 11, project.videoURL.length),
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
		}

		if (this.props.selected) {
			this.resize();
		}
	}
	componentWillUnmount() {
		if (this.player) {
			this.player.destroy();
			this.player = null;
		}
		dispatcher.unregister(this.listenerID);
	}
	onPlayerReady = () => {
		this.resize();
		if (!iOS && this.player) {
			if (this.state.hovering) {
				this.player.playVideo();
			} else {
				this.player.seekTo(0);
				this.player.stopVideo();
			}
		}
	}
	onPlayerStateChange = (event) => {
		switch (event.data) {
		case YT.PlayerState.ENDED:
			if (this.player) {
				this.player.stopVideo();
			}
			break;
		}
	}
	setHovering = (state) => {
		this.setState({ hovering: state });
		this.resize();
	}
	resize = () => {
		let id = '#video-' + this.props.projectID;
		let player = $(id)[0];
		let content = $('.main-content')[0];
		let adminbar = $('#wpadminbar')[0];
		let poster = $('.project__poster--playing')[0];
		if (!poster) {
			poster = $('.project__poster--selected')[0];
		}

		let container;
		if (this.props.selected) {
			container = content;
		} else {
			container = $(player).parent()[0];
		}

		if (!container) {
			return;
		}

		let newPlayerHeight = container.offsetHeight;
		let newPlayerWidth = 16 / 9 * newPlayerHeight;
		let maxWidth = newPlayerWidth > container.offsetWidth ? newPlayerWidth : container.offsetWidth;
		let minWidth = newPlayerWidth < container.offsetWidth ? newPlayerWidth : container.offsetWidth;
		let newPlayerX = (content.offsetWidth - player.offsetWidth) * 0.5 - (poster ? poster.offsetLeft : 0);
		let newPlayerY = 0;
		if (isFinite(newPlayerX) || newPlayerX != 0) {
			$(player)
				.width(newPlayerWidth)
				.height(newPlayerHeight)
				.css({
					left: newPlayerX,
					top: newPlayerY
				});
		}
	}
	expand = () => {
		let expanded = !this.state.expanded;
		this.setState({ expanded: expanded });
	}
}

Poster.Info = class Info extends React.Component {
	render() {
		let project = this.props.project;
		let infoAttrs = {};
		if (iOS) {
			infoAttrs = { onClick: this.props.expand };
		}
		return (
			<div className={cx('project__poster-info flex column one align-center justify-center', iOS && 'project__poster-info--ios')} {...infoAttrs}>
				<h1 className='project__poster-info-name'>{ project.name }</h1>
				<p className='project__poster-info-description'>{ project.description }</p>
				<img onClick={this.props.expand} className={cx('play flex align-center', iOS && 'play--ios')} src='wp-content/themes/blacksheeplive/images/icons/play_icon_w.png' />
			</div>
		)
	}
}

App.MainContent.Front.Project = class Project extends React.Component {
	render() {
		let posterAttrs = {
			project: this.props.project,
			projectID: this.props.projectID,
			selected: this.props.selected,
			minWidth: this.props.minWidth,
			onClick: this.props.onClick,
		};
		let projectAttrs = {};
		if (isMobile()) {
			projectAttrs = {
				style: {
					transform: 'translate(0, ' + this.props.projectID * 100 + '%)',
				},
			};
		}
		return (
			<div className={cx('project flex column align-center', this.props.selected && 'project--selected')} {...projectAttrs}>
				<div className='project__close'>
					<div className='project__close-symbol' onClick={ this.deselectProject }>
						<img className='project__close-symbol-img' src='wp-content/themes/blacksheeplive/images/icons/close_w.png' />
					</div>
				</div>
				<Poster {...posterAttrs} />
			</div>
		)
	}
	deselectProject() {
		dispatcher.dispatch({ type: 'deselectProject' });
	}
}

App.Footer = class Footer extends React.Component {
	render() {
		return (
			<div className='footer flex'>
				<p className='footer__copyright flex one align-center justify-start wrap'>
					COPYRIGHT (C) 2015
					<img className='footer__copyright-logo flex align-center ' src='wp-content/themes/blacksheeplive/images/bsl_logo_text_b.png' />
				</p>
				<span className='footer__social flex one align-center justify-end'>
					<a className='footer__social-link' href='https://www.facebook.com/BBHAsiaPac/' target="_blank">
						<img className='footer__social-img' src='wp-content/themes/blacksheeplive/images/icons/facebook.png' />
					</a>
					<a className='footer__social-link' href='https://www.facebook.com/BBHAsiaPac/' target="_blank">
						<img className='footer__social-img' src='wp-content/themes/blacksheeplive/images/icons/instagram.png' />
					</a>
					<a className='footer__social-link' href='https://www.facebook.com/BBHAsiaPac/' target="_blank">
						<img className='footer__social-img' src='wp-content/themes/blacksheeplive/images/icons/linkedin.png' />
					</a>
					<a className='footer__social-link' href='https://www.facebook.com/BBHAsiaPac/' target="_blank">
						<img className='footer__social-img' src='wp-content/themes/blacksheeplive/images/icons/twitter.png' />
					</a>
					<a className='footer__social-link' href='https://www.facebook.com/BBHAsiaPac/' target="_blank">
						<img className='footer__social-img' src='wp-content/themes/blacksheeplive/images/icons/youtube.png' />
					</a>
				</span>
			</div>
		)
	}
}

if (iOS) {
	ReactDOM.render(<App />, document.getElementById('root'));
} else {
	render = function() {
		ReactDOM.render(<App />, document.getElementById('root'));
	}
}
