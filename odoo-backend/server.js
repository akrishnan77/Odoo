import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Odoo server config
const ODOO_URL = 'http://localhost:8069'; // Change to your Odoo server URL
const ODOO_DB = 'Enterprise'; // Change to your Odoo DB name
const ODOO_USERNAME = 'anand.krishnan20@harman.com'; // Change to your Odoo username
const ODOO_PASSWORD = 'Anandk@1977'; // Change to your Odoo password

//const ODOO_URL = 'https://groupnet1.odoo.com'; // Change to your Odoo server URL
//const ODOO_DB = 'groupnet1'; // Change to your Odoo DB name
//const ODOO_USERNAME = 'akrishnan77@outlook.com'; // Change to your Odoo username
//const ODOO_PASSWORD = 'Anandk@1977'; // Change to your Odoo password


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
  // ...existing code...
    const odooRes = await axios.post(url, payload, {
      headers: { Cookie: cookies },
      withCredentials: true
    });
  // ...existing code...
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
  // ...existing code...
      res.json(formattedTask);
    } else {
  // ...existing code...
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
  // ...existing code...
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/project-tasks', async (req, res) => {
  try {
    const cookies = await getOdooSession();

    // 1. Read open maintenance requests
    const maintUrl = `${ODOO_URL}/web/dataset/call_kw/maintenance.request/search_read`;
    const maintPayload = {
      params: {
        model: 'maintenance.request',
        method: 'search_read',
        args: [[['stage_id.name', 'in', ['New Request', 'In Progress']]], ['id', 'name', 'description', 'stage_id']],
        kwargs: {}
      }
    };
    const maintRes = await axios.post(maintUrl, maintPayload, {
      headers: { Cookie: cookies },
      withCredentials: true
    });

  // ...existing code...

    // 2. For each open maintenance request, create a project task if not already created
    if (maintRes.data && Array.isArray(maintRes.data.result)) {
      for (const req of maintRes.data.result) {
  // ...existing code...
        // Check if a project task already exists for this maintenance request (by name)
        const checkTaskUrl = `${ODOO_URL}/web/dataset/call_kw/project.task/search_read`;
        const checkTaskPayload = {
          params: {
            model: 'project.task',
            method: 'search_read',
            args: [[['name', '=', `Maintenance: ${req.name}`]], ['id']],
            kwargs: {}
          }
        };
        const checkTaskRes = await axios.post(checkTaskUrl, checkTaskPayload, {
          headers: { Cookie: cookies },
          withCredentials: true
        });
  // ...existing code...
        if (!checkTaskRes.data || !Array.isArray(checkTaskRes.data.result) || checkTaskRes.data.result.length === 0) {
          // Create the project task
          const createTaskUrl = `${ODOO_URL}/web/dataset/call_kw/project.task/create`;
          // Only use description from maintenance request
          let description = req.description || '';
          // ...existing code...
          const createTaskPayload = {
            params: {
              model: 'project.task',
              method: 'create',
              args: [{
                name: `Maintenance: ${req.name}`,
                description,
                // Optionally set other fields
              }],
              kwargs: {}
            }
          };
          // ...existing code...
          await axios.post(createTaskUrl, createTaskPayload, {
            headers: { Cookie: cookies },
            withCredentials: true
          });
          // ...existing code...
        }
      }
    }

    // 3. Return all project tasks as before
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
      let formattedTasks = odooRes.data.result.map(t => {
        let desc = t.description;
        if (typeof desc !== 'string') desc = '';
  // ...existing code...
        return {
          id: t.id,
          name: t.name || 'Project Task',
          description: desc,
          date_deadline: t.date_deadline || '',
          priority: t.priority || '',
          stage_id: t.stage_id || ''
        };
      });
      // Sort by due date (date_deadline), empty dates go last
      formattedTasks = formattedTasks.sort((a, b) => {
        if (!a.date_deadline && !b.date_deadline) return 0;
        if (!a.date_deadline) return 1;
        if (!b.date_deadline) return -1;
        return new Date(a.date_deadline) - new Date(b.date_deadline);
      });
      res.json(formattedTasks);
    } else {
  // ...existing code...
      res.status(500).json({ error: 'Unexpected Odoo response', response: odooRes.data });
    }
  } catch (err) {
  // ...existing code...
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
  // ...existing code...
    const odooRes = await axios.post(url, payload, {
      headers: { Cookie: cookies },
      withCredentials: true
    });
  // ...existing code...
    if (odooRes.data && odooRes.data.result) {
      res.json({ id: odooRes.data.result });
    } else {
      res.status(500).json({ error: 'Failed to create task', response: odooRes.data });
    }
  } catch (err) {
  // ...existing code...
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Odoo backend running on port ${PORT}`);
});
