import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tictactoe/Screens/create_room_screen.dart';
import 'package:tictactoe/Screens/game_screen.dart';
import 'package:tictactoe/Screens/join_room_screen.dart';
import 'package:tictactoe/Screens/main_menu_screen.dart';
import 'package:tictactoe/provider/room_data_provider.dart';
import 'package:tictactoe/utils/colors.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => RoomDataProvider(),
      child: MaterialApp(
        title: 'Flutter Demo',
        debugShowCheckedModeBanner: false,
        theme: ThemeData.dark().copyWith(
          scaffoldBackgroundColor: bgColor,
        ),
        routes: {
          MainMenuScreen.routeName : (context)=> const MainMenuScreen(),
          JoinRoomScreen.routeName : (context)=> const JoinRoomScreen(),
          CreateRoomScreen.routeName : (context)=> const CreateRoomScreen(),
          GameScreen.routeName: (context)=> GameScreen(),
        },
        initialRoute: MainMenuScreen.routeName,
      ),
    );
  }
}

