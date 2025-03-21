# **KeyMap Project**

## **Overview**

KeyMap is an AI-powered schema management tool that allows users to generate, modify, and store database schemas dynamically. The platform leverages AI to process user prompts and adjust schemas accordingly while maintaining a minimal and focused chat interface.

---

## **Technology Stack**

| Technology                    | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| **React.js**                  | Frontend UI                              |
| **Node.js & Express**         | Backend API                              |
| **MongoDB**                   | NoSQL database for schema storage        |
| **Axios**                     | API calls                                |
| **React Router**              | Navigation management                    |
| **FontAwesome & React Icons** | UI Icons                                 |
| **Google Gemini AI**          | AI model for schema generation & updates |

---

## **Why SQL for Schema Generation?**

Our system generates **SQL schemas** instead of NoSQL for the following reasons:

### **1. Structured and Well-Defined Data**

SQL databases provide a **rigid schema structure**, which is beneficial for applications that require:

- **Strict data integrity** (e.g., banking, healthcare).
- **Relationships between entities** (e.g., Users and Orders).
- **Consistent queries** with well-defined constraints.

### **2. AI Consistency and Predictability**

By generating **SQL schemas**, we ensure the AI:

- Produces **predictable and structured** outputs.
- Avoids issues like **inconsistent document structures** (which are common in NoSQL).
- Returns **schemas that are universally understandable** and widely used.

### **3. Data Integrity and Constraints**

SQL supports **primary keys, foreign keys, unique constraints, and transactions**, ensuring:

- **No duplicate or inconsistent data.**
- **Enforceable relationships** between tables.
- **Atomicity, Consistency, Isolation, and Durability (ACID)** compliance.

### **4. Scalability and Optimization**

Modern SQL databases (PostgreSQL, MySQL) provide:

- **Indexing for fast queries.**
- **Sharding and replication** for scalability.
- **Advanced analytical queries** for reporting and insights.

### **5. Widespread Adoption and Compatibility**

SQL is a **standardized query language**, making it easier to:

- **Integrate with various tools** (BI tools, ORMs, APIs).
- **Migrate across databases** (PostgreSQL, MySQL, SQLite, etc.).
- **Find developers and maintainability** due to its long history.

---

### **Why Not NoSQL?**

While NoSQL databases (MongoDB, Firebase, etc.) offer **flexibility**, they lack:  
**Strong schema enforcement** → Can lead to inconsistent data.  
**Built-in relationships** → Requires extra logic to maintain references.  
**Standardized query language** → Different databases use different syntax.

Thus, **SQL was the best choice for generating schemas where structure, integrity, and relationships matter.**

---

## **Key Features**

### **AI-Powered Schema Updates**

- Users submit a natural language prompt describing the desired schema changes.
- The AI processes the request and updates the schema accordingly.

### **Minimalist Chat Interface**

- Only the last two messages (user & AI response) are displayed.
- Prevents clutter and keeps the conversation focused.

### **Schema Storage & Management**

- Schemas are stored in MongoDB with version history.
- Users can retrieve, modify, and update schemas seamlessly.

---

## AI Integration, Schema Generation, and Storage

### **AI Integration**

We integrated Gemini AI (gemini-2.0-flash) to assist with modifying and generating database schemas dynamically based on user inputs. The AI is prompted with structured instructions to ensure the schema remains valid and consistent.

- When the user submits an update, the system sends a structured prompt to Gemini AI.

- The AI responds with a JSON representation of the updated schema.
- The response is cleaned, validated, and stored in the database.

### **Schema Generation**

The schema consists of:

- Tables (array of objects)
- Columns (each column has a name, type, and optional constraints like primary or foreign keys)

Example AI Prompt:

```txt
Modify the following SQL schema based on user instructions:
- User Request: [User's input]
- Ensure all columns have a valid SQL type.
- Return ONLY a JSON object (no markdown or explanations).
```

The AI then returns a structured schema that follows the required SQL format.

### **Storage Mechanism**

The database schema and project details are stored in MongoDB, using the following structure:

```json
{
  "title": "Project Name",
  "schemaType": "SQL",
  "schemaDefinition": {
    "tables": [
      {
        "name": "Users",
        "columns": [
          { "name": "id", "type": "INTEGER", "primaryKey": true },
          { "name": "email", "type": "VARCHAR(255)" }
        ]
      }
    ]
  },
  "history": [
    { "role": "user", "content": "Add an email field to Users" },
    { "role": "ai", "content": "Schema updated successfully." }
  ]
}
```

## **Project Setup & Installation**

### \*Clone the Repository\*\*

```sh
git clone https://github.com/leoisqualified/keymap.git
cd keymap
```

## **Install Dependencies**

### **Backend & Frontend Setup**

Run the following commands to install the required dependencies:

# Backend

```sh
cd backend
npm install
```

# Frontend

```sh
cd ../frontend
npm install
```

## **Set Up Environment Variables**

### **Create a .env file in the Backend Directory**

Ensure you have the following environment variables configured:

```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

## **Running the project**

### **Start the Backend**

```sh
cd backend
npm start
```

The backend will run on http://localhost:5000

### **Start the Frontend**

```sh
cd frontend
npm run dev
```

The frontend will run on http://localhost:5173

## **Api Endpoints**

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| `GET`  | `/api/projects/:id`        | Fetch a project schema      |
| `PUT`  | `/api/projects/:id/update` | Update a schema via AI      |
| `POST` | `/api/projects`            | Create a new schema project |

## **Testing the API**

You can use Postman or cURL to test API requests.

Example PUT request for schema update:

```json
{
  "prompt": "Add an 'Orders' table with columns OrderID (primary key) and Amount (decimal)."
}
```
