import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dotenv from 'dotenv'


dotenv.config({path: path.resolve(__dirname, '../.env')})
// https://vite.dev/config/
export default defineConfig({
  define:{
   'import.meta.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
  },
  plugins: [react()],
  base: "/",
  preview: {
   port: 80,
   strictPort: true,
  },
  server: {
   port: 80,
   strictPort: true,
   host: true,
   origin: "http://0.0.0.0:8080",
  },
})
