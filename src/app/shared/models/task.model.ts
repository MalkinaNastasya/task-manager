// Модель класса Задача
export class Task {
  public id_task: number;
  public id_user: number;
  public title: string;
  public body: string;
  public time: number;
  public status: string;
  constructor(id_task: number, id_user: number, title: string, body: string, time: number, status: string) {
    this.id_task = id_task;
    this.id_user = id_user;
    this.title = title;
    this.body = body;
    this.time = time;
    this.status = status;
  }
}
