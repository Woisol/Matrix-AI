import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MarkdownModule } from 'ngx-markdown';
import { MatrixAnalyseComponent, MatrixAnalysisProps } from './matrix-analyse.component';

describe('MatrixAnalyseComponent', () => {
  async function createComponent(analysis: MatrixAnalysisProps, allowWholeEditorReplace = false) {
    await TestBed.configureTestingModule({
      imports: [MarkdownModule.forRoot(), MatrixAnalyseComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(MatrixAnalyseComponent);
    fixture.componentInstance.analysis = analysis;
    fixture.componentInstance.allowWholeEditorReplace = allowWholeEditorReplace;
    fixture.detectChanges();

    return fixture;
  }

  it('renders an apply button and emits a range edit request for coordinate fences', async () => {
    const fixture = await createComponent({
      showInEditor: true,
      content: [
        {
          title: 'Code Analysis',
          content: '```cpp:2C3-2C5\nabc\n```',
        },
      ],
    });
    const emitSpy = spyOn(fixture.componentInstance.applyToEditor, 'emit');
    const button = fixture.nativeElement.querySelector('.editor-patch-card button') as HTMLButtonElement;

    expect(button).toBeTruthy();

    button.click();

    expect(emitSpy).toHaveBeenCalledWith({
      target: 'range',
      language: 'cpp',
      tabTitle: 'Code Analysis',
      text: 'abc\n',
      range: {
        startLineNumber: 2,
        startColumn: 3,
        endLineNumber: 2,
        endColumn: 5,
      },
    });
  });

  it('renders an apply button and emits a full editor request for plain fences when enabled', async () => {
    const fixture = await createComponent({
      showInEditor: true,
      content: [
        {
          title: 'Reference',
          content: '```C++\nint main() {\n  return 0;\n}\n```',
        },
      ],
    }, true);
    const emitSpy = spyOn(fixture.componentInstance.applyToEditor, 'emit');
    const button = fixture.nativeElement.querySelector('.editor-patch-card button') as HTMLButtonElement;

    expect(button).toBeTruthy();

    button.click();

    expect(emitSpy).toHaveBeenCalledWith({
      target: 'full-editor',
      language: 'C++',
      tabTitle: 'Reference',
      text: 'int main() {\n  return 0;\n}\n',
    });
  });

  it('does not render an apply button when showInEditor is disabled', async () => {
    const fixture = await createComponent({
      showInEditor: false,
      content: [
        {
          title: 'Code Analysis',
          content: '```cpp:2C3-2C5\nabc\n```',
        },
      ],
    });

    expect(fixture.nativeElement.querySelector('.editor-patch-card button')).toBeNull();
  });
});
