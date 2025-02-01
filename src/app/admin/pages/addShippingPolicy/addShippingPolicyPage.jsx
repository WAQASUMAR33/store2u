'use client';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamically import JoditEditor for SSR compatibility
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: true });

const ShippingPolicyPage = () => {
    const editorRef = useRef(null);
    const [formData, setFormData] = useState({
        Title: '',
        description: '',
        Text: '',
    });
    const [shippingPolicy, setShippingPolicy] = useState(null);
    const [editorContent, setEditorContent] = useState(''); // Track content separately for JoditEditor
    const [isEditorReady, setIsEditorReady] = useState(false);

    // Load JoditEditor once the component is mounted and data is fetched
    useEffect(() => {
        async function fetchShippingPolicy() {
            try {
                const response = await axios.get('/api/shippingpolicy');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const existingPolicy = response.data[0];
                    setShippingPolicy(existingPolicy);
                    setFormData({
                        Title: existingPolicy.Title || '',
                        description: existingPolicy.description || '',
                        Text: existingPolicy.Text || '',
                    });
                    setEditorContent(existingPolicy.Text || ''); // Set initial content for JoditEditor
                }
            } catch (error) {
                console.error('Error fetching shipping policy:', error);
            } finally {
                setIsEditorReady(true); // Editor is ready to load
            }
        }
        fetchShippingPolicy();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTextChange = (content) => {
        setFormData({ ...formData, Text: content });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (shippingPolicy && shippingPolicy.id) {
                // Update existing shipping policy
                await axios.put(`/api/shippingpolicy/${shippingPolicy.id}`, formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                // Create new shipping policy
                const response = await axios.post('/api/shippingpolicy', formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
                setShippingPolicy(response.data);
            }
            alert('Shipping policy saved successfully!');
        } catch (error) {
            console.error('Error saving shipping policy:', error);
            alert('Failed to save shipping policy.');
        }
    };

    return (
        <div className="p-6 max-w-full mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Shipping Policy</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-600 font-medium">Title:</label>
                    <input
                        type="text"
                        name="Title"
                        value={formData.Title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Text:</label>
                    {isEditorReady && (
                      <JoditEditor
                      ref={editorRef}
                      value={editorContent}
                      onChange={handleTextChange}
                      config={{
                        readonly: false,
                        placeholder: 'Start writing your shipping policy...',
                      }}
                    />
                    )}
                </div>
                <button type="submit" className="w-full mt-4 p-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-800 transition">
                    {shippingPolicy ? 'Update Shipping Policy' : 'Save Shipping Policy'}
                </button>
            </form>
        </div>
    );
};

export default ShippingPolicyPage;
