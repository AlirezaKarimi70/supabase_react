

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
    setSession(currentSession.data.session);
  }
  const logout = async () => {
    supabase.auth.signOut();
  }
  useEffect(() => {
    fetchSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, "Session:", session);
      setSession(session);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [])

  return (
    <>
      {
        session ? (
          <>
            <button onClick={logout}>Logout</button>
            <TaskManager session={session} />
          </>

        ) :
          (<Auth />)

      }



    </>

  )

}
export default App
