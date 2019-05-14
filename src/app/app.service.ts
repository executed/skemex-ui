import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ErrorLog} from './error/error-log';
import {CreateWorkspaceModel, Employee, WorkspaceSearch} from './create-workspace/create-workspace.model';
import {Reservation} from './workspace/workspace.model';
import {Room} from './rooms/rooms.model';
import {environment} from '../environments/environment';
import {Office} from './office/office.model';
import {Floor} from './floor/floor.model';
import {Notification} from './notifications/notifications.model';
import {EmployeeSearch, RoomSearch} from './search/search.model';
import {Conflict} from './conflicts/conflicts.model';

@Injectable()
export class AppService {
  navConflictsCount: number;
  private floorUrl = `${environment.apiUrl}/floors`;
  private officeUrl = `${environment.apiUrl}/offices`;
  private roomsUrl = `${environment.apiUrl}/rooms`;
  private workspacesUrl = `${environment.apiUrl}/workspaces`;
  private organizationsUrl = `${environment.apiUrl}/organizations`;
  private employeesUrl = `${environment.apiUrl}/employees`;
  private reservationsUrl = `${environment.apiUrl}/reservations`;
  private notificstionsURL = `${environment.apiUrl}/notifications/byEmployee`;
  private updateNotificstionsURL = `${environment.apiUrl}/notifications`;
  private adminURL = `${environment.apiUrl}/admin`;
  private migrationConflictsURL = `${environment.apiUrl}/migrationConflicts`;

  constructor(private http: HttpClient) {
  }

  public makeNotificationsViewed(nickname): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.notificstionsURL + '/' + nickname, {headers: headers});
  }

  public getNotifications(nickname): Observable<any> {
    return this.http.get(this.notificstionsURL + '/' + nickname);
  }

  public getNotificationsCount(nickname): Observable<any> {
    return this.http.get(this.notificstionsURL + '/notificationsCount' + '/' + nickname);
  }

  public setViewedNotification(notification: Notification): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.updateNotificstionsURL, notification, {headers: headers});
  }

  public getRooms(floorId): Observable<any> {
    const headers = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const params = new HttpParams().set('floorId', floorId);
    return this.http.get(this.roomsUrl + '/byFloor', {params: params});
  }

  public getFloors(officeId): Observable<any> {
    const params = new HttpParams().set('officeId', officeId);
    return this.http.get(this.floorUrl, {params: params});
  }

  public getOffices(): Observable<any> {
    return this.http.get(this.officeUrl, {});
  }

  public getAllRooms(): Observable<any> {
    return this.http.get(this.roomsUrl);
  }

  public getWorkSpacesByRoom(roomId): Observable<any> {
    const params = new HttpParams().set('roomId', roomId);
    return this.http.get(this.workspacesUrl, {params: params});
  }

  public getRoom(roomId): Observable<any> {
    return this.http.get(this.roomsUrl + '/' + roomId);
  }

  public updateWorkspace(workspace: CreateWorkspaceModel): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.workspacesUrl, workspace, {headers: headers});
  }

  public updateRoom(room: Room): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.roomsUrl, room, {headers: headers});
  }

  public createWorkspace(workspace: CreateWorkspaceModel): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.workspacesUrl, workspace);
  }

  public deleteRoom(roomId: string): Observable<any> {
    return this.http.delete(this.roomsUrl + '/' + roomId);
  }

  public deleteFloor(floorId: string): Observable<any> {
    return this.http.delete(this.floorUrl + '/' + floorId);
  }

  public deleteOffice(officeId: string): Observable<any> {
    return this.http.delete(this.officeUrl + '/' + officeId);
  }

  public createRoom(room: Room): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.roomsUrl, room, {headers});
  }

  public createOffice(office: Office): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.officeUrl, office, {headers});
  }

  public createFloor(floor: Floor): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.floorUrl, floor, {headers});
  }

  public getWorkSpace(workspaceId: number): Observable<any> {
    return this.http.get(this.workspacesUrl + '/' + workspaceId);
  }

  public getProjects(): Observable<any> {
    return this.http.get(this.organizationsUrl);
  }

  public getEmployeesByProject(projectId: number): Observable<any> {
    const params = new HttpParams().set('projectId', projectId.toString());
    return this.http.get(this.employeesUrl + '/byProject', {params: params});
  }

  getReservationToWorkspace(id: number): Observable<any> {
    return this.http.get(this.reservationsUrl + '/workspace/' + id.toString());
  }

  public updateReservation(reservation: Reservation): Observable<any> {
    return this.http.put(this.reservationsUrl, reservation);
  }

  public createReservationRequest(reservation: Reservation): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.reservationsUrl, reservation, {headers: headers});
  }

  public getMigrationConflicts(nickname: string): Observable<any> {
    return this.http.get(this.migrationConflictsURL + `/byEmployee/${nickname}/allNotViewed`);
  }

  public getMigrationConflictsCount(nickname: string): Observable<any> {
    return this.http.get(this.migrationConflictsURL + `/byEmployee/${nickname}/allNotViewedCount`);
  }

  public resolveConflictById(source: string, conflict: Conflict): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.migrationConflictsURL + `/resolveId/${conflict.id}/accept/${source}`, conflict, {headers: headers});
  }

  createEmployee(employee: Employee): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.employeesUrl, employee, {headers});
  }

  removeWorkspace(id: number): Observable<any> {
    return this.http.delete(this.workspacesUrl + '/' + id);
  }

  getEmployeeByNickname(nick: String): Observable<any> {
    return this.http.get(this.employeesUrl + '/' + nick);
  }

  isPresent(nick: String): Observable<any> {
    return this.http.get(this.employeesUrl + '/isPresent/' + nick);
  }

  isFloorAvailable(floorNumber: string, officeId: number): Observable<any>{
    const params = new HttpParams().set('floorNumber', floorNumber).set("officeId", officeId+'');
    return this.http.get(this.floorUrl + '/isAvailable' ,{params: params});
  }

  isTimeForRequestAvailable(dateModel: Reservation): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.reservationsUrl + '/isAvailable', dateModel, {headers});
  }

  searchRooms(roomSearch: RoomSearch): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.roomsUrl + '/filter', roomSearch, {headers});
  }

  searchWorkspaces(workspaceSearch: WorkspaceSearch): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.workspacesUrl + '/filter', workspaceSearch, {headers});
  }

  searchEmployee(employeeSearch: EmployeeSearch): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.employeesUrl + '/search', employeeSearch, {headers});
  }

  saveAllWorkspaces(workSpaces: Array<CreateWorkspaceModel>, roomId: Number): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.workspacesUrl + '/saveAll/' + roomId, workSpaces, {headers});
  }
}

