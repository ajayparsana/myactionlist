import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/task.dart';
import '../services/supabase_service.dart';

class AddTaskScreen extends StatefulWidget {
  final Task? task;

  const AddTaskScreen({Key? key, this.task}) : super(key: key);

  @override
  State<AddTaskScreen> createState() => _AddTaskScreenState();
}

class _AddTaskScreenState extends State<AddTaskScreen> {
  late TextEditingController _titleController;
  late TextEditingController _notesController;
  DateTime? _selectedDueDate;
  List<String> _selectedTags = [];
  String _selectedQuadrant = 'unassigned';
  bool _isLoading = false;

  final List<String> _availableTags = ['Work', 'Personal', 'Health', 'Learning'];
  final List<Map<String, String>> _quadrants = [
    {'value': 'unassigned', 'label': 'Unassigned'},
    {'value': 'urgent-important', 'label': 'Urgent & Important (Do Now)'},
    {'value': 'not-urgent-important', 'label': 'Not Urgent & Important (Schedule)'},
    {'value': 'urgent-not-important', 'label': 'Urgent & Not Important (Delegate)'},
    {'value': 'not-urgent-not-important', 'label': 'Not Urgent & Not Important (Delete)'},
  ];

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.task?.title ?? '');
    _notesController = TextEditingController(text: widget.task?.notes ?? '');
    _selectedDueDate = widget.task?.dueDate;
    _selectedTags = widget.task?.tags ?? [];
    _selectedQuadrant = widget.task?.quadrant ?? 'unassigned';
  }

  @override
  void dispose() {
    _titleController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _selectDueDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDueDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() => _selectedDueDate = picked);
    }
  }

  Future<void> _saveTask() async {
    if (_titleController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a task title')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      if (widget.task == null) {
        await SupabaseService().createTask(
          title: _titleController.text,
          notes: _notesController.text.isEmpty ? null : _notesController.text,
          dueDate: _selectedDueDate,
          tags: _selectedTags.isEmpty ? null : _selectedTags,
        );
      } else {
        final updatedTask = widget.task!.copyWith(
          title: _titleController.text,
          notes: _notesController.text.isEmpty ? null : _notesController.text,
          dueDate: _selectedDueDate,
          tags: _selectedTags.isEmpty ? null : _selectedTags,
          quadrant: _selectedQuadrant,
          updatedAt: DateTime.now(),
        );
        await SupabaseService().updateTask(updatedTask);
      }

      if (mounted) {
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving task: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.task == null ? 'New Task' : 'Edit Task'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Task Title *',
                border: OutlineInputBorder(),
              ),
              enabled: !_isLoading,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _notesController,
              decoration: const InputDecoration(
                labelText: 'Notes',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
              enabled: !_isLoading,
            ),
            const SizedBox(height: 16),
            ListTile(
              title: const Text('Due Date'),
              subtitle: Text(
                _selectedDueDate == null
                    ? 'No due date'
                    : DateFormat('MMM d, yyyy').format(_selectedDueDate!),
              ),
              trailing: const Icon(Icons.calendar_today),
              onTap: _isLoading ? null : _selectDueDate,
            ),
            const SizedBox(height: 16),
            Text(
              'Tags',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            Wrap(
              spacing: 8,
              children: _availableTags.map((tag) {
                final isSelected = _selectedTags.contains(tag);
                return FilterChip(
                  label: Text(tag),
                  selected: isSelected,
                  onSelected: _isLoading
                      ? null
                      : (selected) {
                          setState(() {
                            if (selected) {
                              _selectedTags.add(tag);
                            } else {
                              _selectedTags.remove(tag);
                            }
                          });
                        },
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            if (widget.task != null) ...[
              Text(
                'Eisenhower Quadrant',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              DropdownButton<String>(
                isExpanded: true,
                value: _selectedQuadrant,
                onChanged: _isLoading
                    ? null
                    : (value) {
                        setState(() => _selectedQuadrant = value ?? 'unassigned');
                      },
                items: _quadrants.map((q) {
                  return DropdownMenuItem(
                    value: q['value'],
                    child: Text(q['label'] ?? ''),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
            ],
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _saveTask,
                child: _isLoading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Text(widget.task == null ? 'Create Task' : 'Update Task'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
