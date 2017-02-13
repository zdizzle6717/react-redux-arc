'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';

const mapStateToProps = (state) => {
	return {
		'loader': state.loader
	}
}

class Loader extends React.Component {
	constructor() {
		super();
	}

    render() {
		let loaderClasses = classNames({
			'loader-container': true,
			'show': this.props.loader
		});

	    return (
			<div className={loaderClasses}>
				{
					this.props.type === 'standard' &&
					<div className="loader">
						<div></div>
					</div>
				}
				{
					this.props.type === 'bars' &&
					<div className="loader">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				}
				{
					this.props.type === 'custom' &&
					<div>
						{this.props.children}
					</div>
				}
			</div>
	    );
    }
}

Loader.propTypes = {
	'type': React.PropTypes.string
}

Loader.defaultProps = {
	'type': 'bars'
}

export default connect(mapStateToProps)(Loader);
