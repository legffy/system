import { supabase } from "../supabase-client";
import * as express from 'express';
import { Request, Response } from 'express';

const getUsers = async (req: Request, res: Response) => {
    const { data, error } = await supabase.from('users').select();
    if (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
        return;
    } else {
        console.log('Users:', data);
        res.status(200).json(data);
    }
}
const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('profiles').select().eq('id', id).single();
    if (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
        return;
    }
    console.log('User:', data);
    res.status(200).json(data);
};
const insertUser = async (req: Request, res: Response) => {
    console.log('Inserting user:', req.body);
    const { data, error } = await supabase.from('users').insert({
        id: req.body.id,
        username: req.body.username,
    });
    if (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ error: 'Failed to insert user' });
        return;
    } else {
        console.log('Inserted user:', data);
        res.status(201).json(data);
    }
}


export { getUsers, insertUser, getUserById };