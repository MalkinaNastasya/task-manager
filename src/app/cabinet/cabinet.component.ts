import { Component, OnInit } from '@angular/core';
import { Task } from '../shared/models/task.model';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit {

  // Логическая переменная, определяющая наличие или отсутсвие прелоадера
  loading = false;
  // Логическая переменная, определяющая наличие или отсутсвие 
  notfound = false;
  id_user = localStorage.getItem("id_user");
  tasks: Task[] = [];
  
  constructor(private mainService: MainService) {}
 
  // Получение списка всех карточек,  имеющихся в БД
  async ngOnInit() {
    this.loading = true;
    try {
      let result = await this.mainService.get("/tasks");
      if (Object.keys(result).length == 0) {
        console.log("пусто");
        result = undefined;
      }
      if (typeof result !== "undefined") {
        this.notfound = false;
        console.log(result); 
        for (const one in result) {
          if (result[one].id_user == this.id_user){
          this.tasks.push(
            new Task(
              result[one].id_task,
              result[one].id_user,
              result[one].title,
              result[one].body,
              result[one].time,
              result[one].status,
            )
          );
        }
        }
      } else {
        this.notfound = true;
      }
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }
   
  // Удаление из локального массива карточки по id
  onDeleteTask(id) {
    let index = this.tasks.findIndex((el) => {
      return el.id_task == id;
    });
    this.tasks.splice(index, 1);
    if (this.tasks.length == 0) {
      this.notfound = true;
    }
  }
 }
