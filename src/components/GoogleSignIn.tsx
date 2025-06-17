import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleSignIn: React.FC = () => {
    const { currentUser, loading, signOut } = useAuth();
    const navigate = useNavigate();

    const handleAuth = async () => {
        if (currentUser) {
            await signOut();
        } else {
            navigate('/signin');
        }
    }; if (loading) {
        return (
            <button
                disabled
                className="flex items-center gap-2 px-5 py-1.5 rounded-full glass-effect text-white transition-all duration-300 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
                <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-indigo-200 animate-spin"></div>
                <span className="text-sm bg-gradient-to-r from-indigo-200/50 to-blue-100/50 bg-clip-text text-transparent">Loading...</span>
            </button>
        );
    } if (currentUser) {
        return (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-full glass-effect border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                {currentUser.photoURL && (
                    <img
                        src={currentUser.photoURL}
                        alt="User"
                        className="w-7 h-7 rounded-full border-2 border-indigo-300/50"
                    />
                )}                <div className="flex flex-col pr-2">
                    <span className="text-xs text-white/80">{currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}</span>
                    <button
                        onClick={handleAuth}
                        className="text-xs bg-gradient-to-r from-indigo-200 to-blue-100 bg-clip-text text-transparent hover:from-indigo-100 hover:to-white transition"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        );
    } return (
        <button
            onClick={handleAuth}
            className="flex items-center justify-center px-5 py-1.5 rounded-full glass-effect text-white hover:bg-white/15 transition-all duration-300 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
        >
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-200 to-blue-100 bg-clip-text text-transparent">Sign in</span>
        </button>
    );
};

export default GoogleSignIn;
