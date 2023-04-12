import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface TeamResults {
  full_name: string,
  abbreviation: string,
  conference: string,
  games: GameResult[],
  form: string[],
  avg_points_scored: number,
  avg_points_conceded: number
}

export interface GameResult {
  home_team: {
    abbreviation: string
  },
  visitor_team: {
    abbreviation: string
  },
  home_team_score: number,
  visitor_team_score: number
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {

  gameResults: TeamResults = {
    full_name: '',
    abbreviation: '',
    conference: '',
    games: [{
      home_team: { abbreviation: '' },
      visitor_team: { abbreviation: '' },
      home_team_score: 0,
      visitor_team_score: 0
    }],
    form: [],
    avg_points_scored: 0,
    avg_points_conceded: 0
  };

  constructor(private router: Router) {
    this.gameResults = JSON.parse(sessionStorage.getItem('teamResults')!);
  }

  goBack(): void {
    this.router.navigateByUrl('tracker');
  }

}
