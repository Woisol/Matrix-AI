import { inject, Injectable } from "@angular/core";
import { ApiHttpService } from "../../api/util/api-http.service";
import { NotificationService } from "../notification/notification.service";
import { AssignId, CourseId } from "../../api/type/general";

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiHttpService) { }
  notify = inject(NotificationService)

  // @todo 将错误返回值改回 []
  // getAssignData$(courseId: CourseId, assigId: AssignId) {
  //   return this.api.get$<AssignData>(`/courses/${courseId}/assignments/${assigId}`).pipe(
  //     catchError((e: HttpErrorResponse) => {
  //       let msg = '无法获取作业数据: ' + (e.status === 500 ? "服务器连接异常，请确认服务器状态。" : e.message)
  //       this.notify.error(msg)
  //       return of(undefined)
  //     })
  //   );
  // }
}
