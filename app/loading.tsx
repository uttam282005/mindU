"use client"

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-[40%_60%_50%_50%] bg-gradient-to-br from-teal-300 to-purple-400 animate-[calmBlob_4s_ease-in-out_infinite] opacity-90" />
      </div>

      <style jsx global>{`
        @keyframes calmBlob {
          0% {
            border-radius: 42% 58% 60% 40%;
            transform: scale(1);
          }
          33% {
            border-radius: 60% 40% 42% 58%;
            transform: scale(1.04);
          }
          66% {
            border-radius: 56% 44% 50% 50%;
            transform: scale(0.96);
          }
          100% {
            border-radius: 42% 58% 60% 40%;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

