import { TokenizerEvent, ErrorStrategy } from './types';
export type XmlEvent = TokenizerEvent;
/**
 * L2 XmlProcessor — maintains XML tag stack and validates open/close matching.
 * Passes through tokenizer events with stack context.
 */
export declare class XmlProcessor {
    private tagStack;
    private eventQueue;
    private errorStrategy;
    constructor(errorStrategy?: ErrorStrategy);
    /** Push a L1 event into the processor */
    push(event: TokenizerEvent): void;
    /** Pull next L2 event */
    pull(): XmlEvent | null;
    /** Current tag stack depth */
    get depth(): number;
    /** Top of tag stack (null if empty) */
    get topTag(): string | null;
    /** Signal end of input. Handle unclosed tags. */
    end(): void;
    /** Reset processor state */
    reset(): void;
    private handleElementOpen;
    private handleElementClose;
}
