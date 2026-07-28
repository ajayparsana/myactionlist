import 'package:flutter/material.dart';
import 'dart:async';
import '../models/task.dart';
import '../services/supabase_service.dart';

class PomodoroScreen extends StatefulWidget {
  final Task task;

  const PomodoroScreen({Key? key, required this.task}) : super(key: key);

  @override
  State<PomodoroScreen> createState() => _PomodoroScreenState();
}

class _PomodoroScreenState extends State<PomodoroScreen> {
  late Timer _timer;
  int _remainingSeconds = 25 * 60;
  bool _isRunning = false;
  String _currentSessionType = 'focus';
  int _completedSessions = 0;

  // Pomodoro settings
  final int focusDuration = 25 * 60;
  final int shortBreakDuration = 5 * 60;
  final int longBreakDuration = 15 * 60;

  @override
  void initState() {
    super.initState();
    _completedSessions = widget.task.pomodoroCount;
  }

  void _startTimer() {
    setState(() => _isRunning = true);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (_remainingSeconds > 0) {
          _remainingSeconds--;
        } else {
          _onSessionComplete();
        }
      });
    });
  }

  void _pauseTimer() {
    _timer.cancel();
    setState(() => _isRunning = false);
  }

  void _resetTimer() {
    _timer.cancel();
    setState(() {
      _isRunning = false;
      _remainingSeconds = focusDuration;
      _currentSessionType = 'focus';
    });
  }

  Future<void> _onSessionComplete() async {
    _timer.cancel();
    setState(() => _isRunning = false);

    if (_currentSessionType == 'focus') {
      _completedSessions++;

      // Update task with new pomodoro count
      final updatedTask = widget.task.copyWith(
        pomodoroCount: _completedSessions,
        updatedAt: DateTime.now(),
      );
      await SupabaseService().updateTask(updatedTask);

      // Show completion dialog
      if (mounted) {
        await showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Pomodoro Complete!'),
            content:
                Text('Session ${_completedSessions} completed! 🎉'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  _startBreak();
                },
                child: const Text('Take a Break'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  _resetTimer();
                },
                child: const Text('Done'),
              ),
            ],
          ),
        );
      }
    } else {
      // Break completed
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Break over! Ready for another session?')),
        );
      }
      _startFocusSession();
    }
  }

  void _startBreak() {
    final isLongBreak = _completedSessions % 4 == 0;
    setState(() {
      _currentSessionType = isLongBreak ? 'long-break' : 'short-break';
      _remainingSeconds =
          isLongBreak ? longBreakDuration : shortBreakDuration;
    });
    _startTimer();
  }

  void _startFocusSession() {
    setState(() {
      _currentSessionType = 'focus';
      _remainingSeconds = focusDuration;
    });
  }

  String _formatTime(int seconds) {
    final mins = seconds ~/ 60;
    final secs = seconds % 60;
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  String _getSessionLabel() {
    switch (_currentSessionType) {
      case 'focus':
        return 'Focus Session';
      case 'short-break':
        return 'Short Break';
      case 'long-break':
        return 'Long Break';
      default:
        return '';
    }
  }

  Color _getSessionColor() {
    switch (_currentSessionType) {
      case 'focus':
        return Colors.red;
      case 'short-break':
        return Colors.blue;
      case 'long-break':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  @override
  void dispose() {
    if (_isRunning) {
      _timer.cancel();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        if (_isRunning) {
          _timer.cancel();
        }
        return true;
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Pomodoro Timer'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Card(
                margin: const EdgeInsets.all(32),
                elevation: 8,
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    children: [
                      Text(
                        widget.task.title,
                        style: Theme.of(context).textTheme.headlineSmall,
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 32),
                      Container(
                        width: 200,
                        height: 200,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _getSessionColor().withOpacity(0.1),
                          border: Border.all(
                            color: _getSessionColor(),
                            width: 4,
                          ),
                        ),
                        child: Center(
                          child: Text(
                            _formatTime(_remainingSeconds),
                            style: TextStyle(
                              fontSize: 64,
                              fontWeight: FontWeight.bold,
                              color: _getSessionColor(),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        _getSessionLabel(),
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 32),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          ElevatedButton.icon(
                            onPressed: _isRunning ? _pauseTimer : _startTimer,
                            icon: Icon(_isRunning ? Icons.pause : Icons.play_arrow),
                            label: Text(_isRunning ? 'Pause' : 'Start'),
                          ),
                          const SizedBox(width: 16),
                          ElevatedButton.icon(
                            onPressed: _resetTimer,
                            icon: const Icon(Icons.refresh),
                            label: const Text('Reset'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'Completed: $_completedSessions session${_completedSessions != 1 ? 's' : ''}',
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
