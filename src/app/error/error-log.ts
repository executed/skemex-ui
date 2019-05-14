export class ErrorLog {

  constructor(error, url, username) {
    this.name = error.name || null;
    this.username = username;
    this.status = error.status || null;
    this.message = error.message || error.toString();
    this.location = error.stack;
    this.url = url;
    this.fullId = `${this.appId}-${this.username}-${this.time}`;
  }

  public name: string ;
  public appId = 'skemex';
  public username: string;
  public time = new Date().getTime();
  public fullId: string;
  public location: string;
  public url;
  public status;
  public message: string;
}
