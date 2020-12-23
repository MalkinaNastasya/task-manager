import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../shared/models/task.model';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  demonstrateTask = true;
  @Input() task;
  @Output() del = new EventEmitter<number>();
  
  constructor(private router: Router, private mainService: MainService) {}
  
  async ngOnInit() {
    if (this.task == undefined) {
      this.demonstrateTask = false;
    }
  }
  
   // Функция, которая переводит на страницу изменения карточки
  onLinkTask(id_task) {
    this.router.navigate(["/editor-card", id_task]);
  }
  
  // Функция удаления карточки
  async onDeleteTask(id_task) {
    try {
      let result = await this.mainService.delete(`/delete/${id_task}`);
    } catch (error) {
      console.log(error);
    }
    this.del.emit(id_task);
  }

  //Функция изменения статуса
  async onChangeStatus(id_task){
    try {
      let newTask = new Task(
        this.task.id_task,
        this.task.id_user,
        this.task.title,
        this.task.body,
        this.task.time,
         this.task.status = "Выполнено"
      );
      let result = await this.mainService.put(
        JSON.stringify(newTask),
        `/changeStatus/${id_task}`);
    } catch (error) {
      console.log(error);
    }
   }
  }
  
  