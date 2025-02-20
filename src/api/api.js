// src/api.js
import { supabase } from './supabaseClient';

// Education CRUD Operations
export const fetchEducation = async () => {
    const { data, error } = await supabase.from('education').select('*');
    return { data, error };
};

export const createEducation = async (educationData) => {
    const { data, error } = await supabase.from('education').insert([educationData]);
    return { data, error };
};

export const updateEducation = async (educationData) => {
    const { data, error } = await supabase.from('education').upsert(educationData);
    return { data, error };
};

export const deleteEducation = async (id) => {
    const { data, error } = await supabase.from('education').delete().match({ id });
    return { data, error };
};

// Experiences CRUD Operations
export const fetchExperiences = async () => {
    const { data, error } = await supabase.from('experiences').select('*');
    return { data, error };
};

export const createExperience = async (experienceData) => {
    const { data, error } = await supabase.from('experiences').insert([experienceData]);
    return { data, error };
};

export const updateExperience = async (experienceData) => {
    const { data, error } = await supabase.from('experiences').upsert(experienceData);
    return { data, error };
};

export const deleteExperience = async (id) => {
    const { data, error } = await supabase.from('experiences').delete().match({ id });
    return { data, error };
};

// Projects CRUD Operations
export const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*');
    return { data, error };
};

export const createProject = async (projectData) => {
    const { data, error } = await supabase.from('projects').insert([projectData]);
    return { data, error };
};

export const updateProject = async (projectData) => {
    const { data, error } = await supabase.from('projects').upsert(projectData);
    return { data, error };
};

export const deleteProject = async (id) => {
    const { data, error } = await supabase.from('projects').delete().match({ id });
    return { data, error };
};

// Skills CRUD Operations
export const fetchSkills = async () => {
    const { data, error } = await supabase.from('skills').select('*');
    return { data, error };
};

export const createSkill = async (skillData) => {
    const { data, error } = await supabase.from('skills').insert([skillData]);
    return { data, error };
};

export const updateSkill = async (skillData) => {
    const { data, error } = await supabase.from('skills').upsert(skillData);
    return { data, error };
};

export const deleteSkill = async (id) => {
    const { data, error } = await supabase.from('skills').delete().match({ id });
    return { data, error };
};

// Skill Categories CRUD Operations
export const fetchSkillCategories = async () => {
    const { data, error } = await supabase.from('skill_categories').select('*');
    return { data, error };
};

export const createSkillCategory = async (categoryData) => {
    const { data, error } = await supabase.from('skill_categories').insert([categoryData]);
    return { data, error };
};

export const updateSkillCategory = async (categoryData) => {
    const { data, error } = await supabase.from('skill_categories').upsert(categoryData);
    return { data, error };
};

export const deleteSkillCategory = async (id) => {
    const { data, error } = await supabase.from('skill_categories').delete().match({ id });
    return { data, error };
};