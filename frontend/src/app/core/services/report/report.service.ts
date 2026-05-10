import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/enviroment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly apiUrl = `${environment.apiUrl}/admin/reports`;

  constructor(private http: HttpClient) {}

  exportRevenue(from: string, to: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/revenue`, {
      params: { from, to },
      responseType: 'blob'
    });
  }
}
