import { SimpleChange } from '@angular/core';
import { CodeEditorComponent } from './code-editor.component';

describe('CodeEditorComponent', () => {
  function createComponent() {
    return new CodeEditorComponent({} as never);
  }

  it('does not reset the editor content when the incoming value already matches', () => {
    const component = createComponent();
    const setValue = jasmine.createSpy('setValue');

    component.editor = {
      setValue,
      getValue: () => 'same content',
    } as never;

    component.ngOnChanges({
      codeFile: new SimpleChange(
        { fileName: 'main.cpp', content: 'old content' },
        { fileName: 'main.cpp', content: 'same content' },
        false,
      ),
    });

    expect(setValue).not.toHaveBeenCalled();
  });

  it('updates the editor when the incoming value is actually different', () => {
    const component = createComponent();
    const setValue = jasmine.createSpy('setValue');

    component.editor = {
      setValue,
      getValue: () => 'old content',
    } as never;

    component.ngOnChanges({
      codeFile: new SimpleChange(
        { fileName: 'main.cpp', content: 'old content' },
        { fileName: 'main.cpp', content: 'new content' },
        false,
      ),
    });

    expect(setValue).toHaveBeenCalledOnceWith('new content');
  });
});
