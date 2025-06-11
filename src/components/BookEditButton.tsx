'use client';

import { Pencil1Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

interface BotaoEditarLivrosProps {
  onToggle: (ativo: boolean) => void;
}

export default function BotaoEditarLivros({ onToggle }: BotaoEditarLivrosProps) {
  const [ativo, setAtivo] = useState(false);

  const alternarModo = () => {
    const novoEstado = !ativo;
    setAtivo(novoEstado);
    onToggle(novoEstado);
  };

  return (
    <button
      onClick={alternarModo}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
        ativo ? 'bg-red-600' : 'bg-indigo-600'
      } hover:opacity-90 transition`}
    >
      <Pencil1Icon className="w-5 h-5" />
      {ativo ? 'Cancelar Edição' : 'Editar Livros'}
    </button>
  );
}
