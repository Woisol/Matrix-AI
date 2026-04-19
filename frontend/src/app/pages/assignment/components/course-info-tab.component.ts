import { Component, ElementRef, EventEmitter, Input, OnInit, OnChanges, Output, QueryList, SimpleChanges, signal, ViewChildren, WritableSignal, } from "@angular/core";
import { NzSplitterModule } from "ng-zorro-antd/splitter";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { Analysis, AssignData } from "../../../api/type/assigment";
import { MarkdownModule } from "ngx-markdown";
import { NzProgressModule } from "ng-zorro-antd/progress";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { MatrixAnalyseComponent } from "./matrix-analyse.component";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTooltipModule } from "ng-zorro-antd/tooltip";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzModalModule } from "ng-zorro-antd/modal";
import { SubmitScoreComponent } from "./submit-score.component";
import { CheckpointId, ConversationId, MatrixAgentConversation, MatrixAgentConversationSummary, MatrixAgentEvent } from "../../../api/type/agent";
import { DatePipe } from "@angular/common";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzFormModule } from "ng-zorro-antd/form";
import { FormsModule, NgForm } from "@angular/forms";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { AgentChatBubbleComponent } from "./agent/chat-bubble.component";
import type { DisplayEvent } from "./agent/chat-bubble.component";
import type { AgentLoopToolMenuItem, AgentLoopToolNameDisplay } from "../../../services/assign/agent/agent-loop-tool-provider.service";
import type { AgentByokConfig } from "../../../services/assign/agent/agent-stream.service";
import { MatrixAnalysisEditorRange, MatrixAnalysisEditRequest } from "./code-applyable-markdown.component";
import { buildConversationExportText } from "../../../api/util/export";


