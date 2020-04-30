import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})

export class PieChartComponent {

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
