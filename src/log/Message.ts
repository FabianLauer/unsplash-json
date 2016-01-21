import {Channel} from './Channel';

/**
 * Log messages. These messages are aggregated by instances of class `Writer`.
 */
export class Message {
	public static createWithText(text: string): Message {
		var message = new this();
		message.text = text;
		return message;
	}
	
	
	public getTime(): Date {
		if (this.timestamp instanceof Date) {
			return new Date(this.timestamp.getTime());
		}
		return undefined;
	}
	
	
	public getChannel(): Channel {
		return this.channel;
	}
	
	
	public setChannel(channel: Channel): Message {
		this.channel = channel;
		return this;
	}
	
	
	public getText(): string {
		return this.text;
	}
	
	
	public toString(): string {
		return `${Message.formatDateTime(this.timestamp)} (${Message.logChannelToString(this.channel)}): ${this.text}`;
	}
	
	
	private static formatDateTime(date: Date): string {
		const seconds = `${date.getSeconds() < 10 ? '0' : ''}${date.getSeconds()}`;
		return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${seconds}`;
	}
	
	
	private static logChannelToString(channel: Channel): string {
		return Channel[channel];
	}
	
	
	private timestamp = new Date();
	
	
	private text: string;
	
	
	private channel: Channel;
}