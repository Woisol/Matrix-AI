/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 48
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SxmlParser = void 0;
const types_1 = __webpack_require__(411);
const tokenizer_1 = __webpack_require__(123);
const xml_processor_1 = __webpack_require__(306);
const DefaultTagHandler = {
    build(tagName, attributes, children) {
        const content = children
            .filter(c => c.type === 'text')
            .map(c => c.content)
            .join('');
        const nestedAttrs = {};
        for (const c of children) {
            if (c.type !== 'text') {
                const be = c;
                nestedAttrs[be.type] = be.content ?? '';
            }
        }
        return {
            type: tagName,
            name: tagName,
            ...attributes,
            ...nestedAttrs,
            content,
        };
    },
};
class SxmlParser {
    constructor(config) {
        this.events = [];
        this.pendingText = '';
        this.tagStack = [];
        this.resultQueue = [];
        this.pendingResolve = null;
        this.ended = false;
        this.consumerLen = 0; // how many events consumer has seen
        this.confirmAtOpenSet = new Set();
        this.lastConfirmStable = false;
        this.tagHandlers = config.tagHandlers ?? {};
        // Normalize legalTags: extract tag names for tokenizer, track confirmAt:'open' entries
        const tagNames = [];
        if (config.legalTags) {
            for (const entry of config.legalTags) {
                if (typeof entry === 'string') {
                    tagNames.push(entry);
                }
                else {
                    tagNames.push(entry.name);
                    if (entry.confirmAt === 'open') {
                        this.confirmAtOpenSet.add(entry.name);
                    }
                }
            }
        }
        this.tokenizer = new tokenizer_1.Tokenizer(tagNames.length > 0 ? tagNames : undefined, config.tagCharPattern, config.maxBufferSize ?? types_1.DEFAULT_CONFIG.maxBufferSize, config.errorStrategy ?? types_1.DEFAULT_CONFIG.errorStrategy, config.maxNestingDepth ?? types_1.DEFAULT_CONFIG.maxNestingDepth);
        this.xmlProcessor = new xml_processor_1.XmlProcessor(config.errorStrategy ?? types_1.DEFAULT_CONFIG.errorStrategy);
    }
    // ============================================================
    // Public API
    // ============================================================
    get isEnd() {
        return this.ended;
    }
    get lastConfirm() {
        return this.lastConfirmStable;
    }
    write(chunk) {
        if (this.ended)
            return;
        this.tokenizer.write(chunk);
        this.processTokenizerEvents();
        this.resolvePendingIfReady();
    }
    end() {
        if (this.ended)
            return;
        this.ended = true;
        this.tokenizer.end();
        this.processTokenizerEvents();
        this.xmlProcessor.end();
        this.flushL2Events();
        this.endOpenTags();
        this.resolvePendingIfReady();
    }
    reset() {
        this.tokenizer.reset();
        this.xmlProcessor.reset();
        this.events = [];
        this.pendingText = '';
        this.tagStack = [];
        this.resultQueue = [];
        this.pendingResolve = null;
        this.ended = false;
        this.consumerLen = 0;
        this.lastConfirmStable = false;
    }
    async pull() {
        const result = this.tryPull();
        if (result !== null)
            return result;
        if (this.ended && this.resultQueue.length === 0)
            return null;
        return new Promise(resolve => {
            this.pendingResolve = resolve;
        });
    }
    tryPull() {
        this.processTokenizerEvents();
        if (this.resultQueue.length > 0) {
            return this.dequeueResult();
        }
        return this.flushPendingTextOutput();
    }
    // ============================================================
    // Core pipeline — interleaved flush + L1→L2→L3
    // ============================================================
    processTokenizerEvents() {
        let l1Event;
        while ((l1Event = this.tokenizer.pull()) !== null) {
            // Flush text up to this event's position in the buffer
            const bufferPos = l1Event._bufferPos ?? 0;
            const flushed = this.tokenizer.flushUpTo(bufferPos);
            if (flushed) {
                this.pendingText += flushed;
            }
            // Feed to L2 (without _bufferPos)
            const cleanEvent = { ...l1Event };
            delete cleanEvent._bufferPos;
            this.xmlProcessor.push(cleanEvent);
            // Immediately process L2 output
            this.flushL2Events();
            // After each L2 event, flush any pending text into confirm-at-open tag
            this.flushTextToConfirmAtOpen();
        }
        // Flush any remaining text
        const flushed = this.tokenizer.flushPendingText();
        if (flushed) {
            this.pendingText += flushed;
        }
        this.flushTextToConfirmAtOpen();
    }
    /** Redirect pendingText to the confirm-at-open biz event at stack top. */
    flushTextToConfirmAtOpen() {
        if (this.pendingText.length === 0)
            return;
        if (this.tagStack.length === 0)
            return;
        const top = this.tagStack[this.tagStack.length - 1];
        if (top.bizEventConsumerIndex < 0)
            return;
        const bizIdx = top.childrenStartIndex - 1;
        if (bizIdx < 0 || bizIdx >= this.events.length)
            return;
        const be = this.events[bizIdx];
        be.content = (be.content || '') + this.pendingText;
        this.pendingText = '';
        // Emit an update so the consumer sees the live content
        this.emitResult({ update: this.cloneEvent(be), append: [] }, false);
    }
    flushL2Events() {
        let l2Event;
        while ((l2Event = this.xmlProcessor.pull()) !== null) {
            this.handleL2Event(l2Event);
        }
    }
    // ============================================================
    // L2 event dispatch
    // ============================================================
    handleL2Event(event) {
        switch (event.type) {
            case 'text':
                // L2 text events: add to pendingText (no tag boundaries)
                this.pendingText += event.content;
                break;
            case 'elementOpen':
                this.handleElementOpen(event.name, event.attributes);
                break;
            case 'elementClose':
                this.handleElementClose(event.name);
                break;
            case 'selfClose':
                this.handleSelfClose(event.name, event.attributes);
                break;
            case 'error':
                break;
        }
    }
    // ============================================================
    // Tag handlers
    // ============================================================
    handleElementOpen(name, attributes) {
        // pendingText includes everything since last event, e.g. "text<before<tagname>"
        // Find where '<' of this tag sits in pendingText
        const tagIdx = this.pendingText.indexOf('<');
        const pendingLen = this.pendingText.length;
        let rawTextStartOffset;
        let openTagLength;
        let result;
        if (tagIdx >= 0) {
            // '<' found in current pendingText
            openTagLength = pendingLen - tagIdx;
            result = this.commitPendingText();
            rawTextStartOffset = result.offset + tagIdx;
        }
        else {
            // '<' was committed in a previous flush (or there's no pending text).
            // Search backwards in the last text event for the '<'.
            const lastIdx = this.events.length - 1;
            const lastEv = lastIdx >= 0 ? this.events[lastIdx] : null;
            result = this.commitPendingText();
            if (lastEv && lastEv.type === 'text') {
                const lastContent = lastEv.content;
                // content before pendingText was appended: first {result.offset} chars
                const ltPos = lastContent.lastIndexOf('<', result.offset - 1);
                if (ltPos >= 0) {
                    rawTextStartOffset = ltPos;
                    openTagLength = (result.offset - ltPos) + pendingLen;
                }
                else {
                    rawTextStartOffset = result.offset;
                    openTagLength = pendingLen;
                }
            }
            else {
                rawTextStartOffset = result.offset;
                openTagLength = pendingLen;
            }
        }
        const entry = {
            name,
            attributes: { ...attributes },
            childrenStartIndex: this.events.length,
            rawTextEventIndex: result.eventIndex,
            rawTextStartOffset,
            openTagLength,
            depth: this.tagStack.length,
            pendingChildren: [],
            useDefaultHandler: !this.tagHandlers[name],
            bizEventConsumerIndex: -1,
        };
        // Confirm-at-open: emit partial biz event immediately if not being absorbed
        const shouldEmitPartial = this.confirmAtOpenSet.has(name) &&
            !(this.tagStack.length > 0 &&
                this.tagStack[this.tagStack.length - 1].useDefaultHandler &&
                entry.useDefaultHandler);
        if (shouldEmitPartial) {
            // Build partial business event with empty children
            const handler = this.tagHandlers[name] ?? DefaultTagHandler;
            const partialBiz = handler.build(name, { ...attributes }, []);
            if (partialBiz) {
                // Only truncate if we're actually emitting the partial
                this.truncateTextAt(result.eventIndex, rawTextStartOffset);
                this.events.push(partialBiz);
                entry.childrenStartIndex = this.events.length; // children start AFTER partial
                // Emit text truncation update + partial biz append
                const append = [];
                let update;
                if (this.consumerLen === 0 && result.eventIndex >= 0) {
                    // First event ever — append text (if non-empty) before partial biz
                    const te = this.events[result.eventIndex];
                    if (te.type === 'text' && te.content.length > 0) {
                        append.push(this.cloneEvent(te));
                    }
                }
                else if (result.eventIndex >= 0 && result.eventIndex < this.consumerLen) {
                    // Consumer already has this text event — update it
                    update = this.cloneTextUpdateOrClear(this.events[result.eventIndex]);
                }
                else if (result.eventIndex >= this.consumerLen && result.eventIndex < this.events.length) {
                    // New text event consumer hasn't seen — append it
                    const te = this.events[result.eventIndex];
                    if (te.type === 'text' && te.content.length > 0) {
                        append.push(this.cloneEvent(te));
                    }
                }
                append.push(this.cloneEvent(partialBiz));
                // Record where think lands in consumer's list:
                //   event update replaces one item, null update removes one item, then append runs
                //   no update appends everything after the current consumer length
                const consumerLenAfterUpdate = update === undefined
                    ? this.consumerLen
                    : update === null
                        ? this.consumerLen - 1
                        : this.consumerLen;
                entry.bizEventConsumerIndex = consumerLenAfterUpdate + append.length - 1;
                this.emitResult({ update, append }, false);
                this.consumerLen = this.events.length;
                this.tagStack.push(entry);
                return;
            }
            // Handler returned null — fall through to normal confirm-at-close behavior
        }
        this.tagStack.push(entry);
        // Tell consumer about the new/updated text
        this.emitTextResult(result);
    }
    handleElementClose(name) {
        // For confirm-at-open tags: text between <tag> and </tag> was accumulated
        // via flushTextToConfirmAtOpen.  The pendingText flush for this close
        // event may still include "</tagname>" at the end — strip it.
        const top = this.tagStack.length > 0 ? this.tagStack[this.tagStack.length - 1] : null;
        if (top && top.name === name && top.bizEventConsumerIndex >= 0) {
            const closeLen = `</${name}>`.length;
            if (this.pendingText.length >= closeLen) {
                // Strip close tag text from the end; any remaining text before it
                // gets redirected to the biz event
                const textBefore = this.pendingText.slice(0, -closeLen);
                if (textBefore.length > 0) {
                    const bizIdx = top.childrenStartIndex - 1;
                    this.events[bizIdx].content =
                        (this.events[bizIdx].content || '') + textBefore;
                }
            }
            this.pendingText = '';
        }
        else {
            this.commitPendingText();
        }
        // Find matching open tag
        let entryIdx = -1;
        for (let i = this.tagStack.length - 1; i >= 0; i--) {
            if (this.tagStack[i].name === name) {
                entryIdx = i;
                break;
            }
        }
        if (entryIdx < 0)
            return;
        // Resolve any inner tags (above the matching entry) as unclosed first.
        // They never received their own close tag (mismatch scenario).
        const closeTagLength = `</${name}>`.length;
        while (this.tagStack.length - 1 > entryIdx) {
            const inner = this.tagStack.pop();
            this.resolveTagAsUnclosed(inner, closeTagLength);
        }
        // Resolve the matching entry with its correct close name
        const matched = this.tagStack.pop();
        this.resolveTag(matched, name);
    }
    /** Resolve a tag that never received its own close tag (mismatch recovery) */
    resolveTagAsUnclosed(entry, outerCloseTagLength) {
        // Confirm-at-open path
        if (entry.bizEventConsumerIndex >= 0) {
            const partialIdx = entry.childrenStartIndex - 1;
            const accumulatedText = this.events[partialIdx].content || '';
            const allChildren = [
                ...(accumulatedText ? [{ type: 'text', content: accumulatedText }] : []),
                ...this.events.slice(entry.childrenStartIndex),
                ...entry.pendingChildren,
            ];
            this.events.splice(entry.childrenStartIndex);
            const handler = this.tagHandlers[entry.name] ?? DefaultTagHandler;
            const bizEvent = handler.build(entry.name, entry.attributes, allChildren);
            if (!bizEvent)
                return;
            if (this.tagStack.length > 0) {
                const parent = this.tagStack[this.tagStack.length - 1];
                if (parent.useDefaultHandler && entry.useDefaultHandler) {
                    parent.pendingChildren.push(bizEvent);
                    this.events[partialIdx] = bizEvent;
                    this.emitResult({ update: this.cloneEvent(bizEvent), append: [] }, true);
                    this.consumerLen = this.events.length;
                    return;
                }
            }
            this.events[partialIdx] = bizEvent;
            this.emitResult({ update: this.cloneEvent(bizEvent), append: [] }, true);
            this.consumerLen = this.events.length;
            return;
        }
        // Normal path
        const textChildren = this.extractEndTextChildren(entry, outerCloseTagLength);
        const allChildren = [
            ...textChildren,
            ...this.events.slice(entry.childrenStartIndex),
            ...entry.pendingChildren,
        ];
        this.truncateTextAt(entry.rawTextEventIndex, entry.rawTextStartOffset);
        this.events.splice(entry.childrenStartIndex);
        const handler = this.tagHandlers[entry.name] ?? DefaultTagHandler;
        const bizEvent = handler.build(entry.name, entry.attributes, allChildren);
        if (!bizEvent)
            return;
        if (this.tagStack.length > 0) {
            const parent = this.tagStack[this.tagStack.length - 1];
            if (parent.useDefaultHandler && entry.useDefaultHandler) {
                parent.pendingChildren.push(bizEvent);
                this.emitResolveResult(entry.rawTextEventIndex, null, true);
                return;
            }
        }
        this.events.push(bizEvent);
        this.emitResolveResult(entry.rawTextEventIndex, bizEvent, false, true);
    }
    handleSelfClose(name, attributes) {
        // Find where '<' of this tag sits in pendingText (like handleElementOpen)
        const tagIdx = this.pendingText.indexOf('<');
        const tagOffsetInPending = tagIdx >= 0 ? tagIdx : 0;
        const result = this.commitPendingText();
        const rawTextStartOffset = result.offset + tagOffsetInPending;
        // Truncate at the position where the self-closing tag starts
        this.truncateTextAt(result.eventIndex, rawTextStartOffset);
        // Remove the text event if it's now empty (e.g. consecutive self-closing tags)
        let textEventIndex = result.eventIndex;
        if (textEventIndex >= 0 && textEventIndex < this.events.length) {
            const ev = this.events[textEventIndex];
            if (ev.type === 'text' && ev.content === '') {
                this.events.splice(textEventIndex, 1);
                this.consumerLen = Math.min(this.consumerLen, this.events.length);
                textEventIndex = -1;
            }
        }
        const handler = this.tagHandlers[name] ?? DefaultTagHandler;
        const bizEvent = handler.build(name, attributes, []);
        if (bizEvent) {
            this.events.push(bizEvent);
            this.emitResolveResult(textEventIndex, bizEvent, false, true);
        }
    }
    // ============================================================
    // Tag resolution
    // ============================================================
    resolveTag(entry, closeName) {
        // Confirm-at-open: text already accumulated in bizEvent.content via flushPendingTextOutput.
        // Replace the partial biz event with the full one, emit update (not append).
        if (entry.bizEventConsumerIndex >= 0) {
            const partialIdx = entry.childrenStartIndex - 1;
            // Pull accumulated text from the partial biz event and feed it to the handler
            const accumulatedText = this.events[partialIdx].content || '';
            const allChildren = [
                ...(accumulatedText ? [{ type: 'text', content: accumulatedText }] : []),
                ...this.events.slice(entry.childrenStartIndex),
                ...entry.pendingChildren,
            ];
            this.events.splice(entry.childrenStartIndex);
            const handler = this.tagHandlers[entry.name] ?? DefaultTagHandler;
            const bizEvent = handler.build(entry.name, entry.attributes, allChildren);
            if (!bizEvent)
                return;
            const parentDepth = this.tagStack.length;
            if (parentDepth > 0) {
                const parent = this.tagStack[this.tagStack.length - 1];
                if (parent.useDefaultHandler && entry.useDefaultHandler) {
                    parent.pendingChildren.push(bizEvent);
                    this.events[partialIdx] = bizEvent;
                    this.emitResult({ update: this.cloneEvent(bizEvent), append: [] }, true);
                    this.consumerLen = this.events.length;
                    return;
                }
            }
            this.events[partialIdx] = bizEvent;
            this.emitResult({ update: this.cloneEvent(bizEvent), append: [] }, true);
            this.consumerLen = this.events.length;
            return;
        }
        // --- normal confirm-at-close path ---
        const closeTagLength = `</${closeName}>`.length;
        const textChildren = this.extractTextChildren(entry, closeTagLength);
        // Combine with pending children (from absorbed sub-tags)
        const allChildren = [
            ...textChildren,
            ...this.events.slice(entry.childrenStartIndex),
            ...entry.pendingChildren,
        ];
        // Truncate the main text event
        this.truncateTextAt(entry.rawTextEventIndex, entry.rawTextStartOffset);
        // Remove children region
        this.events.splice(entry.childrenStartIndex);
        // Build business event
        const handler = this.tagHandlers[entry.name] ?? DefaultTagHandler;
        const bizEvent = handler.build(entry.name, entry.attributes, allChildren);
        if (!bizEvent)
            return;
        const parentDepth = this.tagStack.length;
        if (parentDepth > 0) {
            const parent = this.tagStack[this.tagStack.length - 1];
            if (parent.useDefaultHandler && entry.useDefaultHandler) {
                parent.pendingChildren.push(bizEvent);
                this.emitResolveResult(entry.rawTextEventIndex, null, true);
                return;
            }
        }
        this.events.push(bizEvent);
        this.emitResolveResult(entry.rawTextEventIndex, bizEvent, false, true);
    }
    /**
     * Extract text children from the merged text event.
     * The text between `>` of opening tag and `<` of closing tag is the text content.
     */
    extractTextChildren(entry, closeTagLength) {
        if (entry.rawTextEventIndex < 0 || entry.rawTextEventIndex >= this.events.length)
            return [];
        const textEvent = this.events[entry.rawTextEventIndex];
        if (textEvent.type !== 'text')
            return [];
        const content = textEvent.content;
        const contentStart = entry.rawTextStartOffset + entry.openTagLength;
        const contentEnd = content.length - closeTagLength;
        if (contentStart >= contentEnd)
            return [];
        const childText = content.substring(contentStart, contentEnd);
        if (childText.length > 0) {
            return [{ type: 'text', content: childText }];
        }
        return [];
    }
    endOpenTags() {
        while (this.tagStack.length > 0) {
            const entry = this.tagStack.pop();
            // Confirm-at-open path — text already in bizEvent.content
            if (entry.bizEventConsumerIndex >= 0) {
                const partialIdx = entry.childrenStartIndex - 1;
                const accumulatedText = this.events[partialIdx].content || '';
                const allChildren = [
                    ...(accumulatedText ? [{ type: 'text', content: accumulatedText }] : []),
                    ...this.events.slice(entry.childrenStartIndex),
                    ...entry.pendingChildren,
                ];
                this.events.splice(entry.childrenStartIndex);
                const handler = this.tagHandlers[entry.name] ?? DefaultTagHandler;
                const bizEvent = handler.build(entry.name, entry.attributes, allChildren);
                if (!bizEvent)
                    continue;
                if (this.tagStack.length > 0) {
                    const parent = this.tagStack[this.tagStack.length - 1];
                    if (parent.useDefaultHandler && entry.useDefaultHandler) {
                        parent.pendingChildren.push(bizEvent);
                        this.events[partialIdx] = bizEvent;
                        this.emitResult({ update: this.cloneEvent(bizEvent), append: [] }, true);
                        this.consumerLen = this.events.length;
                        continue;
                    }
                }
                this.events[partialIdx] = bizEvent;
                this.emitResult({ update: this.cloneEvent(bizEvent), append: [] }, true);
                this.consumerLen = this.events.length;
                continue;
            }
            // Normal path
            const textChildren = this.extractEndTextChildren(entry);
            const allChildren = [
                ...textChildren,
                ...this.events.slice(entry.childrenStartIndex),
                ...entry.pendingChildren,
            ];
            this.truncateTextAt(entry.rawTextEventIndex, entry.rawTextStartOffset);
            this.events.splice(entry.childrenStartIndex);
            const handler = this.tagHandlers[entry.name] ?? DefaultTagHandler;
            const bizEvent = handler.build(entry.name, entry.attributes, allChildren);
            if (!bizEvent)
                continue;
            if (this.tagStack.length > 0) {
                const parent = this.tagStack[this.tagStack.length - 1];
                if (parent.useDefaultHandler && entry.useDefaultHandler) {
                    parent.pendingChildren.push(bizEvent);
                    this.emitResolveResult(entry.rawTextEventIndex, null, true);
                    continue;
                }
            }
            this.events.push(bizEvent);
            this.emitResolveResult(entry.rawTextEventIndex, bizEvent, false, true);
        }
    }
    extractEndTextChildren(entry, outerCloseTagLength) {
        if (entry.rawTextEventIndex < 0 || entry.rawTextEventIndex >= this.events.length)
            return [];
        const textEvent = this.events[entry.rawTextEventIndex];
        if (textEvent.type !== 'text')
            return [];
        const content = textEvent.content;
        const contentStart = entry.rawTextStartOffset + entry.openTagLength;
        const contentEnd = outerCloseTagLength !== undefined
            ? content.length - outerCloseTagLength
            : content.length;
        if (contentStart >= contentEnd)
            return [];
        const childText = content.substring(contentStart, contentEnd);
        if (childText.length > 0) {
            return [{ type: 'text', content: childText }];
        }
        return [];
    }
    // ============================================================
    // Text helpers
    // ============================================================
    commitPendingText() {
        if (this.pendingText.length === 0) {
            const lastIdx = this.events.length - 1;
            if (lastIdx >= 0 && this.events[lastIdx].type === 'text') {
                return { eventIndex: lastIdx, offset: this.events[lastIdx].content.length };
            }
            return { eventIndex: -1, offset: 0 };
        }
        const lastIdx = this.events.length - 1;
        let eventIndex;
        let offset;
        if (lastIdx >= 0 && this.events[lastIdx].type === 'text') {
            const te = this.events[lastIdx];
            offset = te.content.length;
            te.content += this.pendingText;
            eventIndex = lastIdx;
        }
        else {
            offset = 0;
            eventIndex = this.events.length;
            this.events.push({ type: 'text', content: this.pendingText });
        }
        this.pendingText = '';
        return { eventIndex, offset };
    }
    truncateTextAt(eventIndex, offset) {
        if (eventIndex < 0 || eventIndex >= this.events.length)
            return;
        const ev = this.events[eventIndex];
        if (ev.type !== 'text')
            return;
        ev.content = ev.content.substring(0, offset);
    }
    makeUpdate(eventIndex) {
        if (eventIndex < 0 || eventIndex >= this.events.length)
            return undefined;
        const ev = this.events[eventIndex];
        if (ev.type === 'text') {
            return { type: 'text', content: ev.content };
        }
        return undefined;
    }
    // ============================================================
    // Output helpers
    // ============================================================
    /** Create a snapshot copy of an event so results are immutable */
    cloneEvent(ev) {
        // return structuredClone(ev);
        if (ev.type === 'text') {
            return { type: 'text', content: ev.content };
        }
        return { ...ev };
    }
    cloneTextUpdateOrClear(event) {
        if (event.type !== 'text')
            return this.cloneEvent(event);
        return event.content.length === 0 ? null : this.cloneEvent(event);
    }
    /** Emit a text result: tells consumer a text event was created or updated */
    emitTextResult(commit) {
        if (commit.eventIndex < 0)
            return;
        if (this.consumerLen === 0 && this.events.length > 0) {
            // Consumer hasn't seen any events yet — use append for the first one
            this.emitResult({ append: [this.cloneEvent(this.events[0])] }, false);
            this.consumerLen = 1;
        }
        else if (commit.eventIndex < this.consumerLen) {
            // Consumer already has this event — use update
            this.emitResult({ update: this.cloneEvent(this.events[commit.eventIndex]), append: [] }, false);
        }
        else {
            // New event consumer hasn't seen
            this.emitResult({ append: [this.cloneEvent(this.events[commit.eventIndex])] }, false);
            this.consumerLen = this.events.length;
        }
    }
    /** Emit a resolve result: text truncated + business event appended */
    emitResolveResult(textEventIndex, bizEvent, appendOnly = false, lastConfirm = false) {
        const append = [];
        let update = undefined;
        // Determine whether the text event at textEventIndex should be
        // sent as an update (replaces consumer's last event) or as append.
        if (textEventIndex >= 0 && textEventIndex < this.events.length) {
            const textEv = this.events[textEventIndex];
            const textContent = textEv.type === 'text' ? textEv.content : '';
            if (textEventIndex < this.consumerLen) {
                // Consumer already knows about this text event.
                // Only use update if no business events were emitted
                // between this text event and the consumer's cursor —
                // otherwise the update would overwrite a biz event.
                let blocked = false;
                for (let i = textEventIndex + 1; i < this.consumerLen && i < this.events.length; i++) {
                    if (this.events[i].type !== 'text') {
                        blocked = true;
                        break;
                    }
                }
                if (!blocked) {
                    update = this.cloneTextUpdateOrClear(textEv);
                }
                else if (textContent.length > 0) {
                    append.push(this.cloneEvent(textEv));
                }
            }
            else if (textContent.length > 0) {
                // Consumer hasn't seen this event yet — append it
                append.push(this.cloneEvent(textEv));
            }
        }
        if (bizEvent)
            append.push(bizEvent);
        if (appendOnly) {
            this.emitResult({ update, append: [] }, lastConfirm);
        }
        else {
            this.emitResult({ update, append }, lastConfirm);
        }
        this.consumerLen = this.events.length;
    }
    // ============================================================
    // Output
    // ============================================================
    flushPendingTextOutput() {
        if (this.pendingText.length === 0)
            return null;
        // If a confirm-at-open tag is at stack top, redirect text to its biz event content
        if (this.tagStack.length > 0) {
            const top = this.tagStack[this.tagStack.length - 1];
            if (top.bizEventConsumerIndex >= 0) {
                const bizIdx = top.childrenStartIndex - 1;
                if (bizIdx >= 0 && bizIdx < this.events.length) {
                    const be = this.events[bizIdx];
                    be.content = (be.content || '') + this.pendingText;
                    const result = { update: this.cloneEvent(be), append: [] };
                    this.pendingText = '';
                    this.lastConfirmStable = false;
                    return result;
                }
            }
        }
        const lastIdx = this.events.length - 1;
        if (lastIdx >= 0 && this.events[lastIdx].type === 'text' && this.consumerLen > lastIdx) {
            // Consumer has the last event — extend it
            const te = this.events[lastIdx];
            te.content += this.pendingText;
            const result = { update: { type: 'text', content: te.content }, append: [] };
            this.pendingText = '';
            this.lastConfirmStable = false;
            return result;
        }
        else {
            // New event
            const te = { type: 'text', content: this.pendingText };
            this.pendingText = '';
            this.events.push(te);
            this.consumerLen = this.events.length;
            this.lastConfirmStable = false;
            return { append: [this.cloneEvent(te)] };
        }
    }
    emitResult(result, lastConfirm = false) {
        if (result.update === undefined && result.append.length === 0)
            return;
        this.resultQueue.push({ result, lastConfirm });
    }
    dequeueResult() {
        const queued = this.resultQueue.shift();
        this.lastConfirmStable = queued.lastConfirm;
        return queued.result;
    }
    resolvePendingIfReady() {
        if (!this.pendingResolve)
            return;
        const resolve = this.pendingResolve;
        this.pendingResolve = null;
        if (this.resultQueue.length > 0) {
            resolve(this.dequeueResult());
        }
        else {
            const flushed = this.flushPendingTextOutput();
            if (flushed) {
                resolve(flushed);
            }
            else if (this.ended) {
                resolve(null);
            }
            else {
                this.pendingResolve = resolve;
            }
        }
    }
}
exports.SxmlParser = SxmlParser;


