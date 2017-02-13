'use strict';

import React from 'react';
import { connect } from 'react-redux';
import Animation from 'react-addons-css-transition-group';
import ProviderCard from './ProviderCard';

const ProviderList = ({providers}) => (
	<div className="row">
		<Animation transitionName="fade" transitionAppear={false} transitionEnter={true} transitionEnterTimeout={250} transitionLeave={true} transitionLeaveTimeout={250}>
			{providers.map((provider, i) => <ProviderCard key={i} {...provider}></ProviderCard>)}
		</Animation>
	</div>
)

export default ProviderList;
