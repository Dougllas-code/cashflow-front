import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SESSION_METHODS } from '../../constants/wsMethods';

/**
 * Service for managing session-related SignalR WebSocket connections.
 * Handles connecting to the session hub, listening for force logout events,
 * and notifying the server to force logout previous sessions.
 */
@Injectable({ providedIn: 'root' })
export class SessionSignalRService {
  private connection?: signalR.HubConnection;
  private logoutSubject = new Subject<void>();

  /**
   * Establishes a SignalR connection to the session hub using the provided token.
   * Sets up a listener for force logout events and notifies the server to force logout previous sessions.
   *
   * @param token - The authentication token used for the SignalR connection.
   */
  public connect(token: string): void {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.wsUrl}/sessionHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => token
      })
      .build();

    // Listener for force logout event
    this.connection.on(SESSION_METHODS.FORCE_LOGOUT, () => {
      this.logoutSubject.next();
    });

    // Start the connection and notify server to force logout previous sessions
    this.connection.start().then(() => {
      this.connection?.invoke(SESSION_METHODS.FORCE_LOGOUT_PREVIOUS_SESSIONS);
    });
  }

  /**
   * Returns an observable that emits when a force logout event is received from the server.
   *
   * @returns Observable that emits when a logout is triggered.
   */
  public onLogout(): Observable<void> {
    return this.logoutSubject.asObservable();
  }

  /**
   * Disconnects the SignalR connection to the session hub.
   */
  public disconnect(): void {
    this.connection?.stop();
  }
}
