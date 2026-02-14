export type MessageType = `${string}:${string}`;
export const MessageType = (value: string) => value as MessageType;

export class Message<TMessageType extends MessageType = MessageType> {
  constructor(public readonly type: TMessageType) {}
}

export type EventType = MessageType;
export const EventType = MessageType;

export class Event<TEventType extends EventType = EventType> extends Message<TEventType> {}

export type CommandType = MessageType;
export const CommandType = MessageType;

export class Command<TCommandType extends CommandType = CommandType> extends Message<TCommandType> {}

export type QueryType = MessageType;
export const QueryType = MessageType;

export class Query<TQueryType extends QueryType = QueryType> extends Message<TQueryType> {}

export type ErrorType = MessageType;
export const ErrorType = MessageType;

export class Error<TErrorType extends ErrorType = ErrorType> extends Message<TErrorType> {}
