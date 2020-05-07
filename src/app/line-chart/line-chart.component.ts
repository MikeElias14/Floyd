import { Component, Input } from '@angular/core';
import { ChartOptions, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {

  @Input()
  options: ChartOptions = {
    responsive: true,
    elements: {
      point: {
        radius: 1
      },
      line: {
        tension: 0
      }
    }
  };

  @Input()
  colors: Array<any>;

  @Input()
  datasets: ChartDataSets;

  @Input()
  labels: Array<string>;

  @Input()
  legend = true;
}
