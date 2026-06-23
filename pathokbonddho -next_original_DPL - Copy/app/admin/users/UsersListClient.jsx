'use client';

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Badge, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from "@/app/lib/api";
import useSWR, { mutate } from 'swr';
import { fetcher } from "@/app/lib/swr-config";

const PERMISSION_SECTIONS = [
    { key: 'dashboard', label: 'Dashboard' }, { key: 'menu', label: 'Menu' },
    { key: 'heroSection', label: 'Hero Section' }, { key: 'sections', label: 'Sections' },
    { key: 'articles', label: 'Article' }, { key: 'tags', label: 'Tags' },
    { key: 'authors', label: 'Author' }, { key: 'ads', label: 'Ads' },
    { key: 'design', label: 'Design' }, { key: 'blog', label: 'Blog' },
    { key: 'news', label: 'News Sections' }, { key: 'gallery', label: 'Photo Gallery' },
    { key: 'songs', label: 'Songs' }, { key: 'videos', label: 'Videos' },
    { key: 'pageLayout', label: 'PageLayout' }, { key: 'users', label: 'User Management' },
];

const DEFAULT_PERMISSIONS = {};
PERMISSION_SECTIONS.forEach(s => { DEFAULT_PERMISSIONS[s.key] = { view: false, edit: false, delete: false }; });
DEFAULT_PERMISSIONS.dashboard = { view: true, edit: false, delete: false };

