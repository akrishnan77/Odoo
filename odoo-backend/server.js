import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Odoo server config
const ODOO_URL = 'https://groupnet1.odoo.com'; // Change to your Odoo server URL
const ODOO_DB = 'groupnet1'; // Change to your Odoo DB name
const ODOO_USERNAME = 'akrishnan77@outlook.com'; // Change to your Odoo username
const ODOO_PASSWORD = 'Anandk@1977'; // Change to your Odoo password


// Helper: Authenticate and get session cookie
async function getOdooSession() {
  const url = `${ODOO_URL}/web/session/authenticate`;
  const payload = {
    params: {
      db: ODOO_DB,
      login: ODOO_USERNAME,
      password: ODOO_PASSWORD
    }
  };
  const res = await axios.post(url, payload, { withCredentials: true });
  const cookies = res.headers['set-cookie'];
  return cookies;
}



// Endpoint: Get project tasks from Odoo project.task model
// Endpoint: Get a single project task by ID
app.get('/api/project-tasks/:id', async (req, res) => {
  try {
    const cookies = await getOdooSession();
    const url = `${ODOO_URL}/web/dataset/call_kw/project.task/search_read`;
    const payload = {
      params: {
        model: 'project.task',
        method: 'search_read',
        args: [[['id', '=', parseInt(req.params.id)]], ['id', 'name', 'description', 'stage_id', 'date_deadline', 'priority']],
        kwargs: {}
      }
    };
    console.log(`[API CALL] GET /api/project-tasks/${req.params.id}`);
    console.log('Odoo request payload:', JSON.stringify(payload, null, 2));
    const odooRes = await axios.post(url, payload, {
      headers: { Cookie: cookies },
      withCredentials: true
    });
    console.log('Odoo raw response:', JSON.stringify(odooRes.data, null, 2));
    if (odooRes.data && Array.isArray(odooRes.data.result) && odooRes.data.result.length > 0) {
      const t = odooRes.data.result[0];
      let desc = t.description;
      if (typeof desc !== 'string') desc = '';
      const formattedTask = {
        id: t.id,
        name: t.name || 'Project Task',
        description: desc,
        date_deadline: t.date_deadline || '',
        priority: t.priority || '',
        stage_id: t.stage_id || ''
      };
      console.log('Formatted task:', JSON.stringify(formattedTask, null, 2));
      res.json(formattedTask);
    } else {
       console.error('Task not found for id', req.params.id);
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
     console.error(`Error in /api/project-tasks/${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/project-tasks', async (req, res) => {
  try {
    const cookies = await getOdooSession();
    const url = `${ODOO_URL}/web/dataset/call_kw/project.task/search_read`;
    const payload = {
      params: {
        model: 'project.task',
        method: 'search_read',
        args: [[]],
        kwargs: {
          fields: ['id', 'name', 'description', 'stage_id', 'date_deadline', 'priority'],
        }
      }
    };
    const odooRes = await axios.post(url, payload, {
      headers: { Cookie: cookies },
      withCredentials: true
    });
    if (odooRes.data && Array.isArray(odooRes.data.result)) {
      // Format for frontend: map name, description, date_deadline, priority
      const formattedTasks = odooRes.data.result.map(t => {
        let desc = t.description;
        if (typeof desc !== 'string') desc = '';
        return {
          id: t.id,
          name: t.name || 'Project Task',
          description: desc,
          date_deadline: t.date_deadline || '',
          priority: t.priority || '',
          stage_id: t.stage_id || ''
        };
      });
      res.json(formattedTasks);
    } else {
        console.error('Unexpected Odoo response', odooRes.data);
      res.status(500).json({ error: 'Unexpected Odoo response', response: odooRes.data });
    }
  } catch (err) {
        console.error('Error in /api/project-tasks:', err);
    res.status(500).json({ error: err.message });
  }
});

// TODO: Add endpoints for shifts, learning, chat
// Endpoint: Create a new project task
app.post('/api/project-tasks', async (req, res) => {
  try {
    const cookies = await getOdooSession();
    const url = `${ODOO_URL}/web/dataset/call_kw/project.task/create`;
    // Map frontend priority to Odoo values
    let odooPriority = '1';
    if (req.body.priority === 'low') odooPriority = '0';
    else if (req.body.priority === 'high') odooPriority = '2';
    // Default is '1' (normal/medium)
    const payload = {
      params: {
        model: 'project.task',
        method: 'create',
        args: [
          {
            name: req.body.name,
            description: req.body.description,
            date_deadline: req.body.date_deadline,
            priority: odooPriority,
          }
        ],
        kwargs: {}
      }
    };
    console.log('[API CALL] POST /api/project-tasks', JSON.stringify(payload, null, 2));
    const odooRes = await axios.post(url, payload, {
      headers: { Cookie: cookies },
      withCredentials: true
    });
    console.log('Odoo create response:', JSON.stringify(odooRes.data, null, 2));
    if (odooRes.data && odooRes.data.result) {
      res.json({ id: odooRes.data.result });
    } else {
      res.status(500).json({ error: 'Failed to create task', response: odooRes.data });
    }
  } catch (err) {
    console.error('Error in POST /api/project-tasks:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Odoo backend running on port ${PORT}`);
});
