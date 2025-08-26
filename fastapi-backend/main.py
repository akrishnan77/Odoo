from fastapi import Form, Body, Query, FastAPI, HTTPException, Request, Path
import requests
import pandas as pd
import pickle
from prophet import Prophet
import logging

app = FastAPI()
logging.basicConfig(level=logging.INFO)

# New endpoint: update maintenance request notes and status, and mark Odoo task as done
@app.post("/api/maintenance-request/{id}/complete")
def complete_maintenance_request(id: int, notes: str = Form(...)):
    logging.info(f"[BACKEND] Completing maintenance.request id: {id} with notes: {notes}")
    cookies = get_odoo_session()
    # Update maintenance request: set stage_id to 'repaired' and add notes
    # You may need to adjust 'repaired_stage_id' to match your Odoo config
    repaired_stage_id = 3  # Example: replace with your actual 'repaired' stage id
    url = f"{ODOO_URL}/web/dataset/call_kw/maintenance.request/write"
    payload = {
        "params": {
            "model": "maintenance.request",
            "method": "write",
            "args": [[id], {"stage_id": repaired_stage_id, "notes": notes}],
            "kwargs": {}
        }
    }
    res = requests.post(url, json=payload, cookies=cookies)
    logging.info(f"[BACKEND] Odoo maintenance.request write response: {res.status_code} {res.text}")
    if res.status_code != 200 or not res.json().get("result"):
        raise HTTPException(status_code=500, detail="Failed to update maintenance request")

    # Optionally, mark the corresponding Odoo project.task as done
    # You may need to fetch the maintenance.request to get the task_id
    read_url = f"{ODOO_URL}/web/dataset/call_kw/maintenance.request/search_read"
    read_payload = {
        "params": {
            "model": "maintenance.request",
            "method": "search_read",
            "args": [[['id', '=', id]]],
            "kwargs": {"fields": ["task_id"]}
        }
    }
    read_res = requests.post(read_url, json=read_payload, cookies=cookies)
    logging.info(f"[BACKEND] Odoo maintenance.request read response: {read_res.status_code} {read_res.text}")
    if read_res.status_code == 200 and read_res.json().get("result"):
        task_id = read_res.json()["result"][0].get("task_id")
        if task_id and isinstance(task_id, list) and len(task_id) > 0:
            # Mark project.task as done (stage_id=done_stage_id)
            done_stage_id = 4  # Example: replace with your actual 'done' stage id
            task_url = f"{ODOO_URL}/web/dataset/call_kw/project.task/write"
            task_payload = {
                "params": {
                    "model": "project.task",
                    "method": "write",
                    "args": [[task_id[0]], {"stage_id": done_stage_id}],
                    "kwargs": {}
                }
            }
            task_res = requests.post(task_url, json=task_payload, cookies=cookies)
            logging.info(f"[BACKEND] Odoo project.task write response: {task_res.status_code} {task_res.text}")
    return {"success": True, "id": id, "notes": notes}

from fastapi import Body
from fastapi import Query, FastAPI, HTTPException, Request, Path
import requests
import pandas as pd
import pickle
from prophet import Prophet
import logging

app = FastAPI()
logging.basicConfig(level=logging.INFO)

# Get maintenance request details
@app.get("/api/maintenance-request/{id}")
def get_maintenance_request(id: int):
    logging.info(f"[BACKEND] Fetching maintenance.request with id: {id}")
    cookies = get_odoo_session()
    url = f"{ODOO_URL}/web/dataset/call_kw/maintenance.request/search_read"
    payload = {
        "params": {
            "model": "maintenance.request",
            "method": "search_read",
            "args": [[['id', '=', id]]],
            "kwargs": {"fields": ["id", "name", "description", "stage_id"]}
        }
    }
    res = requests.post(url, json=payload, cookies=cookies)
    logging.info(f"[BACKEND] Odoo response status: {res.status_code}")
    logging.info(f"[BACKEND] Odoo response body: {res.text}")
    try:
        result = res.json().get("result")
    except Exception as e:
        logging.error(f"[BACKEND] Failed to parse Odoo response: {e}")
        raise HTTPException(status_code=500, detail="Failed to parse Odoo response")
    if res.status_code != 200 or not result:
        logging.warning(f"[BACKEND] Maintenance request not found for id: {id}")
        raise HTTPException(status_code=404, detail="Maintenance request not found")
    logging.info(f"[BACKEND] Maintenance request found: {result[0]}")
    return result[0]

