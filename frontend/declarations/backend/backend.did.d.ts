import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface SearchHistory { 'timestamp' : bigint, 'symbol' : string }
export interface _SERVICE {
  'addSearch' : ActorMethod<[string], undefined>,
  'getSearchHistory' : ActorMethod<[], Array<SearchHistory>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
