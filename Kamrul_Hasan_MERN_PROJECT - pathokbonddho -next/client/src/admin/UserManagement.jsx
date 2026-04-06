import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Container, Row, Col, Table, Button, Modal, Form,
    Badge, Spinner, Card
} from 'react-bootstrap';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// All permission sections
const PERMISSION_SECTIONS = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'menu', label: 'Menu' },
    { key: 'heroSection', label: 'Hero Section' },
    { key: 'sections', label: 'Sections' },
    { key: 'articles', label: 'Article' },
    { key: 'tags', label: 'Tags' },
    { key: 'authors', label: 'Author' },
    { key: 'ads', label: 'Ads' },
    { key: 'design', label: 'Design' },
    { key: 'blog', label: 'Blog' },
    { key: 'news', label: 'News Sections' },
    { key: 'gallery', label: 'Photo Gallery' },
    { key: 'songs', label: 'Songs' },
    { key: 'videos', label: 'Videos' },
    { key: 'pageLayout', label: 'PageLayout' },
    { key: 'users', label: 'User Management' },
];

const DEFAULT_PERMISSIONS = {};
PERMISSION_SECTIONS.forEach(s => {
    DEFAULT_PERMISSIONS[s.key] = { view: false, edit: false, delete: false };
});
DEFAULT_PERMISSIONS.dashboard = { view: true, edit: false, delete: false };

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPermModal, setShowPermModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [saving, setSaving] = useState(false);

    // Create form state
    const [createForm, setCreateForm] = useState({
        username: '', email: '', phone: '', password: '',
        role: 'editor', isAdmin: true
    });

    // Edit form state
    const [editForm, setEditForm] = useState({
        username: '', email: '', phone: '', role: '', isActive: true
    });

    // Permissions state
    const [permForm, setPermForm] = useState({ ...DEFAULT_PERMISSIONS });

    // Reset password state
    const [newPassword, setNewPassword] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/users`, { headers });
            setUsers(res.data.users || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ─── CREATE USER ───
    const handleCreate = async () => {
        if (!createForm.username || !createForm.email || !createForm.phone || !createForm.password) {
            toast.error('All fields are required');
            return;
        }
        try {
            setSaving(true);
            await axios.post(`${API_BASE_URL}/api/users`, createForm, { headers });
            toast.success('User created successfully');
            setShowCreateModal(false);
            setCreateForm({ username: '', email: '', phone: '', password: '', role: 'editor', isAdmin: true });
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create user');
        } finally {
            setSaving(false);
        }
    };

    // ─── EDIT USER ───
    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditForm({
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role || 'editor',
            isActive: user.isActive !== false
        });
        setShowEditModal(true);
    };

    const handleEdit = async () => {
        try {
            setSaving(true);
            await axios.put(`${API_BASE_URL}/api/users/${selectedUser.id}`, editForm, { headers });
            toast.success('User updated successfully');
            setShowEditModal(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    // ─── PERMISSIONS ───
    const openPermModal = (user) => {
        setSelectedUser(user);
        const perms = user.permissions || DEFAULT_PERMISSIONS;
        // Merge with defaults so all sections are present
        const merged = {};
        PERMISSION_SECTIONS.forEach(s => {
            merged[s.key] = perms[s.key] || { view: false, edit: false, delete: false };
        });
        setPermForm(merged);
        setShowPermModal(true);
    };

    const togglePerm = (sectionKey, action) => {
        setPermForm(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                [action]: !prev[sectionKey][action]
            }
        }));
    };

    const selectAllPerms = (checked) => {
        const updated = {};
        PERMISSION_SECTIONS.forEach(s => {
            updated[s.key] = { view: checked, edit: checked, delete: checked };
        });
        setPermForm(updated);
    };

    const handleSavePerms = async () => {
        try {
            setSaving(true);
            await axios.put(`${API_BASE_URL}/api/users/${selectedUser.id}`, {
                permissions: permForm
            }, { headers });
            toast.success('Permissions updated successfully');
            setShowPermModal(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update permissions');
        } finally {
            setSaving(false);
        }
    };

    // ─── RESET PASSWORD ───
    const openResetModal = (user) => {
        setSelectedUser(user);
        setNewPassword('');
        setShowResetModal(true);
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 7) {
            toast.error('Password must be at least 7 characters');
            return;
        }
        try {
            setSaving(true);
            await axios.put(`${API_BASE_URL}/api/users/${selectedUser.id}/reset-password`, {
                newPassword
            }, { headers });
            toast.success('Password reset successfully');
            setShowResetModal(false);
            setNewPassword('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setSaving(false);
        }
    };

    // ─── DELETE USER ───
    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            setSaving(true);
            await axios.delete(`${API_BASE_URL}/api/users/${selectedUser.id}`, { headers });
            toast.success('User deleted successfully');
            setShowDeleteModal(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setSaving(false);
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'superadmin': return <Badge bg="danger">Super Admin</Badge>;
            case 'admin': return <Badge bg="primary">Admin</Badge>;
            case 'editor': return <Badge bg="info">Editor</Badge>;
            default: return <Badge bg="secondary">{role || 'N/A'}</Badge>;
        }
    };

    if (loading) {
        return (
            <Container className="py-4 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading users...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            {/* Header */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="fw-bold">
                        <i className="fas fa-users me-2"></i>
                        User Management
                    </h2>
                    <p className="text-muted mb-0">Manage admin users, roles, and permissions</p>
                </Col>
                <Col xs="auto">
                    <Button variant="success" onClick={() => setShowCreateModal(true)}>
                        <i className="fas fa-plus me-2"></i>Create User
                    </Button>
                </Col>
            </Row>

            {/* Users Table */}
            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, idx) => (
                                    <tr key={user.id}>
                                        <td>{idx + 1}</td>
                                        <td className="fw-semibold">{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{getRoleBadge(user.role)}</td>
                                        <td>
                                            {user.isActive !== false ? (
                                                <Badge bg="success">Active</Badge>
                                            ) : (
                                                <Badge bg="danger">Inactive</Badge>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex gap-1 justify-content-center flex-wrap">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    title="Edit User"
                                                    onClick={() => openEditModal(user)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    title="Permissions"
                                                    onClick={() => openPermModal(user)}
                                                    disabled={user.role === 'superadmin'}
                                                >
                                                    <i className="fas fa-shield-alt"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    title="Reset Password"
                                                    onClick={() => openResetModal(user)}
                                                >
                                                    <i className="fas fa-key"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    title="Delete User"
                                                    onClick={() => openDeleteModal(user)}
                                                    disabled={user.role === 'superadmin'}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* ─── CREATE USER MODAL ─── */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title><i className="fas fa-user-plus me-2"></i>Create New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username *</Form.Label>
                            <Form.Control
                                type="text"
                                value={createForm.username}
                                onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                                placeholder="Enter username"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                                type="email"
                                value={createForm.email}
                                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                placeholder="Enter email"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone *</Form.Label>
                            <Form.Control
                                type="text"
                                value={createForm.phone}
                                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                                placeholder="Enter phone number"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password *</Form.Label>
                            <Form.Control
                                type="password"
                                value={createForm.password}
                                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                                placeholder="Min 7 characters"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={createForm.role}
                                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                            >
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleCreate} disabled={saving}>
                        {saving ? <Spinner size="sm" /> : 'Create User'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ─── EDIT USER MODAL ─── */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title><i className="fas fa-user-edit me-2"></i>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={editForm.username}
                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            >
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="switch"
                                id="isActive"
                                label={editForm.isActive ? "Active" : "Inactive"}
                                checked={editForm.isActive}
                                onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleEdit} disabled={saving}>
                        {saving ? <Spinner size="sm" /> : 'Save Changes'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ─── PERMISSIONS MODAL ─── */}
            <Modal show={showPermModal} onHide={() => setShowPermModal(false)} centered size="lg">
                <Modal.Header closeButton className="bg-warning text-dark">
                    <Modal.Title>
                        <i className="fas fa-shield-alt me-2"></i>
                        Permissions — {selectedUser?.username}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <div className="d-flex justify-content-end mb-3">
                        <Button
                            variant="outline-success"
                            size="sm"
                            className="me-2"
                            onClick={() => selectAllPerms(true)}
                        >
                            Select All
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => selectAllPerms(false)}
                        >
                            Deselect All
                        </Button>
                    </div>
                    <Table bordered hover size="sm">
                        <thead className="table-light">
                            <tr>
                                <th>Section</th>
                                <th className="text-center">View</th>
                                <th className="text-center">Edit</th>
                                <th className="text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PERMISSION_SECTIONS.map(section => (
                                <tr key={section.key}>
                                    <td className="fw-semibold">{section.label}</td>
                                    <td className="text-center">
                                        <Form.Check
                                            type="checkbox"
                                            checked={permForm[section.key]?.view || false}
                                            onChange={() => togglePerm(section.key, 'view')}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <Form.Check
                                            type="checkbox"
                                            checked={permForm[section.key]?.edit || false}
                                            onChange={() => togglePerm(section.key, 'edit')}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <Form.Check
                                            type="checkbox"
                                            checked={permForm[section.key]?.delete || false}
                                            onChange={() => togglePerm(section.key, 'delete')}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPermModal(false)}>Cancel</Button>
                    <Button variant="warning" onClick={handleSavePerms} disabled={saving}>
                        {saving ? <Spinner size="sm" /> : 'Save Permissions'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ─── RESET PASSWORD MODAL ─── */}
            <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
                <Modal.Header closeButton className="bg-info text-white">
                    <Modal.Title>
                        <i className="fas fa-key me-2"></i>
                        Reset Password — {selectedUser?.username}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 7 characters"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowResetModal(false)}>Cancel</Button>
                    <Button variant="info" className="text-white" onClick={handleResetPassword} disabled={saving}>
                        {saving ? <Spinner size="sm" /> : 'Reset Password'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ─── DELETE CONFIRMATION MODAL ─── */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title><i className="fas fa-exclamation-triangle me-2"></i>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete <strong>{selectedUser?.username}</strong>?</p>
                    <p className="text-danger small">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete} disabled={saving}>
                        {saving ? <Spinner size="sm" /> : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserManagement;
