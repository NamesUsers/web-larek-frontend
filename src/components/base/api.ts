export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...(options.headers as object ?? {})
			}
		};
	}

	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else return response.json()
			.then(data => Promise.reject(data.error ?? response.statusText));
	}

    private buildUrl(uri: string): string {
        const cleanBase = this.baseUrl.replace(/\/+$/, '');
        const cleanUri = uri.replace(/^\/+/, '');
        const fullUrl = `${cleanBase}/${cleanUri}`;
        return fullUrl;
    }


	get<T>(uri: string): Promise<T> {
		return fetch(this.buildUrl(uri), {
			...this.options,
			method: 'GET'
		}).then((res) => this.handleResponse(res) as Promise<T>);
	}

	post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<unknown> {
		return fetch(this.buildUrl(uri), {
			...this.options,
			method,
			body: JSON.stringify(data)
		}).then((res) => this.handleResponse(res));
	}
}
