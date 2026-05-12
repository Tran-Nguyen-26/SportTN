import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-searchable-select',
  styles: [`
    .dd-wrap { position: relative; width: 100%; }

    .dd-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 0 12px;
      height: 38px;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #111827;
      box-sizing: border-box;
      transition: border-color .15s;
      user-select: none;
    }
    .dd-trigger:hover { border-color: #9ca3af; }
    .dd-trigger.open {
      border-color: #6366f1;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .dd-trigger i.tag-icon { font-size: 15px; color: #6b7280; }

    .selected-val { flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .selected-val.placeholder { color: #9ca3af; }

    .chevron { font-size: 16px; color: #6b7280; transition: transform .2s; margin-left: auto; }
    .open .chevron { transform: rotate(180deg); }

    .dd-panel {
      position: absolute;
      top: 100%; left: 0; right: 0;
      background: #ffffff;
      border: 1px solid #6366f1;
      border-top: none;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      z-index: 999;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }

    .dd-search-wrap {
      padding: 8px;
      border-bottom: 1px solid #f3f4f6;
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 15px;
      color: #9ca3af;
      pointer-events: none;
    }
    .dd-search {
      width: 100%;
      box-sizing: border-box;
      padding: 0 10px 0 32px;
      height: 34px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 13px;
      background: #f9fafb;
      color: #111827;
      outline: none;
      transition: border-color .15s;
    }
    .dd-search:focus { border-color: #6366f1; background: #fff; }

    .dd-list {
      max-height: 220px;
      overflow-y: auto;
      padding: 4px 0;
    }
    .dd-list::-webkit-scrollbar { width: 4px; }
    .dd-list::-webkit-scrollbar-track { background: transparent; }
    .dd-list::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

    .dd-group-label {
      padding: 6px 12px 2px;
      font-size: 11px;
      font-weight: 500;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: .6px;
    }

    .dd-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      font-size: 13px;
      color: #374151;
      cursor: pointer;
      transition: background .1s;
    }
    .dd-item:hover { background: #f3f4f6; }
    .dd-item.selected {
      background: #eef2ff;
      color: #4f46e5;
      font-weight: 500;
    }
    .dd-item .check { margin-left: auto; font-size: 14px; color: #4f46e5; }

    .dd-empty {
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #9ca3af;
    }
    .dd-empty i { font-size: 20px; display: block; margin-bottom: 6px; }
  `],
  template: `
    <div class="dd-wrap">
      <div class="dd-trigger" [class.open]="isOpen" (click)="toggleOpen()">
        <i class="ti ti-tag tag-icon" aria-hidden="true"></i>
        <span class="selected-val" [class.placeholder]="!selected">
          {{ selected?.name || placeholder }}
        </span>
        <i class="ti ti-chevron-down chevron" aria-hidden="true"></i>
      </div>

      <div class="dd-panel" *ngIf="isOpen">
        <div class="dd-search-wrap">
          <i class="ti ti-search search-icon" aria-hidden="true"></i>
          <input
            class="dd-search"
            [(ngModel)]="query"
            placeholder="Tìm danh mục..."
            (click)="$event.stopPropagation()">
        </div>
        <div class="dd-list">
          <ng-container *ngFor="let group of filteredGroups">
            <div class="dd-group-label">{{ group.name }}</div>
            <div
              class="dd-item"
              *ngFor="let item of group.items"
              [class.selected]="value === item.id"
              (click)="select(item)">
              {{ item.name }}
              <i class="ti ti-check check" *ngIf="value === item.id" aria-hidden="true"></i>
            </div>
          </ng-container>
          <div class="dd-empty" *ngIf="filteredGroups.length === 0">
            <i class="ti ti-search-off" aria-hidden="true"></i>
            Không tìm thấy danh mục
          </div>
        </div>
      </div>
    </div>
  `
})
export class SearchableSelectComponent {
  @Input() options: any[] = [];
  @Input() value: number | null = null;
  @Input() placeholder = 'Chọn danh mục';
  @Output() valueChange = new EventEmitter<number>();

  isOpen = false;
  query  = '';

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.query  = '';
    }
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) this.query = '';
  }

  get selected() {
    return this.options.find(o => o.id === this.value) ?? null;
  }

  get filteredGroups() {
    const q = this.query.toLowerCase();
    return [{
      name: 'Tất cả',
      items: this.options.filter(o => o.name.toLowerCase().includes(q))
    }].filter(g => g.items.length);
  }

  select(item: any): void {
    this.valueChange.emit(item.id);
    this.isOpen = false;
    this.query  = '';
  }
}
