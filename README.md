# Nested Tree Tags

## Description
**Nested Tree Tags** is a project that allows users to interact with a nested tree structure through a backend API and a React-based frontend interface. The backend is powered by FastAPI and PostgreSQL, while the frontend is built with React.

## Installation and Setup Instructions

### 1. Clone the Repository
Clone the project repository or download the ZIP file and extract it:
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd <repository-directory>
```

### 2. Backend Setup

#### Navigate to the Backend Directory
```bash
cd backend
```

#### Optional: Set Up a Virtual Environment
To isolate the Python environment and avoid package conflicts:
```bash
# Create a virtual environment
python -m venv env

# Activate the virtual environment
# For Linux/macOS
source env/bin/activate

# For Windows
env\Scripts\activate
```

#### Install Dependencies
Install the required Python packages:
```bash
pip install -r requirements.txt
```

#### Run the Backend Server
Start the FastAPI server:
```bash
uvicorn main:app --reload
```

### 3. Database Setup

#### Database: PostgreSQL with pgAdmin

- **Create a Database**: If you need to use a different table, create a new database in pgAdmin.
- **Update Database URL**: Update the `DATABASE_URL` value in the `main.py` file to reflect your database settings.

#### Option 1: Automatic Table Creation
Specify the table name in the class model in `main.py`. This will automatically create the table when the application starts.

#### Option 2: Manual Table Creation
Alternatively, create the table manually using the following query:
```sql
CREATE TABLE tableaimonk (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    data JSON NOT NULL
);
```

#### Test the Backend
Open the following URL to access the Swagger UI and test the API:
```
http://127.0.0.1:8000/docs
```

#### Sample API Requests

**POST Endpoint:** Add a nested tree structure:
```json
{
  "name": "root", 
  "data": {
    "name": "root",
    "children": [
      {
        "name": "child1",
        "children": [
          { "name": "child1-child1", "data": "c1-c1 Hello" },
          { "name": "child1-child2", "data": "c1-c2 JS" }
        ]
      },
      { "name": "child2", "data": "c2 World" }
    ]
  }
}
```

**PUT Endpoint:** Update the nested tree structure:
```json
{
  "name": "root",   
  "data": {
    "name": "root",
    "children": [
      {
        "name": "child1",
        "children": [
          { "name": "child1-child1", "data": "c1-c1 Hello" },
          { "name": "child1-child2", "data": "c1-c2 JS" }
        ]
      },
      { "name": "child2", "data": "c2 World" }
    ]
  }
}
```
Modify the data structure as needed and test the changes.

### 4. Frontend Setup

#### Navigate to the Frontend Directory
```bash
cd ../frontend
```

#### Install Dependencies
Install the required Node.js packages:
```bash
npm install
```

#### Run the Frontend Application
Start the React application:
```bash
npm start
```

### 5. Application Workflow
1. Post data through the Swagger UI using the sample JSON format.
2. Use the GET endpoint to fetch the data.
3. Load the React application in the browser. If data exists in the database, the tree structure will display. If no data exists, a message indicating "No tree exists" will appear.
4. Post new data using the Swagger UI, then reload the React application to fetch and display the updated tree structure.
5. Add or modify children in the nested tree through the PUT endpoint and observe the changes in the React application.


