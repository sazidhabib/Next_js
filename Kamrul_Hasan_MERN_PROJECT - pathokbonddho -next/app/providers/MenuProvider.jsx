'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/app/lib/api';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMenus = async () => {
        try {
            const response = await api.get('/menus');
            setMenus(response.data.data || response.data || []);
        } catch (error) {
            console.error('Error fetching menus:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const getMenuByOrder = (order) => menus.find(m => m.order === order) || {};

    return (
        <MenuContext.Provider value={{ menus, loading, fetchMenus, getMenuByOrder }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => useContext(MenuContext);
