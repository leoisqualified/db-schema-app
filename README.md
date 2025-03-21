# **KeyMap Project** 🚀

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

## **Why NoSQL?** 🛢️

We chose **MongoDB (NoSQL)** for schema storage due to:

✅ **Flexible Structure** – Allows dynamic schema updates without migrations.  
✅ **Scalability** – Can handle a growing number of schema modifications.  
✅ **Ease of Use** – JSON-based storage aligns well with AI-generated schema formats.

---

## **Key Features**

### 🎯 **AI-Powered Schema Updates**

- Users submit a natural language prompt describing the desired schema changes.
- The AI processes the request and updates the schema accordingly.

### 💬 **Minimalist Chat Interface**

- Only the last two messages (user & AI response) are displayed.
- Prevents clutter and keeps the conversation focused.

### 🏗️ **Schema Storage & Management**

- Schemas are stored in MongoDB with version history.
- Users can retrieve, modify, and update schemas seamlessly.

---

## **Project Setup & Installation**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/leoisqualified/keymap.git
cd keymap
```

## **Install Dependencies**

### **2️⃣ Backend & Frontend Setup**

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

### **3️⃣ Create a .env file in the Backend Directory**

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
