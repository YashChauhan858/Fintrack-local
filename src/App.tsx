import { SplashCursor } from "./components/SplashCursor";
import UIrenderer from "./components/UIrenderer";

export default function App() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      {/* Background Animation */}
      <div className="fixed top-0 left-0 h-full w-full z-0">
        <SplashCursor />
      </div>

      <UIrenderer />
    </main>
  );
}
