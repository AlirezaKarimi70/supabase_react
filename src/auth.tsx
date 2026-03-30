import React, { useState } from 'react'
import { supabase } from './lib/supabase-client';

export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            if (error) {
                console.error("Error signing up:", error.message);
            }
            else {
                console.log("Sign-up successful! Please check your email to confirm your account.");
                console.table(data);
            }


        }
        else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) {
                console.error("Error signing in:", error.message);
            }
            else {
                console.log("Sign-in successful!");
                console.table(data);
            }
        }
    }
    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
            <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
            <form onSubmit={handelSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type='submit'>{isSignUp ? "Sign Up" : "Sign In"}</button>
            </form>
            <p style={{ marginTop: "1rem" }}>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button onClick={() => setIsSignUp(!isSignUp)} style={{ marginLeft: "0.5rem" }}>
                    {isSignUp ? "Sign In" : "Sign Up"}
                </button>
            </p>
        </div>
    )
}   