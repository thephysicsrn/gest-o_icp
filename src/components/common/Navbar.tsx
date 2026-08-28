import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  User, 
  LogOut, 
  ChevronDown,
  Mail,
  BadgeInfo,
  Phone
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#002B5C] text-white shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#70B32D]" />
            Administrador
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#002B5C] border border-blue-200 shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-[#002B5C]" />
            Professor Líder
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#528521] border border-emerald-200 shadow-xs">
            <User className="w-3.5 h-3.5 text-[#70B32D]" />
            Aluno Pesquisador
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador Regional';
      case 'teacher':
        return 'Professor Líder';
      case 'student':
        return 'Aluno Pesquisador';
      default:
        return 'Usuário';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logotipo Oficial SESI Escola e Nome Exato do Programa */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center h-12">
              <img 
                src="/sesi-escola-logo.png" 
                alt="Logotipo SESI Escola" 
                className="h-10 w-auto object-contain"
              />
            </div>
            
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <h1 className="text-base font-bold text-[#002B5C] leading-tight font-sans">
                ICP — Iniciação Científica Pré - Universitária
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Gestão dos Grupos de Pesquisa das Escolas SESI RN
              </p>
            </div>
          </div>

          {/* Controles de Usuário e Perfil */}
          {currentUser && (
            <div className="flex items-center gap-3">
              
              {/* Etiqueta da Unidade Escolar */}
              <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-700">
                <Building2 className="w-4 h-4 text-[#002B5C]" />
                <span className="truncate max-w-[240px] font-semibold">{currentUser.unit}</span>
              </div>

              {/* Botão e Menu de Perfil do Usuário Logado */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-xl text-sm cursor-pointer shadow-2xs"
                  aria-label="Abrir menu de perfil"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#002B5C] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold leading-tight truncate max-w-[150px] text-[#002B5C]">
                      {currentUser.name.split(' ')[0]} {currentUser.name.split(' ').slice(-1)[0]}
                    </p>
                    <p className="text-[11px] font-semibold text-[#528521] leading-tight">
                      {getRoleTitle(currentUser.role)}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown de Perfil Oficial */}
                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileMenu(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      {/* Cabeçalho do Perfil */}
                      <div className="p-4 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[#002B5C] text-white flex items-center justify-center font-bold text-base shadow-sm">
                            {currentUser.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#002B5C] truncate">
                              {currentUser.name}
                            </p>
                            <div className="mt-1">
                              {getRoleBadge(currentUser.role)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Informações Institucionais do Usuário */}
                      <div className="p-4 space-y-2.5 text-xs text-slate-600 bg-white">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate font-medium">{currentUser.email}</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-700">
                          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate font-medium">{currentUser.unit}</span>
                        </div>

                        {currentUser.matricula && (
                          <div className="flex items-center gap-2 text-slate-700">
                            <BadgeInfo className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate font-medium">Matrícula: {currentUser.matricula}</span>
                          </div>
                        )}

                        {currentUser.areaOrGrade && (
                          <div className="flex items-center gap-2 text-slate-700">
                            <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate font-medium">{currentUser.areaOrGrade}</span>
                          </div>
                        )}

                        {currentUser.phone && (
                          <div className="flex items-center gap-2 text-slate-700">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate font-medium">{currentUser.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Rodapé com Ação de Logout */}
                      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
                        <button
                          onClick={async () => {
                            setShowProfileMenu(false);
                            await logout();
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 transition-all cursor-pointer shadow-xs active:scale-98"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Encerrar Sessão</span>
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </header>
  );
};
