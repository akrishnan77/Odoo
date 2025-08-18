export async function getOdooTaskById(id: string): Promise<any> {
  try {
    const url = `http://10.0.2.2:8000/api/project-tasks/${id}`;
    const response = await fetch(url);
    const text = await response.text();
    if (!response.ok) throw new Error('Odoo task error: ' + response.status);
    const task = JSON.parse(text);
    return {
      id: task.id || task.task_id || task._id,
      title: task.name || task.title,
      status: task.status || 'notStarted',
      importance: task.priority || 'normal',
      dueDateTime: task.date_deadline ? { dateTime: task.date_deadline } : undefined,
      description: task.description,
      assignedTo: task.user_id ? task.user_id[1] : undefined,
  res_model: task.res_model,
  res_id: task.res_id,
  res_name: task.res_name,
      // Add other mappings as needed
    };
  } catch (err) {
    console.error('[FRONTEND] Failed to fetch Odoo task:', err);
    throw err;
  }
}
export async function getOdooTasks(): Promise<any[]> {
  try {
    const url = 'http://10.0.2.2:8000/api/project-tasks';
    const response = await fetch(url);
    const text = await response.text();
    if (!response.ok) throw new Error('Odoo tasks error: ' + response.status);
    const data = JSON.parse(text);
    // Map Odoo fields to MS Graph-like fields for UI compatibility
    return (Array.isArray(data) ? data : []).map((task: any) => ({
      id: task.id || task.task_id || task._id,
      title: task.name || task.title,
      status: task.status || 'notStarted',
      importance: task.priority || 'normal',
      dueDateTime: task.date_deadline ? { dateTime: task.date_deadline } : undefined,
      description: task.description,
      assignedTo: task.user_id ? task.user_id[1] : undefined,
  res_model: task.res_model,
  res_id: task.res_id,
  res_name: task.res_name,
      // Add other mappings as needed
    }));
  } catch (err) {
    console.error('Failed to fetch Odoo tasks:', err);
    return [];
  }
}
