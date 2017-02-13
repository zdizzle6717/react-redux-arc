'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import checkAuthorization from '../utilities/checkAuthorization';

export default function(roleConfig) {
	const mapStateToProps = (state) => {
		return {
			'user': state.user
		}
	};

	class AccessControl extends React.Component {
		constructor() {
			super();

			this.state = {
				'authorized': false
			}
		}

		componentWillMount() {
			this.setState({
				'authorized': checkAuthorization(this.props.access, this.props.user, roleConfig)
			});
		}

		componentWillReceiveProps(nextProps) {
			if (nextProps.user.roleFlags !== this.props.user.roleFlags) {
				this.setState({
					'authorized': checkAuthorization(this.props.access, nextProps.user, roleConfig)
				});
			}
		}

		render() {
			return (
				<span className={this.props.customClasses ? `access-control ${this.props.customClasses}` : 'access-control'}>
					{ this.state.authorized && !this.props.publicOnly && this.props.children }
					{ !this.state.authorized && this.props.publicOnly && this.props.children }
				</span>
			)
		}
	}

	AccessControl.propTypes = {
		'access': React.PropTypes.array,
		'customClasses': React.PropTypes.string,
		'publicOnly': React.PropTypes.bool
	}

	AccessControl.defaultProps = {
		'access': [],
		'publicOnly': false
	}

	return connect(mapStateToProps)(AccessControl);
}