@Component({
  selector: "course-info-tab",
  imports: [DatePipe, NzSplitterModule, NzTabsModule, MarkdownModule, NzProgressModule, NzCollapseModule, MatrixAnalyseComponent, NzIconModule, NzTooltipModule, NzDropDownModule, NzCheckboxModule, NzMenuModule, NzModalModule, SubmitScoreComponent, NzInputModule, NzFormModule, FormsModule, CdkTextareaAutosize, AgentChatBubbleComponent],
  standalone: true,
  template: `
    <nz-tabs class="tab-expend" [(nzSelectedIndex)]="selectedTabIndex">
      <nz-tab nzTitle="描述">
        @if (assignData) {
          <h3>{{assignData.title}}</h3>
          @if (assignData.description && assignData.description.trim()) {
            <markdown class="markdown-patched" [data]="assignData.description"></markdown>
          } @else {
            <div class="empty-content">
              <p>暂无描述内容</p>
            </div>
          }
        } @else {
          <div class="loading-content">
            <p>加载中...</p>
          </div>
        }
      </nz-tab>

      <nz-tab nzTitle="提交">
        @if (assignData?.submit) {
          <div class="submit-panel">
            <p style="margin: 0;">
              <small>Powered by Matrix</small>
            </p>
            <submit-score [score]="assignData!.submit?.score" [submitTime]="assignData!.submit?.time"></submit-score>
            <!-- 测试样例 -->
            <nz-collapse class="test-sample-con">
            @for (testSample of assignData?.submit?.testSample; track $index) {
              <nz-collapse-panel [nzHeader]="'测试样例 ' + ($index + 1)" [nzActive]="true">
                <h4>标准输入</h4>
                <code>{{testSample.input}}</code>
                <h4>实际输出</h4>
                <code>{{testSample.realOutput}}</code>
                <h4>期望输出</h4>
                <code>{{testSample.expectOutput}}</code>
              </nz-collapse-panel>
            }
            </nz-collapse>
          </div>
        }
        @else {
          <div class="empty-content">
            <p>还没有提交过哦</p>
          </div>
        }
      </nz-tab>

      @if (assignData?.submit && ddlGrant()) {
        <nz-tab nzTitle="AI 分析">
          @if (!analysis) {
            <div class="empty-content">
              <p>暂无题解内容</p>
            </div>
          } @else {
            @if(analysis.basic.resolution) {
              <h4>参考题解</h4>
              <matrix-analyse
                [analysis]="analysis.basic.resolution"
                [allowWholeEditorReplace]="true"
                (focusRequestRangeOnEditor)="focusRequestRangeOnEditor.emit($event)"
                (applyToEditor)="applyAnalysisEdit.emit($event)"
              ></matrix-analyse>
            }
            @if(analysis.basic.knowledgeAnalysis) {
              <h4>知识点分析</h4>
              <matrix-analyse
                [analysis]="analysis.basic.knowledgeAnalysis"
                [allowWholeEditorReplace]="true"
                (focusRequestRangeOnEditor)="focusRequestRangeOnEditor.emit($event)"
                (applyToEditor)="applyAnalysisEdit.emit($event)"
              ></matrix-analyse>
            }
            @if(!analysis.aiGen){
              <section class="aiGen">
                <p>想了解你提交代码的质量？<br/>想进一步学习更多相关知识点？</p>
                <button (click)="onAnalysisAiGenRequest(true)">AI 个性分析</button>
              </section>
            }
            @else{
              @if(analysis.aiGen.codeAnalysis) {
                <h4>AI 代码分析</h4>
                <matrix-analyse
                  [analysis]="analysis.aiGen.codeAnalysis"
                  (focusRequestRangeOnEditor)="focusRequestRangeOnEditor.emit($event)"
                  (applyToEditor)="applyAnalysisEdit.emit($event)"
                ></matrix-analyse>
              }
              @if(analysis.aiGen.learningSuggestions) {
                <h4>知识点学习建议</h4>
                <matrix-analyse
                  [analysis]="analysis.aiGen.learningSuggestions"
                  (focusRequestRangeOnEditor)="focusRequestRangeOnEditor.emit($event)"
                  (applyToEditor)="applyAnalysisEdit.emit($event)"
                ></matrix-analyse>
              }
            }
            <section class="reGen">
              <button (click)="handleAnalysisRegen()" nz-tooltip nzTooltipTitle="重新生成基础分析"><span nz-icon nzType="reload" nzTheme="outline"></span></button>
            </section>
          }
        </nz-tab>
        <!-- 不生效id="agent-tab" -->
        <nz-tab nzTitle="Agent" >
          <section class="history-panel">
            <button
              class="history-trigger"
              nz-dropdown
              [nzDropdownMenu]="historyMenu"
              nzTrigger="click"
              [nzOverlayClassName]="'history-dropdown-overlay'"
              type="button"
            >
              <h5><span nz-icon nzType="history" nzTheme="outline"></span> 历史对话</h5>
              <!-- <span class="history-current">{{ currentConversation?.title || '选择历史对话' }}</span> -->
              <nz-icon class="history-arrow" nzType="down" nzTheme="outline"></nz-icon>
            </button>

            <nz-dropdown-menu #historyMenu="nzDropdownMenu">
              <ul nz-menu class="history-dropdown-menu">
                @if (!conversationHistory.length) {
                  <li nz-menu-item nzDisabled>暂无历史对话</li>
                }
                @for (conv of conversationHistory; track $index) {
                  <li
                    nz-menu-item
                    class="history-conversation-item"
                    [class.is-active]="currentConversation?.conversationId === conv.conversationId"
                    (click)="onConversationItemClick(conv.conversationId)"
                  >
                    @if (editingConversationId === conv.conversationId) {
                      <input
                        #conversationTitleInput
                        nz-input
                        class="conversation-title-input"
                        [(ngModel)]="editingTitleDraft"
                        [name]="'conversationTitle-' + conv.conversationId"
                        (click)="$event.stopPropagation()"
                        (keydown.enter)="submitConversationTitleEdit(conv.conversationId, $event)"
                        (keydown.escape)="cancelConversationTitleEdit($event)"
                        (blur)="submitConversationTitleEdit(conv.conversationId)"
                      />
                    } @else {
                      <span class="conversation-title">{{conv.title}} <span>{{conv.updatedAt | date:'yy-MM-dd HH:mm'}}</span></span>
                    }
                  <span class="conversation-actions">
                    <button class="secondary" type="button" (click)="startConversationTitleEdit(conv, $event)">
                      <span nz-icon nzType="edit" nzTheme="outline"></span>
                    </button>
                    <button class="secondary" type="button" (click)="requestDeleteConversation(conv.conversationId, $event)">
                      <span nz-icon nzType="delete" nzTheme="outline"></span>
                    </button>
                  </span>

                  </li>
                }
                <li
                  nz-menu-item
                  class="new-conversation-trigger"
                  (click)="createNewConversation.emit()"
                  >
                  新建一个对话...
                </li>
              </ul>
            </nz-dropdown-menu>
          </section>
          <section class="chat-section" #chatScrollContainer>
          @if (currentConversation) {
            @for (event of _displayEvents(); track $index) {
              <agent-chat-bubble
                [dEvent]="event"
                (focusRequestRangeOnEditor)="focusRequestRangeOnEditor.emit($event)"
                (applyToEditor)="applyAnalysisEdit.emit($event)"
                (rewindConversationRequest)="handleRewindConversationRequest(event, $event)"
                (rewindWriteRequest)="rewindWriteRequest.emit($event)"
                />
            }
          } @else {
            <div class="empty-content">
              <p>请选择一个历史对话，或<a (click)="createNewConversation.emit()">新建一个对话</a>来开始</p>
            </div>
          }
          </section>
          <section class="agent-action">
            <form #agentForm="ngForm" (ngSubmit)="onAgentSubmit(agentForm)">

              <textarea
                nz-input
                [(ngModel)]="userInput"
                name="userInput"
                (keydown)="onKeyDown($event, agentForm)"
                placeholder="描述要做的事，比如题目分析、代码纠错……"
                class="agent-input"
                cdkTextareaAutosize
                cdkAutosizeMinRows="1"
                cdkAutosizeMaxRows="6"
              ></textarea>
              <menu class="agent-action-buttons">
                <button class="secondary" nz-dropdown [nzDropdownMenu]="agentActionMenu" nzTrigger="click" [nzPlacement]="'topLeft'" [nzClickHide]="false">Tools</button>
                <button class="secondary" nz-dropdown [nzDropdownMenu]="byokMenu" nzTrigger="click" [nzPlacement]="'topLeft'" [nzClickHide]="false" (nzVisibleChange)="handleByokDropdownVisibleChange($event)" type="button">BYOK</button>
                <button class="secondary" (click)="exportCurrentConversation()" [disabled]="!this.currentConversation"><span nz-icon nzType="export" nzTheme="outline"></span></button>
                <button class="secondary send-action" type="submit" [disabled]="agentLoopRunning"><nz-icon nzType="send" nzTheme="outline"></nz-icon></button>
              </menu>
              <nz-dropdown-menu #agentActionMenu="nzDropdownMenu">
                <ul nz-menu class="agent-tool-menu">
                  @for (tool of agentToolMenuItems; track tool.name) {
                    <li
                      nz-menu-item
                      [nzDisabled]="!tool.toggleable"
                      (click)="toggleAgentToolItem(tool, $event)"
                    >
                      <span class="agent-tool-item">
                        <span class="agent-tool-main">
                          <!-- <nz-icon [nzType]="enabledAgentTools.includes(tool.name) ? 'check-square' : 'border'" nzTheme="outline"></nz-icon> -->
                          {{tool.name}}
                          <!-- Array 不存在，没招了 <span>{{Array.from(agentToolMenuItems.keys())}}</span> -->
                        </span>
                        @if (!tool.implemented) {
                          <span class="agent-tool-badge">开发中</span>
                        }
                        <input
                          class="agent-tool-checkbox"
                          type="checkbox"
                          [checked]="enabledAgentTools.includes(tool.name)"
                          [disabled]="!tool.toggleable"
                          aria-label="切换工具"
                        />
                      </span>
                      <!-- <small class="agent-tool-hint">{{tool.hint}}</small> -->
                    </li>
                  }
                  @if (!agentToolMenuItems.length) {
                    <li nz-menu-item nzDisabled>暂无可配置工具</li>
                  }
                </ul>
                @if (agentLoopRunning) {
                  <p class="agent-tool-runtime-note">运行中修改仅对下一轮消息生效</p>
                }
              </nz-dropdown-menu>
              <nz-dropdown-menu #byokMenu="nzDropdownMenu">
                <section class="byok-menu" (click)="$event.stopPropagation()">
                  <h5>Bring Your Own Key 设置</h5>
                  <input
                    nz-input
                    type="text"
                    [(ngModel)]="byokBaseUrlDraft"
                    [ngModelOptions]="{ standalone: true }"
                    placeholder="Base URL，例如 https://api.openai.com（/v1/competition 自动补充）"
                  />
                  <input
                    nz-input
                    type="text"
                    [(ngModel)]="byokModelDraft"
                    [ngModelOptions]="{ standalone: true }"
                    placeholder="Model，例如 gpt-5.3-codex"
                  />
                  <input
                    nz-input
                    type="password"
                    [(ngModel)]="byokApiKeyDraft"
                    [ngModelOptions]="{ standalone: true }"
                    placeholder="API Key"
                  />
                  <menu class="byok-actions">
                    <button class="secondary" type="button" (click)="useMatrixModel()">使用 Matrix 提供模型</button>
                    <button type="button" (click)="saveByok()">保存</button>
                  </menu>
                </section>
              </nz-dropdown-menu>
            </form>
          </section>
        </nz-tab>
      }
    </nz-tabs>

    <nz-modal
      [(nzVisible)]="exportPreviewVisible"
      nzTitle="导出预览"
      (nzOnCancel)="closeExportPreview()"
      [nzWidth]="720"
      [nzMaskClosable]="true"
    >
      <section *nzModalContent class="export-preview-con">
        <pre class="export-preview-content">{{ exportPreviewContent }}</pre>
      </section>
      <div *nzModalFooter>
        <button class="secondary" type="button" (click)="downloadExportPreview()">下载 .txt</button>
        <span style="margin: 0 4px;" data-reason="懒"></span>
        <button class="secondary" type="button" (click)="downloadExportPreview('md')">下载 .md</button>
      </div>
    </nz-modal>
  `,
  styles: [`
  :host{ display:block; height:100%; }

  /* 仅作用于当前组件模板里标记了 class="tab-expend" 的最外层 nz-tabs，不影响内层后续动态插入的其他 ant-tabs */
  :host ::ng-deep nz-tabs.tab-expend{
    height:100%;
    display:flex;
    flex-direction:column;
  }
  /* 只匹配直接子元素，防止级联到更深层 ant-tabs */
  :host ::ng-deep nz-tabs.tab-expend > .ant-tabs-nav{ flex:0 0 auto; }
  :host ::ng-deep nz-tabs.tab-expend > .ant-tabs-content-holder{
    flex:1 1 auto;
    min-height:0;
    overflow:hidden;
  }
  :host ::ng-deep nz-tabs.tab-expend > .ant-tabs-content-holder > .ant-tabs-content{
    height:100%;
    display:flex; /* 使首层 pane 高度拉伸 */
  }
  :host ::ng-deep nz-tabs.tab-expend > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane{
    height:100%;
    overflow:auto;
    padding-right:8px;
    flex:1 1 auto;
    min-width:0;
  }

  /* 内容区域样式 */
  h3 {
    color: #262626;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 8px;
  }
  h4{
    font-size: 20px;
    margin: 0;
  }

  /* 空状态样式 */
  .empty-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8c8c8c;

    p {
      font-size: 14px;
      margin: 0;
    }
  }

  /* 加载状态样式 */
  .loading-content {
    text-align: center;
    padding: 40px 20px;
    color: #1890ff;

    p {
      font-size: 14px;
      margin: 0;
    }
  }

  /* 提交信息样式 */

  .submit-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /*::ng-deep .ant-tabs-content,::ng-deep .ant-tabs-tabpane{
    height: 100%;
  }*/

  .test-sample-con{
    border-radius: var(--size-radius-sm);

      h4{
        margin:1em 0 0 0;
        &:first-child {
          margin: 0;}
      }
  }

  code{
    display: block;
    background: #f6f8fa;
    border: 1px solid #e1e4e8;
    border-radius: var(--size-radius-sm);
    padding: 8px;
    font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #24292e;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .aiGen{
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    p{
      text-align: center;
      margin: 0;
    }
    button{
      box-shadow: 0 2px 8px var(--color-primary);
    }

  }

  .reGen{
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 10;
    button{
      box-shadow: 0 2px 8px var(--color-shadow);
    }
  }

  /* agent tab*/

  ::ng-deep .ant-tabs-nav{
    margin: 0 !important;
    padding: 0 !important;
  }

  /* 给每个 tabpane 的直接内容统一留白，避免依赖动态 tab 索引 */
  :host ::ng-deep .ant-tabs-tabpane:first-child{
    margin-top: 16px;
  }
  /* history oanel*/

  /* Agent 页签顶部是历史对话触发器，不需要额外上边距 */
  :host ::ng-deep .ant-tabs-tabpane > .history-panel{
    margin-top: 0;
  }
  :host ::ng-deep .ant-tabs-tabpane:has(.history-panel){
    height: calc(100% - 16px);
    display:flex;
    flex-direction: column;
  }


  .history-panel{
    width: 100%;
  }

  .history-trigger{
    width: 100%;
    height: 30px;
    padding: 0 12px;
    border: 1px solid var(--color-border);
    border-radius: var(--size-radius-sm) var(--size-radius-sm) 0 0;
    background: var(--color-bg);
    display: grid;
    grid-template-columns: 1fr auto;
    box-shadow: none;
    &:hover{
      box-shadow: none;
    }

    align-items: center;
    gap: 2px 8px;
    text-align: left;

    h5{
      margin: 0;
      font-size: 12px;
      color: var(--color-secondary);
      display: inline-flex;
      gap: 6px;
      align-items: center;
      font-weight: 500;
    }

    .history-arrow{
      grid-column: 2 / 3;
      color: var(--color-secondary);
    }
  }

  /* 正常的 class 反而不能用 :host ::ng-deep */
  .history-dropdown-menu{
    max-height: 100%;
    min-width: 200px;
    overflow: auto;
  }

  .history-conversation-item{
    min-width: 0;

    &.is-active{
      background: var(--color-primary-light-xl);
    }
  }

  .conversation-title{
    flex: 1 1 0;
    width: 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &>span{
      font-size: 12px;
      color: var(--color-secondary);
    }
  }

  .conversation-title-input{
    flex: 1 1 0;
    width: 0;
    max-width: 100%;
    min-width: 0;
    height: 24px;
    padding: 0 6px;
    font-size: 12px;
    border-radius: 6px;
  }

  ::ng-deep .history-dropdown-menu .ant-menu-title-content{
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex-wrap: nowrap;
  }

  .conversation-actions{
    padding: 4px;
    display: inline-flex;
    gap: 4px;
    align-items: center;
    margin-left: auto;
    flex: 0 0 auto;
    >button{
      padding: 2px 6px;
      font-size: 12px;
      color: var(--color-secondary);
      border: none;
      border-radius: 999px;
      box-shadow: none;
    }

  }

  .new-conversation-trigger{
    color: var(--color-secondary);
  }

  /* chat section */
  .chat-section{
    flex:1;
    overflow: auto;
    background-color: var(--color-surface);
    display:flex;
    flex-direction:column;
    gap:4px;
    padding: 12px 2px 12px 10px;

    scrollbar-width: thin;
    scrollbar-color: var(--color-secondary) var(--color-surface);
    scrollbar-gutter: stable;

    user-select: text;
    -webkit-user-select: text;

    & *{
      user-select: text;
      -webkit-user-select: text;
    }

    /* 子组件内部模板内容需要穿透样式作用域 */
    ::ng-deep * {
      user-select: text;
      -webkit-user-select: text;
    }

    /*scrollbar-color: auto var(--color-surface);*/
    /* 力竭了…… &::-webkit-scrollbar-button{
      width: 0;
      height: 0;
      display: none;
    }*/
    /*&::-webkit-scrollbar-track{
      background-color: var(--color-surface);
    }*/
  }

  .chat-section .empty-content{
    height:100%;
  }

  /* agent action */
  .agent-action{
    height: fit-content;
    border: 1px solid var(--color-border);
    border-radius: var(--size-radius-sm);

    .agent-input{
      width: 100%;
      padding: 6px 8px;
      border: none;
      border-radius: var(--size-radius-sm) var(--size-radius-sm) 0 0;
      overflow: auto;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE/Edge Legacy */
      &::-webkit-scrollbar{
        width: 0;
        height: 0;
      }
    }

    .agent-action-buttons{
      padding: 4px;
      display: flex;
      gap: 4px;
      align-items: center;
      >*{
        padding: 2px 6px;
        font-size: 12px;
        color: var(--color-secondary);
        border: none;
        border-radius: 6px;
        box-shadow: none;
      }

      >.send-action{
        padding: 2px 6px;
        margin-left:auto;
        /*align-self: flex-end;*/
      }
    }
  }

  .agent-tool-menu{
    max-width: 360px;
  }

  ::ng-deep .agent-tool-menu .ant-menu-title-content{
    width: 100%;
  }

  .agent-tool-item{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .agent-tool-main{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .agent-tool-badge{
    padding: 0 6px;
    border-radius: 999px;
    background: var(--color-primary-light-xl);
    color: var(--color-secondary);
    font-size: 11px;
    line-height: 18px;
    flex: 0 0 auto;
  }

  .agent-tool-checkbox{
    flex: 0 0 auto;
    margin-left: auto;
    width: 16px;
    height: 16px;
    accent-color: var(--color-primary);
  }

  .agent-tool-hint{
    display: block;
    max-width: 200px;
    margin-top: 2px;
    color: var(--color-secondary);
    white-space: pre-wrap;
    word-break: break-word;
    /*line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;*/
  }

  .agent-tool-runtime-note{
    margin: 8px 12px;
    color: var(--color-secondary);
    font-size: 12px;
  }

  .byok-menu{
    width: 320px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--color-bg);

    h5{
      margin: 0;
      font-size: 12px;
      color: var(--color-secondary);
    }
  }

  .byok-actions{
    padding: 0;
    margin-top: 4px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .export-preview-con{
    max-height: 60vh;
    overflow: auto;
    border: 1px solid var(--color-border);
    border-radius: var(--size-radius-sm);
    background: var(--color-surface);
  }

  .export-preview-content{
    margin: 0;
    padding: 12px;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.6;
    color: var(--color-text);
  }

  `],
  // styleUrl
})
export class CourseInfoTabComponent implements OnInit, OnChanges {
  @ViewChildren('conversationTitleInput')
  conversationTitleInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('chatScrollContainer')
  chatScrollContainer!: QueryList<ElementRef<HTMLInputElement>>;

