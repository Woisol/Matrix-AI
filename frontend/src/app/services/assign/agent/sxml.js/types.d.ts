/** Legal tag configuration: string = confirmAt:'close'; object = explicit mode */
export type LegalTagConfig = string | {
    name: string;
    confirmAt: 'open' | 'close';
};
/** Error handling strategy */
export declare enum ErrorStrategy {
    /** Throw on XML syntax errors (for testing) */
    STRICT = "strict",
    /** Skip erroneous characters, emit error events, continue parsing (default) */
    LENIENT = "lenient",
    /** Skip erroneous characters silently (for high-performance scenarios) */
    SILENT = "silent"
}
/** Parser configuration */
export interface SxmlConfig {
    /**
     * Whitelist of legal tag names.
     * Each entry can be a plain string (defaults to confirmAt:'close') or
     * an object specifying the tag name and when to confirm:
     *   - confirmAt:'close' (default) — emit business event when </tag> is seen
     *   - confirmAt:'open' — emit a partial business event as soon as <tag> is seen,
     *     then update it with content as text streams in, finalizing at </tag>
     *
     * When omitted, falls back to tagCharPattern regex validation.
     */
    legalTags?: LegalTagConfig[];
    /**
     * Regex for valid tag name characters.
     * Only used when legalTags is not provided.
     * @default /^[a-zA-Z0-9_\-.:]$/
     */
    tagCharPattern?: RegExp;
    /**
     * Tag-to-business-event converters (optional overrides).
     * Tags in legalTags use DefaultTagHandler when no explicit handler is configured:
     *   → { type: tagName, name: tagName, ...attributes, content: "textContent" }
     */
    tagHandlers?: Record<string, TagHandler>;
    /**
     * Max buffer size in bytes.
     * @default 1048576 (1MB)
     */
    maxBufferSize?: number;
    /**
     * Error handling strategy.
     * @default ErrorStrategy.LENIENT
     */
    errorStrategy?: ErrorStrategy;
    /**
     * Max nesting depth for tag parsing.
     * 0 = only parse root tags; 1 = root + direct children; etc.
     * Tags beyond this depth keep raw XML as text.
     * @default 1
     */
    maxNestingDepth?: number;
}
/** Default values for optional config fields */
export declare const DEFAULT_CONFIG: Required<Omit<SxmlConfig, 'legalTags' | 'tagCharPattern' | 'tagHandlers'>>;
export declare const DEFAULT_TAG_CHAR_PATTERN: RegExp;
/** TagHandler — builds business events from closed XML elements */
export interface TagHandler {
    build(tagName: string, attributes: Record<string, string>, children: SxmlEvent[]): SxmlEvent | null;
}
/** Public event type */
export type SxmlEvent = TextEvent | BusinessEvent;
/** Text event */
export interface TextEvent {
    type: 'text';
    content: string;
}
/** Business event (produced by TagHandler.build()) */
export interface BusinessEvent {
    type: string;
    [key: string]: unknown;
}
/** Incremental patch returned by pull() / tryPull() */
export interface SxmlResult {
    /** Replace the last event in the consumer's event list. null clears it. */
    update?: SxmlEvent | null;
    /** Append to the consumer's event list (0..N items) */
    append: SxmlEvent[];
}
/** L1 Tokenizer event — confirmed XML syntax events */
export type TokenizerEvent = {
    type: 'text';
    content: string;
} | {
    type: 'elementOpen';
    name: string;
    attributes: Record<string, string>;
} | {
    type: 'elementClose';
    name: string;
} | {
    type: 'selfClose';
    name: string;
    attributes: Record<string, string>;
} | {
    type: 'error';
    message: string;
};
/** Internal: L1 event with buffer position for text interleaving */
export type TokenizerEventWithPos = TokenizerEvent & {
    _bufferPos: number;
};
/** L1 Tokenizer states */
export declare enum TokenizerState {
    TEXT = "TEXT",
    TAG_SUSPECTED = "TAG_SUSPECTED",
    TAG_NAME = "TAG_NAME",
    AFTER_NAME = "AFTER_NAME",
    ATTR_NAME = "ATTR_NAME",
    BEFORE_ATTR_EQ = "BEFORE_ATTR_EQ",
    ATTR_VALUE_START = "ATTR_VALUE_START",
    ATTR_VALUE_DQ = "ATTR_VALUE_DQ",
    ATTR_VALUE_SQ = "ATTR_VALUE_SQ",
    BEFORE_CLOSE = "BEFORE_CLOSE",
    CLOSE_TAG_NAME = "CLOSE_TAG_NAME"
}
/** L3 internal: entry in the open-tag stack */
export interface OpenTagEntry {
    name: string;
    attributes: Record<string, string>;
    /** Index in shadowEvents where children start */
    childrenStartIndex: number;
    /** Index of the text event containing the raw XML for this tag */
    rawTextEventIndex: number;
    /** Character offset within that text event where the tag's raw text starts ('<') */
    rawTextStartOffset: number;
    /** Length of the full opening tag text (e.g. "<tagname attr="val">") */
    openTagLength: number;
    /** Nesting depth of this tag */
    depth: number;
    /** Pending child business events (for DefaultTagHandler absorption) */
    pendingChildren: SxmlEvent[];
    /** Whether this tag uses the default handler */
    useDefaultHandler: boolean;
    /** For confirmAt='open': the index of the partial biz event in the consumer's event list (-1 = close mode) */
    bizEventConsumerIndex: number;
}
