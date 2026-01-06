import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { IntroScene } from "./IntroScene";
import { ShowroomScene } from "./ShowroomScene";
import { FuelGauge } from "./FuelGauge";
import { STEPS } from "./steps";

export default function App() {
  const [entered, setEntered] = useState(false);

  const [fuelLevel, setFuelLevel] = useState(0);
  const [isFuelLidOpen, setIsFuelLidOpen] = useState(false);

  // 🔹 STEP STATE (single source of truth)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = STEPS[currentStepIndex];

  // 🔹 AUTO STEP ADVANCE LISTENER (from mesh clicks)
  useEffect(() => {
    const nextStep = () => {
      setCurrentStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    };

    window.addEventListener("STEP_NEXT", nextStep);
    return () => window.removeEventListener("STEP_NEXT", nextStep);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      {/* 🔹 FUEL HUD */}
      {entered && <FuelGauge fuel={fuelLevel} />}

      {/* 🔹 STEP UI (TOP CENTER) */}
      {entered && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            zIndex: 50,
          }}
        >
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((i) => Math.max(i - 1, 0))}
          >
            ◀ Prev
          </button>

          <div
            style={{
              padding: "12px 18px",
              color: "rgba(0,0,0,0.75)",
              background: "#fff",
              borderRadius: 10,
              minWidth: 340,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 14,
                marginBottom: 6,
              }}
            >
              Step {currentStepIndex + 1} / {STEPS.length}
            </div>
            <strong>{currentStep.name}</strong>
            <div
              style={{
                fontSize: 12,
                marginTop: 6,
                opacity: 0.85,
              }}
            >
              {currentStep.description}
            </div>
          </div>

          <button
            disabled={currentStepIndex === STEPS.length - 1}
            onClick={() =>
              setCurrentStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
            }
          >
            Next ▶
          </button>
        </div>
      )}

      {/* 🔹 THREE CANVAS */}
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 1.6, 6], fov: 45, near: 0.1, far: 100 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {!entered ? (
            <IntroScene onEnter={() => setEntered(true)} />
          ) : (
            <ShowroomScene
              fuelLevel={fuelLevel}
              setFuelLevel={setFuelLevel}
              isFuelLidOpen={isFuelLidOpen}
              setIsFuelLidOpen={setIsFuelLidOpen}
              currentStepIndex={currentStepIndex}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
