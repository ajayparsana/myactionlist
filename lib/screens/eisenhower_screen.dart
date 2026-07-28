import 'package:flutter/material.dart';
import '../models/task.dart';
import '../services/supabase_service.dart';

class EisenhowerScreen extends StatefulWidget {
  final VoidCallback? onTasksUpdated;

  const EisenhowerScreen({Key? key, this.onTasksUpdated}) : super(key: key);

  @override
  State<EisenhowerScreen> createState() => _EisenhowerScreenState();
}

class _EisenhowerScreenState extends State<EisenhowerScreen> {
  late Future<List<Task>> _tasksFuture;

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

  Future<void> _moveTaskToQuadrant(Task task, String quadrant) async {
    final updatedTask = task.copyWith(
      quadrant: quadrant,
      updatedAt: DateTime.now(),
    );
    await SupabaseService().updateTask(updatedTask);
    _refreshTasks();
    widget.onTasksUpdated?.call();
  }

  Future<void> _toggleTaskComplete(Task task) async {
    final updatedTask = task.copyWith(
      status: task.isCompleted ? 'pending' : 'done',
      updatedAt: DateTime.now(),
    );
    await SupabaseService().updateTask(updatedTask);
    _refreshTasks();
    widget.onTasksUpdated?.call();
  }

  Widget _buildQuadrantCell({
    required String title,
    required String quadrant,
    required List<Task> tasks,
    required Color bgColor,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: bgColor,
        border: Border.all(color: Colors.grey),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  _getQuadrantAction(quadrant),
                  style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: tasks.isEmpty
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(8),
                      child: Text(
                        'Drop tasks here',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(8),
                    itemCount: tasks.length,
                    itemBuilder: (context, index) {
                      final task = tasks[index];
                      return _buildDraggableTask(task);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildDraggableTask(Task task) {
    return Draggable<Task>(
      data: task,
      feedback: Material(
        elevation: 4,
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Text(
              task.title,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ),
      ),
      child: GestureDetector(
        onTap: () => _toggleTaskComplete(task),
        child: Card(
          margin: const EdgeInsets.symmetric(vertical: 4),
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                Checkbox(
                  value: task.isCompleted,
                  onChanged: (_) => _toggleTaskComplete(task),
                ),
                Expanded(
                  child: Text(
                    task.title,
                    style: TextStyle(
                      decoration: task.isCompleted
                          ? TextDecoration.lineThrough
                          : null,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _getQuadrantAction(String quadrant) {
    switch (quadrant) {
      case 'urgent-important':
        return 'Do Now';
      case 'not-urgent-important':
        return 'Schedule';
      case 'urgent-not-important':
        return 'Delegate';
      case 'not-urgent-not-important':
        return 'Delete';
      default:
        return '';
    }
  }

  DragTarget<Task> _buildDragTarget({
    required String quadrant,
    required Widget child,
  }) {
    return DragTarget<Task>(
      onAcceptWithDetails: (details) {
        _moveTaskToQuadrant(details.data, quadrant);
      },
      builder: (context, candidateData, rejectedData) {
        return child;
      },
    );
  }

  @override
  Widget build(BuildContext context) {
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
        final urgentImportant =
            tasks.where((t) => t.quadrant == 'urgent-important').toList();
        final notUrgentImportant =
            tasks.where((t) => t.quadrant == 'not-urgent-important').toList();
        final urgentNotImportant =
            tasks.where((t) => t.quadrant == 'urgent-not-important').toList();
        final notUrgentNotImportant =
            tasks.where((t) => t.quadrant == 'not-urgent-not-important').toList();

        return SingleChildScrollView(
          padding: const EdgeInsets.all(8),
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: _buildDragTarget(
                      quadrant: 'urgent-important',
                      child: _buildQuadrantCell(
                        title: 'Urgent & Important',
                        quadrant: 'urgent-important',
                        tasks: urgentImportant,
                        bgColor: Colors.red.shade50,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildDragTarget(
                      quadrant: 'not-urgent-important',
                      child: _buildQuadrantCell(
                        title: 'Not Urgent & Important',
                        quadrant: 'not-urgent-important',
                        tasks: notUrgentImportant,
                        bgColor: Colors.green.shade50,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: _buildDragTarget(
                      quadrant: 'urgent-not-important',
                      child: _buildQuadrantCell(
                        title: 'Urgent & Not Important',
                        quadrant: 'urgent-not-important',
                        tasks: urgentNotImportant,
                        bgColor: Colors.yellow.shade50,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildDragTarget(
                      quadrant: 'not-urgent-not-important',
                      child: _buildQuadrantCell(
                        title: 'Not Urgent & Not Important',
                        quadrant: 'not-urgent-not-important',
                        tasks: notUrgentNotImportant,
                        bgColor: Colors.grey.shade100,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
