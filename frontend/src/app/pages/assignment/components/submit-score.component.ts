import { Component, Input, OnChanges, signal, SimpleChanges } from "@angular/core";
import { DatePipe } from "@angular/common";
import { getSubmitScoreStatus } from "../../../api/util/assig";
import { SubmitScoreStatus } from "../../../api/type/assigment";
import { NzIconModule } from "ng-zorro-antd/icon";

@Component({
  selector: "submit-score",
  imports: [DatePipe, NzIconModule],
  template: `
  <div class="submit-score" [style]="getStyleVariables()">
    <div class="score-con">
      <p class="score">
        <strong>{{score}}</strong>
        <span>/100</span>
      </p>
      <p class="submit-time">
        {{ submitTime | date:'yyyy-MM-dd HH:mm:ss' }} Submitted
      </p>
    </div>
    <!-- <nz-progress nzType="dashboard" [nzWidth]="80" [nzPercent]="assignData!.submit?.score ?? 0" [nzShowInfo]="true" [nzStrokeColor]="{ '10%': '#ee7373ff', '100%': '#97e973ff' }" [nzFormat]="progressScoreFormat" /> -->
    <div class="submit-status">
      @if(submitScoreStatus() === 'not-submitted'){
        <p>🤔你怎么还没有提交？</p>
      }@else if (submitScoreStatus() === 'not-passed') {
        <p>✏️还没有通过本题呢，\n再检查一下叭~</p>
        <span class="background" nz-icon nzType="reload" nzTheme="outline"></span>
      }@else if (submitScoreStatus() === 'passed') {
        <p>💪离满分就差一点点啦！\n再接再厉哦~</p>
        <span class="background" nz-icon nzType="rocket" nzTheme="outline"></span>
      }@else {
        <p>🎉恭喜你完整解出本题！\n请继续保持呢~</p>
        <span class="background" nz-icon nzType="check" nzTheme="outline"></span>
      }
    </div>
  </div>
  `,
  styles: `
  :host{
    --size-con: 150px;
  }
  p{
    /*! 这 margin 还导致 absolute 的居中不中的*/
    margin: 0;
  }
  .submit-score {
    height: var(--size-con);
    background: #fafafa;
    padding: 1em;
    border-radius: var(--size-radius);
    border: 1px solid #fafafa;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    overflow: hidden;

    .score{
      text-align: center;
      margin: -1em 0;
      strong{
        font-size: 64px;
        font-weight: bold;
        color: var(--color-score, #666);
        text-shadow: var(--box-shadow, 4px 4px 8px rgba(0, 0, 0, 0.2));
      }
    }
    .submit-time {
      font-size: 12px;
      color: #999;
      text-wrap: nowrap;
    }

    .submit-status {
      /*height: 100%;*/
      height: fit-content;
      position: relative;
      *{

      }
      .background{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display: block;
        font-size: calc(var(--size-con) - 20px);
        color: var(--color-score, #666);
        opacity: 0.1;
      }
      p {
        /*line-height: var(--size-con);*/
        color: black;
        white-space: pre-wrap;
        text-align: center;
        text-wrap: nowrap;
      }
    }
  }


  `
})
export class SubmitScoreComponent implements OnChanges {
  @Input() score: number | null | undefined = undefined;
  @Input() submitTime: Date | undefined = undefined;
  submitScoreStatus = signal<SubmitScoreStatus>('not-submitted')

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['score']) {
      // this.score = 100;
      //! 使用 == null 即可同时判断 null 和 undefined
      this.submitScoreStatus.set(this.score != null ? getSubmitScoreStatus(this.score) : 'not-submitted');
    }
  }

  getStyleVariables() {
    const status = this.submitScoreStatus();
    const colors = {
      'not-submitted': {
        '--color-score': '#999',
        '--box-shadow': '0px 0px 20px rgba(153, 153, 153, 0.4)'
      },
      'not-passed': {
        '--color-score': '#ee7373',
        '--box-shadow': '0px 0px 20px rgba(238, 115, 115, 0.4)'
      },
      'passed': {
        '--color-score': 'var(--color-primary)',
        '--box-shadow': '0px 0px 20px #479EA266'
      },
      'full-score': {
        '--color-score': '#14AE5C',
        '--box-shadow': '0px 0px 20px #14AE5C66'
      }
    };

    return colors[status] || colors['not-submitted'];
  }

}