  @Input() assignData!: AssignData | undefined;
  @Input() analysis!: Analysis | undefined;
  @Input() handleAnalysisRegen = () => { };
  @Input() onAnalysisAiGenRequest = (notify: boolean = false) => { };
  @Input() conversationHistory: MatrixAgentConversationSummary[] = [];
  @Input() currentConversation: MatrixAgentConversation | null = null;
  @Output() createNewConversation = new EventEmitter<void>();
  @Output() loadConversationInfo = new EventEmitter<ConversationId>();
  @Output() refreshConversationHistory = new EventEmitter<void>();
  @Output() patchConversationTitle = new EventEmitter<{ conversationId: ConversationId, title: string }>();
  @Output() deleteConversation = new EventEmitter<ConversationId>();
  // @Input() pushNewAgentEvent = (event: MatrixAgentEvent) => { };
  @Output() pushNewAgentEvent = new EventEmitter<MatrixAgentEvent>();
  // @Output() pushNewAgentEvent = new EventEmitter<MatrixAgentEventUserMessage>();
  @Input() agentToolMenuItems: AgentLoopToolMenuItem[] = [];
  @Input() enabledAgentTools: AgentLoopToolNameDisplay[] = [];
  @Input() agentLoopRunning = false;
  @Input() byokConfig: AgentByokConfig | null = null;
  @Output() toggleAgentTool = new EventEmitter<AgentLoopToolNameDisplay>();
  @Output() saveByokConfig = new EventEmitter<AgentByokConfig>();
  @Output() clearByokConfig = new EventEmitter<void>();
  @Output() refreshByokConfig = new EventEmitter<void>();

