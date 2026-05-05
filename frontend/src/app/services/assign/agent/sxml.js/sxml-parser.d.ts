import { SxmlConfig, SxmlResult } from './types';
export declare class SxmlParser {
    private tokenizer;
    private xmlProcessor;
    private tagHandlers;
    private events;
    private pendingText;
    private tagStack;
    private resultQueue;
    private pendingResolve;
    private ended;
    private consumerLen;
    private confirmAtOpenSet;
    private lastConfirmStable;
    constructor(config: SxmlConfig);
    get isEnd(): boolean;
    get lastConfirm(): boolean;
    write(chunk: string): void;
    end(): void;
    reset(): void;
    pull(): Promise<SxmlResult | null>;
    tryPull(): SxmlResult | null;
    private processTokenizerEvents;
    /** Redirect pendingText to the confirm-at-open biz event at stack top. */
    private flushTextToConfirmAtOpen;
    private flushL2Events;
    private handleL2Event;
    private handleElementOpen;
    private handleElementClose;
    /** Resolve a tag that never received its own close tag (mismatch recovery) */
    private resolveTagAsUnclosed;
    private handleSelfClose;
    private resolveTag;
    /**
     * Extract text children from the merged text event.
     * The text between `>` of opening tag and `<` of closing tag is the text content.
     */
    private extractTextChildren;
    private endOpenTags;
    private extractEndTextChildren;
    private commitPendingText;
    private truncateTextAt;
    private makeUpdate;
    /** Create a snapshot copy of an event so results are immutable */
    private cloneEvent;
    private cloneTextUpdateOrClear;
    /** Emit a text result: tells consumer a text event was created or updated */
    private emitTextResult;
    /** Emit a resolve result: text truncated + business event appended */
    private emitResolveResult;
    private flushPendingTextOutput;
    private emitResult;
    private dequeueResult;
    private resolvePendingIfReady;
}
