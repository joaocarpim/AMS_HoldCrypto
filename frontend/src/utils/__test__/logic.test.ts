// src/__tests__/logic.test.ts
import '@testing-library/jest-dom';

// 1. Simulação da Lógica de Swap (Cálculo)
const calculateSwap = (amount: number, priceOrigin: number, priceTarget: number): number => {
    if (priceTarget === 0) return 0;
    const valueInBRL = amount * priceOrigin;
    return valueInBRL / priceTarget;
};

// 2. Simulação da Lógica de Formatação
const formatCurrency = (value: number): string => {
    // Mockando para garantir consistência no teste, já que locale depende do ambiente
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

describe('Lógica de Negócio (Frontend)', () => {
    
    test('Deve calcular corretamente o Swap de BRL para BTC', () => {
        const quantidadeBRL = 1000;
        const precoBRL = 1;
        const precoBTC = 500000; 

        const resultado = calculateSwap(quantidadeBRL, precoBRL, precoBTC);
        
        expect(resultado).toBe(0.002);
    });

    test('Deve calcular corretamente o Swap entre Criptos (ETH -> SOL)', () => {
        const qtdETH = 1;
        const precoETH = 10000; 
        const precoSOL = 500;   

        const resultado = calculateSwap(qtdETH, precoETH, precoSOL);
        
        expect(resultado).toBe(20);
    });

    test('Não deve quebrar com divisão por zero', () => {
        const resultado = calculateSwap(100, 1, 0); 
        expect(resultado).toBe(0);
    });

    test('Deve formatar valores monetários para padrão BRL', () => {
        const valor = 1500.50;
        expect(formatCurrency(valor)).toBe('R$ 1500,50'); 
    });
});