# Update maintenance request status
@app.post("/api/maintenance-request/{id}/update-status")
def update_maintenance_request_status(id: int, body: dict = Body(...)):
    stage_id = body.get("stage_id")
    if stage_id not in [2, 3]:
        raise HTTPException(status_code=400, detail="Invalid stage_id")
    cookies = get_odoo_session()
    url = f"{ODOO_URL}/web/dataset/call_kw/maintenance.request/write"
    payload = {
        "params": {
            "model": "maintenance.request",
            "method": "write",
            "args": [[id], {"stage_id": stage_id}],
            "kwargs": {}
        }
    }
    res = requests.post(url, json=payload, cookies=cookies)
    if res.status_code == 200 and res.json().get("result"):
        return {"success": True, "id": id, "stage_id": stage_id}
    else:
        raise HTTPException(status_code=500, detail="Failed to update maintenance request status")



@app.get("/api/inventory-forecast")
def inventory_forecast(product_id: int = Query(...), periods: int = Query(30)):
    logging.info(f"API Call: /api/inventory-forecast?product_id={product_id}&periods={periods}")
    # Load historical data (replace with Odoo API or DB query in production)
    try:
        df = pd.read_csv('inventory_history.csv')
        logging.info(f"Loaded inventory_history.csv with {len(df)} records.")
    except Exception as e:
        logging.error(f"Error loading inventory_history.csv: {e}")
        return {"error": "No historical data found. Please upload inventory_history.csv."}
    from inventory_forecast import train_inventory_forecast_model
    try:
        model = train_inventory_forecast_model(df, product_id)
        logging.info(f"Trained new model for product_id {product_id}.")
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)
        result = forecast[['ds', 'yhat']].tail(periods).to_dict(orient='records')
        logging.info(f"Returning forecast with {len(result)} records.")

        # ML agent logic: if any forecasted quantity < 50, create a replenishment task in Odoo
        threshold = 50
        low_points = [r for r in result if r['yhat'] < threshold]
        if low_points:
            # Get product name from Odoo
            cookies = get_odoo_session()
            url = f"{ODOO_URL}/web/dataset/call_kw/product.product/search_read"
            payload = {
                "params": {
                    "model": "product.product",
                    "method": "search_read",
                    "args": [[['id', '=', product_id]]],
                    "kwargs": {"fields": ["id", "name"]}
                }
            }
            res = requests.post(url, json=payload, cookies=cookies)
            product_name = f"Product {product_id}"
            if res.status_code == 200 and res.json().get("result"):
                product_name = res.json()["result"][0]["name"]
            # Create replenishment task in Odoo
            task_url = f"{ODOO_URL}/web/dataset/call_kw/project.task/create"
            task_payload = {
                "params": {
                    "model": "project.task",
                    "method": "create",
                    "args": [{
                        "name": f"Replenishment needed for {product_name}",
                        "description": f"Forecasted inventory below {threshold} for product {product_name}. Please review and restock."
                    }],
                    "kwargs": {}
                }
            }
            task_res = requests.post(task_url, json=task_payload, cookies=cookies)
            if task_res.status_code == 200 and task_res.json().get('result'):
                logging.info(f"Created replenishment task for product {product_id} in Odoo. Task ID: {task_res.json()['result']}")
            else:
                logging.error(f"Failed to create replenishment task for product {product_id} in Odoo. Status: {task_res.status_code}, Response: {task_res.text}")

        return {"product_id": product_id, "forecast": result}
    except Exception as err:
        logging.error(f"Could not train or predict for product_id {product_id}: {err}")
        return {"error": f"Could not generate forecast for product_id {product_id}."}

# List all products
@app.get("/api/products")
def get_products():
    cookies = get_odoo_session()
    url = f"{ODOO_URL}/web/dataset/call_kw/product.product/search_read"
    payload = {
        "params": {
            "model": "product.product",
            "method": "search_read",
            "args": [[]],
            "kwargs": {
                "fields": ["id", "name", "qty_available", "default_code"]
            }
        }
    }
    res = requests.post(url, json=payload, cookies=cookies)
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail="Odoo API error")
    return res.json().get("result", [])

