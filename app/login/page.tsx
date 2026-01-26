import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-8 animate-fade-in shadow-2xl border-white/5">
          <div className="text-center mb-10">
            <div className="relative w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <div className="absolute inset-0 bg-blue-500 opacity-20 blur-xl" />
              <span className="text-2xl font-bold text-blue-500 z-10">H</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Havana Dijital</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium uppercase tracking-widest">Müşteri Portalı</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
