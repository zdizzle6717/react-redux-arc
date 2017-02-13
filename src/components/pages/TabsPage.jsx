'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import axios from 'axios';
import {Link, browserHistory} from 'react-router';
import {TabGroup, Tab} from '../../library/tabs';
import {AlertActions} from '../../library/alerts';
import {getFormErrorCount, Form, Input, Select, TextArea, CheckBox, RadioGroup, FileUpload} from '../../library/validations';
import ContactActions from '../../actions/ContactActions';

const mapStateToProps = (state) => {
	return {
		'forms': state.forms
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		'addAlert': AlertActions.addAlert,
		'getContact': ContactActions.get,
		'createContact': ContactActions.create,
		'updateContact': ContactActions.update
	}, dispatch);
};

class TabsPage extends React.Component {
    constructor() {
        super();

        this.state = {
            'contact': {
				'Files': []
			},
			'files': [],
            'newContact': false
        }

		this.handleFileUpload = this.handleFileUpload.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.showAlert = this.showAlert.bind(this);
    }

    componentDidMount() {
        document.title = "Sandbox | Tabs Page";
		if (this.props.params.contactId) {
			this.props.getContact(this.props.params.contactId).then((contact) => {
				this.setState({
					'contact': contact
				})
			}).catch(() => {
				this.showAlert('contactNotFound');
				browserHistory.push('/contacts');
			});
		} else {
			this.setState({
				'newContact': true
			});
		}
    }

	handleInputChange(e) {
		let contact = this.state.contact;
		contact[e.target.name] = e.target.value;
		this.setState({
			'contact': contact
		});
	}

	handleRadioChange(name, e) {
		let contact = this.state.contact;
		let value = e.target.value;
		contact[name] = value;
		this.setState({
			'contact': contact
		});
	}

	handleCheckBoxChange(e) {
		let contact = this.state.contact;
		let name = e.target.name;
		let value = contact[name] || false;
		contact[name] = !value;
		this.setState({
			'contact': contact
		});
	}

	handleFileUpload(files) {
		let contact = this.state.contact;
		this.uploadFiles(files).then((responses) => {
			responses = responses.map((response, i) => {
				response = {
					'name': response.data.file.name,
					'size': response.data.file.size,
					'type': response.data.file.type
				};
				return response;
			})
			return responses;
		}).then((files) => {
			contact.Files = files;
			this.setState({
				'contact': contact
			});
		});
	}

	uploadFiles(files) {
		let promises = [];
		files.forEach((file) => {
			let data = new FormData();
			let config = {
					onUploadProgress: function(progressEvent) {
						let percentCompleted = progressEvent.loaded / progressEvent.total;
					}
				}
			data.append('file', file);
			promises.push(axios.post('/files/contacts/' + file.size, data, config));
		});

		return axios.all(promises);
	}