const UsersListClient = ({ initialUsers, isAdmin, isSuperAdmin }) => {
    const swrKey = isAdmin ? '/users' : null;
    const { data: swrData, error, isLoading: loading } = useSWR(swrKey, fetcher, {
        fallbackData: { users: initialUsers },
        keepPreviousData: true
    });

    const users = swrData?.users || [];
    const [saving, setSaving] = useState(false);
    const [modals, setModals] = useState({ create: false, edit: false, perm: false, reset: false, delete: false });
    const [selectedUser, setSelectedUser] = useState(null);
    const [forms, setForms] = useState({ 
        create: { username: '', email: '', phone: '', password: '', role: 'editor', isAdmin: true },
        edit: { username: '', email: '', phone: '', role: 'editor', isActive: true },
        perm: { ...DEFAULT_PERMISSIONS },
        reset: ''
    });

    const refreshData = () => mutate(swrKey);

    const handleAction = async (type, payload) => {
        setSaving(true);
        try {
            if (type === 'create') await api.post('/users', payload);
            else if (type === 'edit') await api.put(`/users/${selectedUser.id}`, payload);
            else if (type === 'perm') await api.put(`/users/${selectedUser.id}`, { permissions: payload });
            else if (type === 'reset') await api.put(`/users/${selectedUser.id}/reset-password`, { newPassword: payload });
            else if (type === 'delete') await api.delete(`/users/${selectedUser.id}`);
            
            toast.success("Success");
            setModals({ create: false, edit: false, perm: false, reset: false, delete: false });
            refreshData();
        } catch (err) { toast.error(err.response?.data?.message || "Operation failed"); }
        finally { setSaving(false); }
    };

    if (!isAdmin) return <div className="p-4 text-center"><h4>Access Denied</h4></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>User Management</h4>
                <Button variant="success" onClick={() => setModals({ ...modals, create: true })}>+ Create User</Button>
            </div>

            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="table-dark">
                            <tr><th>#</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th className="text-center">Actions</th></tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <tr key={u.id}>
                                    <td>{i + 1}</td>
                                    <td className="fw-bold">{u.username}</td>
                                    <td>{u.email}</td>
                                    <td><Badge bg={u.role === 'superadmin' ? 'danger' : u.role === 'admin' ? 'primary' : 'info'}>{u.role}</Badge></td>
                                    <td><Badge bg={u.isActive !== false ? 'success' : 'secondary'}>{u.isActive !== false ? 'Active' : 'Inactive'}</Badge></td>
                                    <td className="text-center">
                                        <div className="btn-group">
                                            <Button size="sm" variant="outline-primary" onClick={() => { setSelectedUser(u); setForms({ ...forms, edit: { username: u.username, email: u.email, phone: u.phone, role: u.role || 'editor', isActive: u.isActive !== false } }); setModals({ ...modals, edit: true }); }}>Edit</Button>
                                            <Button size="sm" variant="outline-warning" disabled={u.role === 'superadmin'} onClick={() => { setSelectedUser(u); setForms({ ...forms, perm: u.permissions || DEFAULT_PERMISSIONS }); setModals({ ...modals, perm: true }); }}>Perms</Button>
                                            <Button size="sm" variant="outline-info" onClick={() => { setSelectedUser(u); setForms({ ...forms, reset: '' }); setModals({ ...modals, reset: true }); }}>Key</Button>
                                            <Button size="sm" variant="outline-danger" disabled={u.role === 'superadmin'} onClick={() => { setSelectedUser(u); setModals({ ...modals, delete: true }); }}>Del</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">No users found</td></tr>}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modals remain same as original but logic is simplified */}
            <Modal show={modals.create} onHide={() => setModals({ ...modals, create: false })} centered>
                <Modal.Header closeButton><Modal.Title>Create User</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-2"><Form.Label>Username</Form.Label><Form.Control value={forms.create.username} onChange={e => setForms({ ...forms, create: { ...forms.create, username: e.target.value } })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Email</Form.Label><Form.Control value={forms.create.email} onChange={e => setForms({ ...forms, create: { ...forms.create, email: e.target.value } })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Phone</Form.Label><Form.Control value={forms.create.phone} onChange={e => setForms({ ...forms, create: { ...forms.create, phone: e.target.value } })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Password</Form.Label><Form.Control type="password" value={forms.create.password} onChange={e => setForms({ ...forms, create: { ...forms.create, password: e.target.value } })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Role</Form.Label><Form.Select value={forms.create.role} onChange={e => setForms({ ...forms, create: { ...forms.create, role: e.target.value } })}><option value="editor">Editor</option><option value="admin">Admin</option><option value="superadmin">Superadmin</option></Form.Select></Form.Group>
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setModals({ ...modals, create: false })}>Cancel</Button><Button onClick={() => handleAction('create', forms.create)} disabled={saving}>Create</Button></Modal.Footer>
            </Modal>

            <Modal show={modals.edit} onHide={() => setModals({ ...modals, edit: false })} centered>
                <Modal.Header closeButton><Modal.Title>Edit User</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-2"><Form.Label>Username</Form.Label><Form.Control value={forms.edit.username} onChange={e => setForms({ ...forms, edit: { ...forms.edit, username: e.target.value } })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Role</Form.Label><Form.Select value={forms.edit.role} onChange={e => setForms({ ...forms, edit: { ...forms.edit, role: e.target.value } })}><option value="editor">Editor</option><option value="admin">Admin</option><option value="superadmin">Superadmin</option></Form.Select></Form.Group>
                    <Form.Check type="switch" label="Active" checked={forms.edit.isActive} onChange={e => setForms({ ...forms, edit: { ...forms.edit, isActive: e.target.checked } })} />
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setModals({ ...modals, edit: false })}>Cancel</Button><Button onClick={() => handleAction('edit', forms.edit)} disabled={saving}>Save</Button></Modal.Footer>
            </Modal>

            <Modal show={modals.perm} onHide={() => setModals({ ...modals, perm: false })} size="lg">
                <Modal.Header closeButton><Modal.Title>Permissions: {selectedUser?.username}</Modal.Title></Modal.Header>
                <Modal.Body style={{maxHeight: '60vh', overflowY: 'auto'}}>
                    <Table bordered size="sm"><thead><tr><th>Section</th><th>View</th><th>Edit</th><th>Del</th></tr></thead>
                        <tbody>{PERMISSION_SECTIONS.map(s => (<tr key={s.key}><td>{s.label}</td>
                            <td><Form.Check checked={forms.perm[s.key]?.view} onChange={() => setForms({...forms, perm: {...forms.perm, [s.key]: {...forms.perm[s.key], view: !forms.perm[s.key]?.view}}})}/></td>
                            <td><Form.Check checked={forms.perm[s.key]?.edit} onChange={() => setForms({...forms, perm: {...forms.perm, [s.key]: {...forms.perm[s.key], edit: !forms.perm[s.key]?.edit}}})}/></td>
                            <td><Form.Check checked={forms.perm[s.key]?.delete} onChange={() => setForms({...forms, perm: {...forms.perm, [s.key]: {...forms.perm[s.key], delete: !forms.perm[s.key]?.delete}}})}/></td></tr>))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer><Button variant="warning" onClick={() => handleAction('perm', forms.perm)} disabled={saving}>Save Permissions</Button></Modal.Footer>
            </Modal>

            <Modal show={modals.reset} onHide={() => setModals({ ...modals, reset: false })} centered>
                <Modal.Header closeButton><Modal.Title>Reset Password</Modal.Title></Modal.Header>
                <Modal.Body><Form.Control type="password" placeholder="New Password" value={forms.reset} onChange={e => setForms({ ...forms, reset: e.target.value })} /></Modal.Body>
                <Modal.Footer><Button onClick={() => handleAction('reset', forms.reset)} disabled={saving}>Reset</Button></Modal.Footer>
            </Modal>

            <Modal show={modals.delete} onHide={() => setModals({ ...modals, delete: false })} centered>
                <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
                <Modal.Body>Are you sure you want to delete <strong>{selectedUser?.username}</strong>?</Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setModals({ ...modals, delete: false })}>Cancel</Button><Button variant="danger" onClick={() => handleAction('delete')} disabled={saving}>Delete</Button></Modal.Footer>
            </Modal>
        </div>
    );
};

export default UsersListClient;