/***/ },

/***/ 123
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tokenizer = void 0;
const types_1 = __webpack_require__(411);
class Tokenizer {
    constructor(legalTags, tagCharPattern, maxBufferSize, errorStrategy, maxNestingDepth) {
        this.legalTags = null;
        this.tagCharPattern = types_1.DEFAULT_TAG_CHAR_PATTERN;
        this.maxBufferSize = 1048576;
        this.maxNestingDepth = 1;
        this.state = types_1.TokenizerState.TEXT;
        this.buffer = '';
        this.flushedIndex = 0;
        this.eventQueue = [];
        this.tagName = '';
        this.attrName = '';
        this.attrValue = '';
        this.attributes = {};
        this.depth = 0;
        this.ended = false;
        // ============================================================
        // #region State handlers
        // ============================================================
        this.suspectStartPos = -1; // buffer position where '<' was seen
        if (legalTags && legalTags.length > 0)
            this.legalTags = legalTags;
        if (tagCharPattern)
            this.tagCharPattern = tagCharPattern;
        if (maxBufferSize !== undefined)
            this.maxBufferSize = maxBufferSize;
        if (maxNestingDepth !== undefined)
            this.maxNestingDepth = maxNestingDepth;
        // errorStrategy is used by L2, not L1 directly
    }
    write(chunk) {
        if (this.ended)
            return;
        for (let i = 0; i < chunk.length; i++) {
            const ch = chunk[i];
            this.buffer += ch;
            if (this.buffer.length > this.maxBufferSize) {
                throw new Error(`Buffer size exceeded ${this.maxBufferSize} bytes.`);
            }
            this.processChar(ch);
        }
    }
    end() {
        if (this.ended)
            return;
        this.ended = true;
        // Flush any text in suspect state
        if (this.state === types_1.TokenizerState.TAG_SUSPECTED ||
            this.state === types_1.TokenizerState.TAG_NAME ||
            this.state === types_1.TokenizerState.AFTER_NAME ||
            this.state === types_1.TokenizerState.ATTR_NAME ||
            this.state === types_1.TokenizerState.BEFORE_ATTR_EQ ||
            this.state === types_1.TokenizerState.ATTR_VALUE_START ||
            this.state === types_1.TokenizerState.ATTR_VALUE_DQ ||
            this.state === types_1.TokenizerState.ATTR_VALUE_SQ ||
            this.state === types_1.TokenizerState.BEFORE_CLOSE ||
            this.state === types_1.TokenizerState.CLOSE_TAG_NAME) {
            this.state = types_1.TokenizerState.TEXT;
        }
    }
    reset() {
        this.state = types_1.TokenizerState.TEXT;
        this.buffer = '';
        this.flushedIndex = 0;
        this.eventQueue = [];
        this.tagName = '';
        this.attrName = '';
        this.attrValue = '';
        this.attributes = {};
        this.depth = 0;
        this.ended = false;
    }
    pull() {
        return this.eventQueue.shift() ?? null;
    }
    /** Flush text from last flush point up to the given buffer position */
    flushUpTo(bufferPos) {
        if (bufferPos <= this.flushedIndex)
            return '';
        const text = this.buffer.substring(this.flushedIndex, bufferPos);
        this.flushedIndex = bufferPos;
        return text;
    }
    flushPendingText() {
        const newText = this.buffer.substring(this.flushedIndex);
        this.flushedIndex = this.buffer.length;
        return newText;
    }
    isInTagSuspect() {
        return (this.state === types_1.TokenizerState.TAG_SUSPECTED ||
            this.state === types_1.TokenizerState.TAG_NAME ||
            this.state === types_1.TokenizerState.AFTER_NAME ||
            this.state === types_1.TokenizerState.ATTR_NAME ||
            this.state === types_1.TokenizerState.BEFORE_ATTR_EQ ||
            this.state === types_1.TokenizerState.ATTR_VALUE_START ||
            this.state === types_1.TokenizerState.ATTR_VALUE_DQ ||
            this.state === types_1.TokenizerState.ATTR_VALUE_SQ ||
            this.state === types_1.TokenizerState.BEFORE_CLOSE ||
            this.state === types_1.TokenizerState.CLOSE_TAG_NAME);
    }
    currentDepth() {
        return this.depth;
    }
    setMaxNestingDepth(depth) {
        this.maxNestingDepth = depth;
    }
    // ============================================================
    // #region Character dispatch
    // ============================================================
    processChar(ch) {
        switch (this.state) {
            case types_1.TokenizerState.TEXT:
                this.handleText(ch);
                break;
            case types_1.TokenizerState.TAG_SUSPECTED:
                this.handleTagSuspect(ch);
                break;
            case types_1.TokenizerState.TAG_NAME:
                this.handleTagName(ch);
                break;
            case types_1.TokenizerState.AFTER_NAME:
                this.handleAfterName(ch);
                break;
            case types_1.TokenizerState.ATTR_NAME:
                this.handleAttrName(ch);
                break;
            case types_1.TokenizerState.BEFORE_ATTR_EQ:
                this.handleBeforeAttrEq(ch);
                break;
            case types_1.TokenizerState.ATTR_VALUE_START:
                this.handleAttrValueStart(ch);
                break;
            case types_1.TokenizerState.ATTR_VALUE_DQ:
                this.handleAttrValueDQ(ch);
                break;
            case types_1.TokenizerState.ATTR_VALUE_SQ:
                this.handleAttrValueSQ(ch);
                break;
            case types_1.TokenizerState.BEFORE_CLOSE:
                this.handleBeforeClose(ch);
                break;
            case types_1.TokenizerState.CLOSE_TAG_NAME:
                this.handleCloseTagName(ch);
                break;
        }
    }
    handleText(ch) {
        if (ch === '<') {
            this.suspectStartPos = this.buffer.length - 1; // position of '<'
            this.state = types_1.TokenizerState.TAG_SUSPECTED;
        }
    }
    handleTagSuspect(ch) {
        if (ch === '/') {
            // Close tags are always allowed (they decrement depth)
            this.state = types_1.TokenizerState.CLOSE_TAG_NAME;
            this.tagName = '';
        }
        else if (this.isNameChar(ch)) {
            if (this.depth <= this.maxNestingDepth) {
                this.tagName = ch;
                this.state = types_1.TokenizerState.TAG_NAME;
            }
            else {
                this.state = types_1.TokenizerState.TEXT;
            }
        }
        else {
            this.state = types_1.TokenizerState.TEXT;
        }
    }
    handleTagName(ch) {
        if (ch === '>') {
            if (this.validateTagName()) {
                this.emitElementOpen();
            }
            else {
                this.state = types_1.TokenizerState.TEXT;
            }
        }
        else if (ch === '/') {
            this.state = types_1.TokenizerState.BEFORE_CLOSE;
        }
        else if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            if (this.tagName.length === 0) {
                this.state = types_1.TokenizerState.TEXT;
                return;
            }
            this.state = types_1.TokenizerState.AFTER_NAME;
        }
        else if (this.isNameChar(ch)) {
            this.tagName += ch;
            if (this.legalTags && !this.matchesPrefix(this.tagName)) {
                this.state = types_1.TokenizerState.TEXT;
            }
        }
        else {
            this.state = types_1.TokenizerState.TEXT;
        }
    }
    handleAfterName(ch) {
        if (ch === '>') {
            if (this.validateTagName()) {
                this.emitElementOpen();
            }
            else {
                this.state = types_1.TokenizerState.TEXT;
            }
        }
        else if (ch === '/') {
            this.state = types_1.TokenizerState.BEFORE_CLOSE;
        }
        else if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            // skip whitespace
        }
        else if (this.isNameChar(ch)) {
            this.attrName = ch;
            this.state = types_1.TokenizerState.ATTR_NAME;
        }
        else {
            this.state = types_1.TokenizerState.TEXT;
        }
    }
    handleAttrName(ch) {
        if (ch === '=') {
            this.state = types_1.TokenizerState.ATTR_VALUE_START;
        }
        else if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            this.state = types_1.TokenizerState.BEFORE_ATTR_EQ;
        }
        else if (ch === '>') {
            if (this.attrName)
                this.attributes[this.attrName] = '';
            if (this.validateTagName()) {
                this.emitElementOpen();
            }
            else {
                this.state = types_1.TokenizerState.TEXT;
            }
        }
        else if (this.isNameChar(ch)) {
            this.attrName += ch;
        }
        else {
            this.state = types_1.TokenizerState.TEXT;
        }
    }
    handleBeforeAttrEq(ch) {
        if (ch === '=') {
            this.state = types_1.TokenizerState.ATTR_VALUE_START;
        }
        else if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            // skip
        }
        else if (this.isNameChar(ch)) {
            if (this.attrName)
                this.attributes[this.attrName] = '';
            this.attrName = ch;
            this.state = types_1.TokenizerState.ATTR_NAME;
        }
        else if (ch === '>') {
            if (this.attrName)
                this.attributes[this.attrName] = '';
            if (this.validateTagName()) {
                this.emitElementOpen();
            }
            else {
                this.state = types_1.TokenizerState.TEXT;
            }
        }
        else {
            this.state = types_1.TokenizerState.TEXT;
        }
    }
    handleAttrValueStart(ch) {
        if (ch === '"') {
            this.attrValue = '';
            this.state = types_1.TokenizerState.ATTR_VALUE_DQ;
        }
        else if (ch === "'") {
            this.attrValue = '';
            this.state = types_1.TokenizerState.ATTR_VALUE_SQ;
        }
        else if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            this.state = types_1.TokenizerState.BEFORE_ATTR_EQ;
        }
        else if (ch === '>') {
            if (this.validateTagName()) {
                this.emitElementOpen();
            }
            else {
                this.state = types_1.TokenizerState.TEXT;
            }
        }
        else {
            this.state = types_1.TokenizerState.TEXT;
        }
    }
    handleAttrValueDQ(ch) {
        if (ch === '"') {
            this.attributes[this.attrName] = this.attrValue;
            this.attrName = '';
            this.attrValue = '';
            this.state = types_1.TokenizerState.AFTER_NAME;
        }
        else {
            this.attrValue += ch;
        }
    }
    handleAttrValueSQ(ch) {
        if (ch === "'") {
            this.attributes[this.attrName] = this.attrValue;
            this.attrName = '';
            this.attrValue = '';
            this.state = types_1.TokenizerState.AFTER_NAME;
        }
        else {
            this.attrValue += ch;
        }
    }
    handleBeforeClose(ch) {
        if (ch === '>') {
            if (this.validateTagName()) {
                this.emitSelfClose();
            }
            else {
                this.state = types_1.TokenizerState.TEXT;
            }
        }
        else if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            // <tag /> — space before /> allowed
        }
        else {
            this.state = types_1.TokenizerState.TEXT;
        }
    }
    handleCloseTagName(ch) {
        if (ch === '>') {
            this.emitElementClose();
        }
        else if (this.isNameChar(ch)) {
            this.tagName += ch;
        }
        else {
            this.state = types_1.TokenizerState.TEXT;
            this.processChar(ch); // re-process in TEXT (e.g. '<' → TAG_SUSPECTED)
        }
    }
    // ============================================================
    // #region Helpers
    // ============================================================
    isNameChar(ch) {
        return this.tagCharPattern.test(ch);
    }
    validateTagName() {
        if (!this.tagName)
            return false;
        if (this.legalTags)
            return this.legalTags.includes(this.tagName);
        return true;
    }
    matchesPrefix(prefix) {
        if (!this.legalTags)
            return true;
        return this.legalTags.some(tag => tag.startsWith(prefix));
    }
    emitElementOpen() {
        const event = {
            type: 'elementOpen',
            name: this.tagName,
            attributes: { ...this.attributes },
            _bufferPos: this.buffer.length,
            _tagStart: this.suspectStartPos,
        };
        this.eventQueue.push(event);
        this.depth++;
        this.resetTagState();
        this.state = types_1.TokenizerState.TEXT;
        this.compactBuffer();
    }
    emitElementClose() {
        const event = {
            type: 'elementClose',
            name: this.tagName,
            _bufferPos: this.buffer.length,
        };
        this.eventQueue.push(event);
        this.depth = Math.max(0, this.depth - 1);
        this.resetTagState();
        this.state = types_1.TokenizerState.TEXT;
    }
    emitSelfClose() {
        const event = {
            type: 'selfClose',
            name: this.tagName,
            attributes: { ...this.attributes },
            _bufferPos: this.buffer.length,
            _tagStart: this.suspectStartPos,
        };
        this.eventQueue.push(event);
        this.resetTagState();
        this.state = types_1.TokenizerState.TEXT;
    }
    resetTagState() {
        this.tagName = '';
        this.attrName = '';
        this.attrValue = '';
        this.attributes = {};
        this.suspectStartPos = -1;
    }
    compactBuffer() {
        const keepFrom = Math.max(0, this.flushedIndex - 256);
        if (keepFrom > 0) {
            this.buffer = this.buffer.substring(keepFrom);
            this.flushedIndex -= keepFrom;
        }
    }
}
exports.Tokenizer = Tokenizer;


