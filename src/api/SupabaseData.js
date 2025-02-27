import { supabase } from "../config/supabase";

// Bio API
export const bioApi = {
  fetch: async () => {
    const { data, error } = await supabase.from("bio").select("*").single();
    if (error) throw error;
    return data;
  },

  update: async (bioData) => {
    const { error } = await supabase.from("bio").upsert(bioData);
    if (error) throw error;
  },
};

// Copyright API
export const copyrightApi = {
  fetch: async () => {
    const { data, error } = await supabase
      .from("copyright")
      .select("*")
      .single();
    if (error) throw error;
    return data;
  },

  update: async (copyrightData) => {
    const { error } = await supabase.from("copyright").upsert({
      id: 1,
      ...copyrightData,
    });
    if (error) throw error;
  },
};

// Education API
export const educationApi = {
  fetchAll: async () => {
    const { data, error } = await supabase.from("education").select("*");
    if (error) throw error;
    return data;
  },

  upsert: async (educationData) => {
    const { error } = await supabase.from("education").upsert(educationData);
    if (error) throw error;
  },

  delete: async (id) => {
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) throw error;
  },
};

// Experience API
export const experienceApi = {
  fetchAll: async () => {
    const { data, error } = await supabase.from("experiences").select("*");
    if (error) throw error;
    return data;
  },

  upsert: async (experienceData) => {
    const { error } = await supabase.from("experiences").upsert(experienceData);
    if (error) throw error;
  },

  delete: async (id) => {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) throw error;
  },
};

// Skills API
export const skillsApi = {
  fetchAll: async () => {
    const { data, error } = await supabase
      .from("skills")
      .select(
        `
        *,
        skill_categories (
          id,
          title
        )
      `
      )
      .order("name");
    if (error) throw error;
    return data;
  },

  upsert: async (skillData) => {
    const { error } = await supabase.from("skills").upsert(skillData);
    if (error) throw error;
  },

  delete: async (id) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw error;
  },
};

// Skill Categories API
export const skillCategoriesApi = {
  fetchAll: async () => {
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*")
      .order("title");
    if (error) throw error;
    return data;
  },

  upsert: async (categoryData) => {
    const { error } = await supabase
      .from("skill_categories")
      .upsert(categoryData);
    if (error) throw error;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from("skill_categories")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

// Projects API
export const projectsApi = {
  fetchAll: async () => {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) throw error;
    return data;
  },

  upsert: async (projectData) => {
    const { error } = await supabase.from("projects").upsert(projectData);
    if (error) throw error;
    return error;
  },

  delete: async (id) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  },
};

// Project Members API
export const projectMembersApi = {
  fetchByProject: async (projectId) => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("project_id", projectId);
    if (error) throw error;
    return data;
  },

  upsert: async (memberData) => {
    const { error } = await supabase.from("members").upsert(memberData);
    if (error) throw error;
  },

  delete: async (id) => {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) throw error;
  },
};

// Project Associations API
export const projectAssociationsApi = {
  fetchByProject: async (projectId) => {
    const { data, error } = await supabase
      .from("associations")
      .select("*")
      .eq("project_id", projectId);
    if (error) throw error;
    return data;
  },

  upsert: async (associationData) => {
    const { error } = await supabase
      .from("associations")
      .upsert(associationData);
    if (error) throw error;
  },

  delete: async (id) => {
    const { error } = await supabase.from("associations").delete().eq("id", id);
    if (error) throw error;
  },
};

// Contacts API
export const contactsApi = {
  fetchAll: async () => {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  upsert: async (contactData) => {
    const { error } = await supabase.from("contacts").upsert(contactData);
    if (error) throw error;
  },

  delete: async (id) => {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) throw error;
  },
};
