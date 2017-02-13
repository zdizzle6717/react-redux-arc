'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';
import Animation from 'react-addons-css-transition-group';
import AlertBox from './AlertBox'
import AlertActions from '../actions/AlertActions';

const mapStateToProps = (state) => {
	return {
		'alerts': state.alerts
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		'closeAlert': AlertActions.closeAlert
	}, dispatch);
}

class Alerts extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			'alerts': []
		}
	}

	closeAlert(alert) {
		this.props.closeAlert(alert);
	}

    render() {
	    return (
			<div className="alert-container">
				<Animation transitionName="slide-bottom" transitionAppear={false} transitionEnter={true} transitionEnterTimeout={250} transitionLeave={true} transitionLeaveTimeout={250}>
					{this.props.alerts.map((alert, i) => {
						return <AlertBox key={i} {...alert} closeAlert={this.closeAlert.bind(this, alert)}></AlertBox>
					})}
				</Animation>
			</div>
	    );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
