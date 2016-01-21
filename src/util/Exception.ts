export abstract class Exception<TCode extends number> extends Error {
	constructor(private code: TCode, private _message: string) {
		super(_message);
	}
	
	
	public static extend<TCode extends number>(codeEnumerator: { [code: number]: string; }) {
		return class ExtendedException extends Exception<TCode> {
			protected getCodeEnumerator() {
				return codeEnumerator;
			}
		};
	}
	
	
	/**
	 * The exception code.
	 */
	public getCode(): TCode {
		return this.code;
	}
	
	
	/**
	 * The exception code name.
	 */
	public getCodeName(): string {
		return this.getCodeEnumerator()[<any>this.getCode()];
	}
	
	
	/**
	 * The exception message.
	 */
	public getMessage(): string {
		return this._message;
	}
	
	
	public toString(): string {
		return `${this.constructor.name} '${this.getCodeName()}' (${this.getCode()}): ${this.getMessage()}`;
	}
	
	
	protected abstract getCodeEnumerator(): { [code: number]: string; };
}