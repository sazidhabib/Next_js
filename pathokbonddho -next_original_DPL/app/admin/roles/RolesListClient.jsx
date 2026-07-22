'use client';

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from "@/app/lib/api";
import useSWR, { mutate } from 'swr';
import { fetcher } from "@/app/lib/swr-config";

const PERMISSION_SECTIONS = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'menu', label: 'Menu Settings' },
    { key: 'heroSection', label: 'Hero Section' },
    { key: 'sections', label: 'Sections' },
    { key: 'articles', label: 'Articles' },
    { key: 'tags', label: 'Tags List' },
    { key: 'authors', label: 'Authors' },
    { key: 'ads', label: 'Advertisement' },
    { key: 'design', label: 'Design & Theme' },
    { key: 'blog', label: 'Blog' },
    { key: 'news', label: 'News Sections' },
    { key: 'gallery', label: 'Galleries' },
    { key: 'songs', label: 'Songs' },
    { key: 'videos', label: 'Videos' },
    { key: 'pageLayout', label: 'Page Layout' },
    { key: 'users', label: 'User Management' },
];

const DEFAULT_PERMISSIONS = {};
PERMISSION_SECTIONS.forEach(s => { 
    DEFAULT_PERMISSIONS[s.key] = { view: false, edit: false, delete: false }; 
});
DEFAULT_PERMISSIONS.dashboard = { view: true, edit: false, delete: false };

