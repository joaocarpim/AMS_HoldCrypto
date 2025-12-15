// Caminho: backend/walletApi/Infrastructure/Repositories/WalletRepository.cs
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

public class WalletRepository : IWalletRepository
{
    private readonly WalletDbContext _context;
    public WalletRepository(WalletDbContext context) { _context = context; }

    public IEnumerable<Wallet> GetWalletsByUser(int userId, WalletCategory? category = null)
    {
        var query = _context.Wallets.AsQueryable().Where(w => w.UserId == userId);
        if (category.HasValue)
            query = query.Where(w => w.Category == category.Value);
        return query.ToList();
    }

    public Wallet GetWalletById(int id)
    {
        // Usar FindAsync seria melhor se o método fosse async
        return _context.Wallets.Find(id);
    }

    public Wallet CreateWallet(Wallet wallet)
    {
        _context.Wallets.Add(wallet);
        _context.SaveChanges();
        return wallet;
    }

    public bool UpdateWallet(Wallet wallet)
    {
        _context.Wallets.Update(wallet);
        return _context.SaveChanges() > 0;
    }

    public bool DeleteWallet(int id)
    {
        var w = _context.Wallets.Find(id);
        if (w == null) return false;
        _context.Wallets.Remove(w);
        return _context.SaveChanges() > 0;
    }

    public WalletTransaction CreateTransaction(WalletTransaction transaction)
    {
        var wallet = _context.Wallets.Find(transaction.WalletId);
        if (wallet == null) throw new InvalidOperationException("Wallet not found");

        if (transaction.Type == TransactionType.Deposit)
        {
            wallet.Balance += transaction.Amount;
        }
        else if (transaction.Type == TransactionType.Withdraw)
        {
            // Adicionada verificação de saldo que faltava no seu original
            if (wallet.Balance < transaction.Amount)
            {
                throw new InvalidOperationException("Saldo insuficiente para saque.");
            }
            wallet.Balance -= transaction.Amount;
        }
        
        _context.WalletTransactions.Add(transaction);
        _context.SaveChanges();
        return transaction;
    }

    public bool Transfer(int fromWalletId, int toWalletId, decimal amount)
    {
        // O seu código original para Transfer está correto,
        // mas o ExecuteTrade é mais completo para trocas.
        // Vamos assumir que este Transfer é para a mesma moeda (Spot -> Funding)
        var from = _context.Wallets.Find(fromWalletId);
        var to = _context.Wallets.Find(toWalletId);
        if (from == null || to == null) return false;
        if (from.UserId != to.UserId) return false; // Boa verificação
        if (from.Balance < amount) return false; // Boa verificação

        from.Balance -= amount;
        to.Balance += amount;

        // Recriando as transações que estavam comentadas
        var txOut = new WalletTransaction { 
            WalletId = fromWalletId, 
            Type = TransactionType.Transfer, 
            Amount = amount, 
            Notes = $"Transfer to {to.Name}" 
        };
        var txIn = new WalletTransaction { 
            WalletId = toWalletId, 
            Type = TransactionType.Transfer, 
            Amount = amount, 
            Notes = $"Transfer from {from.Name}" 
        };
        _context.WalletTransactions.Add(txOut);
        _context.WalletTransactions.Add(txIn);

        _context.SaveChanges();
        return true;
    }

    public Tuple<Wallet, Wallet> ExecuteTrade(int fromWalletId, int toWalletId, decimal amountToSpend, decimal amountToReceive)
    {
        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var fromWallet = _context.Wallets.Find(fromWalletId);
                var toWallet = _context.Wallets.Find(toWalletId);

                if (fromWallet == null || toWallet == null)
                    throw new InvalidOperationException("Carteira de origem ou destino não encontrada.");
                if (fromWallet.Balance < amountToSpend)
                    throw new InvalidOperationException("Saldo insuficiente.");

                fromWallet.Balance -= amountToSpend;
                toWallet.Balance += amountToReceive;

                _context.Wallets.Update(fromWallet);
                _context.Wallets.Update(toWallet);

                // Registar transações (RF-09)
                var txOut = new WalletTransaction
                {
                    WalletId = fromWalletId,
                    Type = TransactionType.Transfer, // Usar 'Transfer' como no seu código
                    Amount = amountToSpend,
                    Notes = $"Trade: {fromWallet.CurrencySymbol} -> {toWallet.CurrencySymbol}"
                };
                var txIn = new WalletTransaction
                {
                    WalletId = toWalletId,
                    Type = TransactionType.Transfer,
                    Amount = amountToReceive,
                    Notes = $"Trade: {fromWallet.CurrencySymbol} -> {toWallet.CurrencySymbol}"
                };
                _context.WalletTransactions.Add(txOut);
                _context.WalletTransactions.Add(txIn);

                _context.SaveChanges();
                transaction.Commit();

                return Tuple.Create(fromWallet, toWallet);
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }
    }

    // *** MÉTODO ADICIONADO PARA RF-09 (HISTÓRICO) ***
    public IEnumerable<WalletTransaction> GetTransactionsByUser(int userId)
    {
        // 1. Encontra todos os IDs de carteiras (Wallets) que pertencem ao userId
        var userWalletIds = _context.Wallets
            .Where(w => w.UserId == userId)
            .Select(w => w.Id) // Seleciona apenas os IDs
            .ToList();

        // 2. Busca todas as transações (WalletTransactions) onde o WalletId
        //    esteja na lista de IDs de carteira do usuário.
        // 3. Inclui a informação da Wallet (para sabermos o CurrencySymbol)
        // 4. Ordena por data (mais recentes primeiro)
        return _context.WalletTransactions
            .Include(t => t.Wallet) // <-- IMPORTANTE: Inclui a Wallet associada
            .Where(t => userWalletIds.Contains(t.WalletId))
            .OrderByDescending(t => t.CreatedAt)
            .ToList();
    }
}