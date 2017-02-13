'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Animation from 'react-addons-css-transition-group';
import {AlertActions} from '../../library/alerts';
import Modal from '../../library/modal';
import ProviderRow from '../pieces/ProviderRow';
import ProviderActions from '../../actions/ProviderActions';
import ContactRow from '../pieces/ContactRow';
import ContactActions from '../../actions/ContactActions';
import CombinedActions from '../../actions/CombinedActions';
import isEmpty from '../../library/utilities/isEmpty';

const mapStateToProps = (state) => {
    return {
		'contacts': state.contacts,
		'providers': state.providers,
	}
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
		'addAlert': AlertActions.addAlert,
        'getAllContacts': ContactActions.getAll,
        'getAllProviders': ProviderActions.getAll,
        'removeContact': ContactActions.remove,
        'removeProvider': ProviderActions.remove
    }, dispatch);
};

class IndexPage extends React.Component {
    constructor() {
        super();

        this.state = {
			'providerModalIsOpen': false,
			'contactModalIsOpen': false,
			'modalData': {}
        }
        this.showAlert = this.showAlert.bind(this);
    }

	// Server side rendering - sends initial data
	static fetchData(config) {
		return config.store.dispatch(CombinedActions.getProvidersAndContacts());
	}

    componentDidMount() {
        document.title = "Sandbox | Home";
        this.props.getAllProviders();
		this.props.getAllContacts();
    }

	removeProvider(id) {
		this.props.removeProvider(id).then(() => {
			this.showAlert('providerDeleted');
		});
	}

	removeContact(id) {
		this.props.removeContact(id).then(() => {
			this.showAlert('contactDeleted');
		});
	}

	showAlert(selector) {
		const alerts = {
			'providerDeleted': () => {
				this.props.addAlert({
					'show': true,
					'title': 'Provider Deleted',
					'message': 'A provider was successfully deleted.',
					'type': 'info',
					'delay': 3000
				});
			},
			'contactDeleted': () => {
				this.props.addAlert({
					'show': true,
					'title': 'Contact Updated',
					'message': 'A contact was successfully deleted.',
					'type': 'info',
					'delay': 3000
				});
			}
		}

		return alerts[selector]();
	}

	openModal(data, type) {
		this.setState({
			'modalData': data
		})
		this.toggleModal(type);
	}

	toggleModal(type) {
		if (type === 'provider') {
			this.setState({
				'providerModalIsOpen': !this.state.providerModalIsOpen
			});
		}
		if (type === 'contact') {
			this.setState({
				'contactModalIsOpen': !this.state.contactModalIsOpen
			});
		}
	}

	handleModalSubmit(type) {
		if (type === 'provider') {
			this.removeProvider(this.state.modalData.id);
		}
		if (type === 'contact') {
			this.removeContact(this.state.modalData.id);
		}
		this.toggleModal(type);
	}

    render() {
		return (
			<div className="row">
				<h1>Home</h1>
		 		<h4 className="push-bottom-2x">Providers</h4>
			    <div className="small-12">
			        <table className="stack hover text-center">
			            <thead>
			                <tr>
			                    <th className="text-center" width="200">Name</th>
			                    <th className="text-center" width="150">Email</th>
			                    <th className="text-center">Provider Number</th>
			                    <th className="text-center" width="250">Phone</th>
			                    <th className="text-center" width="150">View/Edit</th>
			                </tr>
			            </thead>
			            <tbody>
							{this.props.providers.map((provider, i) =>
								<ProviderRow key={i} {...provider} removeProvider={this.openModal.bind(this, provider, 'provider')}></ProviderRow>
							)}
			            </tbody>
			        </table>
			    </div>
				<hr/>
				<h4 className="push-bottom-2x">Contacts</h4>
			    <div className="small-12">
			        <table className="stack hover text-center">
			            <thead>
			                <tr>
								<th className="text-center" width="200">Name</th>
                                <th className="text-center" width="150">Email</th>
                                <th className="text-center">Mobile Phone</th>
                                <th className="text-center" width="250">Type</th>
                                <th className="text-center" width="150">View/Edit</th>
			                </tr>
			            </thead>
			            <tbody>
							{this.props.contacts.map((contact, i) => <ContactRow key={i} {...contact} fullName={contact.firstName + ' ' + contact.lastName} removeContact={this.openModal.bind(this, contact, 'contact')}></ContactRow>)}
			            </tbody>
			        </table>
			    </div>
				<Modal key="providerModal" name="providerModal" modalIsOpen={this.state.providerModalIsOpen} handleSubmit={this.handleModalSubmit.bind(this, 'provider')} handleClose={this.toggleModal.bind(this, 'provider')} title="Remove Provider">Are you sure you want to delete {this.state.modalData.name}'s data?</Modal>
				<Modal key="contactModal" name="contactModal" modalIsOpen={this.state.contactModalIsOpen} handleSubmit={this.handleModalSubmit.bind(this, 'contact')} handleClose={this.toggleModal.bind(this, 'contact')} title="Remove Contact">Are you sure you want to delete {this.state.modalData.firstName} {this.state.modalData.lastName}'s contact?</Modal>
			</div>
	    );
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);
