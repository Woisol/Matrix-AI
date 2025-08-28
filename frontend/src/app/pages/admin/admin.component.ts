import { Component } from "@angular/core";

@Component({
  selector: 'matrix-admin',
  imports: [],
  standalone: true,
  template: `
<div class="admin-con">
  <h2>管理</h2>
  <span>此页面仅为方便数据处理，不做展示使用</span>
  <div class="grid-wrapper">
    <section class="">a</section>
    <section class="">b</section>
    <section class="">c</section>
  </div>
</div>
`,
  styles: `
  .admin-con{
    width: 100%;
    max-width: 1080px;
    padding: 20px 40px;
    margin: 0 auto;
  }
  .grid-wrapper{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    gap: 8px;
    &:nth-child(2) {
      background: black;
    }
  }
`,
})
export class AdminComponent {
}