  @Input() selectedTabIndex = signal(0);
  @Output() applyAnalysisEdit = new EventEmitter<MatrixAnalysisEditRequest>();
  @Output() focusRequestRangeOnEditor = new EventEmitter<MatrixAnalysisEditorRange>();
  @Output() rewindConversationRequest = new EventEmitter<number>();
  @Output() rewindWriteRequest = new EventEmitter<CheckpointId | undefined>();

  //! 暂不考虑更新，要看自己刷新⚫
  //？这里为什么是 ddl > now？？？
  ddlGrant = signal(!this.assignData?.ddl || this.assignData?.ddl! <= new Date());

  userInput = '';
  exportPreviewVisible = false;
  exportPreviewContent = '';
  exportFileName = 'agent-conversation-export.txt';
  byokBaseUrlDraft = '';
  byokModelDraft = 'qwen3-max';
  byokApiKeyDraft = '';
  editingConversationId: ConversationId | null = null;
  editingTitleDraft = '';
  // callIdCounter = (() => { for (let i = 0; ; i++) { yield `${this.currentConversation?.conversationId}-${i}` } })();
  // callIdCounter = 0;
  // nextCallId() {
  //   return this.callIdCounter++;
  // }

  // 按 user_​message 分割事件流，方便按轮展示
  _displayEvents: WritableSignal<DisplayEvent[]> = signal([]);

