import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// Dados simulados para a UI
const mockCurrencies = [
  {'name': 'Bitcoin', 'symbol': 'BTC', 'price': 350123.45, 'change': -0.67},
  {'name': 'Ethereum', 'symbol': 'ETH', 'price': 22456.12, 'change': 2.60},
  {'name': 'Cardano', 'symbol': 'ADA', 'price': 2.55, 'change': -1.47},
];

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryColor = const Color(0xFFF0B90B);
    const backgroundColor = const Color(0xFF0B0B0B);
    const surfaceColor = const Color(0xFF1E1E1E);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: surfaceColor,
        elevation: 0,
        title: Text(
          'HoldCrypto',
          style: GoogleFonts.inter(
            color: primaryColor,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_outline, color: Colors.white),
            onPressed: () {
              // TODO: Navegar para a tela de perfil
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          Text(
            'Moedas',
            style: GoogleFonts.inter(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          // Lista de Moedas
          ...mockCurrencies.map((coin) => CoinListTile(coin: coin)),
        ],
      ),
    );
  }
}

// Widget para cada item da lista de moedas
class CoinListTile extends StatelessWidget {
  final Map<String, dynamic> coin;
  const CoinListTile({super.key, required this.coin});
  
  String _formatPrice(double price) {
    return 'R\$ ${price.toStringAsFixed(2).replaceAll('.', ',')}';
  }

  @override
  Widget build(BuildContext context) {
    final bool isPositive = coin['change'] >= 0;
    final primaryColor = const Color(0xFFF0B90B);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          // Ícone da Moeda
          CircleAvatar(
            backgroundColor: primaryColor,
            child: Text(
              coin['symbol']![0],
              style: const TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 12),
          // Nome e Símbolo
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  coin['name']!,
                  style: GoogleFonts.inter(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  coin['symbol']!,
                  style: GoogleFonts.inter(
                    color: Colors.grey[500],
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          // Preço e Variação
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                _formatPrice(coin['price']!),
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              Text(
                '${isPositive ? '+' : ''}${coin['change']}%',
                style: GoogleFonts.inter(
                  color: isPositive ? Colors.greenAccent[400] : Colors.redAccent[400],
                  fontSize: 14,
                  fontWeight: FontWeight.w600
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