	handleSubmit(e) {
		let contact = this.state.contact;
		if (this.state.newContact) {
			this.props.createContact(contact).then((response) => {
				this.showAlert('contactCreated');
				browserHistory.push('/contacts');
			});
		} else {
			this.props.updateContact(contact.id, contact).then(() => {
				this.showAlert('contactUpdated');
				browserHistory.push('/contacts');
			});
		}
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
			},
			'contactCreated': () => {
				this.props.addAlert({
					'title': 'Contact Created',
					'message': 'A new contact was successfully created.',
					'type': 'success',
					'delay': 3000
				});
			},
			'contactUpdated': () => {
				this.props.addAlert({
					'title': 'Contact Updated',
					'message': `${this.state.contact.firstName} ${this.state.contact.lastName} was updated successfully.`,
					'type': 'success',
					'delay': 3000
				});
			}
		}

		return alerts[selector]();
	}

    render() {
		let firstTabErrorCount = getFormErrorCount(this.props.forms, 'firstTabForm');
		let secondTabErrorCount = getFormErrorCount(this.props.forms, 'secondTabForm');
		let thirdTabErrorCount = getFormErrorCount(this.props.forms, 'thirdTabForm');
		let parentFormValidity = firstTabErrorCount + secondTabErrorCount + thirdTabErrorCount < 1;
        return (
			<div className="row">
				<h1 className="push-bottom-2x">Tabs</h1>
				<hr />
				<div className="small-12 columns">
					<Form name="contactForm" submitText={this.state.newContact ? 'Save Contact' : 'Update Contact'} handleSubmit={this.handleSubmit} childForms={['firstTabForm', 'secondTabForm', 'thirdTabForm']} validity={parentFormValidity}>
						<TabGroup>
							<Tab name="firstTab" title="First Tab" errorCount={firstTabErrorCount}>
								<div>Tab 1 Content</div>
								<Form name="firstTabForm" submitButton={false} isParent={false}>
									<div className="row">
										<div className="form-group small-12 medium-3 columns">
											<label className="required">First Name</label>
											<Input type="text" name="firstName" value={this.state.contact.firstName} handleInputChange={this.handleInputChange} validate="name" required={true} preserveState={true}/>
										</div>
										<div className="form-group small-12 medium-3 columns">
											<label className="required">Middle Name</label>
											<Input type="text" name="middleName" value={this.state.contact.middleName} handleInputChange={this.handleInputChange} validate="name" required={true} preserveState={true}/>
										</div>
										<div className="form-group small-12 medium-3 columns">
											<label className="required">Last Name</label>
											<Input type="text" name="lastName" value={this.state.contact.lastName} handleInputChange={this.handleInputChange} validate="name" required={true} preserveState={true}/>
										</div>
										<div className="form-group small-12 medium-3 columns">
											<label className="required">Gender</label>
											<Select name="gender" value={this.state.contact.gender} handleInputChange={this.handleInputChange} required={true} preserveState={true}>
												<option value="">--Select--</option>
												<option value="male">Male</option>
												<option value="female">Female</option>
											</Select>
										</div>
									</div>
								</Form>
							</Tab>
							<Tab name="secondTab" title="Second Tab" errorCount={secondTabErrorCount}>
								<div>Tab 2 Content</div>
								<Form name="secondTabForm" submitButton={false} isParent={false}>
									<div className="row">
										<div className="form-group small-12 medium-3 columns">
											<label className="required">Email</label>
											<Input type="text" name="email" value={this.state.contact.email} handleInputChange={this.handleInputChange} validate="email" required={true} preserveState={true}/>
										</div>
										<div className="form-group small-12 medium-3 columns">
											<label className="required">Mobile Phone</label>
											<Input type="text" name="mobilePhone" value={this.state.contact.mobilePhone} handleInputChange={this.handleInputChange} validate="domesticPhone" required={true} preserveState={true}/>
										</div>
										<div className="form-group small-12 medium-3 columns">
											<label className="required">Fax</label>
											<Input type="text" name="fax" value={this.state.contact.fax} handleInputChange={this.handleInputChange} validate="domesticPhone" required={true} preserveState={true}/>
										</div>
										<div className="form-group small-12 medium-3 columns">
											<label className="required">Type</label>
											<Select name="type" value={this.state.contact.type} handleInputChange={this.handleInputChange} required={true} preserveState={true}>
												<option value="">--Select--</option>
												<option value="contact">Contact</option>
												<option value="user">User</option>
											</Select>
										</div>
									</div>
								</Form>
							</Tab>
							<Tab name="thirdTab" title="Third Tab" errorCount={thirdTabErrorCount}>
								<div>Tab 3 Content</div>
								<Form name="thirdTabForm" submitButton={false} isParent={false}>
									<div className="row">
										<div className="form-group small-12 medium-6 columns">
											<label className="required">Profile Picture</label>
											<FileUpload name="profilePicture" value={this.state.contact.Files} handleFileUpload={this.handleFileUpload} typeOfModel="array" maxFiles={2} required={1} preserveState={true}/>
										</div>
									</div>
									<div className="row">
										<div className="form-group small-12 medium-3 columns">
											<CheckBox name="status" value={this.state.contact.status} handleInputChange={this.handleCheckBoxChange} label="Active Contact?" required={true} preserveState={true}/>
										</div>
										<div className="form-group small-12 medium-3 columns">
											<RadioGroup name="maritalStatus" value={this.state.contact.maritalStatus} handleInputChange={this.handleRadioChange.bind(this, 'maritalStatus')} label="Marital Status" options={['single', 'married', 'other']} preserveState={true}/>
										</div>
									</div>
								</Form>
							</Tab>
						</TabGroup>
						<div className="small-12 columns push-top-2x">
						</div>
					</Form>
				</div>
			</div>
		);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsPage);
