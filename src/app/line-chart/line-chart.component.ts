import { Component, Input } from '@angular/core';
import { ChartOptions, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {

  options: ChartOptions = {
    responsive: true,
  };

  @Input()
  datasets: ChartDataSets;

  @Input()
  labels: Array<string>;

  @Input()
  legend = true;
}