/***/ },

/***/ 411
(__unused_webpack_module, exports) {


// ============================================================
// Public types
// ============================================================
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenizerState = exports.DEFAULT_TAG_CHAR_PATTERN = exports.DEFAULT_CONFIG = exports.ErrorStrategy = void 0;
/** Error handling strategy */
var ErrorStrategy;
(function (ErrorStrategy) {
    /** Throw on XML syntax errors (for testing) */
    ErrorStrategy["STRICT"] = "strict";
    /** Skip erroneous characters, emit error events, continue parsing (default) */
    ErrorStrategy["LENIENT"] = "lenient";
    /** Skip erroneous characters silently (for high-performance scenarios) */
    ErrorStrategy["SILENT"] = "silent";
})(ErrorStrategy || (exports.ErrorStrategy = ErrorStrategy = {}));
/** Default values for optional config fields */
exports.DEFAULT_CONFIG = {
    maxBufferSize: 1048576,
    errorStrategy: ErrorStrategy.LENIENT,
    maxNestingDepth: 1,
};
exports.DEFAULT_TAG_CHAR_PATTERN = /^[a-zA-Z0-9_\-.:]$/;
/** L1 Tokenizer states */
var TokenizerState;
(function (TokenizerState) {
    TokenizerState["TEXT"] = "TEXT";
    TokenizerState["TAG_SUSPECTED"] = "TAG_SUSPECTED";
    TokenizerState["TAG_NAME"] = "TAG_NAME";
    TokenizerState["AFTER_NAME"] = "AFTER_NAME";
    TokenizerState["ATTR_NAME"] = "ATTR_NAME";
    TokenizerState["BEFORE_ATTR_EQ"] = "BEFORE_ATTR_EQ";
    TokenizerState["ATTR_VALUE_START"] = "ATTR_VALUE_START";
    TokenizerState["ATTR_VALUE_DQ"] = "ATTR_VALUE_DQ";
    TokenizerState["ATTR_VALUE_SQ"] = "ATTR_VALUE_SQ";
    TokenizerState["BEFORE_CLOSE"] = "BEFORE_CLOSE";
    TokenizerState["CLOSE_TAG_NAME"] = "CLOSE_TAG_NAME";
})(TokenizerState || (exports.TokenizerState = TokenizerState = {}));


/***/ },

