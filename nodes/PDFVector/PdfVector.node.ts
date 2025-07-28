import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	NodeConnectionType,
} from 'n8n-workflow';

export class PdfVector implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PDFVector',
		name: 'pdfVector',
		icon: 'file:icon.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with PDFVector API for academic search and document parsing',
		defaults: {
			name: 'PDFVector',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'pdfVectorApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Academic',
						value: 'academic',
					},
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Key',
						value: 'key',
					},
				],
				default: 'academic',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['academic'],
					},
				},
				options: [
					{
						name: 'Search',
						value: 'search',
						description: 'Search academic publications',
						action: 'Search academic publications',
					},
					{
						name: 'Fetch',
						value: 'fetch',
						description: 'Fetch a specific publication',
						action: 'Fetch a specific publication',
					},
				],
				default: 'search',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Parse',
						value: 'parse',
						description: 'Parse a PDF or Word document',
						action: 'Parse a document',
					},
					{
						name: 'Upload',
						value: 'upload',
						description: 'Get a temporary upload URL',
						action: 'Get temporary upload URL',
					},
				],
				default: 'parse',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['key'],
					},
				},
				options: [
					{
						name: 'Validate',
						value: 'validate',
						description: 'Validate API key',
						action: 'Validate API key',
					},
				],
				default: 'validate',
			},
			// Academic Search Parameters
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				default: '',
				description: 'Search query for academic publications',
			},
			{
				displayName: 'Providers',
				name: 'providers',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				options: [
					{
						name: 'ArXiv',
						value: 'arxiv',
					},
					{
						name: 'ERIC',
						value: 'eric',
					},
					{
						name: 'Google Scholar',
						value: 'google-scholar',
					},
					{
						name: 'PubMed',
						value: 'pubmed',
					},
					{
						name: 'Semantic Scholar',
						value: 'semantic-scholar',
					},
				],
				default: ['semantic-scholar'],
				description: 'Database providers to search',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Number of results to skip per provider',
			},
			{
				displayName: 'Year From',
				name: 'yearFrom',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				typeOptions: {
					minValue: 1900,
				},
				default: 1900,
				description: 'Filter results published after this year (inclusive)',
			},
			{
				displayName: 'Year To',
				name: 'yearTo',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				typeOptions: {
					maxValue: 2100,
				},
				default: 2050,
				description: 'Filter results published before this year (inclusive)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Fields',
						name: 'fields',
						type: 'multiOptions',
						options: [
							{
								name: 'Abstract',
								value: 'abstract',
							},
							{
								name: 'Authors',
								value: 'authors',
							},
							{
								name: 'Date',
								value: 'date',
							},
							{
								name: 'DOI',
								value: 'doi',
							},
							{
								name: 'PDF URL',
								value: 'pdfURL',
							},
							{
								name: 'Provider',
								value: 'provider',
							},
							{
								name: 'Provider Data',
								value: 'providerData',
							},
							{
								name: 'Provider URL',
								value: 'providerURL',
							},
							{
								name: 'Title',
								value: 'title',
							},
							{
								name: 'Total Citations',
								value: 'totalCitations',
							},
							{
								name: 'Total References',
								value: 'totalReferences',
							},
							{
								name: 'URL',
								value: 'url',
							},
							{
								name: 'Year',
								value: 'year',
							},
						],
						default: [],
						description: 'Fields to include in the response',
					},
				],
			},
			// Academic Fetch Parameters
			{
				displayName: 'IDs',
				name: 'ids',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['fetch'],
					},
				},
				default: '',
				description: 'Publication IDs (DOI, PubMed ID, ArXiv ID, etc.). Separate multiple IDs with commas.',
				placeholder: '10.1038/nature12373, PMC3883140, arXiv:1234.5678',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['fetch'],
					},
				},
				options: [
					{
						name: 'Abstract',
						value: 'abstract',
					},
					{
						name: 'Authors',
						value: 'authors',
					},
					{
						name: 'Date',
						value: 'date',
					},
					{
						name: 'DOI',
						value: 'doi',
					},
					{
						name: 'PDF URL',
						value: 'pdfURL',
					},
					{
						name: 'Provider',
						value: 'provider',
					},
					{
						name: 'Provider Data',
						value: 'providerData',
					},
					{
						name: 'Provider URL',
						value: 'providerURL',
					},
					{
						name: 'Title',
						value: 'title',
					},
					{
						name: 'Total Citations',
						value: 'totalCitations',
					},
					{
						name: 'Total References',
						value: 'totalReferences',
					},
					{
						name: 'URL',
						value: 'url',
					},
					{
						name: 'Year',
						value: 'year',
					},
				],
				default: [],
				description: 'Fields to include in the response',
			},
			// Document Parse Parameters
			{
				displayName: 'Document URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['parse'],
					},
				},
				default: '',
				description: 'URL of the document to parse',
			},
			{
				displayName: 'Use LLM',
				name: 'useLLM',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['parse'],
					},
				},
				options: [
					{
						name: 'Auto',
						value: 'auto',
						description: 'Automatically decide if LLM parsing is needed (1-2 credits per page)',
					},
					{
						name: 'Always',
						value: 'always',
						description: 'Always use LLM parsing (2 credits per page)',
					},
					{
						name: 'Never',
						value: 'never',
						description: 'Never use LLM parsing (1 credit per page)',
					},
				],
				default: 'auto',
				description: 'Determines LLM parsing approach',
			},
			// Document Upload Parameters
			{
				displayName: 'File Type',
				name: 'fileType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['upload'],
					},
				},
				options: [
					{
						name: 'PDF',
						value: 'pdf',
					},
					{
						name: 'Word',
						value: 'docx',
					},
				],
				default: 'pdf',
				description: 'Type of file to upload',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				const baseURL = 'https://www.pdfvector.com/v1/api';

				if (resource === 'academic') {
					if (operation === 'search') {
						const query = this.getNodeParameter('query', i);
						const providers = this.getNodeParameter('providers', i);
						const limit = this.getNodeParameter('limit', i);
						const offset = this.getNodeParameter('offset', i);
						const yearFrom = this.getNodeParameter('yearFrom', i);
						const yearTo = this.getNodeParameter('yearTo', i);
						const additionalFields = this.getNodeParameter('additionalFields', i);

						const body: any = {
							query,
							providers,
							limit,
							offset,
							yearFrom,
							yearTo,
						};

						// Add fields from additional fields
						if (additionalFields.fields && Array.isArray(additionalFields.fields) && additionalFields.fields.length > 0) {
							body.fields = additionalFields.fields;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'pdfVectorApi',
							{
								method: 'POST' as IHttpRequestMethods,
								url: `${baseURL}/academic-search`,
								body,
								json: true,
							},
						);
					} else if (operation === 'fetch') {
						const idsString = this.getNodeParameter('ids', i);
						const fields = this.getNodeParameter('fields', i);

						// Convert comma-separated IDs to array and trim whitespace
						const ids = String(idsString).split(',').map(id => id.trim()).filter(id => id);

						const body: any = {
							ids,
						};

						if (fields && Array.isArray(fields) && fields.length > 0) {
							body.fields = fields;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'pdfVectorApi',
							{
								method: 'POST' as IHttpRequestMethods,
								url: `${baseURL}/academic-fetch`,
								body,
								json: true,
							},
						);
					}
				} else if (resource === 'document') {
					if (operation === 'parse') {
						const url = this.getNodeParameter('url', i);
						const useLLM = this.getNodeParameter('useLLM', i);

						const body: any = {
							url,
							useLLM,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'pdfVectorApi',
							{
								method: 'POST' as IHttpRequestMethods,
								url: `${baseURL}/parse`,
								body,
								json: true,
							},
						);
					} else if (operation === 'upload') {
						const fileType = this.getNodeParameter('fileType', i);

						const body = {
							fileType,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'pdfVectorApi',
							{
								method: 'POST' as IHttpRequestMethods,
								url: `${baseURL}/temporary-upload`,
								body,
								json: true,
							},
						);
					}
				} else if (resource === 'key') {
					if (operation === 'validate') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'pdfVectorApi',
							{
								method: 'GET' as IHttpRequestMethods,
								url: `${baseURL}/validate-key`,
								json: true,
							},
						);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}