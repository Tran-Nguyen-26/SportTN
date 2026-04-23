import { Component } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent {

  constructor(private sanitizer: DomSanitizer) {}

  activeSection = 'bar';

  sections = [
    { value: 'bar',     label: 'Bar Chart',     icon: 'bar_chart'      },
    { value: 'line',    label: 'Line Chart',    icon: 'show_chart'     },
    { value: 'pie',     label: 'Pie & Donut',   icon: 'pie_chart'      },
    { value: 'area',    label: 'Area Chart',    icon: 'area_chart'     },
    { value: 'radar',   label: 'Radar Chart',   icon: 'radar'          },
    { value: 'scatter', label: 'Scatter Plot',  icon: 'scatter_plot'   },
  ];

  // ── BAR CHART DATA ─────────────────────────────
  barOrientation: 'vertical' | 'horizontal' = 'vertical';

  barData = [
    { label: 'Bơi lội',    value: 340, color: '#3b82f6' },
    { label: 'Chạy bộ',    value: 280, color: '#22c55e' },
    { label: 'Chống nắng', value: 160, color: '#f97316' },
    { label: 'Bóng đá',    value: 120, color: '#a855f7' },
    { label: 'Tennis',     value: 85,  color: '#f59e0b' },
    { label: 'Cầu lông',   value: 74,  color: '#ec4899' },
    { label: 'Gym',        value: 96,  color: '#14b8a6' },
    { label: 'Đạp xe',     value: 52,  color: '#f43f5e' },
  ];

  get barMax(): number {
    return Math.max(...this.barData.map(d => d.value));
  }

  // ── LINE CHART DATA ────────────────────────────
  lineDatasets = [
    {
      label: 'Doanh thu 2025',
      color: '#3b82f6',
      values: [82, 94, 87, 105, 118, 125, 98, 86, 102, 108, 115, 125],
    },
    {
      label: 'Doanh thu 2024',
      color: '#94a3b8',
      dashed: true,
      values: [70, 80, 75, 90, 98, 108, 85, 72, 88, 94, 100, 110],
    },
  ];

  lineLabels = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
  lineMax    = 140;
  lineSteps  = [140, 105, 70, 35, 0];

  getLinePath(values: number[], w: number, h: number, max: number): string {
    const pts = values.map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - (v / max) * h;
      return `${x},${y}`;
    });
    return 'M ' + pts.join(' L ');
  }

  getAreaPath(values: number[], w: number, h: number, max: number): string {
    const line = this.getLinePath(values, w, h, max);
    return `${line} L ${w},${h} L 0,${h} Z`;
  }

  // ── PIE & DONUT ────────────────────────────────
  pieData = [
    { label: 'VNPay',   value: 42, color: '#3b82f6' },
    { label: 'COD',     value: 28, color: '#22c55e' },
    { label: 'Momo',    value: 18, color: '#f97316' },
    { label: 'Banking', value: 12, color: '#a855f7' },
  ];

  donutData = [
    { label: 'Hoàn thành', value: 76, color: '#22c55e' },
    { label: 'Đang giao',  value: 15, color: '#3b82f6' },
    { label: 'Đã hủy',     value: 5,  color: '#ef4444' },
    { label: 'Chờ xử lý',  value: 4,  color: '#f59e0b' },
  ];

  getPieSegments(data: { value: number; color: string }[]): string {
    let deg = 0;
    const segs = data.map(d => {
      const start = deg;
      deg += d.value * 3.6;
      return `${d.color} ${start}deg ${deg}deg`;
    });
    return `conic-gradient(${segs.join(', ')})`;
  }

  get pieStyle(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      this.getPieSegments(this.pieData)
    );
  }

  get donutStyle(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      this.getPieSegments(this.donutData)
    );
  }

  // ── AREA CHART ─────────────────────────────────
  areaDatasets = [
    {
      label: 'Khách mới',
      color: '#3b82f6',
      fill: '#3b82f620',
      values: [142, 128, 187, 215, 248, 196, 165, 178, 195, 210, 228, 245],
    },
    {
      label: 'Khách quay lại',
      color: '#22c55e',
      fill: '#22c55e20',
      values: [210, 198, 235, 268, 290, 312, 285, 298, 315, 330, 348, 365],
    },
  ];

  areaLabels = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
  areaMax    = 400;
  areaSteps  = [400, 300, 200, 100, 0];

  // ── RADAR CHART ────────────────────────────────
  radarLabels = ['Tốc độ', 'Chất lượng', 'Dịch vụ', 'Giá cả', 'Đa dạng', 'Giao hàng'];
  radarMax    = 100;

  radarDatasets = [
    {
      label:  'SportZone',
      color:  '#3b82f6',
      fill:   '#3b82f630',
      values: [88, 92, 85, 78, 90, 88],
    },
    {
      label:  'Đối thủ',
      color:  '#f97316',
      fill:   '#f9731630',
      values: [75, 80, 72, 85, 70, 80],
    },
  ];

  getRadarPoints(values: number[], cx: number, cy: number, r: number): string {
    const n = values.length;
    return values.map((v, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const dist  = (v / this.radarMax) * r;
      const x     = cx + dist * Math.cos(angle);
      const y     = cy + dist * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }

  getRadarLabelPos(i: number, n: number, cx: number, cy: number, r: number): { x: number; y: number } {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + (r + 18) * Math.cos(angle),
      y: cy + (r + 18) * Math.sin(angle),
    };
  }

  getRadarGridPoints(level: number, n: number, cx: number, cy: number, r: number): string {
    const ratio = level / 4;
    return Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const x     = cx + r * ratio * Math.cos(angle);
      const y     = cy + r * ratio * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }

  // ── SCATTER PLOT ───────────────────────────────
  scatterDatasets = [
    {
      label:  'Bơi lội',
      color:  '#3b82f6',
      points: [
        { x: 45, y: 88 }, { x: 62, y: 92 }, { x: 38, y: 74 },
        { x: 71, y: 85 }, { x: 55, y: 78 }, { x: 48, y: 95 },
        { x: 82, y: 89 }, { x: 35, y: 68 }, { x: 68, y: 82 },
      ],
    },
    {
      label:  'Chạy bộ',
      color:  '#22c55e',
      points: [
        { x: 52, y: 76 }, { x: 74, y: 88 }, { x: 43, y: 65 },
        { x: 66, y: 82 }, { x: 58, y: 90 }, { x: 79, y: 72 },
        { x: 41, y: 80 }, { x: 85, y: 95 }, { x: 61, y: 70 },
      ],
    },
    {
      label:  'Chống nắng',
      color:  '#f97316',
      points: [
        { x: 30, y: 55 }, { x: 48, y: 68 }, { x: 65, y: 72 },
        { x: 55, y: 60 }, { x: 72, y: 78 }, { x: 38, y: 62 },
        { x: 81, y: 85 }, { x: 44, y: 58 },
      ],
    },
  ];

  scatterXLabels = ['0','20','40','60','80','100'];
  scatterYLabels = ['100','80','60','40','20','0'];

  get totalBarValue(): number {
    return (this.barData || []).reduce((sum, item) => sum + (item.value || 0), 0);
  }

  get radarLines() {
    const center = 150;
    const radius = 110;
    const total = this.radarLabels.length;

    return this.radarLabels.map((label, i) => {
      const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
      return {
        x2: center + radius * Math.cos(angle),
        y2: center + radius * Math.sin(angle)
      };
    });
  }

  // Hàm kiểm tra xem giá trị của dataset hiện tại có phải lớn nhất tại chỉ số i không
  isWinner(currentValue: number, index: number): boolean {
    if (!this.radarDatasets || this.radarDatasets.length === 0) return false;

    // Lấy tất cả giá trị tại vị trí i của tất cả datasets
    const allValuesAtIndex = this.radarDatasets.map(d => d.values[index]);

    // Tìm giá trị lớn nhất
    const maxValue = Math.max(...allValuesAtIndex);

    return currentValue === maxValue;
  }
}
