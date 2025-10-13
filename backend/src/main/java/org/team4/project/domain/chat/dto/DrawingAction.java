package org.team4.project.domain.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrawingAction {
    private String canvasId;
    private ActionType type;

    private double x;
    private double y;

    private String color;
    private double lineWidth;
    private String tool;

    public enum ActionType{
        START, DRAW, END, CLEAR
    }
}
