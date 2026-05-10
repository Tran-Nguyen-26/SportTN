import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class VariantService {

  constructor() { }

  private readonly apiUrl = `${environment.apiUrl}/products`;
}
