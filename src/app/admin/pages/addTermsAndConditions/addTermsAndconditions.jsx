'use client';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamically import JoditEditor for SSR compatibility
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: true });

const TermsAndConditionsPage = () => {
    const editorRef = useRef(null);
    const [formData, setFormData] = useState({
        Title: '',
        description: '',
        Text: '',
    });
    const [termsAndConditions, setTermsAndConditions] = useState(null);
    const [editorContent, setEditorContent] = useState(''); // Track content separately for JoditEditor
    const [isEditorReady, setIsEditorReady] = useState(false);

    // Load JoditEditor once the component is mounted and data is fetched
    useEffect(() => {
        async function fetchTermsAndConditions() {
            try {
                const response = await axios.get('/api/termsandconditions');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const existingTerms = response.data[0];
                    setTermsAndConditions(existingTerms);
                    setFormData({
                        Title: existingTerms.Title || '',
                        description: existingTerms.description || '',
                        Text: existingTerms.Text || '',
                    });
                    setEditorContent(existingTerms.Text || ''); // Set initial content for JoditEditor
                }
            } catch (error) {
                console.error('Error fetching terms and conditions:', error);
            } finally {
                setIsEditorReady(true); // Editor is ready to load
            }
        }
        fetchTermsAndConditions();
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
            if (termsAndConditions && termsAndConditions.id) {
                // Update existing terms and conditions
                await axios.put(`/api/termsandconditions/${termsAndConditions.id}`, formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                // Create new terms and conditions
                const response = await axios.post('/api/termsandconditions', formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
                setTermsAndConditions(response.data);
            }
            alert('Terms and Conditions saved successfully!');
        } catch (error) {
            console.error('Error saving terms and conditions:', error);
            alert('Failed to save terms and conditions.');
        }
    };

    return (
        <div className="p-6 max-w-full mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Terms and Conditions</h1>
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
                        placeholder: 'Start writing your terms and conditions...',
                      }}
                    />
                    )}
                </div>
                <button type="submit" className="w-full mt-4 p-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-800 transition">
                    {termsAndConditions ? 'Update Terms and Conditions' : 'Save Terms and Conditions'}
                </button>
            </form>
        </div>
    );
};

export default TermsAndConditionsPage;
