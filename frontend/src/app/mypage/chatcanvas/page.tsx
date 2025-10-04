"use client";
import { useRef, useEffect, useState } from "react";

export default function ChatCanvasPage() {
  const containerRef = useRef<HTMLDivElement>(null); // 전체 캔버스
  const bgCanvasRef = useRef<HTMLCanvasElement>(null); // 배경 캔버스
  const drawCanvasRef = useRef<HTMLCanvasElement>(null); // 그림 캔버스
  const isDrawing = useRef(false); // 마우스 드래그 중인지

  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#ff0000");
  const [lineWidth, setLineWidth] = useState(2);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape"); // 가로/세로 모드

  // 도구 설정을 캔버스 컨텍스트에 적용하는 함수
  const applyToolSettings = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (tool === "pen") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    } else if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = lineWidth * 10; // 지우개는 펜 설정의 10배 굵기
    }
  };

  // 캔버스 크기, 배경 이미지 갱신
  const redrawCanvas = (preserveDrawing = false) => {
    const container = containerRef.current;
    const bgCanvas = bgCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!container || !bgCanvas || !drawCanvas) return;

    // 현재 캔버스 임시 저장
    let tempCanvas: HTMLCanvasElement | null = null;
    if (preserveDrawing) {
      tempCanvas = document.createElement("canvas");
      tempCanvas.width = drawCanvas.width;
      tempCanvas.height = drawCanvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) tempCtx.drawImage(drawCanvas, 0, 0);
    }

    // 배경 캔버스 크기 갱신
    if (bgCanvas.width !== container.offsetWidth || bgCanvas.height !== container.offsetHeight) {
      bgCanvas.width = container.offsetWidth;
      bgCanvas.height = container.offsetHeight;

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

    // drawCanvas 크기 설정
    if (
      drawCanvas.width !== container.offsetWidth ||
      drawCanvas.height !== container.offsetHeight
    ) {
      drawCanvas.width = container.offsetWidth;
      drawCanvas.height = container.offsetHeight;
    }

    // preserveDrawing이 true라면 기존 그림 복원
    if (preserveDrawing && tempCanvas) {
      const drawCtx = drawCanvas.getContext("2d");
      if (drawCtx) {
        drawCtx.putImageData(
          tempCanvas.getContext("2d")!.getImageData(0, 0, tempCanvas.width, tempCanvas.height),
          0,
          0,
        );
        applyToolSettings();
      }
    }
  };

  useEffect(() => {
    redrawCanvas();
    setImageLoaded(true); // 일단 이미지 없어도 구동하도록 설정
    window.addEventListener("resize", () => redrawCanvas());
    return () => window.removeEventListener("resize", () => redrawCanvas());
  }, []);

  // 도구, 색상, 굵기가 변경될 때마다 설정을 다시 적용
  useEffect(() => {
    applyToolSettings();
  }, [tool, color, lineWidth]);

  useEffect(() => {
    redrawCanvas(true); // orientation 변경 시 기존 그림 유지
  }, [orientation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageLoaded) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current || !imageLoaded) return;
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
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleMouseLeave = () => {
    isDrawing.current = false;
  };

  const clearDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // 캔버스 가로/세로 비율 변경
  const containerStyle =
    orientation === "landscape"
      ? { width: "80vw", height: "45vw" } // PPT용 16:9 비율
      : { width: "60vw", height: "84vw" }; // PDF용 A4 비율

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>그림판</h1>

      {/* --- 툴바 --- */}
      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={() => setTool("pen")}>펜</button>
        <button onClick={() => setTool("eraser")}>지우개</button>
        <button onClick={clearDrawing}>전체 지우기</button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <label>굵기: {lineWidth}</label>
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
        />

        {/* --- 가로/세로 토글 버튼 --- */}
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
      </div>

      {/* --- 캔버스 영역 --- */}
      <div
        ref={containerRef}
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
