import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// DrawingAction 모델을 이 파일에 직접 정의합니다.
export interface DrawingAction {
  canvasId: string;
  type: "START" | "DRAW" | "END" | "CLEAR";
  x: number;
  y: number;
  color: string;
  lineWidth: number;
  tool: "pen" | "eraser";
}

export class WebsocketService {
  private stompClient?: Client;
  private readonly backendUrl = "http://localhost:8080/ws-stomp"; // 백엔드 웹소켓 엔드포인트

  constructor() {}

  /**
   * 웹소켓 서버에 연결하고 특정 방(canvasId)의 토픽을 구독합니다.
   * @param canvasId 그림판의 고유 ID
   * @param accessToken 인증을 위한 JWT
   * @param onMessageReceived 서버로부터 메시지를 받았을 때 실행할 콜백 함수
   */
  public connect(
    canvasId: string,
    accessToken: string | null,
    onMessageReceived: (action: DrawingAction) => void,
  ): void {
    if (this.stompClient?.active) {
      console.log("Already connected");
      return;
    }

    if (!accessToken) {
      console.error("Authentication token is missing. Cannot connect.");
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.backendUrl),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: (frame) => {
        console.log("Connected: " + frame);

        this.stompClient?.subscribe(`/topic/canvas/${canvasId}`, (message) => {
          const action = JSON.parse(message.body) as DrawingAction;
          onMessageReceived(action);
        });
      },

      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },

      onWebSocketError: (event) => {
        console.error("WebSocket error: ", event);
      },
    });

    this.stompClient.activate();
  }

  /**
   * 서버로 그림 액션 메시지를 전송합니다.
   * @param canvasId 그림판의 고유 ID
   * @param action 전송할 그림 액션 데이터
   */
  public sendDrawingAction(canvasId: string, action: DrawingAction): void {
    if (this.stompClient?.active) {
      this.stompClient.publish({
        destination: `/app/canvas/${canvasId}`,
        body: JSON.stringify(action),
      });
    } else {
      console.error("STOMP client is not active.");
    }
  }

  /**
   * 웹소켓 연결을 종료합니다.
   */
  public disconnect(): void {
    this.stompClient?.deactivate();
    console.log("Disconnected");
  }
}