  ngOnInit() {
    // console.log('ngOnInit - assignData:', this.assignData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assignData']) {
      this.ddlGrant.set(!this.assignData?.ddl || this.assignData?.ddl! <= new Date());
      // console.log('assignData changed:', changes['assignData'].currentValue);
    }
    if (changes['currentConversation']) {
      const conv = changes['currentConversation'].currentValue;
      this._displayEvents.set(conv ? this._splitEventsForDisplay(conv.events) : []);
      this.scrollChatToBottomNextTick('smooth');
    }
    if (changes['byokConfig']) {
      this.byokBaseUrlDraft = this.byokConfig?.baseUrl ?? '';
      this.byokModelDraft = this.byokConfig?.model ?? 'qwen3-max';
      this.byokApiKeyDraft = this.byokConfig?.apiKey ?? '';
    }
  }

  private scrollChatToBottomNextTick(behavior: ScrollBehavior = 'auto') {
    setTimeout(() => {
      const container = this.chatScrollContainer?.first?.nativeElement;
      if (!container) return;
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }, 0);
  }

  // 辅助方法：检查 markdown 内容是否有效
  isValidMarkdown(content: string | null | undefined): content is string {
    return content != null && typeof content === 'string' && content.trim().length > 0;
  }

  onConversationItemClick(conversationId: ConversationId) {
    if (this.editingConversationId) return;
    this.loadConversationInfo.emit(conversationId);;
  }

  startConversationTitleEdit(conversation: MatrixAgentConversationSummary, event: MouseEvent) {
    event.stopPropagation();
    this.editingConversationId = conversation.conversationId;
    this.editingTitleDraft = conversation.title;

    // 渲染后手动聚焦
    setTimeout(() => {
      const input = this.conversationTitleInputs?.first?.nativeElement;
      if (!input) return;
      input.focus();
      input.select();
    }, 0);
  }

  cancelConversationTitleEdit(event?: Event) {
    event?.stopPropagation();
    this.editingConversationId = null;
    this.editingTitleDraft = '';
  }

  submitConversationTitleEdit(conversationId: ConversationId, event?: Event) {
    event?.stopPropagation();
    if (this.editingConversationId !== conversationId) return;

    const nextTitle = this.editingTitleDraft.trim();
    const currentTitle = this.conversationHistory.find((item) => item.conversationId === conversationId)?.title ?? '';

    if (!nextTitle || nextTitle === currentTitle) {
      this.cancelConversationTitleEdit();
      return;
    }

    this.patchConversationTitle.emit({ conversationId, title: nextTitle });
    this.cancelConversationTitleEdit();
  }

  requestDeleteConversation(conversationId: ConversationId, event: MouseEvent) {
    event.stopPropagation();
    this.deleteConversation.emit(conversationId);
  }

  handleRewindConversationRequest(displayEvent: DisplayEvent, eventIndex: number): void {
    if (displayEvent.type === 'user') {
      const rewoundMessage = displayEvent.events[0]?.payload?.content;
      if (typeof rewoundMessage === 'string') {
        this.userInput = rewoundMessage;
      }
    }
    this.rewindConversationRequest.emit(eventIndex);
  }

  private _splitEventsForDisplay(events: MatrixAgentEvent[]): DisplayEvent[] {
    const resDisplayEvents: DisplayEvent[] = [];
    let currentDisplayEvents: DisplayEvent | null = null;
    events.forEach((event, eventIndex) => {
      if (event.type === 'user_message') {
        // 用户消息，如果有推完前面的 agent 消息后直接推
        if (currentDisplayEvents) {
          resDisplayEvents.push(currentDisplayEvents);
        }
        currentDisplayEvents = { type: 'user', sourceStartIndex: eventIndex, events: [event] };
      } else {
        // 助手消息：若当前不是 agent 批次，先落盘并新建 agent 批次
        if (!currentDisplayEvents || currentDisplayEvents.type === 'user') {
          if (currentDisplayEvents) {
            resDisplayEvents.push(currentDisplayEvents);
          }
          currentDisplayEvents = { type: 'agent', sourceStartIndex: eventIndex, events: [event] };
        } else {
          currentDisplayEvents.events.push(event);
        }
      }
    });

    if (currentDisplayEvents) {
      resDisplayEvents.push(currentDisplayEvents);
    }

    return resDisplayEvents;
  }


  progressScoreFormat = (percent: number) => `${percent}分`;

  onAgentSubmit(form: NgForm) {
    if (this.agentLoopRunning) {
      return;
    }
    const content = this.userInput.trim();
    if (!content) {
      return;
    }

    this.pushNewAgentEvent.emit({
      type: 'user_message',
      payload: { content },
    });
    this.userInput = '';
    form.resetForm({ userInput: '' });
    this.scrollChatToBottomNextTick('smooth');
  }

  onKeyDown(event: KeyboardEvent, form: NgForm) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onAgentSubmit(form);
    }
  }

  toggleAgentToolItem(tool: AgentLoopToolMenuItem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!tool.toggleable) {
      return;
    }
    this.toggleAgentTool.emit(tool.name);
  }

  saveByok(): void {
    this.saveByokConfig.emit({
      baseUrl: this.byokBaseUrlDraft.trim(),
      model: this.byokModelDraft.trim(),
      apiKey: this.byokApiKeyDraft.trim(),
    });
  }

  useMatrixModel(): void {
    this.byokBaseUrlDraft = '';
    this.byokModelDraft = 'qwen3-max';
    this.byokApiKeyDraft = '';
    this.clearByokConfig.emit();
  }

  handleByokDropdownVisibleChange(visible: boolean): void {
    if (!visible) {

      return;
    }
    this.refreshByokConfig.emit();
  }

  isAgentToolEnabled(toolName: AgentLoopToolNameDisplay, event: Event): boolean {
    // 应该用 [nzClickHide]
    // event.stopPropagation();
    return this.enabledAgentTools.includes(toolName);
  }

  exportCurrentConversation(): void {
    if (!this.currentConversation) {
      return;
    }

    this.exportPreviewContent = buildConversationExportText(this.currentConversation.events);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.exportFileName = `conversation-${this.currentConversation.conversationId}-${timestamp}`;
    this.exportPreviewVisible = true;
  }

  closeExportPreview(): void {
    this.exportPreviewVisible = false;
  }

  downloadExportPreview(ext: string = "txt"): void {
    if (!this.exportPreviewContent.trim()) {
      return;
    }

    const blob = new Blob([this.exportPreviewContent], { type: 'text/plain;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = `${this.exportFileName}.${ext}`;
    anchor.click();
    URL.revokeObjectURL(blobUrl);
  }
}
