"use client";

import { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLoginStore } from "@/store/useLoginStore";
import { WebsocketService, DrawingAction } from "./websocket-service";
import * as pdfjsLib_ from "pdfjs-dist/legacy/build/pdf";
const pdfjsLib = pdfjsLib_ as any;

// PDF.js 워커 경로 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function ChatCanvasPage() {
  const params = useParams();
  const canvasId = Array.isArray(params.id) ? params.id[0] : params.id;
  const accessToken = useLoginStore((s) => s.accessToken);

  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#ff0000");
  const [lineWidth, setLineWidth] = useState(2);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");

  const websocketService = useRef(new WebsocketService());

  const applyToolSettings = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (tool === "pen") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    } else {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = lineWidth * 10;
    }
  };

  const redrawCanvas = (preserveDrawing = false) => {
    const container = containerRef.current;
    const bgCanvas = bgCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!container || !bgCanvas || !drawCanvas) return;

    let tempCanvas: HTMLCanvasElement | null = null;
    if (preserveDrawing) {
      tempCanvas = document.createElement("canvas");
      tempCanvas.width = drawCanvas.width;
      tempCanvas.height = drawCanvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) tempCtx.drawImage(drawCanvas, 0, 0);
    }

    if (bgCanvas.width !== container.offsetWidth || bgCanvas.height !== container.offsetHeight) {
      bgCanvas.width = container.offsetWidth;
      bgCanvas.height = container.offsetHeight;

      if (!imageLoaded) {
        const bgCtx = bgCanvas.getContext("2d");
        if (bgCtx) {
          const img = new Image();
          img.src = "/example.jpg";
          img.onload = () => {
            bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            bgCtx.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height);
            setImageLoaded(true);
          };
        }
      }
    }

    if (
      drawCanvas.width !== container.offsetWidth ||
      drawCanvas.height !== container.offsetHeight
    ) {
      drawCanvas.width = container.offsetWidth;
      drawCanvas.height = container.offsetHeight;
    }

    if (preserveDrawing && tempCanvas) {
      const drawCtx = drawCanvas.getContext("2d");
      if (drawCtx) {
        drawCtx.drawImage(tempCanvas, 0, 0);
        applyToolSettings();
      }
    }
  };

  useEffect(() => {
    redrawCanvas();
    setImageLoaded(true);
    const resizeHandler = () => redrawCanvas(true);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => applyToolSettings(), [tool, color, lineWidth]);
  useEffect(() => redrawCanvas(true), [orientation]);

  useEffect(() => {
    const handleRemoteDrawingAction = (action: DrawingAction) => {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (action.type === "START" || action.type === "DRAW") {
        ctx.strokeStyle = action.color;
        ctx.lineWidth = action.lineWidth;
        ctx.globalCompositeOperation = action.tool === "pen" ? "source-over" : "destination-out";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }

      switch (action.type) {
        case "START":
          ctx.beginPath();
          ctx.moveTo(action.x, action.y);
          break;
        case "DRAW":
          ctx.lineTo(action.x, action.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(action.x, action.y);
          break;
        case "END":
          ctx.beginPath();
          break;
        case "CLEAR":
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          break;
      }
    };

    if (canvasId && accessToken) {
      websocketService.current.connect(canvasId, accessToken, handleRemoteDrawingAction);
    }

    return () => websocketService.current.disconnect();
  }, [canvasId, accessToken]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageLoaded || !canvasId) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    websocketService.current.sendDrawingAction(canvasId, {
      canvasId,
      type: "START",
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      color,
      lineWidth,
      tool,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current || !imageLoaded || !canvasId) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "pen") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    } else {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = lineWidth * 5;
    }

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    websocketService.current.sendDrawingAction(canvasId, {
      canvasId,
      type: "DRAW",
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      color,
      lineWidth,
      tool,
    });
  };

  const handleMouseUp = () => {
    if (!canvasId) return;
    isDrawing.current = false;
    websocketService.current.sendDrawingAction(canvasId, {
      canvasId,
      type: "END",
      x: 0,
      y: 0,
      color: "",
      lineWidth: 0,
      tool: "pen",
    });
  };
  const handleMouseLeave = () => {
    isDrawing.current = false;
  };

  const clearDrawing = (sendAction = true) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (sendAction && canvasId) {
      websocketService.current.sendDrawingAction(canvasId, {
        canvasId,
        type: "CLEAR",
        x: 0,
        y: 0,
        color: "",
        lineWidth: 0,
        tool: "pen",
      });
    }
  };

  // ========================
  // 파일 업로드
  // ========================
  const handleFile = async (file: File) => {
    const bgCanvas = bgCanvasRef.current;
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current;
    if (!container) return;

    bgCanvas.width = container.offsetWidth;
    bgCanvas.height = container.offsetHeight;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext) return;

    if (ext === "pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const scale = Math.min(
        container.offsetWidth / viewport.width,
        container.offsetHeight / viewport.height,
      );
      const scaledViewport = page.getViewport({ scale });

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;
      tempCanvas.width = scaledViewport.width;
      tempCanvas.height = scaledViewport.height;

      await page.render({ canvasContext: tempCtx, viewport: scaledViewport }).promise;
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      ctx.drawImage(tempCanvas, 0, 0, bgCanvas.width, bgCanvas.height);
      setImageLoaded(true);
    } else if (["png", "jpg", "jpeg"].includes(ext)) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        ctx.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height);
        setImageLoaded(true);
      };
    } else {
      alert("지원하지 않는 파일 형식입니다. PDF 또는 이미지 파일만 가능합니다.");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const containerStyle =
    orientation === "landscape"
      ? { width: "80vw", height: "45vw" }
      : { width: "60vw", height: "84vw" };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>회의실</h1>

      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={() => setTool("pen")}>펜</button>
        <button onClick={() => setTool("eraser")}>지우개</button>
        <button onClick={() => clearDrawing()}>전체 지우기</button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <label>굵기: {lineWidth}</label>
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        />

        <button
          onClick={() => setOrientation("landscape")}
          style={{ backgroundColor: orientation === "landscape" ? "#4CAF50" : "#eee" }}
        >
          가로 (PPT)
        </button>
        <button
          onClick={() => setOrientation("portrait")}
          style={{ backgroundColor: orientation === "portrait" ? "#4CAF50" : "#eee" }}
        >
          세로 (PDF)
        </button>

        <label style={{ padding: "0.5rem 1rem", backgroundColor: "#eee", cursor: "pointer" }}>
          파일 추가
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
        </label>

        <button
          onClick={() => {
            const bgCanvas = bgCanvasRef.current;
            const drawCanvas = drawCanvasRef.current;
            if (!bgCanvas || !drawCanvas) return;

            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = bgCanvas.width;
            tempCanvas.height = bgCanvas.height;
            const ctx = tempCanvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(bgCanvas, 0, 0);
            ctx.drawImage(drawCanvas, 0, 0);

            const link = document.createElement("a");
            link.download = `canvas-${Date.now()}.png`;
            link.href = tempCanvas.toDataURL("image/png");
            link.click();
          }}
        >
          파일로 저장
        </button>
      </div>

      <div
        ref={containerRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          position: "relative",
          border: "1px solid black",
          ...containerStyle,
        }}
      >
        <canvas ref={bgCanvasRef} style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }} />
        <canvas
          ref={drawCanvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            cursor: tool === "eraser" ? "cell" : "crosshair",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    </div>
  );
}
