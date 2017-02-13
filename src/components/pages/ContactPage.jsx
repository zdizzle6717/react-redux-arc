'use strict';

import React from 'react';
import {Link, browserHistory} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {AlertActions} from '../../library/alerts';
import NotFoundPage from '../pages/NotFoundPage';
import ContactActions from '../../actions/ContactActions';
import isEmpty from '../../library/utilities/isEmpty';

const mapStateToProps = (state) => {
    return {
		'contact': state.contact
	};
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
		'addAlert': AlertActions.addAlert,
        'getContact': ContactActions.get
    }, dispatch);
};

class ContactPage extends React.Component {
    constructor() {
        super();

        this.state = {};

		this.showAlert = this.showAlert.bind(this);
    }

	// Initialize data for server side rendering
	static fetchData(config) {
		return config.store.dispatch(ContactActions.get(config.params.contactId));
	}

    componentDidMount() {
        document.title = "Sandbox | View Contact";
		this.props.getContact(this.props.params.contactId).catch(() => {
			this.showAlert('contactNotFound');
			browserHistory.push('/contacts');
		});
    }

	showAlert(selector) {
		const alerts = {
			'contactNotFound': () => {
				this.props.addAlert({
					'title': 'Contact Not Found',
					'message': 'A contact with that ID was not found.',
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
				<div>
					<h3 className="push-bottom-2x">View Contact: <strong>{this.props.contact.firstName} {this.props.contact.middleName} {this.props.contact.lastName}</strong></h3>
					<h5>ID: {this.props.contact.id}
					</h5>
					<div className="row">
						<div className="small-12 medium-4 columns">
							<label><u>Email</u></label>
							<p className="text-justify">
								{this.props.contact.email}
							</p>
						</div>
						<div className="small-12 medium-4 columns">
							<label><u>Mobile Phone</u></label>
							<p className="text-justify">
								{this.props.contact.mobilePhone}
							</p>
						</div>
						<div className="small-12 medium-4 columns">
							<label><u>Fax</u></label>
							<p className="text-justify">
								{this.props.contact.fax}
							</p>
						</div>
					</div>
				</div>
			</div>
	    );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactPage);
