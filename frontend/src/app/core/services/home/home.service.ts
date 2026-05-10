import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/enviroment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse, HomeResponse} from "../../models/home-response/home-response";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private readonly API_URL = `${environment.apiUrl}/public/home`;

  constructor(private http: HttpClient) { }

  getHomeData(): Observable<ApiResponse<HomeResponse>> {
    return this.http.get<ApiResponse<HomeResponse>>(this.API_URL);
  }
}
