import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Tarefa } from "./tarefa";
import { environment } from "src/environments/environment";

@Injectable({providedIn:`root`})

export class TarefaService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    public getTarefas(): Observable<Tarefa[]>{
        return this.http.get<Tarefa[]>(`${this.apiUrl}`)
    }

    public addTarefa(tarefa: Tarefa): Observable<Tarefa>{
        return this.http.post<Tarefa>(`${this.apiUrl}/add`, tarefa)
    }

    public updateTarefa(tarefa: Tarefa): Observable<Tarefa>{
        return this.http.put<Tarefa>(`${this.apiUrl}/update`, tarefa)
    }

    public deleteTarefa(id: number): Observable<Tarefa>{
        return this.http.delete<Tarefa>(`${this.apiUrl}/delete/${id}`);
    }
}   