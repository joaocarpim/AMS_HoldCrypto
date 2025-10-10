import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:ams_holdcrypto/src/features/home/presentation/screens/home_screen.dart';
import 'package:ams_holdcrypto/src/features/auth/presentation/screens/login_screen.dart';
import 'package:ams_holdcrypto/src/features/auth/presentation/screens/register_screen.dart';
import 'package:ams_holdcrypto/src/features/dashboard/presentation/screens/dashboard_screen.dart';

void main() {
  runApp(const MyApp());
}

// Configuração das rotas do aplicativo
final GoRouter _router = GoRouter(
  initialLocation: '/', // A primeira tela agora é a Home
  routes: <RouteBase>[
    GoRoute(
      path: '/',
      builder: (BuildContext context, GoRouterState state) {
        return const HomeScreen();
      },
    ),
    GoRoute(
      path: '/login',
      builder: (BuildContext context, GoRouterState state) {
        return const LoginScreen();
      },
    ),
    GoRoute(
      path: '/register',
      builder: (BuildContext context, GoRouterState state) {
        return const RegisterScreen();
      },
    ),
    GoRoute(
      path: '/dashboard',
      builder: (BuildContext context, GoRouterState state) {
        return const DashboardScreen();
      },
    ),
  ],
);

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: _router,
      title: 'AMS HoldCrypto',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFFF0B90B),
        // Você pode adicionar mais customizações do tema aqui
      ),
    );
  }
}

