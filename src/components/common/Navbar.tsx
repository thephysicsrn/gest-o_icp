import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  User, 
  LogOut, 
  RotateCcw, 
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { resetDataToSeed } from '../../firebase/services/storageHelper';

export const Navbar: React.FC = () => {
  const { currentUser, switchUser, logout, allUsers } = useAuth();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#002B5C] text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-[#70B32D]" />
            Administrador
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#002B5C] border border-blue-200">
            <GraduationCap className="w-3.5 h-3.5 text-[#002B5C]" />
            Professor Líder
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#528521] border border-emerald-200">
            <User className="w-3.5 h-3.5 text-[#70B32D]" />
            Aluno
          </span>
        );
      default:
        return null;
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

          {/* Controles de Usuário e Troca Rápida de Perfil */}
          {currentUser && (
            <div className="flex items-center gap-3">
              
              {/* Etiqueta da Unidade Escolar */}
              <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-700">
                <Building2 className="w-4 h-4 text-[#002B5C]" />
                <span className="truncate max-w-[240px] font-semibold">{currentUser.unit}</span>
              </div>

              {/* Menu de Perfil / Troca Rápida */}
              <div className="relative">
                <button
                  onClick={() => setShowSwitchMenu(!showSwitchMenu)}
                  className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-xl text-sm"
                  title="Trocar perfil para demonstração"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#002B5C] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold leading-tight truncate max-w-[140px] text-[#002B5C]">
                      {currentUser.name.split(' ')[0]} {currentUser.name.split(' ').slice(-1)[0]}
                    </p>
                    <p className="text-[11px] font-semibold text-[#528521] leading-tight">
                      {currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'teacher' ? 'Professor Líder' : 'Aluno Pesquisador'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {/* Dropdown de Troca de Usuários */}
                {showSwitchMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowSwitchMenu(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      <div className="p-4 bg-slate-50 border-b border-slate-200">
                        <p className="text-xs font-bold text-[#002B5C] flex items-center gap-2 uppercase tracking-wide">
                          <UserCheck className="w-4 h-4 text-[#70B32D]" />
                          Alternar Usuário para Testes
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Selecione um perfil para navegar no sistema como Administrador, Professor ou Aluno:
                        </p>
                      </div>

                      <div className="max-h-72 overflow-y-auto p-2 space-y-1.5">
                        {allUsers.map((user) => (
                          <button
                            key={user.uid}
                            onClick={() => {
                              switchUser(user);
                              setShowSwitchMenu(false);
                            }}
                            className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between ${
                              user.uid === currentUser.uid 
                                ? 'bg-blue-50 text-[#002B5C] font-bold border border-blue-200 shadow-xs' 
                                : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                            }`}
                          >
                            <div className="truncate mr-2">
                              <p className="truncate font-semibold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-500 truncate">{user.unit.replace('SESI ', '')}</p>
                            </div>
                            {getRoleBadge(user.role)}
                          </button>
                        ))}
                      </div>

                      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            if (confirm('Deseja restaurar todos os dados para o padrão inicial do SESI?')) {
                              resetDataToSeed();
                            }
                          }}
                          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-600 font-medium transition-colors p-1"
                          title="Restaurar dados originais"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restaurar Dados
                        </button>
                        
                        <button
                          onClick={() => {
                            logout();
                            setShowSwitchMenu(false);
                          }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 p-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sair do Sistema
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
