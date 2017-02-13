'use strict';

import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Animation from 'react-addons-css-transition-group';
import ProviderList from '../pieces/ProviderList';
import ProviderActions from '../../actions/ProviderActions';
import isEmpty from '../../library/utilities/isEmpty';

const mapStateToProps = (state) => {
    return {'providers': state.providers}
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'getAllProviders': ProviderActions.getAll,
		'filterProviders': ProviderActions.filter
    }, dispatch)
};

class ProviderListPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            'providers': []
        }
        this.handleSort = this.handleSort.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

	// Initialize data for server side rendering
	static fetchData(config) {
		return config.store.dispatch(ProviderActions.getAll());
	}

    componentDidMount() {
        document.title = "Sandbox | Providers";
		this.props.getAllProviders();
		this.setState({
			'providers': this.props.providers
		})
    }

	handleSort(e) {
        let searchParam = e.target.value;
        let providers = [...this.props.providers];
        let newOrder = providers.sort(function(a, b) {
            a = a[searchParam].toLowerCase();
            b = b[searchParam].toLowerCase();
            if (a < b)
                return -1;
            if (a > b)
                return 1;
            return 0;
        });
        this.props.filterProviders(newOrder);
		this.setState({'providers': this.props.providers});
    }

    handleFilter(e) {
        let searchParam = e.target.value.toLowerCase();
        let providers = [...this.props.providers];
        let filteredProviders = providers.filter((provider) => {
            if (JSON.stringify(provider).toLowerCase().indexOf(searchParam.toLowerCase()) > -1) {
                return true;
            } else {
                return false;
            };
        });
        this.setState({'providers': filteredProviders});
    }

    render() {
        return (
            <div className="row">
                <h1 className="push-bottom-2x">Providers</h1>
                <div className="row">
                    <div className="small-12 medium-4 large-4 columns">
                        <Link key="providerCreate" to="/providers/create" className="button small-12 large-6">
                            <i className="fa fa-plus"></i>
                            Add New Provider</Link>
                    </div>
                    <div className="small-12 medium-4 large-4 columns medium-offset-4 large-offset-4">
                        <div className="search-input">
                            <input type="search" placeholder="Enter search terms..." onChange={this.handleFilter}/>
                            <span className="fa fa-search search-icon"></span>
                        </div>
                    </div>
                </div>
                <ProviderList providers={this.state.providers}/>
                <div className="row">
                    <div className="small-12 medium-6 large-3 medium-offset-6 large-offset-9 columns text-right">
                        <label>Sort by:
                            <select id="orderParams" defaultValue="createdAt" onChange={this.handleSort}>
                                <option value="name">Name (ascending)</option>
                                <option value="email">Email (ascending)</option>
                                <option value="phone">Phone (ascending)</option>
                                <option value="createdAt">Date Created (ascending)</option>
                                <option value="updatedAt">Last Updated (ascending)</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderListPage);
