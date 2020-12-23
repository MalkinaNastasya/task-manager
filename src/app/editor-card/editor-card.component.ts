import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../shared/models/task.model';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-editor-card',
  templateUrl: './editor-card.component.html',
  styleUrls: ['./editor-card.component.css']
})
export class EditorCardComponent implements OnInit {
  @Output() del = new EventEmitter<number>();
  // Логическая переменная, определяющая наличие или отсутсвие прелоадера
  loading = false;
  // Лoгическая переменная, определяющая режим чтения или редактирования включен
  editOrNot = true;
  res;
  Fstatus = "";

  formTask: FormGroup;
  task: any = {
    id_task: "",
    id_user: "",
    title: "",
    body: "",
    time: "",
    status: "",
  };
  item = {
    id: 0,
  };
  // Получение параметра роута id
  constructor(private router: Router, private activateRouter: ActivatedRoute, private mainService: MainService) {
    this.activateRouter.params.subscribe((param) => {
      this.item.id = +param.id_task;
    });
  }

  async ngOnInit() {            
    this.loading = true;
    // Отправка на сервер запроса для получения карточки товара по id
    try {
      this.res = await this.mainService.post(
        JSON.stringify(this.item),
        "/oneTask"
      );
    } catch (error) {
      console.log(error);
    }
    this.task = this.res[0];
    this.loading = false;
    if (this.task.id_task!= "") {
      // Инициализация FormGroup, создание FormControl, и назанчение Validators
      this.formTask = new FormGroup({
        title: new FormControl(`${this.task.title}`, [Validators.required]),
        body: new FormControl(`${this.task.body}`, [Validators.required]),
        status: new FormControl(`${this.task.status}`, [Validators.required]),
      });
    }
  }

  //Функция удаления карточки по id
  async onDeleteTask(id_task) {
    try {
      let result = await this.mainService.delete(`/delete/${id_task}`);
    } catch (error) {
      console.log(error);
    }
    this.del.emit(id_task);
  }

  // Оправляет запрос изменения информации в карточки на сервер или включает режим редактирования
  async onChangeTask() {
    if (!this.editOrNot) {
      if (this.formTask.value.status == 1){
        this.Fstatus = "Выполнено";
      } else {
        this.Fstatus = "Не выполнено"
      }
      let newTask = new Task(
        this.task.id_task,
        this.task.id_user,
        this.formTask.value.title,
        this.formTask.value.body,
        this.task.time,
        this.Fstatus,
      );
      console.log(this.task.id_task);
      
      try {
        let res = await this.mainService.put(
          JSON.stringify(newTask),
          `/tasks/${this.task.id_task}`
        );
      } catch (error) {
        console.log(error);
      }
      this.task.title = this.formTask.value.title;
      this.task.body = this.formTask.value.body;
      this.task.status = this.Fstatus;
    }
    this.editOrNot = !this.editOrNot;
  }
}
