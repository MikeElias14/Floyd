import { ChartOptions } from 'chart.js';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent {

  @Input()
  options: ChartOptions = {
    responsive: true,
  };

  @Input()
  data: string[];

  @Input()
  labels: number[];

  @Input()
  legend = true;
}
