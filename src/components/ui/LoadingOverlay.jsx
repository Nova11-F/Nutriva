import Spinner from "./Spinner";

export default function LoadingOverlay({
  show = false,
  message = "Memuat...",
  fullScreen = true,   
}) {
  if (!show) return null;

  return (
    <div
      className={`${
        fullScreen ? "fixed" : "absolute"
      } inset-0 z-[90] flex items-center justify-center bg-white/70 backdrop-blur-sm`}
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-xl">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
}