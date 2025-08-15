export async function getTodoTasks(token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  // Get To Do lists
  const listsRes = await fetch('https://graph.microsoft.com/v1.0/me/todo/lists', { headers });
  if (!listsRes.ok) throw new Error(`Lists error: ${listsRes.status}`);
  const lists = await listsRes.json();
  const allLists: any[] = lists.value || [];
  if (allLists.length === 0) return [];
  // Prefer the default "Tasks" list, otherwise first
  const list = allLists.find(l => (l.displayName || '').toLowerCase() === 'tasks') || allLists[0];
  const tasksRes = await fetch(
    `https://graph.microsoft.com/v1.0/me/todo/lists/${list.id}/tasks?$orderby=createdDateTime desc&$top=25`,
    { headers }
  );
  if (!tasksRes.ok) throw new Error(`Tasks error: ${tasksRes.status}`);
  const tasks = await tasksRes.json();
  return tasks.value || [];
}

async function ensureTrainingFolder(token: string) {
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } as const;
  // Try create Training folder under approot; if already exists, fall back to lookup
  const createRes = await fetch(
    'https://graph.microsoft.com/v1.0/me/drive/special/approot/children',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Training',
        folder: {},
        '@microsoft.graph.conflictBehavior': 'fail',
      }),
    }
  );
  if (createRes.ok) {
    return (await createRes.json()).id as string;
  }
  if (createRes.status !== 409) {
    // Unexpected error
    const text = await createRes.text();
    throw new Error(`Create folder error: ${createRes.status} ${text}`);
  }
  // Folder exists: query it
  const findRes = await fetch(
    "https://graph.microsoft.com/v1.0/me/drive/special/approot/children?$filter=name%20eq%20'Training'",
    { headers: { Authorization: headers.Authorization } }
  );
  if (!findRes.ok) throw new Error(`Find folder error: ${findRes.status}`);
  const found = await findRes.json();
  const item = (found.value || [])[0];
  if (!item) throw new Error('Training folder not found');
  return item.id as string;
}

export async function getTrainingFiles(token: string) {
  const headers = { Authorization: `Bearer ${token}` };
  // Ensure folder exists first (no-op if already created)
  try {
    await ensureTrainingFolder(token);
  } catch (e) {
    // If creation fails for reasons other than conflict, we still try to list below
    console.warn('ensureTrainingFolder warning:', e);
  }
  // List files under /Training
  const listRes = await fetch(
    'https://graph.microsoft.com/v1.0/me/drive/special/approot:/Training:/children',
    { headers }
  );
  if (!listRes.ok) throw new Error(`Training list error: ${listRes.status}`);
  const data = await listRes.json();
  return data.value || [];
}

export async function getTodoTaskById(token: string, taskId: string) {
  // Find a default list (same as getTodoTasks) then fetch this task by id
  const headers = { Authorization: `Bearer ${token}` };
  const listsRes = await fetch('https://graph.microsoft.com/v1.0/me/todo/lists', { headers });
  if (!listsRes.ok) throw new Error(`Lists error: ${listsRes.status}`);
  const lists = await listsRes.json();
  const allLists: any[] = lists.value || [];
  if (allLists.length === 0) throw new Error('No To Do lists');
  const list = allLists.find(l => (l.displayName || '').toLowerCase() === 'tasks') || allLists[0];
  const taskRes = await fetch(
    `https://graph.microsoft.com/v1.0/me/todo/lists/${list.id}/tasks/${taskId}`,
    { headers }
  );
  if (!taskRes.ok) throw new Error(`Task error: ${taskRes.status}`);
  return await taskRes.json();
}
