class PomodoroSession {
  final String id;
  final String taskId;
  final DateTime startTime;
  final DateTime? endTime;
  final String type;
  final bool completed;
  final DateTime createdAt;

  PomodoroSession({
    required this.id,
    required this.taskId,
    required this.startTime,
    this.endTime,
    required this.type,
    this.completed = false,
    required this.createdAt,
  });

  PomodoroSession copyWith({
    String? id,
    String? taskId,
    DateTime? startTime,
    DateTime? endTime,
    String? type,
    bool? completed,
    DateTime? createdAt,
  }) {
    return PomodoroSession(
      id: id ?? this.id,
      taskId: taskId ?? this.taskId,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      type: type ?? this.type,
      completed: completed ?? this.completed,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  factory PomodoroSession.fromMap(Map<String, dynamic> map) {
    return PomodoroSession(
      id: map['id'] as String,
      taskId: map['task_id'] as String,
      startTime: DateTime.parse(map['start_time'] as String),
      endTime: map['end_time'] != null ? DateTime.parse(map['end_time']) : null,
      type: map['type'] as String,
      completed: map['completed'] as bool? ?? false,
      createdAt: DateTime.parse(map['created_at'] as String),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'task_id': taskId,
      'start_time': startTime.toIso8601String(),
      'end_time': endTime?.toIso8601String(),
      'type': type,
      'completed': completed,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
