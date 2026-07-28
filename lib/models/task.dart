class Task {
  final String id;
  final String title;
  final String? notes;
  final DateTime? dueDate;
  final List<String>? tags;
  final String quadrant;
  final int orderIndex;
  final String status;
  final int pomodoroCount;
  final DateTime createdAt;
  final DateTime updatedAt;

  Task({
    required this.id,
    required this.title,
    this.notes,
    this.dueDate,
    this.tags,
    this.quadrant = 'unassigned',
    this.orderIndex = 0,
    this.status = 'pending',
    this.pomodoroCount = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  Task copyWith({
    String? id,
    String? title,
    String? notes,
    DateTime? dueDate,
    List<String>? tags,
    String? quadrant,
    int? orderIndex,
    String? status,
    int? pomodoroCount,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      notes: notes ?? this.notes,
      dueDate: dueDate ?? this.dueDate,
      tags: tags ?? this.tags,
      quadrant: quadrant ?? this.quadrant,
      orderIndex: orderIndex ?? this.orderIndex,
      status: status ?? this.status,
      pomodoroCount: pomodoroCount ?? this.pomodoroCount,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  factory Task.fromMap(Map<String, dynamic> map) {
    return Task(
      id: map['id'] as String,
      title: map['title'] as String,
      notes: map['notes'] as String?,
      dueDate: map['due_date'] != null ? DateTime.parse(map['due_date']) : null,
      tags: map['tags'] != null ? List<String>.from(map['tags']) : null,
      quadrant: map['quadrant'] as String? ?? 'unassigned',
      orderIndex: map['order_index'] as int? ?? 0,
      status: map['status'] as String? ?? 'pending',
      pomodoroCount: map['pomodoro_count'] as int? ?? 0,
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'notes': notes,
      'due_date': dueDate?.toIso8601String(),
      'tags': tags,
      'quadrant': quadrant,
      'order_index': orderIndex,
      'status': status,
      'pomodoro_count': pomodoroCount,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  bool get isCompleted => status == 'done';
  bool get isUrgentImportant => quadrant == 'urgent-important';
  bool get isNotUrgentImportant => quadrant == 'not-urgent-important';
  bool get isUrgentNotImportant => quadrant == 'urgent-not-important';
  bool get isNotUrgentNotImportant => quadrant == 'not-urgent-not-important';
}
