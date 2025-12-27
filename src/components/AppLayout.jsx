import React, { useState, useEffect, useCallback } from 'react';
import CheckInScreen from './CheckinScreen';
import InsightsScreen from './InsightsScreen';
import SettingsScreen from './SettingsScreen';
import { fetchProtected, fetchTrackerData, deleteEntry } from '../api';
import { Smile, TrendingUp, User, LayoutDashboard, LogOut } from 'lucide-react'; 

const SCREENS = {
    CHECK_IN: 'CHECK_IN',
    INSIGHTS: 'INSIGHTS',
    SETTINGS: 'SETTINGS',
};


function AppLayout({ token, onLogout }) {
    const [currentScreen, setCurrentScreen] = useState(SCREENS.CHECK_IN);
    const [userData, setUserData] = useState(null);
    const [trackerData, setTrackerData] = useState(null);
    const [loadingTracker, setLoadingTracker] = useState(false);
    

    const loadTrackerData = useCallback(async () => {
        if (!token) return;
        setLoadingTracker(true);
        try {
            const data = await fetchTrackerData(token);
            data.entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setTrackerData(data);
        } catch (err) {
            console.error("Error fetching tracker data:", err);
        } finally {
            setLoadingTracker(false);
        }
    }, [token]);
    
    const loadProtectedData = useCallback(async () => {
        if (!token) return;
        try {
            const user = await fetchProtected('/users/me', 'GET', token);
            setUserData(user);
        } catch (err) {
            console.error("Error fetching user data:", err);
            onLogout();
        }
        await loadTrackerData();
    }, [token, onLogout, loadTrackerData]);

    useEffect(() => {
        loadProtectedData();
    }, [loadProtectedData]);

    const handleDeleteEntry = useCallback(async (entryId) => {
        if (!window.confirm("Are you sure you want to delete this entry?")) return;
        setLoadingTracker(true);
        try {
            await deleteEntry(token, entryId);
            await loadTrackerData();
        } catch (err) {
            console.error("Error deleting entry:", err);
            setLoadingTracker(false);
        }
    }, [token, loadTrackerData]);

    const renderScreen = () => {
        const props = {
            token,
            userData,
            onEntryAdded: loadTrackerData,
            trackerData,
            loading: loadingTracker,
            onDeleteEntry: handleDeleteEntry,
            onLogout,
        };

        switch (currentScreen) {
            case SCREENS.CHECK_IN:
                return <CheckInScreen {...props} userData={userData} />; 
            case SCREENS.INSIGHTS:
                return <InsightsScreen {...props} />;
            case SCREENS.SETTINGS:
                return <SettingsScreen {...props} onLogout={onLogout} />;
            default:
                return <CheckInScreen {...props} />;
        }
    };
    
    const navItems = [
        { key: SCREENS.CHECK_IN, label: 'Check-In', icon: Smile },
        { key: SCREENS.INSIGHTS, label: 'Insights', icon: TrendingUp },
        { key: SCREENS.SETTINGS, label: 'Profile', icon: User },
    ];

    const NavButton = ({ item, isMobile = false }) => {
        const IconComponent = item.icon;
        const isActive = currentScreen === item.key;
        const baseClasses = "flex items-center p-3 rounded-lg transition-all duration-200 w-full";
        const mobileClasses = "flex-col justify-center text-center p-1 w-1/3";

        return (
            <button
                onClick={() => setCurrentScreen(item.key)}
                className={`${baseClasses} ${isMobile ? mobileClasses : 'space-x-3'} 
                    ${isActive 
                        ? 'text-indigo-600 bg-indigo-50 font-semibold' 
                        : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'
                    }`}
            >
                <IconComponent size={isMobile ? 24 : 20} strokeWidth={2} />
                <span className={isMobile ? 'text-xs mt-1' : 'text-sm'}>{item.label}</span>
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 p-4 fixed top-0 bottom-0 z-20 shadow-xl">
                
                <div className="text-2xl font-bold text-indigo-600 mb-8 flex items-center space-x-2">
                    <LayoutDashboard size={24} /> 
                    <span>MoodTracker</span>
                </div>
                
                <nav className="flex flex-col space-y-2 flex-grow">
                    {navItems.map(item => (
                        <NavButton key={item.key} item={item} isMobile={false} />
                    ))}
                </nav>

                <div className="pt-4 border-t border-gray-100">
                    <div className="mb-3 p-3 rounded-lg bg-gray-50">
                        <p className="text-xl font-medium text-gray-700">
                            Hello, <span className="text-indigo-600 font-semibold">{userData?.username || 'User'}</span>!
                        </p>
                    </div>
                    
                    <button
                        onClick={onLogout}
                        className="flex items-center space-x-3 p-3 rounded-lg w-full text-left text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>

            </aside>

            <div className="flex-grow lg:ml-64 flex flex-col items-center pb-16 lg:pb-0"> 
                
                <header className="w-full bg-white shadow-md p-4 flex justify-center items-center sticky top-0 z-10 lg:hidden">
                    <h1 className="text-xl font-bold text-indigo-600">Mental Health App</h1>
                </header>

                <div className="flex-grow w-full max-w-2xl"> 
                    {renderScreen()}
                </div>
            </div>
            
            <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-200 shadow-2xl z-20 lg:hidden">
                <div className="flex justify-around items-center h-16">
                    {navItems.map(item => (
                        <NavButton key={item.key} item={item} isMobile={true} />
                    ))}
                </div>
            </nav>
        </div>
    );
}

export default AppLayout;