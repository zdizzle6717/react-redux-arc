'use strict';

const checkAuthorization = (accessControl, user, roleConfig) => {
	let userFlags = user.roleFlags || 0;
	let accessFlags = 0;
	accessControl.forEach((roleName) => {
		roleConfig.forEach((role) => {
			if (role.name === roleName) {
				accessFlags += role.roleFlags;
			}
		});
	});

	let hasFlags = (flags, mask) => {
		flags = parseInt(flags, 10);
		mask = parseInt(mask, 10);

		return (mask & flags) === mask;
	};

	let accessGranted = hasFlags(userFlags, accessFlags) && userFlags !== 0;

	return accessGranted;
}

export default checkAuthorization;
