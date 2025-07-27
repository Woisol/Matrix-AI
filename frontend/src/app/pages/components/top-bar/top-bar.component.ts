import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzImageModule } from 'ng-zorro-antd/image';

type NavItem = {
  label: string;
  path: string;
}

@Component({
  selector: "app-top-bar",
  standalone: true,
  imports: [RouterLink, NzImageModule, NzAvatarModule],
  template: `
  <nav>
    <div class=""><img nz-image nzDisablePreview nzSrc="logo.svg" alt="" class="nav-icon"></div>
    <ul>
      @for (item of navItems; track item.label) {
        <li class="">
          <!-- 注意引入 RouterLink 才能使用不然补全都没有() -->
          <a [routerLink]="item.path">{{ item.label }}</a>
        </li>
      }
    </ul>
    <div class="user-menu">
      <nz-avatar [nzSize]="48" nzIcon="user" alt="" />
      <span>
        User
      </span>
  </div>
  </nav>
  `,
  styles: [`
  nav{
    width: 100vw;
    height: 48px;
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    padding: 0 60px;
    background-color: white;

    & img{
      height: 48px;
      /*width: 32px;*/
    }
  }
  ul{
    width: 100%;
    margin: 0;

    >li{
      display: inline-block;
      margin-right: 20px;
    }
  }

  .user-menu{
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 16px;
  }
  `]
})
// 不可在这里放 type 否则修饰器在此处无效。ts(1206)

export class TopBarComponent {
  // Add any necessary properties or methods here
  protected readonly navItems: NavItem[] = [
    { label: '题目', path: '/course/private' }
  ]
}