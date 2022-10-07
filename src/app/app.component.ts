import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Tarefa } from './tarefa';
import { TarefaService } from './tarefa.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public tarefas!: Tarefa[];
  public maxOrder: number;
  public modalType: Function;
  public editarTarefa: Tarefa;
  public modalBtn: string;

  title = 'lista-tarefas';
  constructor(private tarefaService: TarefaService) {
    this.maxOrder = 0;
    this.modalType = this.addTarefa;
    this.modalBtn = 'Criar Novo';

    this.editarTarefa = {
      id:0,
      nomeTarefa:'',
      custoTarefa:0,
      dataTarefa:'',
      ordemTarefa:0
    }
   }

  ngOnInit() {
    this.getTarefas();
  }

  public getTarefas(): void {
    this.tarefaService.getTarefas()
      .subscribe((response: Tarefa[]) => {
        this.tarefas = response.sort((a,b) => a.ordemTarefa - b.ordemTarefa);;
        if(response.length >= 1) this.maxOrder = Math.max(...response.map( x => x.ordemTarefa))+1;
      },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
  }

  public clearEdit():void {
    this.editarTarefa = {
      id:0,
      nomeTarefa:'',
      custoTarefa:0,
      dataTarefa:'',
      ordemTarefa:this.maxOrder
    }
    console.log(this.editarTarefa);
  }

  public validarNome(nomeTarefa: string): Boolean{
    if(this.tarefas.find(x => x.nomeTarefa == nomeTarefa)){
      alert('Não são permitidos nomes iguais nas tarefas');
      return true;
    } else return false;
  }

  public setModal(type: string, tarefa?: Tarefa): void{
    if(type == 'add') { 
      this.clearEdit();
      this.modalType = this.addTarefa;
      this.modalBtn = 'Criar Novo';
    }
    if(type == 'edit' && tarefa != undefined) {
      this.modalType = this.updateTarefa;
      this.modalBtn = 'Editar';
      this.editarTarefa = tarefa;
    }
    if(type == 'delete' && tarefa != undefined) {
      this.editarTarefa.id = tarefa.id;
     }
  }

  public addTarefa(addForm: NgForm): void {
    if (this.validarNome(addForm.value.nomeTarefa)) return;
    document.getElementById('closeModal')?.click();
    this.tarefaService.addTarefa(addForm.value).subscribe((response: Tarefa) => {
      this.getTarefas();
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    })
    this.clearEdit();
  }

  public updateTarefa(addForm: NgForm): void {
    if (this.validarNome(addForm.value.nomeTarefa)) return;
    document.getElementById('closeModal')?.click();
    this.editarTarefa.nomeTarefa = addForm.value.nomeTarefa;
    this.editarTarefa.custoTarefa = addForm.value.custoTarefa;
    this.editarTarefa.dataTarefa = addForm.value.dataTarefa;

    this.tarefaService.updateTarefa(this.editarTarefa).subscribe((response: Tarefa) => {
      this.getTarefas();
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    })
  }

  public deleteTarefa(id: number): void{
    document.getElementById('closeModalDelete')?.click();
    this.tarefaService.deleteTarefa(id).subscribe((response: Tarefa) => {
      this.getTarefas();
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    })
  }

}
