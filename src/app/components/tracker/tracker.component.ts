import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Game, TeamsResponse, GamesResponse } from 'src/services/api.service';

interface FormDict {
  form: string[],
  games: Game[],
  avg_points_scored: number,
  avg_points_conceded: number
}

export interface TrackedTeam {
  abbreviation: string,
  conference: string,
  full_name: string,
  id: number,
  form: string[],
  games: Game[],
  avg_points_scored: number,
  avg_points_conceded: number
}

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {

  teamsData: TrackedTeam[] = [];
  teamIdTracked: number = 0;
  teamsTracked: TrackedTeam[] = [];
  dates: string[] = [];
  lastResults: TrackedTeam[] = [];
  formDict: FormDict = { form: [], games: [], avg_points_scored: 0, avg_points_conceded: 0};
  selectedTeamResults: {} = {};

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('teams_data')) {
      this.teamsData = JSON.parse(sessionStorage.getItem('teams_data')!);
    }
    if(sessionStorage.getItem('last_12_results_of_tracked_teams')) {
      this.lastResults = JSON.parse(sessionStorage.getItem('last_12_results_of_tracked_teams')!);
    }
    if(sessionStorage.getItem('teams_tracked')) {
      this.teamsTracked = JSON.parse(sessionStorage.getItem('teams_tracked')!);
    }
    if(sessionStorage.getItem('teams_data') == null)
      this.getTeamsData();
  }

  getTeamsData(): void {
    this.apiService.get_teams().subscribe((res: TeamsResponse)=>{
      this.teamsData = res['data'];
      sessionStorage.setItem('teams_data', JSON.stringify(this.teamsData));
    });
  }

  trackTeam(): void {
    this.teamsData.forEach((team: TrackedTeam)=>{
      if(team.id == this.teamIdTracked) {
        if(this.teamsTracked.indexOf(team) == -1){
          this.teamsTracked.push(team);
        }
      }
    })
    
    this.getGamesData();
  }

  getGamesData(): void {
    this.apiService.get_games(this.teamIdTracked,this.getLast12Dates()).subscribe((res: GamesResponse)=>{
      this.lastResults = res['data'];
      sessionStorage.setItem('last_12_results_of_tracked_teams', JSON.stringify(this.lastResults));
      this.getLastResults();
    });
  }

  getLast12Dates(): string[] {
    this.dates = [];
    let date: Date = new Date();
    for(let i = 1; i <= 12; i++) {
      date.setDate(date.getDate() - 1);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      this.dates.push(`${year}-${month}-${day}`);
    }
    return this.dates;
  }

  getLastResults(): void {
    this.formDict['form']=[];
    this.formDict['games']=[];
    this.formDict['avg_points_scored']=0;
    this.formDict['avg_points_conceded']=0;
    let points_scored = 0;
    let points_conceded = 0;
    this.lastResults.forEach((result: any)=>{
      if(result.home_team.id == this.teamIdTracked) {
        points_scored += result['home_team_score'];
        points_conceded += result['visitor_team_score'];
        if(result['home_team_score']>result['visitor_team_score']) {
          this.formDict['form'].push('W');
        }
        else if(result['home_team_score']<result['visitor_team_score']) {
          this.formDict['form'].push('L');
        }
      }
      else {
        points_scored += result['visitor_team_score'];
        points_conceded += result['home_team_score'];
        if(result['home_team_score']<result['visitor_team_score']) {
          this.formDict['form'].push('W');
        }
        else if(result['home_team_score']>result['visitor_team_score']) {
          this.formDict['form'].push('L');
        }
      }
      this.formDict['games'].push(result);
    });

    this.formDict['avg_points_scored'] = Math.round(points_scored/this.formDict['games'].length);
    this.formDict['avg_points_conceded'] = Math.round(points_conceded/this.formDict['games'].length);

    this.teamsTracked.forEach((team: TrackedTeam)=>{
      if(team.id == this.teamIdTracked) {
        team['form'] = this.formDict.form;
        team['games'] = this.formDict.games;
        team['avg_points_scored'] = this.formDict.avg_points_scored;
        team['avg_points_conceded'] = this.formDict.avg_points_conceded;
      }
    });
    sessionStorage.setItem('teams_tracked', JSON.stringify(this.teamsTracked));
  }

  removeTeam(id: number): void {
    this.teamsTracked = this.teamsTracked.filter((team: TrackedTeam) => { return team.id !== id });
    sessionStorage.setItem('teams_tracked', JSON.stringify(this.teamsTracked));
  }

  seeAllResults(teamId: number): void {
    this.teamsTracked.forEach((team: TrackedTeam)=>{
      if(team.id == teamId) {
        this.selectedTeamResults = team;
      }
    });
    this.router.navigateByUrl(`results/${teamId}`);
    sessionStorage.setItem('teamResults', JSON.stringify(this.selectedTeamResults));
  }

}
