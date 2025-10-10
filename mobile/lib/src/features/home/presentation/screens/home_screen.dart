import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:animate_do/animate_do.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryColor = const Color(0xFFF0B90B);
    const backgroundColor = const Color(0xFF0B0B0B);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'AMS HoldCrypto',
          style: GoogleFonts.inter(
            color: primaryColor,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => context.go('/login'),
            child: Text(
              'Login',
              style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.w600),
            ),
          ),
          const SizedBox(width: 8),
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: ElevatedButton(
              onPressed: () => context.go('/register'),
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryColor,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Registrar',
                style: GoogleFonts.inter(color: Colors.black, fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _HeroSection(),
            _FeaturesSection(),
          ],
        ),
      ),
    );
  }
}

// --- Seção Hero (Banner Principal) ---
class _HeroSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final isSmallScreen = MediaQuery.of(context).size.width < 400;

    // CORREÇÃO: A altura fixa foi removida e substituída por padding vertical.
    // Isso torna a seção flexível e elimina o erro de "overflow".
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 64.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          FadeInDown(
            duration: const Duration(milliseconds: 800),
            child: Text(
              'Domine o Mercado de Criptomoedas',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                color: Colors.white,
                fontSize: isSmallScreen ? 36 : 48,
                fontWeight: FontWeight.bold,
                height: 1.2,
              ),
            ),
          ),
          const SizedBox(height: 24),
          FadeInUp(
            duration: const Duration(milliseconds: 800),
            delay: const Duration(milliseconds: 300),
            child: Text(
              'O futuro das finanças digitais começa agora. Oferecemos ferramentas de ponta e tecnologia para o seu sucesso no trading.',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                color: Colors.grey[400],
                fontSize: 18,
                height: 1.5,
              ),
            ),
          ),
          const SizedBox(height: 40),
          FadeInUp(
            duration: const Duration(milliseconds: 800),
            delay: const Duration(milliseconds: 600),
            child: ElevatedButton(
              onPressed: () => context.go('/register'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFF0B90B),
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                'Comece Agora',
                style: GoogleFonts.inter(
                  color: Colors.black,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}


// --- Seção de Features (COM LÓGICA RESPONSIVA CORRIGIDA) ---
class _FeaturesSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF1E1E1E),
      padding: const EdgeInsets.symmetric(vertical: 80.0, horizontal: 24.0),
      child: Column(
        children: [
          FadeInUp(
            from: 20,
            child: Text(
              'Um Parceiro de Trade em que Você Pode Confiar',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                color: Colors.white,
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 48),
          LayoutBuilder(
            builder: (context, constraints) {
              bool isMobile = constraints.maxWidth < 768;
              final featureCards = _buildFeatureCards(isMobile: isMobile);
              
              return isMobile
                  ? Column(children: featureCards)
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: featureCards,
                    );
            },
          ),
        ],
      ),
    );
  }

  List<Widget> _buildFeatureCards({required bool isMobile}) {
    final features = [
      {'icon': Icons.bolt, 'title': 'Execução Rápida', 'desc': 'Nossa plataforma oferece liquidez profunda e execução de ordens em milissegundos.'},
      {'icon': Icons.security, 'title': 'Segurança de Ponta', 'desc': 'Seus ativos são protegidos com as mais avançadas tecnologias de segurança e armazenamento a frio.'},
      {'icon': Icons.analytics_outlined, 'title': 'Análise Avançada', 'desc': 'Utilize gráficos em tempo real e indicadores técnicos para tomar as melhores decisões de trade.'},
    ];

    Widget card(Map<String, Object> feature) {
        return FadeInUp(
          from: 20,
          delay: Duration(milliseconds: features.indexOf(feature) * 200),
          child: _FeatureCard(
            icon: feature['icon'] as IconData,
            title: feature['title'] as String,
            description: feature['desc'] as String,
          ),
        );
    }

    return features.map((feature) {
      if (!isMobile) {
        return Flexible(child: card(feature));
      } else {
        return card(feature);
      }
    }).toList();
  }
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;

  const _FeatureCard({required this.icon, required this.title, required this.description});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      margin: const EdgeInsets.only(bottom: 24),
      child: Column(
        children: [
          Icon(icon, color: const Color(0xFFF0B90B), size: 48),
          const SizedBox(height: 24),
          Text(
            title,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            description,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(
              color: Colors.grey[400],
              fontSize: 16,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}

