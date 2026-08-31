import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { LoginView } from './components/auth/LoginView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';

const MainApp: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center p-2 animate-pulse">
          <img src="/sesi-escola-logo.png" alt="SESI Escola" className="h-8 w-auto object-contain" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-extrabold text-[#002B5C]">
            ICP — Iniciação Científica Pré - Universitária
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Carregando ambiente escolar...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#70B32D] selection:text-white">
      
      {/* Barra Superior Institucional SESI */}
      <Navbar />

      {/* Espaço de Trabalho Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentUser.role === 'admin' && <AdminDashboard />}
        {currentUser.role === 'teacher' && <TeacherDashboard />}
        {currentUser.role === 'student' && <StudentDashboard />}
      </main>

      {/* Rodapé Institucional SESI */}
      <footer className="w-full border-t border-slate-200 bg-white mt-16 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center h-8">
              <img 
                src="/sesi-escola-logo.png" 
                alt="Logotipo SESI Escola" 
                className="h-6 w-auto object-contain"
              />
            </div>
            <span className="text-[#002B5C] font-bold">
              ICP — Iniciação Científica Pré - Universitária • SESI RN
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs">
            <span className="text-slate-600 font-medium">
              Desenvolvido por <strong className="text-[#002B5C]">Mateus Zeca</strong> — Todos os direitos reservados
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#70B32D]"></span>
              Versão 2.7.2
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
