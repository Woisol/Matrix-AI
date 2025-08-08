import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { zh_CN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  BookOutline,
  TagOutline,
  ClockCircleOutline,
  InboxOutline,
  CheckOutline,
  LeftOutline,
  RightOutline,
  CodeOutline,
  FileTextOutline,
  AppstoreOutline,
} from '@ant-design/icons-angular/icons';
import { MarkdownModule } from 'ngx-markdown';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

registerLocaleData(zh);

// 定义需要的图标
const icons: IconDefinition[] = [
  BookOutline,
  TagOutline,
  ClockCircleOutline,
  InboxOutline,
  CheckOutline,
  LeftOutline,
  RightOutline,
  CodeOutline,
  FileTextOutline,
  AppstoreOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule),
    importProvidersFrom(NzIconModule.forRoot(icons)),
    importProvidersFrom(MarkdownModule.forRoot()),
    provideAnimationsAsync(),
    provideHttpClient(),
    // Monaco Editor 根级配置
    provideMonacoEditor({
      baseUrl: 'assets/monaco-editor/vs', // 对应 angular.json 中 output: /assets/monaco-editor
      defaultOptions: {
        automaticLayout: true,
        scrollBeyondLastLine: false,
        minimap: { enabled: true }
      }
    })
  ]
};