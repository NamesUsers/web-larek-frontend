export class AppStateModel {
	private selectedProductId: string | null = null;

	selectProduct(id: string) {
		this.selectedProductId = id;
	}

	getSelectedProduct(): string | null {
		return this.selectedProductId;
	}
}
