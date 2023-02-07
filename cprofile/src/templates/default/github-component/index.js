import React, { Component } from 'react';
import { MobileView } from 'react-device-detect';
import githubLogo from 'components/defaultSmallImage/PbyGithub.png';
import './style.scss';

class GithubAch extends Component {
	renderMobileGithubBanner = () => {
		return (
			<MobileView>
				<img
					src={githubLogo}
					className="github-banner mobile-github-banner"
					alt="github"
				/>
			</MobileView>
		);
	};

	_githubDefTemplate = () => {
		const { data, meta } = this.props;
		const { editable } = meta;
		const repoList = data && data.repoList ? data.repoList : '';
		return (
			<section className="github-container">
				<ul className="status-box">
					<li>
						<span>{(data && data.publicRepoCount) || 0}</span> Repositories
					</li>
					<li>
						<span>{(data && data.publicGistCount) || 0}</span> Gists
					</li>
					<li>
						<span>{(data && data.followersCount) || 0}</span> Followers
					</li>
				</ul>
				<div className={editable ? 'repo-box' : 'repo-box github-preview'}>
					{repoList &&
						repoList.map((elm, index) => {
							return (
								<div
									key={index}
									className={
										editable
											? 'github-block-main-view watch'
											: 'github-block-main-view watch github-preview'
									}
								>
									<a
										href={elm.repoURL}
										target="_blank"
										title={elm.repoName}
										rel="noopener noreferrer"
									>
										<div className="github-block-title">{elm.repoName}</div>
										<div className="github-block-content">
											<div className="github-block-description">
												{elm.repoDescription}
											</div>
											<div className="github-block-hide-footer" />
										</div>
										<div className="github-block-footer">
											<span>
												<i className="icon-icon_favorite" />{' '}
												{elm.repoStargazers}
											</span>
											<span>
												<i className="icon-icon_dialogue" /> {elm.repoForks}
											</span>
											<span>
												<i className="icon-icon-icon_watching" />{' '}
												{elm.repoWatchers}
											</span>
										</div>
									</a>
								</div>
							);
						})}
				</div>
				{this.renderMobileGithubBanner()}
			</section>
		);
	};

	_githubDarkTemplate = () => {
		const { data, meta } = this.props;
		const { editable } = meta;
		const repoList = data && data.repoList ? data.repoList : '';
		return (
			<section className="github-container">
				<div className="github-dark-status-box">
					<div>
						Repositories <span>{(data && data.publicRepoCount) || 0}</span>
					</div>
					<div>
						Gists <span>{(data && data.publicGistCount) || 0}</span>
					</div>
					<div>
						Followers <span>{(data && data.followersCount) || 0}</span>
					</div>
				</div>
				<div
					className={
						editable
							? 'github-dark-repo-box'
							: 'github-dark-repo-box github-preview'
					}
				>
					{repoList &&
						repoList.map((elm, index) => {
							return (
								<div
									key={index}
									className={
										editable
											? 'github-dark-block-main-view watch'
											: 'github-dark-block-main-view watch github-preview'
									}
								>
									<a
										href={elm.repoURL}
										target="_blank"
										title={elm.repoName}
										rel="noopener noreferrer"
									>
										<div className="github-dark-block-title">
											{elm.repoName}
										</div>
										<div className="github-dark-block-description">
											{elm.repoDescription}
										</div>
									</a>
								</div>
							);
						})}
				</div>
				{this.renderMobileGithubBanner()}
			</section>
		);
	};

	render() {
		const { templateType } = this.props.config;
		const template = {
			dark: this._githubDarkTemplate(),
			def: this._githubDefTemplate(),
		};
		return template[templateType] || template['def'];
	}
}

export default {
	def: GithubAch,
	dark: GithubAch,
};
