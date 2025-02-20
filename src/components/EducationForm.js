// src/components/EducationForm.js
import React, { useEffect, useState } from 'react';
import { fetchEducation, createEducation, updateEducation, deleteEducation } from '../api';
import { Button, TextField } from '@mui/material';



const EducationForm = () => {
    const [educationList, setEducationList] = useState([]);
    const [educationData, setEducationData] = useState({
        id: null,
        school: '',
        degree: '',
        date: '',
        grade: '',
        description: '',
        img: ''
    });

    useEffect(() => {
        const loadEducation = async () => {
            const { data } = await fetchEducation();
            setEducationList(data);
        };
        loadEducation();
    }, []);

    const handleChange = (e) => {
        setEducationData({ ...educationData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (educationData.id) {
            await updateEducation(educationData);
        } else {
            await createEducation(educationData);
        }
        setEducationData({ id: null, school: '', degree: '', date: '', grade: '', description: '', img: '' });
        const { data } = await fetchEducation();
        setEducationList(data);
    };

    const handleEdit = (edu) => {
        setEducationData(edu);
    };

    const handleDelete = async (id) => {
        await deleteEducation(id);
        const { data } = await fetchEducation();
        setEducationList(data);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <TextField name="school" label="School" value={educationData.school} onChange={handleChange} />
                <TextField name="degree" label="Degree" value={educationData.degree} onChange={handleChange} />
                <TextField name="date" label="Date" value={educationData.date} onChange={handleChange} />
                <TextField name="grade" label="Grade" value={educationData.grade} onChange={handleChange} />
                <TextField name="description" label="Description" value={educationData.description} onChange={handleChange} />
                <TextField name="img" label="Image URL" value={educationData.img} onChange={handleChange} />
                <Button type="submit">Save</Button>
            </form>
            <ul>
                {educationList.map((edu) => (
                    <li key={edu.id}>
                        {edu.school} - {edu.degree}
                        <Button onClick={() => handleEdit(edu)}>Edit</Button>
                        <Button onClick={() => handleDelete(edu.id)}>Delete</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EducationForm;