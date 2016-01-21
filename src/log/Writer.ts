/// <reference path="../../typings/node" />
import {Channel} from './Channel';
import {Message} from './Message';

/**
 * Log writers.
 */
export class Writer {
	public getLogMessages(): Message[] {
		return [].concat(this.messages);
	}
	
	
	public pipeLogMessagesTo(target: Writer | NodeJS.WritableStream): void {
		if (target instanceof Writer) {
			this.pipeLogMessagesToOtherLogWriter(target);
		} else {
			this.pipeLogMessagesToStream(<NodeJS.WritableStream>target);
		}
	}
	
	
	public toString(): string {
		return this.messages.join('\n');
	}
	
	
	/**
	 * Appends a single log message to the log.
	 */
	public async appendToLog(message: Message): Promise<void> {
		if (!(message instanceof Message)) {
			return;
		}
		this.messages.push(message);
		if (this.pipeTargetWriters && this.pipeTargetWriters.length > 0) {
			this.pipeTargetWriters.forEach(targetLog => targetLog.appendToLog(message));
		}
		if (this.pipeTargetStreams && this.pipeTargetStreams.length > 0) {
			this.pipeTargetStreams.forEach(targetStream => targetStream.write(message.toString() + '\n'));
		}
	}
	
	
	/**
	 * Logs a message to a certain channel.
	 * @param channel The channel to log the message to.
	 * @param message The message to log.
	 */
	public async logMessage(channel: Channel, ...message: string[]): Promise<void> {
		await this.appendToLog(this.createMessage(channel, message.join('')));
	}
	
	
	protected createMessage(channel: Channel, messageText: string): Message {
		return Message.createWithText(messageText).setChannel(channel);
	}
	
	
	private pipeLogMessagesToStream(stream: NodeJS.WritableStream): void {
		if (this.pipeTargetStreams && this.pipeTargetStreams.length > 0 && this.pipeTargetStreams.indexOf(stream) === -1) {
			this.pipeTargetStreams.push(stream);
		} else {
			this.pipeTargetStreams = [stream];
		}
	}
	
	
	private pipeLogMessagesToOtherLogWriter(log: Writer): void {
		if (log === this) {
			throw new Error("Can not pipe log messages to self.");
		}
		
		if (this.pipeTargetWriters && this.pipeTargetWriters.length > 0 && this.pipeTargetWriters.indexOf(log) === -1) {
			this.pipeTargetWriters.push(log);
		} else {
			this.pipeTargetWriters = [log];
		}
	}
	
	
	private messages: Message[] = [];
	
	
	private pipeTargetStreams: NodeJS.WritableStream[];
	
	
	private pipeTargetWriters: Writer[];
}