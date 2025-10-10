package org.team4.project.domain.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.team4.project.domain.chat.dto.DrawingAction;

//캔버스 웹소켓을 위한 컨트롤러
@Controller
@RequiredArgsConstructor
public class CanvasSocketController {
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/canvas/{canvasId}")
    public void handleDrawingAction(@DestinationVariable String canvasId, DrawingAction action){
        messagingTemplate.convertAndSend("/topic/canvas/" + canvasId, action);
    }



}
