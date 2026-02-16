import { Store } from '@/modules/base/entrypoint/store';
import { Policy } from './records/policy';
import { Term } from './records/term';

export interface TermStore extends Store<Term> {}

export interface PolicyStore extends Store<Policy> {}
