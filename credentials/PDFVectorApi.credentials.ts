import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PDFVectorApi implements ICredentialType {
	name = 'pdfVectorApi';
	displayName = 'PDFVector API';
	documentationUrl = 'https://www.pdfvector.com/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your PDFVector API key (format: pdfvector_xxxxxxxxxxxxxxxx). You can get it from https://www.pdfvector.com/api-keys.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiKey}}',
			},
		},
	};
}
