'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';
import FormActions from '../actions/FormActions';

const mapStateToProps = (state) => {
	return {
		'forms': state.forms
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		'resetForm': FormActions.resetForm
	}, dispatch)
}

class Form extends React.Component {
	constructor() {
        super();

		this.state = {
			valid: false
		}

		this.handleSubmit = this.handleSubmit.bind(this);
    }

	componentWillMount() {
		if (!this.props.isParent && this.props.childForms) {
			throw new Error('Form component cannot have children without also being a parent.')
		}
	}

	componentDidMount() {
		// This component will mount before the previous form's Input components unmount and are cleared from the Form Store
		// This accounts for a route change with the same formName on both routes, preventing overlapping inputs
		if (this.props.isParent) {
			if (this.props.childForms) {
				this.props.childForms.forEach((formName) => {
					this.props.resetForm(formName);
				})
			}
			this.props.resetForm(this.props.name);
		}
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.handleSubmit(e);
	}

	render() {
		let formIsValid = this.props.forms[this.props.name] ? this.props.forms[this.props.name].isValid : false;
		return (
			<div>
				{
					this.props.isParent ?
					<form className={this.props.customClass ? `form ${this.props.customClass}` : 'form'} name={this.props.name} noValidate>
						{this.props.children}
						{
							this.props.submitButton &&
							<div className="row">
								<div className="form-group small-12 columns text-right">
									<button className="button info" onClick={this.handleSubmit} disabled={this.props.validity !== undefined ? !this.props.validity : !formIsValid}>{this.props.submitText}</button>
								</div>
							</div>
						}
					</form> :
					<div className={this.props.customClass ? `form ${this.props.customClass}` : 'form'} name={this.props.name} noValidate>
						{this.props.children}
						{
							this.props.submitButton &&
							<div className="row">
								<div className="form-group small-12 columns text-right">
									<button className="button info" onClick={this.handleSubmit} disabled={this.props.validity !== undefined ? !this.props.validity : !formIsValid}>{this.props.submitText}</button>
								</div>
							</div>
						}
					</div>
				}
			</div>

		);
	}
}

Form.propTypes = {
	name: React.PropTypes.string.isRequired,
	handleSubmit: React.PropTypes.func,
	submitButton: React.PropTypes.bool,
	submitText: React.PropTypes.string,
	isParent: React.PropTypes.bool,
	childForms: React.PropTypes.array,
	validity: React.PropTypes.bool,
	customClass: React.PropTypes.string
}

Form.defaultProps = {
	submitButton: true,
	submitText: 'Submit',
	isParent: true
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
