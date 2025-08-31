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
      @if(submitScoreStatus() === 'full-score'){
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
      }

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
    position: relative;
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

    .score-con{
      position: relative;
    }

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

    .confetti {
      position: absolute;
      width: 8px;
      height: 8px;
      opacity: 0;
      z-index: 1;
    }

    .confetti:nth-child(odd) {
      background: #ff6b6b;
      border-radius: 50%;
    }

    .confetti:nth-child(even) {
      background: #4ecdc4;
    }

    .confetti:nth-child(3n) {
      background: #ffe66d;
      border-radius: 50%;
    }

    .confetti:nth-child(4n) {
      background: #95e1d3;
    }

    .confetti:nth-child(5n) {
      background: #ffa726;
      border-radius: 50%;
    }

    .confetti:nth-child(6n) {
      background: #ab47bc;
    }

    @keyframes confettiJump {
      0% {
        opacity: 1;
        transform: translate(0, 0) rotate(0deg) scale(1);
      }

      20% {
        opacity: 1;
        transform: translate(var(--jump-x), var(--jump-y)) rotate(180deg) scale(1.2);
      }

      100% {
        opacity: 0;
        transform: translate(var(--end-x), var(--end-y)) rotate(360deg) scale(0.3);
      }
    }

    /* 从 h1 中心向外跳出的彩片位置和动画 */
    .confetti:nth-child(1) {
      top: 50%;
      left: 10%;
      --jump-x: -30px;
      --jump-y: -40px;
      --end-x: -50px;
      --end-y: 60px;
      animation: confettiJump 2s ease-out 0.5s forwards;
    }

    .confetti:nth-child(2) {
      top: 30%;
      left: 20%;
      --jump-x: -20px;
      --jump-y: -50px;
      --end-x: -30px;
      --end-y: 80px;
      animation: confettiJump 2.2s ease-out 0.6s forwards;
    }

    .confetti:nth-child(3) {
      top: 20%;
      left: 50%;
      --jump-x: 0px;
      --jump-y: -60px;
      --end-x: 0px;
      --end-y: 100px;
      animation: confettiJump 2.1s ease-out 0.7s forwards;
    }

    .confetti:nth-child(4) {
      top: 30%;
      left: 80%;
      --jump-x: 20px;
      --jump-y: -50px;
      --end-x: 30px;
      --end-y: 80px;
      animation: confettiJump 2.3s ease-out 0.8s forwards;
    }

    .confetti:nth-child(5) {
      top: 50%;
      left: 90%;
      --jump-x: 30px;
      --jump-y: -40px;
      --end-x: 50px;
      --end-y: 60px;
      animation: confettiJump 2s ease-out 0.9s forwards;
    }

    .confetti:nth-child(6) {
      top: 70%;
      left: 80%;
      --jump-x: 25px;
      --jump-y: 30px;
      --end-x: 40px;
      --end-y: 70px;
      animation: confettiJump 2.4s ease-out 1s forwards;
    }

    .confetti:nth-child(7) {
      top: 80%;
      left: 50%;
      --jump-x: 0px;
      --jump-y: 40px;
      --end-x: 0px;
      --end-y: 90px;
      animation: confettiJump 2.2s ease-out 1.1s forwards;
    }

    .confetti:nth-child(8) {
      top: 70%;
      left: 20%;
      --jump-x: -25px;
      --jump-y: 30px;
      --end-x: -40px;
      --end-y: 70px;
      animation: confettiJump 2.1s ease-out 1.2s forwards;
    }

    .confetti:nth-child(9) {
      top: 40%;
      left: 15%;
      --jump-x: -35px;
      --jump-y: -20px;
      --end-x: -60px;
      --end-y: 40px;
      animation: confettiJump 2.3s ease-out 0.55s forwards;
    }

    .confetti:nth-child(10) {
      top: 40%;
      left: 85%;
      --jump-x: 35px;
      --jump-y: -20px;
      --end-x: 60px;
      --end-y: 40px;
      animation: confettiJump 2.4s ease-out 0.65s forwards;
    }

    .confetti:nth-child(11) {
      top: 60%;
      left: 15%;
      --jump-x: -30px;
      --jump-y: 20px;
      --end-x: -50px;
      --end-y: 50px;
      animation: confettiJump 2.1s ease-out 0.75s forwards;
    }

    .confetti:nth-child(12) {
      top: 60%;
      left: 85%;
      --jump-x: 30px;
      --jump-y: 20px;
      --end-x: 50px;
      --end-y: 50px;
      animation: confettiJump 2.2s ease-out 0.85s forwards;
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