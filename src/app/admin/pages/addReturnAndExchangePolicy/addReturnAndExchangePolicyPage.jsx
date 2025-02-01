'use client';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamically import JoditEditor for SSR compatibility
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: true });

const ReturnAndExchangePolicy = () => {
    const editorRef = useRef(null);
    const [formData, setFormData] = useState({
        Title: '',
        description: '',
        Text: '',
    });
    const [returnAndExchangePolicy, setReturnAndExchangePolicy] = useState(null);
    const [editorContent, setEditorContent] = useState(''); // Track content separately for JoditEditor
    const [isEditorReady, setIsEditorReady] = useState(false);

    // Load JoditEditor once the component is mounted and data is fetched
    useEffect(() => {
        async function fetchReturnAndExchangePolicy() {
            try {
                const response = await axios.get('/api/returnandexchangepolicy');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const existingPolicy = response.data[0];
                    setReturnAndExchangePolicy(existingPolicy);
                    setFormData({
                        Title: existingPolicy.Title || '',
                        description: existingPolicy.description || '',
                        Text: existingPolicy.Text || '',
                    });
                    setEditorContent(existingPolicy.Text || ''); // Set initial content for JoditEditor
                }
            } catch (error) {
                console.error('Error fetching return and exchange policy:', error);
            } finally {
                setIsEditorReady(true); // Editor is ready to load
            }
        }
        fetchReturnAndExchangePolicy();
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
            if (returnAndExchangePolicy && returnAndExchangePolicy.id) {
                // Update existing return and exchange policy
                await axios.put(`/api/returnandexchangepolicy/${returnAndExchangePolicy.id}`, formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                // Create new return and exchange policy
                const response = await axios.post('/api/returnandexchangepolicy', formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
                setReturnAndExchangePolicy(response.data);
            }
            alert('Return and exchange policy saved successfully!');
        } catch (error) {
            console.error('Error saving return and exchange policy:', error);
            alert('Failed to save return and exchange policy.');
        }
    };

    return (
        <div className="p-6 max-w-full mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Return and Exchange Policy</h1>
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
                        placeholder: 'Start writing your return and exchange policy...',
                      }}
                    />
                    )}
                </div>
                <button type="submit" className="w-full mt-4 p-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-800 transition">
                    {returnAndExchangePolicy ? 'Update Return and Exchange Policy' : 'Save Return and Exchange Policy'}
                </button>
            </form>
        </div>
    );
};

export default ReturnAndExchangePolicy;
