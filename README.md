# AI Scheduler App 🧠📅

An AI-powered scheduling assistant built with **React**, **Supabase**, **TailwindCSS**, and **Replicate**. This project showcases how automation and modern AI models can be integrated into a clean and usable interface — perfect for productivity tools or booking systems.

![App Screenshot](./screenshot.png)

---

## 🚀 Live Demo

🔗 [Click to View Live App](https://your-app-name.vercel.app)

---

## 🛠️ Tech Stack

- **Frontend:** React + TailwindCSS
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **AI Integration:** Replicate.com (LLaMA, Mistral, etc.)
- **Hosting:** Vercel

---

## 💡 Features

✅ Book meetings and appointments via natural language  
✅ Tailwind-powered modern UI  
✅ Real-time data sync with Supabase  
✅ AI Assistant powered by open-source models via Replicate  
✅ Secure & scalable architecture

---

## 🧠 How It Works

- The user sends a message to the AI assistant
- The message is sent to a hosted LLM via Replicate
- The model returns a response, which may contain scheduling intents
- If detected, the app stores the booking in Supabase
- The app shows your confirmed bookings in a schedule view

---

## 📦 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ai-scheduler-app.git
cd ai-scheduler-app
