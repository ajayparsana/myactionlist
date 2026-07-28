import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';
import '../models/task.dart';
import '../models/pomodoro_session.dart';

class SupabaseService {
  static final SupabaseClient _client = Supabase.instance.client;

  // Task operations
  Future<List<Task>> getTasks() async {
    try {
      final response = await _client
          .from('tasks')
          .select()
          .order('order_index', ascending: true);
      return (response as List).map((e) => Task.fromMap(e)).toList();
    } catch (e) {
      print('Error fetching tasks: $e');
      rethrow;
    }
  }

  Future<Task> createTask({
    required String title,
    String? notes,
    DateTime? dueDate,
    List<String>? tags,
  }) async {
    try {
      final id = const Uuid().v4();
      final now = DateTime.now();
      final response = await _client.from('tasks').insert({
        'id': id,
        'title': title,
        'notes': notes,
        'due_date': dueDate?.toIso8601String(),
        'tags': tags,
        'quadrant': 'unassigned',
        'order_index': 0,
        'status': 'pending',
        'pomodoro_count': 0,
        'created_at': now.toIso8601String(),
        'updated_at': now.toIso8601String(),
      }).select();

      return Task.fromMap(response[0]);
    } catch (e) {
      print('Error creating task: $e');
      rethrow;
    }
  }

  Future<Task> updateTask(Task task) async {
    try {
      final response = await _client
          .from('tasks')
          .update(task.toMap())
          .eq('id', task.id)
          .select();

      return Task.fromMap(response[0]);
    } catch (e) {
      print('Error updating task: $e');
      rethrow;
    }
  }

  Future<void> deleteTask(String taskId) async {
    try {
      await _client.from('tasks').delete().eq('id', taskId);
    } catch (e) {
      print('Error deleting task: $e');
      rethrow;
    }
  }

  Future<void> reorderTasks(List<Task> tasks) async {
    try {
      for (int i = 0; i < tasks.length; i++) {
        await _client
            .from('tasks')
            .update({'order_index': i})
            .eq('id', tasks[i].id);
      }
    } catch (e) {
      print('Error reordering tasks: $e');
      rethrow;
    }
  }

  // Pomodoro operations
  Future<List<PomodoroSession>> getSessionsForTask(String taskId) async {
    try {
      final response =
          await _client.from('pomodoro_sessions').select().eq('task_id', taskId);
      return (response as List).map((e) => PomodoroSession.fromMap(e)).toList();
    } catch (e) {
      print('Error fetching pomodoro sessions: $e');
      rethrow;
    }
  }

  Future<PomodoroSession> createPomodoroSession({
    required String taskId,
    required String type,
  }) async {
    try {
      final id = const Uuid().v4();
      final now = DateTime.now();
      final response = await _client.from('pomodoro_sessions').insert({
        'id': id,
        'task_id': taskId,
        'start_time': now.toIso8601String(),
        'type': type,
        'completed': false,
        'created_at': now.toIso8601String(),
      }).select();

      return PomodoroSession.fromMap(response[0]);
    } catch (e) {
      print('Error creating pomodoro session: $e');
      rethrow;
    }
  }

  Future<PomodoroSession> endPomodoroSession(PomodoroSession session) async {
    try {
      final response = await _client
          .from('pomodoro_sessions')
          .update({
            'end_time': DateTime.now().toIso8601String(),
            'completed': true,
          })
          .eq('id', session.id)
          .select();

      return PomodoroSession.fromMap(response[0]);
    } catch (e) {
      print('Error ending pomodoro session: $e');
      rethrow;
    }
  }

  Future<List<PomodoroSession>> getSessionsForToday() async {
    try {
      final today = DateTime.now();
      final startOfDay = DateTime(today.year, today.month, today.day);
      final endOfDay = startOfDay.add(const Duration(days: 1));

      final response = await _client
          .from('pomodoro_sessions')
          .select()
          .gte('start_time', startOfDay.toIso8601String())
          .lt('start_time', endOfDay.toIso8601String());

      return (response as List).map((e) => PomodoroSession.fromMap(e)).toList();
    } catch (e) {
      print('Error fetching today\'s sessions: $e');
      rethrow;
    }
  }
}
