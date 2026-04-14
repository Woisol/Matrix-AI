import { TestBed } from '@angular/core/testing';

import { AgentLoopToolProvider } from './agent-loop-tool-provider.service';

describe('AgentLoopToolProvider', () => {
  beforeEach(() => {
    localStorage.removeItem('agent_loop_enabled_tools');
    TestBed.configureTestingModule({
      providers: [AgentLoopToolProvider],
    });
  });

  it('expands mapped internal tools without mutating the display selection', () => {
    const provider = TestBed.inject(AgentLoopToolProvider);

    provider.enabledToolsDisplay = ['read_editor', 'write_editor'];

    expect(provider.enabledToolsDisplay).toEqual(['read_editor', 'write_editor']);
    expect(provider.enabledTools).toEqual([
      'read_editor',
      'read_selection',
      'write_editor',
      'write_editor_suggestion',
    ]);
    expect(provider.enabledToolsDisplay).toEqual(['read_editor', 'write_editor']);
    expect(provider.enabledTools).toEqual([
      'read_editor',
      'read_selection',
      'write_editor',
      'write_editor_suggestion',
    ]);
  });

  it('exposes disabled menu metadata for unimplemented tools', () => {
    const provider = TestBed.inject(AgentLoopToolProvider);
    const webSearch = provider.toolMenuItems.find((item) => item.name === 'web_search');

    expect(webSearch).toBeTruthy();
    expect(webSearch?.toggleable).toBeFalse();
    expect(webSearch?.implemented).toBeFalse();
    expect(provider.isToolToggleable('web_search')).toBeFalse();
  });
});