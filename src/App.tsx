
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import TaskManager from './task-manager'
import Auth from './auth'
import { supabase } from './lib/supabase-client'
import { useEffect, useState } from 'react'


function App() {
  const [session, setSession] = useState<any>(null);
  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    console.log("Current Session:", currentSession);
    setSession(currentSession.data);
  }
  useEffect(() => {
    fetchSession();

  }, [])
  return (
    <>
      <TaskManager />

      <Auth />
    </>

  )

}
export default App
