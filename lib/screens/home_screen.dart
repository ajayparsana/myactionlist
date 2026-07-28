import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/task.dart';
import '../services/supabase_service.dart';
import 'eisenhower_screen.dart';
import 'pomodoro_screen.dart';
import 'add_task_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<List<Task>> _tasksFuture;
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _tasksFuture = SupabaseService().getTasks();
  }

  void _refreshTasks() {
    setState(() {
      _tasksFuture = SupabaseService().getTasks();
    });
  }

  void _navigateToAddTask() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const AddTaskScreen()),
    );
    if (result == true) {
      _refreshTasks();
    }
  }

  void _navigateToEditTask(Task task) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => AddTaskScreen(task: task),
      ),
    );
    if (result == true) {
      _refreshTasks();
    }
  }

  void _toggleTaskComplete(Task task) async {
    final updatedTask = task.copyWith(
      status: task.isCompleted ? 'pending' : 'done',
      updatedAt: DateTime.now(),
    );
    await SupabaseService().updateTask(updatedTask);
    _refreshTasks();
  }

  void _deleteTask(Task task) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Task'),
        content: Text('Are you sure you want to delete "${task.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await SupabaseService().deleteTask(task.id);
      _refreshTasks();
    }
  }

  void _navigateToPomodoro(Task task) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PomodoroScreen(task: task),
      ),
    ).then((_) => _refreshTasks());
  }

  Widget _buildTaskListView() {
    return FutureBuilder<List<Task>>(
      future: _tasksFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Error: ${snapshot.error}'),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: _refreshTasks,
                  child: const Text('Retry'),
                ),
              ],
            ),
          );
        }

        final tasks = snapshot.data ?? [];
        final pendingTasks = tasks.where((t) => !t.isCompleted).toList();
        final completedTasks = tasks.where((t) => t.isCompleted).toList();

        return SingleChildScrollView(
          child: Column(
            children: [
              if (pendingTasks.isEmpty && completedTasks.isEmpty)
                Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    children: [
                      const Icon(Icons.inbox, size: 64, color: Colors.grey),
                      const SizedBox(height: 16),
                      const Text('No tasks yet. Add one to get started!'),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _navigateToAddTask,
                        child: const Text('Add First Task'),
                      ),
                    ],
                  ),
                )
              else ...[
                if (pendingTasks.isNotEmpty) ...[
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Pending (${pendingTasks.length})',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ),
                  ),
                  ...pendingTasks.map((task) => _buildTaskTile(task)),
                ],
                if (completedTasks.isNotEmpty) ...[
                  Padding(
                    padding: const EdgeInsets.only(left: 16, top: 24, right: 16),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Completed (${completedTasks.length})',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ),
                  ),
                  ...completedTasks.map((task) => _buildTaskTile(task)),
                ],
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildTaskTile(Task task) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        leading: Checkbox(
          value: task.isCompleted,
          onChanged: (_) => _toggleTaskComplete(task),
        ),
        title: Text(
          task.title,
          style: TextStyle(
            decoration: task.isCompleted ? TextDecoration.lineThrough : null,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (task.dueDate != null)
              Text(
                'Due: ${DateFormat('MMM d, yyyy').format(task.dueDate!)}',
                style: const TextStyle(fontSize: 12),
              ),
            if (task.notes != null && task.notes!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  task.notes!,
                  style: const TextStyle(fontSize: 12),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            if (task.pomodoroCount > 0)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  '🍅 ${task.pomodoroCount} session(s)',
                  style: const TextStyle(fontSize: 12),
                ),
              ),
          ],
        ),
        trailing: SizedBox(
          width: 100,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              IconButton(
                icon: const Icon(Icons.timer),
                onPressed: () => _navigateToPomodoro(task),
                tooltip: 'Start Pomodoro',
              ),
              IconButton(
                icon: const Icon(Icons.edit),
                onPressed: () => _navigateToEditTask(task),
              ),
              IconButton(
                icon: const Icon(Icons.delete),
                onPressed: () => _deleteTask(task),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('MyActionList'),
        elevation: 0,
      ),
      body: _selectedIndex == 0
          ? _buildTaskListView()
          : EisenhowerScreen(onTasksUpdated: _refreshTasks),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() => _selectedIndex = index);
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.list),
            label: 'Tasks',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.grid_3x3),
            label: 'Matrix',
          ),
        ],
      ),
      floatingActionButton: _selectedIndex == 0
          ? FloatingActionButton(
              onPressed: _navigateToAddTask,
              child: const Icon(Icons.add),
            )
          : null,
    );
  }
}
