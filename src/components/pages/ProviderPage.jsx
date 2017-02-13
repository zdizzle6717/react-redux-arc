'use strict';

import React from 'react';
import {Link, browserHistory} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {AlertActions} from '../../library/alerts';
import NotFoundPage from '../pages/NotFoundPage';
import ProviderActions from '../../actions/ProviderActions';
import isEmpty from '../../library/utilities/isEmpty';

const mapStateToProps = (state) => {
    return {'provider': state.provider}
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
		'addAlert': AlertActions.addAlert,
        'getProvider': ProviderActions.get
    }, dispatch);
};

class ProviderPage extends React.Component {
    constructor() {
        super();

        this.state = {}

        this.showAlert = this.showAlert.bind(this);
    }

	static fetchData(config) {
		return config.store.dispatch(ProviderActions.get(config.params.providerId));
	}

    componentDidMount() {
        document.title = "Sandbox | Provider";
		this.props.getProvider(this.props.params.providerId).catch(() => {
			this.showAlert('providerNotFound');
			browserHistory.push('/providers');
		});
    }

    showAlert(selector) {
        const alerts = {
            'providerNotFound': () => {
                this.props.addAlert({
					'title': 'Provider Not Found',
					'message': 'A provider with that ID was not found.',
					'type': 'error',
					'delay': 3000
				});
            }
        }

        return alerts[selector]();
    }

    render() {
        return (
            <div className="row">
                <h1 className="push-bottom-2x">Provider: <strong>{this.props.provider.name}</strong>
                </h1>
                <h5>ID: {this.props.provider.id}</h5>
                <div className="row">
                    <div className="small-12 medium-4 columns">
                        <label>
                            <u>{this.props.provider.identifierType}</u>
                        </label>
                        <p className="text-justify">
                            {this.props.provider.identifier}
                        </p>
                    </div>
                    <div className="small-12 medium-4 columns">
                        <label>
                            <u>Provider Number</u>
                        </label>
                        <p className="text-justify">
                            {this.props.provider.providerNumber}
                        </p>
                    </div>
                    <div className="small-12 medium-4 columns">
                        <label>
                            <u>DBA</u>
                        </label>
                        <p className="text-justify">
                            {this.props.provider.dba}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderPage);
