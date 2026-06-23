import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/menus`);
                setMenus(response.data.data);
            } catch (err) {
                setError(err);
                console.error("Menu fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    // Get menu by order position (1-based index)
    const getMenuByOrder = (order) => {
        return menus.find(menu => menu.order === order);
    };

    // Get menu by path
    const getMenuByPath = (path) => {
        return menus.find(menu => menu.path === path);
    };

    return (
        <MenuContext.Provider value={{
            menus,
            loading,
            error,
            getMenuByOrder,
            getMenuByPath
        }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};