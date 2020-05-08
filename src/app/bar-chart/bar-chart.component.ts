import { ChartOptions, ChartDataSets } from 'chart.js';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {

  @Input()
  options: ChartOptions = {
    responsive: true
  };

  @Input()
  datasets: ChartDataSets;

  @Input()
  labels: Array<string>;

  @Input()
  legend = true;
}
