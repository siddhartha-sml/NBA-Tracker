import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TrackedTeam } from 'src/app/components/tracker/tracker.component';

export interface Team {
  abbreviation: string,
  city: string,
  conference: string,
  division: string,
  full_name: string,
  id: number,
  name: string
}

export interface Game {
  home_team: TrackedTeam[],
  visitor_team: TrackedTeam[],
  home_team_score: number,
  visitor_team_score: number
}

export interface TeamsResponse {
  data: TrackedTeam[]
}

export interface GamesResponse {
  data: TrackedTeam[]
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  header = new HttpHeaders({
    'X-RapidAPI-Key': environment.api_key,
    'X-RapidAPI-Host': environment.api_host
  });

  api_url = 'https://free-nba.p.rapidapi.com';

  constructor(private http: HttpClient) { }

  get_teams(): Observable<TeamsResponse> {
    return this.http.get<TeamsResponse>(`${this.api_url}/teams`,{ headers: this.header });
  }

  get_games(teamId: number,dates: string[]): Observable<GamesResponse> {
    let param = new HttpParams()
    .append('per_page', 100)
    .append('team_ids[]', teamId)

    dates.forEach((date: string) => {
      param = param.append('dates[]',date)
    });

    return this.http.get<GamesResponse>(`${this.api_url}/games`,{ headers: this.header, params: param });
  }
}