# Update product quantity
@app.post("/api/products/{product_id}/update-quantity")
async def update_product_quantity(product_id: int, quantity: float = Body(...)):
    cookies = get_odoo_session()
    # Odoo best practice: update stock via stock.quant
    # Find quant for product
    quant_url = f"{ODOO_URL}/web/dataset/call_kw/stock.quant/search_read"
    quant_payload = {
        "params": {
            "model": "stock.quant",
            "method": "search_read",
            "args": [[['product_id', '=', product_id]]],
            "kwargs": {
                "fields": ["id", "product_id", "quantity"]
            }
        }
    }
    quant_res = requests.post(quant_url, json=quant_payload, cookies=cookies)
    if quant_res.status_code != 200 or not quant_res.json().get("result"):
        raise HTTPException(status_code=404, detail="Stock quant not found for product")
    quant = quant_res.json()["result"][0]
    quant_id = quant["id"]
    # Update quant quantity
    update_url = f"{ODOO_URL}/web/dataset/call_kw/stock.quant/write"
    update_payload = {
        "params": {
            "model": "stock.quant",
            "method": "write",
            "args": [[quant_id], {"quantity": quantity}],
            "kwargs": {}
        }
    }
    update_res = requests.post(update_url, json=update_payload, cookies=cookies)
    if update_res.status_code == 200 and update_res.json().get("result"):
        return {"success": True, "product_id": product_id, "quantity": quantity}
    else:
        raise HTTPException(status_code=500, detail="Failed to update quantity")

# Dedicated endpoint for creating a project task
@app.post("/api/create-task")
async def create_task(
    name: str = Body(...),
    description: str = Body("") ,
    date_deadline: str = Body("") ,
    priority: str = Body("1")
):
    cookies = get_odoo_session()
    url = f"{ODOO_URL}/web/dataset/call_kw/project.task/create"
    odoo_priority = '1'
    if priority == 'low':
        odoo_priority = '0'
    elif priority == 'high':
        odoo_priority = '2'
    payload = {
        "params": {
            "model": "project.task",
            "method": "create",
            "args": [{
                "name": name,
                "description": description,
                "date_deadline": date_deadline,
                "priority": odoo_priority
            }],
            "kwargs": {}
        }
    }
    res = requests.post(url, json=payload, cookies=cookies)
    if res.status_code == 200 and res.json().get('result'):
        return {"id": res.json()['result']}
    else:
        raise HTTPException(status_code=500, detail="Failed to create task")

# Minimal health check endpoint
@app.get("/health")
def health():
    return {"status": "ok"}

# Allow direct execution for debugging
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
@app.get("/api/project-tasks/{task_id}")
def get_project_task_by_id(task_id: str = Path(...)):
    cookies = get_odoo_session()
    # If activity, parse id
    if task_id.startswith("activity-"):
        try:
            activity_id = int(task_id.replace("activity-", ""))
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid activity id format")
        activity_url = f"{ODOO_URL}/web/dataset/call_kw/mail.activity/search_read"
        activity_payload = {
            "params": {
                "model": "mail.activity",
                "method": "search_read",
                "args": [[['id', '=', activity_id]], ['id', 'activity_type_id', 'summary', 'date_deadline', 'user_id', 'res_model', 'res_id','res_name']],
                "kwargs": {}
            }
        }
        act_res = requests.post(activity_url, json=activity_payload, cookies=cookies)
        if act_res.status_code == 200:
            act_result = act_res.json().get("result", [])
            if act_result:
                a = act_result[0]
                return {
                    "id": f"activity-{a['id']}",
                    "name": f"Activity: {a.get('summary', '')}",
                    "description": a.get('summary', '') or f"Assigned to: {a.get('user_id', [''])[1] if a.get('user_id') else ''}",
                    "date_deadline": a.get('date_deadline', ''),
                    "priority": '',
                    "stage_id": '',
                    "res_model": a.get('res_model', ''),
                    "res_id": a.get('res_id', ''),
                    "res_name": a.get('res_name', '')
                }
        raise HTTPException(status_code=404, detail="Activity not found")
    # Otherwise, treat as project.task
    try:
        project_task_id = int(task_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid project task id format")
    url = f"{ODOO_URL}/web/dataset/call_kw/project.task/search_read"
    payload = {
        "params": {
            "model": "project.task",
            "method": "search_read",
            "args": [[['id', '=', project_task_id]], ['id', 'name', 'description', 'stage_id', 'date_deadline', 'priority']],
            "kwargs": {}
        }
    }
    res = requests.post(url, json=payload, cookies=cookies)
    if res.status_code == 200:
        result = res.json().get("result", [])
        if result:
            t = result[0]
            desc = t.get('description', '') or ''
            return {
                "id": t.get('id'),
                "name": t.get('name', 'Project Task'),
                "description": desc,
                "date_deadline": t.get('date_deadline', ''),
                "priority": t.get('priority', ''),
                "stage_id": t.get('stage_id', '')
            }
    raise HTTPException(status_code=404, detail="Task not found")

ODOO_URL = "http://localhost:8069"
ODOO_DB = "Enterprise"
ODOO_USERNAME = "anand.krishnan20@harman.com"
ODOO_PASSWORD = "Anandk@1977"

def get_odoo_session():
    url = f"{ODOO_URL}/web/session/authenticate"
    payload = {
        "params": {
            "db": ODOO_DB,
            "login": ODOO_USERNAME,
            "password": ODOO_PASSWORD
        }
    }
    res = requests.post(url, json=payload)
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail="Odoo auth failed")
    cookies = res.cookies.get_dict()
    return cookies

