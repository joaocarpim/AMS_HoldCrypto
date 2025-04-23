import React from 'react';

interface WalletFormProps {
  id?: number;
  currency?: string;
  balance?: number;
  onClose: () => void;
}

const WalletForm: React.FC<WalletFormProps> = ({ id, currency, balance, onClose }) => {
  return (
    <div>
      <h2>{id ? 'Editar Carteira' : 'Adicionar Carteira'}</h2>
      <form>
        <input type="text" defaultValue={currency} placeholder="Moeda" />
        <input type="number" defaultValue={balance} placeholder="Saldo" />
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default WalletForm;