/***/ 306
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XmlProcessor = void 0;
const types_1 = __webpack_require__(411);
/**
 * L2 XmlProcessor — maintains XML tag stack and validates open/close matching.
 * Passes through tokenizer events with stack context.
 */
class XmlProcessor {
    constructor(errorStrategy = types_1.ErrorStrategy.LENIENT) {
        this.tagStack = [];
        this.eventQueue = [];
        this.errorStrategy = errorStrategy;
    }
    /** Push a L1 event into the processor */
    push(event) {
        switch (event.type) {
            case 'elementOpen':
                this.handleElementOpen(event);
                break;
            case 'elementClose':
                this.handleElementClose(event);
                break;
            // Self-closing: passthrough, no stack change
            case 'selfClose':
            case 'text':
            case 'error':
                // Passthrough
                this.eventQueue.push(event);
                break;
        }
    }
    /** Pull next L2 event */
    pull() {
        return this.eventQueue.shift() ?? null;
    }
    /** Current tag stack depth */
    get depth() {
        return this.tagStack.length;
    }
    /** Top of tag stack (null if empty) */
    get topTag() {
        return this.tagStack.length > 0 ? this.tagStack[this.tagStack.length - 1] : null;
    }
    /** Signal end of input. Handle unclosed tags. */
    end() {
        if (this.tagStack.length === 0)
            return;
        if (this.errorStrategy === types_1.ErrorStrategy.STRICT) {
            throw new Error(`Unclosed tags at end of input: ${this.tagStack.join(', ')}`);
        }
        if (this.errorStrategy === types_1.ErrorStrategy.LENIENT) {
            // Emit synthetic close events for unclosed tags (bottom to top)
            const unclosed = [...this.tagStack];
            for (let i = unclosed.length - 1; i >= 0; i--) {
                this.eventQueue.push({
                    type: 'error',
                    message: `Unclosed tag <${unclosed[i]}> at end of input`,
                });
                this.eventQueue.push({
                    type: 'elementClose',
                    name: unclosed[i],
                });
            }
        }
        // SILENT: just clear
        this.tagStack = [];
    }
    /** Reset processor state */
    reset() {
        this.tagStack = [];
        this.eventQueue = [];
    }
    // ============================================================
    // Handlers
    // ============================================================
    handleElementOpen(event) {
        this.tagStack.push(event.name);
        this.eventQueue.push(event);
    }
    handleElementClose(event) {
        const top = this.tagStack.length > 0
            ? this.tagStack[this.tagStack.length - 1]
            : null;
        if (top === event.name) {
            this.tagStack.pop();
            this.eventQueue.push(event);
        }
        else if (top === null) {
            // Close without matching open
            if (this.errorStrategy === types_1.ErrorStrategy.STRICT) {
                throw new Error(`Unexpected closing tag </${event.name}> with empty stack`);
            }
            if (this.errorStrategy === types_1.ErrorStrategy.LENIENT) {
                this.eventQueue.push({
                    type: 'error',
                    message: `Unexpected closing tag </${event.name}>`,
                });
            }
            // SILENT: ignore
        }
        else {
            // Mismatch: <a><b></a> — close doesn't match top
            if (this.errorStrategy === types_1.ErrorStrategy.STRICT) {
                throw new Error(`Mismatched closing tag: expected </${top}>, got </${event.name}>`);
            }
            if (this.errorStrategy === types_1.ErrorStrategy.LENIENT) {
                this.eventQueue.push({
                    type: 'error',
                    message: `Mismatched closing tag: expected </${top}>, got </${event.name}>`,
                });
                // Try to recover: find and pop matching tag
                const idx = this.tagStack.lastIndexOf(event.name);
                if (idx >= 0) {
                    // Pop everything above and including the matching tag
                    this.tagStack = this.tagStack.slice(0, idx);
                    this.eventQueue.push(event);
                }
                // If not found, ignore the close
            }
            // SILENT: try recovery
            if (this.errorStrategy === types_1.ErrorStrategy.SILENT) {
                const idx = this.tagStack.lastIndexOf(event.name);
                if (idx >= 0) {
                    this.tagStack = this.tagStack.slice(0, idx);
                    this.eventQueue.push(event);
                }
            }
        }
    }
}
exports.XmlProcessor = XmlProcessor;


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LegalTagConfig = exports.ErrorStrategy = exports.BusinessEvent = exports.TextEvent = exports.TagHandler = exports.SxmlResult = exports.SxmlEvent = exports.SxmlConfig = exports.SxmlParser = void 0;
var sxml_parser_1 = __webpack_require__(48);
Object.defineProperty(exports, "SxmlParser", ({ enumerable: true, get: function () { return sxml_parser_1.SxmlParser; } }));
var types_1 = __webpack_require__(411);
Object.defineProperty(exports, "SxmlConfig", ({ enumerable: true, get: function () { return types_1.SxmlConfig; } }));
Object.defineProperty(exports, "SxmlEvent", ({ enumerable: true, get: function () { return types_1.SxmlEvent; } }));
Object.defineProperty(exports, "SxmlResult", ({ enumerable: true, get: function () { return types_1.SxmlResult; } }));
Object.defineProperty(exports, "TagHandler", ({ enumerable: true, get: function () { return types_1.TagHandler; } }));
Object.defineProperty(exports, "TextEvent", ({ enumerable: true, get: function () { return types_1.TextEvent; } }));
Object.defineProperty(exports, "BusinessEvent", ({ enumerable: true, get: function () { return types_1.BusinessEvent; } }));
Object.defineProperty(exports, "ErrorStrategy", ({ enumerable: true, get: function () { return types_1.ErrorStrategy; } }));
Object.defineProperty(exports, "LegalTagConfig", ({ enumerable: true, get: function () { return types_1.LegalTagConfig; } }));

})();

module.exports = __webpack_exports__;
/******/ })()
;