@app.get("/api/project-tasks")
def get_project_tasks():
    cookies = get_odoo_session()
    url = f"{ODOO_URL}/web/dataset/call_kw/project.task/search_read"
    # Get all project tasks
    payload = {
        "params": {
            "model": "project.task",
            "method": "search_read",
            "args": [[]],
            "kwargs": {
                "fields": ["id", "name", "description", "stage_id", "date_deadline", "priority"]
            }
        }
    }
    res = requests.post(url, json=payload, cookies=cookies)
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail="Odoo API error")
    tasks = res.json().get("result", [])
    # Fetch all 'to do' activities from mail.activity
    activity_url = f"{ODOO_URL}/web/dataset/call_kw/mail.activity/search_read"
    activity_payload = {
        "params": {
            "model": "mail.activity",
            "method": "search_read",
            "args": [[], ['id', 'activity_type_id', 'summary', 'date_deadline', 'user_id', 'res_model', 'res_id', 'res_name']],
            "kwargs": {}
        }
    }
    act_res = requests.post(activity_url, json=activity_payload, cookies=cookies)
    activities = []
    if act_res.status_code == 200 and isinstance(act_res.json().get('result', None), list):
        for a in act_res.json()['result']:
            activities.append({
                "id": f"activity-{a['id']}",
                "name": f"Activity: {a.get('summary', '')}",
                "description": f"Assigned to: {a.get('user_id', [''])[1] if a.get('user_id') else ''}",
                "date_deadline": a.get('date_deadline', ''),
                "priority": '',
                "stage_id": '',
                "res_model": a.get('res_model', ''),
                "res_id": a.get('res_id', ''),
                "res_name": a.get('res_name', '')
            })
    # Sort by due date
    def sort_key(t):
        return t.get('date_deadline') or '9999-12-31'
    all_tasks = tasks + activities
    all_tasks = sorted(all_tasks, key=sort_key)
    return all_tasks
@app.post("/api/project-tasks")
async def create_project_task(request: Request):
    body = await request.json()
    cookies = get_odoo_session()
    url = f"{ODOO_URL}/web/dataset/call_kw/project.task/create"
    # Map frontend priority to Odoo values
    odoo_priority = '1'
    if body.get('priority') == 'low':
        odoo_priority = '0'
    elif body.get('priority') == 'high':
        odoo_priority = '2'
    payload = {
        "params": {
            "model": "project.task",
            "method": "create",
            "args": [{
                "name": body.get('name'),
                "description": body.get('description'),
                "date_deadline": body.get('date_deadline'),
                "priority": odoo_priority
            }],
            "kwargs": {}
        }
    }
    res = requests.post(url, json=payload, cookies=cookies)
    if res.status_code == 200 and res.json().get('result'):
        return {"id": res.json()['result']}
    else:
        raise HTTPException(status_code=500, detail="Failed to create task")
