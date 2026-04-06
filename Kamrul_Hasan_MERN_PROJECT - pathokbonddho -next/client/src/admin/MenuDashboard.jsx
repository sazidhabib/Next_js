import React, { useEffect, useState } from "react";
import { Button, Table, Spinner, Badge, Dropdown, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import MenuFormModal from "./MenuFormModal";
import ConfirmationModal from "./ConfirmationModal";
import axios from "axios";
import { useAuth } from "../store/auth";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/menus`;

const MenuDashboard = () => {
    const [menus, setMenus] = useState([]);
    const [parentMenus, setParentMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [editMenu, setEditMenu] = useState(null);
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState(null);
    const [viewFormat, setViewFormat] = useState('flat'); // 'flat' or 'tree'
    const [activeOnly, setActiveOnly] = useState(false);

    const { token } = useAuth();

    const fetchMenus = async () => {
        setLoading(true);
        try {
            const params = {
                format: viewFormat,
                activeOnly: activeOnly
            };

            console.log('🔄 Fetching menus from:', API_URL);
            console.log('With params:', params);
            console.log('Full URL:', `${API_URL}?format=${viewFormat}&activeOnly=${activeOnly}`);

            const res = await axios.get(API_URL, { params });

            console.log('📦 Full API Response:', res);
            console.log('📦 Response status:', res.status);
            console.log('📦 Response headers:', res.headers);
            console.log('📦 Response data:', res.data);

            // Direct check
            if (Array.isArray(res.data)) {
                console.log('Response is a direct array');
                setMenus(res.data);
            } else if (res.data && res.data.data) {
                console.log('Response has data property');
                setMenus(res.data.data);
            } else {
                console.log('Unexpected response structure');
                setMenus([]);
            }

        } catch (err) {
            console.error('❌ Fetch error:', {
                message: err.message,
                code: err.code,
                response: err.response?.data,
                status: err.response?.status,
                config: {
                    url: err.config?.url,
                    method: err.config?.method
                }
            });
            toast.error(`Failed to fetch menus: ${err.message}`);
            setMenus([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch parent menus for dropdown
    const fetchParentMenus = async () => {
        try {
            const res = await axios.get(`${API_URL}/parents`);
            console.log('Parent menus response:', res.data);

            // Check if response has data property
            if (res.data.success && res.data.data) {
                const parentData = Array.isArray(res.data.data) ? res.data.data : [];
                setParentMenus(parentData);
                console.log('Parent menus set:', parentData.length, 'items');
            } else {
                console.warn('Unexpected parent menus response:', res.data);
                setParentMenus([]);
            }
        } catch (err) {
            console.error("Failed to fetch parent menus:", err);
            toast.error("Failed to load parent menus");
            setParentMenus([]);
        }
    };

    useEffect(() => {
        fetchMenus();
        fetchParentMenus();
    }, [viewFormat, activeOnly]);

    const handleMenuSubmit = async (menuData) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (editMenu) {
                await axios.patch(`${API_URL}/${editMenu.id}`, menuData, config);
                toast.success("Menu updated successfully");
            } else {
                await axios.post(API_URL, menuData, config);
                toast.success("Menu created successfully");
            }
            setModalShow(false);
            setEditMenu(null);
            fetchMenus();
            fetchParentMenus();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
            console.error("Submit error:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/${menuToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Menu deleted successfully");
            setConfirmModalShow(false);
            setMenuToDelete(null);
            fetchMenus();
            fetchParentMenus();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete menu");
            console.error("Delete error:", err);
        }
    };

    const toggleMenuStatus = async (menuId, currentStatus) => {
        try {
            await axios.patch(`${API_URL}/${menuId}`,
                { isActive: !currentStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success(`Menu ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            fetchMenus();
        } catch (err) {
            toast.error("Failed to update menu status");
            console.error("Status update error:", err);
        }
    };

    const renderMenuTree = (menuList, level = 0) => {
        return menuList.map((menu) => (
            <React.Fragment key={menu.id}>
                <tr>
                    <td>
                        <div style={{ paddingLeft: `${level * 30}px` }}>
                            {level > 0 && '↳ '}{menu.name}
                        </div>
                    </td>
                    <td>{menu.path}</td>
                    <td>{menu.order}</td>
                    <td>
                        <Badge bg={menu.isActive ? "success" : "secondary"}>
                            {menu.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </td>
                    <td>{menu.level}</td>
                    <td>{menu.parent?.name || "—"}</td>
                    <td>
                        <div className="d-flex gap-1">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => { setEditMenu(menu); setModalShow(true); }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant={menu.isActive ? "outline-warning" : "outline-success"}
                                size="sm"
                                onClick={() => toggleMenuStatus(menu.id, menu.isActive)}
                            >
                                {menu.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => { setMenuToDelete(menu.id); setConfirmModalShow(true); }}
                            >
                                Delete
                            </Button>
                        </div>
                    </td>
                </tr>
                {menu.children && renderMenuTree(menu.children, level + 1)}
            </React.Fragment>
        ));
    };

    return (
        <div className="container custom-font-initial mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Menu Dashboard</h4>
                <Button onClick={() => { setEditMenu(null); setModalShow(true); }}>
                    + Add Menu
                </Button>
            </div>

            {/* View Controls */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="d-flex gap-2 align-items-center">
                        <label>View Format:</label>
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                                {viewFormat === 'flat' ? 'Flat List' : 'Tree View'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={() => setViewFormat('flat')}
                                    active={viewFormat === 'flat'}
                                >
                                    Flat List
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => setViewFormat('tree')}
                                    active={viewFormat === 'tree'}
                                >
                                    Tree View
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Form.Check
                            type="switch"
                            id="active-only"
                            label="Active Only"
                            checked={activeOnly}
                            onChange={(e) => setActiveOnly(e.target.checked)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : (
                <Table striped bordered hover responsive>

                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Path</th>
                            <th>Order</th>
                            <th>Status</th>
                            <th>Level</th>
                            <th>Parent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viewFormat === 'tree' ? (
                            renderMenuTree(menus)
                        ) : (
                            menus.map((menu) => (
                                <tr key={menu.id}>
                                    <td>{menu.name}</td>
                                    <td>{menu.path}</td>
                                    <td>{menu.order}</td>
                                    <td>
                                        <Badge bg={menu.isActive ? "success" : "secondary"}>
                                            {menu.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td>{menu.level}</td>
                                    <td>{menu.parent?.name || "—"}</td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => { setEditMenu(menu); setModalShow(true); }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant={menu.isActive ? "outline-warning" : "outline-success"}
                                                size="sm"
                                                onClick={() => toggleMenuStatus(menu.id, menu.isActive)}
                                            >
                                                {menu.isActive ? "Deactivate" : "Activate"}
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => { setMenuToDelete(menu.id); setConfirmModalShow(true); }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            {/* Empty State */}
            {!loading && menus.length === 0 && (
                <div className="text-center py-4">
                    <p className="text-muted">No menus found. Create your first menu!</p>
                </div>
            )}

            {/* Modals */}
            <MenuFormModal
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    setEditMenu(null);
                }}
                onSubmit={handleMenuSubmit}
                editMenu={editMenu}
                parentMenus={parentMenus}
            />

            <ConfirmationModal
                show={confirmModalShow}
                onHide={() => {
                    setConfirmModalShow(false);
                    setMenuToDelete(null);
                }}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this menu? This action cannot be undone."
            />
        </div>
    );
};

export default MenuDashboard;