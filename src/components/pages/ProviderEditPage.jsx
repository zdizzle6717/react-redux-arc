'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';
import {AlertActions} from '../../library/alerts';
import {Form, Input, Select, FileUpload} from '../../library/validations'
import ProviderActions from '../../actions/ProviderActions';

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
		'addAlert': AlertActions.addAlert,
        'getProvider': ProviderActions.get,
        'createProvider': ProviderActions.create,
        'updateProvider': ProviderActions.update
    }, dispatch)
};

class ProviderEditPage extends React.Component {
    constructor() {
        super();

        this.state = {
            'provider': {},
            'newProvider': false,
			'files': []
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showAlert = this.showAlert.bind(this);
    }

    componentDidMount() {
        document.title = "Sandbox | Edit Provider";
		if (this.props.params.providerId) {
			this.props.getProvider(this.props.params.providerId).then((provider) => {
				this.setState({
					'provider': provider
				})
			}).catch(() => {
				this.showAlert('providerNotFound');
				browserHistory.push('/providers');
			});
		} else {
			this.setState({
				'newProvider': true
			});
		}
    }

	handleInputChange(e) {
		let provider = this.state.provider;
		provider[e.target.name] = e.target.value;
		this.setState({
			'provider': provider
		})
	}

	handleSubmit(e) {
		if (this.state.newProvider) {
			this.props.createProvider(this.state.provider).then(() => {
				this.showAlert('providerCreated');
				browserHistory.push('/providers');
			});
		} else {
			this.props.updateProvider(this.state.provider.id, this.state.provider).then(() => {
				this.showAlert('providerUpdated');
				browserHistory.push('/providers');
			});
		}
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
			},
			'providerCreated': () => {
				this.props.addAlert({
					'title': 'Provider Created',
					'message': 'A new provider was successfully created.',
					'type': 'success',
					'delay': 3000
				});
			},
			'providerUpdated': () => {
				this.props.addAlert({
					'title': 'Provider Updated',
					'message': `${this.state.provider.name} was updated successfully.`,
					'type': 'success',
					'delay': 3000
				});
			}
		}

		return alerts[selector]();
	}

    render() {
		return (
			<div className="row">
				{
					this.state.newProvider ?
					<h1 className="push-bottom-2x">Add New Provider</h1> :
					<h1 className="push-bottom-2x">Edit Provider: <strong>{this.state.provider.name}</strong></h1>
				}
				<hr />
				<Form name="providerForm" submitText={this.state.newProvider ? 'Save Provider' : 'Update Provider'} handleSubmit={this.handleSubmit}>
					<div className="row">
						<div className="form-group small-12 medium-4 columns">
							<label className="required">Name</label>
							<Input type="text" name="name" value={this.state.provider.name} handleInputChange={this.handleInputChange} validate="name" required={true}/>
						</div>
						<div className="form-group small-12 medium-4 columns">
							<label className="required">DBA</label>
							<Input type="text" name="dba" value={this.state.provider.dba} handleInputChange={this.handleInputChange} validate="name" required={true} />
						</div>
						<div className="form-group small-12 medium-4 columns">
							<label className="required">Legal Name</label>
							<Input type="text" name="legalName" value={this.state.provider.legalName} handleInputChange={this.handleInputChange} validate="name" required={true} />
						</div>
					</div>
					<div className="row">
						<div className="form-group small-12 medium-4 columns">
							<label className="required">Provider Number</label>
							<Input type="text" name="providerNumber" value={this.state.provider.providerNumber} handleInputChange={this.handleInputChange} validate="numbersOnly" required={true} />
						</div>
						<div className="form-group small-12 medium-4 columns">
							<label className="required">SSN or EIN</label>
							<Select name="identifierType" value={this.state.provider.identifierType} handleInputChange={this.handleInputChange} required={true}>
								<option value="">--Select--</option>
								<option value="ssn">SSN</option>
								<option value="ein">EIN</option>
							</Select>
						</div>
						<div className="form-group small-12 medium-4 columns">
							<label className="required">Identifier (SSN/EIN)</label>
							<Input type="text" name="identifier" value={this.state.provider.identifier} handleInputChange={this.handleInputChange} validate="numbersOnly" required={true} />
						</div>
					</div>
					<div className="row">
						<div className="form-group small-12 medium-4 columns">
							<label className="required">Email</label>
							<Input type="text" name="email" value={this.state.provider.email} handleInputChange={this.handleInputChange} validate="email" required={true} />
						</div>
						<div className="form-group small-12 medium-4 columns">
							<label className="required">Phone Number</label>
							<Input type="text" name="phone" value={this.state.provider.phone} handleInputChange={this.handleInputChange} validate="domesticPhone" required={true} />
						</div>
						<div className="form-group small-12 medium-4 columns">
							<label className="required">Active/Inactive</label>
							<Select name="state" value={this.state.provider.state} handleInputChange={this.handleInputChange} required={true}>
								<option value="">--Select--</option>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</Select>
						</div>
					</div>
				</Form>
			</div>
		);
	}
}

export default connect(null, mapDispatchToProps)(ProviderEditPage);
