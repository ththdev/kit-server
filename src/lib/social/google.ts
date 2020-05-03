import { google } from 'googleapis'

export const getGoogleProfile =  async (access_token) => {
	const people = google.people('v1');
	const res = await people.people.get({
		access_token: access_token,
		resourceName: 'people/me',
		personFields: 'names,emailAddresses,photos,phoneNumbers,genders,birthdays'
	});
	
	return res
}