const RolesListClient = ({ initialRoles, isSuperAdmin }) => {
    const swrKey = isSuperAdmin ? '/roles' : null;
    const { data: swrData, error, isLoading: loading } = useSWR(swrKey, fetcher, {
        fallbackData: { roles: initialRoles },
        keepPreviousData: true
    });

    const roles = swrData?.roles || [];
    const [saving, setSaving] = useState(false);
    const [modals, setModals] = useState({ create: false, edit: false, delete: false });
    const [selectedRole, setSelectedRole] = useState(null);
    const [forms, setForms] = useState({
        create: { name: '', permissions: { ...DEFAULT_PERMISSIONS } },
        edit: { name: '', permissions: { ...DEFAULT_PERMISSIONS } }
    });

    const refreshData = () => mutate(swrKey);

    const handleAction = async (type, payload) => {
        setSaving(true);
        try {
            if (type === 'create') {
                await api.post('/roles', payload);
            } else if (type === 'edit') {
                await api.put(`/roles/${selectedRole.id}`, payload);
            } else if (type === 'delete') {
                await api.delete(`/roles/${selectedRole.id}`);
            }
            
            toast.success("Operation successful");
            setModals({ create: false, edit: false, delete: false });
            refreshData();
        } catch (err) { 
            toast.error(err.response?.data?.message || "Operation failed"); 
        } finally { 
            setSaving(false); 
        }
    };

    const handlePermissionChange = (formType, sectionKey, actionKey) => {
        const currentForm = forms[formType];
        const currentSecPerm = currentForm.permissions[sectionKey] || { view: false, edit: false, delete: false };
        
        setForms({
            ...forms,
            [formType]: {
                ...currentForm,
                permissions: {
                    ...currentForm.permissions,
                    [sectionKey]: {
                        ...currentSecPerm,
                        [actionKey]: !currentSecPerm[actionKey]
                    }
                }
            }
        });
    };

    if (!isSuperAdmin) {
        return <div className="p-4 text-center"><h4>Access Denied</h4></div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-slate-800 mb-1">Role Management</h4>
                    <p className="text-muted small mb-0">Create and configure custom permission profiles to assign to admin panel users.</p>
                </div>
                <Button variant="success" onClick={() => {
                    setForms({ ...forms, create: { name: '', permissions: JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)) } });
                    setModals({ ...modals, create: true });
                }}>+ Create Role</Button>
            </div>

            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Role Name</th>
                                <th>Created At</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((r, i) => (
                                <tr key={r.id}>
                                    <td>{i + 1}</td>
                                    <td className="fw-bold text-teal-700">{r.name}</td>
                                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                                    <td className="text-center">
                                        <div className="btn-group">
                                            <Button size="sm" variant="outline-primary" onClick={() => {
                                                setSelectedRole(r);
                                                setForms({
                                                    ...forms,
                                                    edit: {
                                                        name: r.name,
                                                        permissions: JSON.parse(JSON.stringify(r.permissions || DEFAULT_PERMISSIONS))
                                                    }
                                                });
                                                setModals({ ...modals, edit: true });
                                            }}>Edit Perms</Button>
                                            <Button size="sm" variant="outline-danger" disabled={r.name === 'Admin' || r.name === 'Editor'} onClick={() => {
                                                setSelectedRole(r);
                                                setModals({ ...modals, delete: true });
                                            }}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {roles.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">No custom roles found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Create Role Modal */}
            <Modal show={modals.create} onHide={() => setModals({ ...modals, create: false })} size="lg">
                <Modal.Header closeButton><Modal.Title>Create New Role</Modal.Title></Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Role Name</Form.Label>
                        <Form.Control 
                            placeholder="e.g., Content Writer, Moderator" 
                            value={forms.create.name} 
                            onChange={e => setForms({ ...forms, create: { ...forms.create, name: e.target.value } })} 
                        />
                    </Form.Group>
                    
                    <Form.Label className="fw-semibold mb-2">Configure Section Permissions</Form.Label>
                    <Table bordered size="sm" className="mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Section Name</th>
                                <th className="text-center">View</th>
                                <th className="text-center">Edit</th>
                                <th className="text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PERMISSION_SECTIONS.map(s => {
                                const perms = forms.create.permissions[s.key] || { view: false, edit: false, delete: false };
                                return (
                                    <tr key={s.key}>
                                        <td className="align-middle fw-medium text-slate-700">{s.label}</td>
                                        <td className="text-center">
                                            <Form.Check 
                                                checked={!!perms.view} 
                                                onChange={() => handlePermissionChange('create', s.key, 'view')} 
                                            />
                                        </td>
                                        <td className="text-center">
                                            <Form.Check 
                                                checked={!!perms.edit} 
                                                onChange={() => handlePermissionChange('create', s.key, 'edit')} 
                                            />
                                        </td>
                                        <td className="text-center">
                                            <Form.Check 
                                                checked={!!perms.delete} 
                                                onChange={() => handlePermissionChange('create', s.key, 'delete')} 
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModals({ ...modals, create: false })}>Cancel</Button>
                    <Button variant="success" onClick={() => handleAction('create', forms.create)} disabled={saving || !forms.create.name}>Create Role</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Role Modal */}
            <Modal show={modals.edit} onHide={() => setModals({ ...modals, edit: false })} size="lg">
                <Modal.Header closeButton><Modal.Title>Edit Role: {selectedRole?.name}</Modal.Title></Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Role Name</Form.Label>
                        <Form.Control 
                            value={forms.edit.name} 
                            disabled={selectedRole?.name === 'Admin' || selectedRole?.name === 'Editor'}
                            onChange={e => setForms({ ...forms, edit: { ...forms.edit, name: e.target.value } })} 
                        />
                    </Form.Group>
                    
                    <Form.Label className="fw-semibold mb-2">Configure Section Permissions</Form.Label>
                    <Table bordered size="sm" className="mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Section Name</th>
                                <th className="text-center">View</th>
                                <th className="text-center">Edit</th>
                                <th className="text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PERMISSION_SECTIONS.map(s => {
                                const perms = forms.edit.permissions[s.key] || { view: false, edit: false, delete: false };
                                return (
                                    <tr key={s.key}>
                                        <td className="align-middle fw-medium text-slate-700">{s.label}</td>
                                        <td className="text-center">
                                            <Form.Check 
                                                checked={!!perms.view} 
                                                onChange={() => handlePermissionChange('edit', s.key, 'view')} 
                                            />
                                        </td>
                                        <td className="text-center">
                                            <Form.Check 
                                                checked={!!perms.edit} 
                                                onChange={() => handlePermissionChange('edit', s.key, 'edit')} 
                                            />
                                        </td>
                                        <td className="text-center">
                                            <Form.Check 
                                                checked={!!perms.delete} 
                                                onChange={() => handlePermissionChange('edit', s.key, 'delete')} 
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModals({ ...modals, edit: false })}>Cancel</Button>
                    <Button variant="primary" onClick={() => handleAction('edit', forms.edit)} disabled={saving || !forms.edit.name}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={modals.delete} onHide={() => setModals({ ...modals, delete: false })} centered>
                <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the role <strong>{selectedRole?.name}</strong>? 
                    This action cannot be undone and will unassign any users currently in this role.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModals({ ...modals, delete: false })}>Cancel</Button>
                    <Button variant="danger" onClick={() => handleAction('delete')} disabled={saving}>Delete Role</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RolesListClient;
