export async function getMaintenanceRequestById(id: string | number): Promise<any> {
  try {
    const url = `http://10.0.2.2:8000/api/maintenance-request/${id}`;
    console.log('[getMaintenanceRequestById] Fetching:', url);
    const response = await fetch(url);
    const text = await response.text();
    console.log('[getMaintenanceRequestById] Response status:', response.status);
    console.log('[getMaintenanceRequestById] Response text:', text);
    if (!response.ok) {
      console.error('[FRONTEND] Maintenance request fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        body: text
      });
      throw new Error(`Failed to fetch maintenance request: ${response.status} ${response.statusText}`);
    }
    try {
      const parsed = JSON.parse(text);
      console.log('[getMaintenanceRequestById] Parsed response:', parsed);
      // Normalize stage_id to a number for frontend usage
      if (parsed && Array.isArray(parsed.stage_id)) {
        parsed.stage_id = parsed.stage_id[0];
      }
      return parsed;
    } catch (jsonErr) {
      console.error('[FRONTEND] Failed to parse maintenance request response:', text);
      throw jsonErr;
    }
  } catch (err) {
    console.error('[FRONTEND] Failed to fetch maintenance request:', err);
    throw err;
  }
}

export async function updateMaintenanceRequestStatus(id: string | number, state: string): Promise<any> {
  try {
    const url = `http://10.0.2.2:8000/api/maintenance-request/${id}/update-status`;
    // Pass stage_id as a number: 2 for In Progress, 3 for Repaired
    console.log('[updateMaintenanceRequestStatus] Fetching:', url, 'with stage_id:', state);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage_id: Number(state) })
    });
    const text = await response.text();
    console.log('[updateMaintenanceRequestStatus] Response status:', response.status);
    console.log('[updateMaintenanceRequestStatus] Response text:', text);
    if (!response.ok) throw new Error('Failed to update maintenance request status');
    try {
      const parsed = JSON.parse(text);
      console.log('[updateMaintenanceRequestStatus] Parsed response:', parsed);
      return parsed;
    } catch (jsonErr) {
      console.error('[updateMaintenanceRequestStatus] Failed to parse response:', text);
      throw jsonErr;
    }
  } catch (err) {
    console.error('[FRONTEND] Failed to update maintenance request status:', err);
    throw err;
  }
}
export async function getOdooProducts(): Promise<any[]> {
  try {
    const url = 'http://10.0.2.2:8000/api/products';
    console.log('[getOdooProducts] Fetching:', url);
    const response = await fetch(url);
    const text = await response.text();
    console.log('[getOdooProducts] Response status:', response.status);
    console.log('[getOdooProducts] Response text:', text);
    if (!response.ok) throw new Error('Failed to fetch products');
    try {
      const parsed = JSON.parse(text);
      console.log('[getOdooProducts] Parsed response:', parsed);
      return parsed;
    } catch (jsonErr) {
      console.error('[getOdooProducts] Failed to parse response:', text);
      throw jsonErr;
    }
  } catch (err) {
    console.error('[FRONTEND] Failed to fetch Odoo products:', err);
    return [];
  }
}
export async function createOdooTask({ name, description, date_deadline, priority = 'normal' }: {
  name: string;
  description?: string;
  date_deadline?: string;
  priority?: string;
}): Promise<any> {
  try {
    const url = 'http://10.0.2.2:8000/api/create-task';
    console.log('[createOdooTask] Fetching:', url, 'with:', { name, description, date_deadline, priority });
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, date_deadline, priority })
    });
    const text = await res.text();
    console.log('[createOdooTask] Response status:', res.status);
    console.log('[createOdooTask] Response text:', text);
    if (!res.ok) throw new Error('Failed to create task');
    try {
      const parsed = JSON.parse(text);
      console.log('[createOdooTask] Parsed response:', parsed);
      return parsed;
    } catch (jsonErr) {
      console.error('[createOdooTask] Failed to parse response:', text);
      throw jsonErr;
    }
  } catch (err) {
    console.error('[FRONTEND] Failed to create Odoo task:', err);
    throw err;
  }
}
export async function getOdooTaskById(id: string): Promise<any> {
  try {
    const url = `http://10.0.2.2:8000/api/project-tasks/${id}`;
    console.log('[getOdooTaskById] Fetching:', url);
    const response = await fetch(url);
    const text = await response.text();
    console.log('[getOdooTaskById] Response status:', response.status);
    console.log('[getOdooTaskById] Response text:', text);
    if (!response.ok) throw new Error('Odoo task error: ' + response.status);
    try {
      const task = JSON.parse(text);
      console.log('[getOdooTaskById] Parsed response:', task);
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
    } catch (jsonErr) {
      console.error('[getOdooTaskById] Failed to parse response:', text);
      throw jsonErr;
    }
  } catch (err) {
    console.error('[FRONTEND] Failed to fetch Odoo task:', err);
    throw err;
  }
}
export async function getOdooTasks(): Promise<any[]> {
  try {
    const url = 'http://10.0.2.2:8000/api/project-tasks';
    console.log('[getOdooTasks] Fetching:', url);
    const response = await fetch(url);
    const text = await response.text();
    console.log('[getOdooTasks] Response status:', response.status);
    console.log('[getOdooTasks] Response text:', text);
    if (!response.ok) throw new Error('Odoo tasks error: ' + response.status);
    try {
      const data = JSON.parse(text);
      console.log('[getOdooTasks] Parsed response:', data);
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
    } catch (jsonErr) {
      console.error('[getOdooTasks] Failed to parse response:', text);
      throw jsonErr;
    }
  } catch (err) {
    console.error('Failed to fetch Odoo tasks:', err);
    return [];
  }
}
