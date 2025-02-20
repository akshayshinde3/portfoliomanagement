// src/components/ProjectForm.js
import React, { useEffect, useState } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject } from '../api';
import { Button, TextField } from '@mui/material';

const ProjectForm = () => {
    const [projectList, setProjectList] = useState([]);
    const [projectData, setProjectData] = useState({
        id: null,
        title: '',
        description: '',
        image: '',
        tags: '',
        github: '',
        dashboard: ''
    });

    useEffect(() => {
        const loadProjects = async () => {
            const { data } = await fetchProjects();
            setProjectList(data);
        };
        loadProjects();
    }, []);

    const handleChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (projectData.id) {
            await updateProject(projectData);
        } else {
            await createProject(projectData);
        }
        setProjectData({ id: null, title: '', description: '', image: '', tags: '', github: '', dashboard: '' });
        const { data } = await fetchProjects();
        setProjectList(data);
    };

    const handleEdit = (proj) => {
        setProjectData(proj);
    };

    const handleDelete = async (id) => {
        await deleteProject(id);
        const { data } = await fetchProjects();
        setProjectList(data);
    };

    return (
        <div>
            <h2>Projects</h2>
            <form onSubmit={handleSubmit}>
                <TextField name="title" label="Title" value={projectData.title} onChange={handleChange} required />
                <TextField name="description" label="Description" value={projectData.description} onChange={handleChange} required />
                <TextField name="image" label="Image URL" value={projectData.image} onChange={handleChange} />
                <TextField name="tags" label="Tags (comma separated)" value={projectData.tags} onChange={handleChange} />
                <TextField name="github" label="GitHub URL" value={projectData.github} onChange={handleChange} />
                <TextField name="dashboard" label="Live Demo URL" value={projectData.dashboard} onChange={handleChange} />
                <Button type="submit">Save</Button>
            </form>
            <ul>
                {projectList.map((proj) => (
                    <li key={proj.id}>
                        {proj.title}
                        <Button onClick={() => handleEdit(proj)}>Edit</Button>
                        <Button onClick={() => handleDelete(proj.id)}>Delete</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectForm;